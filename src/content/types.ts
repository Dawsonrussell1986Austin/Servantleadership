export type CategoryId = 'pressure' | 'people' | 'wins' | 'rhythms';

export type Category = {
  id: CategoryId;
  label: string;
  blurb: string;
};

export type SectionType =
  | 'call' // an opening line to settle in
  | 'scripture'
  | 'reflection'
  | 'prayer'
  | 'response' // a line for the reader to pray back / declare
  | 'benediction';

export type LiturgySection = {
  type: SectionType;
  /** Optional override for the section heading. */
  label?: string;
  body: string;
  /** Scripture reference, e.g. "Philippians 4:6–7". */
  reference?: string;
};

export type Liturgy = {
  id: string;
  /** "A Liturgy for ..." */
  title: string;
  /** One-line description of the moment this is for. */
  situation: string;
  category: CategoryId;
  /** Approximate read/pray time in minutes. */
  minutes: number;
  sections: LiturgySection[];
};

export const CATEGORIES: Category[] = [
  {
    id: 'pressure',
    label: 'Under Pressure',
    blurb: 'Cash, fear, failure, and the days you want to quit.',
  },
  {
    id: 'people',
    label: 'With People',
    blurb: 'Clients, partners, the team you lead and let go.',
  },
  {
    id: 'wins',
    label: 'The High Moments',
    blurb: 'Closing, launching, and the success you must hold loosely.',
  },
  {
    id: 'rhythms',
    label: 'Daily Rhythms',
    blurb: 'Begin, lay down, and keep your heart in the work.',
  },
];
