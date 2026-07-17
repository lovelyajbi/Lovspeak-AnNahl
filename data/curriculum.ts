import { LevelCurriculum, AppView } from '../types';

export const MASTER_CURRICULUM: LevelCurriculum[] = [
  // --- LEVEL A1 (10 UNITS) ---
  {
    level: 'A1',
    units: [
      {
        id: 'a1-u1', unitNumber: 1, title: 'Greetings & Identity', level: 'A1', grammarFocus: 'To Be (Present)', vocabTheme: 'Personal Info',
        description: 'Learn to introduce yourself and others formally and informally.',
        steps: [
          { id: 'a1-u1-bridge', title: 'Unit Context: Greeting with Adab', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Learn why Greetings and Identity use the "To Be" verb.', goal: 'Thematic awareness.' },
          { id: 'a1-u1-s1', title: 'Grammar: The "To Be" Verb', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Am, Is, Are logic.', goal: 'Identify correct forms.', targetId: 'a1-tobe' },
          { id: 'a1-u1-s2', title: 'Reading: Meeting People', type: 'reading_task', moduleView: AppView.READING, description: 'Short dialogues about first meetings.', goal: '80% comprehension.', promptContext: 'Sarah meeting Budi for the first time at an Islamic conference.' },
          { id: 'a1-u1-s3', title: 'Live: Introduce Yourself', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Practice introducing yourself to Lovelya.', goal: 'Speak fluently for 1 min.', promptContext: 'Tell Lovelya your name, origin, and current occupation.' },
        ]
      },
      {
        id: 'a1-u2', unitNumber: 2, title: 'Numbers & Time', level: 'A1', grammarFocus: 'Cardinal/Ordinal Numbers', vocabTheme: 'Time & Dates',
        description: 'Master numbers for prices, ages, and telling time.',
        steps: [
          { id: 'a1-u2-bridge', title: 'Unit Context: The Value of Time', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'The importance of numbers and time in an Islamic lifestyle.', goal: 'Thematic awareness.' },
          { id: 'a1-u2-s1', title: 'Grammar: Numbers & Articles', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'A, An, The with numbers.', goal: 'Correct usage.', targetId: 'a1-articles' },
          { id: 'a1-u2-s2', title: 'Listening: What time is it?', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Identifying time and dates in conversation.', goal: 'Catch specific details.', promptContext: 'Two people scheduling a community meeting at the mosque.' },
          { id: 'a1-u2-s3', title: 'Live: Scheduling a Meet', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss a time for a study group.', goal: 'Use numbers and time correctly.', promptContext: 'Propose a time to meet Lovelya to study English.' },
        ]
      },
      {
        id: 'a1-u3', unitNumber: 3, title: 'Family & People', level: 'A1', grammarFocus: 'Pronouns & Possessives', vocabTheme: 'Family Members',
        description: 'Describe your family tree and physical traits of people.',
        steps: [
          { id: 'a1-u3-bridge', title: 'Unit Context: Honoring Kinship', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'How possessive grammar reflects our family bonds.', goal: 'Thematic awareness.' },
          { id: 'a1-u3-s1', title: 'Grammar: Pronouns Mastery', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'I, Me, My, Mine.', goal: 'Differentiate usage.', targetId: 'a1-pronouns' },
          { id: 'a1-u3-s2', title: 'Reading: My Big Family', type: 'reading_task', moduleView: AppView.READING, description: 'A story about helping elders.', goal: 'Identify family roles.', promptContext: 'A story about a grandson helping his grandfather prepare for Friday prayer.' },
          { id: 'a1-u3-s3', title: 'Live: Describe Your Family', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Talk about your siblings and parents.', goal: 'Use possessives correctly.', promptContext: 'Tell Lovelya about your family and their names.' },
        ]
      },
      {
        id: 'a1-u4', unitNumber: 4, title: 'Home Life', level: 'A1', grammarFocus: 'Prepositions of Place', vocabTheme: 'Furniture & Rooms',
        description: 'Talk about your house and where things are located.',
        steps: [
          { id: 'a1-u4-bridge', title: 'Unit Context: Home as a Personal Space', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Using prepositions to describe our personal spaces.', goal: 'Thematic awareness.' },
          { id: 'a1-u4-s1', title: 'Grammar: In, On, Under', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Spatial relations.', goal: 'Place objects correctly.', targetId: 'a1-prepositions' },
          { id: 'a1-u4-s2', title: 'Live: Tour My House', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe your favorite room.', goal: 'Use 5 different prepositions.', promptContext: 'Tell Lovelya where you keep your books and your computer.' },
          { id: 'a1-u4-s3', title: 'Listening: Finding the Item', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Follow directions inside a house.', goal: 'Locate the object.', promptContext: 'A guest asking for the prayer mat in a new house.' },
        ]
      },
      {
        id: 'a1-u5', unitNumber: 5, title: 'Daily Routine', level: 'A1', grammarFocus: 'Present Simple', vocabTheme: 'Daily Actions',
        description: 'Master habits, routines, and consistent actions.',
        steps: [
          { id: 'a1-u5-bridge', title: 'Unit Context: The Power of Istiqomah', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Why Present Simple is the tense of consistent habits.', goal: 'Thematic awareness.' },
          { id: 'a1-u5-s1', title: 'Grammar: Present Simple', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'S/ES rules and Do/Does.', goal: 'Form sentences correctly.', targetId: 'a1-present-simple' },
          { id: 'a1-u5-s2', title: 'Reading: A Muslim\'s Day', type: 'reading_task', moduleView: AppView.READING, description: 'Routine including prayer times.', goal: 'Sequence actions.', promptContext: 'Read about Ahmad waking up for Fajr and his daily work schedule.' },
          { id: 'a1-u5-s3', title: 'Live: My Typical Morning', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss your morning habits.', goal: 'Use 3rd person singular.', promptContext: 'Tell Lovelya what you and your friend usually do after waking up.' },
        ]
      },
      {
        id: 'a1-u6', unitNumber: 6, title: 'Food & Drink', level: 'A1', grammarFocus: 'Countable/Uncountable', vocabTheme: 'Cafeteria',
        description: 'Master the grammar of portions and substances.',
        steps: [
          { id: 'a1-u6-bridge', title: 'Unit Context: Halalan Thayyiban', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Mindful consumption and the logic of substances.', goal: 'Thematic awareness.' },
          { id: 'a1-u6-s1', title: 'Grammar: Quantifiers', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Some, Any, Much, Many.', goal: 'Differentiate portions.', targetId: 'a2-countable' },
          { id: 'a1-u6-s2', title: 'Reading: Halal Dining', type: 'reading_task', moduleView: AppView.READING, description: 'Menu analysis and healthy choices.', goal: 'Categorize food items.', promptContext: 'Read about choosing healthy and halal options in a global city.' },
          { id: 'a1-u6-s3', title: 'Live: Ordering Food', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Roleplay at a restaurant.', goal: 'Use "Would like" and quantifiers.', promptContext: 'Lovelya is the waitress. Order a halal meal and ask about ingredients.' },
        ]
      },
      {
        id: 'a1-u7', unitNumber: 7, title: 'School & Work', level: 'A1', grammarFocus: 'WH Questions', vocabTheme: 'Occupations',
        description: 'Explore careers and seeking knowledge.',
        steps: [
          { id: 'a1-u7-bridge', title: 'Unit Context: Seeking Knowledge', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Using Wh-questions to explore horizons.', goal: 'Thematic awareness.' },
          { id: 'a1-u7-s1', title: 'Grammar: Asking Questions', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Mastering 5W1H structures.', goal: 'Form 5 correct questions.', targetId: 'a1-wh-questions' },
          { id: 'a1-u7-s2', title: 'Listening: Office Introduction', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Meeting new colleagues.', goal: 'Identify job titles.', promptContext: 'A dialogue where Person A asks Person B about their job and workplace.' },
          { id: 'a1-u7-s3', title: 'Live: Career Interview', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Answer basic job questions.', goal: 'Respond naturally.', promptContext: 'Lovelya asks: What is your dream job? Why do you want it?' },
        ]
      },
      {
        id: 'a1-u8', unitNumber: 8, title: 'Clothes & Fashion', level: 'A1', grammarFocus: 'Demonstratives', vocabTheme: 'Apparel',
        description: 'Describe clothing and practice modesty.',
        steps: [
          { id: 'a1-u8-bridge', title: 'Unit Context: Modesty & Identity', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Pointing to objects and expressing style.', goal: 'Thematic awareness.' },
          { id: 'a1-u8-s1', title: 'Grammar: This, That, These', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Distance and quantity in objects.', goal: 'Select correctly.', targetId: 'a1-demonstratives' },
          { id: 'a1-u8-s2', title: 'Listening: Choosing Eid Clothes', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Describing colors and styles.', goal: 'Match items to descriptions.', promptContext: 'A parent and child discussing which clothes to buy for the holiday.' },
          { id: 'a1-u8-s3', title: 'Live: Describing My Outfit', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Talk about what you are wearing.', goal: 'Use demonstratives accurately.', promptContext: 'Tell Lovelya about your favorite modest outfit and its color.' },
        ]
      },
      {
        id: 'a1-u9', unitNumber: 9, title: 'Hobbies & Sports', level: 'A1', grammarFocus: 'Can / Can\'t', vocabTheme: 'Leisure',
        description: 'Discuss talents, skills, and physical potential.',
        steps: [
          { id: 'a1-u9-bridge', title: 'Unit Context: Developing Potential', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Expressing abilities through "Can".', goal: 'Thematic awareness.' },
          { id: 'a1-u9-s1', title: 'Grammar: Ability Modals', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Stating what is possible.', goal: 'Master Can/Can\'t.', targetId: 'a1-modals-can' },
          { id: 'a1-u9-s2', title: 'Reading: Sunnah Sports', type: 'reading_task', moduleView: AppView.READING, description: 'Archery, swimming, and more.', goal: 'Identify benefits.', promptContext: 'Read about the importance of physical fitness in Islamic tradition.' },
          { id: 'a1-u9-s3', title: 'Live: Talent Show', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss your hidden skills.', goal: 'Use 5 "Can" sentences.', promptContext: 'Tell Lovelya 3 things you are good at and 2 things you want to learn.' },
        ]
      },
      {
        id: 'a1-u10', unitNumber: 10, title: 'Body & Health', level: 'A1', grammarFocus: 'Have Got', vocabTheme: 'Anatomy',
        description: 'Describe health status and physical traits.',
        steps: [
          { id: 'a1-u10-bridge', title: 'Unit Context: Caring for the Amanah', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Physical status and health responsibility.', goal: 'Thematic awareness.' },
          { id: 'a1-u10-s1', title: 'Reading: At the Doctor', type: 'reading_task', moduleView: AppView.READING, description: 'Explaining symptoms and check-ups.', goal: 'Understand symptoms.', promptContext: 'A young man describing a headache and fever to a clinic nurse.' },
          { id: 'a1-u10-s2', title: 'Listening: Healthy Habits', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Tips for a healthy body.', goal: 'Identify advice.', promptContext: 'A lecture about keeping a clean and healthy lifestyle.' },
          { id: 'a1-u10-s3', title: 'Live: Health Consultation', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Roleplay a health check.', goal: 'Use "Have" for symptoms.', promptContext: 'Tell Lovelya: I have a sore throat. Ask for simple advice.' },
          { id: 'a1-u10-s4', title: 'A1 Final Quiz', type: 'quiz', moduleView: AppView.ASSESSMENT, description: 'Full A1 proficiency check.', goal: 'Unlock A2.', targetId: 'assessment' }
        ]
      }
    ]
  },

  // --- LEVEL A2 (10 UNITS) ---
  {
    level: 'A2',
    units: [
      {
        id: 'a2-u1', unitNumber: 1, title: 'Travel & Holidays', level: 'A2', grammarFocus: 'Past Simple', vocabTheme: 'Vacation',
        description: 'Recount your last trip and booking travel.',
        steps: [
          { id: 'a2-u1-bridge', title: 'Unit Context: Learning from Journeys', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Why Past Simple is essential for memoirs.', goal: 'Thematic awareness.' },
          { id: 'a2-u1-s1', title: 'Grammar: Verb 2 Mastery', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Regular and Irregular forms.', goal: 'Correct past usage.', targetId: 'a2-past-simple' },
          { id: 'a2-u1-s2', title: 'Reading: Trip to Mecca', type: 'reading_task', moduleView: AppView.READING, description: 'A travel memoir of Umrah.', goal: 'Sequence history.', promptContext: 'Read about Musa\'s spiritual journey to the holy cities last Ramadan.' },
          { id: 'a2-u1-s3', title: 'Live: My Last Adventure', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Share a personal story.', goal: 'Speak for 2 mins in past tense.', promptContext: 'Tell Lovelya where you went on your last holiday and what happened.' },
        ]
      },
      {
        id: 'a2-u2', unitNumber: 2, title: 'Shopping & Money', level: 'A2', grammarFocus: 'Comparatives', vocabTheme: 'Prices',
        description: 'Compare items and seek value.',
        steps: [
          { id: 'a2-u2-bridge', title: 'Unit Context: Wise Consumption', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Using comparatives to avoid waste.', goal: 'Thematic awareness.' },
          { id: 'a2-u2-s1', title: 'Grammar: Bigger and Better', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Rules for comparing two things.', goal: 'Form 5 comparatives.', targetId: 'a2-comparatives' },
          { id: 'a2-u2-s2', title: 'Listening: At the Market', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Negotiating prices and quality.', goal: 'Identify best value.', promptContext: 'A man comparing two sets of prayer beads in a traditional market.' },
          { id: 'a2-u2-s3', title: 'Live: Decision Making', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Explain your preferences.', goal: 'Use "Than" correctly.', promptContext: 'Lovelya shows you two phones. Explain which is better for you.' },
        ]
      },
      {
        id: 'a2-u3', unitNumber: 3, title: 'Memories', level: 'A2', grammarFocus: 'Past Continuous', vocabTheme: 'Childhood',
        description: 'Setting a scene and describing past atmospheres.',
        steps: [
          { id: 'a2-u3-bridge', title: 'Unit Context: The Layers of History', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Painting a scene in the past.', goal: 'Thematic awareness.' },
          { id: 'a2-u3-s1', title: 'Grammar: Was/Were -ing', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Interrupted actions logic.', goal: 'Link past events.', targetId: 'a2-past-continuous' },
          { id: 'a2-u3-s2', title: 'Reading: Old Village Stories', type: 'reading_task', moduleView: AppView.READING, description: 'Vivid childhood descriptions.', goal: 'Identify background actions.', promptContext: 'What was happening when the grand storm hit the village?' },
          { id: 'a2-u3-s3', title: 'Live: An Interrupted Day', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe a moment of surprise.', goal: 'Connect two past tenses.', promptContext: 'Tell Lovelya: I was [action] when [event] happened yesterday.' },
        ]
      },
      {
        id: 'a2-u4', unitNumber: 4, title: 'Future Plans', level: 'A2', grammarFocus: 'Going to / Will', vocabTheme: 'Ambitions',
        description: 'Predict the future and state your commitments.',
        steps: [
          { id: 'a2-u4-bridge', title: 'Unit Context: Intentions & Commitment', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Communicating goals with Tawakkal.', goal: 'Thematic awareness.' },
          { id: 'a2-u4-s1', title: 'Grammar: Future Tenses', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Intentions vs Spontaneous decisions.', goal: 'Plan a week.', targetId: 'a2-future' },
          { id: 'a2-u4-s2', title: 'Reading: Success Stories', type: 'reading_task', moduleView: AppView.READING, description: 'Ambitions and long-term plans.', goal: 'Find future intents.', promptContext: 'Read about a student planning to serve their community as a doctor.' },
          { id: 'a2-u4-s3', title: 'Live: Next Ramadan Goals', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss spiritual objectives.', goal: 'Use "Going to" and "InshaAllah".', promptContext: 'Tell Lovelya your plans for the upcoming holy month.' },
        ]
      },
      {
        id: 'a2-u5', unitNumber: 5, title: 'Nature & Weather', level: 'A2', grammarFocus: 'Superlatives', vocabTheme: 'Geography',
        description: 'Describe extremes and the wonders of creation.',
        steps: [
          { id: 'a2-u5-bridge', title: 'Unit Context: Signs of Greatness', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Praising the Wonders of Creation.', goal: 'Thematic awareness.' },
          { id: 'a2-u5-s1', title: 'Grammar: The Best and Biggest', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Comparing groups of 3 or more.', goal: 'Use "The -est".', targetId: 'a2-comparatives' },
          { id: 'a2-u5-s2', title: 'Listening: Extreme Climate News', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Reporting on global geography.', goal: 'Identify locations.', promptContext: 'A report on the hottest desert and the deepest ocean.' },
          { id: 'a2-u5-s3', title: 'Live: Global Wonders', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe a beautiful place.', goal: 'Use 3 superlatives.', promptContext: 'What is the most beautiful place you have ever visited?' },
        ]
      },
      {
        id: 'a2-u6', unitNumber: 6, title: 'Technology', level: 'A2', grammarFocus: 'Present Perfect (Intro)', vocabTheme: 'Internet',
        description: 'Discuss life experiences with modern tools.',
        steps: [
          { id: 'a2-u6-bridge', title: 'Unit Context: The Digital Journey', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Stating experience as a milestone.', goal: 'Thematic awareness.' },
          { id: 'a2-u6-s1', title: 'Grammar: Have you ever?', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Experience without specific time.', goal: 'Identify V3 forms.', targetId: 'a2-present-perfect-intro' },
          { id: 'a2-u6-s2', title: 'Reading: App Reviews', type: 'reading_task', moduleView: AppView.READING, description: 'Feedback on educational gadgets.', goal: 'Find life experiences.', promptContext: 'Read about people sharing their experiences using English apps.' },
          { id: 'a2-u6-s3', title: 'Live: Tech History', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss devices you used.', goal: 'Use "Have + V3".', promptContext: 'Tell Lovelya about 3 gadgets you have used in your life.' },
        ]
      },
      {
        id: 'a2-u7', unitNumber: 7, title: 'Social Life', level: 'A2', grammarFocus: 'Adverbs of Frequency', vocabTheme: 'Invitations',
        description: 'Describe social reputation and consistent habits.',
        steps: [
          { id: 'a2-u7-bridge', title: 'Unit Context: Consistency in Character', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Why frequency defines our social status.', goal: 'Thematic awareness.' },
          { id: 'a2-u7-s1', title: 'Grammar: Always to Never', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Correct position of frequency words.', goal: 'Build daily profiles.', targetId: 'a2-adverbs-freq' },
          { id: 'a2-u7-s2', title: 'Reading: Etiquette (Adab)', type: 'reading_task', moduleView: AppView.READING, description: 'Social manners in various cultures.', goal: 'Identify habits.', promptContext: 'Read about always being polite and never ignoring a neighbor.' },
          { id: 'a2-u7-s3', title: 'Live: My Weekly Habits', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe your social routine.', goal: 'Use "Usually" and "Seldom".', promptContext: 'Lovelya asks: How often do you participate in community events?' },
        ]
      },
      {
        id: 'a2-u8', unitNumber: 8, title: 'Housing', level: 'A2', grammarFocus: 'Modals for Advice', vocabTheme: 'Real Estate',
        description: 'Give guidance and enforce home rules.',
        steps: [
          { id: 'a2-u8-bridge', title: 'Unit Context: Guidance & Obligations', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Suggesting and enforcing rules at home.', goal: 'Thematic awareness.' },
          { id: 'a2-u8-s1', title: 'Grammar: Should and Must', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Soft advice vs Hard obligation.', goal: 'Give 3 useful tips.', targetId: 'a2-modals' },
          { id: 'a2-u8-s2', title: 'Listening: Moving House', type: 'listening_task', moduleView: AppView.LISTENING, description: 'A landlord-tenant dialogue.', goal: 'Identify house rules.', promptContext: 'Listen to a landlord telling a new tenant what they must not do.' },
          { id: 'a2-u8-s3', title: 'Live: Expert Guide', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Advise a traveler.', goal: 'Use Should/Must correctly.', promptContext: 'Give Lovelya advice for someone moving to your city for the first time.' },
        ]
      },
      {
        id: 'a2-u9', unitNumber: 9, title: 'Transport', level: 'A2', grammarFocus: 'Movement & Imperatives', vocabTheme: 'Navigation',
        description: 'Guide others and explain directions clearly.',
        steps: [
          { id: 'a2-u9-bridge', title: 'Unit Context: Guiding Others', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Clear and helpful instructions as Adab.', goal: 'Thematic awareness.' },
          { id: 'a2-u9-s1', title: 'Grammar: Direction Prepositions', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Into, Across, Past, and Through.', goal: 'Map navigation.', targetId: 'a2-movement' },
          { id: 'a2-u9-s2', title: 'Listening: Lost in the City', type: 'listening_task', moduleView: AppView.LISTENING, description: 'A tourist seeking the mosque.', goal: 'Draw a mental map.', promptContext: 'Listen to a local giving directions to the central library.' },
          { id: 'a2-u9-s3', title: 'Live: Virtual Guide', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Give precise instructions.', goal: 'Use 5 movement prepositions.', promptContext: 'Tell Lovelya how to get from the airport to the city center.' },
        ]
      },
      {
        id: 'a2-u10', unitNumber: 10, title: 'Life Events', level: 'A2', grammarFocus: 'Mixed Past Tenses', vocabTheme: 'Ceremonies',
        description: 'Connect moments and atmospheres in history.',
        steps: [
          { id: 'a2-u10-bridge', title: 'Unit Context: Celebrating Milestones', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Atmospheres vs Actions in history.', goal: 'Thematic awareness.' },
          { id: 'a2-u10-s1', title: 'Reading: Historical Hijra', type: 'reading_task', moduleView: AppView.READING, description: 'A story of migration.', goal: 'Sequence events.', promptContext: 'Read about the Prophet PBUH moving to Medina using mixed tenses.' },
          { id: 'a2-u10-s2', title: 'Listening: A Grand Wedding', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Family gathering details.', goal: 'Summarize events.', promptContext: 'A person describing a beautiful traditional wedding they attended.' },
          { id: 'a2-u10-s3', title: 'Live: My Milestone', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe a big event in your life.', goal: 'Use Simple and Continuous past.', promptContext: 'Tell Lovelya about a day you will never forget.' },
          { id: 'a2-u10-s4', title: 'A2 Review Assessment', type: 'quiz', moduleView: AppView.ASSESSMENT, description: 'Comprehensive elementary check.', goal: 'Ready for B1.', targetId: 'assessment' }
        ]
      }
    ]
  },

  // --- LEVEL B1 (10 UNITS) ---
  {
    level: 'B1',
    units: [
      {
        id: 'b1-u1', unitNumber: 1, title: 'Life Experiences', level: 'B1', grammarFocus: 'Present Perfect Simple', vocabTheme: 'Milestones',
        description: 'Discuss past achievements and their impact on your current life.',
        steps: [
          { id: 'b1-u1-bridge', title: 'Unit Context: Impact of Experience', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Why results matter more than time.', goal: 'Thematic awareness.' },
          { id: 'b1-u1-s1', title: 'Grammar: Results and Status', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Experience vs Time specificity.', goal: 'Master V3 forms.', targetId: 'b1-present-perfect-simple' },
          { id: 'b1-u1-s2', title: 'Reading: A Scholar\'s Journey', type: 'reading_task', moduleView: AppView.READING, description: 'Reflective biography.', goal: 'Analyze achievements.', promptContext: 'Read about a modern scholar\'s contributions to science and faith.' },
          { id: 'b1-u1-s3', title: 'Live: My Journey So Far', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Share your life milestones.', goal: 'Use 5 Present Perfect sentences.', promptContext: 'What have you achieved in your English studies so far?' },
        ]
      },
      {
        id: 'b1-u2', unitNumber: 2, title: 'Sustainable Habits', level: 'B1', grammarFocus: 'Present Perfect Continuous', vocabTheme: 'Environment',
        description: 'Focus on ongoing efforts and consistent struggles.',
        steps: [
          { id: 'b1-u2-bridge', title: 'Unit Context: Consistent Struggle', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'The value of continuous ethical effort.', goal: 'Thematic awareness.' },
          { id: 'b1-u2-s1', title: 'Grammar: Ongoing Processes', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Duration focus with -ing.', goal: 'Master "Have been -ing".', targetId: 'b1-present-perfect-continuous' },
          { id: 'b1-u2-s2', title: 'Listening: Green Initiatives', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Environmental project updates.', goal: 'Identify durations.', promptContext: 'A speaker talking about how long they have been building wells.' },
          { id: 'b1-u2-s3', title: 'Live: Ongoing Dedication', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Talk about your recent habits.', goal: 'Use 3 Present Perfect Continuous phrases.', promptContext: 'Tell Lovelya what you have been doing to improve your character lately.' },
        ]
      },
      {
        id: 'b1-u3', unitNumber: 3, title: 'Objectivity & Systems', level: 'B1', grammarFocus: 'Passive Voice', vocabTheme: 'Management',
        description: 'Speak objectively about processes and systems.',
        steps: [
          { id: 'b1-u3-bridge', title: 'Unit Context: Objective Truths', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Adab of objectivity in professional contexts.', goal: 'Thematic awareness.' },
          { id: 'b1-u3-s1', title: 'Grammar: The Passive System', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Focus on the object/action.', goal: 'Form 10 passive sentences.', targetId: 'b1-passive-voice' },
          { id: 'b1-u3-s2', title: 'Reading: Mosque Architecture', type: 'reading_task', moduleView: AppView.READING, description: 'Historical construction process.', goal: 'Catch passive details.', promptContext: 'Read about how the Great Mosque was built and maintained over centuries.' },
          { id: 'b1-u3-s3', title: 'Live: Process Explanation', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe how something is made.', goal: 'Avoid using "I" or "We".', promptContext: 'Explain to Lovelya how a traditional meal is prepared in your country.' },
        ]
      },
      {
        id: 'b1-u4', unitNumber: 4, title: 'Cause & Effect', level: 'B1', grammarFocus: 'Zero/First Conditionals', vocabTheme: 'Logic',
        description: 'Express natural laws and likely future results.',
        steps: [
          { id: 'b1-u4-bridge', title: 'Unit Context: Universal Laws', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Logical thinking and Sunnatullah.', goal: 'Thematic awareness.' },
          { id: 'b1-u4-s1', title: 'Grammar: If-Clause Logic', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Real possibilities and facts.', goal: 'Predict outcomes.', targetId: 'b1-conditionals' },
          { id: 'b1-u4-s2', title: 'Reading: Advice for Youth', type: 'reading_task', moduleView: AppView.READING, description: 'Conditional moral guidance.', goal: 'Find cause/effect links.', promptContext: 'Read a letter from an elder giving conditional advice on life.' },
          { id: 'b1-u4-s3', title: 'Live: Scenario Planning', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss future possibilities.', goal: 'Use 3 First Conditionals.', promptContext: 'Lovelya asks: If you win a scholarship, where will you go?' },
        ]
      },
      {
        id: 'b1-u5', unitNumber: 5, title: 'Defining Identity', level: 'B1', grammarFocus: 'Relative Clauses', vocabTheme: 'Social Context',
        description: 'Give precise information about people and things.',
        steps: [
          { id: 'b1-u5-bridge', title: 'Unit Context: Precision in Identity', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'The adab of clear and specific details.', goal: 'Thematic awareness.' },
          { id: 'b1-u5-s1', title: 'Grammar: Connecting Info', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Who, Which, That, Whose.', goal: 'Link 2 ideas into one.', targetId: 'b1-relative-clauses' },
          { id: 'b1-u5-s2', title: 'Reading: Role Models', type: 'reading_task', moduleView: AppView.READING, description: 'Biographies of Sahabah.', goal: 'Analyze complex identities.', promptContext: 'Read about the man who stood by the truth in difficult times.' },
          { id: 'b1-u5-s3', title: 'Live: People in My Life', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe influential people.', goal: 'Use "Whose" and "Who".', promptContext: 'Tell Lovelya about a person who has inspired you the most.' },
        ]
      },
      {
        id: 'b1-u6', unitNumber: 6, title: 'Smart Speculation', level: 'B1', grammarFocus: 'Modals of Deduction', vocabTheme: 'Problem Solving',
        description: 'Make logical guesses based on evidence.',
        steps: [
          { id: 'b1-u6-bridge', title: 'Unit Context: Cautious Analysis', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Verification (Tabayyun) through logic.', goal: 'Thematic awareness.' },
          { id: 'b1-u6-s1', title: 'Grammar: Logical Guesses', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Must, Might, Can\'t.', goal: 'Deduce present situations.', targetId: 'b1-modals-deduction' },
          { id: 'b1-u6-s2', title: 'Listening: The Missing Key', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Detective-style investigation.', goal: 'Draw logical conclusions.', promptContext: 'Listen to two people speculating where their friend could be.' },
          { id: 'b1-u6-s3', title: 'Live: Solving the Mystery', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Speculate on a given scenario.', goal: 'Use "Must" and "Might".', promptContext: 'Lovelya presents a mystery: The lights are on, but the door is locked. Why?' },
        ]
      },
      {
        id: 'b1-u7', unitNumber: 7, title: 'Evolving Identities', level: 'B1', grammarFocus: 'Used to', vocabTheme: 'Growth',
        description: 'Reflect on transformation and past habits.',
        steps: [
          { id: 'b1-u7-bridge', title: 'Unit Context: Transformation', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Reflecting on growth and Hijrah.', goal: 'Thematic awareness.' },
          { id: 'b1-u7-s1', title: 'Grammar: Past Habits', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Former states vs current reality.', goal: 'Contrast past vs now.', targetId: 'b1-used-to' },
          { id: 'b1-u7-s2', title: 'Reading: From Waste to Wisdom', type: 'reading_task', moduleView: AppView.READING, description: 'A story of life change.', goal: 'Identify old routines.', promptContext: 'Read about a man who used to waste time but now serves others.' },
          { id: 'b1-u7-s3', title: 'Live: My Childhood Habits', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss your village life.', goal: 'Use 4 "Used to" phrases.', promptContext: 'Tell Lovelya what you used to do before you started working/studying.' },
        ]
      },
      {
        id: 'b1-u8', unitNumber: 8, title: 'Future Commitments', level: 'B1', grammarFocus: 'Present Continuous Future', vocabTheme: 'Scheduling',
        description: 'Discuss fixed arrangements and confirmed promises.',
        steps: [
          { id: 'b1-u8-bridge', title: 'Unit Context: Honoring Commitments', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Absolute certainty in social promises.', goal: 'Thematic awareness.' },
          { id: 'b1-u8-s1', title: 'Grammar: Confirmed Future', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Fixed arrangements logic.', goal: 'Schedule a weekly plan.', targetId: 'b1-future-arrangements' },
          { id: 'b1-u8-s2', title: 'Listening: Planning Eid', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Booking and confirmation details.', goal: 'Capture dates/times.', promptContext: 'Listen to a family organizing an Eid gathering with specific bookings.' },
          { id: 'b1-u8-s3', title: 'Live: Confirming the Trip', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Roleplay travel arrangements.', goal: 'Use the -ing future form.', promptContext: 'Lovelya asks: When are you leaving? Who are you meeting?' },
        ]
      },
      {
        id: 'b1-u9', unitNumber: 9, title: 'Power of Sufficiency', level: 'B1', grammarFocus: 'Advanced Quantifiers', vocabTheme: 'Values',
        description: 'Express precise amounts with gratitude.',
        steps: [
          { id: 'b1-u9-bridge', title: 'Unit Context: Contentment (Qanaah)', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Describing resources with a grateful heart.', goal: 'Thematic awareness.' },
          { id: 'b1-u9-s1', title: 'Grammar: Precision Amounts', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Few, Little, Plenty, Enough.', goal: 'Master quantifier nuances.', targetId: 'b1-quantifiers' },
          { id: 'b1-u9-s2', title: 'Reading: The Simple Life', type: 'reading_task', moduleView: AppView.READING, description: 'Minimalism and spirituality.', goal: 'Analyze resource words.', promptContext: 'Read about the Sahabah who had little but gave plenty.' },
          { id: 'b1-u9-s3', title: 'Live: Sharing Resources', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss community needs.', goal: 'Use "A few" vs "Few" correctly.', promptContext: 'Lovelya asks: Do you have enough time to help others this week?' },
        ]
      },
      {
        id: 'b1-u10', unitNumber: 10, title: 'Intentions & Activities', level: 'B1', grammarFocus: 'Gerunds/Infinitives', vocabTheme: 'Lifestyle',
        description: 'Balance passions and goals with correct patterns.',
        steps: [
          { id: 'b1-u10-bridge', title: 'Unit Context: Roots of Action', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Verb patterns and intentionality.', goal: 'Thematic awareness.' },
          { id: 'b1-u10-s1', title: 'Grammar: Verb Patterns 1', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'To vs -ing pairs.', goal: 'Identify 20 pairs.', targetId: 'b1-gerunds-infinitives' },
          { id: 'b1-u10-s2', title: 'Listening: Career Advice', type: 'listening_task', moduleView: AppView.LISTENING, description: 'A mentor-student talk.', goal: 'Capture goals vs enjoyments.', promptContext: 'Listen to a mentor talking about wanting to help and enjoying teaching.' },
          { id: 'b1-u10-s3', title: 'Live: Life Intentions', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss your future aims.', goal: 'Use 5 different verb patterns.', promptContext: 'Tell Lovelya: I hope to..., but I enjoy... ing.' },
          { id: 'b1-u10-s4', title: 'B1 Assessment Review', type: 'quiz', moduleView: AppView.ASSESSMENT, description: 'Comprehensive B1 check.', goal: 'Unlock B2.', targetId: 'assessment' }
        ]
      }
    ]
  },

  // --- LEVEL B2 (10 UNITS) ---
  {
    level: 'B2',
    units: [
      {
        id: 'b2-u1', unitNumber: 1, title: 'Strategic Narratives', level: 'B2', grammarFocus: 'Narrative Tenses', vocabTheme: 'History',
        description: 'Master storytelling with layered past tenses.',
        steps: [
          { id: 'b2-u1-bridge', title: 'Unit Context: Historical Wisdom', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Building engaging and authentic accounts.', goal: 'Thematic awareness.' },
          { id: 'b2-u1-s1', title: 'Grammar: Tense Layering', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Simple, Cont, Perfect combo.', goal: 'Sequence 3 tenses.', targetId: 'b2-narrative-tenses' },
          { id: 'b2-u1-s2', title: 'Reading: Seerah Chapters', type: 'reading_task', moduleView: AppView.READING, description: 'In-depth historical narrative.', goal: 'Analyze complexity.', promptContext: 'Read about the Prophet\'s entry into Mecca after years of exile.' },
          { id: 'b2-u1-s3', title: 'Live: My Life Turning Point', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Tell a detailed past story.', goal: 'Use Past Perfect correctly.', promptContext: 'Tell Lovelya about a day that changed your perspective on life.' },
        ]
      },
      {
        id: 'b2-u2', unitNumber: 2, title: 'Evaluative Thinking', level: 'B2', grammarFocus: 'Mixed Conditionals', vocabTheme: 'Ethics',
        description: 'Connect past decisions with current reality.',
        steps: [
          { id: 'b2-u2-bridge', title: 'Unit Context: Logical Evaluation', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Analyzing the ripple effect of choices.', goal: 'Thematic awareness.' },
          { id: 'b2-u2-s1', title: 'Grammar: Mixed Logic', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Cross-time results.', goal: 'Form 5 mixed types.', targetId: 'b2-mixed-conditionals' },
          { id: 'b2-u2-s2', title: 'Reading: If History Were Different', type: 'reading_task', moduleView: AppView.READING, description: 'Alternative history analysis.', goal: 'Evaluate results.', promptContext: 'Read an essay about if certain scholars hadn\'t moved to other lands.' },
          { id: 'b2-u2-s3', title: 'Live: Regret vs Lesson', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Reflect on your life path.', goal: 'Explain: If I hadn\'t..., I wouldn\'t be...', promptContext: 'Lovelya asks: How did your past choices shape your present self?' },
        ]
      },
      {
        id: 'b2-u3', unitNumber: 3, title: 'Public Discourse', level: 'B2', grammarFocus: 'Advanced Passive', vocabTheme: 'Media',
        description: 'Deliver news with professional objectivity.',
        steps: [
          { id: 'b2-u3-bridge', title: 'Unit Context: Media Ethics', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Maintaining distance in reporting.', goal: 'Thematic awareness.' },
          { id: 'b2-u3-s1', title: 'Grammar: Formal Reporting', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'It is said that... He is thought to be...', goal: 'Use impersonal forms.', targetId: 'b2-advanced-passive' },
          { id: 'b2-u3-s2', title: 'Listening: Global News', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Developments in Islamic finance.', goal: 'Identify objective sources.', promptContext: 'Listen to a news bulletin about the growth of ethical banking.' },
          { id: 'b2-u3-s3', title: 'Live: Reporting the Change', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Roleplay a news reporter.', goal: 'Use 3 impersonal passive phrases.', promptContext: 'Report to Lovelya about a positive change in your neighborhood.' },
        ]
      },
      {
        id: 'b2-u4', unitNumber: 4, title: 'Visionary Projections', level: 'B2', grammarFocus: 'Future Perfect', vocabTheme: 'Ambition',
        description: 'Project future milestones and achievements.',
        steps: [
          { id: 'b2-u4-bridge', title: 'Unit Context: Future Milestones', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Visualizing long-term impact.', goal: 'Thematic awareness.' },
          { id: 'b2-u4-s1', title: 'Grammar: Future Target', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Will have / Will be -ing.', goal: 'Project career path.', targetId: 'b2-future-forms' },
          { id: 'b2-u4-s2', title: 'Reading: Visi 2045', type: 'reading_task', moduleView: AppView.READING, description: 'National and global projections.', goal: 'Identify deadlines.', promptContext: 'Read a vision statement about education in the next 20 years.' },
          { id: 'b2-u4-s3', title: 'Live: 2030 Roadmap', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Share your personal vision.', goal: 'Use "Will have done" correctly.', promptContext: 'Lovelya asks: What major goals will you have reached by 2030?' },
        ]
      },
      {
        id: 'b2-u5', unitNumber: 5, title: 'Reflective Desires', level: 'B2', grammarFocus: 'Wishes/Regrets', vocabTheme: 'Psychology',
        description: 'Express profound wishes and past reflections.',
        steps: [
          { id: 'b2-u5-bridge', title: 'Unit Context: Path of Repentance', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Processing "If Only" through growth.', goal: 'Thematic awareness.' },
          { id: 'b2-u5-s1', title: 'Grammar: Desire Structures', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Wish / If only logic.', goal: 'Contrast now vs past.', targetId: 'b2-wish-regrets' },
          { id: 'b2-u5-s2', title: 'Reading: Letter to Myself', type: 'reading_task', moduleView: AppView.READING, description: 'Poetic reflections.', goal: 'Understand emotional nuances.', promptContext: 'Read a story about a person writing a letter to their younger self.' },
          { id: 'b2-u5-s3', title: 'Live: Healing Reflections', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss missed opportunities.', goal: 'Use "I wish I had" correctly.', promptContext: 'Talk to Lovelya about something you would change in your past.' },
        ]
      },
      {
        id: 'b2-u6', unitNumber: 6, title: 'Enriched Facts', level: 'B2', grammarFocus: 'Non-Defining Relative Clauses', vocabTheme: 'Journalism',
        description: 'Add rich descriptive layers to your reports.',
        steps: [
          { id: 'b2-u6-bridge', title: 'Unit Context: Enrichment of Facts', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Depth without cluttering the message.', goal: 'Thematic awareness.' },
          { id: 'b2-u6-s1', title: 'Grammar: Extra Info Clauses', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Mastering the comma logic.', goal: 'Insert 5 descriptors.', targetId: 'b2-relative-clauses' },
          { id: 'b2-u6-s2', title: 'Reading: World Heritage', type: 'reading_task', moduleView: AppView.READING, description: 'Islamic heritage sites.', goal: 'Identify extra facts.', promptContext: 'Read about the Alhambra, which was built during the Nasrid dynasty.' },
          { id: 'b2-u6-s3', title: 'Live: Local Landmarks', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Describe your hometown.', goal: 'Use 3 non-defining clauses.', promptContext: 'Lovelya asks: Can you tell me about the oldest building in your city?' },
        ]
      },
      {
        id: 'b2-u7', unitNumber: 7, title: 'Past Investigations', level: 'B2', grammarFocus: 'Past Modals Deduction', vocabTheme: 'Forensics',
        description: 'Hypothesize about history with high accuracy.',
        steps: [
          { id: 'b2-u7-bridge', title: 'Unit Context: Logic & Honor', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Safeguarding character when speculating.', goal: 'Thematic awareness.' },
          { id: 'b2-u7-s1', title: 'Grammar: Past Deduction', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Must have / Might have been.', goal: 'Solve 5 mystery scenarios.', targetId: 'b2-modals-past' },
          { id: 'b2-u7-s2', title: 'Listening: The Silent Artifact', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Museum mystery.', goal: 'Draw logical conclusions.', promptContext: 'Listen to archivists speculating how an old manuscript survived.' },
          { id: 'b2-u7-s3', title: 'Live: Historical Inquiry', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Debate a mystery.', goal: 'Use 4 past modals.', promptContext: 'Lovelya asks: Someone entered the library at night. How could they have?' },
        ]
      },
      {
        id: 'b2-u8', unitNumber: 8, title: 'Delegation & Services', level: 'B2', grammarFocus: 'Causatives', vocabTheme: 'Outsourcing',
        description: 'Coordinate services professionally.',
        steps: [
          { id: 'b2-u8-bridge', title: 'Unit Context: Collaborative Success', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Adab of service and delegating.', goal: 'Thematic awareness.' },
          { id: 'b2-u8-s1', title: 'Grammar: Have & Get', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Causing action logic.', goal: 'Managerial talk mastery.', targetId: 'b2-causatives' },
          { id: 'b2-u8-s2', title: 'Reading: Modern Management', type: 'reading_task', moduleView: AppView.READING, description: 'Effective leadership esays.', goal: 'Identify delegation patterns.', promptContext: 'Read about how a leader had the team redesign the whole system.' },
          { id: 'b2-u8-s3', title: 'Live: Team Leader Roleplay', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Delegate 3 complex tasks.', goal: 'Use causative structures.', promptContext: 'Tell Lovelya: I will have the printer fixed, then I will get Ali to help.' },
        ]
      },
      {
        id: 'b2-u9', unitNumber: 9, title: 'Intention Meanings', level: 'B2', grammarFocus: 'Gerunds/Infinitives (Nuance)', vocabTheme: 'Integrity',
        description: 'Differentiate subtle shifts in your promises.',
        steps: [
          { id: 'b2-u9-bridge', title: 'Unit Context: Meaning in Nuance', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Small shifts, major spirit changes.', goal: 'Thematic awareness.' },
          { id: 'b2-u9-s1', title: 'Grammar: Stop vs Remember', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Changing meanings based on -ing/to.', goal: 'Fix 10 mistakes.', targetId: 'b2-gerunds-nuance' },
          { id: 'b2-u9-s2', title: 'Reading: Intentional Living', type: 'reading_task', moduleView: AppView.READING, description: 'Mindfulness and commitments.', goal: 'Differentiate meanings.', promptContext: 'Read about a man who forgot to pray vs forgot praying.' },
          { id: 'b2-u9-s3', title: 'Live: Clarifying Intent', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Explain your actions.', goal: 'Use "Remember to" and "Stop -ing".', promptContext: 'Explain to Lovelya why you stopped a certain habit recently.' },
        ]
      },
      {
        id: 'b2-u10', unitNumber: 10, title: 'Indirect Diplomacy', level: 'B2', grammarFocus: 'Reported Speech', vocabTheme: 'Communication',
        description: 'Convey messages with perfect integrity.',
        steps: [
          { id: 'b2-u10-bridge', title: 'Unit Context: Faithful Transmission', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Tabligh (conveying) in social nets.', goal: 'Thematic awareness.' },
          { id: 'b2-u10-s1', title: 'Grammar: Message Transfer', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Backshift and reporting verbs.', goal: 'Rewrite 10 quotes.', targetId: 'b2-reported-speech' },
          { id: 'b2-u10-s2', title: 'Listening: The Scholar\'s Advice', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Recording of a speech.', goal: 'Report the core message.', promptContext: 'Listen to a speech and then report what the speaker said to Lovelya.' },
          { id: 'b2-u10-s3', title: 'Live: Reporting a Meeting', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Tell Lovelya about a talk.', goal: 'Use 3 different reporting verbs.', promptContext: 'Lovelya asks: What did your teacher tell you about the last exam?' },
          { id: 'b2-u10-s4', title: 'B2 Final Mastery', type: 'quiz', moduleView: AppView.ASSESSMENT, description: 'Comprehensive upper-inter check.', goal: 'Unlock C1.', targetId: 'assessment' }
        ]
      }
    ]
  },

  // --- LEVEL C1 (10 UNITS) ---
  {
    level: 'C1',
    units: [
      {
        id: 'c1-u1', unitNumber: 1, title: 'Comprehensive Character', level: 'C1', grammarFocus: 'Stylistic Inversion', vocabTheme: 'Excellence',
        description: 'Use advanced rhetoric to highlight moral excellence.',
        steps: [
          { id: 'c1-u1-bridge', title: 'Unit Context: Integrating Excellence', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'The power of emphasis in discourse.', goal: 'Thematic awareness.' },
          { id: 'c1-u1-s1', title: 'Grammar: Advanced Inversion', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Rarely have I seen... logic.', goal: 'Master rhetorical power.', targetId: 'c1-inversion' },
          { id: 'c1-u1-s2', title: 'Reading: Philosophies of Virtue', type: 'reading_task', moduleView: AppView.READING, description: 'Dense text on character.', goal: 'Map emphasis points.', promptContext: 'Read a profound essay about the rarity of true integrity in modern times.' },
          { id: 'c1-u1-s3', title: 'Live: Eloquent Speech', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Speak with authority.', goal: 'Use 3 inversions.', promptContext: 'Give a 2-minute speech to Lovelya about why education is vital.' },
        ]
      },
      {
        id: 'c1-u2', unitNumber: 2, title: 'Historical Impact', level: 'C1', grammarFocus: 'Mixed Conditionals', vocabTheme: 'Legacy',
        description: 'Evaluate the impact of historical turning points.',
        steps: [
          { id: 'c1-u2-bridge', title: 'Unit Context: Turning Points', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Connecting past causes to today.', goal: 'Thematic awareness.' },
          { id: 'c1-u2-s1', title: 'Grammar: Mixed Ifs', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Complex cross-time scenarios.', goal: 'Evaluate 10 scenarios.', targetId: 'c1-mixed-conditionals' },
          { id: 'c1-u2-s2', title: 'Reading: Analyzing Manuscripts', type: 'reading_task', moduleView: AppView.READING, description: 'Civilizational analysis.', goal: 'Find cause/effect ripple.', promptContext: 'If certain libraries hadn\'t been lost, what would be different today?' },
          { id: 'c1-u2-s3', title: 'Live: Strategic Speculation', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Discuss world events.', goal: 'Use 4 mixed conditional types.', promptContext: 'Lovelya asks: If we had started this project earlier, where would we be?' },
        ]
      },
      {
        id: 'c1-u3', unitNumber: 3, title: 'Academic Discourse', level: 'C1', grammarFocus: 'Participle Clauses', vocabTheme: 'Ethics',
        description: 'Increase lexical density for scholarly success.',
        steps: [
          { id: 'c1-u3-bridge', title: 'Unit Context: Elegant Conciseness', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Streamlining complex ideas.', goal: 'Thematic awareness.' },
          { id: 'c1-u3-s1', title: 'Grammar: Reducing Clauses', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'V-ing and V3 starts.', goal: 'Rewrite 10 long sentences.', targetId: 'c1-participle-clauses' },
          { id: 'c1-u3-s2', title: 'Listening: Research Path', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Academic journal review.', goal: 'Summarize compactly.', promptContext: 'Listen to a researcher explaining their data analysis results.' },
          { id: 'c1-u3-s3', title: 'Live: Abstract Summary', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Explain a book concisely.', goal: 'Use 5 participle clauses.', promptContext: 'Lovelya asks: "Having read your last book, what was the main conclusion?"' },
        ]
      },
      {
        id: 'c1-u4', unitNumber: 4, title: 'Precision & Focus', level: 'C1', grammarFocus: 'Cleft Sentences', vocabTheme: 'Clarity',
        description: 'Ensure vital points are never unnoticed.',
        steps: [
          { id: 'c1-u4-bridge', title: 'Unit Context: Centered Focus', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Highlighting truth through partitioning.', goal: 'Thematic awareness.' },
          { id: 'c1-u4-s1', title: 'Grammar: Spotlight Structures', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'It is... that / What... is.', goal: 'Redirect focus in 10 items.', targetId: 'c1-cleft-sentences' },
          { id: 'c1-u4-s2', title: 'Reading: The Heart of the Matter', type: 'reading_task', moduleView: AppView.READING, description: 'Argumentative essay.', goal: 'Identify main clefts.', promptContext: 'Read a text that clarifies misconceptions about Islamic science.' },
          { id: 'c1-u4-s3', title: 'Live: Persuasive Argument', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Clarify a point to a crowd.', goal: 'Use 2 It-clefts and 2 Wh-clefts.', promptContext: 'Lovelya challenges a viewpoint. Respond with focus: "What I mean is..."' },
        ]
      },
      {
        id: 'c1-u5', unitNumber: 5, title: 'Long-term Dedication', level: 'C1', grammarFocus: 'Future Perfect Continuous', vocabTheme: 'Consistency',
        description: 'Reflect on the power of accumulated effort.',
        steps: [
          { id: 'c1-u5-bridge', title: 'Unit Context: Accumulated Struggle', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Effort as a mountain of milestones.', goal: 'Thematic awareness.' },
          { id: 'c1-u5-s1', title: 'Grammar: Counting the For', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Will have been -ing projections.', goal: 'Project duration accurately.', targetId: 'c1-future-perfect-continuous' },
          { id: 'c1-u5-s2', title: 'Reading: Life of a Sage', type: 'reading_task', moduleView: AppView.READING, description: 'Biographical milestones.', goal: 'Sequence time accumulation.', promptContext: 'Read about a sage who will have been serving for 50 years next year.' },
          { id: 'c1-u5-s3', title: 'Live: Visualizing Legacy', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Future legacy manifesto.', goal: 'Use Future Perfect Continuous.', promptContext: 'Tell Lovelya: "By the time I retire, I will have been...ing."' },
        ]
      },
      {
        id: 'c1-u6', unitNumber: 6, title: 'Conceptual Integrity', level: 'C1', grammarFocus: 'Nominalization', vocabTheme: 'Leadership',
        description: 'Speak in stable concepts rather than fluid actions.',
        steps: [
          { id: 'c1-u6-bridge', title: 'Unit Context: Conceptual Power', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Turning actions into stable principles.', goal: 'Thematic awareness.' },
          { id: 'c1-u6-s1', title: 'Grammar: Abstract Writing', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Verb to Concept transformation.', goal: 'Build formal abstracts.', targetId: 'c1-nominalization' },
          { id: 'c1-u6-s2', title: 'Listening: Board Meeting', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Formal organizational talk.', goal: 'Identify 10 concepts.', promptContext: 'Listen to a manager discussing the implementation of character goals.' },
          { id: 'c1-u6-s3', title: 'Live: Policy Defense', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Address a formal council.', goal: 'Avoid using basic verbs.', promptContext: 'Lovelya asks: "How will your plan improve the development of the city?"' },
        ]
      },
      {
        id: 'c1-u7', unitNumber: 7, title: 'Efficient Eloquence', level: 'C1', grammarFocus: 'Ellipsis/Substitution', vocabTheme: 'Wit',
        description: 'Sound like a native master with brevity.',
        steps: [
          { id: 'c1-u7-bridge', title: 'Unit Context: Wit and Brevity', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Saying more with less as Adab.', goal: 'Thematic awareness.' },
          { id: 'c1-u7-s1', title: 'Grammar: Ghost Words', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Removal and substitution logic.', goal: 'Create sleek flow.', targetId: 'c1-ellipsis-substitution' },
          { id: 'c1-u7-s2', title: 'Listening: Rapid Debate', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Agile fast-paced talk.', goal: 'Identify missing words.', promptContext: 'Listen to a fast dialogue where speakers skip redundant words.' },
          { id: 'c1-u7-s3', title: 'Live: Concise Defense', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Quick-fire answers.', goal: 'Avoid repetitions.', promptContext: 'Answer Lovelya\'s questions using "I think so", "I hope not", etc.' },
        ]
      },
      {
        id: 'c1-u8', unitNumber: 8, title: 'Analytical Speculation', level: 'C1', grammarFocus: 'Advanced Modals', vocabTheme: 'Inquiry',
        description: 'Investigate history with high-level logic.',
        steps: [
          { id: 'c1-u8-bridge', title: 'Unit Context: The Investigator', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Exploring why and how of mysteries.', goal: 'Thematic awareness.' },
          { id: 'c1-u8-s1', title: 'Grammar: Past Continuous Speculation', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Must have been -ing scenarios.', goal: 'Evaluate 5 mysteries.', targetId: 'c1-advanced-modals' },
          { id: 'c1-u8-s2', title: 'Reading: Lost Manuscripts', type: 'reading_task', moduleView: AppView.READING, description: 'Inquiry into forgotten history.', goal: 'Determine likely actions.', promptContext: 'Read about an archive fire and speculate how it might have been starting.' },
          { id: 'c1-u8-s3', title: 'Live: Forensic Logic', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Debate a crime scene.', goal: 'Use 5 complex modal structures.', promptContext: 'Lovelya presents evidence. Speculate: "They must have been trying to..."' },
        ]
      },
      {
        id: 'c1-u9', unitNumber: 9, title: 'Technical Precision', level: 'C1', grammarFocus: 'Compound Modifiers', vocabTheme: 'Artistry',
        description: 'Add rich technical detail to descriptions.',
        steps: [
          { id: 'c1-u9-bridge', title: 'Unit Context: Sharp Descriptions', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Packaging detail into modifiers.', goal: 'Thematic awareness.' },
          { id: 'c1-u9-s1', title: 'Grammar: Hyphen logic', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Building adjective chains.', goal: 'Master technical writing.', targetId: 'c1-compound-modifiers' },
          { id: 'c1-u9-s2', title: 'Reading: Architectural Review', type: 'reading_task', moduleView: AppView.READING, description: 'Detailed design analysis.', goal: 'Match 10 modifiers.', promptContext: 'Read a review of a world-renowned building with custom-designed features.' },
          { id: 'c1-u9-s3', title: 'Live: Product Pitch', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Pitch an invention.', goal: 'Use 5 compound modifiers.', promptContext: 'Lovelya is an investor. Pitch a "record-breaking, time-saving" device.' },
        ]
      },
      {
        id: 'c1-u10', unitNumber: 10, title: 'Argumentative Navigation', level: 'C1', grammarFocus: 'Academic Markers', vocabTheme: 'Diplomacy',
        description: 'Navigate complex debates with connectors.',
        steps: [
          { id: 'c1-u10-bridge', title: 'Unit Context: Guided Logic', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Leading audiences through complex maps.', goal: 'Thematic awareness.' },
          { id: 'c1-u10-s1', title: 'Grammar: Connectors Master', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Albeit, Hence, Notwithstanding.', goal: 'Transition 10 ideas.', targetId: 'c1-discourse-markers' },
          { id: 'c1-u10-s2', title: 'Reading: Global Ethics', type: 'reading_task', moduleView: AppView.READING, description: 'Dense argumentative text.', goal: 'Identify logical shifts.', promptContext: 'Read a complex argument about ethics in a digital world.' },
          { id: 'c1-u10-s3', title: 'Live: Final Defense', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Defend your thesis.', goal: 'Use 3 formal connectors.', promptContext: 'Lovelya is a judge. Defend your viewpoint on community work.' },
          { id: 'c1-u10-s4', title: 'C1 Proficiency Test', type: 'quiz', moduleView: AppView.ASSESSMENT, description: 'Level final mastery check.', goal: 'Unlock C2.', targetId: 'assessment' }
        ]
      }
    ]
  },

  // --- LEVEL C2 (10 UNITS) ---
  {
    level: 'C2',
    units: [
      {
        id: 'c2-u1', unitNumber: 1, title: 'Mastering Diplomacy', level: 'C2', grammarFocus: 'Subjunctive Mood', vocabTheme: 'Authority',
        description: 'Wield high-level authority and suggestion.',
        steps: [
          { id: 'c2-u1-bridge', title: 'Unit Context: High Diplomacy', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Counsel with the soul of a master.', goal: 'Thematic awareness.' },
          { id: 'c2-u1-s1', title: 'Grammar: The Subjunctive', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Imperative that he be... logic.', goal: 'Formal authority mastery.', targetId: 'c2-subjunctive' },
          { id: 'c2-u1-s2', title: 'Reading: Boardroom Resolves', type: 'reading_task', moduleView: AppView.READING, description: 'High-level meeting minutes.', goal: 'Identify mandative forms.', promptContext: 'Read about the imperative resolves for world peace at a global NGO.' },
          { id: 'c2-u1-s3', title: 'Live: Policy Address', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Address a crowd with authority.', goal: 'Use 3 subjunctive clauses.', promptContext: 'Lovelya is your assistant. Suggest: "It is vital that she inform the team."' },
        ]
      },
      {
        id: 'c2-u2', unitNumber: 2, title: 'Philosophical Rhetoric', level: 'C2', grammarFocus: 'Advanced Inversion', vocabTheme: 'Wisdom',
        description: 'Control emotional waves through structure.',
        steps: [
          { id: 'c2-u2-bridge', title: 'Unit Context: Soul of Rhetoric', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Pinnacle of rhythmic language.', goal: 'Thematic awareness.' },
          { id: 'c2-u2-s1', title: 'Grammar: Master Inversion', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Seldom do we... Never before had...', goal: 'Build dramatic climaxes.', targetId: 'c2-advanced-inversion' },
          { id: 'c2-u2-s2', title: 'Reading: Keynote Wisdom', type: 'reading_task', moduleView: AppView.READING, description: 'Legendary pidato analysis.', goal: 'Analyze emotional impact.', promptContext: 'Read a speech about unity where inversion builds the tension.' },
          { id: 'c2-u2-s3', title: 'Live: Keynote Oratory', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Deliver a moving speech.', goal: 'Invert 4 sentences for drama.', promptContext: 'Tell Lovelya: "Never have I seen such dedication to truth."' },
        ]
      },
      {
        id: 'c2-u3', unitNumber: 3, title: 'Sovereign Focus', level: 'C2', grammarFocus: 'Complex Clefts', vocabTheme: 'Haqq',
        description: 'Declare truths with undeniable structural focus.',
        steps: [
          { id: 'c2-u3-bridge', title: 'Unit Context: Declaring Truth', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Closing debates through partitioning.', goal: 'Thematic awareness.' },
          { id: 'c2-u3-s1', title: 'Grammar: Advanced Clefting', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Reversed Wh-Clefts mastery.', goal: 'Establish absolute focus.', targetId: 'c2-cleft-sentences' },
          { id: 'c2-u3-s2', title: 'Reading: Theological Debates', type: 'reading_task', moduleView: AppView.READING, description: 'Dense scholarly argument.', goal: 'Map focus shifts.', promptContext: 'Read a debate wrap-up where clefts establish the final Haqq.' },
          { id: 'c2-u3-s3', title: 'Live: Final Verdict', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Summarize a complex issue.', goal: 'Establish 3 unnegotiable points.', promptContext: 'Lovelya asks for your final conclusion on ethical education.' },
        ]
      },
      {
        id: 'c2-u4', unitNumber: 4, title: 'Intellectual Density', level: 'C2', grammarFocus: 'Nominalization', vocabTheme: 'Academic Discourse',
        description: 'Construct concepts that command respect.',
        steps: [
          { id: 'c2-u4-bridge', title: 'Unit Context: Dense Wisdom', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Crystallizing actions into principles.', goal: 'Thematic awareness.' },
          { id: 'c2-u4-s1', title: 'Grammar: Lexical Density', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Conceptual clustering patterns.', goal: 'Master abstract formality.', targetId: 'c2-nominalization' },
          { id: 'c2-u4-s2', title: 'Reading: Scientific Abstracts', type: 'reading_task', moduleView: AppView.READING, description: 'High-level psychological journals.', goal: 'Map semantic density.', promptContext: 'Read an abstract about the re-evaluation of social trust.' },
          { id: 'c2-u4-s3', title: 'Live: Thesis Defense', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Explain a scientific concept.', goal: 'Use 10 nominalized concepts.', promptContext: 'Tell Lovelya: "The fluctuation in market behavior necessitates..."' },
        ]
      },
      {
        id: 'c2-u5', unitNumber: 5, title: 'Proportional Balance', level: 'C2', grammarFocus: 'Correlatives', vocabTheme: 'Al-Mizan',
        description: 'Link cause and effect in beautiful parallel rhythms.',
        steps: [
          { id: 'c2-u5-bridge', title: 'Unit Context: Universal Balance', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Capturing symbiotic life logic.', goal: 'Thematic awareness.' },
          { id: 'c2-u5-s1', title: 'Grammar: Proportional Correlatives', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'The more... the more... patterns.', goal: 'Build catchy logic.', targetId: 'c2-proportional-correlatives' },
          { id: 'c2-u5-s2', title: 'Reading: Proverbial Wisdom', type: 'reading_task', moduleView: AppView.READING, description: 'Maxims from around the world.', goal: 'Analyze parallel rhythms.', promptContext: 'Read about the correlation between hard work and success in history.' },
          { id: 'c2-u5-s3', title: 'Live: Maxim Builder', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Give wise advice.', goal: 'Use 4 parallel correlations.', promptContext: 'Tell Lovelya: "The harder you try, the more peace you find."' },
        ]
      },
      {
        id: 'c2-u6', unitNumber: 6, title: 'Master of Efficiency', level: 'C2', grammarFocus: 'Advanced Ellipsis', vocabTheme: 'Brevity',
        description: 'Communicate with lean, effective structures.',
        steps: [
          { id: 'c2-u6-bridge', title: 'Unit Context: Minimalist Mastery', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Respecting the listener\'s mind.', goal: 'Thematic awareness.' },
          { id: 'c2-u6-s1', title: 'Grammar: Gapping and Sluicing', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Advanced word removal rules.', goal: 'Create efficient flow.', targetId: 'c2-advanced-ellipsis' },
          { id: 'c2-u6-s2', title: 'Listening: Crisis Negotiation', type: 'listening_task', moduleView: AppView.LISTENING, description: 'Fast-paced negotiation room.', goal: 'Decode skipped information.', promptContext: 'Listen to a coordinator and team leading a rapid response.' },
          { id: 'c2-u6-s3', title: 'Live: Rapid Coordination', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Coordinate an event quickly.', goal: 'Avoid any word repetition.', promptContext: 'Lovelya asks: "Who will go? Who will stay?" Respond with ellipsis.' },
        ]
      },
      {
        id: 'c2-u7', unitNumber: 7, title: 'Ethical Distance', level: 'C2', grammarFocus: 'Impersonal Passive', vocabTheme: 'Tabayyun',
        description: 'Report the world with perfect neutrality.',
        steps: [
          { id: 'c2-u7-bridge', title: 'Unit Context: Ethical Reporting', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Honor through objective distancing.', goal: 'Thematic awareness.' },
          { id: 'c2-u7-s1', title: 'Grammar: Distant Reporting', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Claimed, Alleged, Estimated usage.', goal: 'Report 10 sensitive rumors.', targetId: 'c2-impersonal-passive' },
          { id: 'c2-u7-s2', title: 'Listening: News Commentary', type: 'listening_task', moduleView: AppView.LISTENING, description: 'High-level bulletins.', goal: 'Find passive depth.', promptContext: 'Listen to a commentary about societal transformation.' },
          { id: 'c2-u7-s3', title: 'Live: Journalistic Briefing', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Brief a council on a crisis.', goal: 'Maintain absolute distance.', promptContext: 'Lovelya is the judge. Brief her: "The leader is believed to have..."' },
        ]
      },
      {
        id: 'c2-u8', unitNumber: 8, title: 'Legacy Projections', level: 'C2', grammarFocus: 'Future Forms Review', vocabTheme: 'Vision',
        description: 'Communicate legacy with layered tenses.',
        steps: [
          { id: 'c2-u8-bridge', title: 'Unit Context: Visionary Power', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Projecting effort as eternal legacy.', goal: 'Thematic awareness.' },
          { id: 'c2-u8-s1', title: 'Grammar: Future Peaks', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Will have been -ing in history.', goal: 'Build long-term projections.', targetId: 'c2-speculative-future' },
          { id: 'c2-u8-s2', title: 'Reading: Legacy 2050', type: 'reading_task', moduleView: AppView.READING, description: 'Foundation history from the future.', goal: 'Map duration milestones.', promptContext: 'Read a letter from the future describing our foundation\'s 50-year effort.' },
          { id: 'c2-u8-s3', title: 'Live: Visionary Manifesto', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Declare your long-term aims.', goal: 'Use 3 complex future forms.', promptContext: 'Tell Lovelya: "By 2050, our city will have been growning..."' },
        ]
      },
      {
        id: 'c2-u9', unitNumber: 9, title: 'Formal Precision', level: 'C2', grammarFocus: 'Compound Modifiers', vocabTheme: 'Artistry',
        description: 'Master the finest details of hyphenated class.',
        steps: [
          { id: 'c2-u9-bridge', title: 'Unit Context: Masterful Precision', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'The hyphen as intellectual class tool.', goal: 'Thematic awareness.' },
          { id: 'c2-u9-s1', title: 'Grammar: Sophisticated Chains', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Hyphenated clusters in discourse.', goal: 'Master precise descriptions.', targetId: 'c2-compound-modifiers' },
          { id: 'c2-u9-s2', title: 'Reading: Legal Contract Review', type: 'reading_task', moduleView: AppView.READING, description: 'Highly technical discourse.', goal: 'Identify 10 modifiers.', promptContext: 'Read a legally-binding agreement about international cooperation.' },
          { id: 'c2-u9-s3', title: 'Live: Architect\'s Presentation', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Present a masterpiece.', goal: 'Use 5 complex hyphenated adjectives.', promptContext: 'Lovelya is the client. Present a "custom-tailored, soul-stirring" design.' },
        ]
      },
      {
        id: 'c2-u10', unitNumber: 10, title: 'The Master Navigator', level: 'C2', grammarFocus: 'Nuanced Discourse', vocabTheme: 'Al-Fusha',
        description: 'Final integration of wisdom and language.',
        steps: [
          { id: 'c2-u10-bridge', title: 'Unit Context: The Master Navigator', type: 'context_bridge', moduleView: AppView.ROADMAP, description: 'Guiding souls through words.', goal: 'Thematic awareness.' },
          { id: 'c2-u10-s1', title: 'Grammar: Final Connectors', type: 'grammar_lesson', moduleView: AppView.GRAMMAR, description: 'Albeit, Notwithstanding, Accordingly.', goal: 'Transition 20 complex ideas.', targetId: 'c2-discourse-markers' },
          { id: 'c2-u10-s2', title: 'Reading: Final Reflections', type: 'reading_task', moduleView: AppView.READING, description: 'Global Scientific Council text.', goal: 'Analyze argument cohesion.', promptContext: 'Read the concluding remarks of a profound international summit.' },
          { id: 'c2-u10-s3', title: 'Live: Legacy Speech', type: 'speaking_practice', moduleView: AppView.LIVE, description: 'Reflect on your whole journey.', goal: 'Use every level of formal connector.', promptContext: 'Lovelya asks: "Looking back, how has your journey been?"' },
          { id: 'c2-u10-s4', title: 'Mastery Review Assessment', type: 'quiz', moduleView: AppView.ASSESSMENT, description: 'Final C2 Master check.', goal: 'Declare Mastery.', targetId: 'assessment' }
        ]
      }
    ]
  }
];
