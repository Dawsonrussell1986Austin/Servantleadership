import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio, formatMillis } from '../audio/AudioProvider';
import { colors, spacing, fonts, type } from '../theme/theme';

const SCRUB_COLORS = [colors.accent, colors.accent] as const;

export default function PlayerBar({
  readingId,
  openOnPlay = false,
}: {
  readingId: string;
  /** When pressing play starts narration, also open the reader so the
   * follow-along (highlight + auto-scroll) can do its thing. */
  openOnPlay?: boolean;
}) {
  const audio = useAudio();
  const router = useRouter();
  const [trackWidth, setTrackWidth] = useState(0);

  const isActive = audio.currentId === readingId;
  const isPlaying = isActive && audio.isPlaying;
  const isLoading = isActive && audio.isLoading;
  const unavailable = isActive && audio.unavailable;
  const isSpeech = isActive && audio.mode === 'speech';

  const fraction =
    isActive && audio.durationMillis > 0
      ? audio.positionMillis / audio.durationMillis
      : 0;

  // --- Draggable scrubbing. While the finger is down, `scrub` previews the
  // target position (bar, thumb, and time label all follow live); the actual
  // seek happens once, on release. The refs mirror render-scoped values into
  // the PanResponder's stable closures.
  const [scrub, setScrub] = useState<number | null>(null);
  const canSeek = isActive && !isSpeech; // device speech can't seek
  const canSeekRef = useRef(canSeek);
  canSeekRef.current = canSeek;
  const trackWidthRef = useRef(trackWidth);
  trackWidthRef.current = trackWidth;
  const audioRef = useRef(audio);
  audioRef.current = audio;

  const fractionAt = (x: number) => {
    const w = trackWidthRef.current;
    return w > 0 ? Math.max(0, Math.min(1, x / w)) : 0;
  };
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Keep the gesture even if a parent ScrollView wants it.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        if (canSeekRef.current) setScrub(fractionAt(e.nativeEvent.locationX));
      },
      onPanResponderMove: (e) => {
        if (canSeekRef.current) setScrub(fractionAt(e.nativeEvent.locationX));
      },
      onPanResponderRelease: (e) => {
        if (canSeekRef.current) {
          audioRef.current.seekToFraction(fractionAt(e.nativeEvent.locationX));
        }
        setScrub(null);
      },
      onPanResponderTerminate: () => setScrub(null),
    }),
  ).current;

  const shownFraction = scrub ?? fraction;
  const shownPosition =
    scrub != null && audio.durationMillis > 0
      ? scrub * audio.durationMillis
      : audio.positionMillis;

  const onPlayPress = () => {
    const willStart = !(isActive && audio.isPlaying);
    if (isActive) audio.togglePlayPause();
    else audio.toggleReading(readingId);
    if (openOnPlay && willStart) router.push(`/liturgy/${readingId}`);
  };

  return (
    <View style={styles.wrap}>
      <View
        {...pan.panHandlers}
        style={styles.track}
        hitSlop={{ top: 8, bottom: 8 }}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        {/* Decorations must not intercept touches — otherwise a touch near the
            thumb reports coordinates relative to the thumb and seeks to ~0. */}
        <View pointerEvents="none" style={styles.trackBg} />
        <LinearGradient
          pointerEvents="none"
          colors={SCRUB_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.trackFill,
            { width: `${Math.max(0, Math.min(1, shownFraction)) * 100}%` },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.thumb,
            scrub != null && styles.thumbScrubbing,
            { left: Math.max(0, Math.min(trackWidth - 14, shownFraction * trackWidth - 7)) },
          ]}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.time}>
          {isActive ? formatMillis(shownPosition) : '0:00'}
        </Text>

        <Pressable
          onPress={onPlayPress}
          style={({ pressed }) => [styles.playBtn, pressed && { opacity: 0.6 }]}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause narration' : 'Play narration'}
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

      {isSpeech && !unavailable && (
        <Text style={styles.note}>Read aloud by your device voice.</Text>
      )}
      {unavailable && (
        <Text style={styles.note}>Audio isn’t available on this device.</Text>
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
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.paperDeep,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
  },
  thumbScrubbing: {
    transform: [{ scale: 1.35 }],
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
