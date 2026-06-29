import { Liturgy } from './types';

/**
 * The library. Every liturgy follows a gentle arc:
 *   call  →  scripture  →  reflection  →  prayer  →  response  →  benediction
 * Each is built to be read slowly in about five minutes.
 */
export const LITURGIES: Liturgy[] = [
  // ─────────────────────────────────────────── UNDER PRESSURE
  {
    id: 'payroll',
    title: 'A Liturgy for Not Making Payroll',
    situation: 'When the account is short and people are counting on you.',
    category: 'pressure',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'Before you open the spreadsheet again, open your hands. Breathe. The weight you carry was never meant to be carried alone.',
      },
      {
        type: 'scripture',
        reference: 'Matthew 6:31–33',
        body: '“So do not worry, saying, ‘What shall we eat?’ or ‘What shall we drink?’ … your heavenly Father knows that you need them. But seek first his kingdom and his righteousness, and all these things will be given to you as well.”',
      },
      {
        type: 'reflection',
        body: 'You feel the names. Not numbers — names. The people who trusted you with their mortgages and their groceries. That weight is holy; it means you have not stopped caring. But the provider of this company is not you. You are a steward, not the source. The God who has carried you to this exact, narrow place is not surprised by the balance, and he has not handed you these people only to abandon you with them.',
      },
      {
        type: 'prayer',
        body: 'Father, I am afraid, and I bring the fear to you instead of pretending it away. You see the shortfall. You see the faces I am responsible for. I cannot manufacture what is not here. So I ask plainly: provide. Make a way I cannot see. And if the way is hard, give me the honesty to lead through it with integrity, and the courage to make the calls I am dreading.',
      },
      {
        type: 'response',
        body: 'I am a steward, not the source. I will do the next right thing, and I will trust the One who feeds the birds.',
      },
      {
        type: 'benediction',
        body: 'Go and do what is honest. You are not your bank balance. You are held.',
      },
    ],
  },
  {
    id: 'out-of-cash',
    title: 'A Liturgy for the Fear of Running Out',
    situation: 'When the runway is short and the math keeps you up at night.',
    category: 'pressure',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'It is late, or it is early, and the numbers are running on a loop. Stop the loop for five minutes. Let this be the quietest thing you do today.',
      },
      {
        type: 'scripture',
        reference: 'Philippians 4:6–7',
        body: '“Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.”',
      },
      {
        type: 'reflection',
        body: 'Fear is a liar with a calculator. It takes today’s shortage and multiplies it out to a ruin that has not happened and may never happen. Scripture does not tell you to stop counting; it tells you to count differently — to set every petition beside thanksgiving, so the ledger of your fears always sits next to the ledger of God’s faithfulness. Look back. You have been in tight places before. You are still here.',
      },
      {
        type: 'prayer',
        body: 'Lord, I have been doing math that only multiplies my dread. Quiet the loop. I give you the runway and the unknowns at the end of it. Guard my mind tonight. Tomorrow, give me one clear step, and the discipline to take it without panic.',
      },
      {
        type: 'response',
        body: 'I will not borrow tomorrow’s trouble. Today has enough grace in it.',
      },
      {
        type: 'benediction',
        body: 'May the peace that makes no sense stand guard at the door of your mind tonight.',
      },
    ],
  },
  {
    id: 'lost-deal',
    title: 'A Liturgy for the Deal That Fell Through',
    situation: 'When the “yes” you were counting on turned into a “no.”',
    category: 'pressure',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You had already spent it in your mind — the relief, the next hire, the proof. Let your grip loosen on the thing that didn’t come.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 16:9',
        body: '“In their hearts humans plan their course, but the Lord establishes their steps.”',
      },
      {
        type: 'reflection',
        body: 'A lost deal is a small grief, and small griefs deserve honesty too. You are allowed to be disappointed. But a closed door is not always a punishment — sometimes it is protection you cannot yet read. Your worth was never riding on this signature. The “no” tells you about one outcome; it does not tell you about your calling, your competence, or your standing before God.',
      },
      {
        type: 'prayer',
        body: 'Father, I wanted this one. I am letting myself feel the loss instead of rushing past it. Establish my steps even when my plans collapse. Keep me from bitterness toward the people who said no, and keep me from despair. Show me what is next.',
      },
      {
        type: 'response',
        body: 'My steps are established by God, not by any single yes.',
      },
      {
        type: 'benediction',
        body: 'Go gently. The next door is already being prepared.',
      },
    ],
  },
  {
    id: 'want-to-quit',
    title: 'A Liturgy for When You Want to Quit',
    situation: 'When you are exhausted and the dream feels like a burden.',
    category: 'pressure',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'You are tired in a way sleep doesn’t fix. Don’t make a forever decision from inside a hard week. Just be here for five minutes.',
      },
      {
        type: 'scripture',
        reference: 'Galatians 6:9',
        body: '“Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.”',
      },
      {
        type: 'reflection',
        body: 'There is a difference between a calling that is finished and a soul that is depleted, and exhaustion makes them look the same. Elijah, after his greatest victory, sat under a tree and asked to die. God’s first response was not a sermon — it was a meal and a nap. Maybe what you need to quit is not the work but the pace, the self-reliance, the lie that it all depends on you. Rest first. Decide later.',
      },
      {
        type: 'prayer',
        body: 'Lord, I am running on empty and I have been pretending I’m fine. I don’t know if I’m meant to push through or lay something down — but you do. Restore me before I decide anything. Feed me. Quiet me. And in your time, make the way forward clear.',
      },
      {
        type: 'response',
        body: 'I will rest before I decide. Weariness will not write my future.',
      },
      {
        type: 'benediction',
        body: 'Go and rest without guilt. Even the strongest prophets needed bread and sleep.',
      },
    ],
  },
  // ─────────────────────────────────────────── WITH PEOPLE
  {
    id: 'terrible-client',
    title: 'A Liturgy for a Terrible Client',
    situation: 'When someone you serve is unkind, unreasonable, or impossible.',
    category: 'people',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'Before you reply to that message, set the phone down. Five minutes here will protect a relationship — or your integrity — out there.',
      },
      {
        type: 'scripture',
        reference: 'Romans 12:18',
        body: '“If it is possible, as far as it depends on you, live at peace with everyone.”',
      },
      {
        type: 'reflection',
        body: 'Notice the limits in that verse: “if it is possible” and “as far as it depends on you.” You are not commanded to make a difficult person reasonable — only to keep your own side of the street clean. Their behavior is theirs to answer for. Your tone, your honesty, your refusal to be controlled by contempt — those are yours. You can hold a firm boundary and a soft heart at the same time. You can even, by grace, see a frightened or wounded person underneath the rudeness.',
      },
      {
        type: 'prayer',
        body: 'Father, this person is wearing me down. Keep me from returning insult for insult or letting resentment make a home in me. Give me words that are clear and kind and unafraid. Where I need to set a boundary, give me the spine to do it cleanly. And help me see them, even now, as someone you love.',
      },
      {
        type: 'response',
        body: 'I will guard my own heart and my own words. The rest is not mine to carry.',
      },
      {
        type: 'benediction',
        body: 'Go in peace that does not depend on their approval.',
      },
    ],
  },
  {
    id: 'business-partner',
    title: 'A Liturgy for Conflict With a Partner',
    situation: 'When you are angry or hurt by the person building beside you.',
    category: 'people',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'This one cuts deeper because you chose them. Before you rehearse the argument again, bring the wound here first.',
      },
      {
        type: 'scripture',
        reference: 'Ephesians 4:26–27, 32',
        body: '“In your anger do not sin: Do not let the sun go down while you are still angry, and do not give the devil a foothold. … Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.”',
      },
      {
        type: 'reflection',
        body: 'Anger itself is not the sin — Scripture assumes you will feel it. The danger is what anger becomes when it is fed in the dark: a foothold, a case you build silently, a story where you are wholly right and they are wholly wrong. Real stories are rarely that clean. Before you decide what they did, ask honestly what you contributed. Forgiveness is not pretending it didn’t hurt; it is refusing to let the hurt become a permanent resident. You forgave once because you were forgiven first.',
      },
      {
        type: 'prayer',
        body: 'Lord, I am angry, and some of it is righteous and some of it is just pride. Help me tell the difference. Don’t let me nurse this in silence until it hardens. Give me the courage for an honest, direct conversation — not a war, not avoidance. Soften me where I am self-righteous. Strengthen me where I have been too afraid to speak the truth.',
      },
      {
        type: 'response',
        body: 'I will not feed this in the dark. I will seek the truth and offer the grace I have been given.',
      },
      {
        type: 'benediction',
        body: 'Go and make peace before the sun goes down — for your sake as much as theirs.',
      },
    ],
  },
  {
    id: 'hiring',
    title: 'A Liturgy for Bringing Someone On',
    situation: 'When you are about to entrust your work to a new person.',
    category: 'people',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You are about to change someone’s life and weave them into yours. Pause and treat the moment as the sacred thing it is.',
      },
      {
        type: 'scripture',
        reference: 'Luke 16:10',
        body: '“Whoever can be trusted with very little can also be trusted with much.”',
      },
      {
        type: 'reflection',
        body: 'A new hire is not a resource you are acquiring; they are a person you are inviting to spend their one life inside the world you are building. That is a stewardship in both directions. They are entrusting you with their gifts and their season; you are entrusting them with your mission and your customers. Lead in a way that, years from now, they will be glad they said yes.',
      },
      {
        type: 'prayer',
        body: 'Father, give me wisdom to choose well and grace to lead well. Help me see this person clearly — not just what they can do, but who they are becoming. Make me the kind of leader who is worthy of their trust. And may this work be good for them, not just good for me.',
      },
      {
        type: 'response',
        body: 'I will steward this person well. They are not a means to my ends.',
      },
      {
        type: 'benediction',
        body: 'Go and build a place where people flourish.',
      },
    ],
  },
  {
    id: 'letting-go',
    title: 'A Liturgy for Letting Someone Go',
    situation: 'When you have to end someone’s role, and it weighs on you.',
    category: 'people',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'If this were easy, something would be wrong with you. The weight you feel is your conscience working. Sit with it for a moment.',
      },
      {
        type: 'scripture',
        reference: 'Colossians 4:1',
        body: '“Masters, provide your slaves with what is right and fair, because you know that you also have a Master in heaven.”',
      },
      {
        type: 'reflection',
        body: 'You answer to a Master too. That truth cuts both ways: it means you must sometimes make the hard call the business requires, and it means you must make it the way you would want it made if you stood where they stand. Clarity is a kindness; dragging it out is not. Dignity is not optional. You can be both the steward who protects the whole and the human being who treats one person with mercy. Do not let the difficulty make you cold, and do not let your kindness make you evasive.',
      },
      {
        type: 'prayer',
        body: 'Lord, this is heavy, and I don’t want it to stop being heavy. Give me clarity to do what is right for the company and compassion to do it with honor. Let me be truthful without being cruel, and kind without being false. Go before this person into whatever comes next, and provide for them beyond what I can.',
      },
      {
        type: 'response',
        body: 'I will tell the truth with dignity. I serve a Master too.',
      },
      {
        type: 'benediction',
        body: 'Go and do the hard, honest thing — and carry no shame for caring.',
      },
    ],
  },
  // ─────────────────────────────────────────── THE HIGH MOMENTS
  {
    id: 'closing-a-deal',
    title: 'A Liturgy for Closing a Deal',
    situation: 'When the “yes” comes and the win is real.',
    category: 'wins',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'Before you post it, celebrate it, or spend it — stop and say thank you. Gratitude is the only sane response to a gift.',
      },
      {
        type: 'scripture',
        reference: 'Deuteronomy 8:17–18',
        body: '“You may say to yourself, ‘My power and the strength of my hands have produced this wealth for me.’ But remember the Lord your God, for it is he who gives you the ability to produce wealth.”',
      },
      {
        type: 'reflection',
        body: 'This is the most dangerous kind of moment, because success quietly rewrites the story until you are the hero of it. You did work hard — that’s true and worth honoring. But the talent, the timing, the open door, the very breath in your lungs while you signed: gifts, all of them. The antidote to pride is not pretending you did nothing. It is remembering who gave you the ability to do anything at all.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you. This is good, and I receive it as a gift from your hand, not a trophy from my own. Keep me grateful and keep me grounded. Let this win make me more generous, not more grasping. And help me steward what you’ve provided in a way that blesses others.',
      },
      {
        type: 'response',
        body: 'I worked, and you provided. The increase is from your hand.',
      },
      {
        type: 'benediction',
        body: 'Go and celebrate — with a grateful heart and an open hand.',
      },
    ],
  },
  {
    id: 'launching',
    title: 'A Liturgy for Launching',
    situation: 'On the day the thing you’ve built goes out into the world.',
    category: 'wins',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'Years, or months, or sleepless weeks have led to this. Before you hit publish, take one quiet breath that belongs only to you and God.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 90:17',
        body: '“May the favor of the Lord our God rest on us; establish the work of our hands for us — yes, establish the work of our hands.”',
      },
      {
        type: 'reflection',
        body: 'Launching is an act of hope and an act of surrender at once. You have done what you can do; the rest — whether it lands, who it reaches, what it becomes — is no longer in your hands. That’s frightening, but it’s also freeing. Your job was to make something good and offer it honestly. The outcome belongs to a bigger story than your metrics dashboard. Whatever today’s numbers say, the faithfulness of the building was real.',
      },
      {
        type: 'prayer',
        body: 'Lord, I offer you the work of my hands. Establish it if it is good; redirect it if it is not. Let it serve real people and meet real needs. Free me from measuring my worth by today’s response. Whatever happens, I have been faithful to make and to ship — and that is enough.',
      },
      {
        type: 'response',
        body: 'I have done the work; the outcome is yours. Establish what is good.',
      },
      {
        type: 'benediction',
        body: 'Go and launch with open hands. The work was worship.',
      },
    ],
  },
  {
    id: 'unexpected-success',
    title: 'A Liturgy for Success You Didn’t Expect',
    situation: 'When it works far better than you imagined, and it scares you.',
    category: 'wins',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The thing took off, and somewhere under the thrill is a strange vertigo. Steady yourself here for a moment.',
      },
      {
        type: 'scripture',
        reference: '1 Chronicles 29:14',
        body: '“But who am I, and who are my people, that we should be able to give as generously as this? Everything comes from you, and we have given you only what comes from your hand.”',
      },
      {
        type: 'reflection',
        body: 'Sudden success has its own temptations: to believe you finally are who the praise says you are, or to clutch the win in fear that it will vanish. King David, at the height of his nation’s wealth, responded not with a victory lap but with a question — “who am I?” — and an offering. Abundance is safest in the hands of someone who remembers it isn’t ultimately theirs. Let this be a moment of awe, not entitlement.',
      },
      {
        type: 'prayer',
        body: 'Father, this is more than I asked for, and it unsettles me as much as it delights me. Keep me humble in abundance the way I begged to stay faithful in scarcity. Don’t let success make me someone my family and team no longer recognize. Show me who to bless with what you have entrusted to me.',
      },
      {
        type: 'response',
        body: 'Who am I, that this should come to me? Everything comes from your hand.',
      },
      {
        type: 'benediction',
        body: 'Go in wonder, not entitlement. Hold the gift loosely and share it widely.',
      },
    ],
  },
  // ─────────────────────────────────────────── DAILY RHYTHMS
  {
    id: 'morning',
    title: 'A Morning Liturgy for the Work',
    situation: 'Before the inbox, before the first meeting — set the day down.',
    category: 'rhythms',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The day has not started pulling at you yet. For these five minutes, give it to God before you give it to anyone else.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 143:8',
        body: '“Let the morning bring me word of your unfailing love, for I have put my trust in you. Show me the way I should go, for to you I entrust my life.”',
      },
      {
        type: 'reflection',
        body: 'Whoever you listen to first tends to set the tone for the whole day. If the first voice is the inbox, you will spend the day reacting. If the first voice is the One who made you, you will spend the day rooted. The work matters, but it is not your master. You go into today not to prove your worth but to express it — already loved, already secure, already sent.',
      },
      {
        type: 'prayer',
        body: 'Father, before the noise, I want to hear you. Remind me I am yours before I am useful to anyone. Show me the way I should go today — what to say yes to, what to refuse, what to let go of. Make me a faithful steward and a steady presence. I entrust this day to you.',
      },
      {
        type: 'response',
        body: 'I am loved before I am useful. I go into this day already sent.',
      },
      {
        type: 'benediction',
        body: 'Go into the work as one who has already heard the only voice that matters.',
      },
    ],
  },
  {
    id: 'evening',
    title: 'An Evening Liturgy for Laying It Down',
    situation: 'At the end of the day — to stop carrying what isn’t yours to carry.',
    category: 'rhythms',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The day is done, whether or not the list is. Let the work stay at the desk. It will be there tomorrow; so will the grace.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 127:2',
        body: '“In vain you rise early and stay up late, toiling for food to eat — for he grants sleep to those he loves.”',
      },
      {
        type: 'reflection',
        body: 'There is a kind of striving that is really unbelief — the refusal to stop, as if the world would unravel without your vigilance. But sleep is an act of trust. Every night you lie down, you confess that you are not the one holding it all together. The unfinished things are real, but they are not yours to guard through the night. The God who works while you sleep is on the night shift. You can rest.',
      },
      {
        type: 'prayer',
        body: 'Lord, I lay down the things I didn’t finish and the things I got wrong. I lay down the conversations I’m replaying and the worries I can’t fix tonight. Thank you for the work I was able to do. Forgive what needs forgiving. Now grant me the sleep you give to those you love.',
      },
      {
        type: 'response',
        body: 'I am not the one who holds it all together. I can lay it down and sleep.',
      },
      {
        type: 'benediction',
        body: 'Rest now. The One who never sleeps is keeping watch.',
      },
    ],
  },
  {
    id: 'comparison',
    title: 'A Liturgy for the Comparison Trap',
    situation: 'When everyone else’s highlight reel makes your work feel small.',
    category: 'rhythms',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You just scrolled past someone else’s win and felt yourself shrink. Put the phone down. Come back to what is true.',
      },
      {
        type: 'scripture',
        reference: 'Galatians 6:4–5',
        body: '“Each one should test their own actions. Then they can take pride in themselves alone, without comparing themselves to someone else, for each one should carry their own load.”',
      },
      {
        type: 'reflection',
        body: 'Comparison is a thief that steals joy in both directions — it makes you envious of those ahead and proud over those behind, and neither has anything to do with faithfulness. You are not running their race. You don’t see their cost, their debt, their fear, the parts of the story that aren’t posted. You were given a particular load and a particular field. Tend yours. Run your own race well, and let theirs be theirs.',
      },
      {
        type: 'prayer',
        body: 'Father, I keep measuring my life by other people’s edited reels and coming up empty. Free me from the exhausting math of comparison. Let me test my own work against your call, not against their feed. Help me celebrate others without losing myself, and tend my own field with joy.',
      },
      {
        type: 'response',
        body: 'I will run my own race and carry my own load. Their highlight reel is not my measure.',
      },
      {
        type: 'benediction',
        body: 'Go back to your own good work. It matters more than the noise.',
      },
    ],
  },
];

export const getLiturgyById = (id: string): Liturgy | undefined =>
  LITURGIES.find((l) => l.id === id);

export const getLiturgiesByCategory = (category: string): Liturgy[] =>
  LITURGIES.filter((l) => l.category === category);

/**
 * Deterministic "devotional of the day" — same for everyone on a given date,
 * and it rotates through the whole library before repeating.
 */
export const getDailyLiturgy = (date = new Date()): Liturgy => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return LITURGIES[dayOfYear % LITURGIES.length];
};
