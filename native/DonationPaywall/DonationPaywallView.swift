import SwiftUI
import RevenueCat

/// A custom native donation paywall driven by our RevenueCat Offering.
///
/// Usage:
/// ```swift
/// DonationPaywallView(foundersNote: "…", onUnlock: { /* dismiss + unlock */ })
/// ```
struct DonationPaywallView: View {
    @StateObject private var vm = PaywallViewModel()

    /// Founders' copy — passed in so it's easy to edit without touching layout.
    let foundersNote: String
    /// The closing verse (italic). Editable; defaults to 2 Corinthians 9:6.
    let scriptureQuote: String
    /// Called after the entitlement unlocks (dismiss + refresh your gate here).
    var onUnlock: () -> Void

    /// Inject mock plans so #Preview renders without a network call.
    private let previewPlans: [PaywallPlan]?

    @Environment(\.dismiss) private var dismiss

    init(foundersNote: String = DonationPaywallView.defaultNote,
         scriptureQuote: String = DonationPaywallView.defaultQuote,
         onUnlock: @escaping () -> Void = {},
         previewPlans: [PaywallPlan]? = nil) {
        self.foundersNote = foundersNote
        self.scriptureQuote = scriptureQuote
        self.onUnlock = onUnlock
        self.previewPlans = previewPlans
    }

    private var displayPlans: [PaywallPlan] { previewPlans ?? vm.plans }

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.founderCream.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Choose your Donation Gift 🎁")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(Color.brandBrown)
                        .fixedSize(horizontal: false, vertical: true)
                        .padding(.top, 16)

                    VStack(spacing: 16) {
                        ForEach(displayPlans) { plan in
                            DonationCard(plan: plan,
                                         isSelected: vm.selectedPlanID == plan.id) {
                                vm.selectedPlanID = plan.id
                            }
                        }
                    }

                    foundersSection

                    // Clearance so content can scroll clear of the sticky bar.
                    Color.clear.frame(height: 150)
                }
                .padding(.horizontal, 20)
            }

            bottomBar
        }
        .task {
            // Skip the network fetch when previewing with mock plans.
            if previewPlans == nil { await vm.load() }
        }
        .onChange(of: vm.isUnlocked) { unlocked in
            if unlocked { onUnlock(); dismiss() }
        }
        .alert("Something went wrong",
               isPresented: Binding(get: { vm.errorMessage != nil },
                                    set: { if !$0 { vm.errorMessage = nil } })) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(vm.errorMessage ?? "")
        }
        .overlay {
            if vm.isPurchasing { progressOverlay }
        }
    }

    // MARK: - Founders' note

    private var foundersSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("A Note from the Founders")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(Color.founderInk)
            Text(foundersNote)
                .font(.system(size: 15, design: .serif))
                .foregroundColor(Color.founderInk.opacity(0.85))
                .lineSpacing(4)
            Text(scriptureQuote)
                .font(.system(size: 15, design: .serif))
                .italic()
                .foregroundColor(Color.founderInk.opacity(0.65))
                .lineSpacing(4)
        }
    }

    // MARK: - Sticky bottom bar

    private var bottomBar: some View {
        VStack(spacing: 12) {
            HStack(spacing: 6) {
                Image(systemName: "checkmark")
                    .font(.system(size: 12, weight: .bold))
                Text("Cancel anytime")
                    .font(.system(size: 13, weight: .medium))
            }
            .foregroundColor(Color.founderInk.opacity(0.6))

            Button {
                Task {
                    let ok = await vm.purchaseSelected()
                    if ok { onUnlock(); dismiss() }
                }
            } label: {
                Text("Continue")
                    .font(.system(size: 18, weight: .bold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.brandBrown)
                    .foregroundColor(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            }
            .disabled(vm.isPurchasing)
            .opacity(vm.isPurchasing ? 0.6 : 1)

            Button {
                Task {
                    let ok = await vm.restore()
                    if ok { onUnlock(); dismiss() }
                }
            } label: {
                Text("Restore Purchases")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color.founderInk.opacity(0.55))
            }
            .disabled(vm.isPurchasing)
        }
        .padding(.horizontal, 20)
        .padding(.top, 14)
        .padding(.bottom, 10)
        .background(
            Color.founderCream
                .shadow(color: .black.opacity(0.06), radius: 8, y: -4)
                .ignoresSafeArea(edges: .bottom)
        )
    }

    private var progressOverlay: some View {
        ZStack {
            Color.black.opacity(0.15).ignoresSafeArea()
            ProgressView()
                .scaleEffect(1.3)
                .tint(Color.brandBrown)
                .padding(26)
                .background(.regularMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        }
    }

    // MARK: - Default copy (edit freely)

    static let defaultNote = """
    Founded is built by a small team who believe the founder's day deserves a \
    quiet, Scripture-rooted pause. Your gift keeps it ad-free and growing — new \
    readings, better audio, and space for the next person who needs it. However \
    you give, thank you for holding this up with us.
    """

    static let defaultQuote = """
    “Remember this: Whoever sows sparingly will also reap sparingly, and whoever \
    sows generously will also reap generously.” — 2 Corinthians 9:6
    """
}

// MARK: - Preview (mock plans, no network / RevenueCat call)
//
// Uses plain PaywallPlan mocks so the canvas always renders. If you'd rather
// exercise the real mapping, build `TestStoreProduct` instances and feed them
// through `PaywallViewModel.makePlans` — but package purchase needs a live
// StoreKit config, so mock plans are the reliable preview path.
#Preview {
    DonationPaywallView(
        previewPlans: [
            PaywallPlan(id: "annual", title: "Annual Donation",
                        billedSubtitle: "$59.99 billed yearly",
                        perDayPrice: "$0.16", badge: "MOST POPULAR", package: nil),
            PaywallPlan(id: "weekly", title: "Weekly Donation",
                        billedSubtitle: "$9.99 billed weekly",
                        perDayPrice: "$1.43", badge: nil, package: nil),
        ]
    )
}
