import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Liturgy } from '../content/types';
import { colors, spacing, type, radius } from '../theme/theme';
import { useAudio } from '../audio/AudioProvider';
import { lengthLabel } from '../content/lengths';
import LiturgyCover from './LiturgyCover';

type Props = {
  liturgy: Liturgy;
  onPress: () => void;
};

export default function LiturgyCard({ liturgy, onPress }: Props) {
  const audio = useAudio();
  const isActive = audio.currentId === liturgy.id;
  const isPlaying = isActive && audio.isPlaying;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LiturgyCover liturgy={liturgy} size="sm" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {liturgy.title.replace(/^A Liturgy for /, 'For ')}
        </Text>
        <Text style={styles.situation} numberOfLines={2}>
          {liturgy.situation}
        </Text>
        <Text style={styles.meta}>{lengthLabel(liturgy)}</Text>
      </View>
      <Pressable
        onPress={() => audio.toggleReading(liturgy.id)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? `Pause ${liturgy.title}` : `Listen to ${liturgy.title}`}
        style={({ pressed }) => [styles.play, pressed && { opacity: 0.7 }]}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={18}
          color={colors.ink}
          style={isPlaying ? undefined : { marginLeft: 2 }}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...type.heading,
    fontSize: 18,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  situation: {
    ...type.caption,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  meta: {
    fontFamily: type.label.fontFamily,
    fontSize: 11.5,
    letterSpacing: 0.2,
    color: colors.inkFaint,
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
