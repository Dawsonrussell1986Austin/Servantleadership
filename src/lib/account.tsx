/**
 * Optional Sign in with Apple — app-wide account state.
 *
 * Founded needs no account to work; signing in only gives the user a stable
 * identity so their subscription follows them across devices (we alias the
 * RevenueCat customer to the Apple user id). We store nothing but that opaque
 * id and, if the user shares it once, a first name. iOS only — a no-op
 * elsewhere. Everything is dynamically imported so the web bundle never pulls
 * in the native modules.
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
import { getItem, setItem, removeItem } from './storage';

// Kept as the pre-existing key so anyone already signed in stays signed in.
const APPLE_USER_KEY = 'servant.appleUser';

export type Account = { id: string; name: string | null };

type AccountState = {
  ready: boolean;
  /** Sign in with Apple is usable on this device. */
  available: boolean;
  user: Account | null;
  /** Returns true on a completed sign-in, false on cancel/failure. */
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  /** Clears the local identity and detaches the subscription alias. */
  deleteAccount: () => Promise<void>;
};

const AccountContext = createContext<AccountState>({
  ready: false,
  available: false,
  user: null,
  signIn: async () => false,
  signOut: async () => {},
  deleteAccount: async () => {},
});

async function aliasRevenueCat(id: string): Promise<void> {
  try {
    const Purchases = (await import('react-native-purchases')).default;
    await Purchases.logIn(id);
  } catch {
    // Not configured / not native yet — the alias is a nicety, never fatal.
  }
}

async function resetRevenueCat(): Promise<void> {
  try {
    const Purchases = (await import('react-native-purchases')).default;
    await Purchases.logOut();
  } catch {
    // ignore
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [available, setAvailable] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      setUser(await getItem<Account | null>(APPLE_USER_KEY, null));
      setReady(true);
      if (Platform.OS === 'ios') {
        try {
          const AA = await import('expo-apple-authentication');
          setAvailable(await AA.isAvailableAsync());
        } catch {
          setAvailable(false);
        }
      }
    })();
  }, []);

  const signIn = useCallback(async () => {
    if (Platform.OS !== 'ios') return false;
    try {
      const AA = await import('expo-apple-authentication');
      const credential = await AA.signInAsync({
        requestedScopes: [
          AA.AppleAuthenticationScope.FULL_NAME,
          AA.AppleAuthenticationScope.EMAIL,
        ],
      });
      // Name is only returned the first time; keep any we already had.
      const name = credential.fullName?.givenName ?? user?.name ?? null;
      const account: Account = { id: credential.user, name };
      setUser(account);
      await setItem(APPLE_USER_KEY, account);
      await aliasRevenueCat(credential.user);
      return true;
    } catch (e: any) {
      // ERR_REQUEST_CANCELED = the user backed out; anything else, fail quietly.
      return false;
    }
  }, [user]);

  const clear = useCallback(async () => {
    setUser(null);
    await removeItem(APPLE_USER_KEY);
    await resetRevenueCat();
  }, []);

  const value = useMemo<AccountState>(
    () => ({ ready, available, user, signIn, signOut: clear, deleteAccount: clear }),
    [ready, available, user, signIn, clear],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  return useContext(AccountContext);
}
