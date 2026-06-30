# Servant — iOS / native setup

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

1. Create a RevenueCat account → https://app.revenuecat.com
2. Add an **iOS app**, connect it to your App Store Connect app.
3. In App Store Connect, create an **auto-renewing subscription** product
   (e.g. `servant_monthly`). Add it to an **Offering** in RevenueCat and attach
   it to an **Entitlement whose identifier is exactly `premium`**
   (this matches `ENTITLEMENT_ID` in `src/purchases/Entitlements.tsx`).
4. Copy the RevenueCat **iOS public API key** into `app.json`:

   ```json
   "extra": {
     "revenueCatApiKeyIos": "appl_XXXXXXXXXXXXXXXX"
   }
   ```

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

## 5. Remaining (need native code / a backend — not yet built)

- **Home-screen widget** — WidgetKit is Swift and needs a config plugin
  (e.g. `@bacons/apple-targets`) plus an app group to share the day's reading.
  This is the one piece that requires writing a little native Swift; it can be
  added without disturbing the JS app. Flag when you want it.
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
| Build profiles     | `eas.json` |
| Keys / config      | `app.json` → `expo.extra` |
