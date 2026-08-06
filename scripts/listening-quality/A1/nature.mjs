import { q } from '../helpers.mjs';

export const reviews = [
  {
    id: 'a1-nature-01', level: 'A1', scriptDecision: 'keep; clear personal observation story with concrete sensory details and gradual change',
    replaceText: [['My hands did not know what to do without a screen.', 'I kept reaching for a screen that was not there.'], ['everything about how I experience it changed', 'the way I experienced it changed']],
    tags: { 0: 'honestly', 2: 'surprised', 3: 'softly', 7: 'determined', 8: 'restless', 10: 'peacefully', 12: 'warmly' },
    additions: [
      q('Why did the narrator almost return home?', 'To charge the phone', 'To get an umbrella', 'To change shoes', 'To invite a friend', 'The phone battery died, so charging it was the first thought.'),
      q('What does “barely noticed” mean?', 'Almost did not see', 'Looked at carefully', 'Remembered clearly', 'Stopped to draw', 'The phone took so much attention that the street was almost unseen.'),
      q('What felt strange during the first phone-free walk?', 'Stopping to listen to birds', 'Walking past the park', 'Seeing a phone screen', 'Returning after noon', 'The narrator was not used to pausing and listening.'),
      q('What changed after one week?', 'Boredom became interest in small changes', 'The morning route became shorter', 'The yellow flowers disappeared', 'The narrator bought a new phone', 'New leaves and different birds began to hold the narrator’s attention.'),
      q('Why does the narrator now know the park better?', 'More attention is given to the surroundings', 'The park has added many signs', 'A sister explains every tree', 'The walks are much faster', 'Looking away from the screen made details easier to notice.'),
    ],
  },
  {
    id: 'a1-nature-02', level: 'A1', scriptDecision: 'revise; retain an engaging podcast story while adding beginner hiking safety and removing casual solo-hiking encouragement',
    replaceText: [
      ['Host: [curious] Do you ever hike alone, or always with a group?', 'Host: [curious] How do you prepare before you choose a trail?'],
      ['Guest: [honestly] Both, depending on the trail. Alone, I think more clearly. With friends, I laugh more and complain less about tired legs.', 'Guest: [carefully] I check the route, weather, and local rules. I also go with a group or a trusted partner, especially on a new trail.'],
      ['Start small, with an easy trail and good shoes. Nobody climbs a big mountain on their first weekend.', 'Start small, with an easy marked trail, good shoes, enough water, and an experienced group. Check the weather before leaving.'],
    ],
    tags: { 0: 'warmly', 3: 'thoughtful', 7: 'amazed', 9: 'reflective', 11: 'gently', 13: 'carefully', 15: 'encouraging', 19: 'warmly' },
    additions: [
      q('Why did Maya almost refuse her first hike?', 'She did not feel fit enough', 'She disliked her coworker', 'The weather was stormy', 'She had no interest in views', 'Maya worried that the walking would be too difficult.'),
      q('What does Maya enjoy in the mountains besides the view?', 'Quiet without traffic or notifications', 'Shops beside every trail', 'Fast internet service', 'Crowded city sounds', 'She describes wind, birds, silence, and her own breathing.'),
      q('What does Maya check before choosing a trail?', 'The route, weather, and local rules', 'Only the number of photos', 'Her office schedule alone', 'The price of a hotel', 'These checks are part of her safety preparation.'),
      q('Who does Maya recommend hiking with?', 'An experienced group or trusted partner', 'No one on a first trail', 'Only office managers', 'Any stranger at the top', 'The revised advice gives beginners clear and safer support.'),
      q('Why does Maya return to mountains?', 'Each hike offers something different to notice', 'Every mountain is easy now', 'She must complete a work task', 'Her legs never become tired', 'She says even a familiar mountain can feel different.'),
    ],
  },
  {
    id: 'a1-nature-03', level: 'A1', scriptDecision: 'revise; keep the natural planning dialogue and add campsite, contact, and offline-map safety details',
    replaceText: [
      ['There\'s a quiet campsite there with a good view of the water at sunrise.', 'There\'s an official campsite there with a good view of the water at sunrise.'],
      ['A flashlight, definitely, and maybe a book, since there\'s no signal there for your phone anyway.', 'A flashlight, definitely, an offline map, and the campsite emergency number because phone signal is weak there.'],
      ['No signal sounds like a relief, honestly. I could use two days without messages.', 'I still like the quiet, but I will tell my sister our route and return time before we leave.'],
      ['Same here. I always sleep better after a weekend without a screen near my face.', 'Good plan. We can enjoy less screen time after our safety information is ready.'],
    ],
    tags: { 0: 'excited', 1: 'prepared', 3: 'thoughtful', 7: 'helpfully', 8: 'surprised', 11: 'carefully', 14: 'curious', 18: 'smiling' },
    additions: [
      q('Why do they choose the lake location?', 'It has an official campsite and a sunrise view', 'It has strong phone signal', 'It is beside their office', 'It stays hot at night', 'Fajar knows a recognized place with a view of the water.'),
      q('What does “mist” mean in Fajar’s memory?', 'A thin cloud close to the water', 'Heavy rain inside a tent', 'Smoke from the stove', 'Dust from a road', 'He saw mist rising from the lake in the early morning.'),
      q('Why does Dewi need a warm jacket?', 'Nights near the water can be cold', 'The daytime sun is weak', 'The jacket holds their food', 'Rain is certain all weekend', 'Fajar warns that the temperature drops at night.'),
      q('What will Dewi tell her sister?', 'Their route and expected return time', 'The title of her book', 'How to cook on the stove', 'The color of the tent', 'Sharing travel information helps someone know their plan.'),
      q('How do they divide the camping supplies?', 'Dewi brings food; Fajar brings the tent and stove', 'Dewi brings everything', 'Fajar brings only books', 'They will buy supplies at the lake', 'Their final agreement gives each person a clear task.'),
    ],
  },
  {
    id: 'a1-nature-04', level: 'A1', scriptDecision: 'keep; meaningful family memory with a concrete garden image, while narrowing one overly broad statement',
    replaceText: [['you see, everything worth having grows slowly and quietly, mostly when nobody is watching', 'you see, some good things need time and care, even when we cannot see a change yet'], ['quiet waiting is not the same as failing, even when it feels exactly like failing', 'waiting and continuing to try did not always mean I was failing']],
    tags: { 0: 'warmly', 2: 'curious', 4: 'gently', 5: 'impatient', 7: 'proud', 8: 'wisely', 9: 'sadly', 13: 'with feeling' },
    additions: [
      q('What did the grandmother give the child?', 'A small shovel', 'A basket of mangoes', 'A market bag', 'A new job', 'She answered the question by inviting the child to help.'),
      q('What does “impatient” mean?', 'Not wanting to wait', 'Happy to work slowly', 'Afraid of the garden', 'Unable to use a shovel', 'The child expected a plant to appear very quickly.'),
      q('What finally came through the soil?', 'A tiny green shoot', 'A ripe tomato', 'An old mango branch', 'A market receipt', 'The first visible plant growth made the narrator proud.'),
      q('What difficult event happened years later?', 'The narrator lost a job', 'The garden was sold', 'The cousin moved away', 'The market closed', 'The garden memory returned during a long job search.'),
      q('Who cares for the garden now?', 'The narrator’s cousin', 'A market seller', 'The old manager', 'The narrator’s child', 'The cousin tends it after the grandmother’s death.'),
    ],
  },
  {
    id: 'a1-nature-05', level: 'A1', scriptDecision: 'keep; warm family conversation uses color, silence, and a practical small habit to express reflection',
    replaceText: [['It puts things back into proportion for us.', 'It can help us see our worries in a new way.'], ['Thanks for listening to me ramble about clouds and colors.', 'Thanks for listening to my long story about clouds and colors.']],
    tags: { 0: 'excited', 2: 'amazed', 4: 'quietly', 6: 'softly', 9: 'thoughtful', 11: 'encouraging', 14: 'smiling', 17: 'with love' },
    additions: [
      q('Who watched the sunrise with Rafi?', 'Two friends', 'His mother', 'A mountain guide only', 'No one', 'Rafi says he was with two friends.'),
      q('Why were the three friends mostly silent?', 'They were watching the view', 'They were angry with each other', 'They had lost their phones', 'They were still asleep', 'The sunrise held their attention, so they spoke very little.'),
      q('What does “dawn” mean?', 'The early time before sunrise', 'The middle of the night', 'The hottest part of the day', 'The time after sunset', 'Rafi woke before the sun came up.'),
      q('Why does Rafi want to look up more often?', 'Daily beauty is easy to miss', 'Mountains appear every morning', 'His camera needs more light', 'His balcony has no view', 'The conversation helps him notice ordinary skies too.'),
      q('Why were the photos disappointing?', 'They did not show the real colors', 'Rafi forgot to take any', 'The phone battery was empty', 'His friends deleted them', 'The camera could not fully capture what he saw.'),
    ],
  },
  {
    id: 'a1-nature-06', level: 'A1', scriptDecision: 'keep; simple notebook habit creates a clear sequence from observation to stronger local awareness',
    replaceText: [['the seasons were background noise, something happening while I focused on more important things', 'the seasons were easy to ignore while I thought about other things'], ['as a quiet, careful rhythm that continues whether I am paying attention or not', 'as small changes that continue whether I notice them or not'], ['I no longer feel like a stranger passing through my own neighborhood.', 'My neighborhood no longer feels like a place I simply pass through.']],
    tags: { 0: 'thoughtful', 2: 'reflective', 3: 'simply', 5: 'surprised', 7: 'honestly', 9: 'hopeful', 11: 'peacefully', 12: 'warmly' },
    additions: [
      q('How much does the narrator write each day?', 'One line', 'One full book', 'Ten pages', 'Nothing about weather', 'The notebook entry is intentionally short.'),
      q('What does “bloom” mean for flowers?', 'Open and produce flowers', 'Fall from a tree', 'Become dry soil', 'Move in the wind', 'Some flowers appear for only two weeks each year.'),
      q('When did the narrator notice the wind changing?', 'Before the rainy season', 'After every evening meal', 'Only during spring', 'When driving to work', 'The wind pattern appears before the first large storm.'),
      q('Why did the narrator begin walking to work?', 'To notice more outside', 'To avoid writing at night', 'To arrive much faster', 'To find a different job', 'Walking creates more time to observe the street and seasons.'),
      q('What makes the habit easy to continue?', 'It takes only a few minutes', 'It requires a long drive', 'It depends on rare flowers', 'It needs expensive tools', 'A one-line evening note is small and manageable.'),
    ],
  },
  {
    id: 'a1-nature-07', level: 'A1', scriptDecision: 'keep; lively radio format presents an accessible city hobby through specific details and simple advice',
    replaceText: [['got a little obsessed after that first discovery', 'wanted to learn more after that first discovery'], ['how much life is flying right above your head', 'how many birds are flying above you']],
    tags: { 0: 'cheerfully', 1: 'nervous', 3: 'thoughtful', 5: 'smiling', 7: 'excited', 9: 'proudly', 11: 'helpfully', 15: 'patiently', 19: 'warmly' },
    additions: [
      q('Where did the caller see the first unusual bird?', 'Outside an office window', 'On a mountain', 'Inside the apartment', 'At a pet shop', 'The hobby began with a bird near the caller’s workplace.'),
      q('What does the bird app help the caller do?', 'Identify different birds', 'Buy binoculars', 'Find office work', 'Change sunrise time', 'The app helps connect a sighting with a bird name.'),
      q('When are birds easiest to hear?', 'Around sunrise', 'At midnight', 'During busy traffic', 'After the radio show', 'The caller recommends early morning when birds are active.'),
      q('Why is patience useful in birdwatching?', 'A person may wait quietly before seeing something', 'Birds always arrive on command', 'The app takes many hours to open', 'Binoculars work only slowly', 'Standing still and quiet can take time.'),
      q('What changed in how the caller sees the city?', 'Small green spaces became more valuable', 'All buildings seemed empty', 'The city became completely silent', 'Walking distance became longer', 'Birdwatching revealed nature between the buildings.'),
    ],
  },
  {
    id: 'a1-nature-08', level: 'A1', scriptDecision: 'keep; strong environmental volunteering story includes protective equipment, wildlife distance, sorting, and responsible follow-up',
    tags: { 0: 'warmly', 1: 'curious', 3: 'carefully', 4: 'surprised', 6: 'reflective', 7: 'tired', 10: 'honestly', 12: 'thoughtful' },
    additions: [
      q('What safety item did the leader give volunteers?', 'Gloves', 'Swimming shoes', 'Sunrise maps', 'Bird food', 'Gloves protected their hands while collecting litter.'),
      q('Why were there different bags?', 'To separate types of waste', 'To carry food for birds', 'To mark the sea level', 'To give one to each visitor', 'Plastic, glass, and other rubbish were sorted.'),
      q('What does “keep their distance” mean?', 'Stay far enough away', 'Stand on the nest', 'Take the nest home', 'Make a loud sound', 'The marked area helped people avoid disturbing the bird’s home.'),
      q('Why did the heavy bags surprise the narrator?', 'Small ignored pieces added up', 'The beach looked dirty at first', 'Visitors left full containers', 'The group collected only glass', 'Many tiny items together filled several containers.'),
      q('How did the cleanup change the narrator?', 'Shared natural places felt like a personal responsibility', 'Afternoon visits were no longer allowed', 'All visitors seemed harmful', 'The sea became quieter every day', 'The narrator now manages personal rubbish and safe nearby litter.'),
    ],
  },
  {
    id: 'a1-nature-09', level: 'A1', scriptDecision: 'keep; coherent farm observation explains both benefits and risks of rain through concrete actions',
    tags: { 0: 'warmly', 1: 'hurriedly', 2: 'surprised', 3: 'relieved', 5: 'carefully', 7: 'working', 10: 'peacefully', 13: 'reflective' },
    additions: [
      q('What sound did the rain make?', 'A deep steady sound on the metal roof', 'A quiet sound under the soil', 'A loud sound from the well', 'A dry sound in the corn', 'Heavy drops struck the shelter roof.'),
      q('What happened to the dusty ground?', 'It became dark wet soil', 'It blew away immediately', 'It changed into a road', 'It stayed completely dry', 'The narrator watched the rain change its color and condition.'),
      q('Why did they clear the channel?', 'To guide water slowly to a storage pond', 'To send water out of the farm', 'To dry the corn at once', 'To make room for their tools', 'The channel helped manage water and protect the soil.'),
      q('What does “blocked” mean here?', 'Closed by leaves and sticks', 'Filled with clean water', 'Built beside the field', 'Recorded in a notebook', 'Debris stopped the water from moving properly.'),
      q('What new idea did the narrator understand?', 'Rain can help or cause problems depending on conditions', 'Rain is always bad for farm work', 'A farm never needs stored water', 'Planning is unnecessary after rain', 'The effects depend on land, crops, and preparation.'),
    ],
  },
  {
    id: 'a1-nature-10', level: 'A1', scriptDecision: 'keep; excellent safety dialogue replaces an appealing but harmful action with specific wildlife-respect behavior',
    tags: { 0: 'curious', 1: 'firmly', 3: 'carefully', 5: 'concerned', 7: 'helpfully', 9: 'calmly', 13: 'seriously', 15: 'thoughtful', 19: 'warmly' },
    additions: [
      q('Why is fruit still not suitable to give?', 'Wild monkeys should find their natural food', 'Fruit is always worse than candy', 'The monkey has already eaten', 'The park sells different fruit', 'Even healthier human food can change wild behavior.'),
      q('What may monkeys do after people feed them often?', 'Wait near people and grab bags', 'Move deeper into the forest', 'Stop looking at all food', 'Become safe pets', 'The guide explains that feeding creates risky habits.'),
      q('What does “aggressive” mean here?', 'Ready to threaten or attack', 'Quietly eating alone', 'Moving slowly to a tree', 'Afraid of every backpack', 'Some monkeys may approach people forcefully and take bags.'),
      q('Why should Salma avoid loud sounds?', 'They may frighten or challenge the monkey', 'They make the banana sweeter', 'They attract the park guide', 'They improve close photos', 'Calm, slow movement is safer than a sudden action.'),
      q('What kind action helps without changing wild behavior?', 'Protecting habitat and following park rules', 'Feeding fruit from a distance', 'Standing near a young monkey', 'Leaving rubbish beside the path', 'The guide recommends support that keeps wildlife wild.'),
    ],
  },
];
