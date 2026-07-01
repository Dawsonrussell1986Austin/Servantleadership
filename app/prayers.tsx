import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePersonal } from '../src/lib/personal';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';

function ago(ts: number): string {
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

export default function Prayers() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prayers, setPrayerAnswered, removePrayer } = usePersonal();

  const open = prayers.filter((p) => !p.answered);
  const answered = prayers.filter((p) => p.answered);
  const data = [...open, ...answered];

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
        <Text style={styles.title}>Prayers</Text>
        <Text style={styles.sub}>
          What you’re carrying to God — and how he answers over time.
        </Text>
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={30} color={colors.inkFaint} />
          <Text style={styles.emptyTitle}>No prayers yet.</Text>
          <Text style={styles.emptyBody}>
            In any reading, tap “Pray about this” to name what’s on your heart.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          renderItem={({ item }) => (
            <View style={[styles.card, item.answered && styles.cardAnswered]}>
              <Text style={styles.prayerText}>{item.text}</Text>
              <Text style={styles.meta}>
                {ago(item.createdAt)} · from “{item.readingTitle}”
              </Text>
              <View style={styles.actions}>
                <Pressable
                  onPress={() => setPrayerAnswered(item.id, !item.answered)}
                  style={({ pressed }) => [
                    styles.answerBtn,
                    item.answered && styles.answerBtnOn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons
                    name={item.answered ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={item.answered ? colors.white : colors.people}
                  />
                  <Text style={[styles.answerText, item.answered && { color: colors.white }]}>
                    {item.answered ? 'Answered' : 'Mark answered'}
                  </Text>
                </Pressable>
                <Pressable onPress={() => removePrayer(item.id)} hitSlop={8} style={styles.trash}>
                  <Ionicons name="trash-outline" size={18} color={colors.inkFaint} />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -6, marginBottom: spacing.md },
  backText: { ...type.caption, color: colors.inkSoft },
  title: { ...type.hero, fontSize: 30, color: colors.ink },
  sub: { ...type.caption, color: colors.inkSoft, marginTop: spacing.xs },

  card: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardAnswered: { opacity: 0.7 },
  prayerText: { ...type.body, fontSize: 17, lineHeight: 26, color: colors.ink },
  meta: { ...type.label, color: colors.inkFaint, marginTop: spacing.md },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  answerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.people,
    borderRadius: radius.lg,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
  },
  answerBtnOn: { backgroundColor: colors.people, borderColor: colors.people },
  answerText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.people },
  trash: { padding: 4 },

  empty: { alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyTitle: { ...type.heading, color: colors.ink, marginTop: spacing.md, marginBottom: spacing.sm },
  emptyBody: { ...type.caption, color: colors.inkSoft, textAlign: 'center' },
});
