import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';
import { useWide } from '../src/components/Bounded';
import { useEntitlement } from '../src/purchases/Entitlements';

// Warm palette to match the SwiftUI donation design.
const CREAM = '#FBF0E4';
const BROWN = '#8B3A0F';
const INK = '#211D16';
const INK_SOFT = 'rgba(33,29,22,0.55)';

// ⚠️ "Donation" framing on an auto-renewable subscription is risky with Apple
// (3.1.1/3.1.2) unless you're a registered nonprofit — consider "Support".
const FOUNDERS_NOTE =
  'Founded is built by a small team who believe the founder’s day deserves a ' +
  'quiet, Scripture-rooted pause. Your gift keeps it ad-free and growing — new ' +
  'readings, better audio, and room for the next person who needs it. However ' +
  'you give, thank you for holding this up with us.';
const SCRIPTURE =
  '“Remember this: Whoever sows sparingly will also reap sparingly, and whoever ' +
  'sows generously will also reap generously.” — 2 Corinthians 9:6';

/** Per-day amount from the real price, correct across currencies. */
function perDay(price: number | undefined, period: string | undefined): number | null {
  if (price == null) return null;
  const div = period === 'year' ? 365 : period === 'week' ? 7 : period === 'month' ? 30 : 1;
  return price / div;
}
function fmtCurrency(amount: number, currencyCode?: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}
function cadence(period?: string): string {
  return period === 'year' ? 'yearly' : period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : '';
}

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { packages, purchase, restore, configured, mustSubscribe } = useEntitlement();
  const wide = useWide();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // Default to the annual plan (best value) if present, else the first.
  const annualIndex = packages.findIndex((p) => p.product.period === 'year');
  const [chosen, setChosen] = useState(annualIndex >= 0 ? annualIndex : 0);

  const primary = packages[Math.min(chosen, Math.max(0, packages.length - 1))];
  const priceLabel = primary?.product.priceString ?? '';
  const period = primary?.product.period;
  const trial = primary?.product.trialLabel;
  const priceEvery = priceLabel ? `${priceLabel}${period ? `/${period}` : ''}` : '';

  const done = () => {
    if (mustSubscribe || !router.canGoBack()) router.replace('/');
    else router.back();
  };

  const onSubscribe = async () => {
    if (!primary) {
      setMessage('Plans load on the iOS app.');
      return;
    }
    setBusy(true);
    setMessage(null);
    const ok = await purchase(primary);
    setBusy(false);
    if (ok) done();
    else setMessage('That didn’t go through. No charge was made.');
  };

  const onRestore = async () => {
    setBusy(true);
    setMessage(null);
    const ok = await restore();
    setBusy(false);
    if (ok) done();
    else setMessage('No previous purchase found on this account.');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.md,
          width: '100%',
          maxWidth: wide ? 600 : undefined,
          alignSelf: 'center',
          paddingBottom: insets.bottom + 260,
        }}
        showsVerticalScrollIndicator={false}
      >
        {!mustSubscribe && (
          <Pressable
            onPress={done}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={({ pressed }) => [styles.close, pressed && { opacity: 0.5 }]}
          >
            <Ionicons name="close" size={26} color={INK_SOFT} />
          </Pressable>
        )}

        <Text style={styles.title}>Choose your Donation Gift 🎁</Text>

        {/* Plan cards */}
        <View style={styles.cards}>
          {packages.map((p, i) => {
            const selected = i === chosen;
            const pd = perDay(p.product.price, p.product.period);
            const pdText = pd != null ? fmtCurrency(pd, p.product.currencyCode) : null;
            const isYear = p.product.period === 'year';
            return (
              <Pressable
                key={p.identifier}
                onPress={() => setChosen(i)}
                accessibilityRole="button"
                accessibilityLabel={`Choose ${p.product.title}`}
                style={[
                  styles.card,
                  !isYear && styles.cardBordered,
                  selected && styles.cardSelected,
                  isYear && { marginTop: 14 },
                ]}
              >
                {isYear && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>MOST POPULAR</Text>
                  </View>
                )}
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>
                    {isYear ? 'Annual Donation' : 'Weekly Donation'}
                  </Text>
                  <Text style={styles.cardSub}>
                    {p.product.priceString}
                    {cadence(p.product.period) ? ` billed ${cadence(p.product.period)}` : ''}
                  </Text>
                </View>
                {pdText && (
                  <Text style={styles.perDay}>
                    {pdText}
                    <Text style={styles.perDaySuffix}>/day</Text>
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* A Note from the Founders */}
        <View style={styles.note}>
          <Text style={styles.noteHead}>A Note from the Founders</Text>
          <Text style={styles.noteBody}>{FOUNDERS_NOTE}</Text>
          <Text style={styles.noteQuote}>{SCRIPTURE}</Text>
        </View>

        {message && <Text style={styles.message}>{message}</Text>}
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.cancelRow}>
          <Ionicons name="checkmark" size={14} color={INK_SOFT} />
          <Text style={styles.cancelText}>Cancel anytime</Text>
        </View>

        <Pressable
          onPress={onSubscribe}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            wide && { maxWidth: 520 },
            (pressed || busy) && { opacity: 0.9 },
          ]}
        >
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.ctaText}>Continue</Text>
          )}
        </Pressable>

        <Pressable onPress={onRestore} disabled={busy} hitSlop={8}>
          <Text style={styles.restore}>Restore Purchases</Text>
        </Pressable>

        {Platform.OS !== 'web' && priceEvery !== '' && (
          <>
            <Text style={styles.legal}>
              {priceLabel}
              {period ? ` per ${period}` : ''}
              {trial ? `, after your ${trial} trial.` : '.'} Payment is charged to
              your Apple ID at confirmation. The subscription renews automatically
              unless canceled at least 24 hours before the end of the current
              period. Manage or cancel anytime in your App Store settings.
            </Text>
            <View style={styles.legalLinks}>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
                  )
                }
                hitSlop={8}
              >
                <Text style={styles.legalLink}>Terms of Use</Text>
              </Pressable>
              <Text style={styles.legalDot}>·</Text>
              <Pressable onPress={() => router.push('/privacy')} hitSlop={8}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </Pressable>
            </View>
          </>
        )}

        {Platform.OS === 'web' && (
          <Text style={styles.webNote}>Donations are available in the iOS app.</Text>
        )}
        {Platform.OS !== 'web' && !configured && (
          <Text style={styles.webNote}>
            Billing isn’t connected yet — everything is unlocked for now.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREAM },
  close: { alignSelf: 'flex-end', padding: 4, marginBottom: spacing.sm },
  title: {
    fontFamily: fonts.displayExtra,
    fontSize: 28,
    lineHeight: 35,
    color: BROWN,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },

  cards: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardBordered: { borderColor: 'rgba(0,0,0,0.85)' },
  cardSelected: { borderColor: INK },
  badge: {
    position: 'absolute',
    top: -12,
    left: 18,
    backgroundColor: INK,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: '#FFFFFF',
  },
  cardLeft: { flex: 1, paddingRight: spacing.sm },
  cardTitle: { fontFamily: fonts.sansBold, fontSize: 18, color: INK },
  cardSub: { ...type.caption, fontSize: 13, color: INK_SOFT, marginTop: 3 },
  perDay: { fontFamily: fonts.sansExtra, fontSize: 26, color: INK },
  perDaySuffix: { fontFamily: fonts.sansMedium, fontSize: 15, color: INK_SOFT },

  note: { marginTop: spacing.xxl },
  noteHead: { fontFamily: fonts.sansBold, fontSize: 16, color: INK, marginBottom: spacing.sm },
  noteBody: {
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(33,29,22,0.85)',
  },
  noteQuote: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(33,29,22,0.65)',
    marginTop: spacing.md,
  },
  message: { ...type.caption, color: BROWN, marginTop: spacing.lg, textAlign: 'center' },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: CREAM,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
  },
  cancelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.sm },
  cancelText: { ...type.caption, fontSize: 13, color: INK_SOFT, fontFamily: fonts.sansMedium },
  cta: {
    backgroundColor: BROWN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 54,
  },
  ctaText: { fontFamily: fonts.sansBold, fontSize: 17, color: '#FFFFFF' },
  restore: { ...type.caption, color: INK_SOFT, fontFamily: fonts.sansSemibold, marginTop: spacing.md },
  webNote: { ...type.caption, fontSize: 12, color: INK_SOFT, marginTop: spacing.sm, textAlign: 'center' },
  legal: {
    ...type.caption,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(33,29,22,0.45)',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  legalLink: {
    ...type.caption,
    fontSize: 12,
    color: 'rgba(33,29,22,0.7)',
    textDecorationLine: 'underline',
  },
  legalDot: { color: 'rgba(33,29,22,0.35)' },
});
