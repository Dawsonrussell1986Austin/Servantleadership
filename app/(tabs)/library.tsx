import React from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '../../src/content/types';
import { getLiturgiesByCategory } from '../../src/content/liturgies';
import LiturgyCard from '../../src/components/LiturgyCard';
import { colors, spacing, type } from '../../src/theme/theme';
import { categoryColor } from '../../src/theme/categories';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const sections = CATEGORIES.map((c) => ({
    ...c,
    data: getLiturgiesByCategory(c.id),
  })).filter((s) => s.data.length > 0);

  return (
    <SectionList
      style={styles.screen}
      sections={sections}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
      }}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.kicker}>THE LIBRARY</Text>
          <Text style={styles.title}>A liturgy for the moment you’re in.</Text>
          <Text style={styles.subtitle}>
            When you hit it — the hard call, the win, the weight — find the words
            here.
          </Text>
        </View>
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <View
            style={[styles.dot, { backgroundColor: categoryColor(section.id) }]}
          />
          <View style={styles.sectionText}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <Text style={styles.sectionBlurb}>{section.blurb}</Text>
          </View>
        </View>
      )}
      renderItem={({ item }) => (
        <LiturgyCard
          liturgy={item}
          onPress={() => router.push(`/liturgy/${item.id}`)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    marginBottom: spacing.xl,
  },
  kicker: {
    ...type.label,
    color: colors.inkFaint,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  title: {
    ...type.title,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...type.caption,
    color: colors.inkSoft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: spacing.md,
  },
  sectionText: {
    flex: 1,
  },
  sectionLabel: {
    ...type.heading,
    color: colors.ink,
  },
  sectionBlurb: {
    ...type.caption,
    color: colors.inkFaint,
  },
});
