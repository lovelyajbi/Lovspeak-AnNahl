import { q } from '../helpers.mjs';

export const reviews = [
  {
    id: 'a1-adab-01', level: 'A1', scriptDecision: 'keep; coherent personal story with a few long sentences but clear A1 context',
    tags: { 0: 'reflective', 2: 'warmly', 8: 'thoughtful', 12: 'warmly' },
    additions: [
      q('Why did the neighbor’s greeting stay in her mind?', 'She felt noticed and cared for', 'The neighbor gave her a phone', 'The greeting lasted all day', 'Her family was waiting outside', 'The neighbor gave her full attention, so the short greeting felt important.'),
      q('What does “put my phone away” mean here?', 'Stop using it during the greeting', 'Give it to the neighbor', 'Turn up its sound', 'Buy a different phone', 'She stops looking at the phone so she can focus on the person.'),
      q('What does she do after saying salaam?', 'She listens to the answer', 'She walks away quickly', 'She checks a message', 'She changes the subject', 'She now stays present and listens instead of preparing to leave.'),
      q('How will a person probably feel after her new greeting?', 'Respected', 'Ignored', 'Rushed', 'Confused', 'Her eye contact and attention help the other person feel respected.'),
      q('Why does the narrator tell this story?', 'To show that a small greeting can build closeness', 'To explain how phones are repaired', 'To ask people to avoid neighbors', 'To compare different family names', 'The story shows how a sincere greeting improves relationships.'),
    ],
  },
  {
    id: 'a1-adab-02', level: 'A1', scriptDecision: 'keep; podcast format is clear, adult, and understandable with contextual support',
    tags: { 0: 'warmly', 1: 'pleased', 2: 'curious', 3: 'calmly', 16: 'warmly', 17: 'gratefully' },
    additions: [
      q('Which rule helps students focus during a conversation?', 'Put the phone face down', 'Open the office door', 'Speak before the elder', 'Leave the room quickly', 'Sari asks students to put phones face down so they can pay attention.'),
      q('What does “timeless” mean in this podcast?', 'Useful in every time', 'Only useful in the past', 'New and expensive', 'Difficult to remember', 'Sari means that good manners remain useful in every age.'),
      q('Why does Sari teach small actions first?', 'Small actions build respectful habits', 'Large actions are not allowed', 'Students dislike every rule', 'The class has little time', 'She says respect in small moments supports respect in bigger moments.'),
      q('What does Sari value most while someone is speaking?', 'Full attention', 'A quick answer', 'A loud voice', 'A long message', 'Her examples repeatedly ask learners to look and listen carefully.'),
      q('What is the podcast trying to do?', 'Give simple examples of good manners', 'Advertise a new phone', 'Test a school subject', 'Describe an office building', 'The host and guest explain adab through common daily actions.'),
    ],
  },
  {
    id: 'a1-adab-03', level: 'A1', scriptDecision: 'keep; natural coworker exchange with concrete table manners',
    tags: { 0: 'curious', 1: 'warmly', 6: 'laughing', 16: 'thoughtful', 17: 'warmly' },
    additions: [
      q('Why does Fajar wait before eating?', 'He wants the meal to feel shared', 'He is waiting for another plate', 'He does not like the food', 'He wants to eat alone', 'Waiting for everyone makes the meal feel shared instead of rushed.'),
      q('What should Dewi do when food is far away?', 'Ask someone to pass it', 'Reach across the whole table', 'Stand on the chair', 'Leave the meal', 'Fajar says it is better to ask than reach across other people.'),
      q('What does “awkward” mean when Dewi says it?', 'Unsure and uncomfortable', 'Very hungry', 'Angry with Fajar', 'Ready to leave', 'Dewi feels unsure about the polite way to take shared food.'),
      q('How can a smaller first portion help?', 'It can reduce wasted food', 'It makes the plate heavier', 'It ends the conversation', 'It keeps food far away', 'A person can take more later instead of leaving food uneaten.'),
      q('How does Fajar respond to Dewi’s mistakes?', 'He gives friendly advice', 'He laughs at her habits', 'He reports her to work', 'He refuses to eat', 'He explains the habits kindly and says everyone learns slowly.'),
    ],
  },
  {
    id: 'a1-adab-04', level: 'A1', scriptDecision: 'revise selected abstract phrases; keep the strong personal memory',
    replaceText: [
      ["this habit protects everyone's dignity, and it shows that you value the other person's comfort, not just your own convenience", "this habit helps everyone feel safe and respected. It shows that you care about the other person, not only what is easy for you"],
      ['these rules were too formal, almost old-fashioned for modern life', 'these rules were too serious and old-fashioned for modern life'],
    ],
    tags: { 0: 'warmly', 1: 'reflective', 9: 'thoughtful', 11: 'softly', 12: 'warmly' },
    additions: [
      q('How did the grandfather correct the child?', 'He asked a calm question', 'He shouted across the house', 'He hid the newspaper', 'He called another person', 'The grandfather calmly asked whether permission had been given.'),
      q('What are “belongings” in this story?', 'Things that someone owns', 'Rooms in a house', 'Words in a newspaper', 'Lessons at school', 'The word refers to another person’s objects or possessions.'),
      q('What should happen before entering a family home?', 'Knock and greet first', 'Walk in without speaking', 'Take something from the room', 'Wait outside all day', 'The grandfather teaches the narrator to knock and greet before entering.'),
      q('Why did friends find the narrator easy to trust?', 'He asked before borrowing things', 'He owned many newspapers', 'He spoke very loudly', 'He visited without asking', 'His habit showed respect for other people’s property and space.'),
      q('What does “May I?” show in the story?', 'Respect', 'Fear', 'Hurry', 'Surprise', 'The simple question asks permission and shows respect.'),
    ],
  },
  {
    id: 'a1-adab-05', level: 'A1', scriptDecision: 'keep; emotionally clear phone apology with natural adult context',
    tags: { 0: 'regretfully', 1: 'calmly', 7: 'warmly', 10: 'determined', 16: 'relieved', 17: 'warmly' },
    additions: [
      q('What does Yusuf do first to repair the problem?', 'He calls his father', 'He sends food to work', 'He avoids the family dinner', 'He asks his brother to speak', 'Yusuf directly calls his father and begins an honest apology.'),
      q('What does “frustration rising” mean?', 'Starting to feel upset', 'Becoming very sleepy', 'Feeling ready to eat', 'Beginning to laugh', 'The father means the moment when angry feelings begin to grow.'),
      q('What is the father’s tone during the call?', 'Calm and forgiving', 'Cold and impatient', 'Loud and mocking', 'Confused and careless', 'He listens, forgives Yusuf, and gives gentle advice.'),
      q('Why is tiredness not a good excuse for Yusuf?', 'It does not make rude speech right', 'It means dinner must stop', 'It makes every parent angry', 'It prevents all phone calls', 'Yusuf accepts that being tired does not excuse disrespect.'),
      q('What makes Yusuf’s apology sincere?', 'He names his mistake and plans to change', 'He asks his father to forget it', 'He blames his work completely', 'He speaks only about dinner', 'He accepts responsibility, apologizes, and explains what he will do next.'),
    ],
  },
  {
    id: 'a1-adab-06', level: 'A1', scriptDecision: 'keep; focused reflection on specific gratitude, distinct from the greeting lesson',
    tags: { 0: 'thoughtful', 2: 'warmly', 6: 'reflective', 10: 'warmly', 13: 'warmly' },
    additions: [
      q('Why did the coworker’s thanks feel special?', 'It explained why the help mattered', 'It came with an expensive gift', 'It was written in a report', 'It lasted for an hour', 'The coworker used her name and described the value of her help.'),
      q('What does “overlooked” mean here?', 'Not often noticed', 'Unable to work', 'New to the city', 'Ready to speak', 'Drivers, cleaners, and shopkeepers may not receive enough thanks.'),
      q('What does the narrator do before saying thank you now?', 'She thinks about the exact reason', 'She checks who is watching', 'She writes a long letter', 'She waits until the next day', 'A short pause helps her give clear and honest thanks.'),
      q('Why did people respond differently to her new thanks?', 'The words were clear and personal', 'The words were much louder', 'She thanked only close friends', 'She stopped using names', 'Specific words made people feel that their work was truly noticed.'),
      q('Which thank-you best follows her new habit?', 'Thank you for helping me finish the report', 'Thanks for everything', 'Okay, thank you', 'I saw your message', 'Her new habit names the helpful action clearly.'),
    ],
  },
  {
    id: 'a1-adab-07', level: 'A1', scriptDecision: 'keep; radio call-in is concrete and offers a different listening format',
    tags: { 0: 'cheerfully', 1: 'warmly', 3: 'reflective', 10: 'warmly', 16: 'warmly', 17: 'gratefully' },
    additions: [
      q('Why should someone sit with a guest?', 'So the guest is not left alone', 'So the guest eats faster', 'So the house stays quiet', 'So nobody opens the door', 'The grandmother says someone should talk with a guest, even briefly.'),
      q('How should the family treat an unexpected guest?', 'Welcome the guest warmly', 'Complain about the visit', 'Ask the guest to return', 'Hide the untidy room', 'Her grandmother says a surprise guest still deserves a warm welcome.'),
      q('What does “hospitality” mean in this segment?', 'Caring well for guests', 'Cleaning every room', 'Calling before a visit', 'Preparing a radio show', 'The word describes welcoming and caring for visitors.'),
      q('How has the family changed?', 'They now walk guests to the door', 'They no longer offer drinks', 'They avoid surprise visitors', 'They sit in separate rooms', 'The family now follows the grandmother’s goodbye habit.'),
      q('Why does the caller share this story?', 'To encourage warmer welcomes', 'To ask for a perfect house', 'To advertise her grandmother’s car', 'To explain a monthly visit', 'She hopes listeners will greet their next guest more warmly.'),
    ],
  },
  {
    id: 'a1-adab-08', level: 'A1', scriptDecision: 'simplify the final reflection; keep the clear bus story',
    replaceText: [
      ['I had nearly protected my comfort while another person struggled in front of me.', 'I had nearly chosen my own comfort while another person needed help.'],
      ['That short ride taught me to notice first, decide quickly, and help with a sincere heart.', 'That short ride taught me to notice people and help without waiting for praise.'],
    ],
    tags: { 0: 'tired', 3: 'regretfully', 7: 'reflective', 12: 'warmly' },
    additions: [
      q('Why did the narrator wait at first?', 'He was tired and wanted the seat', 'He did not see the older man', 'The bus was at the last stop', 'The schoolboy asked him to wait', 'He thought about his own difficult day and hoped someone else would stand.'),
      q('What made him decide to stand?', 'He saw the schoolboy begin to rise', 'The driver called his name', 'The older man dropped both bags', 'The bus became empty', 'Seeing another tired person ready to help made him feel ashamed.'),
      q('How did the narrator feel after giving the seat?', 'Better about his choice', 'Angry with the schoolboy', 'Afraid of the older man', 'Worried about the rain', 'The small helpful action changed his mood at once.'),
      q('What does the older man mean by “make a hard journey easier”?', 'Small help can reduce another person’s difficulty', 'Every bus ride should be short', 'Heavy bags should stay at home', 'Rain always improves travel', 'A simple seat can make travel safer and less tiring.'),
      q('What will the narrator probably do on his next bus ride?', 'Look for anyone who needs a seat', 'Always stand near the driver', 'Carry bags for every passenger', 'Avoid speaking to older people', 'He says he now looks around before choosing to sit.'),
    ],
  },
  {
    id: 'a1-adab-09', level: 'A1', scriptDecision: 'simplify two abstract phrases; keep the well-paced guest story',
    replaceText: [
      ['A guest is not a performer who must entertain us as soon as they arrive.', 'A guest does not have to answer every question as soon as they arrive.'],
      ['my timing was not considerate', 'I had asked at the wrong time'],
    ],
    tags: { 0: 'excited', 2: 'gently', 5: 'warmly', 8: 'reflective', 12: 'warmly' },
    additions: [
      q('What showed that Hana was tired?', 'Her voice was quiet', 'She asked many questions', 'She carried no bag', 'Her train was early', 'Hana answered politely, but her quiet voice showed low energy.'),
      q('What changed after Hana rested?', 'She spoke with more energy', 'She left the house', 'She stopped speaking', 'She asked for another train', 'Rest helped Hana feel ready to share her journey.'),
      q('Why were the narrator’s first questions a problem?', 'They came before Hana could rest', 'They were about the wrong person', 'They were written on paper', 'They were asked after dinner', 'The questions were friendly, but the time was not right.'),
      q('How did the narrator welcome the next visitor?', 'He offered help, a drink, and rest', 'He asked many questions at the door', 'He left the visitor alone outside', 'He asked the visitor to cook', 'He used his mother’s lesson during the next visit.'),
      q('What does the story teach about welcoming travelers?', 'Meet their needs before asking for stories', 'Prepare many difficult questions', 'Keep every visit very short', 'Wait for visitors to request water', 'A tired traveler may first need water, food, prayer, privacy, or quiet.'),
    ],
  },
  {
    id: 'a1-adab-10', level: 'A1', scriptDecision: 'keep; realistic workplace correction with clear cause and repair',
    tags: { 0: 'gently', 3: 'surprised', 5: 'regretfully', 10: 'calmly', 16: 'warmly', 19: 'warmly' },
    additions: [
      q('Why did Naila stay quiet in the meeting?', 'She did not want to interrupt', 'She had forgotten her own name', 'She was writing the notes', 'She had left the room', 'Naila looked uncomfortable but did not want to interrupt Rafi publicly.'),
      q('What does “defensive” mean here?', 'Unwilling to accept correction', 'Ready to help quickly', 'Unable to hear a name', 'Happy about a mistake', 'Lina says some people react badly instead of listening to correction.'),
      q('What should Rafi correct after speaking to Naila?', 'Her name in the meeting notes', 'The time of the meeting', 'Lina’s phone number', 'The office lunch order', 'The written notes could cause more people to repeat the wrong name.'),
      q('Why should the apology stay brief?', 'A long public message may embarrass Naila', 'Rafi has no time before lunch', 'The group chat is closed', 'Lina wants to write it herself', 'A simple private apology fixes the problem without adding attention.'),
      q('What helped the correction end well?', 'Lina spoke kindly and Rafi listened', 'Naila left the company', 'The team ignored the mistake', 'Rafi changed the new colleague', 'Kind delivery and a calm response allowed the mistake to be repaired.'),
    ],
  },
];
