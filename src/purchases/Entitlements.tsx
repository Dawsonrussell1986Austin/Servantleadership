/**
 * Subscription / entitlement state, backed by RevenueCat on native.
 *
 * Design rules that keep this safe in every environment:
 *  - On web (Platform.OS === 'web') we never touch react-native-purchases — it
 *    is a native module. Web is a preview surface, so everything reads as
 *    unlocked there.
 *  - If no RevenueCat API key is configured yet (expoConfig.extra.revenueCatApiKeyIos),
 *    we treat the user as premium so the app is fully usable BEFORE billing is
 *    wired. Gating only switches on once a real key exists and the customer
 *    has no active entitlement.
 *  - react-native-purchases is imported lazily, so the module is only pulled
 *    in when it can actually run.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const ENTITLEMENT_ID = 'premium';

type PackageLike = {
  identifier: string;
  product: { priceString: string; title: string };
};

type EntitlementState = {
  ready: boolean;
  /** Whether premium content should be unlocked. */
  isPremium: boolean;
  /** True once RevenueCat is actually configured with a key. */
  configured: boolean;
  /** Available purchase packages (empty until configured on native). */
  packages: PackageLike[];
  refresh: () => Promise<void>;
  restore: () => Promise<boolean>;
  purchase: (pkg: PackageLike) => Promise<boolean>;
};

const noop = async () => {};

const EntitlementContext = createContext<EntitlementState>({
  ready: true,
  isPremium: true,
  configured: false,
  packages: [],
  refresh: noop,
  restore: async () => false,
  purchase: async () => false,
});

function apiKey(): string | null {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const key =
    Platform.OS === 'ios'
      ? extra.revenueCatApiKeyIos
      : extra.revenueCatApiKeyAndroid;
  return typeof key === 'string' && key.length > 0 ? key : null;
}

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const configured = Platform.OS !== 'web' && apiKey() != null;

  // Until proven otherwise (configured + no active entitlement) everything is open.
  const [isPremium, setIsPremium] = useState(true);
  const [packages, setPackages] = useState<PackageLike[]>([]);
  const [ready, setReady] = useState(!configured);

  const loadPurchases = useCallback(async () => {
    if (!configured) {
      setIsPremium(true);
      setReady(true);
      return;
    }
    try {
      const Purchases = (await import('react-native-purchases')).default;
      const key = apiKey();
      if (key) Purchases.configure({ apiKey: key });

      const info = await Purchases.getCustomerInfo();
      setIsPremium(info.entitlements.active[ENTITLEMENT_ID] != null);

      try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        if (current?.availablePackages) {
          setPackages(
            current.availablePackages.map((p: any) => ({
              identifier: p.identifier,
              product: {
                priceString: p.product.priceString,
                title: p.product.title,
              },
            })),
          );
        }
      } catch {
        // offerings are optional for unlocking; ignore fetch failures
      }
    } catch {
      // If RevenueCat fails entirely, fail OPEN so the app stays usable.
      setIsPremium(true);
    } finally {
      setReady(true);
    }
  }, [configured]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const restore = useCallback(async () => {
    if (!configured) return false;
    try {
      const Purchases = (await import('react-native-purchases')).default;
      const info = await Purchases.restorePurchases();
      const active = info.entitlements.active[ENTITLEMENT_ID] != null;
      setIsPremium(active);
      return active;
    } catch {
      return false;
    }
  }, [configured]);

  const purchase = useCallback(
    async (pkg: PackageLike) => {
      if (!configured) return false;
      try {
        const Purchases = (await import('react-native-purchases')).default;
        const offerings = await Purchases.getOfferings();
        const native = offerings.current?.availablePackages?.find(
          (p: any) => p.identifier === pkg.identifier,
        );
        if (!native) return false;
        const { customerInfo } = await Purchases.purchasePackage(native);
        const active = customerInfo.entitlements.active[ENTITLEMENT_ID] != null;
        setIsPremium(active);
        return active;
      } catch {
        // user cancellation or store error
        return false;
      }
    },
    [configured],
  );

  const value = useMemo<EntitlementState>(
    () => ({ ready, isPremium, configured, packages, refresh: loadPurchases, restore, purchase }),
    [ready, isPremium, configured, packages, loadPurchases, restore, purchase],
  );

  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement() {
  return useContext(EntitlementContext);
}
