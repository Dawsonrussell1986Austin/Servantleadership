import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Liturgy, LiturgySection } from '../content/types';
import { colors, fonts, spacing, type, radius } from '../theme/theme';
import { sectionLabel } from '../theme/categories';

type Props = {
  liturgy: Liturgy;
  /** Multiplier for body text size (font-size toggle). */
  fontScale?: number;
  /** Render the built-in title/situation header. */
  showHeader?: boolean;
  /** Press-and-hold a line to save it. */
  onSaveLine?: (text: string, reference?: string) => void;
};

/**
 * Long sections read as a wall of text, so split them into paragraphs of a
 * few sentences each. Content authors write single blocks; this keeps the
 * data simple while the page stays readable.
 */
function toParagraphs(body: string, sentencesPer = 3): string[] {
  const sentences = body.split(/(?<=[.!?…]["”']?)\s+(?=["“']?[A-Z])/);
  if (sentences.length <= sentencesPer + 1) return [body];
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += sentencesPer) {
    out.push(sentences.slice(i, i + sentencesPer).join(' '));
  }
  // Avoid a lonely one-sentence trailing paragraph.
  if (out.length > 1 && !/[.!?…]/.test(out[out.length - 1].slice(0, -1))) {
    const last = out.pop()!;
    out[out.length - 1] = `${out[out.length - 1]} ${last}`;
  }
  return out;
}

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

  const paras = toParagraphs(section.body);
  return (
    <View style={styles.block}>
      <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
      {paras.map((p, i) => (
        <Text
          key={i}
          style={[styles.body, bodyStyle, i < paras.length - 1 && styles.paragraph]}
        >
          {p}
        </Text>
      ))}
    </View>
  );
}

export default function LiturgyView({
  liturgy,
  fontScale = 1,
  showHeader = true,
  onSaveLine,
}: Props) {
  const accent = colors.accent;
  return (
    <View>
      {showHeader && (
        <>
          <Text style={[styles.eyebrow, styles.topEyebrow, { color: accent }]}>
            {`${liturgy.minutes} MIN  ·  A DEVOTIONAL`}
          </Text>
          <Text style={styles.title}>{liturgy.title.replace(/^A Liturgy for /, '')}</Text>
          <Text style={styles.situation}>{liturgy.situation}</Text>
          <View style={[styles.divider, { backgroundColor: accent }]} />
        </>
      )}

      {liturgy.sections.map((s, i) => (
        <Pressable
          key={`${liturgy.id}-${i}`}
          onLongPress={onSaveLine ? () => onSaveLine(s.body, s.reference) : undefined}
          delayLongPress={300}
        >
          <Section section={s} accent={accent} scale={fontScale} dropCap={i === 0} />
        </Pressable>
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
  paragraph: {
    marginBottom: spacing.md,
  },
  body: {
    ...type.body,
    color: colors.ink,
  },
  dropCap: {
    // Must carry its own lineHeight >= fontSize or iOS clips the glyph's top
    // (the parent paragraph's 31px line box wins otherwise).
    fontFamily: fonts.displayExtra,
    fontSize: 44,
    lineHeight: 46,
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
