import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePersonal } from '../src/lib/personal';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';

export default function Saved() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saved, removeSaved } = usePersonal();

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
        <Text style={styles.title}>Words That Held Me</Text>
        <Text style={styles.sub}>Lines you saved to come back to.</Text>
      </View>

      {saved.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={30} color={colors.inkFaint} />
          <Text style={styles.emptyTitle}>Nothing saved yet.</Text>
          <Text style={styles.emptyBody}>
            While reading, tap a word and then the end of a line to highlight
            it — then Save to keep it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable onPress={() => router.push(`/liturgy/${item.readingId}`)}>
                <Text style={styles.quote}>“{item.text.replace(/^[“"]|[”"]$/g, '')}”</Text>
                <Text style={styles.source}>
                  {item.reference ? `${item.reference} · ` : ''}
                  {item.readingTitle}
                </Text>
              </Pressable>
              <View style={styles.actions}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/share',
                      params: { text: item.text, reference: item.reference ?? '' },
                    })
                  }
                  hitSlop={8}
                  style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
                >
                  <Ionicons name="share-outline" size={18} color={colors.inkSoft} />
                </Pressable>
                <Pressable
                  onPress={() => removeSaved(item.id)}
                  hitSlop={8}
                  style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
                >
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
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  quote: { ...type.scripture, fontSize: 18, lineHeight: 28, color: colors.ink },
  source: { ...type.label, color: colors.inkFaint, marginTop: spacing.md },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionBtn: { padding: 4 },

  empty: { alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyTitle: { ...type.heading, color: colors.ink, marginTop: spacing.md, marginBottom: spacing.sm },
  emptyBody: { ...type.caption, color: colors.inkSoft, textAlign: 'center' },
});
