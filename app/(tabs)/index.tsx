import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getDailyLiturgy } from '../../src/content/liturgies';
import { colors, spacing, type, radius } from '../../src/theme/theme';
import { categoryColor } from '../../src/theme/categories';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const now = new Date();
  const liturgy = getDailyLiturgy(now);
  const accent = categoryColor(liturgy.category);

  const dateLine = `${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
      }}
    >
      <Text style={styles.kicker}>TODAY’S DEVOTIONAL</Text>
      <Text style={styles.date}>{dateLine}</Text>

      <Pressable
        onPress={() => router.push(`/liturgy/${liturgy.id}`)}
        style={({ pressed }) => [styles.hero, pressed && styles.pressed]}
      >
        <View style={[styles.heroTab, { backgroundColor: accent }]} />
        <View style={styles.heroBody}>
          <Text style={[styles.heroMeta, { color: accent }]}>
            {`A LITURGY  ·  ${liturgy.minutes} MIN`}
          </Text>
          <Text style={styles.heroTitle}>
            {liturgy.title.replace(/^A Liturgy for /, '')}
          </Text>
          <Text style={styles.heroSituation}>{liturgy.situation}</Text>
          <View style={[styles.cta, { backgroundColor: accent }]}>
            <Text style={styles.ctaText}>Begin</Text>
          </View>
        </View>
      </Pressable>

      <Text style={styles.note}>
        Five quiet minutes. Read it slowly. Let the last line follow you into the
        day.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  kicker: {
    ...type.label,
    color: colors.inkFaint,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  date: {
    ...type.title,
    color: colors.ink,
    marginBottom: spacing.xl,
  },
  hero: {
    flexDirection: 'row',
    backgroundColor: colors.paperRaised,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: {
    opacity: 0.85,
  },
  heroTab: {
    width: 8,
  },
  heroBody: {
    flex: 1,
    padding: spacing.xl,
  },
  heroMeta: {
    ...type.label,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...type.hero,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  heroSituation: {
    ...type.body,
    color: colors.inkSoft,
    fontStyle: 'italic',
    marginBottom: spacing.xl,
  },
  cta: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },
  ctaText: {
    color: colors.white,
    fontFamily: type.label.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  note: {
    ...type.caption,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
