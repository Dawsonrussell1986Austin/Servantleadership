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
    parts.push(section.body);
    if (section.type === 'scripture' && section.reference) {
      parts.push(`${PAUSE}${section.reference}.`);
    }
    parts.push(PAUSE);
  }

  parts.push(`${LONG_PAUSE}Amen.`);
  return parts.join(' ');
}
