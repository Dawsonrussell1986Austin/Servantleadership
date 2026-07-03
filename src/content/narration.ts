import { Liturgy } from './types';

const PAUSE = '<break time="1.1s" />';
const LONG_PAUSE = '<break time="1.8s" />';

/**
 * "Proverbs 22:7" read literally sounds like a time ("twenty-two oh-seven").
 * Expand chapter:verse into natural speech for the narrator:
 *   "Proverbs 22:7"      → "Proverbs 22, verse 7"
 *   "Proverbs 3:5–6"     → "Proverbs 3, verses 5 to 6"
 *   "Psalm 46:10"        → "Psalm 46, verse 10"
 * The visible reference in the app is untouched — this is voice-only.
 */
export function speakableReference(ref: string): string {
  return ref.replace(
    /(\d+):(\d+)(?:\s*[–—-]\s*(\d+))?/g,
    (_m, ch, v1, v2) => (v2 ? `${ch}, verses ${v1} to ${v2}` : `${ch}, verse ${v1}`),
  );
}

/**
 * Turns a reading into a single narration string for text-to-speech, with
 * gentle pauses between movements. ElevenLabs' multilingual v2 model honors the
 * <break> tags.
 */
export function buildNarration(reading: Liturgy): string {
  const parts: string[] = [];
  parts.push(`${reading.title}.`);
  parts.push(LONG_PAUSE);

  for (const section of reading.sections) {
    if (section.type === 'prayer') {
      // A breath, an invitation, another breath — then the prayer itself.
      parts.push(`${PAUSE}Let’s pray.${LONG_PAUSE}`);
    }
    parts.push(section.body);
    if (section.type === 'scripture' && section.reference) {
      parts.push(`${PAUSE}${speakableReference(section.reference)}.`);
    }
    parts.push(PAUSE);
  }

  // Trailing break: ElevenLabs sometimes rushes or clips the final word when
  // it's the last token — padding after "Amen." makes any clipping eat
  // silence instead of the word itself.
  parts.push(`${LONG_PAUSE}Amen.${PAUSE}`);
  return parts.join(' ');
}

/**
 * Plain narration for the device's built-in text-to-speech (no SSML). Used as a
 * fallback when a pre-generated MP3 isn't available.
 */
export function buildSpeechText(reading: Liturgy): string {
  const parts: string[] = [`${reading.title}.`];
  for (const section of reading.sections) {
    if (section.type === 'prayer') parts.push('Let’s pray.');
    parts.push(section.body);
    if (section.type === 'scripture' && section.reference) {
      parts.push(`${speakableReference(section.reference)}.`);
    }
  }
  parts.push('Amen.');
  return parts.join('\n\n');
}
