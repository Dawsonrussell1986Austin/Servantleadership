# Donation Paywall (SwiftUI + RevenueCat)

A custom native SwiftUI donation paywall driven by our RevenueCat Offering — not
the hosted `PaywallView`. Per-day price framing, two selectable plans, a founders'
note, and a sticky Continue bar.

## Files
| File | What it holds |
|------|---------------|
| `PaywallModels.swift` | `PaywallPlan` display model + the `PerDay` price formatter |
| `PaywallViewModel.swift` | `@MainActor` view model: fetch offering, build plans, purchase/restore, live entitlement stream |
| `BrandColors.swift` | `Color.brandBrown` / `.founderCream` (asset-catalog first, hex fallback) |
| `DonationCard.swift` | One selectable plan card (badge, border, per-day price) |
| `DonationPaywallView.swift` | The screen + a `#Preview` with mock plans |

## Swap points (🔧 in code)
- **Offering id** — `PaywallViewModel.offeringID = "founded_donation"` (falls back to `offerings.current`).
- **Entitlement id** — `PaywallViewModel.entitlementID = "Founded Pro"`.
- **Plans** — mapped by `packageType` (`.annual` → /365, `.weekly` → /7) in `makePlans`. Prices are read from `storeProduct.localizedPriceString` / `.price` — never hardcoded.
- **Copy** — pass `foundersNote:` and `scriptureQuote:` to `DonationPaywallView`, or edit the `default…` statics.
- **Brand color** — add a `BrandBrown` (and optional `FoundedCream`) color set to your asset catalog; otherwise the hex fallback (`#8B3A0F` / `#FBF0E4`) is used.

## Usage
```swift
DonationPaywallView(
    foundersNote: "…your copy…",
    onUnlock: { /* refresh your gate / dismiss */ }
)
```
`Purchases.configure(...)` must already be called at launch.

## ⚠️ Integration note — this app is React Native (Expo)
The shipping Founded app is Expo/React Native; its live paywall is
`app/paywall.tsx`. These SwiftUI files are standalone — to use them you would
either:
- embed this view in a native iOS project, or
- expose it to React Native via a native module / `requireNativeComponent`, or
- adopt it if/when the paywall is moved native.

Also reconcile the **entitlement name**: this paywall uses `"Founded Pro"`, but
the RN app currently checks `"Founded App Pro"` (`src/purchases/Entitlements.tsx`).
Pick one identifier in the RevenueCat dashboard so both surfaces unlock the same
entitlement.
