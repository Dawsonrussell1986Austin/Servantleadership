import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../content/types';
import { CATEGORY_COVER } from '../content/categoryCovers';
import { categoryColor } from '../theme/categories';
import { CATEGORY_ICON } from '../theme/categoryIcons';
import { colors, fonts, radius } from '../theme/theme';

export default function CategoryTile({
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
          <View style={[styles.spine, { backgroundColor: accent }]} />
          <View style={styles.tileTop}>
            <Ionicons
              name={CATEGORY_ICON[category.id] ?? 'book-outline'}
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

const styles = StyleSheet.create({
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
  tileImg: { width: 104, height: 150 },
  tileImgRadius: { borderRadius: radius.md },
  tileOverlay: {
    flex: 1,
    borderRadius: radius.md,
    padding: 10,
    paddingLeft: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  spine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  tileTop: { flexDirection: 'row', alignItems: 'center' },
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
