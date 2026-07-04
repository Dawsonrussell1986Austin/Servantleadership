import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Liturgy, LiturgySection } from '../content/types';
import { colors, spacing, type, radius } from '../theme/theme';
import { sectionLabel } from '../theme/categories';

type ActiveSentence = { section: number; index: number };

/** A user text highlight, in character offsets within one section's body. */
export type Highlight = {
  section: number;
  /** The word first tapped; extension pivots around it. */
  anchorStart: number;
  anchorEnd: number;
  /** The current highlighted range [start, end). */
  start: number;
  end: number;
};

type Word = { text: string; start: number; end: number };

type Props = {
  liturgy: Liturgy;
  /** Multiplier for body text size (font-size toggle). */
  fontScale?: number;
  /** Render the built-in title/situation header. */
  showHeader?: boolean;
  /** The sentence the narration is currently reading (read-along highlight). */
  activeSentence?: ActiveSentence | null;
  /** Index of the section the narration is reading (dims the rest). */
  activeIndex?: number | null;
  /** The user's current tap-to-highlight selection, if any. */
  highlight?: Highlight | null;
  /** A word was tapped — the parent updates the highlight. */
  onWordPress?: (section: number, word: Word) => void;
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
 * Break a section body into sentences, each carrying its words with absolute
 * character offsets into the body — so a tap-highlight can save the exact
 * original substring, and the read-along can tint by sentence.
 */
function tokenize(body: string): { words: Word[] }[] {
  const sentences = splitSentences(body);
  let cursor = 0;
  return sentences.map((sentence) => {
    const base = Math.max(cursor, body.indexOf(sentence, cursor));
    cursor = base + sentence.length;
    const words: Word[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(sentence)) !== null) {
      words.push({ text: m[0], start: base + m.index, end: base + m.index + m[0].length });
    }
    return { words };
  });
}

/** Compute the highlight after tapping `word` in `section`, given the prior one. */
export function nextHighlight(
  prev: Highlight | null,
  section: number,
  word: { start: number; end: number },
): Highlight | null {
  if (prev && prev.section === section) {
    const isLoneAnchor =
      prev.start === prev.anchorStart &&
      prev.end === prev.anchorEnd &&
      word.start === prev.anchorStart &&
      word.end === prev.anchorEnd;
    if (isLoneAnchor) return null; // tapped the single highlighted word again → clear
    return {
      section,
      anchorStart: prev.anchorStart,
      anchorEnd: prev.anchorEnd,
      start: Math.min(prev.anchorStart, word.start),
      end: Math.max(prev.anchorEnd, word.end),
    };
  }
  return { section, anchorStart: word.start, anchorEnd: word.end, start: word.start, end: word.end };
}

/**
 * Renders body text as tappable word spans, tinting the sentence being
 * narrated and the words the user has highlighted. Grouped into paragraphs of
 * a few sentences so prose doesn't read as a wall of text.
 */
function Body({
  body,
  textStyle,
  sectionIndex,
  activeSentenceIndex,
  range,
  onWordPress,
  sentencesPerParagraph = 3,
}: {
  body: string;
  textStyle: object;
  sectionIndex: number;
  activeSentenceIndex: number | null;
  range: { start: number; end: number } | null;
  onWordPress?: (section: number, word: Word) => void;
  sentencesPerParagraph?: number;
}) {
  const sentences = tokenize(body);
  const single = sentences.length <= sentencesPerParagraph + 1;
  const per = single ? sentences.length : sentencesPerParagraph;

  const paragraphs: { globalIndex: number; words: Word[] }[][] = [];
  for (let i = 0; i < sentences.length; i += per) {
    paragraphs.push(
      sentences.slice(i, i + per).map((s, k) => ({ globalIndex: i + k, words: s.words })),
    );
  }

  return (
    <>
      {paragraphs.map((para, pi) => (
        <Text
          key={pi}
          style={[textStyle, pi < paragraphs.length - 1 && styles.paragraph]}
        >
          {para.map((sen) => (
            <Text
              key={sen.globalIndex}
              style={activeSentenceIndex === sen.globalIndex ? styles.readAlong : undefined}
            >
              {sen.words.map((w, wi) => {
                const on = range && w.start >= range.start && w.end <= range.end;
                return (
                  <Text
                    key={wi}
                    suppressHighlighting
                    onPress={onWordPress ? () => onWordPress(sectionIndex, w) : undefined}
                    style={on ? styles.userHighlight : undefined}
                  >
                    {w.text}
                    {wi < sen.words.length - 1 ? ' ' : ''}
                  </Text>
                );
              })}
              {sen.globalIndex < sentences.length - 1 ? ' ' : ''}
            </Text>
          ))}
        </Text>
      ))}
    </>
  );
}

function Section({
  section,
  sectionIndex,
  accent,
  scale,
  activeSentenceIndex,
  range,
  onWordPress,
}: {
  section: LiturgySection;
  sectionIndex: number;
  accent: string;
  scale: number;
  activeSentenceIndex: number | null;
  range: { start: number; end: number } | null;
  onWordPress?: (section: number, word: Word) => void;
}) {
  const label = section.label ?? sectionLabel[section.type] ?? '';
  const common = { sectionIndex, activeSentenceIndex, range, onWordPress };

  if (section.type === 'scripture') {
    return (
      <View style={[styles.scriptureBlock, { borderLeftColor: accent }]}>
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Body
          body={section.body}
          textStyle={[styles.scripture, { fontSize: 20 * scale, lineHeight: 32 * scale }]}
          {...common}
        />
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
        <Body
          body={section.body}
          textStyle={[styles.response, { fontSize: 20 * scale, lineHeight: 28 * scale }]}
          {...common}
        />
      </View>
    );
  }

  if (section.type === 'benediction') {
    return (
      <View style={styles.benedictionBlock}>
        <View style={[styles.rule, { backgroundColor: colors.line }]} />
        <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
        <Body
          body={section.body}
          textStyle={[styles.benediction, { fontSize: 19 * scale, lineHeight: 31 * scale }]}
          {...common}
        />
      </View>
    );
  }

  // call, reflection, prayer
  return (
    <View style={styles.block}>
      <Text style={[styles.eyebrow, { color: accent }]}>{label.toUpperCase()}</Text>
      <Body
        body={section.body}
        textStyle={[styles.body, { fontSize: 19 * scale, lineHeight: 31 * scale }]}
        {...common}
      />
    </View>
  );
}

export default function LiturgyView({
  liturgy,
  fontScale = 1,
  showHeader = true,
  activeSentence = null,
  activeIndex = null,
  highlight = null,
  onWordPress,
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
        <View
          key={`${liturgy.id}-${i}`}
          onLayout={onSectionLayout ? (e) => onSectionLayout(i, e.nativeEvent.layout.y) : undefined}
          style={following && i !== activeIndex ? styles.dimmed : undefined}
        >
          <Section
            section={s}
            sectionIndex={i}
            accent={accent}
            scale={fontScale}
            activeSentenceIndex={
              activeSentence && activeSentence.section === i ? activeSentence.index : null
            }
            range={highlight && highlight.section === i ? highlight : null}
            onWordPress={onWordPress}
          />
        </View>
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
  // Words the reader tapped to highlight for saving: a warmer wash.
  userHighlight: {
    backgroundColor: 'rgba(198,90,51,0.30)',
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
