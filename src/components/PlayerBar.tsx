import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAudio, formatMillis } from '../audio/AudioProvider';
import { colors, spacing, fonts, type } from '../theme/theme';

const SCRUB_COLORS = ['#2B2722', '#A8503E', '#C08A4F'] as const;

export default function PlayerBar({ readingId }: { readingId: string }) {
  const audio = useAudio();
  const [trackWidth, setTrackWidth] = useState(0);

  const isActive = audio.currentId === readingId;
  const isPlaying = isActive && audio.isPlaying;
  const isLoading = isActive && audio.isLoading;
  const unavailable = isActive && audio.unavailable;

  const fraction =
    isActive && audio.durationMillis > 0
      ? audio.positionMillis / audio.durationMillis
      : 0;

  const onTrackPress = (e: GestureResponderEvent) => {
    if (!isActive || !trackWidth) return;
    audio.seekToFraction(e.nativeEvent.locationX / trackWidth);
  };

  const onPlayPress = () => {
    if (isActive) audio.togglePlayPause();
    else audio.toggleReading(readingId);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onTrackPress}
        style={styles.track}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <View style={styles.trackBg} />
        <LinearGradient
          colors={SCRUB_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.trackFill, { width: `${Math.max(0, Math.min(1, fraction)) * 100}%` }]}
        />
        <View
          style={[
            styles.thumb,
            { left: Math.max(0, Math.min(trackWidth - 14, fraction * trackWidth - 7)) },
          ]}
        />
      </Pressable>

      <View style={styles.row}>
        <Text style={styles.time}>
          {isActive ? formatMillis(audio.positionMillis) : '0:00'}
        </Text>

        <Pressable
          onPress={onPlayPress}
          style={({ pressed }) => [styles.playBtn, pressed && { opacity: 0.6 }]}
          hitSlop={16}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color={colors.ink}
            />
          )}
        </Pressable>

        <Text style={styles.time}>
          {isActive && audio.durationMillis ? formatMillis(audio.durationMillis) : '—:—'}
        </Text>
      </View>

      {unavailable && (
        <Text style={styles.note}>Narration for this reading isn’t available yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  track: {
    height: 22,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.paperDeep,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.wins,
    borderWidth: 2,
    borderColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    ...type.caption,
    color: colors.inkSoft,
    fontVariant: ['tabular-nums'],
    width: 48,
  },
  playBtn: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    ...type.caption,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
