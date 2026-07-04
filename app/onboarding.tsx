import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CATEGORIES, CategoryId } from '../src/content/types';
import { CATEGORY_COVER } from '../src/content/categoryCovers';
import { getLiturgiesByCategory, getReadingById } from '../src/content';
import { coverFor } from '../src/content/covers';
import { useSchedule } from '../src/lib/scheduleOverrides';
import { useOnboarding } from '../src/lib/onboarding';
import { scheduleDailyReminder, formatTime } from '../src/lib/reminders';
import { useEntitlement } from '../src/purchases/Entitlements';
import { fonts, radius } from '../src/theme/theme';

// A warm, dark palette for onboarding — bridges the cream app and the dark
// paywall, and lets full-bleed photography carry the mood.
const C = {
  bg: '#17130E',
  paper: '#FBFAF7',
  muted: 'rgba(251,250,247,0.62)',
  faint: 'rgba(251,250,247,0.40)',
  accent: '#C65A33',
  accentSoft: '#E0A98F',
  card: 'rgba(255,255,255,0.06)',
  cardActive: 'rgba(198,90,51,0.16)',
  line: 'rgba(255,255,255,0.12)',
};

type Rhythm = 'morning' | 'evening' | 'later';

const MORNING_TIMES = [
  { hour: 6, minute: 30 },
  { hour: 7, minute: 0 },
  { hour: 7, minute: 30 },
  { hour: 8, minute: 0 },
];
const EVENING_TIMES = [
  { hour: 20, minute: 0 },
  { hour: 20, minute: 30 },
  { hour: 21, minute: 0 },
  { hour: 21, minute: 30 },
];

