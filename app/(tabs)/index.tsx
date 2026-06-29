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
import { LinearGradient } from 'expo-linear-gradient';
import { getDailyDevotional } from '../../src/content/devotionals';
import { LITURGIES } from '../../src/content/liturgies';
import LiturgyCover from '../../src/components/LiturgyCover';
import PlayerBar from '../../src/components/PlayerBar';
import { colors, spacing, type, radius, fonts } from '../../src/theme/theme';

function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// A rotating handful of library liturgies to feature in the carousel.
function featured(date: Date) {
  const day = Math.floor(date.getTime() / 86400000);
  const out = [] as typeof LITURGIES;
  for (let i = 0; i < 7; i++) out.push(LITURGIES[(day + i) % LITURGIES.length]);
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>Servant</Text>
        <LinearGradient
          colors={['#C9A77E', '#9C6B3F']}
          style={styles.avatar}
        >
          <Ionicons name="book" size={16} color={colors.white} />
        </LinearGradient>
      </View>

      {/* Greeting */}
      <View style={styles.greetingWrap}>
        <Text style={styles.greeting}>{greeting(now)}</Text>
        <Text style={styles.subtitle}>
          A few quiet minutes to begin the day well.
        </Text>
      </View>

      {/* Today's devotional — the hero */}
      <Text style={styles.sectionLabel}>TODAY’S DEVOTIONAL</Text>
      <View style={styles.hero}>
        <Pressable
          onPress={() => router.push(`/liturgy/${devotional.id}`)}
          style={({ pressed }) => [styles.heroTop, pressed && { opacity: 0.85 }]}
        >
          <LiturgyCover liturgy={devotional} size="md" />
          <View style={styles.heroText}>
            <Text style={styles.heroKind}>DEVOTIONAL · {devotional.minutes} MIN</Text>
            <Text style={styles.heroTitle}>{devotional.title}</Text>
            <Text style={styles.heroSituation}>{devotional.situation}</Text>
            <View style={styles.readRow}>
              <Text style={styles.readLink}>Read</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.accent} />
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
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
    fontWeight: '600',
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
  greeting: {
    ...type.hero,
    color: colors.ink,
    fontWeight: '600',
  },
  subtitle: {
    ...type.body,
    color: colors.inkFaint,
    marginTop: spacing.xs,
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
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    marginBottom: spacing.xl,
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
    color: colors.accent,
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
    color: colors.accent,
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
    color: colors.accent,
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
