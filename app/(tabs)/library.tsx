import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CATEGORIES, Category } from '../../src/content/types';
import { getLiturgiesByCategory } from '../../src/content/liturgies';
import SearchBar from '../../src/components/SearchBar';
import SearchResults from '../../src/components/SearchResults';
import { colors, spacing, type, radius, fonts } from '../../src/theme/theme';
import { categoryGradient } from '../../src/theme/categories';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  pressure: 'flame-outline',
  people: 'people-outline',
  wins: 'sparkles-outline',
  rhythms: 'partly-sunny-outline',
};

function CategoryTile({
  category,
  count,
  onPress,
}: {
  category: Category;
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.label}, ${count} liturgies`}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.88 }]}
    >
      <LinearGradient
        colors={categoryGradient(category.id)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tileGrad}
      >
        <View style={styles.tileTop}>
          <Ionicons
            name={ICONS[category.id] ?? 'book-outline'}
            size={22}
            color="rgba(255,255,255,0.95)"
          />
          <Text style={styles.tileCount}>{count}</Text>
        </View>
        <View>
          <Text style={styles.tileLabel}>{category.label}</Text>
          <Text style={styles.tileBlurb} numberOfLines={2}>
            {category.blurb}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const searching = query.trim().length >= 2;

  const open = (id: string) => {
    Keyboard.dismiss();
    router.push(`/liturgy/${id}`);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.kicker}>THE LIBRARY</Text>
        <Text style={styles.title}>Find the words for your moment.</Text>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      {searching ? (
        <SearchResults query={query} onOpen={open} onSuggest={setQuery} />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
        >
          <Text style={styles.browseHint}>
            Type a moment above, or browse the shelves.
          </Text>
          <View style={styles.grid}>
            {CATEGORIES.map((c) => (
              <CategoryTile
                key={c.id}
                category={c}
                count={getLiturgiesByCategory(c.id).length}
                onPress={() => router.push(`/category/${c.id}`)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  kicker: { ...type.label, color: colors.inkFaint, marginBottom: spacing.xs },
  title: { ...type.title, color: colors.ink, marginBottom: spacing.lg },
  browseHint: {
    ...type.caption,
    color: colors.inkFaint,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  tileGrad: {
    height: 158,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileCount: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
  },
  tileLabel: {
    fontFamily: fonts.serif,
    fontSize: 21,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  tileBlurb: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.82)',
  },
});
