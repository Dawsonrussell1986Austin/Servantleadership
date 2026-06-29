import { Liturgy } from './types';
import { LITURGIES } from './liturgies';

/**
 * Offline "describe your moment" search for the Library. No network, no model —
 * just a curated keyword index per liturgy plus light synonym expansion and
 * token/phrase scoring. Good enough to turn "my client is being a nightmare"
 * into the terrible-client liturgy.
 */

// Curated keywords & phrases per liturgy id (includes common synonyms).
const KEYWORDS: Record<string, string[]> = {
  payroll: ['payroll', 'pay', 'salary', 'salaries', 'wages', 'team', 'employees', 'staff', 'money', 'cash', 'broke', 'afford', 'make payroll', "can't pay", 'rent', 'bills', 'provide', 'short'],
  'out-of-cash': ['cash', 'money', 'runway', 'broke', 'bankrupt', 'funds', 'running out', 'low on money', 'savings', 'burn rate', 'expenses', 'afford', 'financial', 'scared about money', 'debt'],
  'lost-deal': ['lost', 'deal', 'rejected', 'rejection', 'fell through', 'turned down', 'said no', 'pipeline', 'disappointed', 'lost the deal', 'they passed'],
  'want-to-quit': ['quit', 'give up', 'done', 'burnout', 'burned out', 'exhausted', 'tired', 'walk away', 'shut down', 'stop', 'hopeless', 'dream feels heavy', 'cant go on', 'throw in the towel'],
  'waiting-on-yes': ['waiting', 'hope', 'deal', 'yes', 'pending', 'anticipation', 'will they say yes', 'close today', 'tomorrow', 'hear back', 'on the edge', 'refreshing'],
  overwhelmed: ['overwhelmed', 'too much', 'stressed', 'stress', 'swamped', 'buried', 'drowning', 'so busy', 'no time', 'anxiety', 'anxious', 'everything at once', 'panic', 'cant keep up'],
  'impossible-decision': ['decision', 'decide', 'choice', 'choose', 'fork', 'two roads', 'options', 'crossroads', 'hard call', 'cant decide', 'torn', 'which way'],
  fraud: ['fraud', 'impostor', 'imposter', 'not qualified', 'unqualified', 'fake', 'faking it', 'self doubt', 'doubt myself', 'not enough', 'theyll find out', 'inadequate', 'in over my head'],
  'public-mistake': ['mistake', 'failed', 'failure', 'embarrassed', 'shame', 'screwed up', 'messed up', 'public', 'in front of everyone', 'wrong', 'blunder', 'humiliated'],
  'uncertain-future': ['uncertain', 'future', 'unknown', 'unsure', 'scared of the future', 'what if', 'dont know whats next', 'direction', 'fog', 'cant see ahead'],
  'terrible-client': ['client', 'customer', 'rude', 'difficult', 'nightmare', 'unreasonable', 'mean', 'angry client', 'impossible client', 'demanding', 'complaint', 'abusive', 'disrespectful'],
  'business-partner': ['partner', 'cofounder', 'co-founder', 'business partner', 'conflict', 'falling out', 'disagreement', 'fight', 'angry', 'upset', 'betrayed by my partner', 'tension', 'argument'],
  hiring: ['hire', 'hiring', 'new employee', 'onboarding', 'team member', 'recruit', 'first hire', 'bringing someone on', 'staff', 'offer', 'new person'],
  'letting-go': ['fire', 'firing', 'let go', 'layoff', 'lay off', 'terminate', 'letting someone go', 'dismiss', 'redundancy', 'cut someone', 'have to fire'],
  'struggling-team-member': ['underperforming', 'struggling employee', 'not performing', 'team member', 'poor performance', 'manage', 'coaching', 'difficult employee', 'improvement', 'not working out'],
  betrayal: ['betrayed', 'betrayal', 'let down', 'backstabbed', 'trust broken', 'disloyal', 'cheated', 'stabbed in the back', 'deceived', 'lied to'],
  'the-pitch': ['pitch', 'investor', 'raise', 'fundraising', 'presentation', 'ask for money', 'vc', 'demo day', 'pitching', 'funding', 'present', 'pitch deck'],
  'hard-conversation': ['hard conversation', 'difficult conversation', 'confront', 'confrontation', 'dreading', 'tough talk', 'address it', 'feedback', 'tell them', 'avoiding'],
  'saying-no': ['say no', 'saying no', 'boundaries', 'boundary', 'people pleasing', 'overcommitted', 'decline', 'too many yeses', 'cant say no', 'guilt', 'stretched thin'],
  'closing-a-deal': ['closed', 'closing', 'deal', 'signed', 'won', 'win', 'contract', 'customer', 'sale', 'landed', 'new client', 'yes', 'we won'],
  launching: ['launch', 'launching', 'ship', 'shipping', 'release', 'go live', 'product launch', 'publish', 'debut', 'reveal', 'launch day'],
  'unexpected-success': ['success', 'viral', 'blew up', 'took off', 'unexpected', 'sudden growth', 'more than expected', 'windfall', 'overnight', 'exploded'],
  'first-yes': ['first customer', 'first sale', 'first dollar', 'first yes', 'first client', 'first revenue', 'beginning', 'small start', 'traction', 'someone bought'],
  milestone: ['milestone', 'anniversary', 'revenue goal', 'hit a number', 'hit goal', 'achievement', 'marker', 'one year', 'reached', 'progress'],
  recognition: ['award', 'recognition', 'praise', 'spotlight', 'featured', 'honored', 'applause', 'recognized', 'press', 'fame', 'attention', 'compliment'],
  'selling-what-you-built': ['sell my business', 'selling', 'exit', 'acquisition', 'acquired', 'sold', 'handing off', 'letting go of the company', 'moving on', 'end of a chapter'],
  morning: ['morning', 'start the day', 'before work', 'beginning', 'wake up', 'sunrise', 'new day', 'start'],
  evening: ['evening', 'end of day', 'night', 'wind down', 'lay it down', 'rest', 'close the day', 'before bed', 'shut off', 'cant switch off'],
  comparison: ['comparison', 'compare', 'jealous', 'envy', 'envious', 'everyone else', 'behind', 'social media', 'scrolling', 'feel small', 'inferior', 'others are ahead'],
  boredom: ['bored', 'boredom', 'dull', 'monotony', 'uninspired', 'gray', 'stuck', 'restless', 'lost passion', 'meaningless', 'grind', 'no spark'],
  monday: ['monday', 'start of the week', 'new week', 'dread', 'week ahead', 'beginning of week'],
  sabbath: ['sabbath', 'rest', 'day off', 'stop', 'rest day', 'cant stop', 'overwork', 'workaholic', 'recharge', 'pause', 'time off'],
  mundane: ['mundane', 'boring tasks', 'admin', 'email', 'invoices', 'tedious', 'small tasks', 'unglamorous', 'busywork', 'routine', 'paperwork'],
  gratitude: ['gratitude', 'thankful', 'grateful', 'thanks', 'blessed', 'appreciate', 'content', 'perspective', 'count my blessings'],
  'harsh-review': ['harsh review', 'bad review', 'criticism', 'critic', 'negative feedback', 'trolled', 'hate comments', 'one star', 'public criticism', 'torn apart', 'roasted'],
  competitor: ['competitor', 'competition', 'rival', 'copying us', 'copied', 'beating us', 'losing market share', 'they launched', 'undercut', 'catching up', 'threat'],
  'legal-threat': ['lawsuit', 'sued', 'legal', 'lawyer', 'cease and desist', 'court', 'litigation', 'legal threat', 'demand letter', 'dispute', 'sue'],
  downturn: ['downturn', 'recession', 'market crash', 'economy', 'sales dropping', 'slowdown', 'revenue down', 'hard times', 'bear market', 'tough economy', 'crisis'],
  ghosted: ['ghosted', 'silence', 'no reply', 'not responding', 'went quiet', 'stopped responding', 'waiting to hear back', 'no response', 'ignored', 'left on read'],
  'flopped-launch': ['flop', 'flopped', 'launch failed', 'no one came', 'crickets', 'bombed', 'launch flopped', 'nobody bought', 'disappointing launch', 'quiet launch'],
  'cofounder-split': ['cofounder leaving', 'co-founder split', 'partner leaving', 'parting ways', 'splitting up', 'breaking up', 'dissolve partnership', 'founder breakup', 'separate ways'],
  'asking-for-help': ['ask for help', 'need help', 'stuck', 'too proud', 'cant do it alone', 'reach out', 'support', 'admit i need help', 'help me'],
  negotiation: ['negotiation', 'negotiate', 'deal terms', 'contract terms', 'bargaining', 'haggle', 'term sheet', 'negotiating', 'across the table'],
  resignation: ['resigned', 'resignation', 'gave notice', 'two weeks notice', 'leaving the company', 'employee leaving', 'someone quit', 'star employee leaving', 'they quit'],
  'room-of-strangers': ['networking', 'event', 'mixer', 'conference', 'room of strangers', 'small talk', 'dont know anyone', 'meet people', 'introvert', 'work the room'],
  delegating: ['delegate', 'delegating', 'let go of control', 'hand off', 'micromanage', 'control', 'cant let go', 'do it all myself', 'trust the team', 'bottleneck'],
  profitable: ['profitable', 'profit', 'break even', 'breakeven', 'in the black', 'making money', 'sustainable', 'positive cash flow', 'finally profitable'],
  'first-generosity': ['give back', 'generosity', 'donate', 'donation', 'tithe', 'giving', 'first gift', 'charity', 'bless others', 'share the profit'],
  'key-hire-yes': ['great hire', 'dream hire', 'they said yes', 'key person joining', 'landed the hire', 'accepted offer', 'perfect fit joined', 'top candidate'],
  'paying-off-debt': ['paid off', 'debt free', 'cleared the loan', 'no more debt', 'loan paid', 'paid back', 'out of debt', 'zero balance', 'financial freedom'],
  'new-season': ['new year', 'new quarter', 'new chapter', 'fresh start', 'new season', 'planning', 'goals for the year', 'beginning of the year', 'reset'],
  'late-night': ['late night', 'working late', 'up late', 'midnight', 'still working', 'midnight oil', 'cant stop working', 'grinding late'],
  scattered: ['cant focus', 'scattered', 'distracted', 'distraction', 'focus', 'attention', 'all over the place', 'spread thin', 'cant concentrate'],
  'decision-fatigue': ['decision fatigue', 'too many decisions', 'decided all day', 'cant decide anymore', 'exhausted by choices', 'brain fried', 'no more choices', 'depleted'],
};

