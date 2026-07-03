import React, { useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchLiturgies } from '../content/search';
import LiturgyCard from './LiturgyCard';
import { colors, spacing, type, radius, fonts } from '../theme/theme';

const SUGGESTIONS = ['Angry client', 'Can’t make payroll', 'Closing a deal', 'Overwhelmed', 'Launch day'];

export default function SearchResults({
  query,
  onOpen,
  onSuggest,
  locked = false,
}: {
  query: string;
  onOpen: (id: string) => void;
  onSuggest: (q: string) => void;
  locked?: boolean;
}) {
  const trimmed = query.trim();
  const results = useMemo(() => {
    const all = searchLiturgies(query);
    const top = all[0]?.score ?? 0;
    const cutoff = top >= 4 ? Math.max(3, top * 0.4) : 1;
    return all.filter((r) => r.score >= cutoff).slice(0, 8);
  }, [query]);

  if (results.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="leaf-outline" size={32} color={colors.inkFaint} />
        <Text style={styles.emptyTitle}>No match yet for “{trimmed}”.</Text>
        <Text style={styles.emptyBody}>
          Try fewer or different words — the feeling underneath, or a plain phrase
          like “angry client,” “cash,” or “letting someone go.”
        </Text>
        <View style={styles.chips}>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s} onPress={() => onSuggest(s)} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(r) => r.liturgy.id}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.listBody}
      ListHeaderComponent={
        <Text style={styles.resultsHead}>
          {results.length} {results.length === 1 ? 'devotional' : 'devotionals'} for “{trimmed}”
        </Text>
      }
      renderItem={({ item }) => (
        <LiturgyCard liturgy={item.liturgy} onPress={() => onOpen(item.liturgy.id)} locked={locked} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  resultsHead: {
    ...type.label,
    color: colors.inkFaint,
    marginBottom: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  emptyTitle: {
    ...type.heading,
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    ...type.caption,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.paperDeep,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipText: {
    ...type.caption,
    color: colors.inkSoft,
    fontFamily: fonts.sansSemibold,
  },
});
