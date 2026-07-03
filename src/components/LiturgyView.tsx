import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Liturgy, LiturgySection } from '../content/types';
import { colors, spacing, type, radius } from '../theme/theme';
import { sectionLabel } from '../theme/categories';

type ActiveSentence = { section: number; index: number };

type Props = {
  liturgy: Liturgy;
  /** Multiplier for body text size (font-size toggle). */
  fontScale?: number;
  /** Render the built-in title/situation header. */
  showHeader?: boolean;
  /** Press-and-hold a line to save it. */
  onSaveLine?: (text: string, reference?: string) => void;
  /** Index of the section the narration is currently reading (dims the rest). */
  activeIndex?: number | null;
  /** The sentence the narration is currently reading (read-along highlight). */
  activeSentence?: ActiveSentence | null;
  /** Reports each section's y-offset within this view, for follow-scrolling. */
  onSectionLayout?: (index: number, y: number) => void;
};

/**
 * Split a section body into sentences. Shared with the narration read-along
 * estimate in the reader screen — both sides must split identically or the
 * highlight drifts from the timeline.
 */
export function splitSentences(body: string): string[] {
  return body.split(/(?<=[.!?…]["”']?)\s+(?=["“']?[A-Z])/);
}

/**
 * Long sections read as a wall of text, so group sentences into paragraphs of
 * a few each. Content authors write single blocks; this keeps the data simple
 * while the page stays readable.
 */
function toParagraphChunks(sentences: string[], sentencesPer = 3): string[][] {
  if (sentences.length <= sentencesPer + 1) return [sentences];
  const out: string[][] = [];
  for (let i = 0; i < sentences.length; i += sentencesPer) {
    out.push(sentences.slice(i, i + sentencesPer));
  }
  // Avoid a lonely one-sentence trailing paragraph.
  if (out.length > 1 && out[out.length - 1].length === 1) {
    const last = out.pop()!;
    out[out.length - 1] = [...out[out.length - 1], ...last];
  }
  return out;
}

/** Sentence spans with the one being narrated softly highlighted. */
function Sentences({
  sentences,
  offset,
  active,
}: {
  sentences: string[];
  /** Index of sentences[0] within the whole section. */
  offset: number;
  /** Active sentence index within the whole section, or null. */
  active: number | null;
}) {
  return (
    <>
      {sentences.map((t, k) => (
        <Text key={k} style={active === offset + k ? styles.readAlong : undefined}>
          {t}
          {k < sentences.length - 1 ? ' ' : ''}
        </Text>
      ))}
    </>
  );
}

function Section({
  section,
  accent,
  scale,
  activeSentence,
}: {
  section: LiturgySection;
  accent: string;
  scale: number;
  /** Active sentence index within this section, or null. */
  activeSentence: number | null;
}) {
  const label = section.label ?? sectionLabel[section.type] ?? '';
  const sentences = splitSentences(section.body);

  if (section.type === 'scripture') {
    return (
      <View style={[styles.scriptureBlock, { borderLeftColor: accent }]}>
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.scripture, { fontSize: 20 * scale, lineHeight: 32 * scale }]}>
          <Sentences sentences={sentences} offset={0} active={activeSentence} />
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
          <Sentences sentences={sentences} offset={0} active={activeSentence} />
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
          <Sentences sentences={sentences} offset={0} active={activeSentence} />
        </Text>
      </View>
    );
  }

  // call, reflection, prayer — the drop cap was retired: its oversized line
  // box made the opening paragraph's spacing read wrong on iOS.
  const bodyStyle = { fontSize: 19 * scale, lineHeight: 31 * scale };
  const chunks = toParagraphChunks(sentences);
  let offset = 0;
  return (
    <View style={styles.block}>
      <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
      {chunks.map((chunk, i) => {
        const start = offset;
        offset += chunk.length;
        return (
          <Text
            key={i}
            style={[styles.body, bodyStyle, i < chunks.length - 1 && styles.paragraph]}
          >
            <Sentences sentences={chunk} offset={start} active={activeSentence} />
          </Text>
        );
      })}
    </View>
  );
}

export default function LiturgyView({
  liturgy,
  fontScale = 1,
  showHeader = true,
  onSaveLine,
  activeIndex = null,
  activeSentence = null,
  onSectionLayout,
}: Props) {
  const accent = colors.accent;
  const following = activeIndex != null;
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
          onLayout={
            onSectionLayout
              ? (e) => onSectionLayout(i, e.nativeEvent.layout.y)
              : undefined
          }
          style={following && i !== activeIndex ? styles.dimmed : undefined}
        >
          <Section
            section={s}
            accent={accent}
            scale={fontScale}
            activeSentence={
              activeSentence && activeSentence.section === i ? activeSentence.index : null
            }
          />
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
  dimmed: {
    opacity: 0.4,
  },
  // The sentence being narrated: a soft accent wash behind the words.
  readAlong: {
    backgroundColor: 'rgba(198,90,51,0.16)',
    color: colors.ink,
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