// Query-side synonym expansion: a token maps to extra tokens to also match on.
const SYNONYMS: Record<string, string[]> = {
  money: ['cash', 'payroll', 'broke', 'funds'],
  broke: ['money', 'cash', 'payroll'],
  angry: ['upset', 'furious', 'mad', 'frustrated'],
  upset: ['angry', 'frustrated', 'hurt'],
  mad: ['angry', 'furious'],
  furious: ['angry'],
  frustrated: ['angry', 'upset'],
  stressed: ['overwhelmed', 'anxious'],
  anxious: ['worried', 'fear', 'scared', 'stressed'],
  worried: ['anxious', 'fear'],
  scared: ['fear', 'afraid', 'anxious'],
  afraid: ['fear', 'scared'],
  customer: ['client'],
  client: ['customer'],
  cofounder: ['partner'],
  employee: ['team', 'staff'],
  staff: ['team', 'employee'],
  fired: ['fire', 'terminate', 'layoff'],
  firing: ['fire', 'terminate'],
  launch: ['release', 'ship'],
  ship: ['launch', 'release'],
  quit: ['quitting', 'done', 'burnout'],
  tired: ['exhausted', 'burnout'],
  exhausted: ['burnout', 'tired'],
  jealous: ['envy', 'comparison'],
  envy: ['jealous', 'comparison'],
  decision: ['decide', 'choice'],
  nightmare: ['terrible', 'difficult', 'awful'],
  rude: ['mean', 'disrespectful'],
  win: ['won', 'closed', 'success'],
  won: ['win', 'closed'],
  pay: ['payroll', 'salary', 'wages'],
};

