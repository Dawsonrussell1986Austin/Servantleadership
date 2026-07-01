import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getReadingById } from '../../src/content';
import { useEntitlement } from '../../src/purchases/Entitlements';
import { useProgress } from '../../src/lib/progress';
import { CATEGORIES, categoryOf } from '../../src/content/types';
import { coverFor } from '../../src/content/covers';
import { lengthLabel } from '../../src/content/lengths';
import { categoryColor } from '../../src/theme/categories';
import LiturgyView from '../../src/components/LiturgyView';
import FadeInUp from '../../src/components/FadeInUp';
import PlayerBar from '../../src/components/PlayerBar';
import { useAudio } from '../../src/audio/AudioProvider';
import { colors, spacing, type, fonts } from '../../src/theme/theme';

const FONT_STEPS = [0.9, 1, 1.15, 1.3];

const HERO_SCRIM = [
  'rgba(15,12,9,0.42)',
  'rgba(15,12,9,0.06)',
  'rgba(15,12,9,0.48)',
  'rgba(15,12,9,0.92)',
] as const;

function RoundButton({
  name,
  onPress,
  active,
  label,
  a11yLabel,
}: {
  name?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
  label?: string;
  a11yLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      style={({ pressed }) => [
        styles.roundBtn,
        active && styles.roundBtnActive,
        pressed && { opacity: 0.7 },
      ]}
    >
      {label ? (
        <Text style={[styles.roundBtnLabel, active && { color: colors.ink }]}>
          {label}
        </Text>
      ) : (
        <Ionicons
          name={name ?? 'ellipse'}
          size={20}
          color={active ? colors.ink : colors.white}
        />
      )}
    </Pressable>
  );
}

export default function LiturgyScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const router = useRouter();
  const audio = useAudio();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reading = id ? getReadingById(id) : undefined;
  const { isPremium } = useEntitlement();
  const { markRead } = useProgress();
  const [fontStep, setFontStep] = useState(1);

  // Mark this reading as read once it's open (and allowed to be shown).
  const readingId = reading?.id;
  const canMark = !!reading && (reading.kind === 'devotional' || isPremium);
  useEffect(() => {
    if (readingId && canMark) markRead(readingId);
  }, [readingId, canMark, markRead]);

  // Safety net for deep links: a premium reading opened while locked
  // (e.g. a shared URL) bounces to the paywall instead of the reader.
  const gated = !!reading && reading.kind !== 'devotional' && !isPremium;
  useEffect(() => {
    if (gated) router.replace('/paywall');
  }, [gated, router]);
  if (gated) return <View style={styles.screen} />;

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
  const cat = categoryOf(reading.id);
  const accent = categoryColor(cat);
  const catLabel = CATEGORIES.find((c) => c.id === cat)?.label ?? '';
  const kindLabel = reading.kind === 'devotional' ? 'DEVOTIONAL' : catLabel.toUpperCase();

  // Full-bleed hero across the top third of the screen.
  const heroHeight = Math.max(300, Math.round(height * 0.42));

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image with the title on top */}
        <ImageBackground
          source={coverFor(reading.id)}
          style={{ width: '100%', height: heroHeight }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={HERO_SCRIM}
            locations={[0, 0.28, 0.62, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.heroContent,
              { paddingTop: insets.top + 72, paddingBottom: spacing.xl },
            ]}
          >
            <Text style={[styles.heroKind, { color: colors.white }]}>
              {kindLabel}
            </Text>
            <Text style={styles.heroTitle}>{reading.title}</Text>
            <Text style={styles.heroSituation} numberOfLines={2}>
              {reading.situation}
            </Text>
            <Text style={styles.heroMeta}>{lengthLabel(reading)}</Text>
          </View>
        </ImageBackground>

        {/* Reading */}
        <FadeInUp>
          <View style={styles.body}>
            <View style={[styles.accentRule, { backgroundColor: accent }]} />
            <LiturgyView liturgy={reading} fontScale={fontStep} showHeader={false} />

            <View style={styles.amenWrap}>
              <Text style={styles.amen}>Amen.</Text>
            </View>

            <Text style={styles.credit}>
              Scripture quotations are from the Holy Bible, New International
              Version (NIV). Photography via Pexels.
            </Text>
          </View>
        </FadeInUp>
      </ScrollView>

      {/* Floating controls over the hero */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <RoundButton
          name="chevron-back"
          a11yLabel="Go back"
          onPress={() => router.back()}
        />
        <View style={styles.topRight}>
          <RoundButton
            label="A"
            a11yLabel="Change text size"
            onPress={() =>
              setFontStep((s) => FONT_STEPS[(FONT_STEPS.indexOf(s) + 1) % FONT_STEPS.length])
            }
          />
          <RoundButton
            name={isPlaying ? 'pause' : 'headset'}
            a11yLabel={isPlaying ? 'Pause narration' : 'Listen to this reading'}
            active={isActive}
            onPress={() => audio.toggleReading(reading.id)}
          />
        </View>
      </View>

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

  // Floating top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
    backgroundColor: 'rgba(20,17,13,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  roundBtnLabel: {
    fontFamily: type.heading.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },

  // Hero
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  heroKind: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: spacing.sm,
    opacity: 0.92,
  },
  heroTitle: {
    fontFamily: fonts.displayExtra,
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -0.5,
    color: colors.white,
  },
  heroSituation: {
    ...type.body,
    fontSize: 16,
    lineHeight: 23,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.82)',
    marginTop: spacing.sm,
  },
  heroMeta: {
    fontFamily: fonts.sansSemibold,
    fontSize: 12,
    letterSpacing: 0.3,
    color: 'rgba(255,255,255,0.72)',
    marginTop: spacing.md,
  },

  // Body
  body: {
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  accentRule: {
    width: 44,
    height: 3,
    borderRadius: 2,
    marginBottom: spacing.xl,
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
  credit: {
    ...type.caption,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
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
