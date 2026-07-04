/**
 * Sign in with Apple — iOS only.
 *
 * Renders nothing on web/Android (the native button and the
 * expo-apple-authentication module only exist on iOS). State lives in the
 * shared account context, so signing in here updates the whole app (and aliases
 * the subscription so it follows the user across devices).
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, radius, fonts } from '../theme/theme';
import { useAccount } from '../lib/account';

export default function AppleSignInButton({
  variant = 'light',
  onSignedIn,
}: {
  /** 'dark' renders the white Apple button + light text, for dark backgrounds. */
  variant?: 'light' | 'dark';
  /** Called after a successful sign-in (e.g. to advance onboarding). */
  onSignedIn?: () => void;
}) {
  const { available, user, signIn, signOut } = useAccount();
  const onDark = variant === 'dark';

  if (Platform.OS !== 'ios' || !available) return null;

  if (user) {
    return (
      <View style={styles.signedIn}>
        <View style={styles.row}>
          <Ionicons name="logo-apple" size={20} color={onDark ? '#FBFAF7' : colors.ink} />
          <Text style={[styles.signedText, onDark && { color: '#FBFAF7' }]}>
            {user.name ? `Signed in as ${user.name}` : 'Signed in with Apple'}
          </Text>
        </View>
        <Pressable onPress={() => void signOut()} hitSlop={8}>
          <Text style={[styles.signOut, onDark && { color: 'rgba(251,250,247,0.6)' }]}>
            Sign out
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={
        onDark
          ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
          : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={radius.md}
      style={styles.button}
      onPress={async () => {
        const ok = await signIn();
        if (ok) onSignedIn?.();
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: { width: '100%', height: 50 },
  signedIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  signedText: {
    ...type.body,
    fontSize: 15,
    fontFamily: fonts.sansMedium,
    color: colors.ink,
    marginLeft: spacing.sm,
  },
  signOut: { ...type.caption, color: colors.inkSoft, fontFamily: fonts.sansSemibold },
});