const STOPWORDS = new Set([
  'i', 'im', 'a', 'an', 'the', 'to', 'is', 'am', 'are', 'of', 'and', 'with', 'for',
  'on', 'in', 'this', 'that', 'it', 'we', 'our', 'my', 'me', 'just', 'really', 'so',
  'feeling', 'feel', 'today', 'now', 'about', 'have', 'has', 'had', 'be', 'been',
  'cant', 'cannot', 'dont', 'not', 'no', 'but', 'or', 'at', 'as', 'was', 'were',
  'how', 'do', 'i’m', 'youre', 'going', 'through', 'right', 'getting', 'get',
]);

function normalize(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map(normalize)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// Precompute a normalized token set per liturgy from keywords + title + situation.
const INDEX: Record<string, Set<string>> = {};
for (const l of LITURGIES) {
  const tokens = new Set<string>();
  const add = (text: string) => tokenize(text).forEach((t) => tokens.add(t));
  (KEYWORDS[l.id] ?? []).forEach(add);
  add(l.title);
  add(l.situation);
  INDEX[l.id] = tokens;
}

export type SearchResult = { liturgy: Liturgy; score: number };

export function searchLiturgies(query: string): SearchResult[] {
  const raw = query.trim().toLowerCase();
  if (raw.length < 2) return [];

  const baseTokens = tokenize(query);
  if (baseTokens.length === 0) return [];

  // Expand with synonyms.
  const qTokens = new Set<string>(baseTokens);
  for (const t of baseTokens) {
    (SYNONYMS[t] ?? []).forEach((s) => qTokens.add(normalize(s)));
  }

  const results: SearchResult[] = [];
  for (const l of LITURGIES) {
    const idx = INDEX[l.id];
    let score = 0;

    // Phrase match: a curated phrase appears in the raw query (or vice-versa).
    for (const phrase of KEYWORDS[l.id] ?? []) {
      const p = phrase.toLowerCase();
      if (p.includes(' ') && (raw.includes(p) || p.includes(raw))) score += 4;
    }

    for (const t of qTokens) {
      if (idx.has(t)) {
        score += 2;
      } else {
        for (const tok of idx) {
          if (tok.length >= 4 && t.length >= 4 && (tok.startsWith(t) || t.startsWith(tok))) {
            score += 1;
            break;
          }
        }
      }
    }

    if (score > 0) results.push({ liturgy: l, score });
  }

  return results.sort((a, b) => b.score - a.score);
}
