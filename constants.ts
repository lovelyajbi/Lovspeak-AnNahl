
import { Level, Theme, Badge } from './types';

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const LEVEL_DEFINITIONS = [
  { 
    id: 'A1', 
    label: 'Beginner', 
    title: 'Breakthrough',
    desc: 'Can understand basic phrases, introduce yourself, and ask simple questions.' 
  },
  { 
    id: 'A2', 
    label: 'Elementary', 
    title: 'Waystage',
    desc: 'Can communicate in simple, routine tasks and describe immediate needs.' 
  },
  { 
    id: 'B1', 
    label: 'Intermediate', 
    title: 'Threshold',
    desc: 'Can deal with most travel situations and describe experiences, dreams, and opinions.' 
  },
  { 
    id: 'B2', 
    label: 'Upper Intermediate', 
    title: 'Vantage',
    desc: 'Can interact fluently with native speakers and understand complex text.' 
  },
  { 
    id: 'C1', 
    label: 'Advanced', 
    title: 'Effective Proficiency',
    desc: 'Can express ideas fluently without searching for words and use language flexibly.' 
  },
  { 
    id: 'C2', 
    label: 'Mastery', 
    title: 'Mastery',
    desc: 'Can understand virtually everything heard or read and express self spontaneously.' 
  }
];

export const THEMES: Theme[] = [
  // Islamic Themes
  { id: 'tauhid', name: 'Tauhid (Monotheism)', isIslamic: true },
  { id: 'adab', name: 'Adab (Manners)', isIslamic: true },
  { id: 'akhlak', name: 'Akhlak (Character)', isIslamic: true },
  { id: 'prophets', name: 'Stories of Prophets', isIslamic: true },
  { id: 'sahabah', name: 'Stories of Sahabah', isIslamic: true },
  { id: 'righteous', name: 'Stories of Righteous People', isIslamic: true },
  // General Themes
  { id: 'daily', name: 'Daily Life', isIslamic: false },
  { id: 'travel', name: 'Travel & Transportation', isIslamic: false },
  { id: 'work', name: 'Work & Career', isIslamic: false },
  { id: 'health', name: 'Health & Wellness', isIslamic: false },
  { id: 'education', name: 'Education', isIslamic: false },
  { id: 'technology', name: 'Technology', isIslamic: false },
  { id: 'nature', name: 'Nature & Environment', isIslamic: false },
  { id: 'social', name: 'Social Issues', isIslamic: false },
];

export const VOCAB_CATEGORIES = [
  'Adab & Akhlak',
  'Islamic Terms',
  'Family & Relationships',
  'Home & Daily Routine',
  'School & Education',
  'Work & Career',
  'Food & Dining',
  'Travel & Transportation',
  'Health & Body',
  'Emotions & Feelings',
  'Nature & Environment',
  'Weather & Climate',
  'Clothing & Fashion',
  'Shopping & Money',
  'Hobbies & Leisure',
  'Sports & Fitness',
  'Technology & Media',
  'Time & Numbers',
  'Places & Buildings',
  'Animals & Pets',
  'Idioms & Slang',
  'Reading',
  'Listening',
  'User Added'
];

// --- GAMIFICATION CONSTANTS ---

export const AVATAR_ICONS = [
  'fa-user', 'fa-user-tie', 'fa-user-ninja', 'fa-user-astronaut', 
  'fa-user-graduate', 'fa-user-nurse', 'fa-user-secret', 'fa-head-side-mask',
  'fa-smile', 'fa-robot', 'fa-cat', 'fa-dog', 'fa-dragon', 'fa-dove',
  'fa-crow', 'fa-spider', 'fa-fish', 'fa-leaf', 'fa-tree', 'fa-fire'
];

