import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, CategoryId } from '../../src/content/types';
import { getLiturgiesByCategory } from '../../src/content/liturgies';
import LiturgyCard from '../../src/components/LiturgyCard';
import SearchBar from '../../src/components/SearchBar';
import SearchResults from '../../src/components/SearchResults';
import { useEntitlement } from '../../src/purchases/Entitlements';
import { colors, spacing, type } from '../../src/theme/theme';
import { categoryColor } from '../../src/theme/categories';

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = CATEGORIES.find((c) => c.id === id);
  const liturgies = id ? getLiturgiesByCategory(id) : [];
  const { isPremium } = useEntitlement();
  const locked = !isPremium;
  const [query, setQuery] = useState('');
  const searching = query.trim().length >= 2;

  const open = (lid: string) => {
    Keyboard.dismiss();
    if (locked) {
      router.push('/paywall');
      return;
    }
    router.push(`/liturgy/${lid}`);
  };

  if (!category) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.missing}>Category not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const accent = categoryColor(category.id as CategoryId);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back to the library"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.inkSoft} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
          <Text style={styles.title}>{category.label}</Text>
        </View>
        <Text style={styles.blurb}>{category.blurb}</Text>

        <View style={styles.searchWrap}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
      </View>

      {searching ? (
        <SearchResults query={query} onOpen={open} onSuggest={setQuery} locked={locked} />
      ) : (
        <FlatList
          data={liturgies}
          keyExtractor={(l) => l.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          ListHeaderComponent={
            <Text style={styles.count}>
              {liturgies.length} {liturgies.length === 1 ? 'liturgy' : 'liturgies'}
            </Text>
          }
          renderItem={({ item }) => (
            <LiturgyCard liturgy={item} onPress={() => open(item.id)} locked={locked} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -6,
    marginBottom: spacing.md,
  },
  backText: { ...type.caption, color: colors.inkSoft },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  title: { ...type.hero, fontSize: 30, color: colors.ink },
  blurb: {
    ...type.caption,
    color: colors.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  searchWrap: {},
  count: {
    ...type.label,
    color: colors.inkFaint,
    marginBottom: spacing.md,
  },
  missing: { ...type.body, color: colors.inkSoft, marginBottom: spacing.sm },
  link: { ...type.body, color: colors.accent },
});
