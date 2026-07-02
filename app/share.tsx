import React, { useRef, useState } from 'react';
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
import { colors, spacing, type, fonts, radius } from '../src/theme/theme';

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { text, reference } = useLocalSearchParams<{ text: string; reference?: string }>();
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const verse = (text ?? '').replace(/^[“"]|[”"]$/g, '');
  const cardW = Math.min(width - spacing.lg * 2, 400);
  const cardH = Math.round(cardW * 1.12);
  // Scale the verse down a touch for longer passages.
  const verseSize = verse.length > 190 ? 21 : verse.length > 120 ? 24 : 27;

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
        {/* The card that gets captured — cream paper, dark serif verse */}
        <View
          ref={cardRef}
          collapsable={false}
          style={[styles.card, { width: cardW, height: cardH }]}
        >
          <LinearGradient
            colors={['#FCFAF5', '#F1E9DB']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardInner}>
            <View style={styles.cairn}>
              <View style={[styles.stone, { width: 22, backgroundColor: '#E0A98F' }]} />
              <View style={[styles.stone, { width: 34, backgroundColor: '#CB6A4A' }]} />
              <View style={[styles.stone, { width: 46, backgroundColor: colors.accent }]} />
            </View>

            <View style={styles.verseWrap}>
              <Text
                style={[styles.verse, { fontSize: verseSize, lineHeight: Math.round(verseSize * 1.32) }]}
                numberOfLines={9}
              >
                {verse}
              </Text>
              {reference ? <Text style={styles.reference}>{reference}</Text> : null}
            </View>

            <View style={styles.footer}>
              <View style={styles.rule} />
              <Text style={styles.wordmark}>FOUNDED</Text>
            </View>
          </View>
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
              <Text style={styles.ctaText}>Share this verse</Text>
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
    color: colors.ink,
    textAlign: 'center',
  },
  reference: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.accent,
    marginTop: spacing.lg,
  },
  footer: { alignItems: 'center' },
  rule: { width: 28, height: 2, borderRadius: 1, backgroundColor: colors.accent, marginBottom: spacing.sm },
  wordmark: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 3,
    color: colors.inkFaint,
  },
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
