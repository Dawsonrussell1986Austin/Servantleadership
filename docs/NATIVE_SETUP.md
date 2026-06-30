# Founded — iOS / native setup

The app is built so it runs **fully unlocked today** with zero accounts, and you
flip on the account-gated features (paywall, Apple Sign In, reminders) by adding
keys — no code changes required. This is the checklist to take it from the web
preview to a real app on your phone and into the App Store.

Nothing here can be built or tested in the cloud sandbox — iOS builds require a
Mac toolchain, which EAS Build provides. You run these steps from your own
machine with your own accounts.

---

## 0. Prerequisites

```bash
npm install -g eas-cli
eas login            # creates/uses your free Expo account
```

- **Apple Developer Program** — $99/yr, required for TestFlight + App Store.
  https://developer.apple.com/programs/

---

## Your account values (already wired into config)

These are filled in for you — Team ID in `app.json` (widget plugin) and the
submit credentials in `eas.json`:

| Value | Yours | Where it's used |
| ----- | ----- | --------------- |
| Apple Team ID | `V87Q26T9TS` | code signing (app + widget) |
| App Store Connect App ID | `87988350` | `eas submit` target |
| API Key ID | `98MK8JGSXV` | `eas submit` auth |
| API Issuer ID | `c7d2d1ce-…` | `eas submit` auth |

**One manual step:** the API private key (`.p8`) must NOT be committed, so place
your downloaded file on your machine at:

```
credentials/AuthKey_98MK8JGSXV.p8
```

(`/credentials/` is git-ignored.) `eas.json` points `ascApiKeyPath` there.

---

## 1. First build to your phone (no paid features needed)

This gets the app — reminders, the reader, audio — running on a real device.
Everything is unlocked because no RevenueCat key is set yet.

```bash
eas build:configure          # one-time, links the project to EAS
eas build --profile development --platform ios
```

- Install the build via the QR code EAS prints (uses a development client).
- Or `--profile preview` for an ad-hoc build you can share with TestFlight users.

What already works on device with no further setup:
- Daily devotional + full library + audio
- **Reminders** — Settings → Daily reminder. Local notifications, no server.
- **Apple Sign In** button appears on iOS (see §3).

---

## 2. RevenueCat paywall (turns on the freemium gate)

The gate: the **daily devotional is free**; the **library + audio are premium**.
Until a key is present, `isPremium` is forced `true` so nothing is locked.

> **Recommended for the fastest App Store launch:** ship v1 with the key left
> blank (everything unlocked, no IAP review friction), then turn the paywall on
> in a v1.1 update once the steps below are done and your products are approved.

1. Create a RevenueCat account → https://app.revenuecat.com
2. Add an **iOS app**, connect it to your App Store Connect app (App ID `87988350`)
   using the **In-App Purchase key** (`ApiKey_S2U8RD15Q2H8.p8` + Key ID
   `S2U8RD15Q2H8` + your Issuer ID) under RevenueCat → Project Settings → Apple.
3. In App Store Connect, create the subscription/IAP products
   (`monthly`, `yearly`, `lifetime`). Add them to an **Offering** in RevenueCat
   and attach them to an **Entitlement whose identifier is exactly `Founded Pro`**
   (this matches `ENTITLEMENT_ID` in `src/purchases/Entitlements.tsx`).
4. Copy the RevenueCat **iOS public SDK key** (starts with `appl_`, from
   RevenueCat → API Keys) into `app.json`:

   ```json
   "extra": {
     "revenueCatApiKeyIos": "appl_XXXXXXXXXXXXXXXX"
   }
   ```

   > You provided `test_fcLAMogHVyszhwADOzQSEqXSkpz` — that isn't the `appl_`
   > App Store SDK key the iOS app needs; grab the `appl_` one from the API Keys
   > page. (A bad key just leaves the app unlocked — it won't crash.)

5. Rebuild (`eas build`). Now non-subscribers see the lock + paywall; the
   paywall pulls live pricing from your Offering, and Subscribe / Restore work.

The paywall screen is `app/paywall.tsx`; the benefit list lives at the top of
that file if you want to tweak copy.

---

## 3. Sign in with Apple

Already wired (`src/components/AppleSignInButton.tsx`, shown in Settings on iOS).
To make it function:

1. In the Apple Developer portal, enable the **Sign In with Apple** capability
   for the app id `com.servantleadership.liturgies`.
2. It's already declared in `app.json` (`ios.usesAppleSignIn: true` +
   the `expo-apple-authentication` plugin), so a rebuild picks it up.

Note: the app stores only the opaque Apple user id locally — there's no backend
and no personal data collected. It's there for future cross-device restore.

---

## 4. Reminders — already done

Local daily notifications via `expo-notifications`. No server, no push
certificate. Configured in Settings. Works as soon as the user grants the
notification permission iOS prompts for.

---

## 5. Home-screen widget — built

A WidgetKit widget lives in `targets/widget/` (SwiftUI), wired through the
`@bacons/apple-targets` config plugin. It shows a quiet daily line of Scripture
in small and medium sizes, and is **self-contained** — it computes the day's
line itself, so it works the instant it's added, with no app launch, shared
storage, or network.

To build it you only need your **Apple Team ID** (find it at
https://developer.apple.com/account → Membership):

```bash
export EXPO_APPLE_TEAM_ID=XXXXXXXXXX   # your 10-char team id
eas build --profile development --platform ios
```

- `npx expo prebuild` regenerates the native iOS project including the widget
  extension; EAS does this automatically during the build.
- After installing, long-press the home screen → **+** → search **Founded** →
  add the **Today's Verse** widget.

To change the widget's wording or design, edit `targets/widget/index.swift`
(the `LINES` array is the rotation; the SwiftUI views are below it).

> Note: the widget rotates its own curated verses rather than mirroring the
> in-app devotional of the day. If you'd rather it show the exact same reading
> as the app, that needs an App Group + writing the day's text from JS — say so
> and it's a small follow-up.

## Submitting to TestFlight / App Store

Credentials are pre-wired in `eas.json` (`submit.production.ios`), so once the
`.p8` is at `credentials/AuthKey_98MK8JGSXV.p8`:

```bash
eas build  --profile production --platform ios
eas submit --profile production --platform ios --latest
```

No interactive Apple login needed — it authenticates with your API key.

---

## 6. Remaining (needs a backend — not yet built)

- **Remote push notifications** — only needed for server-sent messages
  (announcements, etc.). Daily reminders already work locally without this.
  Requires an APNs key and a small backend to send via Expo's push service.

---

## Where things live

| Feature            | File |
| ------------------ | ---- |
| Entitlement state  | `src/purchases/Entitlements.tsx` |
| Paywall screen     | `app/paywall.tsx` |
| Reminders logic    | `src/lib/reminders.ts` |
| Settings UI        | `app/settings.tsx` |
| Apple Sign In      | `src/components/AppleSignInButton.tsx` |
| Home-screen widget | `targets/widget/index.swift` + `targets/widget/expo-target.config.js` |
| Build profiles     | `eas.json` |
| Keys / config      | `app.json` → `expo.extra` |
