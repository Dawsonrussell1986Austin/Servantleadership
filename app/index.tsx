import React, { useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  Animated,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { getReadingById } from '../src/content';
import { useSchedule } from '../src/lib/scheduleOverrides';
import { LITURGIES, getLiturgiesByCategory } from '../src/content/liturgies';
import { CATEGORIES } from '../src/content/types';
import { searchLiturgies } from '../src/content/search';
import LiturgyCover from '../src/components/LiturgyCover';
import LiturgyCard from '../src/components/LiturgyCard';
import CategoryTile from '../src/components/CategoryTile';
import PlayerBar from '../src/components/PlayerBar';
import FadeInUp from '../src/components/FadeInUp';
import SearchBar from '../src/components/SearchBar';
import WelcomeEmail from '../src/components/WelcomeEmail';
import Bounded, { useWide } from '../src/components/Bounded';
import { useEntitlement } from '../src/purchases/Entitlements';
import { usePersonal } from '../src/lib/personal';
import { useOnboarding } from '../src/lib/onboarding';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';

// Optional personalization: only appended if a name is configured for this
// build. Left blank for public releases so every user gets a clean greeting.
const USER_NAME =
  (Constants.expoConfig?.extra as { userName?: string } | undefined)?.userName ??
  '';

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function greeting(d: Date): string {
  const h = d.getHours();
  const base = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return USER_NAME ? `${base}, ${USER_NAME}` : base;
}
function subtitleFor(d: Date): string {
  const h = d.getHours();
  if (h < 12) return 'A few quiet minutes to begin the day well.';
  if (h < 17) return 'A few quiet minutes to steady the middle of the day.';
  return 'A few quiet minutes to lay the day down well.';
}
function dateLine(d: Date): string {
  return `${WEEKDAYS[d.getDay()]} · ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const SUGGESTIONS = ['Angry client', 'Can’t make payroll', 'Closing a deal', 'Overwhelmed', 'Launch day'];

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mustSubscribe } = useEntitlement();
  const { resurfacedPrayer } = usePersonal();
  const { ready: onboardingReady, onboarded } = useOnboarding();
  const { resolveId, swapToday } = useSchedule();
  const wide = useWide();
  const now = new Date();
  const [todayId, setTodayId] = useState<string | null>(null);
  const devotional = getReadingById(todayId ?? resolveId(now)) ?? getReadingById(resolveId(now))!;
  const resurface = resurfacedPrayer();

  // Swipe the card away to trade today's devotional for an upcoming one.
  const slideX = useRef(new Animated.Value(0)).current;
  const swapCard = (dir: 1 | -1) => {
    Animated.timing(slideX, {
      toValue: dir * 420,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      const nextId = swapToday();
      setTodayId(nextId);
      slideX.setValue(dir * -420);
      Animated.spring(slideX, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    });
  };
  // Claim horizontal drags in the capture phase (before the ScrollView or the
  // card's Pressable can take them) and refuse termination requests, or the
  // vertical ScrollView steals the gesture and the swipe never registers.
  const isHorizontalDrag = (_e: unknown, g: { dx: number; dy: number }) =>
    Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: isHorizontalDrag,
      onMoveShouldSetPanResponderCapture: isHorizontalDrag,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_e, g) => slideX.setValue(g.dx),
      onPanResponderRelease: (_e, g) => {
        if (Math.abs(g.dx) > 90) swapCard(g.dx > 0 ? 1 : -1);
        else
          Animated.spring(slideX, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }).start();
      },
      onPanResponderTerminate: () =>
        Animated.spring(slideX, { toValue: 0, friction: 7, useNativeDriver: true }).start(),
    }),
  ).current;

  const [query, setQuery] = useState('');
  const [view, setView] = useState<'shelves' | 'all'>('shelves');
  const searching = query.trim().length >= 2;

  const results = useMemo(() => {
    const all = searchLiturgies(query);
    const top = all[0]?.score ?? 0;
    const cutoff = top >= 4 ? Math.max(3, top * 0.4) : 1;
    return all.filter((r) => r.score >= cutoff).slice(0, 8);
  }, [query]);

  const allLiturgies = useMemo(
    () => [...LITURGIES].sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  const open = (id: string) => {
    Keyboard.dismiss();
    router.push(`/liturgy/${id}`);
  };

  // First run: send new users through onboarding before anything else (it
  // shows value before the paywall). Wait until the flag has loaded so we
  // don't flash the home screen.
  if (!onboardingReady) return <View style={styles.screen} />;
  if (!onboarded) return <Redirect href="/onboarding" />;

  // Subscription-only app: without an active (or trial) subscription, the
  // paywall IS the front door.
  if (mustSubscribe) return <Redirect href="/paywall" />;

  return (
    <ScrollView
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
    >
      <WelcomeEmail />
      <Bounded max={840} style={{ paddingHorizontal: wide ? spacing.xl : spacing.lg }}>

      {/* Greeting */}
      <FadeInUp>
        <View style={styles.topRow}>
          <Text style={styles.dateLine}>{dateLine(now)}</Text>
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            style={({ pressed }) => [styles.gearBtn, pressed && { opacity: 0.5 }]}
          >
            <Ionicons name="settings-outline" size={20} color={colors.inkFaint} />
          </Pressable>
        </View>
        <Text style={styles.greeting} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {greeting(now)}
        </Text>
        <Text style={styles.subtitle}>{subtitleFor(now)}</Text>
      </FadeInUp>

      {/* A prayer, gently resurfaced */}
      {resurface && (
        <FadeInUp delay={60}>
          <Pressable
            onPress={() => router.push('/prayers')}
            accessibilityRole="button"
            accessibilityLabel="Revisit a prayer"
            style={({ pressed }) => [styles.resurface, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.resurfaceIcon}>
              <Ionicons name="heart-outline" size={16} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resurfaceLabel}>A WHILE AGO, YOU PRAYED</Text>
              <Text style={styles.resurfaceText} numberOfLines={2}>
                “{resurface.text}”
              </Text>
              <Text style={styles.resurfaceAsk}>How is it? Tap to revisit.</Text>
            </View>
          </Pressable>
        </FadeInUp>
      )}

      {/* Today's devotional */}
      <FadeInUp delay={90}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionLabel, styles.sectionLabelFlush]}>TODAY’S DEVOTIONAL</Text>
          <Pressable
            onPress={() => router.push('/devotionals')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View calendar"
            style={({ pressed }) => [styles.allLink, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="calendar-outline" size={14} color={colors.inkSoft} />
            <Text style={styles.allLinkText}>View calendar</Text>
          </Pressable>
        </View>
        <View style={styles.hero}>
          <Animated.View {...pan.panHandlers} style={{ transform: [{ translateX: slideX }] }}>
          <Pressable
            onPress={() => open(devotional.id)}
            accessibilityRole="button"
            accessibilityLabel={`Read today’s devotional: ${devotional.title}`}
            style={({ pressed }) => [styles.heroTop, pressed && { opacity: 0.85 }]}
          >
            <LiturgyCover liturgy={devotional} size="md" />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {devotional.title}
              </Text>
              <Text style={styles.heroSituation} numberOfLines={2}>
                {devotional.situation}
              </Text>
              <View style={styles.readRow}>
                <Text style={styles.readLink}>Read</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.ink} />
              </View>
            </View>
          </Pressable>
          {/* Inside the swipeable area on purpose: the hint sits on the part
              of the card that actually responds, and slides away with it. */}
          <Text style={styles.swapHint} numberOfLines={1}>
            Not the word you need? Swipe for another.
          </Text>
          </Animated.View>
          <View style={styles.heroDivider} />
          <PlayerBar readingId={devotional.id} openOnPlay />
        </View>
      </FadeInUp>

      {/* Library */}
      <FadeInUp delay={170}>
        <Text style={styles.sectionLabel}>THE LIBRARY</Text>
        <Text style={styles.libIntro}>
          A 5-min-or-less devotional for the moment you’re in — search it, or
          browse the shelves.
        </Text>


        <SearchBar value={query} onChangeText={setQuery} />

        {searching ? (
          <View style={styles.resultsWrap}>
            {results.length > 0 ? (
              <>
                <Text style={styles.resultsHead}>
                  {results.length} {results.length === 1 ? 'devotional' : 'devotionals'} for “{query.trim()}”
                </Text>
                {results.map((r) => (
                  <LiturgyCard key={r.liturgy.id} liturgy={r.liturgy} onPress={() => open(r.liturgy.id)} />
                ))}
              </>
            ) : (
              <View style={styles.empty}>
                <Ionicons name="leaf-outline" size={30} color={colors.inkFaint} />
                <Text style={styles.emptyTitle}>No match yet for “{query.trim()}”.</Text>
                <Text style={styles.emptyBody}>
                  Try fewer or different words — a plain phrase like “angry client,”
                  “cash,” or “letting someone go.”
                </Text>
                <View style={styles.chips}>
                  {SUGGESTIONS.map((s) => (
                    <Pressable key={s} onPress={() => setQuery(s)} style={styles.chip}>
                      <Text style={styles.chipText}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Shelves / All toggle */}
            <View style={styles.segment}>
              {(['shelves', 'all'] as const).map((v) => {
                const active = view === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => setView(v)}
                    accessibilityRole="button"
                    style={[styles.segBtn, active && styles.segActive]}
                  >
                    <Ionicons
                      name={v === 'shelves' ? 'grid-outline' : 'list-outline'}
                      size={15}
                      color={active ? colors.white : colors.inkSoft}
                    />
                    <Text style={[styles.segText, active && styles.segTextActive]}>
                      {v === 'shelves' ? 'Shelves' : `All ${LITURGIES.length}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {view === 'shelves' ? (
              <View style={[styles.grid, wide && styles.gridWide]}>
                {CATEGORIES.map((c, i) => (
                  <FadeInUp key={c.id} delay={i * 45} style={wide ? styles.tileWrapWide : styles.tileWrap}>
                    <CategoryTile
                      category={c}
                      count={getLiturgiesByCategory(c.id).length}
                      onPress={() => router.push(`/category/${c.id}`)}
                    />
                  </FadeInUp>
                ))}
              </View>
            ) : (
              <View style={[styles.allList, wide && styles.allListWide]}>
                {allLiturgies.map((l) => (
                  <View key={l.id} style={wide ? styles.listItemWide : undefined}>
                    <LiturgyCard liturgy={l} onPress={() => open(l.id)} />
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </FadeInUp>
      </Bounded>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  gearBtn: { padding: 4, marginRight: -4, marginTop: -4 },
  dateLine: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.accent,
  },
  greeting: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.inkFaint,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    ...type.label,
    color: colors.inkFaint,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionLabelFlush: { marginTop: 0, marginBottom: 0 },
  allLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  allLinkText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.inkSoft,
  },
  hero: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroTop: { flexDirection: 'row' },
  heroText: { flex: 1, marginLeft: spacing.lg, justifyContent: 'center' },
  heroKind: { ...type.label, color: colors.inkFaint, fontWeight: '700', marginBottom: spacing.sm },
  heroTitle: {
    ...type.heading,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  heroSituation: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    lineHeight: 21,
    color: colors.inkSoft,
    marginBottom: spacing.md,
  },
  readRow: { flexDirection: 'row', alignItems: 'center' },
  readLink: { ...type.caption, color: colors.ink, fontWeight: '700', marginRight: 4 },
  heroDivider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.lg },
  swapHint: {
    ...type.caption,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  libIntro: { ...type.caption, color: colors.inkSoft, marginTop: -spacing.sm, marginBottom: spacing.md },

  resurface: {
    flexDirection: 'row',
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  resurfaceIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  resurfaceLabel: { ...type.label, fontSize: 10, color: colors.accent, fontWeight: '700' },
  resurfaceText: {
    ...type.body,
    fontSize: 16,
    lineHeight: 23,
    color: colors.ink,
    fontStyle: 'italic',
    marginTop: 4,
  },
  resurfaceAsk: { ...type.caption, fontSize: 13, color: colors.inkSoft, marginTop: 4 },
  unlockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  unlockIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  unlockTitle: { fontFamily: fonts.sansSemibold, fontSize: 15, color: colors.ink },
  unlockSub: { ...type.caption, fontSize: 13, color: colors.inkSoft, marginTop: 1 },

  segment: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.paperDeep,
    borderRadius: radius.lg,
    padding: 3,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  segBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  segActive: { backgroundColor: colors.ink },
  segText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.inkSoft },
  segTextActive: { color: colors.white },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    rowGap: spacing.md,
  },
  gridWide: { justifyContent: 'flex-start', gap: spacing.lg },
  tileWrap: { width: '48%' },
  tileWrapWide: { width: 168 },
  allList: {},
  allListWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: spacing.lg,
  },
  listItemWide: { width: '48%' },

  resultsWrap: { marginTop: spacing.lg },
  resultsHead: { ...type.label, color: colors.inkFaint, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.md },
  emptyTitle: { ...type.heading, color: colors.ink, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.sm },
  emptyBody: { ...type.caption, color: colors.inkSoft, textAlign: 'center', marginBottom: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  chip: { backgroundColor: colors.paperDeep, borderRadius: radius.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  chipText: { ...type.caption, color: colors.inkSoft, fontFamily: fonts.sansSemibold },
});
