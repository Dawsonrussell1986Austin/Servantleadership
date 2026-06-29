import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SectionList,
  FlatList,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../../src/content/types';
import { getLiturgiesByCategory } from '../../src/content/liturgies';
import { searchLiturgies } from '../../src/content/search';
import LiturgyCard from '../../src/components/LiturgyCard';
import { colors, spacing, type, radius, fonts } from '../../src/theme/theme';
import { categoryColor } from '../../src/theme/categories';

const SUGGESTIONS = ['Angry client', 'Can’t make payroll', 'Closing a deal', 'Overwhelmed', 'Launch day'];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const searching = trimmed.length >= 2;

  const results = useMemo(() => {
    const all = searchLiturgies(query);
    const top = all[0]?.score ?? 0;
    // When there's a strong match, hide weak/noisy ones; otherwise show the
    // loose matches so the user still gets something.
    const cutoff = top >= 4 ? Math.max(3, top * 0.4) : 1;
    return all.filter((r) => r.score >= cutoff).slice(0, 8);
  }, [query]);

  const sections = CATEGORIES.map((c) => ({
    ...c,
    data: getLiturgiesByCategory(c.id),
  })).filter((s) => s.data.length > 0);

  const open = (id: string) => {
    Keyboard.dismiss();
    router.push(`/liturgy/${id}`);
  };

  return (
    <View style={styles.screen}>
      {/* Fixed header with title + search */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.kicker}>THE LIBRARY</Text>
        <Text style={styles.title}>Find the words for your moment.</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.inkFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Describe what you’re going through…"
            placeholderTextColor={colors.inkFaint}
            style={styles.input}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.inkFaint} />
            </Pressable>
          )}
        </View>
      </View>

      {searching ? (
        results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(r) => r.liturgy.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listBody}
            ListHeaderComponent={
              <Text style={styles.resultsHead}>
                {results.length} {results.length === 1 ? 'liturgy' : 'liturgies'} for “{trimmed}”
              </Text>
            }
            renderItem={({ item }) => (
              <LiturgyCard liturgy={item.liturgy} onPress={() => open(item.liturgy.id)} />
            )}
          />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={32} color={colors.inkFaint} />
            <Text style={styles.emptyTitle}>No match yet for “{trimmed}”.</Text>
            <Text style={styles.emptyBody}>
              Try fewer or different words — the feeling underneath, or a plain phrase
              like “angry client,” “cash,” or “letting someone go.”
            </Text>
            <View style={styles.chips}>
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} onPress={() => setQuery(s)} style={styles.chip}>
                  <Text style={styles.chipText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listBody}
          ListHeaderComponent={
            <Text style={styles.browseHint}>
              Type a moment above, or browse by season of the work.
            </Text>
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View style={[styles.dot, { backgroundColor: categoryColor(section.id) }]} />
              <View style={styles.sectionText}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
                <Text style={styles.sectionBlurb}>{section.blurb}</Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <LiturgyCard liturgy={item} onPress={() => open(item.id)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  kicker: {
    ...type.label,
    color: colors.inkFaint,
    marginBottom: spacing.xs,
  },
  title: {
    ...type.title,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperRaised,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.ink,
    // remove the browser focus ring on web
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
  },
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
  browseHint: {
    ...type.caption,
    color: colors.inkFaint,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: spacing.md,
  },
  sectionText: {
    flex: 1,
  },
  sectionLabel: {
    ...type.heading,
    color: colors.ink,
  },
  sectionBlurb: {
    ...type.caption,
    color: colors.inkFaint,
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
