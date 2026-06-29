import { ImageSourcePropType } from 'react-native';
import { CategoryId } from './types';

/**
 * Atmospheric cover photography, bundled locally. Metro requires static
 * require() paths, so each image is referenced explicitly.
 */
const C = {
  sea: require('../../assets/covers/cover-51.jpg'),
  wheat: require('../../assets/covers/cover-112.jpg'),
  forest: require('../../assets/covers/cover-127.jpg'),
  cityLights: require('../../assets/covers/cover-223.jpg'),
  valleyPath: require('../../assets/covers/cover-251.jpg'),
  mistBeach: require('../../assets/covers/cover-267.jpg'),
  fieldPath: require('../../assets/covers/cover-277.jpg'),
  autumnPath: require('../../assets/covers/cover-301.jpg'),
  openRoad: require('../../assets/covers/cover-314.jpg'),
  peak: require('../../assets/covers/cover-327.jpg'),
  goldenValley: require('../../assets/covers/cover-368.jpg'),
  cityStreet: require('../../assets/covers/cover-376.jpg'),
  summit: require('../../assets/covers/cover-386.jpg'),
  village: require('../../assets/covers/cover-397.jpg'),
} as const;

// Each category draws from a themed pool so the imagery feels intentional.
const POOLS: Record<CategoryId, ImageSourcePropType[]> = {
  pressure: [C.sea, C.openRoad, C.summit, C.mistBeach],
  people: [C.forest, C.cityLights, C.cityStreet, C.village],
  wins: [C.peak, C.goldenValley, C.fieldPath, C.wheat],
  rhythms: [C.valleyPath, C.autumnPath, C.goldenValley, C.wheat],
};

// Daily devotionals get the most open, hopeful imagery.
const DEVOTIONAL_POOL: ImageSourcePropType[] = [
  C.goldenValley,
  C.valleyPath,
  C.fieldPath,
  C.peak,
  C.wheat,
  C.openRoad,
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** A stable cover photo for a reading, themed by category / kind. */
export function coverFor(
  id: string,
  category: CategoryId,
  kind?: string,
): ImageSourcePropType {
  const pool = kind === 'devotional' ? DEVOTIONAL_POOL : POOLS[category];
  return pool[hash(id) % pool.length];
}
