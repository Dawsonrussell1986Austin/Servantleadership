import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { getDailyDevotional } from '../src/content/devotionals';
import { LITURGIES, getLiturgiesByCategory } from '../src/content/liturgies';
import { CATEGORIES } from '../src/content/types';
import { searchLiturgies } from '../src/content/search';
import LiturgyCover from '../src/components/LiturgyCover';
import LiturgyCard from '../src/components/LiturgyCard';
import CategoryTile from '../src/components/CategoryTile';
import PlayerBar from '../src/components/PlayerBar';
import FadeInUp from '../src/components/FadeInUp';
import SearchBar from '../src/components/SearchBar';
import { useEntitlement } from '../src/purchases/Entitlements';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';

const USER_NAME =
  (Constants.expoConfig?.extra as { userName?: string } | undefined)?.userName ??
  'Dawson';

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function greeting(d: Date): string {
  const h = d.getHours();
  const base = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `${base}, ${USER_NAME}`;
}
function dateLine(d: Date): string {
  return `${WEEKDAYS[d.getDay()]} · ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const SUGGESTIONS = ['Angry client', 'Can’t make payroll', 'Closing a deal', 'Overwhelmed', 'Launch day'];

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPremium } = useEntitlement();
  const locked = !isPremium;
  const now = new Date();
  const devotional = getDailyDevotional(now);

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

  // The daily devotional is always free; the library is premium. Tapping a
  // locked reading opens the paywall instead of the reader.
  const open = (id: string, free = false) => {
    Keyboard.dismiss();
    if (locked && !free) {
      router.push('/paywall');
      return;
    }
    router.push(`/liturgy/${id}`);
  };

  return (
    <ScrollView
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
    >
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
        <Text style={styles.subtitle}>A few quiet minutes to begin the day well.</Text>
      </FadeInUp>

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
          <Pressable
            onPress={() => open(devotional.id, true)}
            accessibilityRole="button"
            accessibilityLabel={`Read today’s devotional: ${devotional.title}`}
            style={({ pressed }) => [styles.heroTop, pressed && { opacity: 0.85 }]}
          >
            <LiturgyCover liturgy={devotional} size="md" />
            <View style={styles.heroText}>
              <Text style={styles.heroKind}>DEVOTIONAL</Text>
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
          <View style={styles.heroDivider} />
          <PlayerBar readingId={devotional.id} />
        </View>
      </FadeInUp>

      {/* Library */}
      <FadeInUp delay={170}>
        <Text style={styles.sectionLabel}>THE LIBRARY</Text>
        <Text style={styles.libIntro}>
          A liturgy for the moment you’re in — search it, or browse the shelves.
        </Text>

        {locked && (
          <Pressable
            onPress={() => router.push('/paywall')}
            accessibilityRole="button"
            accessibilityLabel="Unlock the full library"
            style={({ pressed }) => [styles.unlockBanner, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.unlockIcon}>
              <Ionicons name="lock-open-outline" size={16} color={colors.paper} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.unlockTitle}>Unlock the full library</Text>
              <Text style={styles.unlockSub}>Every liturgy and audio narration.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
          </Pressable>
        )}

        <SearchBar value={query} onChangeText={setQuery} />

        {searching ? (
          <View style={styles.resultsWrap}>
            {results.length > 0 ? (
              <>
                <Text style={styles.resultsHead}>
                  {results.length} {results.length === 1 ? 'liturgy' : 'liturgies'} for “{query.trim()}”
                </Text>
                {results.map((r) => (
                  <LiturgyCard key={r.liturgy.id} liturgy={r.liturgy} onPress={() => open(r.liturgy.id)} locked={locked} />
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
              <View style={styles.grid}>
                {CATEGORIES.map((c, i) => (
                  <FadeInUp key={c.id} delay={i * 45} style={styles.tileWrap}>
                    <CategoryTile
                      category={c}
                      count={getLiturgiesByCategory(c.id).length}
                      onPress={() => router.push(`/category/${c.id}`)}
                    />
                  </FadeInUp>
                ))}
              </View>
            ) : (
              <View style={styles.allList}>
                {allLiturgies.map((l) => (
                  <LiturgyCard key={l.id} liturgy={l} onPress={() => open(l.id)} locked={locked} />
                ))}
              </View>
            )}
          </>
        )}
      </FadeInUp>
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
    color: colors.inkFaint,
  },
  greeting: {
    fontFamily: fonts.displayExtra,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
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
  heroSituation: { ...type.caption, color: colors.inkSoft, fontStyle: 'italic', marginBottom: spacing.md },
  readRow: { flexDirection: 'row', alignItems: 'center' },
  readLink: { ...type.caption, color: colors.ink, fontWeight: '700', marginRight: 4 },
  heroDivider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.lg },
  libIntro: { ...type.caption, color: colors.inkSoft, marginTop: -spacing.sm, marginBottom: spacing.md },

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
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
  },
  tileWrap: { width: 104 },
  allList: {},

  resultsWrap: { marginTop: spacing.lg },
  resultsHead: { ...type.label, color: colors.inkFaint, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.md },
  emptyTitle: { ...type.heading, color: colors.ink, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.sm },
  emptyBody: { ...type.caption, color: colors.inkSoft, textAlign: 'center', marginBottom: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  chip: { backgroundColor: colors.paperDeep, borderRadius: radius.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  chipText: { ...type.caption, color: colors.inkSoft, fontFamily: fonts.sansSemibold },
});
