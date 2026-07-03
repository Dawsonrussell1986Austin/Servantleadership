/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: 'widget',
  name: 'Founded',
  // Brand accent, exposed to SwiftUI as Color("AccentColor")/asset catalog.
  colors: {
    $accent: '#C65A33',
    paper: '#FAF6EF',
    ink: '#211D16',
    inkSoft: '#5C554A',
  },
  deploymentTarget: '17.0',
};