export const ISLAMIC_QUOTES = [
  // Quranic Verses - Patience, Hope, Effort
  "Allah does not burden a soul beyond that it can bear. (Quran 2:286)",
  "So verily, with the hardship, there is relief. (Quran 94:5)",
  "Verily, with the hardship, there is relief. (Quran 94:6)",
  "Do not lose hope, nor be sad. (Quran 3:139)",
  "And whoever puts their trust in Allah, then He will suffice him. (Quran 65:3)",
  "Allah is with those who have patience. (Quran 2:153)",
  "And seeking forgiveness of your Lord and turn to Him in repentance. (Quran 11:3)",
  "Verily, in the remembrance of Allah do hearts find rest. (Quran 13:28)",
  "Call upon Me; I will respond to you. (Quran 40:60)",
  "He is with you wherever you are. (Quran 57:4)",
  "My Mercy embraces all things. (Quran 7:156)",
  "And He found you lost and guided you. (Quran 93:7)",
  "Indeed, good deeds do away with misdeeds. (Quran 11:114)",
  "And speak to people good words. (Quran 2:83)",
  "If you are grateful, I will surely increase you in favor. (Quran 14:7)",
  "Guide us to the straight path. (Quran 1:6)",
  "So remember Me; I will remember you. (Quran 2:152)",
  "And We have certainly made the Quran easy for remembrance, so is there any who will remember? (Quran 54:17)",
  "Indeed, Allah will not change the condition of a people until they change what is in themselves. (Quran 13:11)",
  "Hold firmly to the rope of Allah all together and do not become divided. (Quran 3:103)",
  "Our Lord, grant us good in this world and good in the Hereafter. (Quran 2:201)",
  "And do good; indeed, Allah loves the doers of good. (Quran 2:195)",
  "Is there any reward for good other than good? (Quran 55:60)",
  "Perhaps you hate a thing and it is good for you; and perhaps you love a thing and it is bad for you. (Quran 2:216)",
  "Sufficient for us is Allah, and He is the best Disposer of affairs. (Quran 3:173)",
  "And lower to them the wing of humility out of mercy and say, 'My Lord, have mercy upon them as they brought me up when I was small.' (Quran 17:24)",
  "And do not walk upon the earth exultantly. (Quran 17:37)",
  "Indeed, the patient will be given their reward without account. (Quran 39:10)",
  "O you who have believed, seek help through patience and prayer. (Quran 2:153)",
  "Peace it is until the emergence of dawn. (Quran 97:5)",
  "Read! In the name of your Lord who created. (Quran 96:1)",
  "And say: My Lord, increase me in knowledge. (Quran 20:114)",
  "Are those who know equal to those who do not know? (Quran 39:9)",
  "Allah raises of those who believe and those who have been given knowledge many degrees. (Quran 58:11)",
  "Man shall have nothing but what he strives for. (Quran 53:39)",
  "Every soul shall taste death. (Quran 3:185)",
  "No one despairs of relief from Allah except the disbelieving people. (Quran 12:87)",
  "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.' (Quran 39:53)",
  "And He is the Forgiving, the Affectionate. (Quran 85:14)",
  "Indeed, my Lord is near and responsive. (Quran 11:61)",

  // Hadith - Knowledge, Character, Action
  "Seeking knowledge is an obligation upon every Muslim. (Hadith)",
  "The best among you is the one who learns the Quran and teaches it. (Hadith)",
  "Actions are judged by intentions. (Hadith)",
  "A good word is charity. (Hadith)",
  "Smiling in the face of your brother is charity. (Hadith)",
  "The strong believer is better and more beloved to Allah than the weak believer. (Hadith)",
  "Make things easy for people and not difficult. Give people good news and bring them joy. (Hadith)",
  "He who does not show mercy to others will not be shown mercy. (Hadith)",
  "The best of people are those that bring most benefit to the rest of mankind. (Hadith)",
  "Cleanliness is half of faith. (Hadith)",
  "Modesty brings nothing but good. (Hadith)",
  "Richness is not having many belongings, but richness is contentment of the soul. (Hadith)",
  "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise. (Hadith)",
  "Take advantage of five before five: your youth before your old age, your health before your illness, your riches before your poverty, your free time before your work, and your life before your death. (Hadith)",
  "Be in this world as if you were a stranger or a traveler. (Hadith)",
  "None of you truly believes until he loves for his brother what he loves for himself. (Hadith)",
  "Speak good or remain silent. (Hadith)",
  "Do not be angry. (Hadith)",
  "The most perfect believer in faith is the one whose character is finest. (Hadith)",
  "Exchange gifts, you will love one another. (Hadith)",
  "God is Beautiful and He loves beauty. (Hadith)",
  "A gentle word gets you farther than a loud voice. (Hadith context)",
  "Trust in Allah, but tie your camel. (Hadith)",
  "The pursuit of knowledge is expedient for every Muslim. (Hadith)",
  "Wisdom is the lost property of the believer, so wherever he finds it then he has a right to it. (Hadith)",
  "Beware of suspicion, for suspicion is the worst of false tales. (Hadith)",
  "The best of you are those who are best to their families. (Hadith)",
  "Kindness is a mark of faith, and whoever has not kindness has not faith. (Hadith)",
  "He who is not grateful to people is not grateful to Allah. (Hadith)",
  "Do not wish to be like anyone except in two cases: A person whom Allah has given wealth and he spends it righteously, and a person whom Allah has given wisdom and he acts according to it and teaches it to others. (Hadith)",
  "Keep your tongue wet with the remembrance of Allah. (Hadith)",
  "Fear Allah wherever you are, follow a bad deed with a good deed and it will erase it, and behave with good character towards the people. (Hadith)",
  "There is no disease that Allah has created, except that He also has created its treatment. (Hadith)",
  "Every act of kindness is charity. (Hadith)",
  "Seek knowledge from the cradle to the grave. (Traditional Saying)",
  "If you want to focus more on Allah, focus less on people. (Islamic Wisdom)",
  "When you see a person who has been given more than you in money and beauty, look to those who have been given less. (Hadith)",
  "The greatest Jihad is to battle your own soul, to fight the evil within yourself. (Hadith)",
  "When God wishes good for someone, He bestows upon him the understanding of Deen. (Hadith)",
  "Be patient. For what was written for you was written by the greatest of writers. (Islamic Wisdom)",

  // Quotes from Sahabah & Scholars (Ali RA, Umar RA, etc.)
  "Knowledge is better than wealth. Knowledge guards you, while you have to guard wealth. (Ali ibn Abi Talib)",
  "Do not raise your children the way your parents raised you, they were born for a different time. (Ali ibn Abi Talib)",
  "Opportunity passes like the cloud, so take advantage of good opportunities. (Ali ibn Abi Talib)",
  "Detachment is not that you should own nothing, but that nothing should own you. (Ali ibn Abi Talib)",
  "Beautiful people are not always good, but good people are always beautiful. (Ali ibn Abi Talib)",
  "The tongue is like a lion; if you let it loose, it will wound someone. (Ali ibn Abi Talib)",
  "Through patience, great things are accomplished. (Ali ibn Abi Talib)",
  "Do not let your difficulties fill you with anxiety, after all it is only in the darkest nights that stars shine more brightly. (Ali ibn Abi Talib)",
  "Nothing hurts a good soul and a kind heart more than to live amongst people who cannot understand it. (Ali ibn Abi Talib)",
  "Sometimes the people with the worst past create the best future. (Umar ibn Al-Khattab)",
  "We were the most humiliated people on earth and Allah gave us honor through Islam. (Umar ibn Al-Khattab)",
  "Get used to a rough life, for luxury does not last forever. (Umar ibn Al-Khattab)",
  "Sit with those who love God, for that enlightens the mind. (Umar ibn Al-Khattab)",
  "To be alone means you avoid bad company. But to have a true friend is better than being alone. (Umar ibn Al-Khattab)",
  "If you want to control other people, first control yourself. (Abu Bakr As-Siddiq)",
  "Run away from greatness and greatness will follow you. (Abu Bakr As-Siddiq)",
  "Knowledge without action is wastefulness and action without knowledge is foolishness. (Abu Bakr As-Siddiq)",
  "Worrying about the world is a darkness in the heart, while worrying about the Hereafter is a light in the heart. (Uthman ibn Affan)",
  "Acquire knowledge, and learn tranquility and dignity. (Umar ibn Al-Khattab)",
  "Time is like a sword. If you do not cut it, it will cut you. (Imam Shafi'i)",
  "My heart is at ease knowing that what was meant for me will never miss me, and that what misses me was never meant for me. (Imam Shafi'i)",
  "All humans are dead except those who have knowledge. (Imam Shafi'i)",
  "Travel! For in travel there are five benefits: relief of adversity, earning of livelihood, knowledge, manners, and noble companionship. (Imam Shafi'i)",
  "Knowledge is light, and the light of Allah is not given to a sinner. (Imam Shafi'i)",
  "If you are unable to do good, then at least desist from doing evil. (Imam Ghazali)",
  "To get what you love, you must first be patient with what you hate. (Imam Ghazali)",
  "The corruption of religions comes from turning them to mere words and appearances. (Imam Ghazali)",
  "Desire makes slaves out of kings and patience makes kings out of slaves. (Imam Ghazali)",
  "What you seek is seeking you. (Rumi)",
  "Do not grieve. Anything you lose comes round in another form. (Rumi)",
  "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself. (Rumi)",
  "Sell your cleverness and buy bewilderment. (Rumi)",
  "The wound is the place where the Light enters you. (Rumi)",
  "Raise your words, not your voice. It is rain that grows flowers, not thunder. (Rumi)",
  "Knock, and He'll open the door. Vanish, and He'll make you shine like the sun. (Rumi)",
  "When the world pushes you to your knees, you're in the perfect position to pray. (Rumi)",
  "The heart of the believer is the throne of Allah. (Islamic Wisdom)",
  "Don't tell your God how big your storm is, tell your storm how big your God is. (Islamic Wisdom)",
  "Forgive others as quickly as you expect Allah to forgive you. (Islamic Wisdom)",
  "When you don't understand what's happening in your life, just close your eyes, take a deep breath and say: 'O Allah, I know this is your plan, just help me through it.'",
  "Dua turns what is impossible into possible.",
  "Your sin is not greater than God's mercy.",
  "Sabr is not remaining quiet and letting anger build up inside you. Sabr is to talk about what's bothering you without losing control of your emotions.",
  "Every test is a blessing in disguise.",
  "Don't worry about what people say or think about you. Allah knows your heart.",
  "Being a Muslim is about changing yourself, not changing Islam.",
  "Trust Allah when things don't work out the way you wanted. Allah has something better planned for you.",
  "A person's true wealth is the good they do in this world.",
  "The beauty of the Quran is that you cannot change its message, but its message can change you.",
  "If you feel far from Allah, guess who moved?",
  "Allah makes the impossible possible.",
  "Don't waste your time trying to explain yourself to people who are committed to misunderstanding you.",
  "The cure for pain is in the pain. (Rumi)",
  "Gratitude is the key to happiness.",
  "Start your day with Bismillah and end it with Alhamdulillah.",
  "Life is a journey from Allah to Allah.",
  "Every breath is a gift from Allah.",
  "Never underestimate the power of a sincere Dua.",
  "Patience is the key to contentment.",
  "Your character defines you more than your rank.",
  "Humility is the seed of greatness.",
  "Knowledge is the life of the mind.",
  "Wisdom is the wealth of the wise.",
  "Honesty is the first chapter in the book of wisdom.",
  "Justice is the foundation of peace.",
  "Mercy to others is mercy to oneself.",
  "Silence is sometimes the best answer.",
  "A clean heart is the best preparation for prayer.",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
  "Strive for progress, not perfection.",
  "Every day is a new opportunity to get closer to Allah.",
  "Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.",
  "Do good deeds even if they are small, for you never know which one will enter you into Jannah.",
  "Islam is not just a religion, it is a way of life."
];

