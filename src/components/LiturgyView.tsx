import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Liturgy, LiturgySection } from '../content/types';
import { colors, spacing, type, radius } from '../theme/theme';
import { categoryColor, sectionLabel } from '../theme/categories';

type Props = {
  liturgy: Liturgy;
  /** Multiplier for body text size (font-size toggle). */
  fontScale?: number;
  /** Render the built-in title/situation header. */
  showHeader?: boolean;
};

function Section({
  section,
  accent,
  scale,
  dropCap,
}: {
  section: LiturgySection;
  accent: string;
  scale: number;
  dropCap?: boolean;
}) {
  const label = section.label ?? sectionLabel[section.type] ?? '';

  if (section.type === 'scripture') {
    return (
      <View style={[styles.scriptureBlock, { borderLeftColor: accent }]}>
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.scripture, { fontSize: 20 * scale, lineHeight: 32 * scale }]}>
          {section.body}
        </Text>
        {section.reference ? (
          <Text style={styles.reference}>— {section.reference}</Text>
        ) : null}
      </View>
    );
  }

  if (section.type === 'response') {
    return (
      <View style={[styles.responseBlock, { backgroundColor: colors.paperDeep }]}>
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.response, { fontSize: 20 * scale, lineHeight: 28 * scale }]}>
          {section.body}
        </Text>
      </View>
    );
  }

  if (section.type === 'benediction') {
    return (
      <View style={styles.benedictionBlock}>
        <View style={[styles.rule, { backgroundColor: colors.line }]} />
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.benediction, { fontSize: 19 * scale, lineHeight: 31 * scale }]}>
          {section.body}
        </Text>
      </View>
    );
  }

  // call, reflection, prayer
  const bodyStyle = { fontSize: 19 * scale, lineHeight: 31 * scale };
  if (dropCap && section.body.length > 1) {
    const first = section.body.charAt(0);
    const rest = section.body.slice(1);
    return (
      <View style={styles.block}>
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.body, bodyStyle]}>
          <Text style={[styles.dropCap, { color: accent }]}>{first}</Text>
          {rest}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.body, bodyStyle]}>{section.body}</Text>
    </View>
  );
}

export default function LiturgyView({
  liturgy,
  fontScale = 1,
  showHeader = true,
}: Props) {
  const accent = categoryColor(liturgy.category);
  return (
    <View>
      {showHeader && (
        <>
          <Text style={[styles.eyebrow, styles.topEyebrow, { color: accent }]}>
            {`${liturgy.minutes} MIN  ·  A LITURGY`}
          </Text>
          <Text style={styles.title}>{liturgy.title.replace(/^A Liturgy for /, '')}</Text>
          <Text style={styles.situation}>{liturgy.situation}</Text>
          <View style={[styles.divider, { backgroundColor: accent }]} />
        </>
      )}

      {liturgy.sections.map((s, i) => (
        <Section
          key={`${liturgy.id}-${i}`}
          section={s}
          accent={accent}
          scale={fontScale}
          dropCap={i === 0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topEyebrow: {
    marginBottom: spacing.sm,
  },
  eyebrow: {
    ...type.label,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  title: {
    ...type.hero,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  situation: {
    ...type.caption,
    color: colors.inkSoft,
    fontStyle: 'italic',
  },
  divider: {
    width: 44,
    height: 3,
    borderRadius: 2,
    marginVertical: spacing.xl,
  },
  block: {
    marginBottom: spacing.xl,
  },
  body: {
    ...type.body,
    color: colors.ink,
  },
  dropCap: {
    fontFamily: type.body.fontFamily,
    fontSize: 52,
    fontWeight: '700',
  },
  scriptureBlock: {
    borderLeftWidth: 3,
    paddingLeft: spacing.lg,
    marginBottom: spacing.xl,
  },
  scripture: {
    ...type.scripture,
    color: colors.inkSoft,
  },
  reference: {
    ...type.caption,
    color: colors.inkFaint,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  responseBlock: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  response: {
    ...type.heading,
    color: colors.ink,
  },
  benedictionBlock: {
    marginBottom: spacing.lg,
  },
  rule: {
    height: 1,
    marginBottom: spacing.xl,
  },
  benediction: {
    ...type.body,
    color: colors.inkSoft,
    fontStyle: 'italic',
  },
});
