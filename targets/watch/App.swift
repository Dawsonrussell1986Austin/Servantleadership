import SwiftUI

// Founded for Apple Watch — the complete daily devotional at a glance.
//
// Fetches the day's reading from the app's own API and renders every section
// (call, scripture, reflection, prayer, response, benediction) in one scroll.
// Listening happens on the phone, where the audio experience is good — the
// watch just points there. If the network is away, falls back to a bundled
// verse chosen deterministically by date, so the watch is never empty.

struct TodaySection: Decodable {
    let type: String
    let label: String?
    let body: String
    let reference: String?
}

struct Today: Decodable {
    let id: String
    let title: String
    let situation: String
    let ref: String
    let verse: String
    let prayer: String?
    let benediction: String?
    let sections: [TodaySection]?
}

struct FallbackLine {
    let text: String
    let reference: String
}

private let FALLBACKS: [FallbackLine] = [
    .init(text: "Whatever you do, work at it with all your heart, as for the Lord.", reference: "Colossians 3:23"),
    .init(text: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3"),
    .init(text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7"),
    .init(text: "Be still, and know that I am God.", reference: "Psalm 46:10"),
    .init(text: "Unless the Lord builds the house, the builders labor in vain.", reference: "Psalm 127:1"),
    .init(text: "The Lord will fight for you; you need only to be still.", reference: "Exodus 14:14"),
    .init(text: "Do not despise these small beginnings.", reference: "Zechariah 4:10"),
]

private func fallbackFor(_ date: Date) -> FallbackLine {
    let day = Calendar.current.ordinality(of: .day, in: .era, for: date) ?? 0
    return FALLBACKS[day % FALLBACKS.count]
}

// Same section headings the phone app uses.
private func headingFor(_ section: TodaySection) -> String {
    if let label = section.label, !label.isEmpty { return label.uppercased() }
    switch section.type {
    case "call": return "BE STILL"
    case "scripture": return "THE WORD"
    case "reflection": return "REFLECTION"
    case "prayer": return "LET’S PRAY"
    case "response": return "PRAY THIS BACK"
    case "benediction": return "GO IN PEACE"
    default: return section.type.uppercased()
    }
}

@MainActor
final class TodayModel: ObservableObject {
    @Published var today: Today?
    @Published var loading = true

    func load() async {
        defer { loading = false }
        // Send the device's LOCAL date so the reading rolls at local midnight,
        // matching the app (the API otherwise defaults to UTC).
        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd"
        let today = df.string(from: Date())
        guard let url = URL(string: "https://app.foundedapp.com/api/today?date=\(today)") else { return }
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            today = try JSONDecoder().decode(Today.self, from: data)
        } catch {
            today = nil // view falls back to the bundled line
        }
    }
}

struct SectionView: View {
    let section: TodaySection

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(headingFor(section))
                .font(.system(size: 10, weight: .bold))
                .kerning(1.1)
                .foregroundStyle(section.type == "scripture" ? Color.accentColor : Color.secondary)
                .padding(.top, 10)

            switch section.type {
            case "scripture":
                Text("“\(section.body)”")
                    .font(.system(.body, design: .serif))
                if let ref = section.reference, !ref.isEmpty {
                    Text("— \(ref)")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Color.accentColor)
                }
            case "response":
                Text(section.body)
                    .font(.system(.body, design: .serif))
                    .fontWeight(.semibold)
            case "benediction":
                Text(section.body)
                    .font(.system(.body, design: .serif))
                    .italic()
                    .foregroundStyle(.secondary)
            default:
                Text(section.body)
                    .font(.system(.body, design: .serif))
            }
        }
    }
}

struct ContentView: View {
    @StateObject private var model = TodayModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text("FOUNDED · TODAY")
                    .font(.system(size: 11, weight: .bold))
                    .kerning(1.2)
                    .foregroundStyle(Color.accentColor)

                if let t = model.today {
                    Text(t.title)
                        .font(.system(.headline, design: .serif))
                    Text(t.situation)
                        .font(.system(.footnote, design: .serif))
                        .italic()
                        .foregroundStyle(.secondary)

                    if let sections = t.sections, !sections.isEmpty {
                        // The complete reading, section by section.
                        ForEach(sections.indices, id: \.self) { i in
                            SectionView(section: sections[i])
                        }
                    } else {
                        // Older API without sections — the daily summary.
                        Divider().padding(.vertical, 2)
                        Text("“\(t.verse)”")
                            .font(.system(.body, design: .serif))
                        Text(t.ref)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(Color.accentColor)
                        if let prayer = t.prayer, !prayer.isEmpty {
                            Text(prayer)
                                .font(.system(.body, design: .serif))
                                .padding(.top, 6)
                        }
                        if let benediction = t.benediction, !benediction.isEmpty {
                            Text(benediction)
                                .font(.system(.body, design: .serif))
                                .italic()
                                .foregroundStyle(.secondary)
                                .padding(.top, 6)
                        }
                    }

                    // Listening lives on the phone, where it sounds right.
                    HStack(spacing: 6) {
                        Image(systemName: "iphone")
                            .font(.system(size: 12))
                        Text("Listen in Founded on your iPhone")
                            .font(.system(size: 12, weight: .medium))
                    }
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding(.top, 14)
                } else if model.loading {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .padding(.top, 24)
                } else {
                    let line = fallbackFor(Date())
                    Text("“\(line.text)”")
                        .font(.system(.body, design: .serif))
                    Text(line.reference)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Color.accentColor)
                }
            }
            .padding(.horizontal, 4)
        }
        .task { await model.load() }
    }
}

@main
struct FoundedWatchApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
