import { ImageSourcePropType } from 'react-native';
import { CategoryId } from './types';

/** A representative cover photo for each category shelf (all people-free). */
export const CATEGORY_COVER: Record<CategoryId, ImageSourcePropType> = {
  money: require('../../assets/covers/biz-13651868.jpg'), // glass finance towers
  fear: require('../../assets/covers/biz-14160333.jpg'), // dark skyscraper
  deals: require('../../assets/covers/biz-14516298.jpg'), // empty boardroom
  launching: require('../../assets/covers/biz-12810099.jpg'), // looking up at towers
  partners: require('../../assets/covers/biz-12194166.jpg'), // city skyline at night
  team: require('../../assets/covers/biz-12662883.jpg'), // office lounge
  conversations: require('../../assets/covers/biz-12884331.jpg'), // meeting room
  wins: require('../../assets/covers/biz-11531154.jpg'), // skyline at sunset
  rhythms: require('../../assets/covers/biz-13977666.jpg'), // quiet room, soft light
  focus: require('../../assets/covers/biz-14819804.jpg'), // library shelves
};
