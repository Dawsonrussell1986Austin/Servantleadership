import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLiturgyById } from '../../src/content/liturgies';
import LiturgyView from '../../src/components/LiturgyView';
import { colors, spacing, type } from '../../src/theme/theme';

export default function LiturgyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const liturgy = id ? getLiturgyById(id) : undefined;

  if (!liturgy) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.missing}>That liturgy could not be found.</Text>
        <Pressable onPress={() => router.back()} style={styles.linkBtn}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.inkSoft} />
          <Text style={styles.backText}>Close</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <LiturgyView liturgy={liturgy} />

        <View style={styles.amenWrap}>
          <Text style={styles.amen}>Amen.</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    ...type.caption,
    color: colors.inkSoft,
    marginLeft: 2,
  },
  amenWrap: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  amen: {
    ...type.title,
    color: colors.inkFaint,
    fontStyle: 'italic',
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
