import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { getDailyDevotional } from '../../src/content/devotionals';
import { LITURGIES } from '../../src/content/liturgies';
import LiturgyCover from '../../src/components/LiturgyCover';
import PlayerBar from '../../src/components/PlayerBar';
import { colors, spacing, type, radius, fonts } from '../../src/theme/theme';

const USER_NAME =
  (Constants.expoConfig?.extra as { userName?: string } | undefined)?.userName ??
  'Dawson';

function greeting(d: Date): string {
  const h = d.getHours();
  const base = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return USER_NAME ? `${base}, ${USER_NAME}` : base;
}

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
function dateLine(d: Date): string {
  return `${WEEKDAYS[d.getDay()]} · ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// A rotating, category-diverse handful of library liturgies for the carousel.
function featured(date: Date) {
  const day = Math.floor(date.getTime() / 86400000);
  const out = [] as typeof LITURGIES;
  const seen = new Set<string>();
  for (let i = 0; out.length < 8 && i < LITURGIES.length; i++) {
    const l = LITURGIES[(day + i * 5) % LITURGIES.length];
    if (seen.has(l.id)) continue;
    seen.add(l.id);
    out.push(l);
  }
  return out;
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const now = new Date();
  const devotional = getDailyDevotional(now);
  const carousel = featured(now);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <View style={styles.greetingWrap}>
        <Text style={styles.dateLine}>{dateLine(now)}</Text>
        <Text
          style={styles.greeting}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {greeting(now)}
        </Text>
        <Text style={styles.subtitle}>
          A few quiet minutes to begin the day well.
        </Text>
      </View>

      {/* Today's devotional — the hero */}
      <Text style={styles.sectionLabel}>TODAY’S DEVOTIONAL</Text>
      <View style={styles.hero}>
        <Pressable
          onPress={() => router.push(`/liturgy/${devotional.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Read today’s devotional: ${devotional.title}`}
          style={({ pressed }) => [styles.heroTop, pressed && { opacity: 0.85 }]}
        >
          <LiturgyCover liturgy={devotional} size="md" />
          <View style={styles.heroText}>
            <Text style={styles.heroKind}>DEVOTIONAL</Text>
            <Text style={styles.heroTitle}>{devotional.title}</Text>
            <Text style={styles.heroSituation}>{devotional.situation}</Text>
            <View style={styles.readRow}>
              <Text style={styles.readLink}>Read</Text>
              <Ionicons name="arrow-forward" size={15} color={colors.ink} />
            </View>
          </View>
        </Pressable>

        <View style={styles.heroDivider} />
        <PlayerBar readingId={devotional.id} />
      </View>

      {/* Library carousel */}
      <View style={styles.carouselHead}>
        <Text style={styles.sectionLabel}>FOR THE MOMENT YOU’RE IN</Text>
        <Pressable onPress={() => router.push('/library')} hitSlop={8}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {carousel.map((l) => (
          <Pressable
            key={l.id}
            onPress={() => router.push(`/liturgy/${l.id}`)}
            accessibilityRole="button"
            accessibilityLabel={l.title}
            style={({ pressed }) => [styles.carouselItem, pressed && { opacity: 0.85 }]}
          >
            <LiturgyCover liturgy={l} size="md" />
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.footnote}>
        Read it slowly, or press play and listen. Let the last line follow you
        into the day.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  brand: {
    fontFamily: fonts.sansExtra,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  dateLine: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.inkFaint,
    marginBottom: spacing.sm,
  },
  greeting: {
    fontFamily: fonts.sansExtra,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.7,
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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  hero: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.paperRaised,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroTop: {
    flexDirection: 'row',
  },
  heroText: {
    flex: 1,
    marginLeft: spacing.lg,
    justifyContent: 'center',
  },
  heroKind: {
    ...type.label,
    color: colors.inkFaint,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...type.heading,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  heroSituation: {
    ...type.caption,
    color: colors.inkSoft,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readLink: {
    ...type.caption,
    color: colors.ink,
    fontWeight: '700',
    marginRight: 4,
  },
  heroDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: spacing.lg,
  },
  carouselHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing.lg,
  },
  seeAll: {
    ...type.caption,
    color: colors.inkSoft,
    fontWeight: '700',
  },
  carousel: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  carouselItem: {},
  footnote: {
    ...type.caption,
    color: colors.inkFaint,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
});