export const XP_THRESHOLDS = [
  { level: 'A1', min: 0, title: 'Beginner' },
  { level: 'A2', min: 750, title: 'Elementary' },
  { level: 'B1', min: 1500, title: 'Intermediate' },
  { level: 'B2', min: 2250, title: 'Upper Intermediate' },
  { level: 'C1', min: 3000, title: 'Advanced' },
  { level: 'C2', min: 3750, title: 'Mastery' },
  { level: 'Epic', min: 4500, title: 'Epic' },
  { level: 'GrandMaster', min: 5250, title: 'Grand Master' },
  { level: 'Legend', min: 6000, title: 'Legendary' }
];

export const BADGE_DEFINITIONS: Omit<Badge, 'unlockedDate'>[] = [
  // Scholar Series (Sessions Completed)
  { id: 'scholar_bronze', name: 'Novice Scholar', description: 'Complete 1 reading session.', icon: 'fa-book-reader', tier: 'bronze' },
  { id: 'scholar_silver', name: 'Apprentice Scholar', description: 'Complete 10 reading sessions.', icon: 'fa-graduation-cap', tier: 'silver' },
  { id: 'scholar_gold', name: 'Master Scholar', description: 'Complete 50 reading sessions.', icon: 'fa-user-graduate', tier: 'gold' },
  
  // Streak Series
  { id: 'streak_bronze', name: 'Consistency Starter', description: 'Achieve a 3-day learning streak.', icon: 'fa-fire', tier: 'bronze' },
  { id: 'streak_silver', name: 'Habit Builder', description: 'Achieve a 7-day learning streak.', icon: 'fa-fire-alt', tier: 'silver' },
  { id: 'streak_gold', name: 'Unstoppable', description: 'Achieve a 30-day learning streak.', icon: 'fa-meteor', tier: 'gold' },

  // Vocabulary Series
  { id: 'vocab_bronze', name: 'Word Collector', description: 'Save 10 words to vocabulary.', icon: 'fa-tag', tier: 'bronze' },
  { id: 'vocab_silver', name: 'Lexicon Builder', description: 'Save 50 words to vocabulary.', icon: 'fa-tags', tier: 'silver' },
  { id: 'vocab_gold', name: 'Walking Dictionary', description: 'Save 100 words to vocabulary.', icon: 'fa-book', tier: 'gold' },

  // Accuracy Series
  { id: 'acc_bronze', name: 'Good Listener', description: 'Get 80% accuracy in a session.', icon: 'fa-check', tier: 'bronze' },
  { id: 'acc_silver', name: 'Sharpshooter', description: 'Get 90% accuracy in a session.', icon: 'fa-bullseye', tier: 'silver' },
  { id: 'acc_gold', name: 'Perfectionist', description: 'Get 100% accuracy in a session.', icon: 'fa-crown', tier: 'gold' },

  // Islamic Series
  { id: 'islamic_bronze', name: 'Seeker of Knowledge', description: 'Complete 1 Islamic-themed session.', icon: 'fa-moon', tier: 'bronze' },
  { id: 'islamic_silver', name: 'Devoted Learner', description: 'Complete 10 Islamic-themed sessions.', icon: 'fa-star-and-crescent', tier: 'silver' },

  // Time Series
  { id: 'time_bronze', name: 'Early Bird', description: 'Complete a session before 8 AM.', icon: 'fa-sun', tier: 'bronze' },
  { id: 'time_silver', name: 'Night Owl', description: 'Complete a session after 9 PM.', icon: 'fa-cloud-moon', tier: 'silver' },
  
  // Topic Specific
  { id: 'topic_tech', name: 'Tech Savvy', description: 'Complete 5 Technology topics.', icon: 'fa-laptop-code', tier: 'silver' },
  { id: 'topic_nature', name: 'Nature Lover', description: 'Complete 5 Nature topics.', icon: 'fa-leaf', tier: 'silver' },
  
  // Dedication
  { id: 'dedication_iron', name: 'Iron Will', description: 'Earn 1000 XP.', icon: 'fa-dumbbell', tier: 'silver' },
  { id: 'dedication_diamond', name: 'Diamond Mind', description: 'Earn 5000 XP.', icon: 'fa-gem', tier: 'gold' },
  { id: 'dedication_legend', name: 'Living Legend', description: 'Reach the Legend Rank.', icon: 'fa-trophy', tier: 'platinum' },
  
  // Game Series
  { id: 'game_general_bronze', name: 'General Gamer', description: 'Complete 5 levels in the General Track.', icon: 'fa-gamepad', tier: 'bronze' },
  { id: 'game_general_silver', name: 'General Pro', description: 'Complete 10 levels in the General Track.', icon: 'fa-gamepad', tier: 'silver' },
  { id: 'game_general_gold', name: 'General Master', description: 'Complete all 20 levels in the General Track.', icon: 'fa-gamepad', tier: 'gold' },
  { id: 'game_islamic_bronze', name: 'Islamic Seeker', description: 'Complete 5 levels in the Islamic Track.', icon: 'fa-mosque', tier: 'bronze' },
  { id: 'game_islamic_silver', name: 'Islamic Scholar', description: 'Complete 10 levels in the Islamic Track.', icon: 'fa-mosque', tier: 'silver' },
  { id: 'game_islamic_gold', name: 'Islamic Master', description: 'Complete all 20 levels in the Islamic Track.', icon: 'fa-mosque', tier: 'gold' }
];

