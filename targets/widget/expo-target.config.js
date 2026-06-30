/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: 'widget',
  name: 'Founded',
  // Brand accent, exposed to SwiftUI as Color("AccentColor")/asset catalog.
  colors: {
    $accent: '#9C6B3F',
    paper: '#FBFAF7',
    ink: '#201C17',
    inkSoft: '#6E655A',
  },
  deploymentTarget: '17.0',
};
