import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DEVOTIONALS, scheduledDevotionalId } from '../src/content';
import { coverFor } from '../src/content/covers';
import LiturgyCover from '../src/components/LiturgyCover';
import { useProgress } from '../src/lib/progress';
import { colors, spacing, type, radius, fonts } from '../src/theme/theme';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function Devotionals() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hasRead, hasListened, read, listened } = useProgress();

  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [monthOffset, setMonthOffset] = useState(0);

  const today = startOfDay(new Date());
  const base = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();

  const isDone = (id: string) => read.has(id) || listened.has(id);

  const { cells, done, missed } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const out: ({ day: number; date: Date; id: string; state: string } | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    let doneN = 0;
    let missedN = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const id = scheduledDevotionalId(date);
      const d = isDone(id);
      const isToday = date.getTime() === today.getTime();
      const isPast = date.getTime() < today.getTime();
      let state = 'future';
      if (d) state = 'done';
      else if (isToday) state = 'today';
      else if (isPast) state = 'missed';
      if (d) doneN++;
      if (state === 'missed') missedN++;
      out.push({ day, date, id, state });
    }
    return { cells: out, done: doneN, missed: missedN };
  }, [year, month, read, listened, today]);

  const open = (id: string) => router.push(`/liturgy/${id}`);

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

        <View style={styles.segment}>
          {(['calendar', 'list'] as const).map((v) => {
            const active = view === v;
            return (
              <Pressable
                key={v}
                onPress={() => setView(v)}
                style={[styles.segBtn, active && styles.segActive]}
              >
                <Ionicons
                  name={v === 'calendar' ? 'calendar-outline' : 'list-outline'}
                  size={15}
                  color={active ? colors.white : colors.inkSoft}
                />
                <Text style={[styles.segText, active && styles.segTextActive]}>
                  {v === 'calendar' ? 'Calendar' : 'List'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {view === 'calendar' ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Month nav */}
          <View style={styles.monthRow}>
            <Pressable onPress={() => setMonthOffset((m) => m - 1)} hitSlop={12}>
              <Ionicons name="chevron-back" size={22} color={colors.inkSoft} />
            </Pressable>
            <Text style={styles.monthLabel}>
              {MONTHS[month]} {year}
            </Text>
            <Pressable onPress={() => setMonthOffset((m) => m + 1)} hitSlop={12}>
              <Ionicons name="chevron-forward" size={22} color={colors.inkSoft} />
            </Pressable>
          </View>

          {/* Weekday header */}
          <View style={styles.weekRow}>
            {WD.map((w, i) => (
              <Text key={i} style={styles.weekday}>
                {w}
              </Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={styles.grid}>
            {cells.map((c, i) => {
              if (!c) return <View key={`b${i}`} style={styles.cell} />;
              const done = c.state === 'done';
              return (
                <Pressable
                  key={c.day}
                  onPress={() => open(c.id)}
                  style={styles.cell}
                  accessibilityRole="button"
                  accessibilityLabel={`${MONTHS[month]} ${c.day}, devotional ${c.state}`}
                >
                  <ImageBackground
                    source={coverFor(c.id)}
                    style={styles.thumb}
                    imageStyle={[styles.thumbImg, !done && styles.thumbImgOff]}
                  >
                    {c.state === 'today' && <View style={styles.todayRing} pointerEvents="none" />}
                    <View style={[styles.dayBadge, done && styles.dayBadgeOn]}>
                      <Text style={styles.dayBadgeText}>{c.day}</Text>
                    </View>
                    {done && (
                      <View style={styles.doneTick}>
                        <Ionicons name="checkmark" size={11} color={colors.white} />
                      </View>
                    )}
                  </ImageBackground>
                </Pressable>
              );
            })}
          </View>

          {/* Summary + legend */}
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {done} done{missed > 0 ? ` · ${missed} missed` : ''} this month
            </Text>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>Done — in color</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendMissed]} />
                <Text style={styles.legendText}>Not yet — faded</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={DEVOTIONALS}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          renderItem={({ item, index }) => {
            const r = hasRead(item.id);
            const l = hasListened(item.id);
            const done = r || l;
            return (
              <Pressable
                onPress={() => open(item.id)}
                style={({ pressed }) => [styles.row, done && styles.rowDone, pressed && { opacity: 0.85 }]}
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
                        name={r ? 'checkmark-circle' : 'ellipse-outline'}
                        size={14}
                        color={r ? colors.people : colors.inkFaint}
                      />
                      <Text style={[styles.badgeText, r && styles.badgeOn]}>Read</Text>
                    </View>
                    <View style={styles.badge}>
                      <Ionicons
                        name={l ? 'headset' : 'headset-outline'}
                        size={14}
                        color={l ? colors.people : colors.inkFaint}
                      />
                      <Text style={[styles.badgeText, l && styles.badgeOn]}>Listened</Text>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -6, marginBottom: spacing.md },
  backText: { ...type.caption, color: colors.inkSoft },
  title: { ...type.hero, fontSize: 30, color: colors.ink },

  segment: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.paperDeep,
    borderRadius: radius.lg,
    padding: 3,
    marginTop: spacing.md,
  },
  segBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  segActive: { backgroundColor: colors.ink },
  segText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.inkSoft },
  segTextActive: { color: colors.white },

  // Calendar
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  monthLabel: { ...type.heading, fontSize: 19, color: colors.ink },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.inkFaint,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3,
  },
  thumb: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.paperDeep,
  },
  thumbImg: { borderRadius: 10 },
  // Not done → faint, desaturated ghost over paper.
  thumbImgOff: { opacity: 0.16 },
  dayBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,22,19,0.30)',
  },
  dayBadgeOn: { backgroundColor: 'rgba(26,22,19,0.55)' },
  dayBadgeText: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.white },
  todayRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: colors.accent,
    zIndex: 2,
  },
  doneTick: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summary: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
  },
  summaryText: { ...type.heading, fontSize: 16, color: colors.ink, marginBottom: spacing.md },
  legend: { flexDirection: 'row', gap: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 7 },
  legendMissed: { backgroundColor: colors.paperRaised, borderWidth: 1, borderColor: colors.line },
  legendToday: { backgroundColor: colors.paper, borderWidth: 2, borderColor: colors.ink },
  legendText: { ...type.caption, fontSize: 12, color: colors.inkSoft },

  // List
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
  rowDone: { borderWidth: 1, borderColor: 'rgba(78,107,87,0.35)' },
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
  badgeText: { fontFamily: fonts.sansSemibold, fontSize: 11, letterSpacing: 0.2, color: colors.inkFaint },
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
