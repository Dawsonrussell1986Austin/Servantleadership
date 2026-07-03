import SwiftUI
import AVFoundation

// Founded for Apple Watch — today's devotional, whole and listenable.
//
// Fetches the day's reading from the app's own API and shows every part of it
// (verse, prayer, benediction) in one scroll. A play button streams the same
// narration the phone app uses. If the network is away, falls back to a
// bundled verse chosen deterministically by date, so the watch is never empty.

struct Today: Decodable {
    let id: String
    let title: String
    let situation: String
    let ref: String
    let verse: String
    let prayer: String?
    let benediction: String?
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

@MainActor
final class TodayModel: ObservableObject {
    @Published var today: Today?
    @Published var loading = true

    func load() async {
        defer { loading = false }
        guard let url = URL(string: "https://app.foundedapp.com/api/today") else { return }
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            today = try JSONDecoder().decode(Today.self, from: data)
        } catch {
            today = nil // view falls back to the bundled line
        }
    }
}

final class AudioModel: ObservableObject {
    @Published var playing = false
    private var player: AVPlayer?
    private var currentId: String?
    private var endObserver: NSObjectProtocol?

    func toggle(id: String) {
        if playing {
            player?.pause()
            playing = false
            return
        }
        if currentId != id || player == nil {
            guard let url = URL(string: "https://app.foundedapp.com/audio/\(id).mp3") else { return }
            if let o = endObserver { NotificationCenter.default.removeObserver(o) }
            let session = AVAudioSession.sharedInstance()
            try? session.setCategory(.playback, mode: .default)
            try? session.setActive(true)
            let p = AVPlayer(url: url)
            player = p
            currentId = id
            endObserver = NotificationCenter.default.addObserver(
                forName: .AVPlayerItemDidPlayToEndTime,
                object: p.currentItem,
                queue: .main
            ) { [weak self] _ in
                self?.playing = false
                self?.player?.seek(to: .zero)
            }
        }
        player?.play()
        playing = true
    }
}

struct ContentView: View {
    @StateObject private var model = TodayModel()
    @StateObject private var audio = AudioModel()

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

                    Button {
                        audio.toggle(id: t.id)
                    } label: {
                        Label(audio.playing ? "Pause" : "Listen", systemImage: audio.playing ? "pause.fill" : "play.fill")
                            .font(.system(size: 14, weight: .semibold))
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(Color.accentColor)
                    .padding(.vertical, 4)

                    sectionLabel("SCRIPTURE")
                    Text("“\(t.verse)”")
                        .font(.system(.body, design: .serif))
                    Text(t.ref)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Color.accentColor)

                    if let prayer = t.prayer, !prayer.isEmpty {
                        sectionLabel("PRAYER")
                        Text(prayer)
                            .font(.system(.body, design: .serif))
                    }

                    if let benediction = t.benediction, !benediction.isEmpty {
                        sectionLabel("BENEDICTION")
                        Text(benediction)
                            .font(.system(.body, design: .serif))
                            .italic()
                    }
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

    private func sectionLabel(_ title: String) -> some View {
        Text(title)
            .font(.system(size: 10, weight: .bold))
            .kerning(1.1)
            .foregroundStyle(.secondary)
            .padding(.top, 8)
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
