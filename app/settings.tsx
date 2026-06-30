import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';
import {
  loadReminderPrefs,
  scheduleDailyReminder,
  disableDailyReminder,
  formatTime,
  DEFAULT_PREFS,
  type ReminderPrefs,
} from '../src/lib/reminders';
import AppleSignInButton from '../src/components/AppleSignInButton';
import { useEntitlement } from '../src/purchases/Entitlements';

const PRESET_TIMES: { label: string; hour: number; minute: number }[] = [
  { label: 'Early · 6:00 AM', hour: 6, minute: 0 },
  { label: 'Morning · 7:00 AM', hour: 7, minute: 0 },
  { label: 'Workday · 8:30 AM', hour: 8, minute: 30 },
  { label: 'Midday · 12:00 PM', hour: 12, minute: 0 },
  { label: 'Evening · 8:00 PM', hour: 20, minute: 0 },
];

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = Platform.OS === 'web';

  const { isPremium, configured } = useEntitlement();
  const [prefs, setPrefs] = useState<ReminderPrefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    loadReminderPrefs().then((p) => {
      setPrefs(p);
      setLoaded(true);
    });
  }, []);

  const onToggle = async (next: boolean) => {
    setBusy(true);
    setDenied(false);
    try {
      if (next) {
        const result = await scheduleDailyReminder(prefs.hour, prefs.minute);
        setPrefs(result);
        if (!result.enabled) setDenied(true);
      } else {
        const result = await disableDailyReminder(prefs);
        setPrefs(result);
      }
    } finally {
      setBusy(false);
    }
  };

  const onPickTime = async (hour: number, minute: number) => {
    setBusy(true);
    setDenied(false);
    try {
      if (prefs.enabled) {
        const result = await scheduleDailyReminder(hour, minute);
        setPrefs(result);
        if (!result.enabled) setDenied(true);
      } else {
        setPrefs({ ...prefs, hour, minute });
      }
    } finally {
      setBusy(false);
    }
  };

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.inkSoft} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>DAILY REMINDER</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Remind me each day</Text>
              <Text style={styles.rowSub}>
                A gentle nudge to read the day’s devotional.
              </Text>
            </View>
            {busy ? (
              <ActivityIndicator color={colors.ink} style={{ marginLeft: spacing.md }} />
            ) : (
              <Switch
                value={prefs.enabled}
                onValueChange={onToggle}
                disabled={!loaded || isWeb}
                trackColor={{ false: colors.paperDeep, true: colors.ink }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.paperDeep}
              />
            )}
          </View>

          {isWeb && (
            <Text style={styles.note}>
              Reminders run on the iOS app. On the web preview this setting is
              shown but inactive.
            </Text>
          )}
          {denied && !isWeb && (
            <Text style={styles.noteWarn}>
              Notifications are turned off for Servant. Enable them in your
              device Settings to get daily reminders.
            </Text>
          )}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>TIME</Text>
        <View style={styles.card}>
          {PRESET_TIMES.map((t, i) => {
            const active = prefs.hour === t.hour && prefs.minute === t.minute;
            return (
              <Pressable
                key={t.label}
                onPress={() => onPickTime(t.hour, t.minute)}
                disabled={busy || isWeb}
                style={({ pressed }) => [
                  styles.timeRow,
                  i > 0 && styles.timeRowBorder,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.timeLabel, active && styles.timeLabelActive]}>
                  {t.label}
                </Text>
                {active && <Ionicons name="checkmark" size={20} color={colors.ink} />}
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.caption}>
          Currently set for {formatTime(prefs.hour, prefs.minute)}.
        </Text>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>MEMBERSHIP</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>
                {isPremium ? 'Full access' : 'Daily devotional'}
              </Text>
              <Text style={styles.rowSub}>
                {isPremium
                  ? 'You have the full library and audio.'
                  : 'Unlock the full library and audio narration.'}
              </Text>
            </View>
            {isPremium ? (
              <Ionicons name="checkmark-circle" size={24} color={colors.people} />
            ) : (
              <Pressable
                onPress={() => router.push('/paywall')}
                style={({ pressed }) => [styles.unlockBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.unlockBtnText}>Unlock</Text>
              </Pressable>
            )}
          </View>
          {!isPremium && !configured && !isWeb && (
            <Text style={styles.note}>
              Billing isn’t connected yet — all content is currently unlocked.
            </Text>
          )}
        </View>

        {!isWeb && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>ACCOUNT</Text>
            <View style={styles.card}>
              <Text style={styles.accountBlurb}>
                Sign in to keep your access across devices. Optional — Servant
                stores no personal data.
              </Text>
              <View style={{ marginTop: spacing.md }}>
                <AppleSignInButton />
              </View>
            </View>
          </>
        )}

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.rowTitle}>Servant</Text>
            <Text style={styles.rowSub}>Version {version}</Text>
          </View>
          <Text style={styles.aboutBlurb}>
            A quiet daily devotional and a library of liturgies for the work of
            building something.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -6,
    marginBottom: spacing.md,
  },
  backText: { ...type.caption, color: colors.inkSoft },
  title: { ...type.hero, fontSize: 30, color: colors.ink },

  sectionLabel: {
    ...type.label,
    color: colors.inkFaint,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowText: { flex: 1, paddingRight: spacing.sm },
  rowTitle: { ...type.heading, fontSize: 17, color: colors.ink },
  rowSub: { ...type.caption, color: colors.inkSoft, marginTop: 2 },
  note: {
    ...type.caption,
    color: colors.inkFaint,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  noteWarn: {
    ...type.caption,
    color: colors.pressure,
    marginTop: spacing.md,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  timeRowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  timeLabel: { ...type.body, fontSize: 16, color: colors.inkSoft },
  timeLabelActive: { color: colors.ink, fontFamily: fonts.sansSemibold },
  caption: {
    ...type.caption,
    color: colors.inkFaint,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },

  aboutRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  aboutBlurb: { ...type.caption, color: colors.inkSoft, marginTop: spacing.sm },
  accountBlurb: { ...type.caption, color: colors.inkSoft },
  unlockBtn: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginLeft: spacing.md,
  },
  unlockBtnText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.white },
});
