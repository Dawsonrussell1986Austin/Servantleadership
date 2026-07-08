import Foundation
import RevenueCat

@MainActor
final class PaywallViewModel: ObservableObject {

    // 🔧 SWAP POINTS — change these to point at a different offering/entitlement.
    /// The Offering configured in the RevenueCat dashboard.
    static let offeringID = "founded_donation"
    /// Must match the entitlement identifier in RevenueCat EXACTLY.
    /// NOTE: the React Native app currently uses "Founded App Pro" — reconcile
    /// to one name in the dashboard so both surfaces unlock the same thing.
    static let entitlementID = "Founded Pro"

    @Published private(set) var offering: Offering?
    @Published private(set) var plans: [PaywallPlan] = []
    /// Default selection is the annual plan (see `load()`).
    @Published var selectedPlanID: String? = "annual"
    @Published private(set) var isLoading = false
    @Published private(set) var isPurchasing = false
    @Published var errorMessage: String?
    @Published private(set) var isUnlocked = false

    private var streamTask: Task<Void, Never>?

    init() {
        observeCustomerInfo()
    }

    deinit { streamTask?.cancel() }

    // MARK: - Loading

    func load() async {
        isLoading = true
        defer { isLoading = false }
        do {
            let offerings = try await Purchases.shared.offerings()
            // Fall back to `.current` if the named offering isn't found.
            let chosen = offerings.offering(identifier: Self.offeringID) ?? offerings.current
            offering = chosen
            plans = Self.makePlans(from: chosen)
            // Keep annual selected if present; otherwise select the first plan.
            if !plans.contains(where: { $0.id == selectedPlanID }) {
                selectedPlanID = plans.first(where: { $0.isAnnual })?.id ?? plans.first?.id
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    /// Build display plans from the offering, in the dashboard's package order.
    /// 🔧 Product IDs live in RevenueCat/App Store Connect — this maps by
    /// `packageType`, so you rarely need to touch product IDs here.
    static func makePlans(from offering: Offering?) -> [PaywallPlan] {
        guard let offering else { return [] }
        return offering.availablePackages.compactMap { pkg -> PaywallPlan? in
            let product = pkg.storeProduct
            let price = (product.price as NSDecimalNumber).doubleValue
            switch pkg.packageType {
            case .annual:
                return PaywallPlan(
                    id: "annual",
                    title: "Annual Donation",
                    billedSubtitle: "\(product.localizedPriceString) billed yearly",
                    perDayPrice: PerDay.string(price: price, divisor: 365,
                                               formatter: product.priceFormatter,
                                               currencyCode: product.currencyCode),
                    badge: "MOST POPULAR",
                    package: pkg
                )
            case .weekly:
                return PaywallPlan(
                    id: "weekly",
                    title: "Weekly Donation",
                    billedSubtitle: "\(product.localizedPriceString) billed weekly",
                    perDayPrice: PerDay.string(price: price, divisor: 7,
                                               formatter: product.priceFormatter,
                                               currencyCode: product.currencyCode),
                    badge: nil,
                    package: pkg
                )
            default:
                return nil // ignore any other package types in this offering
            }
        }
    }

    var selectedPlan: PaywallPlan? {
        plans.first { $0.id == selectedPlanID }
    }

    // MARK: - Purchase / Restore

    /// Purchases the selected package. Returns true if it unlocked entitlement.
    @discardableResult
    func purchaseSelected() async -> Bool {
        guard let package = selectedPlan?.package else { return false }
        isPurchasing = true
        defer { isPurchasing = false }
        do {
            let result = try await Purchases.shared.purchase(package: package)
            if result.userCancelled { return false } // silent — user backed out
            let active = result.customerInfo.entitlements[Self.entitlementID]?.isActive == true
            isUnlocked = active
            return active
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    @discardableResult
    func restore() async -> Bool {
        isPurchasing = true
        defer { isPurchasing = false }
        do {
            let info = try await Purchases.shared.restorePurchases()
            let active = info.entitlements[Self.entitlementID]?.isActive == true
            if active {
                isUnlocked = true
            } else {
                errorMessage = "No previous purchase found on this account."
            }
            return active
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    // MARK: - Live entitlement updates

    /// Observe RevenueCat's stream so entitlement changes (restore on another
    /// device, family sharing, etc.) propagate into the UI.
    private func observeCustomerInfo() {
        streamTask = Task { [weak self] in
            for await info in Purchases.shared.customerInfoStream {
                guard let self else { return }
                if info.entitlements[Self.entitlementID]?.isActive == true {
                    self.isUnlocked = true
                }
            }
        }
    }
}
