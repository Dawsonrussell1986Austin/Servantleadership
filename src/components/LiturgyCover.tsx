import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Liturgy, categoryOf } from '../content/types';
import { coverFor } from '../content/covers';
import { shortCategoryLabel } from '../theme/categories';
import { CATEGORY_ICON } from '../theme/categoryIcons';
import { colors, fonts, radius } from '../theme/theme';

type Size = 'sm' | 'md' | 'lg';

const DIMS: Record<Size, { w: number; h: number; pad: number; title: number; label: number; r: number }> = {
  sm: { w: 60, h: 82, pad: 8, title: 12, label: 8, r: 12 },
  md: { w: 132, h: 184, pad: 14, title: 18, label: 9, r: radius.md },
  lg: { w: 152, h: 212, pad: 16, title: 20, label: 10, r: radius.md },
};

const ICONS = CATEGORY_ICON;

function shortTitle(l: Liturgy): string {
  return l.title
    .replace(/^An? (Morning |Evening )?(Liturgy|Devotional)( of| for( the)?)? /i, '')
    .replace(/^(For|Before) (the |a |an )?/i, '')
    .replace(/^On /, '');
}

export default function LiturgyCover({
  liturgy,
  size = 'md',
  text,
}: {
  liturgy: Liturgy;
  size?: Size;
  /** Override the text overlay — pass false for a clean photo (e.g. when the title sits beside the cover). */
  text?: boolean;
}) {
  const d = DIMS[size];
  const cat = categoryOf(liturgy.id);
  const source = coverFor(liturgy.id);
  const catLabel = shortCategoryLabel[cat] ?? '';
  const showText = text ?? size !== 'sm';

  return (
    <View style={[styles.shadow, { width: d.w, height: d.h, borderRadius: d.r }]}>
      <ImageBackground
        source={source}
        style={{ width: d.w, height: d.h }}
        imageStyle={{ borderRadius: d.r }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(15,12,9,0.10)', 'rgba(15,12,9,0.30)', 'rgba(15,12,9,0.82)']}
          locations={[0, 0.45, 1]}
          style={[styles.overlay, { borderRadius: d.r, padding: d.pad }]}
        >
          <View style={styles.top}>
            {showText && (
              <Ionicons
                name={ICONS[cat] ?? 'book-outline'}
                size={size === 'sm' ? 13 : 16}
                color="rgba(255,255,255,0.95)"
              />
            )}
            {showText && liturgy.kind !== 'devotional' && (
              <Text style={[styles.label, { fontSize: d.label }]} numberOfLines={1}>
                {catLabel.toUpperCase()}
              </Text>
            )}
          </View>

          {showText && (
            <View>
              <Text
                style={[styles.title, { fontSize: d.title, lineHeight: d.title * 1.18 }]}
                numberOfLines={4}
              >
                {shortTitle(liturgy)}
              </Text>
              <Text style={styles.minutes}>{liturgy.minutes} MIN READ</Text>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    backgroundColor: colors.paperDeep,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.sansBold,
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 1,
    flexShrink: 1,
    marginLeft: 6,
    textAlign: 'right',
  },
  title: {
    fontFamily: fonts.serif,
    color: colors.white,
    fontWeight: '600',
  },
  minutes: {
    fontFamily: fonts.sansBold,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 6,
  },
});
