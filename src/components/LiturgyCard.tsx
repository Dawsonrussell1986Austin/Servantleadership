import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Liturgy } from '../content/types';
import { colors, spacing, type, radius } from '../theme/theme';
import { categoryColor } from '../theme/categories';

type Props = {
  liturgy: Liturgy;
  onPress: () => void;
};

export default function LiturgyCard({ liturgy, onPress }: Props) {
  const accent = categoryColor(liturgy.category);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.tab, { backgroundColor: accent }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{liturgy.title.replace(/^A Liturgy for /, 'For ')}</Text>
        <Text style={styles.situation} numberOfLines={2}>
          {liturgy.situation}
        </Text>
        <Text style={[styles.meta, { color: accent }]}>{liturgy.minutes} MIN</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: {
    opacity: 0.7,
  },
  tab: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...type.heading,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  situation: {
    ...type.caption,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  meta: {
    ...type.label,
    fontWeight: '700',
  },
});
