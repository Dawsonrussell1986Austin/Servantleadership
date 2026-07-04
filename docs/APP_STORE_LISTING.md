# Founded — App Store listing (copy/paste into App Store Connect)

Everything you need for the App Store Connect listing. The app ships **free in
v1** (paywall off), which is the fastest route through review.

---

## Name & subtitle
- **App Name:** `Founded`
- **Subtitle (30 char max):** `Faith for founders, daily`

> If the name "Founded" is taken in App Store Connect, fallbacks:
> `Founded — Daily Devotional`, `Founded: Faith & Work`.

## Promotional text (170 char, editable anytime without review)
```
A quiet five minutes for the founder’s day — a daily devotional, plus liturgies
for the real moments: payroll, hard clients, launches, and the wins.
```

## Description
```
Founded is a daily devotional and prayer book for Christian entrepreneurs.

Building something is heavy work. Founded gives you a quiet five minutes for it —
no feeds, no metrics, no noise. Just Scripture-rooted readings for the founder’s
ordinary day, and a library of liturgies for the specific moments that actually
happen in business.

A DAILY DEVOTIONAL
Open the app and today’s reading is waiting — a short, steadying word on faith
and work to begin the day well.

A LIBRARY OF LITURGIES
For the moments a generic devotional never speaks to:
• The month you can’t make payroll
• A client who’s treating you badly
• Tension with a business partner or co-founder
• The day you close the deal — or the day it falls through
• Launching something new
• Letting someone go
• Burnout, boredom, and the grind
…and many more. Search the moment you’re in, and Founded finds the liturgy that
meets it.

LISTEN ANYWHERE
Every reading can be narrated, so you can pray through it driving, walking, or
before the team arrives.

QUIET BY DESIGN
No accounts required. No personal data collected. No streaks to maintain or
notifications begging for your attention — just an optional daily reminder if you
want one.

Founded is for the builder who wants to keep their soul while they keep their
company.
```

## Keywords (100 char max, comma-separated, no spaces)
```
devotional,christian,faith,prayer,entrepreneur,founder,business,bible,daily,liturgy,scripture,work
```

## What's New (version 1.0)
```
The first release of Founded. A daily devotional and a library of liturgies for
the moments that come with building something.
```

## URLs
- **Privacy Policy URL (required):** `https://servant-liturgies.vercel.app/privacy`
- **Support URL (required):** `https://servant-liturgies.vercel.app`  *(or a mailto/landing page)*
- **Marketing URL (optional):** `https://servant-liturgies.vercel.app`

## Category
- **Primary:** Lifestyle  *(or Reference)*
- **Secondary:** Reference

## Age rating
- 4+ (no objectionable content). In the questionnaire, answer "None" to all.

---

## App Privacy ("nutrition label") answers
v1 ships with the subscription live (RevenueCat) and optional Sign in with
Apple, so the app **does** collect a little data. In App Store Connect → App
Privacy, declare exactly:

- **Identifiers → User ID**
  - Collected: **Yes**
  - Linked to the user: **Yes** (Sign in with Apple ties the id to a person)
  - Used for tracking: **No**
  - Purpose: **App Functionality** (restore access across devices)
  - Covers both the Apple user identifier and the RevenueCat app user id.
- **Purchases → Purchase History**
  - Collected: **Yes**
  - Linked to the user: **Yes** (aliased to the Apple id when signed in)
  - Used for tracking: **No**
  - Purpose: **App Functionality** (verify and restore the subscription)

Do **not** declare name, email, contacts, location, or usage/analytics — the app
collects none of those. Payment details are handled entirely by Apple and never
reach us. This mirrors `app/privacy.tsx` (the in-app / hosted policy).

> If you ever ship the "free, paywall off" variant with Sign in with Apple also
> removed, then — and only then — could you select "Data Not Collected."

---

## Screenshots (required: 6.7" iPhone, 1290 × 2796)
Capture these screens on a 6.7" simulator/device (⌘S in Simulator):
1. **Home** — greeting + today’s devotional + library shelves
2. **A reading** — the devotional open (the typography sells it)
3. **The library** — "All" list of liturgies, or the shelves grid
4. **Search** — "angry client" typed, showing the matched liturgy
5. **Paywall** (optional, only if shipping with IAP on)

> Minimum is one 6.7" screenshot; 3–5 is much stronger. App Store auto-scales
> 6.7" shots down to other sizes, so you usually only need this one set.

---

## Review notes (paste into "Notes" for the reviewer)
```
Founded is a content-only reading app: daily devotionals and liturgies for
Christian entrepreneurs. No login is required and no account is needed to use any
feature. The app collects no personal data. Optional daily reminders use local
notifications only.
```
