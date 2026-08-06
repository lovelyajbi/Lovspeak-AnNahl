import { q } from '../helpers.mjs';

export const reviews = [
  {
    id: 'a2-adab-01', level: 'A2', scriptDecision: 'keep; clear conflict-resolution story distinguishes passive silence, aggression, and calm correction',
    tags: { 0: 'tired', 2: 'annoyed', 4: 'calmly', 5: 'embarrassed', 7: 'reflective', 8: 'warmly', 10: 'determined', 13: 'peacefully' },
    additions: [
      q('Why does the narrator record the voice memo?', 'To remember and reflect on the incident', 'To report the pharmacist publicly', 'To complain to the man’s family', 'To count the waiting customers', 'The recording is a private reflection about what happened.'),
      q('What prevented the situation from becoming more tense?', 'The woman corrected the man without insulting him', 'The narrator left the pharmacy', 'The pharmacist closed the counter', 'The man refused to move', 'Her calm wording protected fairness without beginning a fight.'),
      q('What does “firm” mean in “calm but firm”?', 'Clear and not easily changed', 'Quiet because of fear', 'Friendly but unclear', 'Angry and insulting', 'The woman stayed polite while making the boundary clear.'),
      q('Which two extremes does the narrator want to avoid?', 'Shouting and staying silent', 'Waiting and buying medicine', 'Apologizing and listening', 'Walking and recording', 'The narrator learns that respectful correction lies between the two.'),
      q('Why does the narrator imagine being corrected later?', 'To remember that anyone can make a mistake', 'To prove the man was always rude', 'To avoid every public line', 'To ask the woman for praise', 'The final reflection adds humility to the lesson about correction.'),
    ],
  },
  {
    id: 'a2-adab-02', level: 'A2', scriptDecision: 'revise lightly; keep a specific workplace apology while making the repair action and meeting boundary clearer',
    replaceText: [['I am not upset at all. Everyone learns these things eventually, so please do not worry too much about it.', 'I was frustrated during the presentation, but your apology and clear plan help repair the situation.'], ['I promise to listen more carefully this time.', 'I will use my notes and wait for the discussion time this time.']],
    tags: { 0: 'nervous', 2: 'regretfully', 3: 'directly', 5: 'gently', 7: 'warmly', 8: 'worried', 10: 'determined', 13: 'honestly', 15: 'appreciatively', 17: 'smiling' },
    additions: [
      q('What effect did the interruptions have on Laras?', 'They made her lose her train of thought', 'They improved the report', 'They shortened the whole meeting', 'They made the budget clearer', 'Laras names the practical effect instead of only discussing intention.'),
      q('Why is Bima worried about the rest of the team?', 'His behavior may have looked disrespectful', 'They did not receive the report', 'They heard his private call', 'They disliked his idea', 'He realizes interruptions can communicate a message he did not intend.'),
      q('What does “lose my train of thought” mean?', 'Forget the idea being explained', 'Miss a train after work', 'Change the meeting room', 'Reject a colleague’s opinion', 'The interruptions broke Laras’s concentration while speaking.'),
      q('Why is Laras’s revised response more useful than “I am not upset”?', 'It honestly names the impact and accepts the repair', 'It says the interruption did not happen', 'It removes Bima from future meetings', 'It avoids discussing any next step', 'A good repair can include both honest impact and a constructive plan.'),
      q('Which action will show that Bima’s apology is sincere?', 'Waiting for discussion time in the next meeting', 'Calling Laras every evening', 'Explaining his intention to the whole team', 'Avoiding all future ideas', 'Changed behavior completes the verbal apology.'),
    ],
  },
  {
    id: 'a2-adab-03', level: 'A2', scriptDecision: 'keep; road-safety story moves from personal impatience to empathy and safer behavior',
    tags: { 0: 'cheerfully', 3: 'honestly', 5: 'reflective', 7: 'regretfully', 9: 'thoughtful', 11: 'carefully', 13: 'firmly', 15: 'encouraging', 17: 'warmly' },
    additions: [
      q('What changed when the caller saw the driver’s face?', 'The driver became a person rather than an obstacle', 'The road immediately became empty', 'The caller learned the man’s full history', 'The elderly man began driving faster', 'Seeing fear made the caller recognize the human effect of the horn.'),
      q('When can using a horn still be appropriate?', 'When it is genuinely needed for safety', 'Whenever another driver is slower', 'When the caller feels impatient', 'To make pedestrians hurry', 'The caller asks whether honking is necessary rather than banning it completely.'),
      q('Why does the caller let pedestrians cross despite being late?', 'Their safety is worth more than a few seconds', 'The car cannot move near crossings', 'Every pedestrian is elderly', 'The radio host requires it', 'The changed behavior places safety above impatience.'),
      q('What is the main cause of the caller’s former behavior?', 'Impatience made strangers seem unimportant', 'The road signs were unclear', 'The elderly driver insulted her', 'The horn worked incorrectly', 'The caller connects anger with forgetting the people inside other vehicles.'),
      q('Which result would best show the segment influenced a listener?', 'The listener pauses before reacting in traffic', 'The listener never drives again', 'The listener buys a louder horn', 'The listener ignores road safety', 'The goal is gentler, more thoughtful driving behavior.'),
    ],
  },
  {
    id: 'a2-adab-04', level: 'A2', scriptDecision: 'revise lightly; retain the emotional family memory while keeping the lesson on attention rather than romantic detail',
    replaceText: [['He began telling a story about how he met my great-aunt, sixty years ago, when they were both very young.', 'He began telling a story about how he and my great-aunt built their small family shop sixty years ago.'], ['He described the small letters they wrote to each other, and how nervous he felt the first time he visited her family.', 'He described their first difficult year, the long working days, and how relatives helped them keep the shop open.'], ['It is a small change, but I think it means more to them than any gift I could ever buy.', 'It is a small change, but full attention can communicate respect in a way an expensive gift may not.']],
    tags: { 0: 'warmly', 2: 'impatient', 4: 'gently', 5: 'slowly interested', 7: 'surprised', 8: 'softly', 9: 'touched', 11: 'determined', 13: 'grateful' },
    baseQuiz: [
      q('Where does this story take place?', 'At the narrator’s cousin’s wedding', 'At the great-uncle’s shop', 'At a family hospital', 'At the narrator’s workplace', 'The conversation happens during a wedding dinner.'),
      q('Why could the narrator not escape into the phone?', 'The battery had died', 'The phone was at home', 'The uncle asked for it', 'The wedding had no signal', 'A dead battery removed the usual distraction.'),
      q('What story did the great-uncle tell?', 'How the couple built a family shop', 'How he traveled alone', 'How he planned the wedding', 'How he repaired a phone', 'The revised memory centers on family effort and support.'),
      q('What did the great-uncle say after finishing?', 'He thanked the narrator for listening', 'He asked for an expensive gift', 'He wanted to leave immediately', 'He complained about the dinner', 'Being heard mattered to him.'),
      q('What habit did the narrator begin afterward?', 'Giving older relatives more phone-free attention', 'Recording every family story publicly', 'Avoiding long conversations', 'Buying gifts after each visit', 'The experience changed how the narrator listens.'),
    ],
    additions: [
      q('Why did the narrator listen at first?', 'There was no phone available as an escape', 'The uncle promised a reward', 'The story was already familiar', 'The dinner had ended', 'Initial attention was accidental before genuine interest grew.'),
      q('What made the shop story meaningful?', 'It revealed a family history the narrator had never asked about', 'It explained why the wedding was late', 'It proved old stories are always short', 'It described a famous business', 'The narrator discovers an important life beyond the relative’s usual role.'),
      q('What does “full attention” involve here?', 'Listening without using the phone as a distraction', 'Agreeing with every detail', 'Keeping the conversation brief', 'Writing down every word', 'The lesson concerns presence rather than perfect memory or agreement.'),
      q('Why is the final timing important?', 'The uncle died soon after the conversation', 'The shop closed the same evening', 'The narrator moved abroad', 'The phone was repaired later', 'The loss makes the one attentive conversation especially valuable.'),
      q('What assumption did the narrator revise?', 'Slow older relatives had little worth hearing', 'Family shops never survive', 'Weddings are always tiring', 'Phones make every story clearer', 'Patient listening revealed that the earlier judgment was unfair.'),
    ],
  },
  {
    id: 'a2-adab-05', level: 'A2', scriptDecision: 'revise; distinguish timely professional replies from unhealthy late-night availability and add communication boundaries',
    replaceText: [['Why do you always reply to messages so quickly, even late at night?', 'How do you reply on time without checking work messages all night?'], ['ignoring messages for days shows disrespect for the other person\'s time', 'important work messages need a timely reply, but people also need clear working hours'], ['I try to at least send a short reply, even if I cannot answer fully yet.', 'During working hours, I send a short acknowledgement if I cannot answer fully. After hours, only our emergency channel alerts me.'], ['Start small. Just answer within a day, even briefly, and people will notice the difference quickly.', 'Start with a clear response time, use an emergency channel, and do not promise a deadline you cannot keep.']],
    tags: { 0: 'curious', 1: 'thoughtful', 3: 'gently', 4: 'regretfully', 5: 'practically', 7: 'warmly', 9: 'reflective', 11: 'carefully', 13: 'firmly', 15: 'encouraging', 17: 'lightly' },
    baseQuiz: [
      q('What is Citra curious about?', 'How Reza replies promptly without working all night', 'Why Reza ignores every message', 'How to write to friends at midnight', 'Why clients wait three days', 'The revised opening focuses on both responsiveness and boundaries.'),
      q('What did Reza’s manager teach?', 'Reply time and working-hour expectations should be clear', 'Every message requires an immediate answer', 'Clients should never send questions', 'Only managers may set boundaries', 'Timeliness does not require permanent availability.'),
      q('What problem did Citra create last week?', 'A client waited three days without an update', 'She sent a reply too early', 'She used the emergency channel', 'She answered the wrong client immediately', 'Forgetting the message left another person unable to plan.'),
      q('What does Reza send when a full answer is not ready?', 'A short acknowledgement with a realistic response time', 'An empty message', 'A promise to answer in ten seconds', 'The client’s original message', 'A brief update manages expectations honestly.'),
      q('What matters more than speed alone?', 'Understanding the request correctly', 'Writing at night', 'Using the longest answer', 'Agreeing with the sender', 'A quick wrong reply creates more work.'),
    ],
    additions: [
      q('What protects Reza’s personal time?', 'Only an emergency channel alerts him after hours', 'He turns every device off permanently', 'Clients cannot contact the company', 'He answers all messages before sleep', 'Urgent needs have a defined route without making every message urgent.'),
      q('What does an “acknowledgement” do?', 'Confirms receipt before the complete answer', 'Solves the whole request', 'Rejects the client’s question', 'Moves the message to another company', 'It tells the sender that the message was seen and sets an expectation.'),
      q('Why does Reza read a message twice?', 'To reduce misunderstanding before replying', 'To delay every response', 'To memorize the sender’s name', 'To make the message sound urgent', 'Careful reading supports accuracy.'),
      q('Which promise would follow Reza’s advice?', 'I will confirm the figures by 3 p.m. tomorrow', 'I will answer everything immediately', 'Maybe I will reply someday', 'I have read this but cannot explain when', 'A specific realistic time is both prompt and honest.'),
      q('What broader balance defines message adab?', 'Respecting another person’s work and one’s own boundaries', 'Always choosing speed over accuracy', 'Treating every request as an emergency', 'Avoiding written communication', 'The revised dialogue combines care, clarity, and sustainable availability.'),
    ],
  },
  {
    id: 'a2-adab-06', level: 'A2', scriptDecision: 'keep; mature disagreement story shows how acknowledgment lowers defensiveness without requiring false agreement',
    tags: { 0: 'thoughtful', 1: 'regretfully', 3: 'reflective', 4: 'calmly', 5: 'surprised', 7: 'openly', 8: 'honestly', 9: 'determined', 11: 'warmly', 13: 'peacefully' },
    additions: [
      q('Why did the colleague’s opening make listening easier?', 'It showed understanding before presenting disagreement', 'It proved the narrator was completely wrong', 'It ended the meeting quickly', 'It avoided sharing another idea', 'Acknowledgment reduced the need for immediate self-defense.'),
      q('Did the colleague’s politeness weaken her argument?', 'No, she explained the different plan clearly', 'Yes, nobody understood her', 'Yes, she changed her opinion', 'No, because she stayed silent', 'Respectful delivery and a strong idea existed together.'),
      q('What long-term cost did the narrator overlook?', 'Winning debates had damaged relationships', 'Meetings became more expensive', 'Coworkers stopped having plans', 'Every disagreement took less time', 'The old style achieved short-term victory but harmed trust.'),
      q('Why must the first positive point be genuine?', 'False praise would make the respectful opening dishonest', 'Every idea is equally good', 'The narrator needs a longer sentence', 'Disagreement is not allowed after praise', 'Adab requires sincerity, not a formula used to manipulate.'),
      q('What is the strongest evidence that the new approach works?', 'People consider the narrator’s opinion instead of only defending themselves', 'The narrator now wins every debate', 'Coworkers always agree immediately', 'Meetings contain no different ideas', 'Lower defensiveness allows real evaluation of the idea.'),
    ],
  },
  {
    id: 'a2-adab-07', level: 'A2', scriptDecision: 'revise; avoid compulsory gifts and unsafe phone storage while preserving attentive, respectful family visits',
    replaceText: [['Bringing a small gift every visit meant more to them than I expected.', 'Remembering a need or occasionally bringing something useful meant more than an expensive display.'], ['Simple things, like fruit, or something my mother-in-law mentioned she needed.', 'Sometimes fruit, or practical help with something my mother-in-law mentioned.'], ['so now I leave my phone in the car before we even arrive.', 'so now I silence my phone and keep it away, while allowing urgent family calls.'], ['respect comes before being right.', 'I choose a respectful time and wording instead of turning a visit into a debate.']],
    tags: { 0: 'warmly', 3: 'thoughtful', 5: 'gently', 7: 'honestly', 9: 'carefully', 11: 'reflective', 13: 'helpfully', 15: 'encouraging', 17: 'warmly' },
    baseQuiz: [
      q('Why can Andi speak from experience?', 'He has spent his first year of marriage visiting his wife’s parents', 'He teaches a professional family course', 'He lives with the podcast host', 'He has never met his in-laws', 'His lessons come from recent family visits.'),
      q('What does Andi value over an expensive display?', 'Remembering needs and offering useful care', 'Bringing a gift on every visit', 'Talking more than everyone', 'Correcting every opinion', 'Attention and practical thought matter more than price or frequency.'),
      q('How does Andi manage his phone now?', 'He silences and puts it away but allows urgent family calls', 'He leaves it unsecured in the car', 'He uses it during long conversations', 'He turns off all emergency contact', 'The revised habit balances attention and safety.'),
      q('How does Andi handle a disagreement?', 'He chooses respectful timing and wording', 'He pretends to agree with everything', 'He begins a debate during every visit', 'He asks his wife to argue for him', 'Respect does not require silence, but it shapes the conversation.'),
      q('What advice is given for a first visit?', 'Listen, arrive on time, and show patience', 'Bring an expensive gift', 'Avoid helping after meals', 'Speak often to appear confident', 'The closing advice emphasizes ordinary respectful behavior.'),
    ],
    additions: [
      q('Why is practical help a meaningful gesture?', 'It shows Andi remembered an earlier conversation', 'It guarantees the family will agree with him', 'It replaces the need to visit', 'It gives him control of the home', 'Remembering a stated need demonstrates attention.'),
      q('What first revealed the phone problem?', 'Andi’s wife explained that it bothered her father', 'The podcast host saw the visit', 'The phone stopped working', 'His father-in-law took the device', 'Feedback from his wife helped him understand how the habit appeared.'),
      q('Why does Andi offer to clean even when the offer is refused?', 'It shows he does not expect others to serve him', 'He wants to inspect the kitchen', 'He dislikes the meal', 'He plans to leave early', 'The offer communicates willingness to share work.'),
      q('Which behavior would contradict Andi’s lesson?', 'Turning every family difference into a debate', 'Listening during a long story', 'Arriving at the agreed time', 'Offering appropriate help', 'Not every disagreement needs to control a social visit.'),
      q('What makes the advice flexible rather than formulaic?', 'Care responds to the family’s real needs and boundaries', 'Every visit requires the same gift', 'A phone must always stay in a car', 'The guest must never speak', 'The revisions focus on attention instead of rigid rituals.'),
    ],
  },
  {
    id: 'a2-adab-08', level: 'A2', scriptDecision: 'keep; strong workplace case balances evidence, shared responsibility, tone, deadline, and cooperative correction',
    tags: { 0: 'annoyed', 1: 'impatient', 2: 'reflective', 3: 'surprised', 5: 'calmly', 7: 'relieved', 9: 'thoughtful', 11: 'firmly', 13: 'gently' },
    additions: [
      q('Why was listening to the first recording useful?', 'It showed how the tone might sound to the receiver', 'It proved the supplier was fully responsible', 'It corrected the written order', 'It delivered the message faster', 'Reviewing the voice note revealed meaning carried by tone.'),
      q('How was responsibility shared?', 'The supplier failed to confirm, while the office form was unclear', 'Only the narrator made an error', 'Only the supplier created the problem', 'Neither side had any role', 'The script avoids a one-sided accusation.'),
      q('What evidence accompanied the second message?', 'A photo beside the written order', 'A public complaint', 'A recording of the first delivery', 'A customer review', 'The photo made the correction specific and verifiable.'),
      q('Why did the solution become easier?', 'Both sides focused on fixing the process instead of protecting pride', 'The deadline disappeared', 'The wrong materials became usable', 'The supplier stopped responding', 'Cooperation allowed a replacement and a clearer future form.'),
      q('What does the story show about politeness?', 'It can remain direct about a real problem', 'It requires accepting every mistake', 'It means removing all deadlines', 'It is only about greeting first', 'The second note was respectful without hiding the needed result.'),
    ],
  },
  {
    id: 'a2-adab-09', level: 'A2', scriptDecision: 'keep; nuanced gathering story balances health needs, gratitude, older guests, host attention, and advance notice',
    tags: { 0: 'warmly', 1: 'concerned', 3: 'quietly', 4: 'understanding', 6: 'thoughtfully', 7: 'uncertain', 8: 'reflective', 10: 'calmly', 12: 'prepared', 13: 'gently' },
    additions: [
      q('Why did the narrator wait before speaking to the host?', 'The host was still serving tea', 'The narrator wanted everyone to notice', 'The medical appointment was canceled', 'The older guests were leaving', 'Waiting avoided interrupting the host’s immediate task.'),
      q('Why did the narrator decline dessert?', 'Enough food had already been eaten', 'The dessert looked unsafe', 'The host refused to pack it', 'The appointment required fasting', 'The narrator gives a simple honest reason without inventing an excuse.'),
      q('What does an “almost invisible” departure mean positively?', 'It respected the host without taking over the gathering', 'Nobody cared that the narrator attended', 'The narrator left without saying thanks', 'The host failed to notice a guest', 'A good exit did not become a second event.'),
      q('When would a longer explanation be appropriate?', 'If an emergency caused a sudden departure', 'Whenever tea is served', 'At every ordinary dinner', 'Only in a message the next day', 'The narrator distinguishes the simple plan from an urgent situation.'),
      q('How does advance notice improve future visits?', 'The host understands the guest’s time limit before the event', 'The guest can leave without thanks', 'Every conversation ends earlier', 'The appointment becomes unnecessary', 'Shared expectations remove awkwardness at departure time.'),
    ],
  },
  {
    id: 'a2-adab-10', level: 'A2', scriptDecision: 'keep; excellent reciprocal-feedback dialogue includes consent, limited scope, specificity, timing, and practice',
    tags: { 0: 'warmly', 1: 'nervous', 2: 'carefully', 4: 'helpfully', 7: 'relieved', 8: 'sincerely', 10: 'thoughtful', 12: 'openly', 14: 'encouraged', 16: 'warmly', 19: 'honestly' },
    additions: [
      q('Why does Safa request only one point?', 'She is still nervous and wants manageable feedback', 'The presentation had only one slide', 'Rania knows only one fact', 'They have no time to practice', 'Consent includes limiting the amount, not only saying yes or no.'),
      q('How does Rania avoid empty praise?', 'She names a real strength before a specific problem', 'She says everything was perfect', 'She hides the text issue', 'She uses sweet words without evidence', 'Accurate positive feedback supports trust.'),
      q('What does Safa’s slide change improve for the audience?', 'They can listen instead of reading a paragraph', 'They receive more sentences', 'They no longer need a conclusion', 'They can skip every example', 'Three phrases reduce competition between reading and listening.'),
      q('What test does Rania apply to advice?', 'Whether it helps the receiver rather than releases the giver’s frustration', 'Whether it sounds impressive', 'Whether it contains many criticisms', 'Whether it is delivered immediately', 'Purpose and timing determine whether honesty is useful.'),
      q('Why is reciprocal feedback successful here?', 'Both people can accept, delay, limit, and practice it', 'Both agree that every section is weak', 'Neither person asks permission', 'They compete to find more faults', 'Choice and specificity leave them clearer rather than smaller.'),
    ],
  },
];
