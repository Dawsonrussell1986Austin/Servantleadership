import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Liturgy } from '../content/types';
import { colors, fonts, radius } from '../theme/theme';
import { categoryGradient } from '../theme/categories';
import { CATEGORIES } from '../content/types';

type Size = 'sm' | 'md' | 'lg';

const DIMS: Record<Size, { w: number; h: number; pad: number; title: number; label: number }> = {
  sm: { w: 58, h: 78, pad: 8, title: 12, label: 8 },
  md: { w: 132, h: 184, pad: 14, title: 18, label: 9 },
  lg: { w: 150, h: 210, pad: 16, title: 20, label: 10 },
};

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  pressure: 'flame-outline',
  people: 'people-outline',
  wins: 'sparkles-outline',
  rhythms: 'partly-sunny-outline',
};

function shortTitle(l: Liturgy): string {
  return l.title.replace(/^An? (Liturgy|Devotional|Morning Liturgy|Evening Liturgy) (for |of |for the )?/i, '').replace(/^On /, '');
}

export default function LiturgyCover({
  liturgy,
  size = 'md',
}: {
  liturgy: Liturgy;
  size?: Size;
}) {
  const d = DIMS[size];
  const grad = categoryGradient(liturgy.category);
  const catLabel =
    CATEGORIES.find((c) => c.id === liturgy.category)?.label ?? '';

  return (
    <LinearGradient
      colors={grad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cover, { width: d.w, height: d.h, padding: d.pad, borderRadius: size === 'sm' ? 8 : radius.md }]}
    >
      <View style={styles.top}>
        <Ionicons
          name={ICONS[liturgy.category] ?? 'book-outline'}
          size={size === 'sm' ? 12 : 16}
          color="rgba(255,255,255,0.85)"
        />
        {size !== 'sm' && (
          <Text style={[styles.label, { fontSize: d.label }]} numberOfLines={1}>
            {(liturgy.kind === 'devotional' ? 'DEVOTIONAL' : catLabel.toUpperCase())}
          </Text>
        )}
      </View>

      <Text
        style={[styles.title, { fontSize: d.title, lineHeight: d.title * 1.2 }]}
        numberOfLines={size === 'sm' ? 3 : 4}
      >
        {shortTitle(liturgy)}
      </Text>

      {size !== 'sm' && (
        <Text style={styles.minutes}>{liturgy.minutes} MIN</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.sans,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1,
    fontWeight: '700',
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
    fontFamily: fonts.sans,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
});
