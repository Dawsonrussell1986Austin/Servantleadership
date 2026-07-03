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
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';
import { useEntitlement } from '../src/purchases/Entitlements';

const BENEFITS: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string }[] = [
  {
    icon: 'library-outline',
    title: 'The full library',
    sub: 'Every liturgy — for payroll, hard clients, launches, partners, and more.',
  },
  {
    icon: 'headset-outline',
    title: 'Audio narration',
    sub: 'Listen to any reading, narrated, when you can’t look at a screen.',
  },
  {
    icon: 'search-outline',
    title: 'Find your moment',
    sub: 'Describe what you’re walking through and get the liturgy that meets it.',
  },
  {
    icon: 'infinite-outline',
    title: 'New readings, always',
    sub: 'Everything added over time, included.',
  },
];

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { packages, purchase, restore, configured, mustSubscribe } = useEntitlement();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [chosen, setChosen] = useState(0);

  const primary = packages[Math.min(chosen, Math.max(0, packages.length - 1))];
  const priceLabel = primary ? primary.product.priceString : '';
  const trial = primary?.product.trialLabel;

  // When the subscription IS the front door there is nowhere to go "back" to.
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
      <LinearGradient
        colors={['#26211B', '#0F0C09']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {!mustSubscribe && (
          <Pressable
            onPress={done}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="close" size={26} color="rgba(255,255,255,0.7)" />
          </Pressable>
        )}

        <Text style={styles.kicker}>FOUNDED · FULL ACCESS</Text>
        <Text style={styles.title}>Every liturgy,{'\n'}for every moment of the work.</Text>
        <Text style={styles.lede}>
          {trial
            ? `Start free — ${trial}. Then one simple plan for everything: the daily devotional, the full library, and audio.`
            : 'One simple plan for everything: the daily devotional, the full library, and audio.'}
        </Text>

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Ionicons name={b.icon} size={20} color={colors.accentSoft} />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitSub}>{b.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {packages.length > 1 && (
          <View style={styles.plans}>
            {packages.map((p, i) => {
              const active = i === chosen;
              return (
                <Pressable
                  key={p.identifier}
                  onPress={() => setChosen(i)}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${p.product.title}`}
                  style={[styles.plan, active && styles.planActive]}
                >
                  <Text style={[styles.planTitle, active && styles.planTitleActive]}>
                    {p.product.title}
                  </Text>
                  <Text style={[styles.planPrice, active && styles.planTitleActive]}>
                    {p.product.priceString}
                  </Text>
                  {p.product.trialLabel && (
                    <Text style={styles.planTrial}>{p.product.trialLabel}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {message && <Text style={styles.message}>{message}</Text>}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={onSubscribe}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        >
          {busy ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <Text style={styles.ctaText}>
              {trial
                ? `Start free trial · then ${priceLabel}`
                : priceLabel
                  ? `Subscribe · ${priceLabel}`
                  : 'Subscribe'}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={onRestore} disabled={busy} hitSlop={8}>
          <Text style={styles.restore}>Restore purchase</Text>
        </Pressable>

        {Platform.OS !== 'web' && (
          <>
            <Text style={styles.legal}>
              {priceLabel ? `${priceLabel} per period. ` : ''}Payment is charged to
              your Apple ID at confirmation. The subscription renews automatically
              unless canceled at least 24 hours before the end of the current
              period. Manage or cancel anytime in your App Store account settings.
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
          <Text style={styles.webNote}>
            Subscriptions are available in the iOS app.
          </Text>
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
  screen: { flex: 1, backgroundColor: '#0F0C09' },
  close: { alignSelf: 'flex-end', padding: 4, marginBottom: spacing.sm },
  kicker: {
    ...type.label,
    color: colors.accentSoft,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.displayExtra,
    fontSize: 30,
    lineHeight: 37,
    color: '#FBFAF7',
  },
  lede: {
    ...type.body,
    fontSize: 16,
    lineHeight: 25,
    color: 'rgba(251,250,247,0.72)',
    marginTop: spacing.md,
  },
  benefits: { marginTop: spacing.xl, gap: spacing.lg },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start' },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(201,167,126,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  benefitText: { flex: 1, paddingTop: 2 },
  benefitTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 16,
    color: '#FBFAF7',
  },
  benefitSub: {
    ...type.caption,
    color: 'rgba(251,250,247,0.6)',
    marginTop: 3,
  },
  message: {
    ...type.caption,
    color: colors.accentSoft,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  plans: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  plan: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: spacing.md,
  },
  planActive: {
    borderColor: colors.accentSoft,
    backgroundColor: 'rgba(201,167,126,0.10)',
  },
  planTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: 'rgba(251,250,247,0.75)',
  },
  planPrice: {
    fontFamily: fonts.sansBold,
    fontSize: 17,
    color: 'rgba(251,250,247,0.75)',
    marginTop: 2,
  },
  planTitleActive: { color: '#FBFAF7' },
  planTrial: {
    ...type.caption,
    fontSize: 12,
    color: colors.accentSoft,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: 'rgba(15,12,9,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  cta: {
    backgroundColor: '#FBFAF7',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 52,
  },
  ctaText: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.ink },
  restore: {
    ...type.caption,
    color: 'rgba(251,250,247,0.6)',
    marginTop: spacing.md,
  },
  webNote: {
    ...type.caption,
    fontSize: 12,
    color: 'rgba(251,250,247,0.4)',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  legal: {
    ...type.caption,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(251,250,247,0.4)',
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
    color: 'rgba(251,250,247,0.65)',
    textDecorationLine: 'underline',
  },
  legalDot: { color: 'rgba(251,250,247,0.35)' },
});
