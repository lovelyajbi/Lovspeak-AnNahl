import { q } from '../helpers.mjs';

export const reviews = [
  {
    id: 'a1-daily-01', level: 'A1', scriptDecision: 'keep; natural problem-solving dialogue with a complete shared plan',
    tags: { 0: 'concerned', 1: 'tired', 4: 'practical', 11: 'relieved', 17: 'warmly', 20: 'determined' },
    additions: [
      q('Why was the old cleaning system confusing?', 'They cleaned only when they remembered', 'They used two different kitchens', 'The chart was too long', 'The fridge had no door', 'Without assigned turns, neither roommate knew who should act.'),
      q('What does “alternate weeks” mean?', 'Take turns each week', 'Clean twice every week', 'Choose a new apartment', 'Work only on weekends', 'They will switch bathroom duty from one week to the next.'),
      q('Where will they put the chart?', 'On the fridge', 'Inside the bathroom', 'Beside the trash bin', 'On the front door', 'A visible place will help both roommates remember.'),
      q('How does Sam feel about Mira’s approach?', 'Grateful she spoke directly', 'Angry about the chart', 'Confused about the dishes', 'Ready to move out', 'He thanks her for discussing the problem instead of staying silently annoyed.'),
      q('What makes their plan fair?', 'Both people share clear duties', 'Mira does every task', 'Sam chooses every day', 'They leave work for weekends', 'The chart divides kitchen and bathroom work between them.'),
    ],
  },
  {
    id: 'a1-daily-02', level: 'A1', scriptDecision: 'keep; humorous voice memo with a clear time sequence and practical ending',
    tags: { 0: 'breathless', 3: 'frustrated', 4: 'laughing', 6: 'surprised', 9: 'resigned', 13: 'determined', 15: 'relieved' },
    additions: [
      q('What happened before she looked for her keys?', 'She drank coffee from a bowl', 'She bought a sandwich', 'She reached the bus stop', 'She packed her lunch', 'The missing mug problem came before the search for keys.'),
      q('What does “chaos” mean in this memo?', 'A confused and messy situation', 'A quiet walk to work', 'A carefully planned morning', 'A normal bus ride', 'Several problems made the morning feel uncontrolled.'),
      q('Why did she buy a sandwich?', 'Her lunch was left at home', 'She disliked her packed food', 'Her coworker requested one', 'The bus arrived early', 'She noticed the forgotten lunch only after leaving.'),
      q('How does recording the memo help her?', 'It makes her feel calmer', 'It finds her missing keys', 'It cleans the kitchen', 'It delays the bus', 'Talking and laughing about the morning reduces her stress.'),
      q('Which change may help tomorrow morning most?', 'Preparing important things at night', 'Waking twenty minutes later', 'Keeping keys in the fridge', 'Buying more coffee bowls', 'Her problems grew because little was prepared before bed.'),
    ],
  },
  {
    id: 'a1-daily-03', level: 'A1', scriptDecision: 'keep; interview format gives concrete steps for reducing household clutter',
    tags: { 0: 'warmly', 1: 'pleasantly', 3: 'reflective', 5: 'practical', 13: 'relieved', 17: 'encouraging', 19: 'warmly' },
    additions: [
      q('Why did Lila choose one drawer first?', 'It felt small enough to finish', 'It held all her clothes', 'It belonged to her neighbor', 'It was already empty', 'A small starting point helped her avoid giving up.'),
      q('What does “overwhelming” mean here?', 'Feeling too difficult to begin', 'Feeling easy and relaxing', 'Looking clean and empty', 'Becoming expensive to repair', 'Clearing a whole apartment can feel like too much work at once.'),
      q('What became easier after Lila owned less?', 'Cleaning and finding things', 'Moving every six months', 'Buying kitchen tools', 'Keeping old papers', 'Fewer objects reduced both cleaning and searching time.'),
      q('How did the process change her shopping?', 'She thinks about future use before buying', 'She buys every item on sale', 'She shops only once a year', 'She asks friends to choose', 'She now asks whether she will still want an item in six months.'),
      q('What is Lila’s purpose in the podcast?', 'To give a simple way to start', 'To sell storage furniture', 'To describe her new apartment', 'To ask listeners for old clothes', 'Her advice helps an overwhelmed listener begin with one small space.'),
    ],
  },
  {
    id: 'a1-daily-04', level: 'A1', scriptDecision: 'keep; natural family phone call with setting, routine, and emotional support',
    tags: { 0: 'cheerful', 1: 'warmly', 2: 'tired but happy', 7: 'concerned', 10: 'warmly', 15: 'teasing', 18: 'gently', 20: 'warmly' },
    additions: [
      q('Why is Dara eating simple meals?', 'Many kitchen things are still in boxes', 'The market has no food', 'Her mother asked her to', 'The bakery is closed', 'She is still unpacking and has only recently found her pan.'),
      q('What does “manageable” mean here?', 'Not too difficult to handle', 'Impossible to continue', 'Shorter than before', 'Free from all tiredness', 'The extra twenty minutes is inconvenient but still possible for Dara.'),
      q('What does Dara do during the longer commute?', 'She plans her day', 'She calls the bakery', 'She waters hallway plants', 'She unpacks boxes', 'She uses the extra travel time to organize her day.'),
      q('What helped Dara learn about the neighborhood?', 'A conversation with an older neighbor', 'A message from her manager', 'A map from her mother', 'A note inside a box', 'The neighbor told her about a good local bakery.'),
      q('How does Dara’s mother support her?', 'She gives patient and loving advice', 'She tells Dara to move back', 'She offers to unpack everything', 'She complains about the commute', 'Her mother says creating a home takes time and expresses pride.'),
    ],
  },
  {
    id: 'a1-daily-05', level: 'A1', scriptDecision: 'keep; practical meal-planning dialogue with simple sequence and food vocabulary',
    tags: { 0: 'practical', 1: 'agreeing', 6: 'excited', 10: 'relieved', 14: 'thoughtful', 19: 'satisfied' },
    additions: [
      q('Why do they make a large pot of soup?', 'They can eat it for two days', 'They have too many bowls', 'They invited many guests', 'They want soup on Friday', 'A larger amount means less cooking the next day.'),
      q('What does “leftover” mean?', 'Food that remains from before', 'Food bought for guests', 'Food that is too expensive', 'Food cooked in a restaurant', 'The carrots are still available from an earlier meal or purchase.'),
      q('Which meal needs extra spices?', 'The spicy noodles', 'The fried rice', 'The chicken soup', 'The grilled fish', 'Bima says they are missing two spices for the noodle recipe.'),
      q('Why will they wash the fruit at once?', 'It will be easy to take as a snack', 'It will last for many months', 'It will replace every meal', 'It will make chips cheaper', 'Ready fruit is more convenient when they want a quick snack.'),
      q('How does planning help the couple?', 'It reduces waste and last-minute orders', 'It removes all cooking', 'It makes Friday busier', 'It fills the fridge with random food', 'A short plan gives each ingredient and day a purpose.'),
    ],
  },
  {
    id: 'a1-daily-06', level: 'A1', scriptDecision: 'keep routine; simplify figurative and abstract words',
    replaceText: [['the free time had slipped through my fingers without me noticing', 'the free time had disappeared before I noticed'], ['a few small anchors in an otherwise open weekend', 'a few fixed habits in an open weekend'], ['a heavy dread on Sunday night', 'strong worry on Sunday night'], ['one or two small anchors', 'one or two small fixed habits']],
    tags: { 0: 'disappointed', 3: 'peacefully', 5: 'practical', 8: 'relaxed', 9: 'thoughtful', 13: 'relieved', 16: 'encouraging' },
    additions: [
      q('What is the first useful task on Saturday?', 'One small household job', 'A full day of cleaning', 'Packing the Monday bag', 'Planning every meal', 'He chooses only one task such as laundry or the kitchen.'),
      q('What does “unplanned on purpose” mean?', 'He chooses to leave the time open', 'He forgot to make a plan', 'His friends canceled everything', 'He must work that afternoon', 'Saturday afternoon is intentionally free for reading, rest, or friends.'),
      q('How are Saturday and Sunday different?', 'Saturday has rest; Sunday prepares for the week', 'Saturday is for work; Sunday has no plan', 'Both days follow a strict schedule', 'Both days are spent on the phone', 'The two days have different simple purposes.'),
      q('Why is Sunday evening calmer now?', 'Important preparation is already finished', 'Monday has been canceled', 'He sleeps through the evening', 'The house is always empty', 'Checking the calendar and packing his bag reduce worry.'),
      q('What kind of routine does he recommend?', 'A few simple habits, not a full schedule', 'A plan for every minute', 'No useful activity at all', 'The same routine as a workday', 'His routine works because it provides direction while leaving free time.'),
    ],
  },
  {
    id: 'a1-daily-07', level: 'A1', scriptDecision: 'revise unsafe car-call setting to a bus commute; preserve the radio advice',
    replaceText: [["calling from my car right now, stuck in traffic", 'calling from the bus right now, stuck in traffic'], ['during the drive', 'during the trip'], ['in the car', 'in my bag']],
    tags: { 0: 'cheerfully', 1: 'tired', 5: 'stressed', 8: 'relieved', 12: 'calmly', 20: 'encouraging' },
    baseQuiz: [
      q('Where is the caller speaking from?', 'A bus in traffic', 'A quiet office', 'A train station', 'A parked bicycle', 'The caller is traveling by bus during slow traffic.'),
      q('How long is the commute each way?', 'About fifty minutes', 'About fifteen minutes', 'Almost two hours', 'Only five minutes', 'The caller normally spends around fifty minutes on each trip.'),
      q('What replaced the news during the trip?', 'Calm storytelling podcasts', 'Work phone calls', 'Loud music', 'Language tests', 'Calmer audio improved the caller’s mood.'),
      q('What schedule change reduced traffic?', 'Leaving fifteen minutes earlier', 'Leaving one hour later', 'Working only at night', 'Taking a different job', 'A small earlier start avoids part of the busiest traffic.'),
      q('What does the caller keep in the bag?', 'Water and a small snack', 'A coffee machine', 'A large meal', 'A second phone', 'Water and food make a long trip more comfortable.'),
    ],
    additions: [
      q('How did the old commute affect work?', 'The caller arrived feeling tense', 'The caller arrived too early', 'The caller missed every meeting', 'The caller worked on the bus', 'Traffic stress was already present at the start of the workday.'),
      q('What does “transition time” mean here?', 'Time between home and work', 'Time used only for news', 'Time when the bus is empty', 'Time for changing a ticket', 'The caller sees commuting as a bridge between two parts of the day.'),
      q('Why did news audio make the trip harder?', 'It added more tension', 'It was too quiet to hear', 'It ended before work', 'It changed the bus route', 'Stressful news increased an already tense feeling.'),
      q('Which two changes directly support a calmer mood?', 'Earlier travel and calmer audio', 'A longer route and less sleep', 'More news and no snack', 'Later travel and more traffic', 'The caller combines a schedule change with different listening.'),
      q('What is the radio segment trying to offer?', 'Small ways to reduce commute stress', 'A way to avoid all travel', 'A review of bus companies', 'A plan for buying a car', 'The caller shares realistic habits for a difficult daily trip.'),
    ],
  },
  {
    id: 'a1-daily-08', level: 'A1', scriptDecision: 'keep; clear step-by-step routine with realistic limits and restart behavior',
    tags: { 0: 'frustrated', 2: 'curious', 3: 'practical', 6: 'firmly', 8: 'relieved', 10: 'gently', 13: 'satisfied' },
    additions: [
      q('What happens first during the reset?', 'Things return to their places', 'Tomorrow’s clothes are chosen', 'The timer is stopped', 'Every shelf is cleaned', 'The narrator begins by putting away objects and dirty clothes.'),
      q('What does “reset” mean in this routine?', 'A short time to put the home in order', 'A complete apartment repair', 'A new Saturday schedule', 'A longer night of work', 'The fifteen minutes restore basic order without deep cleaning.'),
      q('Why does the narrator stop when the timer rings?', 'The habit must stay easy to repeat', 'The apartment is always perfect', 'There are no more dishes', 'A friend calls every night', 'A limited task is easier to continue daily.'),
      q('Why does the narrator avoid thirty minutes after a missed day?', 'The routine is not a punishment', 'The timer cannot count longer', 'Saturday cleaning is required', 'The apartment has no mess', 'Restarting gently supports consistency without guilt.'),
      q('Which result affects the narrator’s mornings?', 'Important things are ready and easy to find', 'Breakfast is cooked every night', 'Work begins later', 'The apartment becomes larger', 'A clear table, bag, and keys reduce morning searching.'),
    ],
  },
  {
    id: 'a1-daily-09', level: 'A1', scriptDecision: 'keep; adult budgeting story uses concrete food choices and a realistic balance',
    tags: { 0: 'concerned', 2: 'determined', 4: 'frustrated', 6: 'relieved', 9: 'cheerful', 10: 'satisfied', 13: 'warmly' },
    additions: [
      q('Why did the door note help?', 'It reminded him before he left', 'It showed the lunch recipe', 'It recorded his spending', 'It told coworkers to wait', 'The note was placed where he would see it while leaving home.'),
      q('What does “planned choice” mean for Friday lunch?', 'A decision made before spending', 'A meal bought by accident', 'A lunch chosen by coworkers', 'Food left on the counter', 'The restaurant meal was intentional, unlike his old daily habit.'),
      q('What changed by the second week?', 'Packing lunch felt normal', 'He stopped eating lunch', 'He bought more special boxes', 'His coworkers ate alone', 'Repeating the action made it part of his routine.'),
      q('What two benefits did he notice?', 'More savings and better afternoon energy', 'More snacks and a larger bill', 'Less food and longer work', 'More restaurants and less time', 'Home food helped both his budget and how he felt after lunch.'),
      q('Why is his final plan realistic?', 'It allows one bought lunch each week', 'It bans every social meal', 'It requires perfect cooking', 'It changes every family dinner', 'The balance saves money without removing all restaurant meals.'),
    ],
  },
  {
    id: 'a1-daily-10', level: 'A1', scriptDecision: 'keep; strong habit story connecting evening preparation with morning results',
    tags: { 0: 'tired', 2: 'determined', 4: 'tempted', 6: 'relieved', 8: 'thoughtful', 10: 'surprised', 13: 'calmly' },
    additions: [
      q('Why does the phone stay across the room?', 'He must stand to stop the alarm', 'It charges faster there', 'The shelf is near breakfast', 'The bedroom has no table', 'Distance makes pressing snooze from bed impossible.'),
      q('What does “snooze” do?', 'Delays the alarm for a short time', 'Turns on the room light', 'Prepares clothes for work', 'Moves the phone away', 'Repeated snoozing kept him in bed until he was rushed.'),
      q('Which preparation reduced morning decisions?', 'Ready clothes and a packed bag', 'Eggs and toast at work', 'A book beside the phone', 'A later alarm time', 'He had already chosen and packed important things.'),
      q('Why did he change his evening videos?', 'Late watching made early waking harder', 'The videos stopped working', 'He wanted to read at work', 'The alarm was too loud', 'An earlier bedtime supports the morning plan.'),
      q('What does the narrator understand after one week?', 'The night before shapes the morning', 'One week makes a habit permanent', 'Motivation alone solves everything', 'Breakfast is the only important change', 'Several evening choices make the early action easier.'),
    ],
  },
];
