import Foundation
import RevenueCat

/// A display-ready plan derived from a RevenueCat `Package`.
///
/// The UI renders from this value type (not from `Package` directly) so that
/// `#Preview` and tests can supply mock data with no network call, while the
/// real `Package` rides along for the actual purchase.
struct PaywallPlan: Identifiable {
    let id: String            // "annual" | "weekly"
    let title: String         // "Annual Donation"
    let billedSubtitle: String // "$59.99 billed yearly" — sticker price, never hardcoded
    let perDayPrice: String   // "$0.16" — the "/day" suffix is styled by the view
    let badge: String?        // "MOST POPULAR" or nil
    let package: Package?     // nil only in previews/mocks

    var isAnnual: Bool { id == "annual" }
}

/// Per-day price framing — the heart of the design.
///
/// Computes the daily figure from the *real* store price so it stays correct
/// across currencies and locales, and formats it with the product's own
/// formatter when available (falls back to a currency formatter).
enum PerDay {
    /// - Parameters:
    ///   - price: the product's price as a Double (e.g. 59.99)
    ///   - divisor: 365 for annual, 7 for weekly
    static func string(price: Double,
                       divisor: Double,
                       formatter: NumberFormatter?,
                       currencyCode: String?) -> String {
        let perDay = price / max(divisor, 1)

        // Prefer the product's own formatter (correct symbol/locale), but copy
        // it so we never mutate the shared instance.
        if let base = formatter?.copy() as? NumberFormatter {
            base.numberStyle = .currency
            base.minimumFractionDigits = 2
            base.maximumFractionDigits = 2
            if let s = base.string(from: NSNumber(value: perDay)) { return s }
        }

        let nf = NumberFormatter()
        nf.numberStyle = .currency
        nf.currencyCode = currencyCode ?? "USD"
        nf.minimumFractionDigits = 2
        nf.maximumFractionDigits = 2
        return nf.string(from: NSNumber(value: perDay)) ?? String(format: "%.2f", perDay)
    }
}