export const LEARNING_TARGETS = [
  { id: 'speaking', name: 'Speaking Confidence', icon: 'fa-microphone-alt', color: 'text-rose-500', description: 'Focus on pronunciation & fluency.' },
  { id: 'grammar', name: 'Grammar Mastery', icon: 'fa-spell-check', color: 'text-blue-500', description: 'Perfect your sentence structure.' },
  { id: 'vocab', name: 'Vocabulary Expansion', icon: 'fa-book', color: 'text-lovelya-500', description: 'Learn new words every day.' },
  { id: 'islamic', name: 'Islamic Studies', icon: 'fa-mosque', color: 'text-lovelya-600', description: 'Learn English through Islamic content.' },
  { id: 'business', name: 'Business English', icon: 'fa-briefcase', color: 'text-gray-600', description: 'Professional communication skills.' },
  { id: 'travel', name: 'Travel Preparation', icon: 'fa-plane', color: 'text-sky-500', description: 'Essential phrases for traveling.' },
  // New Focus Areas
  { id: 'listening', name: 'Listening Skills', icon: 'fa-headphones', color: 'text-purple-500', description: 'Improve comprehension & retention.' },
  { id: 'writing', name: 'Writing & Essays', icon: 'fa-pen-nib', color: 'text-indigo-500', description: 'Enhance written expression.' },
  { id: 'pronunciation', name: 'Clear Pronunciation', icon: 'fa-microphone-lines', color: 'text-pink-500', description: 'Accent reduction & clarity.' },
  { id: 'academic', name: 'Academic English', icon: 'fa-university', color: 'text-teal-600', description: 'For IELTS/TOEFL success.' },
  { id: 'idioms', name: 'Idioms & Slang', icon: 'fa-comment-dots', color: 'text-orange-500', description: 'Sound natural like a native.' },
];

