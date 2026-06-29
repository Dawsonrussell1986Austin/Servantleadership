import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Liturgy, LiturgySection } from '../content/types';
import { colors, spacing, type, radius } from '../theme/theme';
import { categoryColor, sectionLabel } from '../theme/categories';

type Props = { liturgy: Liturgy };

function Section({ section, accent }: { section: LiturgySection; accent: string }) {
  const label = section.label ?? sectionLabel[section.type] ?? '';

  if (section.type === 'scripture') {
    return (
      <View style={[styles.scriptureBlock, { borderLeftColor: accent }]}>
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Text style={styles.scripture}>{section.body}</Text>
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
        <Text style={styles.response}>{section.body}</Text>
      </View>
    );
  }

  if (section.type === 'benediction') {
    return (
      <View style={styles.benedictionBlock}>
        <View style={[styles.rule, { backgroundColor: colors.line }]} />
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Text style={styles.benediction}>{section.body}</Text>
      </View>
    );
  }

  // call, reflection, prayer
  return (
    <View style={styles.block}>
      <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
      <Text style={styles.body}>{section.body}</Text>
    </View>
  );
}

export default function LiturgyView({ liturgy }: Props) {
  const accent = categoryColor(liturgy.category);
  return (
    <View>
      <Text style={[styles.eyebrow, styles.topEyebrow, { color: accent }]}>
        {`${liturgy.minutes} MIN  ·  A LITURGY`}
      </Text>
      <Text style={styles.title}>{liturgy.title.replace(/^A Liturgy for /, '')}</Text>
      <Text style={styles.situation}>{liturgy.situation}</Text>

      <View style={[styles.divider, { backgroundColor: accent }]} />

      {liturgy.sections.map((s, i) => (
        <Section key={`${liturgy.id}-${i}`} section={s} accent={accent} />
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
