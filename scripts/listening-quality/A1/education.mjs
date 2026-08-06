import { q } from '../helpers.mjs';

export const reviews = [
  {
    id: 'a1-education-01', level: 'A1', scriptDecision: 'keep; inspiring adult-learning story with clear support and result',
    replaceText: [['stopped dreading math tests', 'stopped feeling afraid of math tests'], ['did not mean I was incapable', 'did not mean I could never learn it']],
    tags: { 0: 'discouraged', 3: 'warmly', 5: 'nervous', 8: 'hopeful', 11: 'proud', 15: 'encouraging' },
    additions: [
      q('Why did the narrator avoid asking questions?', 'She felt embarrassed', 'The teacher left early', 'The class had no numbers', 'She forgot her homework', 'She worried about looking slow in front of the class.'),
      q('What does “unprepared” mean here?', 'Not ready yet', 'Unable to learn', 'Too old for school', 'Finished with the lesson', 'Ibu Ratna separates being unready from being unable.'),
      q('How did Ibu Ratna explain difficult ideas?', 'In several different ways', 'Only with a textbook', 'By giving more tests', 'Through one quick answer', 'She changed her explanation until the idea became clear.'),
      q('What showed the narrator’s confidence had grown?', 'She later studied accounting', 'She stopped attending Friday help', 'She avoided every test', 'She changed math teachers', 'The adult certificate was something she once thought impossible.'),
      q('How does the narrator use the lesson now?', 'She speaks patiently to other learners', 'She teaches only mathematics', 'She avoids new work challenges', 'She sends weekly tests to Ibu Ratna', 'She passes the teacher’s encouragement to people who are struggling.'),
    ],
  },
  {
    id: 'a1-education-02', level: 'A1', scriptDecision: 'keep; podcast uses adult work and family motivation with understandable context',
    tags: { 0: 'warmly', 1: 'slightly nervous', 3: 'thoughtful', 5: 'honestly', 9: 'determined', 15: 'encouraging', 17: 'hopeful' },
    additions: [
      q('Why did Andi want a different job?', 'He wanted more stability', 'He disliked every class', 'His daughter changed schools', 'The warehouse moved', 'He hoped education could lead to steadier work.'),
      q('What does “rusty” mean when Andi describes his memory?', 'Not as strong after little use', 'Broken and impossible to fix', 'Fast and ready', 'Full of new technology', 'Years away from class made study skills feel less familiar.'),
      q('Why did Andi study early in the morning?', 'The house and his mind were quiet', 'His shift ended at sunrise', 'University required it', 'His daughter taught the class', 'He chose a calm time before work.'),
      q('What strength did Andi bring as an older student?', 'Experience with work and responsibility', 'Faster computer skills', 'More free time', 'Better memory than everyone', 'His years of work gave him useful adult experience.'),
      q('What does Andi mean when fear gets smaller?', 'Regular attendance builds confidence', 'Classes become shorter each week', 'Every hard task disappears', 'Age changes during the course', 'Continuing to show up makes school feel less frightening.'),
    ],
  },
  {
    id: 'a1-education-03', level: 'A1', scriptDecision: 'keep; the difficult term is explained immediately with a simple example',
    tags: { 0: 'panicked', 1: 'calmly', 5: 'patiently', 7: 'relieved', 13: 'focused', 17: 'grateful', 19: 'encouraging' },
    additions: [
      q('Why does Bayu use an example first?', 'The definition did not help Rani', 'The exam has no definitions', 'Rani already solved the problem', 'The textbook was missing', 'A concrete example makes the difficult words easier.'),
      q('What does “spread out” mean for the numbers?', 'Farther apart from one another', 'Written on different pages', 'Copied by many students', 'Placed below the average', 'Bayu uses the phrase to explain distance from the average.'),
      q('What does Rani calculate first in the practice problem?', 'The average', 'The final grade', 'The exam time', 'The chapter number', 'She begins with the idea she already understands.'),
      q('How does teaching help Bayu?', 'It helps him remember too', 'It gives him a new textbook', 'It ends the study session', 'It changes tomorrow’s exam', 'Explaining the idea strengthens his own learning.'),
      q('Why does Rani understand after Bayu’s help?', 'He slows down and uses simple words', 'He gives her the exam answers', 'He studies alone first', 'He removes the practice problem', 'The pace and explanation match what she needs.'),
    ],
  },
  {
    id: 'a1-education-04', level: 'A1', scriptDecision: 'keep; meaningful family story with one clear and realistic learning goal',
    replaceText: [['completely out of reach for him', 'impossible for him before'], ['the quietest and truest kind of education', 'a quiet and honest kind of education']],
    tags: { 0: 'reflective', 3: 'surprised', 5: 'patiently', 8: 'warmly', 11: 'determined', 15: 'proud' },
    additions: [
      q('How did the father study each evening?', 'He followed each line with his finger', 'He listened to a university class', 'He asked his son to read everything', 'He memorized a whole page', 'He used a slow physical method with the phrasebook.'),
      q('What does “fluent” mean here?', 'Able to use the language easily', 'Able to read one label', 'Ready to start learning', 'Interested in medicine', 'The father does not aim for easy use of all English.'),
      q('Why was the medicine-label goal important?', 'He wanted more independence', 'He wanted to become a doctor', 'He needed a school grade', 'He planned to teach English', 'Reading labels himself would reduce his need to ask others.'),
      q('What changed in the narrator’s study habits?', 'He continued longer when work felt hard', 'He stopped using books', 'He studied only English labels', 'He waited until age fifty', 'Watching his father made slow progress feel valuable.'),
      q('What is the main contrast in the story?', 'A small goal creates a big personal change', 'Fast learning is better than slow learning', 'School grades matter more than daily skills', 'Young learners always know more', 'The father seeks only simple reading, but the effort inspires his son deeply.'),
    ],
  },
  {
    id: 'a1-education-05', level: 'A1', scriptDecision: 'keep; supportive mentor call gives concrete exam-night advice',
    tags: { 0: 'panicked', 1: 'calmly', 4: 'reassuring', 8: 'thoughtful', 12: 'firmly', 16: 'relieved', 17: 'encouraging' },
    additions: [
      q('Why do Dita’s notes look unfamiliar?', 'Her brain is tired', 'She studied the wrong subject', 'The exam has changed', 'Her mentor took the notes', 'Pak Hendra explains that tiredness is affecting her view.'),
      q('What does “exaggerate” mean here?', 'Make a problem seem bigger', 'Explain a detail clearly', 'Forget every lesson', 'Prepare for many weeks', 'Fear makes Dita imagine complete failure instead of a small mistake.'),
      q('What does Dita say she understands well?', 'The main concepts', 'Every small detail', 'Her mentor’s exam', 'The morning schedule', 'She is strong in the central ideas but mixes up details.'),
      q('Why does Pak Hendra recommend sleep?', 'Tired study may hurt performance', 'The exam begins late', 'Dita has finished every question', 'The notes are no longer useful', 'His own sleepless exam experience ended badly.'),
      q('What is Pak Hendra’s purpose in the call?', 'Help Dita see her preparation more calmly', 'Teach a new exam subject', 'Tell her to study until morning', 'Change the certification date', 'He challenges her worst fears and gives a realistic plan.'),
    ],
  },
  {
    id: 'a1-education-06', level: 'A1', scriptDecision: 'keep; simplify difficult emotional vocabulary while preserving the adult return-to-study arc',
    replaceText: [['tired and unfulfilled', 'tired and unhappy with the work'], ['The first semester was brutal.', 'The first semester was very hard.'], ['constant struggle', 'a problem every day']],
    tags: { 0: 'nervous', 3: 'hopeful', 6: 'determined', 7: 'discouraged', 9: 'warmly', 12: 'proud', 14: 'confident' },
    additions: [
      q('Why did the narrator sit near the back?', 'She worried others would judge her age', 'She could not see the front', 'Vina saved the other seats', 'The lecture was too long', 'She felt different from the younger students.'),
      q('What does “starting over” mean here?', 'Beginning a new path later in life', 'Repeating the same school day', 'Leaving university after one week', 'Writing the notes again', 'Relatives saw nursing study as a new life direction.'),
      q('What happened before Vina offered help?', 'The narrator failed a quiz and felt upset', 'The narrator finished the program', 'Vina changed to retail work', 'The family stopped supporting her', 'The failed quiz was a low point before support arrived.'),
      q('How did Vina treat the narrator?', 'Like another learner', 'Like a much older teacher', 'Like someone unable to study', 'Like a retail customer', 'Vina focused on studying together, not the age difference.'),
      q('What did the narrator discover about classmates?', 'They were focused on their own work', 'They laughed at handwritten notes', 'They all studied nursing as children', 'They wanted her to leave', 'Her fear of constant judgment was larger than the reality.'),
    ],
  },
  {
    id: 'a1-education-07', level: 'A1', scriptDecision: 'keep; short radio call-in has clear routine, goal, and workplace result',
    tags: { 0: 'cheerfully', 1: 'warmly', 5: 'honestly', 9: 'determined', 13: 'proud', 17: 'encouraging' },
    additions: [
      q('Why did the caller pause the course twice?', 'It was hard to continue alone', 'The course ended early', 'The manager requested it', 'The projects were too easy', 'Without a fixed routine, the online lessons were difficult to maintain.'),
      q('What does “consistent” mean here?', 'Continuing regularly', 'Finishing in one night', 'Changing courses often', 'Studying only at work', 'The caller now studies on the same two evenings each week.'),
      q('Why does the caller finish one project each month?', 'A visible result supports motivation', 'The course requires twelve jobs', 'Friends complete the projects', 'The manager pays for each one', 'A small finished design shows real progress.'),
      q('How did the course create a work opportunity?', 'The manager noticed newsletter designs', 'The caller became a teacher', 'The schedule stopped changing', 'The company opened a school', 'Using the new skill made it visible at work.'),
      q('What mistake does the caller warn against?', 'Treating the course as something for later', 'Choosing a course online', 'Showing projects to friends', 'Scheduling two study evenings', 'Online flexibility still needs serious regular action.'),
    ],
  },
  {
    id: 'a1-education-08', level: 'A1', scriptDecision: 'keep; strong classroom story that directly models healthy question asking',
    tags: { 0: 'uncertain', 2: 'worried', 5: 'gently', 7: 'relieved', 9: 'nervous', 11: 'thoughtful', 14: 'confident' },
    additions: [
      q('What happened when the narrator guessed at home?', 'She repeated the same mistake', 'She understood every example', 'She finished the course', 'She asked classmates online', 'Guessing did not solve the grammar confusion.'),
      q('What does “criticize” mean in this story?', 'Speak negatively about a mistake', 'Explain with colored pens', 'Invite a student to a desk', 'Give another short task', 'The teacher did not shame the narrator for wrong answers.'),
      q('Why were two classmates relieved?', 'They also needed the explanation', 'The task had been canceled', 'They knew every answer', 'The break started early', 'The narrator’s question helped students who had stayed quiet.'),
      q('When does the narrator ask for help now?', 'After trying notes and the exercise first', 'Before reading any instruction', 'Only after three weeks', 'Whenever another student asks', 'She first works independently, then asks if confusion remains.'),
      q('What did asking one question save?', 'More time spent guessing at home', 'The need to attend class', 'The teacher’s colored pens', 'Every future grammar mistake', 'A brief question gave a faster path to understanding.'),
    ],
  },
  {
    id: 'a1-education-09', level: 'A1', scriptDecision: 'keep; museum audio-guide format adds observational listening variety',
    tags: { 0: 'reflective', 2: 'curious', 4: 'thoughtful', 7: 'immersed', 9: 'curious', 11: 'satisfied', 13: 'inspired' },
    additions: [
      q('What detail made the travel bag feel real?', 'Repairs and a faded name', 'Its high price', 'A new handle', 'The room number', 'Signs of long use connected the object with a person’s life.'),
      q('What does “faded” mean?', 'Less clear after a long time', 'Written in a bright color', 'Recently added', 'Hidden by a label', 'The old name inside the bag was no longer strong or clear.'),
      q('Why did the narrator close his eyes?', 'To imagine the old street through sound', 'To avoid seeing the travel bag', 'To answer a written question', 'To rest after two hours', 'The bells, sellers, and bus created a picture through listening.'),
      q('What happened before the guide explained the dark tool?', 'The narrator made a guess', 'The narrator took a photo', 'A worker entered the room', 'The guide changed rooms', 'Thinking first made the later answer easier to remember.'),
      q('How was the narrator more active during this visit?', 'He observed, listened, and answered questions', 'He moved through rooms faster', 'He took many more photos', 'He read every label aloud', 'The guide asked him to use evidence instead of only receiving facts.'),
    ],
  },
  {
    id: 'a1-education-10', level: 'A1', scriptDecision: 'keep; concrete study plan balances vocabulary, listening, speaking, place, and review',
    tags: { 0: 'hopeful', 1: 'careful', 4: 'practical', 8: 'agreeing', 10: 'enthusiastic', 13: 'relieved', 18: 'confident' },
    additions: [
      q('Why do they choose only two people?', 'The last group was too large', 'The library allows only two', 'The test has two questions', 'Their coworkers cannot study', 'A smaller group will be easier to organize and focus.'),
      q('What does “role-play” mean here?', 'Practice a situation by acting it out', 'Listen to a recorded lesson', 'Write vocabulary without notes', 'Reserve a library room', 'They will act through situations such as a clinic visit.'),
      q('Why do they explain their listening answers?', 'Reasons show how they understood the audio', 'The answer key is missing', 'The library requires speaking', 'The test is only about grammar', 'They want to learn from the thinking, not only check a letter.'),
      q('What will they do when tired?', 'Choose an easier activity and still meet', 'Cancel every session', 'Study for twice as long', 'Move to the loud café', 'A lighter session keeps the routine without demanding perfect energy.'),
      q('Why does the plan make them calmer?', 'The time, place, and tasks are clear', 'The language test is canceled', 'They have already passed', 'Six friends will join them', 'Specific decisions reduce uncertainty about studying.'),
    ],
  },
];