export const LEARNING_INTENSITIES = [
  { id: 'casual', name: 'Casual Learner', icon: 'fa-coffee', duration: '10 min/day', description: 'Light practice to keep consistent.', color: 'bg-lovelya-100 text-lovelya-700' },
  { id: 'regular', name: 'Regular', icon: 'fa-walking', duration: '30 min/day', description: 'Steady progress with balanced modules.', color: 'bg-blue-100 text-blue-700' },
  { id: 'intensive', name: 'Intensive', icon: 'fa-running', duration: '60 min/day', description: 'Accelerated learning for serious goals.', color: 'bg-orange-100 text-orange-700' },
];

// Intensity-scaled goals per module
export const INTENSITY_GOALS: Record<string, {
  vocabCount: number;
  speakingMinutes: number;
  readingCount: number;
  listeningCount: number;
  shadowingSentences: number;
  grammarTopics: number;
  minShadowingScore: number;
  xpPerTask: number;
}> = {
  casual: {
    vocabCount: 5,
    speakingMinutes: 3,
    readingCount: 1,
    listeningCount: 1,
    shadowingSentences: 2,
    grammarTopics: 1,
    minShadowingScore: 70,
    xpPerTask: 10
  },
  regular: {
    vocabCount: 8,
    speakingMinutes: 7,
    readingCount: 2,
    listeningCount: 2,
    shadowingSentences: 4,
    grammarTopics: 1,
    minShadowingScore: 80,
    xpPerTask: 20
  },
  intensive: {
    vocabCount: 12,
    speakingMinutes: 10,
    readingCount: 3,
    listeningCount: 3,
    shadowingSentences: 6,
    grammarTopics: 2,
    minShadowingScore: 85,
    xpPerTask: 35
  }
};
