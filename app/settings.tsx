import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Platform,
  TextInput,
  Alert,
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
import { useAccount } from '../src/lib/account';
import { useEntitlement } from '../src/purchases/Entitlements';
import { VOICES, useSelectedVoiceId, setSelectedVoice, type Voice } from '../src/audio/voices';
import { previewUrl } from '../src/audio/audioUrl';
import {
  BACKGROUND_SOUNDS,
  setBackgroundSound,
  useBackgroundSoundId,
} from '../src/audio/background';

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
  const { user: account, deleteAccount } = useAccount();
  const voiceId = useSelectedVoiceId();
  const bgId = useBackgroundSoundId();
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

  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const subscribeEmail = async () => {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailState('error');
      return;
    }
    setEmailState('sending');
    try {
      const base =
        Platform.OS === 'web'
          ? ''
          : ((Constants.expoConfig?.extra as { audioBaseUrl?: string } | undefined)?.audioBaseUrl ?? '');
      const r = await fetch(`${base}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      });
      setEmailState(r.ok ? 'done' : 'error');
    } catch {
      setEmailState('error');
    }
  };

  const previewRef = useRef<
    { kind: 'web'; el: any } | { kind: 'native'; sound: any } | null
  >(null);

  const stopPreview = useCallback(() => {
    const p = previewRef.current;
    previewRef.current = null;
    if (!p) return;
    if (p.kind === 'web') {
      try {
        p.el.pause();
      } catch {}
    } else {
      p.sound.unloadAsync().catch(() => {});
    }
  }, []);

  // Never let two previews play on top of each other; also stop when leaving.
  useEffect(() => stopPreview, [stopPreview]);

  const onPickVoice = async (v: Voice) => {
    setSelectedVoice(v.id);
    stopPreview();
    try {
      const url = previewUrl(v.slug);
      if (Platform.OS === 'web') {
        const a = new (window as any).Audio(url);
        previewRef.current = { kind: 'web', el: a };
        a.play?.();
      } else {
        const { Audio } = await import('expo-av');
        const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
        previewRef.current = { kind: 'native', sound };
        setTimeout(() => {
          if (previewRef.current?.kind === 'native' && previewRef.current.sound === sound) {
            previewRef.current = null;
          }
          sound.unloadAsync().catch(() => {});
        }, 15000);
      }
    } catch {
      // preview is best-effort
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
              Notifications are turned off for Founded. Enable them in your
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

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>DAILY EMAIL</Text>
        <View style={styles.card}>
          {emailState === 'done' ? (
            <View style={styles.row}>
              <Ionicons name="checkmark-circle" size={22} color={colors.people} />
              <Text style={[styles.rowSub, { marginLeft: spacing.sm, flex: 1 }]}>
                You’re subscribed. The day’s devotional will arrive each morning.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.rowTitle}>Get it in your inbox</Text>
              <Text style={styles.rowSub}>
                The day’s devotional, emailed each morning.
              </Text>
              <View style={styles.emailRow}>
                <TextInput
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailState === 'error') setEmailState('idle');
                  }}
                  placeholder="you@company.com"
                  placeholderTextColor={colors.inkFaint}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  inputMode="email"
                  style={styles.emailInput}
                />
                <Pressable
                  onPress={subscribeEmail}
                  disabled={emailState === 'sending'}
                  style={({ pressed }) => [styles.emailBtn, pressed && { opacity: 0.9 }]}
                >
                  {emailState === 'sending' ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.emailBtnText}>Subscribe</Text>
                  )}
                </Pressable>
              </View>
              {emailState === 'error' && (
                <Text style={styles.noteWarn}>
                  Please enter a valid email and try again.
                </Text>
              )}
            </>
          )}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>NARRATION VOICE</Text>
        <View style={styles.card}>
          {VOICES.map((v, i) => {
            const active = voiceId === v.id;
            return (
              <Pressable
                key={v.id}
                onPress={() => onPickVoice(v)}
                style={({ pressed }) => [
                  styles.voiceRow,
                  i > 0 && styles.timeRowBorder,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View style={{ flex: 1, paddingRight: spacing.sm }}>
                  <Text style={[styles.voiceLabel, active && styles.timeLabelActive]}>
                    {v.label}
                  </Text>
                  <Text style={styles.voiceDesc}>{v.description}</Text>
                </View>
                <Ionicons
                  name={active ? 'checkmark-circle' : 'play-circle-outline'}
                  size={22}
                  color={active ? colors.ink : colors.inkFaint}
                />
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.caption}>
          Every voice is a real studio-quality narrator. Tap one to hear a
          sample.
        </Text>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>BACKGROUND SOUND</Text>
        <View style={styles.card}>
          {BACKGROUND_SOUNDS.map((b, i) => {
            const active = bgId === b.id;
            return (
              <Pressable
                key={b.id}
                onPress={() => setBackgroundSound(b.id)}
                style={({ pressed }) => [
                  styles.voiceRow,
                  i > 0 && styles.timeRowBorder,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View style={{ flex: 1, paddingRight: spacing.sm }}>
                  <Text style={[styles.voiceLabel, active && styles.timeLabelActive]}>
                    {b.label}
                  </Text>
                </View>
                <Ionicons
                  name={active ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={active ? colors.ink : colors.inkFaint}
                />
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.caption}>
          A quiet musical bed under the narration — like a companion in the
          room, never louder than the voice.
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
                Sign in to keep your access across devices. Optional — Founded
                stores no personal data.
              </Text>
              <View style={{ marginTop: spacing.md }}>
                <AppleSignInButton />
              </View>
              {account && (
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Delete account',
                      'This signs you out and removes your saved sign-in from this device. Your on-device readings and prayers stay. Subscriptions are managed by Apple and can be cancelled in your App Store settings.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete account',
                          style: 'destructive',
                          onPress: () => void deleteAccount(),
                        },
                      ],
                    )
                  }
                  style={({ pressed }) => [styles.deleteRow, pressed && { opacity: 0.6 }]}
                >
                  <Text style={styles.deleteText}>Delete account</Text>
                </Pressable>
              )}
            </View>
          </>
        )}

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>YOURS</Text>
        <View style={styles.card}>
          <Pressable
            onPress={() => router.push('/saved')}
            style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="bookmark-outline" size={20} color={colors.ink} />
            <Text style={styles.linkRowText}>Words That Held Me</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/prayers')}
            style={({ pressed }) => [styles.linkRow, styles.linkRowBorder, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="heart-outline" size={20} color={colors.ink} />
            <Text style={styles.linkRowText}>Prayers</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.rowTitle}>Founded</Text>
            <Text style={styles.rowSub}>Version {version}</Text>
          </View>
          <Text style={styles.aboutBlurb}>
            A quiet daily devotional and a library of liturgies for the work of
            building something.
          </Text>
          <Pressable
            onPress={() => router.push('/privacy')}
            style={({ pressed }) => [styles.privacyRow, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.privacyLink}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
          </Pressable>
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
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  voiceLabel: { ...type.body, fontSize: 16, color: colors.inkSoft },
  voiceDesc: { ...type.caption, fontSize: 13, color: colors.inkFaint, marginTop: 1 },
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
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  privacyLink: { ...type.body, fontSize: 15, color: colors.ink, fontFamily: fonts.sansMedium },
  accountBlurb: { ...type.caption, color: colors.inkSoft },
  deleteRow: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  deleteText: { ...type.body, fontSize: 15, color: colors.pressure, fontFamily: fonts.sansSemibold },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  linkRowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  linkRowText: { ...type.body, fontSize: 16, color: colors.ink, flex: 1, fontFamily: fonts.sansMedium },
  emailRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  emailInput: {
    flex: 1,
    ...type.body,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  emailBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
  },
  emailBtnText: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.white },
  unlockBtn: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginLeft: spacing.md,
  },
  unlockBtnText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.white },
});
