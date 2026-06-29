# Servant — Daily Devotionals & Liturgies for Christian Entrepreneurs

A quiet, content-only app. No feeds, no inputs, no metrics to chase — just a
**daily devotional** for the ordinary day, and a **library of liturgies for the
specific moments** that actually happen in business: not making payroll, a
terrible client, conflict with a partner, closing a deal, launching a product.

Every reading can be **read or listened to** — narration is generated with
ElevenLabs and streamed in a built-in player.

Think of it less like an app and more like a prayer book you keep in your pocket.

## What's inside

- **Today** — a **generic, broadly-applicable entrepreneurship devotional**,
  chosen automatically for the date and rotating through the whole set. These
  are good on any ordinary day: calling, integrity, ambition, generosity, rest,
  perseverance, identity, gratitude, and more.
- **Library** — the **super-specific situational liturgies**, grouped into four
  seasons of the work. Tap the one that matches the moment you're in:
  - **Under Pressure** — cash, fear, failure, and the days you want to quit
  - **With People** — clients, partners, the team you lead and let go
  - **The High Moments** — closing, launching, success held loosely
  - **Daily Rhythms** — begin, lay down, and keep your heart in the work

Every reading follows the same gentle arc, made to be read slowly:
**Be Still → The Word → Reflection → Prayer → Pray This Back → Go in Peace.**

The daily devotionals live in `src/content/devotionals.ts`; the situational
liturgies live in `src/content/liturgies.ts`. They share one shape, so the
reader and the audio player treat them identically.

## Audio narration (ElevenLabs)

Because the content is fixed, narration is **pre-generated** rather than
synthesized live — so no API key ever ships to the app, and playback works
offline-friendly and fast.

```bash
ELEVENLABS_API_KEY=sk_your_key  npm run audio:generate
```

This reads every devotional and liturgy, builds a narration script (with gentle
pauses between movements), calls ElevenLabs, and writes one MP3 per reading to
`public/audio/<id>.mp3`. The app streams those files in the player.

Options (all optional env vars):

| Var | Default | Purpose |
| --- | --- | --- |
| `ELEVENLABS_VOICE_ID` | `onwK4e9ZLuTAKqWW03F9` (Daniel) | which voice to use |
| `ELEVENLABS_MODEL_ID` | `eleven_multilingual_v2` | TTS model |
| `FORCE=1` | off | re-generate even if the MP3 already exists |
| `ONLY=id1,id2` | all | only generate specific readings |

On the web build, `public/audio/` is served at `/audio/...`. On native, the
player streams from `expo.extra.audioBaseUrl` in `app.json` (point this at your
deployed site).

**Device-speech fallback.** If a pre-generated MP3 isn't found for a reading,
the player automatically falls back to the device's built-in text-to-speech
(`expo-speech` — the Web Speech API on web, AVSpeechSynthesizer on iOS) and
reads the liturgy aloud. So "Listen" works immediately, everywhere, with no API
key; generating the ElevenLabs MP3s simply upgrades the quality. (Seeking is
disabled in speech mode; progress is estimated from word count.)

## Tech

- [Expo](https://expo.dev) (React Native) + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) for navigation
- [`expo-av`](https://docs.expo.dev/versions/latest/sdk/av/) for audio playback
- [`expo-linear-gradient`](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) for cover art
- All text content is bundled locally; the app collects nothing

## Run it

You'll need [Node.js](https://nodejs.org) and the
[Expo Go](https://apps.apple.com/app/expo-go/id982107779) app on your iPhone
(or an iOS simulator on a Mac).

```bash
npm install
npm run ios        # iOS simulator (Mac)
# — or —
npm start          # then scan the QR code with Expo Go
# — or —
npm run web        # open it in a browser
```

Other scripts:

```bash
npm run typecheck       # TypeScript check
npm run audio:generate  # build ElevenLabs narration (needs an API key)
```

## Project layout

```
app/                         # screens (Expo Router)
  _layout.tsx                #   root stack + AudioProvider
  (tabs)/
    _layout.tsx              #   Today / Library tab bar
    index.tsx                #   Today — daily devotional + library carousel
    library.tsx              #   the situational library
  liturgy/[id].tsx           #   the reader (handles devotionals + liturgies)
src/
  content/
    types.ts                 #   shared types + category list
    devotionals.ts           #   ← daily, generic entrepreneurship devotionals
    liturgies.ts             #   ← the situation-specific liturgies
    narration.ts             #   builds TTS scripts from a reading
    index.ts                 #   combined lookups (getReadingById, etc.)
  audio/
    AudioProvider.tsx        #   shared audio player state (expo-av)
    audioUrl.ts              #   resolves /audio/<id>.mp3 per platform
  components/
    LiturgyView.tsx          #   renders a reading (drop cap, font scale)
    LiturgyCover.tsx         #   gradient cover art
    LiturgyCard.tsx          #   a library list item
    PlayerBar.tsx            #   the audio transport (scrubber + play/pause)
  theme/                     #   colors, type scale, category palettes
scripts/
  generate-audio.ts          #   the ElevenLabs generation script
public/audio/                #   generated narration MP3s (served at /audio)
assets/                      #   app icon + splash
```

## Adding or editing content

All content is plain data. To add a **daily devotional**, append to the
`DEVOTIONALS` array in `src/content/devotionals.ts`; to add a **situational
liturgy**, append to `LITURGIES` in `src/content/liturgies.ts`:

```ts
{
  id: 'a-unique-slug',
  title: 'A Liturgy for ...',          // or 'On ...' for a devotional
  situation: 'One line describing the moment / theme.',
  category: 'pressure',                // 'pressure' | 'people' | 'wins' | 'rhythms'
  minutes: 5,
  kind: 'devotional',                  // omit (or 'liturgy') for the library
  sections: [
    { type: 'call',        body: '...' },
    { type: 'scripture',   reference: 'Book 0:0', body: '...' },
    { type: 'reflection',  body: '...' },
    { type: 'prayer',      body: '...' },
    { type: 'response',    body: '...' },
    { type: 'benediction', body: '...' },
  ],
},
```

After adding content, run `npm run audio:generate` to create its narration
(it skips readings that already have an MP3 unless you pass `FORCE=1`).

## Roadmap ideas (not yet built)

- A gentle daily reminder notification ("Five minutes before the inbox.")
- A "saved" list for readings you return to
- Background audio + lock-screen controls
- App Store build via EAS (`eas build -p ios`)
