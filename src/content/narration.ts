import { Liturgy } from './types';

const PAUSE = '<break time="1.1s" />';
const LONG_PAUSE = '<break time="1.8s" />';

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
      parts.push(`${PAUSE}${section.reference}.`);
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
      parts.push(`${section.reference}.`);
    }
  }
  parts.push('Amen.');
  return parts.join('\n\n');
}
