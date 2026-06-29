# Servant — Liturgies for Christian Entrepreneurs

A quiet, content-only iOS app. No feeds, no inputs, no metrics to chase — just a
**five-minute devotional each day** and a **library of liturgies for the moments
that actually happen in business**: not making payroll, a terrible client,
conflict with a partner, closing a deal, launching a product, and more.

Think of it less like an app and more like a prayer book you keep in your pocket.

## What's inside

- **Today** — one devotional, chosen automatically for the date. It rotates
  through the whole library before repeating, so it never feels random.
- **Library** — every liturgy, grouped into four seasons of the work:
  - **Under Pressure** — cash, fear, failure, and the days you want to quit
  - **With People** — clients, partners, the team you lead and let go
  - **The High Moments** — closing, launching, success held loosely
  - **Daily Rhythms** — begin, lay down, and keep your heart in the work

Every liturgy follows the same gentle arc, made to be read slowly:
**Be Still → The Word → Reflection → Prayer → Pray This Back → Go in Peace.**

## Tech

- [Expo](https://expo.dev) (React Native) + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
- All content is bundled locally — the app works fully offline and collects nothing

## Run it

You'll need [Node.js](https://nodejs.org) and the
[Expo Go](https://apps.apple.com/app/expo-go/id982107779) app on your iPhone
(or an iOS simulator on a Mac).

```bash
npm install
npm run ios        # opens the iOS simulator (Mac)
# — or —
npm start          # then scan the QR code with Expo Go on your iPhone
```

Other useful scripts:

```bash
npm run typecheck  # TypeScript check, no build
```

## Project layout

```
app/                         # screens (Expo Router)
  _layout.tsx                #   root stack + status bar
  (tabs)/
    _layout.tsx              #   the Today / Library tab bar
    index.tsx                #   Today — the daily devotional
    library.tsx              #   the browsable library
  liturgy/[id].tsx           #   the reader for a single liturgy
src/
  content/
    types.ts                 #   Liturgy + Category types, category list
    liturgies.ts             #   ← all the content lives here
  components/
    LiturgyView.tsx          #   renders a full liturgy
    LiturgyCard.tsx          #   a library list item
  theme/
    theme.ts                 #   colors, type scale, spacing
    categories.ts            #   per-category accent colors + section labels
assets/                      # app icon + splash
```

## Adding or editing a liturgy

All content is plain data — no code changes needed beyond editing one file.
Open `src/content/liturgies.ts` and add an entry to the `LITURGIES` array:

```ts
{
  id: 'a-unique-slug',                 // used in the URL; keep it unique
  title: 'A Liturgy for ...',
  situation: 'One line describing the moment this is for.',
  category: 'pressure',                // 'pressure' | 'people' | 'wins' | 'rhythms'
  minutes: 5,
  sections: [
    { type: 'call',        body: '...' },
    { type: 'scripture',   reference: 'Book 0:0', body: '...' },
    { type: 'reflection',  body: '...' },
    { type: 'prayer',      body: '...' },
    { type: 'response',    body: '...' },   // a short line to pray back
    { type: 'benediction', body: '...' },
  ],
},
```

Section headings ("Be Still", "The Word", etc.) are applied automatically by
type, but you can override any one with a `label`. The Today tab and the Library
both pick this up with no further changes.

## Roadmap ideas (not yet built)

- A gentle daily reminder notification ("Five minutes before the inbox.")
- A "saved" list for liturgies you return to
- Optional read-aloud / audio
- App Store build via EAS (`eas build -p ios`)
