import { Liturgy, categoryOf } from './types';

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
  // ─────────────────────────────────────────── UNDER PRESSURE (added)
  {
    id: 'waiting-on-yes',
    title: 'A Liturgy for the Hope of a Deal',
    situation: 'When a deal could close today or tomorrow and you can’t stop hoping.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You’ve refreshed the inbox again. The “maybe” is louder than anything else today. Set the hope down for five minutes and breathe.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 27:14',
        body: '“Wait for the Lord; be strong and take heart and wait for the Lord.”',
      },
      {
        type: 'reflection',
        body: 'Waiting on a “yes” is its own kind of work — the hope is exhausting because you can taste it. You have already spent the relief in your imagination. But you cannot will the answer into being, and refreshing the screen will not move it one inch closer. Hope is good; it means you still believe in what you’re building. Just don’t let it become a master that rules your mood by the hour. Whether the answer is yes or no, God is good, and your standing with him does not rise or fall with a signature.',
      },
      {
        type: 'prayer',
        body: 'Father, I want this, and I’ve been carrying the hope like a held breath. I bring it to you. If it’s a yes, let me receive it with gratitude. If it’s a no, catch me, and keep me from despair. Until then, free me from refreshing and pacing. Help me do good work today while I wait.',
      },
      {
        type: 'response',
        body: 'I will hope without being held hostage by it. The answer is in good hands.',
      },
      {
        type: 'benediction',
        body: 'Go and wait well — strong, openhanded, and unhurried.',
      },
    ],
  },
  {
    id: 'overwhelmed',
    title: 'A Liturgy for Feeling Overwhelmed',
    situation: 'When there is too much, all at once, and you don’t know where to start.',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'Too many tabs, too many people needing you, too many fires. Stop. You cannot do everything in this minute — and in this minute you don’t have to.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 61:2',
        body: '“From the ends of the earth I call to you, I call as my heart grows faint; lead me to the rock that is higher than I.”',
      },
      {
        type: 'reflection',
        body: 'Overwhelm is what happens when you try to carry the whole mountain at once instead of taking the next single step up it. The list is real, but the panic is a liar — it tells you everything is urgent and everything depends on you right now. It doesn’t. You are a creature, not the Creator; finite by design, and that is not a flaw to fix. Jesus offers an easy yoke, not a heavier one. You don’t need to do it all. You need to do the next right thing, and then the one after that.',
      },
      {
        type: 'prayer',
        body: 'Lord, my heart is faint and the list is long. Lead me to the rock that is higher than I. Quiet the noise enough that I can see clearly. Show me the one thing to do next, and free me from the lie that I must hold it all at once. I trade my frantic grip for your steady pace.',
      },
      {
        type: 'response',
        body: 'I am finite, and that is not a failure. I will take the next step and trust the rest to God.',
      },
      {
        type: 'benediction',
        body: 'Go and do one thing. The mountain is climbed one step at a time.',
      },
    ],
  },
  {
    id: 'impossible-decision',
    title: 'A Liturgy for an Impossible Decision',
    situation: 'When you’re at a fork and terrified of choosing wrong.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'Two roads, and you’ve walked them both a hundred times in your head. Before you run the scenarios again, get quiet and ask for wisdom instead of certainty.',
      },
      {
        type: 'scripture',
        reference: 'James 1:5',
        body: '“If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.”',
      },
      {
        type: 'reflection',
        body: 'The fear underneath a hard decision is usually this: that there is one perfect answer, that you might miss it, and that God is waiting to be disappointed when you do. But he gives wisdom generously, “without finding fault.” He is not hiding the right path from you to test whether you’re clever enough to find it. Gather the counsel, weigh it honestly, notice where peace settles and where it flees — and then choose, trusting that a God who can redirect a king’s heart can certainly steer a willing one.',
      },
      {
        type: 'prayer',
        body: 'Father, I don’t need certainty so much as I need wisdom, and you promise to give it freely. Quiet my fear of getting it wrong. Make the next step clear enough to take. And where I still can’t see, give me the courage to choose and trust you to redirect me if I stray.',
      },
      {
        type: 'response',
        body: 'God gives wisdom generously. I can choose without fear and trust him to guide.',
      },
      {
        type: 'benediction',
        body: 'Go and decide. You are led by a God who is not trying to trip you up.',
      },
    ],
  },
  {
    id: 'fraud',
    title: 'A Liturgy for Feeling Like a Fraud',
    situation: 'When the voice says you’re not qualified and they’ll all find out.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The voice is back — the one that says you’re faking it and everyone is about to notice. Don’t argue with it. Just bring it into the light for a moment.',
      },
      {
        type: 'scripture',
        reference: '2 Corinthians 3:5',
        body: '“Not that we are competent in ourselves to claim anything for ourselves, but our competence comes from God.”',
      },
      {
        type: 'reflection',
        body: 'Almost everyone is improvising more than they let on — the difference is whether they’ve made peace with it. Impostor syndrome assumes there exists some fully-qualified version of you who feels no doubt; there isn’t, and there never will be. Scripture doesn’t locate your competence in your résumé but in God. Moses stuttered, Gideon hid, Jeremiah felt too young — and God used them not because they felt ready, but because he was with them. You were not called because you had it all figured out. You were called, and the One who calls equips.',
      },
      {
        type: 'prayer',
        body: 'Lord, I feel like a fraud, like the gap between what people think and what I am will swallow me. Remind me my competence comes from you, not from never doubting. Let me show up and serve honestly, do the work in front of me, and leave the verdict on “qualified” to you.',
      },
      {
        type: 'response',
        body: 'My competence comes from God. I don’t have to feel ready to be called.',
      },
      {
        type: 'benediction',
        body: 'Go and do the work. The One who called you is the One who equips you.',
      },
    ],
  },
  {
    id: 'public-mistake',
    title: 'A Liturgy for a Public Mistake',
    situation: 'When you messed up where everyone could see, and the shame is loud.',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'You’d give a lot to undo it. The replay won’t stop. Before shame writes the whole story, sit here a moment and breathe.',
      },
      {
        type: 'scripture',
        reference: 'Micah 7:8',
        body: '“Do not gloat over me, my enemy! Though I have fallen, I will rise. Though I sit in darkness, the Lord will be my light.”',
      },
      {
        type: 'reflection',
        body: 'There is a difference between guilt and shame. Guilt says, “I did something wrong” — and it can be answered with ownership, apology, and repair. Shame says, “I am wrong, all the way down” — and it cannot be satisfied, only fed. Own the mistake fully; that is integrity. But do not let shame use one failure to indict your whole self. The righteous fall and rise again, not because they never fall, but because their getting-up is held by Someone steadier than their record. Apologize cleanly, repair what you can, and then stand up.',
      },
      {
        type: 'prayer',
        body: 'Father, I made a mess in front of people, and the shame is trying to bury me. Give me the humility to own what I did without excuses, and the courage to make it right. Then lift me out of the pit shame digs. My identity is not my worst moment. Let me rise and walk forward in your light.',
      },
      {
        type: 'response',
        body: 'Though I have fallen, I will rise. I am not my worst moment.',
      },
      {
        type: 'benediction',
        body: 'Go, own it, mend it, and rise. The light you walk by is not your own.',
      },
    ],
  },
  {
    id: 'uncertain-future',
    title: 'A Liturgy for an Uncertain Future',
    situation: 'When you can’t see around the corner and it scares you.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You keep trying to see around a corner you cannot see around. Let your eyes rest from straining into the fog, just for now.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 3:5–6',
        body: '“Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.”',
      },
      {
        type: 'reflection',
        body: 'You were never promised a map of the whole road — only enough light for the next stretch. The Israelites in the wilderness were given manna one day at a time; they could not stockpile it, because the point was daily dependence, not a guaranteed supply. Your anxiety is mostly the cost of trying to live in a future that hasn’t arrived. Plan wisely, yes — but you cannot think your way to certainty about tomorrow, and you don’t have to. The path becomes straight as you walk it, not before.',
      },
      {
        type: 'prayer',
        body: 'Lord, I want the whole map, and you’ve given me a lamp for one step. Help me trust you with what I cannot see instead of leaning on understanding I don’t have. Give me what I need for today. And as I walk, make the path straight beneath my feet.',
      },
      {
        type: 'response',
        body: 'I have light for the next step. That is enough to walk by.',
      },
      {
        type: 'benediction',
        body: 'Go into the unknown unafraid. The One who holds tomorrow walks with you today.',
      },
    ],
  },
  // ─────────────────────────────────────────── WITH PEOPLE (added)
  {
    id: 'struggling-team-member',
    title: 'A Liturgy for a Struggling Team Member',
    situation: 'When someone you lead isn’t performing and you don’t know how to help.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You’re frustrated, and underneath it you actually care. Before you decide what they are, pause and remember who they are.',
      },
      {
        type: 'scripture',
        reference: '1 Thessalonians 5:14',
        body: '“And we urge you, brothers and sisters, warn those who are idle and disruptive, encourage the disheartened, help the weak, be patient with everyone.”',
      },
      {
        type: 'reflection',
        body: 'Good leadership refuses two easy shortcuts: pretending the problem isn’t there, and writing the person off. Notice how that verse asks for discernment — a warning for one, encouragement for another, help for the weak, and patience underneath it all. Before you conclude this person can’t, ask whether they’re overwhelmed, undertrained, mismatched, or carrying something heavy you can’t see. Clarity is a gift you owe them; so is the chance to rise. You may still conclude it isn’t working — but lead them as someone worth the effort, the way you’d want to be led.',
      },
      {
        type: 'prayer',
        body: 'Father, give me wisdom to lead this person well. Show me whether they need a clear word, encouragement, more support, or a different seat. Keep me from both cowardice and contempt. Help me be honest and patient at once, and to see them as a person you love, not a problem to manage.',
      },
      {
        type: 'response',
        body: 'I will be clear and patient. This is a person to lead, not a problem to discard.',
      },
      {
        type: 'benediction',
        body: 'Go and lead with both honesty and heart.',
      },
    ],
  },
  {
    id: 'betrayal',
    title: 'A Liturgy for Being Let Down',
    situation: 'When someone you trusted broke that trust.',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'It’s not just the loss — it’s that it was them. Don’t rush past the sting. Bring the wound here before you decide what to do with it.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 55:12–14',
        body: '“If an enemy were insulting me, I could endure it … But it is you, a man like myself, my companion, my close friend, with whom I once enjoyed sweet fellowship.”',
      },
      {
        type: 'reflection',
        body: 'Betrayal cuts deeper than ordinary disappointment because it comes through a door you left open in trust. Even David felt it; even Jesus was sold out by one who shared his table. So you are in honest company in your grief, and you don’t have to spiritualize it away. But you also can’t let it harden you into someone who trusts no one. Forgiveness is not pretending it didn’t happen, and it is not the same as restored trust — trust is rebuilt slowly, if at all. Forgiveness is releasing your right to be the one who repays. You can do that and still be wise about what you rebuild.',
      },
      {
        type: 'prayer',
        body: 'Lord, this one came from someone I trusted, and it hurts in a way I can’t shake. You know betrayal from the inside; meet me here. Keep me from bitterness and from revenge. Help me forgive — to release them to you — without being naive. Give me wisdom about what to rebuild and what to release.',
      },
      {
        type: 'response',
        body: 'I release my right to repay. I will be wise about trust and free of bitterness.',
      },
      {
        type: 'benediction',
        body: 'Go in peace. The One who was betrayed for you walks closely with you now.',
      },
    ],
  },
  {
    id: 'the-pitch',
    title: 'A Liturgy Before the Pitch',
    situation: 'Before you walk in to ask for the money, the partnership, the belief.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'In a few minutes you’ll ask people to believe in this. Take one breath that belongs only to you and God before you walk in.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 16:3',
        body: '“Commit to the Lord whatever you do, and he will establish your plans.”',
      },
      {
        type: 'reflection',
        body: 'When Nehemiah stood before the king with an enormous ask, Scripture says he prayed a quick prayer in the half-second before he answered. That’s the model: prepared and prayerful at once. You have done the work — now commit the outcome upward. Walk in as your whole self, not a performance of confidence you don’t feel. You are offering something real to people who need it; that’s not begging, it’s an invitation. And remember: your worth is not on the table in that room. The deal might close or it might not. You remain exactly as valued either way.',
      },
      {
        type: 'prayer',
        body: 'Father, I commit this to you — the prep, the room, the answer. Steady my nerves and clear my mind. Let me speak honestly and well, and let me listen. If this is right, establish it. If it isn’t, close it gently. Either way, remind me my value isn’t riding on their yes.',
      },
      {
        type: 'response',
        body: 'I’ve done the work; I commit the outcome to God. My worth is not on the table.',
      },
      {
        type: 'benediction',
        body: 'Go in. Prepared, prayerful, and free.',
      },
    ],
  },
  {
    id: 'hard-conversation',
    title: 'A Liturgy for a Conversation You’re Dreading',
    situation: 'Before the talk you keep putting off.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You’ve rehearsed it and rescheduled it in your mind a dozen times. Before you avoid it one more day, settle here.',
      },
      {
        type: 'scripture',
        reference: 'Ephesians 4:15',
        body: '“Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ.”',
      },
      {
        type: 'reflection',
        body: 'Avoidance feels like kindness, but it’s usually self-protection wearing kindness as a costume. The longer the truth goes unsaid, the larger it grows and the more it leaks out sideways — in tone, in distance, in resentment. “Truth in love” holds two things together that we tend to split: honesty without love is a weapon, and love without honesty is a cover-up. You’re not called to win the conversation; you’re called to be clear and kind, to speak and then to listen. Say the real thing, gently, and let the relationship be strong enough to hold it.',
      },
      {
        type: 'prayer',
        body: 'Lord, I’ve been avoiding this because it’s hard. Give me courage to stop hiding behind silence. Help me speak the truth — clearly, not cruelly — and to listen as much as I talk. Guard my tone. Soften both our hearts. Let this conversation build something rather than break it.',
      },
      {
        type: 'response',
        body: 'I will speak the truth in love. Clarity is a kindness, not a cruelty.',
      },
      {
        type: 'benediction',
        body: 'Go and say the real thing, gently. Avoidance was never the kinder road.',
      },
    ],
  },
  {
    id: 'saying-no',
    title: 'A Liturgy for Saying No',
    situation: 'When you need to decline, but disappointing people terrifies you.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'There’s a request on the table, and your reflex is to say yes to keep the peace. Pause before you answer from fear.',
      },
      {
        type: 'scripture',
        reference: 'Matthew 5:37',
        body: '“All you need to say is simply ‘Yes’ or ‘No’; anything beyond this comes from the evil one.”',
      },
      {
        type: 'reflection',
        body: 'Every yes is a no to something else — to your focus, your family, your rest, the work you’re actually called to. A yes given out of fear of disappointing people isn’t generosity; it’s a quiet kind of dishonesty that you’ll resent later. Even Jesus, with crowds clamoring and real needs everywhere, said no to good things in order to do the right things — slipping away to pray, moving on to the next town. A clear, kind no is a form of stewardship. You cannot pour from a life you’ve over-promised away.',
      },
      {
        type: 'prayer',
        body: 'Father, free me from the need to be liked at the cost of being honest. Help me say no clearly and kindly, without a paragraph of apology or excuse. Show me what is mine to carry and what is not. Let my yes be wholehearted because my no is real.',
      },
      {
        type: 'response',
        body: 'My no protects my yes. Declining in love is not unkind.',
      },
      {
        type: 'benediction',
        body: 'Go and answer honestly. A faithful no makes room for a faithful yes.',
      },
    ],
  },
  // ─────────────────────────────────────────── THE HIGH MOMENTS (added)
  {
    id: 'first-yes',
    title: 'A Liturgy for the First Yes',
    situation: 'Your first customer, first dollar, first real sign it’s working.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'Someone actually said yes. After all the wondering whether anyone would — let this land for a second before you rush to the next thing.',
      },
      {
        type: 'scripture',
        reference: 'Zechariah 4:10',
        body: '“Who dares despise the day of small things, since the Lord rejoices to see the work begin …”',
      },
      {
        type: 'reflection',
        body: 'It’s tempting to wave off a first yes as too small to celebrate — one customer, a tiny sum, a single vote of confidence in a sea of indifference. But God “rejoices to see the work begin.” Every great thing was once this small. The first yes is proof that what was only an idea can meet a real person’s real need. Don’t let the smallness rob you of the wonder. Be faithful with this little, give thanks, and serve this one person as if they were a thousand — because how you treat the first shapes how you’ll treat them all.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you for this first yes. It’s small, and it’s everything. Keep me from despising the day of small beginnings or rushing past the gift of it. Help me serve this person wholeheartedly. Whatever this grows into, let me stay grateful for how it started.',
      },
      {
        type: 'response',
        body: 'I will not despise small beginnings. God rejoices to see the work begin.',
      },
      {
        type: 'benediction',
        body: 'Go and celebrate the first. Then go serve them well.',
      },
    ],
  },
  {
    id: 'milestone',
    title: 'A Liturgy for a Milestone',
    situation: 'An anniversary, a number hit, a marker of how far you’ve come.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You crossed a line you once only dreamed of. Before you set the next target, turn around and actually look at the distance.',
      },
      {
        type: 'scripture',
        reference: '1 Samuel 7:12',
        body: '“Then Samuel took a stone and set it up … He named it Ebenezer, saying, ‘Thus far the Lord has helped us.’”',
      },
      {
        type: 'reflection',
        body: 'Entrepreneurs are wired to move the goalposts the instant they reach them — the milestone barely registers before the next mountain looms. But Scripture is full of stones set up as markers, deliberate pauses to say, “Look what God brought us through.” “Thus far the Lord has helped us” is not false modesty; it’s accurate memory. You worked hard, and you did not get here alone — there were open doors you didn’t pry open, helps you didn’t arrange, mercies you didn’t earn. Build the marker. Remember. Gratitude is the antidote to the endless hunger that no milestone ever fills.',
      },
      {
        type: 'prayer',
        body: 'Lord, look how far you’ve carried me. Thank you. Before I lunge at the next goal, let me set up a stone and remember. Keep me from the lie that I built this alone. Make this milestone a place of gratitude, not just a launchpad for more wanting.',
      },
      {
        type: 'response',
        body: 'Thus far the Lord has helped me. I will remember before I reach again.',
      },
      {
        type: 'benediction',
        body: 'Go and mark the moment. Carry the gratitude into what’s next.',
      },
    ],
  },
  {
    id: 'recognition',
    title: 'A Liturgy for Being Recognized',
    situation: 'When the award, the praise, or the spotlight finds you.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The applause is real and it feels good — and that’s exactly why this moment needs a little care. Pause before you breathe it all in.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 115:1',
        body: '“Not to us, Lord, not to us but to your name be the glory, because of your love and faithfulness.”',
      },
      {
        type: 'reflection',
        body: 'Praise is not the enemy — you’re allowed to enjoy a job well done being seen. The danger is subtler: that you start to believe your own press, that the applause becomes the thing you work for, that you forget the people and the grace behind what’s being praised. The healthiest response to recognition is gratitude that flows two directions — up to the God who gave the gift, and out to the people who helped you carry it. Receive the kind words graciously; just don’t build your home in them. Tomorrow the room goes quiet, and you’ll want to still know who you are.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you for this recognition; I receive it with gladness. But keep my head clear. Let the glory run past me to you and to the people who made this possible. Don’t let me start performing for applause. Help me stay the same person tomorrow when the room is quiet.',
      },
      {
        type: 'response',
        body: 'Not to me, but to your name be the glory. I’ll receive the praise and pass it on.',
      },
      {
        type: 'benediction',
        body: 'Go and receive it graciously — then set it down and stay yourself.',
      },
    ],
  },
  {
    id: 'selling-what-you-built',
    title: 'A Liturgy for Selling What You Built',
    situation: 'When you hand off, exit, or let go of the thing you made.',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'It’s what you wanted, and it still aches. Both can be true. Sit for a moment with the strange mix of relief and grief.',
      },
      {
        type: 'scripture',
        reference: 'Ecclesiastes 3:1, 6',
        body: '“There is a time for everything, and a season for every activity under the heavens … a time to keep and a time to give up …”',
      },
      {
        type: 'reflection',
        body: 'You poured years into this. It carried your name, your nights, your identity more than you’d like to admit — which is why letting go can feel like losing a part of yourself, even when the sale is a success. There is a time to keep and a time to give up, and wisdom is knowing which season you’re in. Grieve what was; that honors how much it mattered. But you are not the company. You were before it and you remain after it. The God who gave you the vision for this season has not run out of seasons. Hand it off well, bless what comes next, and walk into the open space.',
      },
      {
        type: 'prayer',
        body: 'Lord, thank you for what this has been — the people, the lessons, the years. It’s hard to let go of something I love. Help me grieve honestly and release it cleanly. Remind me I am not what I built. Lead the ones who carry it next, and lead me into whatever you have after this.',
      },
      {
        type: 'response',
        body: 'There is a time to keep and a time to give up. I am not what I built.',
      },
      {
        type: 'benediction',
        body: 'Go and hand it off with an open hand. Your story is not over.',
      },
    ],
  },
  // ─────────────────────────────────────────── DAILY RHYTHMS (added)
  {
    id: 'boredom',
    title: 'A Liturgy for Boredom in the Work',
    situation: 'When the thrill is gone and the work feels gray.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The spark that used to be here has dimmed, and the days feel flat. Don’t panic and don’t numb out. Just sit with it honestly for a minute.',
      },
      {
        type: 'scripture',
        reference: 'Colossians 3:23',
        body: '“Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.”',
      },
      {
        type: 'reflection',
        body: 'Boredom is not always a signal to blow up your life. Often it’s simply the long, unglamorous middle, where novelty has worn off and only faithfulness is left — and faithfulness, it turns out, is the more valuable thing. The feeling of excitement was never the fuel; it was a bonus. The deeper question is who you’re working for. When the audience is human applause or your own buzz, gray days feel pointless. When the audience is God, even the dull tasks become a kind of worship, done with care because he sees. Excitement comes and goes. Devotion is a choice you make on the flat days.',
      },
      {
        type: 'prayer',
        body: 'Father, the work feels gray and I miss the spark. Show me whether this is a season to push through or a sign something needs to change. Either way, help me work at it with all my heart, as for you. Let the dull days be worship, and surprise me with new joy in the ordinary.',
      },
      {
        type: 'response',
        body: 'I work for the Lord, not for the thrill. Faithfulness outlasts excitement.',
      },
      {
        type: 'benediction',
        body: 'Go back to the work as worship. The One you serve is watching with delight.',
      },
    ],
  },
  {
    id: 'monday',
    title: 'A Liturgy for Monday Morning',
    situation: 'At the start of the week, before it all begins again.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'A new week is waiting, full of things undone and things unknown. Before you brace for it, receive it.',
      },
      {
        type: 'scripture',
        reference: 'Lamentations 3:22–23',
        body: '“Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.”',
      },
      {
        type: 'reflection',
        body: 'Monday can feel like a weight rolling back onto your shoulders — last week’s leftovers, this week’s unknowns, the same problems waiting where you left them. But the mercy you’ll need for this week has not been used up by the last one. It’s new this morning, freshly made, enough for today. You don’t have to face the whole week at once; you only have to begin. Bring the dread, the to-do list, and the hope to God before you bring them to your calendar. Whatever this week holds, his faithfulness will be there each morning to meet it.',
      },
      {
        type: 'prayer',
        body: 'Lord, thank you that your mercies are new this morning. I give you this week — the meetings I’m dreading, the decisions I’m facing, the people I’ll serve. Go before me into each day. Where I’m anxious, steady me. Help me begin, and trust you to supply tomorrow’s grace tomorrow.',
      },
      {
        type: 'response',
        body: 'His mercies are new this morning. I only have to begin.',
      },
      {
        type: 'benediction',
        body: 'Go into the week unhurried. Fresh mercy will meet you each day.',
      },
    ],
  },
  {
    id: 'sabbath',
    title: 'A Liturgy for Sabbath',
    situation: 'For the day you stop — when stopping feels impossible.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'There is more you could do. There always is. For one day, let that be true and rest anyway.',
      },
      {
        type: 'scripture',
        reference: 'Exodus 20:8–10',
        body: '“Remember the Sabbath day by keeping it holy. Six days you shall labor and do all your work, but the seventh day is a sabbath to the Lord your God. On it you shall not do any work …”',
      },
      {
        type: 'reflection',
        body: 'For the entrepreneur, rest can feel like negligence — as if the whole thing might collapse the moment you stop watching it. That fear is exactly why you need a Sabbath: it is a weekly act of defiance against the lie that it all depends on you. God himself rested on the seventh day, not because he was tired, but to set a rhythm into the fabric of creation. To stop is to confess that the world is held together by him and not by your striving. The business will survive a day of your trust. You are a person, not a machine — and rest is how you remember it.',
      },
      {
        type: 'prayer',
        body: 'Father, teach me to stop. Loosen my grip on the work for one day. Quiet the voice that says rest is laziness or risk. Let my Sabbath be an act of trust — a declaration that you hold what I cannot. Refresh my body and soul, and remind me I am loved as a son, not valued as a tool.',
      },
      {
        type: 'response',
        body: 'I will rest as an act of trust. The world is held together by God, not by me.',
      },
      {
        type: 'benediction',
        body: 'Go and rest. Let the day be holy, unhurried, and free.',
      },
    ],
  },
  {
    id: 'mundane',
    title: 'A Liturgy for the Mundane Tasks',
    situation: 'For the invoices, the inbox, the unglamorous work no one sees.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The to-do list is full of small, dull, necessary things — none of them the reason you started. Before you grind through resentfully, reframe it here.',
      },
      {
        type: 'scripture',
        reference: 'Matthew 25:23',
        body: '“His master replied, ‘Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things …’”',
      },
      {
        type: 'reflection',
        body: 'Most of building anything is unglamorous: the admin, the follow-ups, the small repairs no one will ever thank you for. It’s easy to feel these tasks are beneath your calling — but Scripture is strikingly uninterested in our hierarchy of impressive versus menial. The praise “well done” is given for faithfulness with a few small things. A monk named Brother Lawrence claimed to feel God’s presence as vividly while washing dishes as while taking communion, because he did the humble work for love. The mundane is not a detour from your purpose. Done with care and offered upward, it is your purpose, hour by ordinary hour.',
      },
      {
        type: 'prayer',
        body: 'Lord, help me do the small, dull, necessary work without contempt for it. Let me be faithful in the little things, knowing you see them. Make even the invoices and the inbox a quiet offering. Free me from the pride that only wants the impressive parts, and meet me here, in the ordinary.',
      },
      {
        type: 'response',
        body: 'Faithful with a few things. The mundane, offered to God, is not beneath me.',
      },
      {
        type: 'benediction',
        body: 'Go and do the small things well. They are seen, and they count.',
      },
    ],
  },
  {
    id: 'gratitude',
    title: 'A Liturgy of Gratitude for the Work',
    situation: 'To stop chasing the next thing and give thanks for what is.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You are always reaching for the next thing. For five minutes, stop reaching. Look at what is already in your hands.',
      },
      {
        type: 'scripture',
        reference: '1 Thessalonians 5:16–18',
        body: '“Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.”',
      },
      {
        type: 'reflection',
        body: 'The entrepreneurial mind is a machine for noticing what’s missing — the next milestone, the gap, the thing not yet built. It’s useful, and it’s also a thief of joy, because a mind trained only on the gap can never arrive. Gratitude is the discipline that interrupts the chase. Not denial of what’s hard, but a deliberate naming of what’s good: that you get to do work that matters, that there’s breath in your lungs and bread on the table, that today held its own small mercies. “Give thanks in all circumstances” is not naïveté; it’s the practice that keeps an ambitious heart from becoming a hungry, hollow one.',
      },
      {
        type: 'prayer',
        body: 'Father, I spend so much of my life reaching for what isn’t here yet. Slow me down to see what is. Thank you for the work, for the people, for the chance to build something. Thank you for the gifts I’ve stopped noticing. Make gratitude my default, and let it guard my heart from the endless hunger for more.',
      },
      {
        type: 'response',
        body: 'I will give thanks in all circumstances. What is already in my hands is a gift.',
      },
      {
        type: 'benediction',
        body: 'Go in gratitude. The reaching can wait; the giving of thanks cannot.',
      },
    ],
  },
  // ─────────────────────────────────────────── UNDER PRESSURE (more)
  {
    id: 'harsh-review',
    title: 'A Liturgy for a Harsh Review',
    situation: 'When public criticism stings and you can’t stop rereading it.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You’ve read it five times now, and each time it lands a little harder. Set the screen down. Let the sting be felt, then let it pass.',
      },
      {
        type: 'scripture',
        reference: 'Galatians 1:10',
        body: '“Am I now trying to win the approval of human beings, or of God? … If I were still trying to please people, I would not be a servant of Christ.”',
      },
      {
        type: 'reflection',
        body: 'A single harsh voice has a strange power to drown out a hundred kind ones. But not all criticism is created equal: some is a gift wrapped in barbed wire — a true thing said unkindly — and some is just noise from someone who has never built anything. Have the humility to take the kernel of truth if there is one, and the freedom to release the rest. You cannot serve your work and the approval of every critic at once. Build for the One whose verdict actually holds.',
      },
      {
        type: 'prayer',
        body: 'Father, this criticism got under my skin. Give me the humility to learn whatever is true in it, and the freedom to let go of what is not. Loosen its grip on my mind. Anchor my worth in your approval, not the comment section, and let me keep building in peace.',
      },
      {
        type: 'response',
        body: 'I will take the truth and release the rest. I build for an audience of One.',
      },
      {
        type: 'benediction',
        body: 'Go back to the work unshaken. One harsh voice does not get the final word.',
      },
    ],
  },
  {
    id: 'competitor',
    title: 'A Liturgy for a Competitor on Your Heels',
    situation: 'When someone is gaining, copying, or beating you, and fear creeps in.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You keep checking what they’re doing, and your stomach tightens each time. Look away from them for five minutes and back to what’s yours.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 21:31',
        body: '“The horse is made ready for the day of battle, but victory rests with the Lord.”',
      },
      {
        type: 'reflection',
        body: 'A competitor breathing down your neck can pull your eyes off your own road and onto theirs — and a runner who keeps looking sideways slows down. Do your diligence: prepare the horse, sharpen the work, learn what you can. But the outcome is not handed to whoever is most afraid of losing. Scarcity says there is only room for one; it isn’t usually true. Run your race with excellence and leave the victory in hands larger than the market.',
      },
      {
        type: 'prayer',
        body: 'Lord, keep me from running scared. Help me prepare well without obsessing over them. Free me from the fear that there isn’t enough room for what I’m building. Let me compete with integrity, root for good work even in their hands, and trust you with the outcome.',
      },
      {
        type: 'response',
        body: 'I’ll prepare the horse and run my race. The victory rests with the Lord.',
      },
      {
        type: 'benediction',
        body: 'Go and run your own race well. Eyes forward.',
      },
    ],
  },
  {
    id: 'legal-threat',
    title: 'A Liturgy for a Legal Threat',
    situation: 'When a lawsuit, demand, or legal fight is hanging over you.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The letter, the threat, the what-ifs spinning at 2 a.m. — bring the dread here before it runs the night again.',
      },
      {
        type: 'scripture',
        reference: 'Isaiah 54:17',
        body: '“No weapon forged against you will prevail, and you will refute every tongue that accuses you. This is the heritage of the servants of the Lord …”',
      },
      {
        type: 'reflection',
        body: 'A legal threat is frightening partly because it feels so out of your control — another party, a process, an outcome you can’t fully steer. Do the wise and practical things: get good counsel, keep clean records, act with integrity. But underneath the strategy, there is a deeper security. You answer ultimately to a just God who sees the whole truth, who is not intimidated, and who is able to vindicate. Be honest, be wise, and refuse to let fear bully you into panic or compromise.',
      },
      {
        type: 'prayer',
        body: 'Father, this threat is heavy and I feel exposed. Give me wisdom and the right counsel. Where I’ve done wrong, give me humility to make it right; where I’m falsely accused, defend me. Quiet the fear that keeps me up at night. I entrust the outcome, and my reputation, to you.',
      },
      {
        type: 'response',
        body: 'I will be wise and honest, and trust the just Judge with what I cannot control.',
      },
      {
        type: 'benediction',
        body: 'Go in peace. You are not defenseless; you are a servant of the Lord.',
      },
    ],
  },
  {
    id: 'downturn',
    title: 'A Liturgy for a Downturn',
    situation: 'When the market turns, sales dry up, and the ground feels unsteady.',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'The numbers are sliding and forces far bigger than you are at work. You can’t fix the economy in five minutes — so don’t try. Just be still.',
      },
      {
        type: 'scripture',
        reference: 'Habakkuk 3:17–18',
        body: '“Though the fig tree does not bud and there are no grapes on the vines … yet I will rejoice in the Lord, I will be joyful in God my Savior.”',
      },
      {
        type: 'reflection',
        body: 'Habakkuk wrote those words staring at total economic ruin — empty fields, empty stalls, no harvest coming. His defiance was not denial; he names the loss plainly. But he refuses to let the failing harvest become the final word about his joy, because his joy was never planted in the harvest. Downturns strip away the illusion that you were ever in control of the market. What remains, when the vines are bare, is the question of where your hope was actually rooted. Make the hard, wise calls — and let your soul rest somewhere a recession can’t reach.',
      },
      {
        type: 'prayer',
        body: 'Lord, the ground is shaking and I feel it in my chest. Give me clear eyes to make wise decisions and a steady heart while I make them. Where I must cut or wait or endure, give me courage. And teach me the defiant joy of Habakkuk — to rejoice in you even when the fields are bare.',
      },
      {
        type: 'response',
        body: 'Though the harvest fails, I will rejoice in the Lord. My hope was never in the market.',
      },
      {
        type: 'benediction',
        body: 'Go and weather it with wisdom and a joy that doesn’t depend on the numbers.',
      },
    ],
  },
  {
    id: 'ghosted',
    title: 'A Liturgy for Being Ghosted',
    situation: 'When the prospect, partner, or client just went silent.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You’ve checked your inbox again. Still nothing. The silence is loud, and your mind is filling it with stories. Quiet them for a moment.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 13:1–2',
        body: '“How long, Lord? … How long must I wrestle with my thoughts and day after day have sorrow in my heart?”',
      },
      {
        type: 'reflection',
        body: 'Silence is uniquely maddening because it gives you nothing to work with — no closure, no reason, just an open door your anxiety walks through to invent worst-case stories. Notice that even the psalmist brings his “how long?” straight to God instead of spiraling alone. Their silence usually says more about their chaos than your worth: people go quiet because they’re overwhelmed, conflicted, or avoiding, far more often than because of anything you did. Do your honest follow-up, then release them. You are not required to carry a silence that isn’t yours to fill.',
      },
      {
        type: 'prayer',
        body: 'Lord, the not-knowing is wearing me down, and I keep writing stories in the silence. Quiet my anxious mind. Help me follow up with dignity and then let go, instead of refreshing and rereading. My worth doesn’t hang on their reply. Carry what I can’t resolve.',
      },
      {
        type: 'response',
        body: 'Their silence is not my verdict. I’ll follow up with dignity and release the rest.',
      },
      {
        type: 'benediction',
        body: 'Go and let the silence be theirs to keep. You are free of it.',
      },
    ],
  },
  {
    id: 'flopped-launch',
    title: 'A Liturgy for a Launch That Flopped',
    situation: 'When you shipped it, hoped, and almost no one came.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The big day came and the response was… quiet. The disappointment is real. Don’t rush to spin it. Just sit here a moment.',
      },
      {
        type: 'scripture',
        reference: '2 Corinthians 4:8–9',
        body: '“We are hard pressed on every side, but not crushed; perplexed, but not in despair … struck down, but not destroyed.”',
      },
      {
        type: 'reflection',
        body: 'A flat launch can feel like a verdict on you, not just the product — as if the silence is the world weighing your worth and finding it light. It isn’t. A launch is data, not a sentence. You were faithful to make something and put it into the world, which most people never dare to do, and that courage is not erased by a quiet first week. Grieve it honestly, learn what it’s teaching, and remember: hard pressed is not crushed, and struck down is not destroyed.',
      },
      {
        type: 'prayer',
        body: 'Father, I hoped for more, and the quiet hurts. Let me feel the disappointment without drowning in it. Keep me from reading this flop as a verdict on my worth. Show me what to learn, give me the heart to try again, and remind me that faithful work is never wasted in your economy.',
      },
      {
        type: 'response',
        body: 'Hard pressed, but not crushed. This is data, not a verdict on me.',
      },
      {
        type: 'benediction',
        body: 'Go and get back up. The faithfulness of building was never in vain.',
      },
    ],
  },
  // ─────────────────────────────────────────── WITH PEOPLE (more)
  {
    id: 'cofounder-split',
    title: 'A Liturgy for Parting With a Co-Founder',
    situation: 'When the road forks and you and your partner must go separate ways.',
    minutes: 5,
    sections: [
      {
        type: 'call',
        body: 'You started this together, and now the paths diverge. There’s grief in that, even when it’s right. Bring it here before the lawyers and the logistics.',
      },
      {
        type: 'scripture',
        reference: 'Genesis 13:8–9',
        body: '“So Abram said to Lot, ‘Let’s not have any quarreling between you and me … Is not the whole land before you? Let’s part company. If you go to the left, I’ll go to the right.’”',
      },
      {
        type: 'reflection',
        body: 'When Abram and Lot’s herds grew too large to share the land, Abram chose to part well rather than fight — generous even in separation, refusing to let the parting poison the relationship. Not every partnership is meant to last forever, and ending one is not always a failure; sometimes it’s the most honest, loving thing left to do. The question is not whether you split, but how. You can divide a company and still honor the person, still bless the road they take, still refuse the bitterness that wants the last word.',
      },
      {
        type: 'prayer',
        body: 'Lord, this is the end of something we built together, and it aches. Help us part the way Abram chose — honestly, generously, without quarreling. Guard my heart from bitterness and my mouth from contempt. Let me be fair, even costly-fair. Bless them on the road they’re taking, and lead us both well.',
      },
      {
        type: 'response',
        body: 'I will part well, not just part. I can divide a company and still honor the person.',
      },
      {
        type: 'benediction',
        body: 'Go and separate with honor. The land is wide enough for you both.',
      },
    ],
  },
  {
    id: 'asking-for-help',
    title: 'A Liturgy for Asking for Help',
    situation: 'When you’re stuck and pride is keeping you from reaching out.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You’ve been carrying this alone, telling yourself you should be able to handle it. Loosen that grip for a moment.',
      },
      {
        type: 'scripture',
        reference: 'Ecclesiastes 4:9–10',
        body: '“Two are better than one … If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.”',
      },
      {
        type: 'reflection',
        body: 'The founder’s myth of self-sufficiency is a heavy and lonely lie. Somewhere you absorbed the idea that needing help is weakness, that asking exposes you — when in fact refusing to ask is the real exposure, leaving you to fall with no one to lift you. Asking for help is not an admission of inadequacy; it’s an admission of being human, which you are. The people who could help you often want to; you rob them of that gift, and yourself of the rescue, by staying silent. Reach out. Two really are better than one.',
      },
      {
        type: 'prayer',
        body: 'Father, my pride has me carrying this alone, and I’m worn out. Humble me enough to ask. Bring the right people to mind, and give me the courage to actually reach out instead of pretending I’m fine. Thank you that I was never meant to do this by myself.',
      },
      {
        type: 'response',
        body: 'Asking for help is strength, not weakness. I was not meant to do this alone.',
      },
      {
        type: 'benediction',
        body: 'Go and reach out. There are hands ready to help you up.',
      },
    ],
  },
  {
    id: 'negotiation',
    title: 'A Liturgy Before a Hard Negotiation',
    situation: 'Before you sit down across the table to hammer out a deal.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'In a little while you’ll be across the table, and the pressure to win can make people into someone they’re not. Center yourself first.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 11:1',
        body: '“The Lord detests dishonest scales, but accurate weights find favor with him.”',
      },
      {
        type: 'reflection',
        body: 'Negotiation tempts you to believe that the goal is simply to win — to extract the most, concede the least, and let the other side fend for themselves. But a deal where one party is fleeced is not a victory; it’s a debt that comes due in reputation and conscience. You can be both shrewd and honest, both firm on your interests and fair to theirs. Aim for accurate scales: a deal you’d be at peace with if you were sitting on the other side of the table. The best agreements leave both parties able to shake hands and mean it.',
      },
      {
        type: 'prayer',
        body: 'Lord, give me wisdom and nerve at this table. Help me advocate well for what’s right without greed or fear. Keep my scales honest. Let me be shrewd and fair at once, and aim for a deal both sides can live with. Where I’m tempted to win at any cost, hold me back.',
      },
      {
        type: 'response',
        body: 'I’ll be shrewd and honest at once. I want a deal I’d accept from the other chair.',
      },
      {
        type: 'benediction',
        body: 'Go in with a clear head and honest scales.',
      },
    ],
  },
  {
    id: 'resignation',
    title: 'A Liturgy for When Someone Resigns',
    situation: 'When a valued person hands in their notice and you feel the loss.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'They told you they’re leaving, and beneath the professional nod there’s a real ache. Let yourself feel it for a moment before you react.',
      },
      {
        type: 'scripture',
        reference: 'Philippians 1:6',
        body: '“… being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.”',
      },
      {
        type: 'reflection',
        body: 'When someone good leaves, the first instincts are often fear and a flicker of betrayal — what will we do without them, why would they go. But people are not yours to keep; they pass through your work for a season, and your calling was to steward that season well, not to own them. If you led them well, their leaving is partly your success: they grew, and now they go to grow further. Bless them genuinely. The good work in them did not begin with you, and it won’t end when they walk out the door.',
      },
      {
        type: 'prayer',
        body: 'Father, I’m losing someone good, and I feel the fear and the sting of it. Keep me from taking it personally or sending them off with coldness. Help me bless them sincerely and finish their time here with grace. Provide for the gap they leave, and go with them into what’s next.',
      },
      {
        type: 'response',
        body: 'People pass through for a season. I’ll bless them, not begrudge them.',
      },
      {
        type: 'benediction',
        body: 'Go and send them off well. The good work in them continues.',
      },
    ],
  },
  {
    id: 'room-of-strangers',
    title: 'A Liturgy Before a Room of Strangers',
    situation: 'Before walking into the event, the mixer, the room where you know no one.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You’re about to walk in, and part of you would rather not. Before you put on the networking face, remember who you already are.',
      },
      {
        type: 'scripture',
        reference: '1 Samuel 16:7',
        body: '“People look at the outward appearance, but the Lord looks at the heart.”',
      },
      {
        type: 'reflection',
        body: 'A room of strangers triggers an old anxiety — to perform, to impress, to be interesting enough to matter. But you can walk in with nothing to prove, because the One whose opinion is final already sees your heart and calls you his. That frees you from working the room and lets you actually meet the people in it: to be curious instead of impressive, to ask more than you announce, to look for the one person who also feels out of place. You are not a brand to be pitched. You’re a person who can offer genuine attention to other persons.',
      },
      {
        type: 'prayer',
        body: 'Lord, calm the part of me that wants to perform. Let me walk in secure in who I am to you, with nothing to prove. Help me be genuinely curious about the people I meet, present instead of polished. Lead me to the conversations that matter, and let me be a kind presence in that room.',
      },
      {
        type: 'response',
        body: 'I have nothing to prove. I’ll be present and curious, not impressive.',
      },
      {
        type: 'benediction',
        body: 'Go in as yourself. The right connections don’t require a performance.',
      },
    ],
  },
  {
    id: 'delegating',
    title: 'A Liturgy for Letting Go of Control',
    situation: 'When you have to hand off work you’d rather keep gripping.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'You know you can’t hold all of it, and yet handing it over feels like dropping it. Breathe, and open your hands a little.',
      },
      {
        type: 'scripture',
        reference: 'Exodus 18:17–18',
        body: '“Moses’ father-in-law replied, ‘What you are doing is not good. You and these people who come to you will only wear yourselves out. The work is too heavy for you; you cannot handle it alone.’”',
      },
      {
        type: 'reflection',
        body: 'Even Moses had to be told the obvious: doing everything yourself is not devotion, it’s a slow road to burnout for you and a bottleneck for everyone waiting on you. The grip feels responsible, but it’s often fear in disguise — fear that no one else will do it right, or that you’ll matter less if you’re not indispensable. Letting go is how things grow beyond you, and how others get the chance to rise. Hand it over, accept that it’ll be done differently and sometimes imperfectly, and trust that your worth was never your indispensability.',
      },
      {
        type: 'prayer',
        body: 'Father, I’m holding on too tightly, and it’s wearing me out and holding others back. Help me let go — to delegate real trust, not just tasks. Free me from needing to be indispensable. Give me grace when it’s done differently than I would, and help me build something that doesn’t depend on me alone.',
      },
      {
        type: 'response',
        body: 'Holding everything is not devotion. I’ll let go so others — and the work — can grow.',
      },
      {
        type: 'benediction',
        body: 'Go and open your hands. You were never meant to carry it all.',
      },
    ],
  },
  // ─────────────────────────────────────────── THE HIGH MOMENTS (more)
  {
    id: 'profitable',
    title: 'A Liturgy for Turning Profitable',
    situation: 'When the business finally makes more than it spends.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'After all the months of spending more than you made, the line finally crossed. Pause and let the relief turn to thanks.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 3:9–10',
        body: '“Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing …”',
      },
      {
        type: 'reflection',
        body: 'Profit is a milestone worth honoring — proof that the thing can sustain itself, that real value met a real need. But the moment money starts flowing is exactly when the heart is most tested, because abundance reveals what you truly worship faster than scarcity ever could. The ancient wisdom is to honor God with the firstfruits — to give off the top, first, before the lifestyle quietly expands to swallow it all. Let profitability make you more generous and more grounded, not more grasping. The barns are a gift to steward, not a throne to sit on.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you — the business can finally stand on its own. Keep my heart steady now that money is flowing. Help me honor you with the firstfruits, to give before I spend and bless before I accumulate. Don’t let abundance make me someone smaller. Make me a generous steward of what you’ve provided.',
      },
      {
        type: 'response',
        body: 'I’ll honor God with the firstfruits. Profit is a stewardship, not a throne.',
      },
      {
        type: 'benediction',
        body: 'Go and celebrate — with the first and best set aside, and an open hand.',
      },
    ],
  },
  {
    id: 'first-generosity',
    title: 'A Liturgy for Your First Act of Generosity',
    situation: 'When the business can finally give something away.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'For the first time, there’s enough to give some away — not because you have to, but because you can. Sit with what a gift that is.',
      },
      {
        type: 'scripture',
        reference: '2 Corinthians 9:7',
        body: '“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”',
      },
      {
        type: 'reflection',
        body: 'There may be no clearer sign that a business has become more than a survival machine than the moment it starts to give. Generosity is not the leftover after everything else is funded; it’s a decision of the heart that says this enterprise exists for more than itself. You don’t give because the spreadsheet finally allows it as an afterthought — you give cheerfully, on purpose, because you were blessed in order to bless. This first gift is a small thing that quietly sets the soul of the whole company. Let it be the first of many.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you that there’s finally something to give. Make me a cheerful giver, not a reluctant one. Let generosity be built into this business from the start, not bolted on at the end. Show me where to send this, and let it be the first of many gifts that flow through what you’ve entrusted to me.',
      },
      {
        type: 'response',
        body: 'I was blessed to be a blessing. I give cheerfully, on purpose, not as an afterthought.',
      },
      {
        type: 'benediction',
        body: 'Go and give with joy. The cheerful giver is the one God loves.',
      },
    ],
  },
  {
    id: 'key-hire-yes',
    title: 'A Liturgy for a Key Person Saying Yes',
    situation: 'When someone you really wanted agrees to join you.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The person you hoped for said yes. Before you race ahead to onboarding, pause and recognize the gift of it.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 27:17',
        body: '“As iron sharpens iron, so one person sharpens another.”',
      },
      {
        type: 'reflection',
        body: 'A great person choosing to join you is a quiet kind of providence — someone with options decided to spend a season of their one life on your mission. That’s not just a hire; it’s a trust. The best people don’t merely fill a role; they sharpen you, push your thinking, raise the standard, and become part of who you become. Receive them as a gift, not a resource. Steward their gifts, invest in their growth, and build a place worthy of the yes they just gave you.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you for this person and their yes. Help me steward them well — to develop them, not just deploy them. Let us sharpen each other and build something good together. Make me the kind of leader who is worthy of the trust they’ve just placed in me.',
      },
      {
        type: 'response',
        body: 'This is a trust, not just a hire. I’ll steward the yes they gave me.',
      },
      {
        type: 'benediction',
        body: 'Go and build a place worthy of the people who join you.',
      },
    ],
  },
  {
    id: 'paying-off-debt',
    title: 'A Liturgy for Paying Off the Debt',
    situation: 'When the loan is cleared and the weight finally lifts.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'The balance is zero. The weight you carried so long that you stopped noticing it — gone. Stand in that lightness for a moment.',
      },
      {
        type: 'scripture',
        reference: 'Romans 13:8',
        body: '“Let no debt remain outstanding, except the continuing debt to love one another, for whoever loves others has fulfilled the law.”',
      },
      {
        type: 'reflection',
        body: 'Debt is a weight you carry in the body as much as the books — a low hum of obligation behind every decision. Clearing it is worth pausing to honor, because freedom regained is easy to take for granted within a week. Let this moment teach you something for the future: how good it feels to owe no one, and how worth it the discipline was. And notice the one debt Scripture says to keep carrying gladly — the debt of love, which is the only kind that makes you richer the more you pay it.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you — the weight is gone and I can breathe. Let me not forget this lightness or slide carelessly back into bondage. Give me wisdom with what I owe and what I borrow. And keep me eager to pay the one debt worth carrying: to love the people around me well.',
      },
      {
        type: 'response',
        body: 'I owe no one but love. Thank you for the weight that has lifted.',
      },
      {
        type: 'benediction',
        body: 'Go and walk lighter. Keep only the debt of love.',
      },
    ],
  },
  // ─────────────────────────────────────────── DAILY RHYTHMS (more)
  {
    id: 'new-season',
    title: 'A Liturgy for a New Season',
    situation: 'At the start of a new year, quarter, or chapter of the work.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'A page is turning — a new year, a new quarter, a new chapter. Before you fill it with plans, sit in the open space of it for a moment.',
      },
      {
        type: 'scripture',
        reference: 'Isaiah 43:19',
        body: '“See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.”',
      },
      {
        type: 'reflection',
        body: 'A new season invites two temptations: to drag every old failure and fear across the threshold with you, or to pin all your hope on resolutions you’ll power through by willpower. There’s a third way — to come with open hands, expectant that God is doing a new thing, often in places that looked like wasteland. Set your goals, yes, but hold them loosely enough to be surprised. The most important things this season holds are probably not yet on your list. Step in watchful, not just driven.',
      },
      {
        type: 'prayer',
        body: 'Father, thank you for a fresh page. I don’t want to carry old fears into it, or to trust only in my own willpower. Open my eyes to the new thing you’re doing, even in the dry places. Direct my plans, surprise me with what I couldn’t plan, and lead me through this season well.',
      },
      {
        type: 'response',
        body: 'God is doing a new thing. I’ll step into this season watchful and openhanded.',
      },
      {
        type: 'benediction',
        body: 'Go into the new season expectant. There are streams coming in the wasteland.',
      },
    ],
  },
  {
    id: 'late-night',
    title: 'A Liturgy for a Late Night at Work',
    situation: 'When it’s late, the work isn’t done, and you’re still going.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'It’s late, the house is quiet, and you’re still at it. Before the next push, lift your eyes from the screen for a moment.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 121:1–2',
        body: '“I lift up my eyes to the mountains — where does my help come from? My help comes from the Lord, the Maker of heaven and earth.”',
      },
      {
        type: 'reflection',
        body: 'There are honest late nights — a real deadline, a true push — and there are anxious ones, where you stay not because the work demands it but because stopping feels like losing control. It’s worth knowing which one this is. Either way, lift your eyes: your help does not ultimately come from one more hour of your own effort, but from the Maker of heaven and earth, who keeps working while you sleep. Do what genuinely needs doing tonight, then have the humility to stop and let the rest be carried by Someone who never tires.',
      },
      {
        type: 'prayer',
        body: 'Lord, it’s late and I’m still pushing. Help me see clearly whether this is a faithful effort or anxious striving. Give me what I need for what truly must be done tonight, and the humility to stop when it’s enough. My help comes from you, not from one more exhausted hour. Carry what I lay down.',
      },
      {
        type: 'response',
        body: 'My help comes from the Lord, not one more hour. I’ll do what’s needed, then rest.',
      },
      {
        type: 'benediction',
        body: 'Finish what’s needed and lift your eyes. The Maker of heaven keeps the night watch.',
      },
    ],
  },
  {
    id: 'scattered',
    title: 'A Liturgy for a Scattered Mind',
    situation: 'When you can’t focus and your attention is pulled in ten directions.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'Ten tabs open in your browser, twenty in your head. Before you chase the next ping, let everything go quiet for just a moment.',
      },
      {
        type: 'scripture',
        reference: 'Isaiah 26:3',
        body: '“You will keep in perfect peace those whose minds are steadfast, because they trust in you.”',
      },
      {
        type: 'reflection',
        body: 'A scattered mind is rarely solved by trying harder to concentrate; the scatter is usually downstream of a deeper restlessness — too much input, too many open loops, a low hum of anxiety that keeps you reaching for the next thing. Peace and focus are siblings. A mind steadied on something solid can finally settle enough to do one thing well. Close the tabs. Name the one thing that matters most in the next hour. And anchor your restless attention, for a moment, on the One who holds it all together, so you don’t have to.',
      },
      {
        type: 'prayer',
        body: 'Father, my mind is everywhere and I can’t land. Quiet the noise inside and out. Steady me on you, and from that steadiness, help me focus on the one thing in front of me. Free me from the restlessness that keeps me grabbing at everything and finishing nothing. Give me a settled, single-minded peace.',
      },
      {
        type: 'response',
        body: 'A steadied mind can do one thing well. I’ll anchor, then focus on what matters most.',
      },
      {
        type: 'benediction',
        body: 'Go and do one thing. Perfect peace is for the mind that stays.',
      },
    ],
  },
  {
    id: 'decision-fatigue',
    title: 'A Liturgy for Decision Fatigue',
    situation: 'When you’ve made a thousand choices and have nothing left to decide with.',
    minutes: 4,
    sections: [
      {
        type: 'call',
        body: 'Decision after decision, all day, and the tank is empty. Before you force the next call from fumes, stop and breathe.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 32:8',
        body: '“I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.”',
      },
      {
        type: 'reflection',
        body: 'Being the founder means being the place where decisions pile up — every unresolved question routes to you, and by afternoon the well of judgment runs dry. Tired decisions are usually bad decisions, made from depletion rather than wisdom. Not everything has to be settled right now by sheer force of will. Some calls can wait until morning; some can be handed off; some only need a quick prayer and a good-enough answer. You are not the only counselor in the room — there is One who promises to guide you with a loving eye, if you’ll pause long enough to ask.',
      },
      {
        type: 'prayer',
        body: 'Lord, I’ve got nothing left to decide with, and I’m still being asked to choose. Give me the wisdom to know which calls truly can’t wait and which can rest until I’m clearer. Guide me where I genuinely must decide now. Thank you that I don’t have to be the only source of wisdom here. Counsel me.',
      },
      {
        type: 'response',
        body: 'Tired decisions are poor ones. I’ll decide what must be decided and trust God to guide the rest.',
      },
      {
        type: 'benediction',
        body: 'Go gently. You don’t have to settle everything tonight. You are being counseled.',
      },
    ],
  },
];

export const getLiturgyById = (id: string): Liturgy | undefined =>
  LITURGIES.find((l) => l.id === id);

export const getLiturgiesByCategory = (category: string): Liturgy[] =>
  LITURGIES.filter((l) => categoryOf(l.id) === category);

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
