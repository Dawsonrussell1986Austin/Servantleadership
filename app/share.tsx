import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import { getReadingById } from '../src/content';
import { colors, spacing, type, fonts, radius } from '../src/theme/theme';

type Variant = { key: string; label: string; text: string; reference?: string };
type Bg = 'cream' | 'clay' | 'dark';

const BG_GRADIENTS: Record<Bg, [string, string]> = {
  cream: ['#FCFAF5', '#F1E9DB'],
  clay: ['#C65A33', '#9E4322'],
  dark: ['#26211B', '#0F0C09'],
};

/** A share-worthy line from the reflection: the first sentence that isn't too
 * short to mean anything or too long to fit a card. */
function pickQuote(body: string): string | null {
  const sentences = body.split(/(?<=[.!?…]["”']?)\s+/);
  const fit = sentences.find((s) => s.length >= 60 && s.length <= 200);
  return fit ?? sentences.sort((a, b) => b.length - a.length)[0] ?? null;
}

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { text, reference, id } = useLocalSearchParams<{
    text?: string;
    reference?: string;
    id?: string;
  }>();
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [variantKey, setVariantKey] = useState('verse');
  const [bg, setBg] = useState<Bg>('cream');

  const variants = useMemo<Variant[]>(() => {
    const out: Variant[] = [];
    const reading = id ? getReadingById(id) : undefined;
    const scripture = reading?.sections.find((s) => s.type === 'scripture');
    const verseText = scripture?.body ?? text ?? '';
    if (verseText) {
      out.push({
        key: 'verse',
        label: 'Verse',
        text: verseText,
        reference: scripture?.reference ?? reference,
      });
    }
    const benediction = reading?.sections.find((s) => s.type === 'benediction');
    if (benediction) {
      out.push({ key: 'blessing', label: 'Blessing', text: benediction.body });
    }
    const reflection = reading?.sections.find((s) => s.type === 'reflection');
    const quote = reflection ? pickQuote(reflection.body) : null;
    if (quote) {
      out.push({ key: 'quote', label: 'Quote', text: quote });
    }
    return out;
  }, [id, text, reference]);

  const variant = variants.find((v) => v.key === variantKey) ?? variants[0];
  const body = (variant?.text ?? '').replace(/^[“"]|[”"]$/g, '');
  const cardW = Math.min(width - spacing.lg * 2, 400);
  const cardH = Math.round(cardW * 1.12);
  // Scale the text down a touch for longer passages.
  const verseSize = body.length > 190 ? 21 : body.length > 120 ? 24 : 27;

  const onDark = bg !== 'cream';
  const inkColor = onDark ? '#FBFAF7' : colors.ink;
  const accentColor = bg === 'clay' ? '#FBE9DF' : colors.accent;
  const faintColor = onDark ? 'rgba(251,250,247,0.6)' : colors.inkFaint;
  const stones: [string, string, string] =
    bg === 'clay'
      ? ['rgba(251,250,247,0.55)', 'rgba(251,250,247,0.8)', '#FBFAF7']
      : ['#E0A98F', '#CB6A4A', colors.accent];

  const share = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      if (Platform.OS === 'web') {
        const res = await fetch(uri);
        const blob = await res.blob();
        const file = new File([blob], 'founded-verse.png', { type: 'image/png' });
        const nav = navigator as any;
        if (nav.canShare && nav.canShare({ files: [file] })) {
          await nav.share({ files: [file] });
        } else {
          const a = document.createElement('a');
          a.href = uri;
          a.download = 'founded-verse.png';
          a.click();
          setMsg('Image saved.');
        }
      } else {
        const Sharing = await import('expo-sharing');
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          setMsg('Sharing isn’t available on this device.');
        }
      }
    } catch {
      setMsg('Couldn’t create the image. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}
      >
        <Ionicons name="close" size={26} color={colors.inkSoft} />
      </Pressable>

      <View style={styles.center}>
        {/* The card that gets captured */}
        <View
          ref={cardRef}
          collapsable={false}
          style={[styles.card, { width: cardW, height: cardH }]}
        >
          <LinearGradient colors={BG_GRADIENTS[bg]} style={StyleSheet.absoluteFill} />
          <View style={styles.cardInner}>
            <View style={styles.cairn}>
              <View style={[styles.stone, { width: 22, backgroundColor: stones[0] }]} />
              <View style={[styles.stone, { width: 34, backgroundColor: stones[1] }]} />
              <View style={[styles.stone, { width: 46, backgroundColor: stones[2] }]} />
            </View>

            <View style={styles.verseWrap}>
              <Text
                style={[
                  styles.verse,
                  {
                    color: inkColor,
                    fontSize: verseSize,
                    lineHeight: Math.round(verseSize * 1.32),
                  },
                ]}
                numberOfLines={9}
              >
                {body}
              </Text>
              {variant?.reference ? (
                <Text style={[styles.reference, { color: accentColor }]}>
                  {variant.reference}
                </Text>
              ) : null}
            </View>

            <View style={styles.footer}>
              <View style={[styles.rule, { backgroundColor: accentColor }]} />
              <Text style={[styles.wordmark, { color: faintColor }]}>
                FOUNDEDAPP.COM
              </Text>
            </View>
          </View>
        </View>

        {/* What to share */}
        {variants.length > 1 && (
          <View style={styles.chips}>
            {variants.map((v) => {
              const active = v.key === variant?.key;
              return (
                <Pressable
                  key={v.key}
                  onPress={() => setVariantKey(v.key)}
                  accessibilityRole="button"
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {v.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Card color */}
        <View style={styles.swatches}>
          {(['cream', 'clay', 'dark'] as Bg[]).map((b) => (
            <Pressable
              key={b}
              onPress={() => setBg(b)}
              accessibilityRole="button"
              accessibilityLabel={`${b} background`}
              style={[styles.swatchWrap, bg === b && styles.swatchActive]}
            >
              <LinearGradient colors={BG_GRADIENTS[b]} style={styles.swatch} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.footerBar, { paddingBottom: insets.bottom + spacing.lg }]}>
        {msg && <Text style={styles.msg}>{msg}</Text>}
        <Pressable
          onPress={share}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        >
          {busy ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="share-outline" size={18} color={colors.white} />
              <Text style={styles.ctaText}>Share this</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.hint}>Send it to a friend, or post it.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: spacing.lg },
  close: { alignSelf: 'flex-end', padding: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  cardInner: {
    flex: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  cairn: { alignItems: 'center', gap: 4 } as any,
  stone: { height: 8, borderRadius: 4 },
  verseWrap: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verse: {
    fontFamily: fonts.display,
    textAlign: 'center',
  },
  reference: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.2,
    marginTop: spacing.lg,
  },
  footer: { alignItems: 'center' },
  rule: { width: 28, height: 2, borderRadius: 1, marginBottom: spacing.sm },
  wordmark: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 3,
  },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.paperDeep,
  },
  chipActive: { backgroundColor: colors.ink },
  chipText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  swatches: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  swatchWrap: {
    borderRadius: 999,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: { borderColor: colors.accent },
  swatch: { width: 28, height: 28, borderRadius: 999 },
  footerBar: { alignItems: 'center' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    justifyContent: 'center',
    minHeight: 52,
  },
  ctaText: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.white },
  hint: { ...type.caption, color: colors.inkFaint, marginTop: spacing.md },
  msg: { ...type.caption, color: colors.accent, marginBottom: spacing.md, textAlign: 'center' },
});
