import { ImageSourcePropType } from 'react-native';

/**
 * Cover photography, bundled locally. Metro requires static require() paths.
 * Each reading is mapped to a stable image by id.
 */
const ALL: ImageSourcePropType[] = [
  require('../../assets/covers/cover-51.jpg'),
  require('../../assets/covers/cover-112.jpg'),
  require('../../assets/covers/cover-127.jpg'),
  require('../../assets/covers/cover-223.jpg'),
  require('../../assets/covers/cover-251.jpg'),
  require('../../assets/covers/cover-267.jpg'),
  require('../../assets/covers/cover-277.jpg'),
  require('../../assets/covers/cover-301.jpg'),
  require('../../assets/covers/cover-314.jpg'),
  require('../../assets/covers/cover-327.jpg'),
  require('../../assets/covers/cover-368.jpg'),
  require('../../assets/covers/cover-376.jpg'),
  require('../../assets/covers/cover-386.jpg'),
  require('../../assets/covers/cover-397.jpg'),
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** A stable cover image for a reading. */
export function coverFor(id: string): ImageSourcePropType {
  return ALL[hash(id) % ALL.length];
}
