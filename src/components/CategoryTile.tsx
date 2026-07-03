import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Category, CATEGORIES } from '../content/types';
import { colors, fonts, radius, tileGradients } from '../theme/theme';

// Rotate through the palette in shelf order so neighboring tiles differ.
function gradientFor(id: string): [string, string] {
  const i = CATEGORIES.findIndex((c) => c.id === id);
  return tileGradients[(i < 0 ? 0 : i) % tileGradients.length];
}

export default function CategoryTile({
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
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.9 }]}
    >
      <LinearGradient
        colors={gradientFor(category.id)}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.tileFill}
      >
        <Text style={styles.tileCount}>{count} LITURGIES</Text>
        <Text style={styles.tileLabel} numberOfLines={3}>
          {category.label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 104,
    height: 150,
    borderRadius: radius.md,
    shadowColor: '#1A1206',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  tileFill: {
    flex: 1,
    borderRadius: radius.md,
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  tileCount: {
    fontFamily: fonts.sansBold,
    fontSize: 8,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.55)',
  },
  tileLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 18,
    color: colors.white,
  },
});
