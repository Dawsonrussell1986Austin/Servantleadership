/**
 * Sign in with Apple — iOS only.
 *
 * Renders nothing on web/Android (the native button and the
 * expo-apple-authentication module only exist on iOS). The signed-in user's
 * stable Apple id is persisted so the app can recognise a returning user; the
 * app stores no personal data beyond that opaque id.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { colors, spacing, type, radius, fonts } from '../theme/theme';
import { getItem, setItem, removeItem } from '../lib/storage';

const APPLE_USER_KEY = 'servant.appleUser';

type StoredUser = { id: string; name: string | null };

export default function AppleSignInButton() {
  const [available, setAvailable] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync()
      .then(setAvailable)
      .catch(() => setAvailable(false));
    getItem<StoredUser | null>(APPLE_USER_KEY, null).then(setUser);
  }, []);

  if (Platform.OS !== 'ios' || !available) return null;

  const signIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const name =
        credential.fullName?.givenName ?? user?.name ?? null;
      const stored: StoredUser = { id: credential.user, name };
      setUser(stored);
      await setItem(APPLE_USER_KEY, stored);
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') return; // user backed out
    }
  };

  const signOut = async () => {
    setUser(null);
    await removeItem(APPLE_USER_KEY);
  };

  if (user) {
    return (
      <View style={styles.signedIn}>
        <View style={styles.row}>
          <Ionicons name="logo-apple" size={20} color={colors.ink} />
          <Text style={styles.signedText}>
            {user.name ? `Signed in as ${user.name}` : 'Signed in with Apple'}
          </Text>
        </View>
        <Pressable onPress={signOut} hitSlop={8}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={radius.md}
      style={styles.button}
      onPress={signIn}
    />
  );
}

const styles = StyleSheet.create({
  button: { width: '100%', height: 48 },
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
