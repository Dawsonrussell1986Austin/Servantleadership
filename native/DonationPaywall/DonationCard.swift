import SwiftUI

/// A single selectable donation plan card: title + billed subtitle on the left,
/// the big per-day price on the right, an optional "MOST POPULAR" pill straddling
/// the top edge, and a bold border when selected.
struct DonationCard: View {
    let plan: PaywallPlan
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(alignment: .center, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(plan.title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color.founderInk)
                    Text(plan.billedSubtitle)
                        .font(.system(size: 13, weight: .regular))
                        .foregroundColor(Color.founderInk.opacity(0.55))
                }
                Spacer(minLength: 8)
                perDay
            }
            .padding(18)
            .frame(maxWidth: .infinity)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(border)
            .overlay(alignment: .top) { badge }
            .padding(.top, plan.badge != nil ? 11 : 0) // room for the pill overhang
        }
        .buttonStyle(.plain)
    }

    /// Big bold price + lighter "/day".
    private var perDay: some View {
        (Text(plan.perDayPrice)
            .font(.system(size: 26, weight: .heavy))
            .foregroundColor(Color.founderInk)
         + Text("/day")
            .font(.system(size: 15, weight: .regular))
            .foregroundColor(Color.founderInk.opacity(0.5)))
    }

    /// Selected → bold ink border. Weekly (unselected) keeps a heavier black
    /// border; annual (unselected) has none.
    private var border: some View {
        let selectedWidth: CGFloat = 2.5
        let restingWidth: CGFloat = plan.isAnnual ? 0 : 2
        let color: Color = isSelected ? Color.founderInk
            : (plan.isAnnual ? Color.clear : Color.black.opacity(0.85))
        return RoundedRectangle(cornerRadius: 18, style: .continuous)
            .strokeBorder(color, lineWidth: isSelected ? selectedWidth : restingWidth)
    }

    @ViewBuilder
    private var badge: some View {
        if let badge = plan.badge {
            Text(badge)
                .font(.system(size: 11, weight: .bold))
                .tracking(0.8)
                .foregroundColor(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 5)
                .background(Capsule().fill(Color.founderInk))
                .offset(y: -11)
        }
    }
}
