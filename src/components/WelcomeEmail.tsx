import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { colors, spacing, type, fonts, radius } from '../theme/theme';

const KEY = 'founded:welcome-email-done';

/**
 * One-time, first-open invitation to get the daily devotional by email —
 * framed as habit support, not marketing. Skippable; never shown again
 * either way.
 */
export default function WelcomeEmail() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (!v) setVisible(true);
    });
  }, []);

  const dismiss = () => {
    setVisible(false);
    AsyncStorage.setItem(KEY, 'done').catch(() => {});
  };

  const subscribe = async () => {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setState('error');
      return;
    }
    setState('sending');
    try {
      const base =
        Platform.OS === 'web'
          ? ''
          : ((Constants.expoConfig?.extra as { audioBaseUrl?: string } | undefined)
              ?.audioBaseUrl ?? '');
      const r = await fetch(`${base}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      });
      if (!r.ok) throw new Error('subscribe failed');
      dismiss();
    } catch {
      setState('error');
    }
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.backdrop} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrap}
        pointerEvents="box-none"
      >
        <View style={styles.card}>
          <Text style={styles.kicker}>A DAILY RHYTHM</Text>
          <Text style={styles.title}>The best habits get help at first.</Text>
          <Text style={styles.body}>
            Start by getting each morning’s devotional in your inbox — until
            showing up here is simply part of your day.
          </Text>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (state === 'error') setState('idle');
            }}
            placeholder="you@company.com"
            placeholderTextColor={colors.inkFaint}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={[styles.input, state === 'error' && styles.inputError]}
          />
          {state === 'error' && (
            <Text style={styles.error}>
              That email didn’t go through — check it and try again.
            </Text>
          )}
          <Pressable
            onPress={subscribe}
            disabled={state === 'sending'}
            accessibilityRole="button"
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          >
            {state === 'sending' ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.ctaText}>Send it each morning</Text>
            )}
          </Pressable>
          <Pressable onPress={dismiss} hitSlop={8} accessibilityRole="button">
            <Text style={styles.skip}>Not now</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,16,12,0.55)',
  },
  wrap: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  card: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  kicker: { ...type.label, color: colors.accent, fontWeight: '700' },
  title: {
    ...type.title,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  body: {
    ...type.caption,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    marginTop: spacing.sm,
  },
  input: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginTop: spacing.lg,
  },
  inputError: { borderColor: colors.accent },
  error: { ...type.caption, fontSize: 13, color: colors.accent, marginTop: spacing.sm },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  ctaText: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.white },
  skip: {
    ...type.caption,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
