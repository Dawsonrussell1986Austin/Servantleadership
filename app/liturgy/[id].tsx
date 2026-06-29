import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getReadingById, readingKindLabel } from '../../src/content';
import { CATEGORIES } from '../../src/content/types';
import LiturgyView from '../../src/components/LiturgyView';
import LiturgyCover from '../../src/components/LiturgyCover';
import PlayerBar from '../../src/components/PlayerBar';
import { useAudio } from '../../src/audio/AudioProvider';
import { colors, spacing, type } from '../../src/theme/theme';

const FONT_STEPS = [0.9, 1, 1.15, 1.3];

function RoundButton({
  name,
  onPress,
  active,
  label,
}: {
  name?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.roundBtn,
        active && styles.roundBtnActive,
        pressed && { opacity: 0.7 },
      ]}
    >
      {label ? (
        <Text style={[styles.roundBtnLabel, active && { color: colors.white }]}>
          {label}
        </Text>
      ) : (
        <Ionicons
          name={name ?? 'ellipse'}
          size={20}
          color={active ? colors.white : colors.inkSoft}
        />
      )}
    </Pressable>
  );
}

export default function LiturgyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const audio = useAudio();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reading = id ? getReadingById(id) : undefined;
  const [fontStep, setFontStep] = useState(1);

  if (!reading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.missing}>That reading could not be found.</Text>
        <Pressable onPress={() => router.back()} style={styles.linkBtn}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const isActive = audio.currentId === reading.id;
  const isPlaying = isActive && audio.isPlaying;
  const catLabel = CATEGORIES.find((c) => c.id === reading.category)?.label ?? '';

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <RoundButton name="chevron-back" onPress={() => router.back()} />
        <View style={styles.topRight}>
          <RoundButton
            label="A"
            onPress={() =>
              setFontStep((s) => FONT_STEPS[(FONT_STEPS.indexOf(s) + 1) % FONT_STEPS.length])
            }
          />
          <RoundButton
            name={isPlaying ? 'pause' : 'headset'}
            active={isActive}
            onPress={() => audio.toggleReading(reading.id)}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: 200,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating cover + centered title */}
        <View style={styles.coverWrap}>
          <LiturgyCover liturgy={reading} size="lg" />
        </View>
        <Text style={styles.kind}>
          {(reading.kind === 'devotional' ? 'DEVOTIONAL' : catLabel.toUpperCase())}
        </Text>
        <Text style={styles.title}>{reading.title}</Text>
        <Text style={styles.subtitle}>{reading.situation}</Text>

        <View style={styles.divider} />

        <LiturgyView liturgy={reading} fontScale={fontStep} showHeader={false} />

        <View style={styles.amenWrap}>
          <Text style={styles.amen}>Amen.</Text>
        </View>
      </ScrollView>

      {/* Pinned player */}
      <View style={[styles.player, { paddingBottom: insets.bottom + spacing.md }]}>
        <PlayerBar readingId={reading.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  topRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnActive: {
    backgroundColor: colors.ink,
  },
  roundBtnLabel: {
    fontFamily: type.heading.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  coverWrap: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  kind: {
    ...type.label,
    color: colors.accent,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...type.title,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    ...type.caption,
    color: colors.inkSoft,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  divider: {
    alignSelf: 'center',
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginVertical: spacing.xl,
  },
  amenWrap: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  amen: {
    ...type.title,
    color: colors.inkFaint,
    fontStyle: 'italic',
  },
  player: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paperRaised,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  missing: {
    ...type.body,
    color: colors.inkSoft,
    marginBottom: spacing.md,
  },
  linkBtn: {
    padding: spacing.sm,
  },
  link: {
    ...type.body,
    color: colors.accent,
  },
});
