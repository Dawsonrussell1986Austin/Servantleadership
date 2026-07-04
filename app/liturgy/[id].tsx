import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getReadingById } from '../../src/content';
import { useEntitlement } from '../../src/purchases/Entitlements';
import { useProgress } from '../../src/lib/progress';
import { usePersonal } from '../../src/lib/personal';
import { CATEGORIES, categoryOf } from '../../src/content/types';
import { coverFor } from '../../src/content/covers';
import { lengthLabel } from '../../src/content/lengths';
import { categoryColor } from '../../src/theme/categories';
import LiturgyView, {
  splitSentences,
  nextHighlight,
  type Highlight,
} from '../../src/components/LiturgyView';
import { useWide } from '../../src/components/Bounded';
import FadeInUp from '../../src/components/FadeInUp';
import PlayerBar from '../../src/components/PlayerBar';
import { useAudio } from '../../src/audio/AudioProvider';
import { colors, spacing, type, fonts, radius } from '../../src/theme/theme';

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
  const wide = useWide();
  const router = useRouter();
  const audio = useAudio();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reading = id ? getReadingById(id) : undefined;
  const { mustSubscribe } = useEntitlement();
  const { markRead } = useProgress();
  const { addSaved, addPrayer } = usePersonal();
  const [fontStep, setFontStep] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [prayerOpen, setPrayerOpen] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  // Tap-to-highlight: which words the reader has selected, to save a specific
  // line to "Words That Held Me" instead of the whole section.
  const [highlight, setHighlight] = useState<Highlight | null>(null);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1900);
  };

  // "Read" is earned, not granted on open: it's marked only when the reader
  // scrolls to the bottom of the page. (Finishing the audio marks "listened"
  // separately — see ListenTracker.)
  const readingId = reading?.id;
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!readingId) return;
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 80) {
      markRead(readingId);
    }
  };

  // --- Follow the narration: estimate which sentence is being read from the
  // audio position (weighted by text length), highlight it, dim the other
  // sections, and scroll along.
  const scrollRef = useRef<ScrollView>(null);
  const sectionYs = useRef<Record<number, number>>({});
  const bodyY = useRef(0);
  const followPaused = useRef(false); // user grabbed the page — stop steering
  const sentenceTimeline = useMemo(() => {
    if (!reading) return null;
    const lead = reading.title.length + 40; // spoken title before section one
    const units: { section: number; index: number; weight: number }[] = [];
    reading.sections.forEach((s, si) => {
      const parts = splitSentences(s.body);
      parts.forEach((t, k) => {
        // The section's reference + inter-section pause ride on its last sentence.
        const tail = k === parts.length - 1 ? (s.reference?.length ?? 0) + 60 : 0;
        units.push({ section: si, index: k, weight: t.length + tail });
      });
    });
    const total = units.reduce((a, u) => a + u.weight, lead);
    let acc = lead;
    const starts = units.map((u) => {
      const start = acc / total;
      acc += u.weight;
      return start;
    });
    return { units, starts };
  }, [reading]);

  const isActiveAudio = !!reading && audio.currentId === reading.id;
  const playingThis = isActiveAudio && audio.isPlaying && audio.mode === 'file';
  const fraction =
    isActiveAudio && audio.durationMillis > 0
      ? audio.positionMillis / audio.durationMillis
      : 0;
  let activeSentence: { section: number; index: number } | null = null;
  if (playingThis && sentenceTimeline && sentenceTimeline.units.length > 0) {
    let at = 0;
    for (let i = 0; i < sentenceTimeline.starts.length; i++) {
      if (fraction >= sentenceTimeline.starts[i]) at = i;
    }
    const u = sentenceTimeline.units[at];
    activeSentence = { section: u.section, index: u.index };
  }
  const activeIndex = activeSentence?.section ?? null;

  useEffect(() => {
    if (activeIndex == null || followPaused.current) return;
    const y = sectionYs.current[activeIndex];
    if (y == null) return;
    scrollRef.current?.scrollTo({
      y: Math.max(0, bodyY.current + y - 140),
      animated: true,
    });
  }, [activeIndex]);

  // Resume steering when playback is toggled anew.
  useEffect(() => {
    if (playingThis) followPaused.current = false;
  }, [playingThis]);

  // Safety net for deep links: with no active subscription (and billing live),
  // a shared URL bounces to the paywall instead of the reader.
  const gated = mustSubscribe;
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
  const accent = colors.accent;
  const catLabel = CATEGORIES.find((c) => c.id === cat)?.label ?? '';
  const kindLabel = reading.kind === 'devotional' ? '' : catLabel.toUpperCase();

  const scripture = reading.sections.find((s) => s.type === 'scripture');
  const shareVerse = () =>
    router.push({
      pathname: '/share',
      params: {
        id: reading.id,
        text: scripture?.body ?? reading.title,
        reference: scripture?.reference ?? '',
      },
    });
  const onWordPress = (section: number, word: { start: number; end: number }) =>
    setHighlight((prev) => nextHighlight(prev, section, word));
  const highlightText = highlight
    ? (reading.sections[highlight.section]?.body.slice(highlight.start, highlight.end) ?? '').trim()
    : '';
  const saveHighlight = () => {
    if (!highlight || !highlightText) return;
    const section = reading.sections[highlight.section];
    addSaved({
      readingId: reading.id,
      readingTitle: reading.title,
      text: highlightText,
      reference: section?.type === 'scripture' ? section.reference : undefined,
    });
    setHighlight(null);
    flash('Saved to Words That Held Me');
  };
  const savePrayer = () => {
    const t = prayerText.trim();
    if (!t) {
      setPrayerOpen(false);
      return;
    }
    addPrayer({ readingId: reading.id, readingTitle: reading.title, text: t });
    setPrayerText('');
    Keyboard.dismiss();
    setPrayerOpen(false);
    flash('Prayer saved — I’ll bring it back to you');
  };

  // Full-bleed hero across the top third of the screen.
  const heroHeight = Math.max(300, Math.round(height * 0.42));

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          followPaused.current = true;
        }}
        scrollEventThrottle={250}
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
            {kindLabel !== '' && (
              <Text style={[styles.heroKind, { color: colors.white }]}>
                {kindLabel}
              </Text>
            )}
            <Text style={styles.heroTitle}>{reading.title}</Text>
            <Text style={styles.heroSituation} numberOfLines={2}>
              {reading.situation}
            </Text>
            <Text style={styles.heroMeta}>{lengthLabel(reading)}</Text>
          </View>
        </ImageBackground>

        {/* Reading. The onLayout lives on this outer wrapper — NOT inside
            FadeInUp, whose Animated.View would report y=0 — so bodyY is in
            real scroll-content coordinates and follow-scrolling lands right. */}
        <View
          onLayout={(e) => {
            bodyY.current = e.nativeEvent.layout.y;
          }}
        >
        <FadeInUp>
          <View style={[styles.body, wide && styles.bodyWide]}>
            <View style={[styles.accentRule, { backgroundColor: accent }]} />
            <Text style={styles.highlightHint}>
              Tap a word, then the last word of a line, to highlight and save it.
            </Text>
            <LiturgyView
              liturgy={reading}
              fontScale={fontStep}
              showHeader={false}
              activeIndex={activeIndex}
              activeSentence={activeSentence}
              highlight={highlight}
              onWordPress={onWordPress}
              onSectionLayout={(i, y) => {
                sectionYs.current[i] = y;
              }}
            />

            {/* Actions */}
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => setPrayerOpen(true)}
                style={({ pressed }) => [styles.actionPrimary, pressed && { opacity: 0.9 }]}
              >
                <Text style={styles.actionPrimaryText}>Pray about this</Text>
              </Pressable>
              <Pressable
                onPress={shareVerse}
                style={({ pressed }) => [styles.actionGhost, pressed && { opacity: 0.7 }]}
              >
                <Ionicons name="share-outline" size={18} color={colors.ink} />
                <Text style={styles.actionGhostText}>Share</Text>
              </Pressable>
            </View>

            <View style={styles.amenWrap}>
              <Text style={styles.amen}>Amen.</Text>
            </View>

            <Text style={styles.credit}>
              Scripture quotations are from the Holy Bible, New International
              Version (NIV). Photography via Pexels.
            </Text>
          </View>
        </FadeInUp>
        </View>
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
            name="share-outline"
            a11yLabel="Share a verse"
            onPress={shareVerse}
          />
          <RoundButton
            name={isPlaying ? 'pause' : 'headset'}
            a11yLabel={isPlaying ? 'Pause narration' : 'Listen to this reading'}
            active={isActive}
            onPress={() => audio.toggleReading(reading.id)}
          />
        </View>
      </View>

      {/* Pinned player, with the highlight save bar stacked above it */}
      <View style={[styles.player, { paddingBottom: insets.bottom + spacing.md }]}>
        {highlight && highlightText !== '' && (
          <View style={styles.saveBar}>
            <Text style={styles.savePreview} numberOfLines={2}>
              “{highlightText}”
            </Text>
            <View style={styles.saveActions}>
              <Pressable
                onPress={() => setHighlight(null)}
                hitSlop={8}
                style={({ pressed }) => [styles.saveClear, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="close" size={20} color={colors.inkSoft} />
              </Pressable>
              <Pressable
                onPress={saveHighlight}
                style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}
              >
                <Ionicons name="bookmark" size={16} color={colors.white} />
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        )}
        <PlayerBar readingId={reading.id} />
      </View>

      {/* Toast */}
      {toast && (
        <View style={[styles.toast, { bottom: insets.bottom + 96 }]} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={16} color={colors.white} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* Pray-about-this modal */}
      <Modal
        visible={prayerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPrayerOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPrayerOpen(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalAvoider}
          pointerEvents="box-none"
        >
        <View style={[styles.modalCard, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Text style={styles.modalKicker}>PRAY ABOUT THIS</Text>
          <Text style={styles.modalTitle}>What’s on your heart?</Text>
          <Text style={styles.modalHint}>
            Name the real thing — a decision, payroll, a person. Founded will
            bring it back to you later.
          </Text>
          <TextInput
            value={prayerText}
            onChangeText={setPrayerText}
            placeholder="e.g. Wisdom on the hire I’m deciding…"
            placeholderTextColor={colors.inkFaint}
            multiline
            autoFocus
            style={styles.modalInput}
          />
          <View style={styles.modalActions}>
            <Pressable onPress={() => setPrayerOpen(false)} hitSlop={8}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={savePrayer}
              style={({ pressed }) => [styles.modalSave, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.modalSaveText}>Save prayer</Text>
            </Pressable>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
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
  // On iPad/Mac, keep the reading in a comfortable measure instead of a
  // full-width wall of text.
  bodyWide: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    paddingTop: spacing.xxl,
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

  saveHint: {
    ...type.caption,
    fontSize: 12,
    color: colors.inkFaint,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  highlightHint: {
    ...type.caption,
    fontSize: 12,
    color: colors.inkFaint,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  saveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  savePreview: {
    ...type.body,
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.inkSoft,
  },
  saveActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  saveClear: { padding: 2 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  saveBtnText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.white },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  actionPrimaryText: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.white },
  actionGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.paperDeep,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actionGhostText: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.ink },

  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  toastText: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.white },

  modalAvoider: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(26,22,19,0.45)' },
  modalCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  modalKicker: { ...type.label, color: colors.accent, fontWeight: '700', marginBottom: spacing.sm },
  modalTitle: { ...type.title, fontSize: 24, color: colors.ink },
  modalHint: { ...type.caption, color: colors.inkSoft, marginTop: spacing.xs, marginBottom: spacing.md },
  modalInput: {
    ...type.body,
    fontSize: 17,
    color: colors.ink,
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    minHeight: 96,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  modalCancel: { ...type.body, fontSize: 16, color: colors.inkSoft, fontFamily: fonts.sansSemibold },
  modalSave: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  modalSaveText: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.white },
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
