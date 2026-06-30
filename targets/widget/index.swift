import WidgetKit
import SwiftUI

// MARK: - Brand

private enum Brand {
    static let paper = Color(red: 0.984, green: 0.980, blue: 0.969) // #FBFAF7
    static let ink = Color(red: 0.125, green: 0.110, blue: 0.090)   // #201C17
    static let inkSoft = Color(red: 0.431, green: 0.396, blue: 0.353) // #6E655A
    static let accent = Color(red: 0.612, green: 0.420, blue: 0.247)  // #9C6B3F
}

// MARK: - Daily content
//
// The widget is intentionally self-contained: it computes the day's line from a
// fixed, ordered list so it works the instant it's added — no app launch, no
// shared storage, no network. The rotation is deterministic by day, so the same
// day always shows the same line.

private struct DailyLine {
    let text: String
    let reference: String
}

private let LINES: [DailyLine] = [
    .init(text: "Whatever you do, work at it with all your heart, as for the Lord.", reference: "Colossians 3:23"),
    .init(text: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3"),
    .init(text: "Be strong and courageous. Do not be afraid; the Lord goes with you.", reference: "Deuteronomy 31:6"),
    .init(text: "Unless the Lord builds the house, the builders labor in vain.", reference: "Psalm 127:1"),
    .init(text: "She is clothed with strength and dignity; she can laugh at the days to come.", reference: "Proverbs 31:25"),
    .init(text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7"),
    .init(text: "The plans of the diligent lead surely to abundance.", reference: "Proverbs 21:5"),
    .init(text: "I can do all this through him who gives me strength.", reference: "Philippians 4:13"),
    .init(text: "Let us not become weary in doing good, for at the proper time we will reap a harvest.", reference: "Galatians 6:9"),
    .init(text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5"),
    .init(text: "Whoever can be trusted with very little can also be trusted with much.", reference: "Luke 16:10"),
    .init(text: "The Lord will fight for you; you need only to be still.", reference: "Exodus 14:14"),
    .init(text: "Do not despise these small beginnings, for the Lord rejoices to see the work begin.", reference: "Zechariah 4:10"),
    .init(text: "Let your light shine before others, that they may see your good deeds.", reference: "Matthew 5:16"),
    .init(text: "Whatever your hand finds to do, do it with all your might.", reference: "Ecclesiastes 9:10"),
    .init(text: "He gives strength to the weary and increases the power of the weak.", reference: "Isaiah 40:29"),
    .init(text: "Commit your work to the Lord, and your plans will be established.", reference: "Proverbs 16:3"),
    .init(text: "And we know that in all things God works for the good of those who love him.", reference: "Romans 8:28"),
    .init(text: "Be still, and know that I am God.", reference: "Psalm 46:10"),
    .init(text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself.", reference: "Matthew 6:34"),
    .init(text: "The one who is faithful in a very little is faithful also in much.", reference: "Luke 16:10"),
]

private func lineFor(_ date: Date) -> DailyLine {
    let day = Calendar.current.ordinality(of: .day, in: .era, for: date) ?? 0
    return LINES[((day % LINES.count) + LINES.count) % LINES.count]
}

// MARK: - Timeline

struct ServantEntry: TimelineEntry {
    let date: Date
    let line: DailyLine
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> ServantEntry {
        ServantEntry(date: Date(), line: lineFor(Date()))
    }

    func getSnapshot(in context: Context, completion: @escaping (ServantEntry) -> Void) {
        completion(ServantEntry(date: Date(), line: lineFor(Date())))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<ServantEntry>) -> Void) {
        let cal = Calendar.current
        let startOfToday = cal.startOfDay(for: Date())
        var entries: [ServantEntry] = []
        // One entry per day for the coming week; iOS refreshes at each midnight.
        for offset in 0..<7 {
            if let day = cal.date(byAdding: .day, value: offset, to: startOfToday) {
                entries.append(ServantEntry(date: day, line: lineFor(day)))
            }
        }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

// MARK: - Views

private struct WidgetBackground: View {
    var body: some View {
        Brand.paper
    }
}

struct ServantWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: ServantEntry

    private var dateLine: String {
        let f = DateFormatter()
        f.dateFormat = "EEEE · MMM d"
        return f.string(from: entry.date).uppercased()
    }

    var body: some View {
        let isSmall = family == .systemSmall
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 6) {
                Circle()
                    .fill(Brand.accent)
                    .frame(width: 6, height: 6)
                Text("FOUNDED")
                    .font(.system(size: 11, weight: .bold))
                    .tracking(1.6)
                    .foregroundColor(Brand.accent)
            }

            Spacer(minLength: 8)

            Text(entry.line.text)
                .font(.system(size: isSmall ? 15 : 19, weight: .semibold, design: .serif))
                .foregroundColor(Brand.ink)
                .lineSpacing(2)
                .minimumScaleFactor(0.7)
                .lineLimit(isSmall ? 4 : 4)
                .fixedSize(horizontal: false, vertical: true)

            Spacer(minLength: 8)

            HStack {
                Text(entry.line.reference)
                    .font(.system(size: isSmall ? 11 : 12, weight: .semibold))
                    .foregroundColor(Brand.accent)
                Spacer()
                if !isSmall {
                    Text(dateLine)
                        .font(.system(size: 10, weight: .bold))
                        .tracking(1.0)
                        .foregroundColor(Brand.inkSoft.opacity(0.7))
                }
            }
        }
        .padding(isSmall ? 14 : 18)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
}

// MARK: - Widget

struct ServantWidget: Widget {
    let kind: String = "ServantWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                ServantWidgetView(entry: entry)
                    .containerBackground(for: .widget) { WidgetBackground() }
            } else {
                ServantWidgetView(entry: entry)
                    .background(WidgetBackground())
            }
        }
        .configurationDisplayName("Today's Verse")
        .description("A quiet line of Scripture for the work ahead, refreshed each day.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct ServantWidgetBundle: WidgetBundle {
    var body: some Widget {
        ServantWidget()
    }
}