// The ordered list of steps. 'remindTime' is skipped when the rhythm is "later".
const STEPS = ['welcome', 'interests', 'value', 'rhythm', 'remindTime', 'commit', 'trial', 'ready'] as const;
type Step = (typeof STEPS)[number];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { complete } = useOnboarding();
  const { resolveId } = useSchedule();
  const { packages } = useEntitlement();

  const [stepIndex, setStepIndex] = useState(0);
  const [interests, setInterests] = useState<CategoryId[]>([]);
  const [rhythm, setRhythm] = useState<Rhythm>('morning');
  const [time, setTime] = useState({ hour: 7, minute: 0 });
  const [reminderOn, setReminderOn] = useState(false);

  const step: Step = STEPS[stepIndex];

  // Skip the time picker if they don't want a set rhythm.
  const advance = () => {
    let next = stepIndex + 1;
    if (STEPS[next] === 'remindTime' && rhythm === 'later') next += 1;
    setStepIndex(Math.min(next, STEPS.length - 1));
  };
  const back = () => {
    let prev = stepIndex - 1;
    if (STEPS[prev] === 'remindTime' && rhythm === 'later') prev -= 1;
    setStepIndex(Math.max(prev, 0));
  };

  // The reading we'll open at the end — first from a chosen category, else today's.
  const firstId = useMemo(() => {
    for (const c of interests) {
      const ls = getLiturgiesByCategory(c);
      if (ls.length) return ls[0].id;
    }
    return resolveId(new Date());
  }, [interests, resolveId]);
  const firstReading = getReadingById(firstId);
  const firstRef = firstReading?.sections.find((s) => s.type === 'scripture')?.reference;

  const finish = (openReading: boolean) => {
    complete(interests);
    if (openReading) router.replace(`/liturgy/${firstId}`);
    else router.replace('/');
  };

  const toggleInterest = (id: CategoryId) =>
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const chooseRhythm = (r: Rhythm) => {
    setRhythm(r);
    if (r === 'morning') setTime(MORNING_TIMES[1]);
    if (r === 'evening') setTime(EVENING_TIMES[1]);
  };

  const enableReminder = async () => {
    const prefs = await scheduleDailyReminder(time.hour, time.minute);
    setReminderOn(prefs.enabled);
    advance();
  };

  // ---- shared chrome ----------------------------------------------------
  const showBack = stepIndex > 0;
  const TopBar = () => (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      {showBack ? (
        <Pressable onPress={back} hitSlop={12} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={26} color={C.paper} />
        </Pressable>
      ) : (
        <View style={{ width: 26 }} />
      )}
      {step !== 'ready' && (
        <Pressable onPress={() => finish(false)} hitSlop={12} accessibilityLabel="Skip">
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      )}
    </View>
  );

  const Dots = () => (
    <View style={styles.dots}>
      {STEPS.map((s, i) => (
        <View key={s} style={[styles.dot, i === stepIndex && styles.dotActive]} />
      ))}
    </View>
  );

  const trial = packages[0]?.product.trialLabel;
  const price = packages[0]?.product.priceString;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* WELCOME — full-bleed hero + verse */}
      {step === 'welcome' && (
        <ImageBackground source={CATEGORY_COVER.rhythms} style={StyleSheet.absoluteFill} resizeMode="cover">
          <LinearGradient
            colors={['rgba(15,12,9,0.55)', 'rgba(15,12,9,0.35)', 'rgba(15,12,9,0.92)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>
      )}

      <TopBar />

      {step === 'welcome' && (
        <View style={styles.welcomeWrap}>
          <View style={{ flex: 1 }} />
          <Text style={styles.wordmark}>FOUNDED</Text>
          <Text style={styles.verse}>“Be still, and know that I am God.”</Text>
          <Text style={styles.verseRef}>PSALM 46:10</Text>
          <Text style={styles.welcomeLede}>
            A few quiet minutes for the founder’s day — Scripture for the real
            work of building something.
          </Text>
          <View style={{ height: 24 }} />
          <Primary label="Begin" onPress={advance} />
          <Dots />
          <View style={{ height: insets.bottom + 8 }} />
        </View>
      )}

      {/* INTERESTS */}
      {step === 'interests' && (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: insets.bottom + 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.h1}>What are you carrying right now?</Text>
          <Text style={styles.sub}>Pick any that fit — or skip. It sets your first reading.</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((c) => {
              const on = interests.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  onPress={() => toggleInterest(c.id)}
                  style={styles.tile}
                  accessibilityRole="button"
                  accessibilityLabel={c.label}
                >
                  <ImageBackground
                    source={CATEGORY_COVER[c.id]}
                    style={styles.tileImg}
                    imageStyle={styles.tileImgRadius}
                    resizeMode="cover"
                  >
                    <LinearGradient
                      colors={
                        on
                          ? ['rgba(198,90,51,0.25)', 'rgba(198,90,51,0.72)']
                          : ['rgba(15,12,9,0.30)', 'rgba(15,12,9,0.78)']
                      }
                      style={styles.tileOverlay}
                    >
                      {on && (
                        <View style={styles.tileCheck}>
                          <Ionicons name="checkmark" size={14} color={C.bg} />
                        </View>
                      )}
                      <Text style={styles.tileLabel} numberOfLines={2}>
                        {c.label}
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
      {step === 'interests' && (
        <Footer insets={insets}>
          <Primary label="Continue" onPress={advance} />
        </Footer>
      )}

      {/* VALUE */}
      {step === 'value' && (
        <View style={styles.centerWrap}>
          <Text style={styles.h1}>Five quiet minutes for the work.</Text>
          <Text style={styles.sub}>No feeds, no metrics, no noise. Here’s what you’ll find.</Text>
          <View style={{ height: 28 }} />
          <Feature icon="sunny-outline" title="A daily devotional" body="A short, steadying word on faith and work, waiting each day." />
          <Feature icon="library-outline" title="A library for the real moments" body="Payroll, a hard client, a launch, letting someone go — search what you’re in." />
          <Feature icon="headset-outline" title="Listen to any reading" body="Narrated, for the drive or the walk before the team arrives." />
          <View style={{ flex: 1 }} />
          <Primary label="Continue" onPress={advance} />
          <View style={{ height: insets.bottom + 8 }} />
        </View>
      )}

      {/* RHYTHM */}
      {step === 'rhythm' && (
        <View style={styles.centerWrap}>
          <Text style={styles.h1}>When do you want your quiet minutes?</Text>
          <Text style={styles.sub}>We’ll set a gentle daily reminder — nothing more.</Text>
          <View style={{ height: 20 }} />
          {(
            [
              { key: 'morning', label: 'Morning', hint: 'Before the inbox' },
              { key: 'evening', label: 'Evening', hint: 'Lay the day down' },
              { key: 'later', label: 'Decide later', hint: 'No reminder for now' },
            ] as const
          ).map((o) => (
            <Pressable
              key={o.key}
              onPress={() => chooseRhythm(o.key)}
              style={[styles.rowCard, rhythm === o.key && styles.rowCardActive]}
            >
              <View>
                <Text style={styles.rowTitle}>{o.label}</Text>
                <Text style={styles.rowHint}>{o.hint}</Text>
              </View>
              {rhythm === o.key && <Ionicons name="checkmark-circle" size={22} color={C.accent} />}
            </Pressable>
          ))}
          <View style={{ flex: 1 }} />
          <Primary label="Continue" onPress={advance} />
          <View style={{ height: insets.bottom + 8 }} />
        </View>
      )}

      {/* REMIND TIME */}
      {step === 'remindTime' && (
        <View style={styles.centerWrap}>
          <View style={styles.bell}>
            <Ionicons name="notifications" size={30} color={C.accent} />
          </View>
          <Text style={styles.h1}>
            {rhythm === 'evening' ? 'An evening pause' : 'A gentle morning nudge'}
          </Text>
          <Text style={styles.sub}>
            Pick a time. You can change it — or turn it off — anytime in Settings.
          </Text>
          <View style={styles.timeRow}>
            {(rhythm === 'evening' ? EVENING_TIMES : MORNING_TIMES).map((t) => {
              const on = t.hour === time.hour && t.minute === time.minute;
              return (
                <Pressable
                  key={`${t.hour}:${t.minute}`}
                  onPress={() => setTime(t)}
                  style={[styles.timeChip, on && styles.timeChipActive]}
                >
                  <Text style={[styles.timeChipText, on && styles.timeChipTextActive]}>
                    {formatTime(t.hour, t.minute)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{ flex: 1 }} />
          <Primary label={`Turn on reminders · ${formatTime(time.hour, time.minute)}`} onPress={enableReminder} />
          <Pressable onPress={advance} hitSlop={8} style={{ marginTop: 14, alignSelf: 'center' }}>
            <Text style={styles.textLink}>Not now</Text>
          </Pressable>
          <View style={{ height: insets.bottom + 8 }} />
        </View>
      )}

      {/* COMMIT */}
      {step === 'commit' && <Commit onDone={advance} insets={insets} />}

      {/* TRIAL EXPLAINER */}
      {step === 'trial' && (
        <View style={styles.centerWrap}>
          <Text style={styles.h1}>How your free trial works</Text>
          <Text style={styles.sub}>
            {trial && price
              ? `Start with ${trial}, then ${price}. Cancel anytime.`
              : 'Start free, then one simple plan. Cancel anytime.'}
          </Text>
          <View style={{ height: 24 }} />
          <TrialStep icon="lock-open-outline" title="Today — full access" body="Every devotional, the whole library, and audio narration." first />
          <TrialStep icon="notifications-outline" title="Before it renews" body="We’ll remind you the trial is ending — no surprises." />
          <TrialStep icon="star-outline" title="Cancel anytime" body="Manage or cancel in your App Store settings whenever you like." last />
          <View style={{ flex: 1 }} />
          <Text style={styles.finePrint}>On the next screen you can start your trial.</Text>
          <Primary label="Continue" onPress={advance} />
          <View style={{ height: insets.bottom + 8 }} />
        </View>
      )}

      {/* READY — drop into the first reading */}
      {step === 'ready' && (
        <View style={styles.centerWrap}>
          <View style={{ flex: 1 }} />
          <View style={styles.readyCard}>
            <ImageBackground
              source={coverFor(firstId)}
              style={styles.readyImg}
              imageStyle={{ borderRadius: radius.lg }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(15,12,9,0.1)', 'rgba(15,12,9,0.85)']}
                style={styles.readyOverlay}
              >
                <Text style={styles.readyTitle} numberOfLines={2}>
                  {firstReading?.title}
                </Text>
                {firstRef ? <Text style={styles.readyRef}>{firstRef}</Text> : null}
              </LinearGradient>
            </ImageBackground>
          </View>
          <Text style={[styles.h1, { textAlign: 'center', marginTop: 28 }]}>A reading to begin</Text>
          <Text style={[styles.sub, { textAlign: 'center' }]}>
            {interests.length
              ? 'Chosen for what you said you’re carrying.'
              : 'Today’s devotional, ready for you.'}
          </Text>
          <View style={{ flex: 1 }} />
          <Primary label="Start reading" onPress={() => finish(true)} />
          <Pressable onPress={() => finish(false)} hitSlop={8} style={{ marginTop: 14, alignSelf: 'center' }}>
            <Text style={styles.textLink}>Maybe later</Text>
          </Pressable>
          <View style={{ height: insets.bottom + 8 }} />
        </View>
      )}
    </View>
  );
}

// ---- small building blocks ---------------------------------------------

function Primary({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
      accessibilityRole="button"
    >
      <Text style={styles.ctaText}>{label}</Text>
    </Pressable>
  );
}

function Footer({ insets, children }: { insets: { bottom: number }; children: React.ReactNode }) {
  return <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>{children}</View>;
}

function Feature({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color={C.accentSoft} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureBody}>{body}</Text>
      </View>
    </View>
  );
}

function TrialStep({
  icon,
  title,
  body,
  first,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <View style={styles.trialRow}>
      <View style={styles.trialRail}>
        {!first && <View style={styles.trailLineTop} />}
        <View style={styles.trialDot}>
          <Ionicons name={icon} size={16} color={C.accent} />
        </View>
        {!last && <View style={styles.trailLineBottom} />}
      </View>
      <View style={{ flex: 1, paddingBottom: 18 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureBody}>{body}</Text>
      </View>
    </View>
  );
}

function Commit({
  onDone,
  insets,
}: {
  onDone: () => void;
  insets: { bottom: number };
}) {
  const fill = useRef(new Animated.Value(0)).current;
  const anim = useRef<Animated.CompositeAnimation | null>(null);

  const start = () => {
    anim.current = Animated.timing(fill, {
      toValue: 1,
      duration: 1400,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    anim.current.start(({ finished }) => {
      if (finished) onDone();
    });
  };
  const stop = () => {
    anim.current?.stop();
    Animated.timing(fill, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  return (
    <View style={[styles.centerWrap, { alignItems: 'flex-start' }]}>
      <Text style={styles.h1}>Be still, and know that He is with you.</Text>
      <Text style={styles.commitBody}>
        For the next few days, I’ll take five quiet minutes to read, pray, and
        listen — and let my work be steadied by it.
      </Text>
      <View style={{ flex: 1 }} />
      <Pressable
        onPressIn={start}
        onPressOut={stop}
        style={styles.commitCircleWrap}
        accessibilityRole="button"
        accessibilityLabel="Press and hold to commit"
      >
        <View style={styles.commitRing}>
          <Animated.View
            style={[
              styles.commitFill,
              { transform: [{ scale: fill }], opacity: fill.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
            ]}
          />
        </View>
      </Pressable>
      <Text style={styles.commitHint}>Press and hold to commit</Text>
      <View style={{ flex: 1 }} />
      <View style={{ height: insets.bottom + 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 2,
  },
  skip: { fontFamily: fonts.sansSemibold, fontSize: 16, color: C.paper },

  // Welcome
  welcomeWrap: { flex: 1, paddingHorizontal: 24 },
  wordmark: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    letterSpacing: 4,
    color: C.paper,
    marginBottom: 18,
  },
  verse: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 40,
    color: C.paper,
  },
  verseRef: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 2,
    color: C.accentSoft,
    marginTop: 12,
  },
  welcomeLede: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    lineHeight: 24,
    color: C.muted,
    marginTop: 18,
  },

  // Generic layout
  centerWrap: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  h1: {
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 34,
    color: C.paper,
  },
  sub: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    lineHeight: 22,
    color: C.muted,
    marginTop: 10,
  },
  textLink: { fontFamily: fonts.sansSemibold, fontSize: 15, color: C.muted },
  finePrint: { fontFamily: fonts.sansMedium, fontSize: 13, color: C.faint, textAlign: 'center', marginBottom: 14 },

  // CTA
  cta: {
    backgroundColor: C.paper,
    borderRadius: radius.lg,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  ctaText: { fontFamily: fonts.sansBold, fontSize: 16, color: C.bg },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.line },
  dotActive: { backgroundColor: C.paper, width: 18 },

  // Interests grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginTop: 20,
  },
  tile: { width: '48%', aspectRatio: 1.35 },
  tileImg: { width: '100%', height: '100%' },
  tileImgRadius: { borderRadius: radius.md },
  tileOverlay: {
    flex: 1,
    borderRadius: radius.md,
    padding: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  tileCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { fontFamily: fonts.sansBold, fontSize: 14, color: C.paper },

  // Feature rows
  feature: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(224,169,143,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureTitle: { fontFamily: fonts.sansSemibold, fontSize: 16, color: C.paper },
  featureBody: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20, color: C.muted, marginTop: 3 },

  // Rhythm rows
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    padding: 18,
    marginBottom: 12,
  },
  rowCardActive: { borderColor: C.accent, backgroundColor: C.cardActive },
  rowTitle: { fontFamily: fonts.sansSemibold, fontSize: 17, color: C.paper },
  rowHint: { fontFamily: fonts.sansMedium, fontSize: 13, color: C.muted, marginTop: 2 },

  // Remind time
  bell: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(198,90,51,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  timeChip: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: C.line,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  timeChipActive: { borderColor: C.accent, backgroundColor: C.cardActive },
  timeChipText: { fontFamily: fonts.sansSemibold, fontSize: 15, color: C.muted },
  timeChipTextActive: { color: C.paper },

  // Trial timeline
  trialRow: { flexDirection: 'row' },
  trialRail: { width: 40, alignItems: 'center' },
  trialDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(198,90,51,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailLineTop: { position: 'absolute', top: 0, height: 0 },
  trailLineBottom: { flex: 1, width: 2, backgroundColor: C.line, marginTop: 2 },

  // Commit
  commitBody: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 27, color: C.muted, marginTop: 16 },
  commitCircleWrap: { alignSelf: 'center' },
  commitRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  commitFill: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.paper,
  },
  commitHint: { fontFamily: fonts.sansSemibold, fontSize: 15, color: C.paper, textAlign: 'center', marginTop: 20 },

  // Ready
  readyCard: { alignSelf: 'center', width: 220, height: 260 },
  readyImg: { width: '100%', height: '100%' },
  readyOverlay: { flex: 1, borderRadius: radius.lg, padding: 16, justifyContent: 'flex-end', overflow: 'hidden' },
  readyTitle: { fontFamily: fonts.display, fontSize: 20, lineHeight: 25, color: C.paper },
  readyRef: { fontFamily: fonts.sansSemibold, fontSize: 12, color: C.accentSoft, marginTop: 4 },
});
