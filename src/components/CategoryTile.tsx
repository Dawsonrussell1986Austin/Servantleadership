import React from 'react';
import { Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Category } from '../content/types';
import { CATEGORY_COVER } from '../content/categoryCovers';
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
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.label}, ${count} devotionals`}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.9 }]}
    >
      <ImageBackground
        source={CATEGORY_COVER[category.id]}
        style={styles.tileImg}
        imageStyle={styles.tileImgRadius}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(15,12,9,0.35)', 'rgba(15,12,9,0.18)', 'rgba(15,12,9,0.82)']}
          locations={[0, 0.4, 1]}
          style={styles.tileOverlay}
        >
          <Text style={styles.tileCount}>{count} DEVOTIONALS</Text>
          <Text
            style={styles.tileLabel}
            numberOfLines={3}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {category.label}
          </Text>
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
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  tileImg: { width: 104, height: 150 },
  tileImgRadius: { borderRadius: radius.md },
  tileOverlay: {
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
    color: 'rgba(255,255,255,0.75)',
  },
  tileLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 18,
    color: colors.white,
  },
});
