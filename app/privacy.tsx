import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, fonts } from '../src/theme/theme';

/**
 * Privacy policy — also serves as the public Privacy Policy URL required by
 * App Store Connect (https://servant-liturgies.vercel.app/privacy).
 */
export default function Privacy() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.inkSoft} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated June 30, 2026</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <P>
          Founded is a reading app. It is designed to be used without an account
          and without collecting personal information. This policy explains the
          little data the app does and does not handle.
        </P>

        <H>Information we do not collect</H>
        <P>
          Founded does not ask for your name, email, contacts, location, photos,
          or any personal profile. The devotionals and liturgies are delivered
          as content to read and listen to — there is nothing for you to fill in.
        </P>

        <H>Information stored on your device</H>
        <P>
          Your reminder preference (whether daily reminders are on, and the time
          you chose) is stored locally on your device so the app remembers your
          setting. It never leaves your device.
        </P>

        <H>Sign in with Apple (optional)</H>
        <P>
          If you choose to sign in with Apple, we receive only an anonymous
          identifier from Apple. We use it solely to recognize a returning
          customer and restore access to any purchase. We do not store your name
          or email, and there is no server-side account.
        </P>

        <H>Purchases</H>
        <P>
          If you subscribe, the purchase is processed by Apple and managed
          through RevenueCat, our subscription provider, to verify and restore
          your entitlement. This involves an anonymous purchase identifier — not
          your personal identity. Payment details are handled entirely by Apple
          and are never seen by us. See Apple’s and RevenueCat’s privacy policies
          for how they process payment and subscription data.
        </P>

        <H>Notifications</H>
        <P>
          Daily reminders are scheduled locally on your device by iOS. Enabling
          them does not send any data to us.
        </P>

        <H>Children</H>
        <P>
          Founded is intended for a general audience and does not knowingly
          collect information from children.
        </P>

        <H>Changes</H>
        <P>
          If this policy changes, we will update the date above and post the
          revised version here.
        </P>

        <H>Contact</H>
        <P>
          Questions about this policy can be sent to dawson@raiselaunch.com.
        </P>
      </ScrollView>
    </View>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <Text style={styles.h}>{children}</Text>;
}
function P({ children }: { children: React.ReactNode }) {
  return <Text style={styles.p}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -6,
    marginBottom: spacing.md,
  },
  backText: { ...type.caption, color: colors.inkSoft },
  title: { ...type.hero, fontSize: 30, color: colors.ink },
  updated: { ...type.caption, color: colors.inkFaint, marginTop: spacing.xs },
  h: {
    fontFamily: fonts.displaySemibold,
    fontSize: 18,
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  p: { ...type.body, fontSize: 16, lineHeight: 26, color: colors.inkSoft },
});
