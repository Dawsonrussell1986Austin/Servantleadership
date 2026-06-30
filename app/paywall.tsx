import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
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
  const { packages, purchase, restore, configured } = useEntitlement();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const primary = packages[0];
  const priceLabel = primary ? primary.product.priceString : '';

  const close = () => router.back();

  const onSubscribe = async () => {
    if (!primary) {
      setMessage('Plans load on the iOS app.');
      return;
    }
    setBusy(true);
    setMessage(null);
    const ok = await purchase(primary);
    setBusy(false);
    if (ok) close();
    else setMessage('That didn’t go through. No charge was made.');
  };

  const onRestore = async () => {
    setBusy(true);
    setMessage(null);
    const ok = await restore();
    setBusy(false);
    if (ok) close();
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
        <Pressable
          onPress={close}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="close" size={26} color="rgba(255,255,255,0.7)" />
        </Pressable>

        <Text style={styles.kicker}>SERVANT · FULL ACCESS</Text>
        <Text style={styles.title}>Every liturgy,{'\n'}for every moment of the work.</Text>
        <Text style={styles.lede}>
          The daily devotional is always free. Unlock the full library and audio
          for the days that need more.
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
              {priceLabel ? `Subscribe · ${priceLabel}` : 'Subscribe'}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={onRestore} disabled={busy} hitSlop={8}>
          <Text style={styles.restore}>Restore purchase</Text>
        </Pressable>

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
});
