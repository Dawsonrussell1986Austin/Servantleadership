/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: 'watch',
  name: 'FoundedWatch',
  displayName: 'Founded',
  icon: '../../assets/icon.png',
  frameworks: ['AVFoundation'],
  bundleIdentifier: 'com.servantleadership.liturgies.watchkitapp',
  deploymentTarget: '10.0',
  colors: {
    $accent: '#C65A33',
  },
};
