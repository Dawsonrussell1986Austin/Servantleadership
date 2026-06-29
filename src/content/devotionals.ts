import { Devotional } from './types';

/**
 * The DAILY devotionals — generic, broadly-applicable readings on faith and
 * entrepreneurship. Unlike the Library (which is situation-specific), these are
 * meant to be good on any ordinary day. The Today tab rotates through these.
 *
 * They share the liturgy shape and the same gentle arc:
 *   call → scripture → reflection → prayer → response → benediction
 */
export const DEVOTIONALS: Devotional[] = [
  {
    id: 'd-calling',
    title: 'On Why You Build',
    situation: 'Remembering the calling underneath the company.',
    category: 'rhythms',
    minutes: 5,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'Before the day asks anything of you, sit still and remember why you started. Not the metrics — the calling.',
      },
      {
        type: 'scripture',
        reference: 'Colossians 3:23–24',
        body: '“Whatever you do, work at it with all your heart, as working for the Lord, not for human masters … It is the Lord Christ you are serving.”',
      },
      {
        type: 'reflection',
        body: 'Somewhere under the spreadsheets and the to-do list is a reason you began — a problem you wanted to solve, a way you wanted to serve, a thing you felt made for. The daily grind has a way of burying it. But your work is not separate from your faith; it is one of the main places you live it out. The hours you spend building, hiring, selling, and shipping are not a distraction from your calling. Done as unto the Lord, they are the calling. You are not merely running a business. You are stewarding a corner of the world.',
      },
      {
        type: 'prayer',
        body: 'Father, remind me today why I build. Let me work with all my heart, as for you and not just for results. Lift my eyes above the grind to the calling underneath it. Make my ordinary work an offering, and let me serve the people it touches well.',
      },
      {
        type: 'response',
        body: 'I am not just running a business. I am serving the Lord with the work of my hands.',
      },
      {
        type: 'benediction',
        body: 'Go and build today as worship — wholehearted, and unto the One who called you.',
      },
    ],
  },
  {
    id: 'd-integrity',
    title: 'On Integrity When No One Is Watching',
    situation: 'Choosing to be the same person in private and in public.',
    category: 'people',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'Most of the choices that shape a business are made quietly, where no one would ever know. Settle here and remember Someone always does.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 10:9',
        body: '“Whoever walks in integrity walks securely, but whoever takes crooked paths will be found out.”',
      },
      {
        type: 'reflection',
        body: 'Integrity is wholeness — being one person, not a polished public version and a compromised private one. The shortcuts are always available: the small lie on the invoice, the corner cut where no client will look, the promise made with fingers crossed. Each feels harmless in the moment and free of cost. But crooked paths have a way of catching up, and even when they don’t, they cost you something quieter: the ability to walk securely, unafraid of being found out. A reputation is built over years and lost in a single decision. Today’s small, unseen choice is not small.',
      },
      {
        type: 'prayer',
        body: 'Lord, make me whole — the same person in the dark as in the light. Guard me from the small compromises that feel free and cost everything. Let me walk securely today, with nothing to hide. I would rather be trustworthy than merely successful.',
      },
      {
        type: 'response',
        body: 'I will be one person, in private and in public. Integrity is worth more than the shortcut.',
      },
      {
        type: 'benediction',
        body: 'Go and walk securely. The unseen choices are the ones that make you.',
      },
    ],
  },
  {
    id: 'd-ambition',
    title: 'On Holy Ambition',
    situation: 'Wanting to build great things without being ruled by the wanting.',
    category: 'wins',
    minutes: 5,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'You are wired to want more, to build bigger, to win. Bring that drive here for a moment instead of just obeying it.',
      },
      {
        type: 'scripture',
        reference: 'Jeremiah 45:5',
        body: '“Should you then seek great things for yourself? Do not seek them …”',
      },
      {
        type: 'reflection',
        body: 'Ambition is not the enemy; misdirected ambition is. The same drive that builds something good can quietly curdle into seeking great things for yourself — your name, your empire, your proof that you matter. The question is not whether you are ambitious but what your ambition is for. Are you building a monument to yourself, or stewarding something that serves others and honors God? Hold the goal loosely enough that you could lay it down, and you’ll find you can pursue it harder, because your soul no longer depends on it. Ambition surrendered becomes a gift. Ambition enthroned becomes a master.',
      },
      {
        type: 'prayer',
        body: 'Father, you made me to build, and I bring my ambition to you. Purify it. Let me seek great things for your kingdom and for others, not monuments to myself. Keep my drive from becoming my master. Help me work hard and hold it all with open hands.',
      },
      {
        type: 'response',
        body: 'I will aim high and hold loosely. My ambition serves the calling, not my ego.',
      },
      {
        type: 'benediction',
        body: 'Go and build boldly — for something bigger than your own name.',
      },
    ],
  },
  {
    id: 'd-generosity',
    title: 'On Open Hands',
    situation: 'Building a life and a business marked by generosity.',
    category: 'wins',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'It’s easy to grip tightly what you’ve worked hard to earn. Pause and loosen your hands before the day’s wanting begins.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 11:24–25',
        body: '“One person gives freely, yet gains even more; another withholds unduly, but comes to poverty. A generous person will prosper; whoever refreshes others will be refreshed.”',
      },
      {
        type: 'reflection',
        body: 'Scarcity whispers that the way to security is to hold tighter — pay less, give less, keep more. But the deepest law of the kingdom runs the other way: open hands both give and receive, while clenched fists can do neither. Generosity is not only about money; it’s margin given to a struggling employee, credit shared with your team, time spent on someone who can do nothing for you. You were blessed to be a blessing. A business can be one of the most powerful engines of generosity there is — if its owner refuses to let it become a machine for hoarding.',
      },
      {
        type: 'prayer',
        body: 'Lord, free me from the fear that makes me grasp. Make me generous — with money, with credit, with grace, with time. Let what flows through my hands refresh others, and refresh me in turn. Help me build something that blesses far beyond myself.',
      },
      {
        type: 'response',
        body: 'I was blessed to be a blessing. I will hold what I have with open hands.',
      },
      {
        type: 'benediction',
        body: 'Go and give freely. The generous are the ones who truly prosper.',
      },
    ],
  },
  {
    id: 'd-identity',
    title: 'On Who You Are Without the Company',
    situation: 'Anchoring your worth in something the business can’t give or take.',
    category: 'rhythms',
    minutes: 5,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'If the company doubled today, or vanished, who would you be? Sit with that question for a moment before the day answers it for you.',
      },
      {
        type: 'scripture',
        reference: 'Galatians 2:20',
        body: '“I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.”',
      },
      {
        type: 'reflection',
        body: 'The danger of building something is that it slowly starts building you — your sense of worth rising and falling with the revenue, the reviews, the latest number. It’s a brutal way to live, because the metrics never stop moving and your soul was never meant to ride them. Your truest identity was settled before you ever launched anything: loved, chosen, secure, a child of God. That cannot be earned by a good quarter or lost in a bad one. When your identity is anchored outside the work, the work finally becomes free — you can risk, fail, and win without it deciding who you are.',
      },
      {
        type: 'prayer',
        body: 'Father, I keep letting the business tell me who I am. Remind me who I actually am — yours, loved before I built anything, secure no matter the numbers. Let me work from that security instead of for it. Free me to risk and to rest, because my worth is already settled.',
      },
      {
        type: 'response',
        body: 'I am not my numbers. I am loved and secure before I build anything at all.',
      },
      {
        type: 'benediction',
        body: 'Go into the work from a settled heart. The company does not get to define you.',
      },
    ],
  },
  {
    id: 'd-diligence',
    title: 'On Showing Up',
    situation: 'The quiet power of faithful, daily diligence.',
    category: 'rhythms',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'No fireworks today — just the work. Before you begin, remember that faithfulness in the ordinary is its own kind of greatness.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 13:11',
        body: '“Dishonest money dwindles away, but whoever gathers money little by little makes it grow.”',
      },
      {
        type: 'reflection',
        body: 'We are sold the myth of the overnight success, but almost nothing real is built that way. Behind every “sudden” breakthrough are years of unglamorous, compounding diligence — showing up on the gray days, doing the next small thing, gathering little by little. Diligence is deeply spiritual, even when it looks dull. It is faith expressed in action: trusting that small, faithful efforts, offered consistently over time, become something that lasts. Despise the slow days and you’ll quit before the compounding kicks in. Honor them, and you’ll be amazed what a thousand ordinary days can build.',
      },
      {
        type: 'prayer',
        body: 'Lord, give me the grace to show up again today, even without applause or visible progress. Help me gather little by little, faithful in the small and the slow. Keep me from chasing shortcuts. Let my steady, ordinary work compound into something good and lasting.',
      },
      {
        type: 'response',
        body: 'I will show up and do the next small thing. Little by little, faithfulness builds.',
      },
      {
        type: 'benediction',
        body: 'Go and be faithful in the ordinary. The slow days are not wasted days.',
      },
    ],
  },
  {
    id: 'd-serving-others',
    title: 'On the People You Serve',
    situation: 'Seeing customers as people, not transactions.',
    category: 'people',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'Behind every order, click, and contract is a person. Pause and remember them before the day turns them into numbers.',
      },
      {
        type: 'scripture',
        reference: 'Philippians 2:3–4',
        body: '“Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.”',
      },
      {
        type: 'reflection',
        body: 'It is frighteningly easy to start seeing customers as a means to revenue rather than people to be served — to optimize them, extract from them, treat them as a funnel. But every one of them bears the image of God and carries a story you cannot see. The most enduring businesses are built by people who genuinely look to the interests of others, who would rather serve well than merely sell. Profit, done right, is the byproduct of value truly given — a reward for having met a real need. Serve the person in front of you today as you would want to be served.',
      },
      {
        type: 'prayer',
        body: 'Father, help me see the people behind the transactions. Keep me from treating anyone as a means to my own ends. Let me genuinely serve — solving real problems, caring about real lives. Make my business a place where people are valued, not just monetized.',
      },
      {
        type: 'response',
        body: 'Every customer is a person made in God’s image. I will serve, not just sell.',
      },
      {
        type: 'benediction',
        body: 'Go and serve real people well. Value given is the truest way to gain.',
      },
    ],
  },
  {
    id: 'd-patience',
    title: 'On the Long Game',
    situation: 'Trusting slow growth in a world obsessed with fast.',
    category: 'pressure',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'You want it to grow faster. Everyone does. Breathe, and remember that the best things take the time they take.',
      },
      {
        type: 'scripture',
        reference: 'James 5:7',
        body: '“Be patient, then, brothers and sisters, until the Lord’s coming. See how the farmer waits for the land to yield its valuable crop, patiently waiting for the autumn and spring rains.”',
      },
      {
        type: 'reflection',
        body: 'The farmer cannot rush the harvest. He plants, he tends, he waters — and then he waits, because growth keeps its own calendar and refuses to be hurried. Entrepreneurship is far more agricultural than we admit. We want the hockey-stick curve now, and we grow anxious and reckless when the field looks bare. But seeds do their real work underground, unseen, long before anything breaks the surface. Your job is to plant well, tend faithfully, and trust the timing you don’t control. Impatience uproots what patience would have grown.',
      },
      {
        type: 'prayer',
        body: 'Lord, I am impatient for growth I cannot force. Teach me the patience of the farmer — to plant, to tend, and to trust the timing to you. Keep me from reckless shortcuts born of anxiety. Help me do faithful work today and leave the harvest in your hands.',
      },
      {
        type: 'response',
        body: 'I will plant and tend faithfully, and trust the harvest to its season.',
      },
      {
        type: 'benediction',
        body: 'Go and tend your field with patience. The rains will come in their time.',
      },
    ],
  },
  {
    id: 'd-stewardship',
    title: 'On Stewarding What Isn’t Yours',
    situation: 'Holding the business as a trust, not a possession.',
    category: 'wins',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'You call it “my business,” and in a sense it is. Pause and consider whether it might be better called something you’ve been entrusted with.',
      },
      {
        type: 'scripture',
        reference: '1 Corinthians 4:2',
        body: '“Now it is required that those who have been given a trust must prove faithful.”',
      },
      {
        type: 'reflection',
        body: 'There is a quiet but enormous shift between being an owner and being a steward. An owner asks, “How do I get the most out of what’s mine?” A steward asks, “How do I faithfully manage what’s been entrusted to me?” The money, the talent, the team, the opportunity, the very breath you used to build it all — none of it originated with you. You are managing it for a season on behalf of its true Owner. That reframing changes everything: it humbles you in success, steadies you in loss, and frees you from the crushing weight of believing it all rests on your shoulders alone.',
      },
      {
        type: 'prayer',
        body: 'Father, everything I have is a trust from you — the resources, the people, the chance to build. Help me prove faithful with what you’ve placed in my hands. Loosen my grip of ownership. Let me manage it well, for your purposes, and not just my own.',
      },
      {
        type: 'response',
        body: 'I am a steward, not an owner. I will prove faithful with what I’ve been given.',
      },
      {
        type: 'benediction',
        body: 'Go and steward it well. What you hold was entrusted, not earned outright.',
      },
    ],
  },
  {
    id: 'd-excellence',
    title: 'On Doing It Well',
    situation: 'Pursuing excellence as an act of worship.',
    category: 'rhythms',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'There is a temptation today to do it just well enough. Pause and aim higher — not for applause, but as an offering.',
      },
      {
        type: 'scripture',
        reference: 'Ecclesiastes 9:10',
        body: '“Whatever your hand finds to do, do it with all your might …”',
      },
      {
        type: 'reflection',
        body: 'Excellence is not perfectionism, which is fear wearing a respectable mask. Excellence is care — doing the work as well as it deserves to be done because it matters and because God is worth our best. Bezalel, the craftsman who built the tabernacle, was said to be filled with the Spirit of God for skilled work; even his craftsmanship was holy. Your code, your product, your service, your spreadsheets — done with all your might, these become a kind of worship. Not anxious striving for approval, but glad, careful work offered to the One who does all things well.',
      },
      {
        type: 'prayer',
        body: 'Lord, help me do my work well today — not from fear or for applause, but as an offering to you. Free me from both laziness and perfectionism. Fill me with skill and care. Let the quality of what I make point, somehow, to the goodness of the One I serve.',
      },
      {
        type: 'response',
        body: 'I will do the work with all my might, as an offering and not for applause.',
      },
      {
        type: 'benediction',
        body: 'Go and do it well. Careful work, offered to God, is worship.',
      },
    ],
  },
  {
    id: 'd-humility',
    title: 'On Staying Low',
    situation: 'Leading from humility in a world that rewards self-promotion.',
    category: 'people',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'The market rewards the loud and the self-assured. Pause and remember a quieter, sturdier way to lead.',
      },
      {
        type: 'scripture',
        reference: 'James 4:6',
        body: '“God opposes the proud but shows favor to the humble.”',
      },
      {
        type: 'reflection',
        body: 'Pride is the occupational hazard of the founder — you have to believe in yourself enough to build something from nothing, and that confidence can quietly metastasize into thinking you have nothing left to learn. But humility is not thinking less of yourself; it is thinking of yourself less. The humble leader asks questions, credits the team, admits mistakes fast, and stays teachable. Strikingly, Scripture says God actively opposes pride and gives grace to the humble — meaning humility is not just nice, it is where the help comes from. Stay low. It is the most strategically wise posture there is.',
      },
      {
        type: 'prayer',
        body: 'Father, keep me humble. Where confidence has hardened into pride, soften it. Help me stay teachable, quick to credit others and quick to admit when I’m wrong. Let me lead from humility, knowing it is the humble you draw near to help.',
      },
      {
        type: 'response',
        body: 'I will think of myself less. God gives grace to the humble.',
      },
      {
        type: 'benediction',
        body: 'Go and lead from a low place. That is where grace is found.',
      },
    ],
  },
  {
    id: 'd-rest',
    title: 'On Working From Rest',
    situation: 'Refusing to let the work consume the whole of you.',
    category: 'rhythms',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'There will always be more to do. For a moment, let that be true without letting it drive you. Just breathe.',
      },
      {
        type: 'scripture',
        reference: 'Matthew 11:28–29',
        body: '“Come to me, all you who are weary and burdened, and I will give you rest … for I am gentle and humble in heart, and you will find rest for your souls.”',
      },
      {
        type: 'reflection',
        body: 'Most of the world works in order to one day rest. The deeper invitation is to work from rest — from a soul already at peace, not striving to earn it. Hustle culture treats rest as a reward for the worthy and exhaustion as a badge of honor, but Jesus offers rest as a gift to the weary, no qualifications required. An entrepreneur who never stops is not more devoted; they are slowly confessing that they don’t believe anyone but themselves is holding it together. Come to him first. Let your work flow out of rest, not be a frantic search for it.',
      },
      {
        type: 'prayer',
        body: 'Lord, I am weary, and I keep trying to earn a rest you offer freely. Give me rest for my soul today. Let me work from peace, not for it. Quiet the voice that says it all depends on me, and teach me your gentle, unhurried way.',
      },
      {
        type: 'response',
        body: 'I will work from rest, not for it. The burden was never mine to carry alone.',
      },
      {
        type: 'benediction',
        body: 'Go into the work unhurried. The rest you need is already offered.',
      },
    ],
  },
  {
    id: 'd-courage',
    title: 'On Stepping Out',
    situation: 'Facing the risk and fear that come with building.',
    category: 'pressure',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'There’s a risk in front of you that scares you. Don’t pretend it doesn’t. Bring the fear here before you decide.',
      },
      {
        type: 'scripture',
        reference: 'Joshua 1:9',
        body: '“Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.”',
      },
      {
        type: 'reflection',
        body: 'Courage is not the absence of fear; it is moving forward with the fear still present. Every entrepreneur lives closer to the edge of uncertainty than most people ever will — the leap without a net, the bet on an unseen future. Notice that God’s command to be courageous is not based on Joshua’s competence or the favorable odds; it rests entirely on one promise: “I will be with you.” You are not asked to be fearless or to guarantee the outcome. You are asked to step out in faith, knowing you do not step alone. The presence of God is the ground beneath the leap.',
      },
      {
        type: 'prayer',
        body: 'Father, I am afraid, and the risk feels large. Make me strong and courageous — not because the odds are good, but because you are with me. Steady my nerves. Help me take the faithful step in front of me and trust you with what I cannot control.',
      },
      {
        type: 'response',
        body: 'I will step out in courage. I do not go alone — God goes with me.',
      },
      {
        type: 'benediction',
        body: 'Go strong and courageous. The One who sends you also goes with you.',
      },
    ],
  },
  {
    id: 'd-perseverance',
    title: 'On Not Giving Up',
    situation: 'Enduring the long, hard middle of building something.',
    category: 'pressure',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'You’re tired, and the finish line isn’t in sight. Before you measure how far is left, steady yourself here.',
      },
      {
        type: 'scripture',
        reference: 'Romans 5:3–4',
        body: '“… we also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.”',
      },
      {
        type: 'reflection',
        body: 'The hard middle is where most dreams quietly die — not in dramatic failure, but in slow attrition, the daily wearing-down of hope. Yet Scripture insists the struggle is not pointless: pressure produces perseverance, perseverance forges character, and character gives rise to a hope that doesn’t disappoint. The very thing you want to escape is doing something in you that ease never could. You are not just building a company in this season; you are being built. The grit, the depth, the steadiness you’re forging in the hard middle will outlast whatever you’re working on.',
      },
      {
        type: 'prayer',
        body: 'Lord, the middle is long and I’m worn down. Help me not to quit in the slow attrition of hard days. Use this season to build perseverance and character in me. Renew my hope. Give me strength for one more day, and then the next.',
      },
      {
        type: 'response',
        body: 'The struggle is not wasted. It is building perseverance, character, and hope in me.',
      },
      {
        type: 'benediction',
        body: 'Go and endure another day. You are being built even as you build.',
      },
    ],
  },
  {
    id: 'd-contentment',
    title: 'On Enough',
    situation: 'Finding contentment while still striving for more.',
    category: 'wins',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'The next milestone is already pulling at you. Pause and ask whether you’ve let yourself enjoy the one you’re standing on.',
      },
      {
        type: 'scripture',
        reference: 'Philippians 4:11–12',
        body: '“… I have learned to be content whatever the circumstances. I know what it is to be in need, and I know what it is to have plenty …”',
      },
      {
        type: 'reflection',
        body: 'The entrepreneurial mind is a machine that runs on “not yet” — the next round, the next hire, the next milestone, always just out of reach. It’s a powerful engine and a cruel master, because it can never arrive. Paul says contentment is something learned, a skill, not a personality trait — and notably, he learned it in both need and plenty, which means more money is not the cure. Contentment doesn’t mean killing ambition; it means refusing to let your peace be held hostage by what you don’t yet have. You can strive for more and be deeply content with today. That is freedom.',
      },
      {
        type: 'prayer',
        body: 'Father, teach me the secret Paul learned — to be content in every circumstance. Free me from the tyranny of “not yet.” Let me strive without being enslaved by the striving. Help me see and enjoy what I already have, even as I work toward more.',
      },
      {
        type: 'response',
        body: 'I can pursue more and still be content with today. Contentment is learned, not given.',
      },
      {
        type: 'benediction',
        body: 'Go and work toward more — from a heart that is already at peace.',
      },
    ],
  },
  {
    id: 'd-wisdom',
    title: 'On Asking for Wisdom',
    situation: 'Seeking counsel and discernment for the decisions ahead.',
    category: 'people',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'You will make dozens of decisions today, some that matter more than you know. Pause and ask for the wisdom to choose well.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 11:14',
        body: '“For lack of guidance a nation falls, but victory is won through many advisers.”',
      },
      {
        type: 'reflection',
        body: 'The myth of the lone genius founder is exactly that — a myth, and a dangerous one. Scripture is relentless on this point: wisdom comes through counsel, through many advisers, through the humility to admit you cannot see every angle alone. Pride isolates; it whispers that asking for help is weakness. But the wise founder builds a circle of honest voices — mentors, peers, people who will tell the truth rather than what you want to hear — and listens before deciding. And above all counsel, there is the One who gives wisdom generously to any who ask. Don’t navigate today’s decisions blind. Ask.',
      },
      {
        type: 'prayer',
        body: 'Lord, give me wisdom for the decisions ahead — you promise it freely to any who ask. Surround me with honest counselors and the humility to listen. Keep me from the pride that isolates. Let me seek truth over flattery and choose well today.',
      },
      {
        type: 'response',
        body: 'I will seek wisdom and counsel. I was never meant to decide it all alone.',
      },
      {
        type: 'benediction',
        body: 'Go and ask — of wise counselors, and of the God who gives wisdom freely.',
      },
    ],
  },
  {
    id: 'd-servant-leader',
    title: 'On Leading Like a Servant',
    situation: 'Using authority to lift others rather than yourself.',
    category: 'people',
    minutes: 5,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'You hold authority over people’s work and, in part, their livelihoods. Pause and consider what that power is for.',
      },
      {
        type: 'scripture',
        reference: 'Mark 10:42–45',
        body: '“… whoever wants to become great among you must be your servant … For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.”',
      },
      {
        type: 'reflection',
        body: 'The world’s model of leadership is a pyramid: power flows up, and those below exist to serve those above. Jesus turned it upside down. Greatness, he said, is measured in service — and he proved it by washing feet and laying down his life. For the founder, this is not soft sentiment; it is a radically different operating system. Your authority is a tool for the flourishing of your people, not a perk for your comfort. Lead by serving: remove obstacles, develop people, take the blame and share the credit, spend your power on their behalf. The best leaders are not the ones served by everyone, but the ones who serve.',
      },
      {
        type: 'prayer',
        body: 'Father, you gave me authority over people and their work. Help me use it the way Jesus did — to serve, not to be served. Let me lead by lifting others, taking responsibility, and sharing credit. Make me a leader my team is genuinely better for having.',
      },
      {
        type: 'response',
        body: 'My authority is for serving, not for being served. Greatness is measured in service.',
      },
      {
        type: 'benediction',
        body: 'Go and lead by serving. Spend your power on the flourishing of your people.',
      },
    ],
  },
  {
    id: 'd-failure',
    title: 'On Grace for Your Failures',
    situation: 'Living with the mistakes and losses you carry.',
    category: 'pressure',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'You carry a few failures you’d undo if you could. Bring them here, into the open, instead of dragging them silently.',
      },
      {
        type: 'scripture',
        reference: 'Lamentations 3:22–23',
        body: '“Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.”',
      },
      {
        type: 'reflection',
        body: 'Every entrepreneur accumulates a graveyard of failures — the bad hire, the wrong bet, the launch that flopped, the money lost. The world says failure is data; learn from it and move on. That’s true but incomplete, because some failures don’t just need a lesson, they need grace — the kind that releases the shame still attached to them. God’s mercies are not rationed to the flawless; they are new every morning, fresh enough to meet whatever you carry from yesterday. Learn what your failures can teach, yes. But then let them be forgiven and set down. You are not the sum of your worst decisions.',
      },
      {
        type: 'prayer',
        body: 'Lord, I carry failures that still sting and shame me. Thank you that your mercies are new this morning, enough for all of it. Teach me what these losses can teach. Then help me release the shame I’ve been dragging. I am not the sum of my mistakes.',
      },
      {
        type: 'response',
        body: 'His mercies are new every morning. I will learn from failure and lay down the shame.',
      },
      {
        type: 'benediction',
        body: 'Go forward unburdened. Yesterday’s failures do not get to define today.',
      },
    ],
  },
  {
    id: 'd-purpose',
    title: 'On Building What Lasts',
    situation: 'Keeping eternity in view while building in time.',
    category: 'rhythms',
    minutes: 5,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'One day this company will be a line in someone’s history, or forgotten entirely. Let that sharpen, not depress, you. Sit with it.',
      },
      {
        type: 'scripture',
        reference: 'Matthew 6:19–21',
        body: '“Do not store up for yourselves treasures on earth … But store up for yourselves treasures in heaven … For where your treasure is, there your heart will be also.”',
      },
      {
        type: 'reflection',
        body: 'Almost everything you’re building will eventually fade — companies are sold, products are sunset, empires pass. That’s not a reason for despair; it’s a reason for perspective. The things that genuinely last are not on the balance sheet: the people you developed, the character you formed, the good you did, the love you showed, the way you treated the least powerful person in the room. You can build a profitable company and a meaningful life at the same time — but only if you remember which one is eternal. Keep one eye on the work in time, and one eye on the treasure that outlives it.',
      },
      {
        type: 'prayer',
        body: 'Father, help me build with eternity in view. Let me give myself fully to good work without storing my whole heart in things that fade. Let what I build bless people and honor you. And let me invest, most of all, in what will actually last.',
      },
      {
        type: 'response',
        body: 'I will build well in time, with my treasure set on what lasts beyond it.',
      },
      {
        type: 'benediction',
        body: 'Go and build — with one eye on the work, and one on what outlives it.',
      },
    ],
  },
  {
    id: 'd-trust-outcomes',
    title: 'On Releasing the Outcome',
    situation: 'Doing your part and entrusting the results to God.',
    category: 'wins',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'So much of what you want depends on things you cannot control. Before you grip them tighter, practice letting them go.',
      },
      {
        type: 'scripture',
        reference: 'Proverbs 16:3',
        body: '“Commit to the Lord whatever you do, and he will establish your plans.”',
      },
      {
        type: 'reflection',
        body: 'There is a clean line between what is yours and what is God’s, and most of our anxiety comes from trying to live on both sides of it. Yours is the effort: the diligence, the integrity, the wise choices, the faithful showing-up. His is the outcome: the timing, the results, the open and closed doors, the harvest. Commit your work to him and you can pour yourself into your part without being crushed by what you cannot control. This is not passivity — it is the opposite. It frees you to work harder and worry less, because the weight of the result is finally resting where it belongs.',
      },
      {
        type: 'prayer',
        body: 'Lord, I commit my work to you today — the effort is mine to give, the outcome is yours to hold. Free me from the anxiety of trying to control what I cannot. Help me do my part with all my heart, and trust you with everything beyond it.',
      },
      {
        type: 'response',
        body: 'Mine is the effort; the outcome is God’s. I commit my work and release the result.',
      },
      {
        type: 'benediction',
        body: 'Go and give your best to your part. Leave the results in faithful hands.',
      },
    ],
  },
  {
    id: 'd-gratitude',
    title: 'On Beginning With Thanks',
    situation: 'Letting gratitude reorder the way you see the day.',
    category: 'rhythms',
    minutes: 4,
    kind: 'devotional',
    sections: [
      {
        type: 'call',
        body: 'Before you list what’s missing or broken today, pause to name what’s good. Start there.',
      },
      {
        type: 'scripture',
        reference: 'Psalm 118:24',
        body: '“The Lord has done it this very day; let us rejoice today and be glad.”',
      },
      {
        type: 'reflection',
        body: 'The entrepreneurial eye is trained to spot what’s wrong — the gap, the bug, the underperformer, the thing not yet done. It’s a useful instinct that quietly becomes a joyless one, because a mind fixed only on what’s lacking can never rest in what’s present. Gratitude is the discipline that interrupts the scarcity loop. The fact that you get to do meaningful work, that you have a team or a customer or even just a chance, that breath fills your lungs this morning — these are not guaranteed; they are gifts. Begin the day by naming a few of them, and watch how it reorders everything that follows.',
      },
      {
        type: 'prayer',
        body: 'Father, before I rush into the problems, I stop to give thanks. Thank you for this day, for the work, for the people, for the breath in my lungs. Train my eyes to see gifts and not just gaps. Let gratitude set the tone for everything I do today.',
      },
      {
        type: 'response',
        body: 'This is the day the Lord has made. I will begin it with thanks, not just with tasks.',
      },
      {
        type: 'benediction',
        body: 'Go into the day grateful. What you have was given, and it is enough to start.',
      },
    ],
  },
];

export const getDevotionalById = (id: string): Devotional | undefined =>
  DEVOTIONALS.find((d) => d.id === id);

/**
 * Deterministic "devotional of the day" — same for everyone on a given date,
 * rotating through the generic daily devotionals before repeating.
 */
export const getDailyDevotional = (date = new Date()): Devotional => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DEVOTIONALS[dayOfYear % DEVOTIONALS.length];
};
