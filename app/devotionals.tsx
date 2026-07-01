import React, { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DEVOTIONALS } from '../src/content';
import LiturgyCover from '../src/components/LiturgyCover';
import { useProgress } from '../src/lib/progress';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';

export default function Devotionals() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hasRead, hasListened, read, listened } = useProgress();

  const doneCount = useMemo(
    () => DEVOTIONALS.filter((d) => read.has(d.id) || listened.has(d.id)).length,
    [read, listened],
  );
  const pct = DEVOTIONALS.length ? doneCount / DEVOTIONALS.length : 0;

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
        <Text style={styles.title}>Devotionals</Text>
        <Text style={styles.sub}>
          {doneCount} of {DEVOTIONALS.length} done — pick up where you left off, or
          catch one you missed.
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` }]} />
        </View>
      </View>

      <FlatList
        data={DEVOTIONALS}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        renderItem={({ item, index }) => {
          const isRead = hasRead(item.id);
          const isListened = hasListened(item.id);
          const done = isRead || isListened;
          return (
            <Pressable
              onPress={() => router.push(`/liturgy/${item.id}`)}
              style={({ pressed }) => [
                styles.row,
                done && styles.rowDone,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.num}>{index + 1}</Text>
              <LiturgyCover liturgy={item} size="sm" />
              <View style={styles.rowText}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.title.replace(/^On /, '')}
                </Text>
                <Text style={styles.rowSit} numberOfLines={2}>
                  {item.situation}
                </Text>
                <View style={styles.badges}>
                  <View style={styles.badge}>
                    <Ionicons
                      name={isRead ? 'checkmark-circle' : 'ellipse-outline'}
                      size={14}
                      color={isRead ? colors.people : colors.inkFaint}
                    />
                    <Text style={[styles.badgeText, isRead && styles.badgeOn]}>Read</Text>
                  </View>
                  <View style={styles.badge}>
                    <Ionicons
                      name={isListened ? 'headset' : 'headset-outline'}
                      size={14}
                      color={isListened ? colors.people : colors.inkFaint}
                    />
                    <Text style={[styles.badgeText, isListened && styles.badgeOn]}>
                      Listened
                    </Text>
                  </View>
                </View>
              </View>
              {done && (
                <View style={styles.doneMark}>
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
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
  sub: { ...type.caption, color: colors.inkSoft, marginTop: spacing.xs },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.paperDeep,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.people,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  rowDone: {
    borderWidth: 1,
    borderColor: 'rgba(78,107,87,0.35)',
  },
  num: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: colors.inkFaint,
    width: 22,
    textAlign: 'center',
    marginRight: spacing.xs,
  },
  rowText: { flex: 1, marginLeft: spacing.md },
  rowTitle: { ...type.heading, fontSize: 17, color: colors.ink },
  rowSit: { ...type.caption, color: colors.inkSoft, marginTop: 2, marginBottom: spacing.sm },
  badges: { flexDirection: 'row', gap: spacing.md },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11,
    letterSpacing: 0.2,
    color: colors.inkFaint,
  },
  badgeOn: { color: colors.people },
  doneMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.people,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
