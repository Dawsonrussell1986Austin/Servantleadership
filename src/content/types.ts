export type CategoryId =
  | 'money'
  | 'fear'
  | 'deals'
  | 'launching'
  | 'partners'
  | 'team'
  | 'conversations'
  | 'wins'
  | 'rhythms'
  | 'focus';

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
  /** Approximate read/pray time in minutes. */
  minutes: number;
  sections: LiturgySection[];
  /**
   * 'liturgy' = a specific, situational reading (lives in the Library).
   * 'devotional' = a generic daily entrepreneurship reading (the Today tab).
   * Defaults to 'liturgy' when omitted.
   */
  kind?: 'liturgy' | 'devotional';
};

/** A daily devotional shares the same shape as a liturgy. */
export type Devotional = Liturgy;

export const CATEGORIES: Category[] = [
  { id: 'money', label: 'Money on the Line', blurb: 'Cash, runway, debt, and the weight of the numbers.' },
  { id: 'fear', label: 'Fear & Doubt', blurb: 'Failure, overwhelm, and the days you want to quit.' },
  { id: 'deals', label: 'Deals & Selling', blurb: 'The chase, the waiting, the yes and the no.' },
  { id: 'launching', label: 'Launching', blurb: 'Shipping it — and whatever the world does next.' },
  { id: 'partners', label: 'Partners', blurb: 'Co-founders, trust, betrayal, and parting well.' },
  { id: 'team', label: 'Leading a Team', blurb: 'Hiring, developing, and letting people go.' },
  { id: 'conversations', label: 'Hard Conversations', blurb: 'Clients, boundaries, and the talks you dread.' },
  { id: 'wins', label: 'Wins & Recognition', blurb: 'Milestones, applause, and holding it loosely.' },
  { id: 'rhythms', label: 'Begin & Rest', blurb: 'Mornings, evenings, Sabbath, and the new season.' },
  { id: 'focus', label: 'Heart & Focus', blurb: 'Comparison, distraction, and keeping your soul.' },
];

/**
 * Maps every reading id to its category. Kept here (rather than on each reading)
 * so the taxonomy can be reorganized in one place.
 */
export const CATEGORY_OF: Record<string, CategoryId> = {
  // money
  payroll: 'money', 'out-of-cash': 'money', downturn: 'money', 'paying-off-debt': 'money', profitable: 'money', 'legal-threat': 'money',
  // fear
  fraud: 'fear', overwhelmed: 'fear', 'uncertain-future': 'fear', 'want-to-quit': 'fear', 'public-mistake': 'fear', competitor: 'fear',
  // deals
  'waiting-on-yes': 'deals', 'lost-deal': 'deals', 'closing-a-deal': 'deals', 'the-pitch': 'deals', negotiation: 'deals', ghosted: 'deals',
  // launching
  launching: 'launching', 'flopped-launch': 'launching', 'first-yes': 'launching', 'unexpected-success': 'launching', 'new-season': 'launching',
  // partners
  'business-partner': 'partners', 'cofounder-split': 'partners', betrayal: 'partners', 'asking-for-help': 'partners',
  // team
  hiring: 'team', 'key-hire-yes': 'team', 'letting-go': 'team', 'struggling-team-member': 'team', resignation: 'team', delegating: 'team',
  // conversations
  'terrible-client': 'conversations', 'hard-conversation': 'conversations', 'saying-no': 'conversations', 'harsh-review': 'conversations', 'room-of-strangers': 'conversations',
  // wins
  milestone: 'wins', recognition: 'wins', 'selling-what-you-built': 'wins', 'first-generosity': 'wins',
  // rhythms
  morning: 'rhythms', evening: 'rhythms', monday: 'rhythms', sabbath: 'rhythms', 'late-night': 'rhythms',
  // focus
  comparison: 'focus', boredom: 'focus', mundane: 'focus', gratitude: 'focus', scattered: 'focus', 'impossible-decision': 'focus', 'decision-fatigue': 'focus',

  // daily devotionals (category drives accent/icon only)
  'd-calling': 'focus', 'd-integrity': 'focus', 'd-ambition': 'wins', 'd-generosity': 'wins',
  'd-identity': 'fear', 'd-diligence': 'rhythms', 'd-serving-others': 'conversations', 'd-patience': 'fear',
  'd-stewardship': 'money', 'd-excellence': 'rhythms', 'd-humility': 'partners', 'd-rest': 'rhythms',
  'd-courage': 'launching', 'd-perseverance': 'fear', 'd-contentment': 'focus', 'd-wisdom': 'team',
  'd-servant-leader': 'team', 'd-failure': 'fear', 'd-purpose': 'focus', 'd-trust-outcomes': 'deals',
  'd-gratitude': 'rhythms',
};

export const categoryOf = (id: string): CategoryId => CATEGORY_OF[id] ?? 'focus';
