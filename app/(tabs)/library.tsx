import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CATEGORIES, Category } from '../../src/content/types';
import { getLiturgiesByCategory } from '../../src/content/liturgies';
import SearchBar from '../../src/components/SearchBar';
import SearchResults from '../../src/components/SearchResults';
import FadeInUp from '../../src/components/FadeInUp';
import { colors, spacing, type, radius, fonts } from '../../src/theme/theme';
import { categoryColor } from '../../src/theme/categories';
import { CATEGORY_ICON as ICONS } from '../../src/theme/categoryIcons';
import { CATEGORY_COVER } from '../../src/content/categoryCovers';

function CategoryTile({
  category,
  count,
  onPress,
}: {
  category: Category;
  count: number;
  onPress: () => void;
}) {
  const accent = categoryColor(category.id);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.label}, ${count} liturgies`}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.9 }]}
    >
      <ImageBackground
        source={CATEGORY_COVER[category.id]}
        style={styles.tileImg}
        imageStyle={styles.tileImgRadius}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(15,12,9,0.12)', 'rgba(15,12,9,0.34)', 'rgba(15,12,9,0.86)']}
          locations={[0, 0.5, 1]}
          style={styles.tileOverlay}
        >
          {/* book spine — a subtle category-colored edge */}
          <View style={[styles.spine, { backgroundColor: accent }]} />
          <View style={styles.tileTop}>
            <Ionicons
              name={ICONS[category.id] ?? 'book-outline'}
              size={14}
              color="rgba(255,255,255,0.95)"
            />
          </View>
          <View>
            <Text style={styles.tileLabel} numberOfLines={3}>
              {category.label}
            </Text>
            <Text style={styles.tileCount}>{count} LITURGIES</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
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
            {CATEGORIES.map((c, i) => (
              <FadeInUp key={c.id} delay={i * 55} style={styles.tileWrap}>
                <CategoryTile
                  category={c}
                  count={getLiturgiesByCategory(c.id).length}
                  onPress={() => router.push(`/category/${c.id}`)}
                />
              </FadeInUp>
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
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
  },
  tileWrap: {
    width: 104,
  },
  tile: {
    width: 104,
    height: 150,
    borderRadius: radius.md,
    shadowColor: '#1A1206',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  tileImg: {
    width: 104,
    height: 150, // fixed so the image can't stretch on wide screens
  },
  tileImgRadius: {
    borderRadius: radius.md,
  },
  tileOverlay: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    paddingLeft: spacing.sm + 4,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileCount: {
    fontFamily: fonts.sansBold,
    fontSize: 8,
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 3,
  },
  tileLabel: {
    fontFamily: fonts.serif,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.white,
  },
});
