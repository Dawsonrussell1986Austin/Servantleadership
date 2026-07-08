import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

/// Brand colors. Each pulls from the asset catalog when the named color exists,
/// otherwise falls back to the brand hex so the view always renders (including
/// in previews without the catalog).
extension Color {
    static let brandBrown = Color.resolve("BrandBrown",
                                          fallback: Color(red: 0.545, green: 0.227, blue: 0.059)) // #8B3A0F
    static let founderCream = Color.resolve("FoundedCream",
                                            fallback: Color(red: 0.984, green: 0.941, blue: 0.894)) // #FBF0E4
    static let founderInk = Color(red: 0.13, green: 0.11, blue: 0.09)

    static func resolve(_ name: String, fallback: Color) -> Color {
        #if canImport(UIKit)
        if let ui = UIColor(named: name) { return Color(ui) }
        #endif
        return fallback
    }
}
