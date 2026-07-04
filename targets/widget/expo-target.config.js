/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: 'widget',
  name: 'FoundedWidget',
  bundleIdentifier: 'com.servantleadership.liturgies.widget',
  // Brand accent, exposed to SwiftUI as Color("AccentColor")/asset catalog.
  colors: {
    $accent: '#C65A33',
    paper: '#FAF6EF',
    ink: '#211D16',
    inkSoft: '#5C554A',
  },
  // App logo, available in SwiftUI as Image("logo").
  images: {
    logo: '../../assets/icon.png',
  },
  deploymentTarget: '17.0',
};
