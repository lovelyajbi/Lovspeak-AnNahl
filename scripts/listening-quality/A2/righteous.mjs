import { q } from '../helpers.mjs';
import { replacementBaseQuiz } from './replacement-base-quizzes.mjs';

const R = (id, decision, additions, extra = {}) => ({
  id: `a2-righteous-${id}`,
  level: 'A2',
  scriptDecision: decision,
  tags: { 0: 'thoughtful', 2: 'gently', 4: 'carefully', 6: 'reflective', 8: 'honestly', 10: 'warmly', 12: 'sincere' },
  additions,
  ...(extra.replaceScript ? { baseQuiz: replacementBaseQuiz[`a2-righteous-${id}`] } : {}),
  ...extra,
});

export const reviews = [
  R('01', 'revise; preserve quiet charity while removing the idea that every useful discussion destroys sincerity', [
    q('Why does the narrator pay without giving his name?', 'He wants to protect the woman from embarrassment and obligation', 'He wants the cashier to praise him later', 'He expects free medicine next month', 'He does not know how much is missing', 'Privacy protects the receiver as well as the giver.'),
    q('What does “performing for an audience” mean here?', 'Doing or telling a deed mainly to gain people’s approval', 'Speaking clearly to a cashier', 'Paying while other customers are present', 'Working in a public building', 'The phrase describes a change in intention.'),
    q('Which detail shows that the narrator still has mixed feelings?', 'He wants to tell someone because he feels proud', 'He forgets the pharmacy address', 'He asks for his money back', 'He knows the woman’s full name', 'The desire for praise remains after the action.'),
    q('When could speaking about charity still be useful?', 'When necessary for advice or transparent reporting without exposing the receiver', 'Whenever the giver wants attention', 'Only when the amount is very large', 'Never under any condition', 'The revised ending gives a careful exception.'),
    q('What lesson joins intention with respectful charity?', 'Protect sincerity and the dignity of the person receiving help', 'Every donation must be secret from one’s family', 'Cashiers should decide who deserves medicine', 'Feeling proud always cancels a good deed', 'The focus is intention joined with respectful help.'),
  ], { replaceText: [
    ['He always said that a good deed shared too quickly often loses its sincerity, because part of us starts performing for an audience.', 'He said that sharing a deed can endanger sincerity when the real goal becomes praise from an audience.'],
    ['I have learned that some good deeds are meant to stay between you, the moment, and Allah, without ever becoming a story you tell later.', 'I learned to protect both sincerity and her dignity. A deed may sometimes be discussed for advice or honest reporting, but her private need should never become my proud story.'],
  ] }),

  R('02', 'replace; make the father a participant in a safe care plan instead of an object the brothers move without consultation', [
    q('Why do the brothers need a new plan?', 'Their father fell and his current home may not be safe', 'Their father wants to sell both apartments', 'Fikri is leaving his job tomorrow', 'Yusuf needs help paying rent', 'The fall triggers a safety review, not an automatic decision for him.'),
    q('Who must be included before a final living decision?', 'Their father and relevant health professionals', 'Only the brother with the larger home', 'The youngest family member', 'The apartment manager alone', 'The plan respects the father’s voice and actual care needs.'),
    q('What can Yusuf offer immediately?', 'A temporary room and help arranging an assessment', 'A permanent move without discussion', 'Full-time medical treatment', 'A promise that no further fall can happen', 'His offer is practical but does not exceed his role.'),
    q('How can Fikri share responsibility?', 'Handle appointments, costs, visits, and parts of the weekly schedule', 'Visit only when he feels guilty', 'Make Yusuf manage every task', 'Choose treatment without permission', 'Care is divided into clear actions.'),
    q('What does careful planning show?', 'Love can include honest limits, consent, and reliable support', 'The father has lost all independence', 'One son loves the father more', 'Family care never needs outside help', 'The dialogue rejects guilt as the only guide.'),
  ], {
    title: 'Two Brothers Plan Safer Care With Their Father',
    speakers: [{ name: 'Yusuf', gender: 'male' }, { name: 'Fikri', gender: 'male' }],
    replaceScript: [
      'Yusuf: [tired] Fikri, we need to discuss Father’s safety after his fall, but I do not want us to decide his life without him.',
      'Fikri: [thoughtful] I agree. Has the clinic explained why he fell or what support he may need?',
      'Yusuf: Not yet. He was treated for the injury, but a fuller assessment is booked for Thursday.',
      'Fikri: [concerned] Good. My apartment is small and my work hours are long, so I cannot promise daily care alone.',
      'Yusuf: That is an honest limit, not a lack of love. I have an extra room, but Father may prefer to stay near his neighbors.',
      'Fikri: [reflective] Could he stay with you temporarily while we check safer options with him?',
      'Yusuf: Yes, if he agrees. We can also ask about handrails, medicine review, transport, and support at home.',
      'Fikri: I can attend appointments, manage a shared calendar, and cover part of any agreed care costs.',
      'Yusuf: [warmly] I can handle mornings during the temporary stay. We should also plan breaks so neither of us becomes exhausted.',
      'Fikri: What if Father refuses every change?',
      'Yusuf: We listen to his reasons and explain the risks calmly. If his decision-making ability is in question, we ask qualified professionals for guidance.',
      'Fikri: [gently] That is better than using one fall to remove all his independence.',
      'Yusuf: Exactly. Safety matters, and so do dignity and choice.',
      'Fikri: I felt guilty because I thought a good son should be available every hour.',
      'Yusuf: [honestly] Reliable care is more important than an impossible promise. We can include relatives or paid support if Father accepts it.',
      'Fikri: Then tonight we ask what he wants, explain what each of us can do, and write questions for the clinic.',
      'Yusuf: We will make a temporary plan first and review it after the assessment.',
      'Fikri: [relieved] I like that. No competition over who sacrifices more—just clear responsibilities and regular review.',
      'Yusuf: And Father remains part of every decision that concerns him.',
      'Fikri: [sincere] Agreed. Let us call him together and begin by listening.',
    ],
    tags: { 0: 'tired', 1: 'thoughtful', 3: 'concerned', 5: 'reflective', 8: 'warmly', 11: 'gently', 14: 'honestly', 17: 'relieved', 19: 'sincere' },
  }),

  R('03', 'replace; remove unsafe doorstep contact and model secure return through official lost-property staff', [
    q('Why does the narrator avoid using the address?', 'A home visit could be unsafe and the card may be outdated', 'The address is written in another language', 'The train has already left', 'The wallet has no identity card', 'Honesty does not require unnecessary personal risk.'),
    q('What proof does the narrator request?', 'A receipt or reference number from official staff', 'A photograph for social media', 'A reward from the owner', 'The owner’s bank password', 'A record creates accountability for the handover.'),
    q('Why is the cash temptation especially strong?', 'The narrator’s rent is overdue', 'The wallet contains no cards', 'The station is closed', 'The narrator knows the owner', 'Financial pressure makes the ethical choice more difficult.'),
    q('How can the owner safely recover the wallet?', 'By identifying its contents through the station process', 'By meeting the finder alone at night', 'By posting the address publicly', 'By paying the finder first', 'Verification protects the property from a false claim.'),
    q('What remains unchanged after the honest action?', 'The narrator still needs a lawful plan for overdue rent', 'The rent is automatically paid', 'The station gives a cash prize', 'The owner offers a job', 'The story avoids a convenient reward ending.'),
  ], {
    title: 'The Wallet at the Train Station',
    replaceScript: [
      'Narrator: [thoughtful] Yesterday evening, I found a leather wallet near a train platform. It looked as if it had fallen from someone’s bag.',
      'Narrator: Inside were bank cards, an identity card, and enough cash to cover much of my overdue rent.',
      'Narrator: [honestly] For a moment, that money looked like an answer to my own problem. No one nearby seemed to have seen me pick it up.',
      'Narrator: Then I imagined losing my cards and money in a crowded station. I would want the finder to protect them.',
      'Narrator: [carefully] The identity card showed a home address, but I decided not to arrive at a stranger’s door. The address could be old, and a private meeting might be unsafe.',
      'Narrator: I carried the wallet to the staffed station office and described exactly where and when I had found it.',
      'Narrator: [reflective] The officer counted the cash with a second employee, recorded the cards, and placed everything in a secure bag.',
      'Narrator: I asked for a reference number so there would be a clear record of the handover.',
      'Narrator: The station could contact the owner through an official process. A person claiming it would need to identify important details.',
      'Narrator: [gently] I did not photograph the identity card or post the owner’s name online. Returning property should not create a privacy problem.',
      'Narrator: On the way home, my rent was still overdue. Honesty had not solved that difficulty.',
      'Narrator: [determined] I contacted my landlord before the deadline, explained what I could pay, and asked to agree on a written schedule.',
      'Narrator: That plan was less dramatic than finding a wallet, but it addressed my problem lawfully.',
      'Narrator: [warmly] The next day, the station messaged that the owner had collected the wallet after verification.',
      'Narrator: I felt relieved, but I did not see the event as proof that I was better than anyone else.',
      'Narrator: [sincere] The real test was simple: protect another person’s property while facing my own need, then take honest responsibility for my situation.',
    ],
    tags: { 0: 'thoughtful', 2: 'honestly', 4: 'carefully', 6: 'reflective', 9: 'gently', 11: 'determined', 13: 'warmly', 15: 'sincere' },
  }),

  R('04', 'revise; add reporting and fair exam handling rather than merely deleting leaked questions', [
    q('Why is deleting the photos alone not enough?', 'The leak can still make the exam unfair for the whole class', 'Deleted photos always return', 'Their notes contain the same questions', 'The students have already failed', 'The institution needs to know before using the compromised exam.'),
    q('What should they send the instructor?', 'A private report with enough evidence to investigate', 'The leaked images in another group', 'A list of students to punish publicly', 'Their predicted grades', 'Reporting should limit further distribution.'),
    q('What does Wulan challenge in Doni’s argument?', 'Other people’s cheating does not make cheating acceptable', 'Exams should never affect grades', 'Studying together is forbidden', 'All group chats are unreliable', 'She identifies the faulty reasoning.'),
    q('How should the school respond fairly?', 'Investigate and replace or adjust the compromised assessment', 'Ignore the leak after one deletion', 'Give Doni the highest grade', 'Publish every student’s messages', 'A system-level response protects honest students.'),
    q('What does Doni finally choose?', 'Report the leak, delete it, and study from legitimate notes', 'Memorize only one page', 'Leave the class group forever', 'Wait until after the exam to speak', 'His choice combines integrity with corrective action.'),
  ], { replaceText: [
    ['Let\'s study together tonight instead, properly, using our actual notes, and whatever grade we get will at least belong to us.', 'Let’s report the leak privately now, avoid forwarding it, and study from our real notes. The school may need to replace the exam.'],
    ['Okay. Delete the photos from your phone too. I don\'t want the temptation sitting there tomorrow morning before the exam.', 'Okay. I will save only the minimum evidence for a private report, then delete the images. We should not accuse classmates publicly.'],
    ['Already deleting mine. Now, pass me your notes on chapter six, because I still don\'t understand half of it.', 'I will contact the instructor through the official channel. Now pass me your chapter-six notes; I still need to understand them.'],
    ['Deal. Let\'s earn this one the hard way, together.', 'Deal. We will act honestly and help the school make the assessment fair.'],
  ] }),

  R('05', 'revise; distinguish accidental overpayment from a voluntary tip and keep the currency-help lesson practical', [
    q('Why is the tourist vulnerable to a payment mistake?', 'He is tired and unfamiliar with the currency', 'The driver changes the meter', 'The hotel refuses cash', 'He has no luggage', 'The setting explains the accidental overpayment.'),
    q('What makes keeping the first extra amount dishonest?', 'The tourist gave it by mistake while trusting the driver to calculate', 'All tips are forbidden', 'The driver has finished work', 'The hotel is nearby', 'Consent to the correct fare is not consent to four times the fare.'),
    q('How does the narrator prevent a similar problem?', 'He counts money in front of passengers and shows the fare clearly', 'He refuses every foreign passenger', 'He accepts only folded cash', 'He stops driving at night', 'The revised ending turns integrity into a better process.'),
    q('If the tourist offers a tip after understanding the fare, what changes?', 'It is now a separate informed choice that can be accepted or declined', 'It becomes the original fare', 'The tourist loses the right to choose', 'The driver must accept it', 'The script separates mistake from voluntary generosity.'),
    q('What is the strongest evidence of the driver’s intention?', 'He returns when tired and explains the exact difference', 'His family praises him', 'The tourist speaks another language', 'The lobby is open', 'Costly corrective action supports the claim of honesty.'),
  ], { replaceText: [
    ['I told him gently that returning it wasn\'t generosity on my part, it was simply what honesty required of me that night.', 'I explained that returning the accidental overpayment was required. If he freely chose a tip after seeing the correct fare, that would be a separate decision.'],
    ['He shook my hand for a long moment before finally going upstairs, and I drove home feeling something warmer than any large tip could have given me.', 'He thanked me and chose a small tip after checking the fare. I accepted it, then drove home relieved that the payment was clear.'],
    ['My family still doesn\'t fully understand why I turned down that extra money during such a tiring week, but I\'ve never once regretted the decision.', 'Since that night, I count unfamiliar notes with passengers, point to the meter, and confirm both the fare and any tip before we separate.'],
  ] }),

  R('06', 'replace; protect the teenager’s consent and privacy before sharing his quiet mosque service publicly', [
    q('Why does the host pause the story?', 'The teenager has not yet agreed to have his private deed shared', 'The radio signal is weak', 'The mosque is closed', 'The caller forgot the story', 'Good intentions do not remove another person’s privacy.'),
    q('What permission does the son later give?', 'The lesson may be shared without his name, location, or identifying details', 'His full interview may be broadcast', 'His friends may be named', 'The mosque may post his photograph', 'His consent is limited and specific.'),
    q('Why did the son begin helping?', 'He noticed the caretaker needed support and asked what was useful', 'His parents ordered him to do it', 'He wanted a public award', 'The host offered payment', 'The service responds to a real need and proper coordination.'),
    q('Which detail protects safety as well as sincerity?', 'The caretaker knows when he comes and supervises appropriate tasks', 'He enters any building alone', 'He hides the work from all adults', 'He cleans electrical equipment', 'Private worship does not require unsafe secrecy.'),
    q('What is the program’s main lesson?', 'Ask consent before turning someone’s quiet goodness into content', 'Young people should never volunteer', 'Every good deed should be announced', 'Parents own their children’s stories', 'Respect for the volunteer is part of respecting the deed.'),
  ], {
    title: 'May I Share My Son’s Quiet Service?',
    replaceScript: [
      'Radio Host: [warmly] Good evening. Ibu Sari is calling with a story about her teenage son. Before we begin, has he agreed to have it shared?',
      'Caller: [hesitant] I did not ask him. I planned to leave out his name.',
      'Radio Host: An unnamed story can still be recognized by relatives, friends, or people at the location.',
      'Caller: [thoughtful] You are right. He values privacy, so I should not turn his deed into my story without permission.',
      'Radio Host: Could we pause and continue another day after you ask him?',
      'Caller: Yes. I appreciate the reminder.',
      'Radio Host: [warmly] Ibu Sari is back with us one week later. What did your son decide?',
      'Caller: He allowed me to share the lesson, but not his name, our area, the mosque, or details that identify him.',
      'Radio Host: Thank you for respecting those limits. What can you tell us?',
      'Caller: [reflective] He noticed that a mosque caretaker needed help before a busy weekly prayer. He asked which tasks were safe and useful.',
      'Radio Host: So the caretaker knew about the work?',
      'Caller: Yes. The caretaker arranges the time and supervises suitable tasks. My son does not enter an empty building secretly.',
      'Radio Host: [curious] Why did he avoid telling friends?',
      'Caller: He wanted to protect his intention and did not want praise to become the reason he continued.',
      'Radio Host: Did he say that every good deed must remain unknown?',
      'Caller: [carefully] No. Records and teamwork may be necessary. He simply prefers not to seek attention for this service.',
      'Radio Host: What did you learn as his mother?',
      'Caller: Pride in my child does not give me ownership of his private experiences.',
      'Radio Host: [gently] That is an important lesson for families and content creators.',
      'Caller: Yes. We can encourage goodness without exposing the person, the place, or people receiving help.',
      'Radio Host: Thank you. Today’s story is also about consent: ask before sharing, and accept the answer.',
      'Caller: [sincerely] And if permission is limited, share only what was clearly allowed.',
    ],
    tags: { 0: 'warmly', 1: 'hesitant', 3: 'thoughtful', 6: 'warmly', 9: 'reflective', 12: 'curious', 15: 'carefully', 18: 'gently', 21: 'sincerely' },
  }),

  R('07', 'revise; strengthen honest product disclosure and avoid implying unexplained secrecy is automatically more sincere', [
    q('Why did customers trust the grandmother?', 'She described quality and defects honestly', 'She always charged the lowest price', 'She never spoke to customers', 'She sold only perfect fabric', 'Trust came from complete information.'),
    q('What does the torn fabric teach?', 'Silence can mislead when a seller knows an important defect', 'Customers should inspect everything alone', 'A tear always makes fabric worthless', 'Only spoken lies are dishonest', 'A material fact must not be hidden.'),
    q('How does the narrator apply the lesson online?', 'She names materials, measurements, care needs, and known defects clearly', 'She uses vague answers to gain sales', 'She copies a competitor’s description', 'She stops answering questions', 'Digital selling still requires useful disclosure.'),
    q('Why can the business grow more slowly?', 'Honest answers sometimes lead customers not to buy', 'The products have no photographs', 'The grandmother sets every price', 'Returning customers pay less', 'Integrity may carry a short-term commercial cost.'),
    q('What would make the tribute clearer without seeking praise?', 'Explain the name truthfully when the business story is relevant', 'Invent a marketing legend', 'Hide all business history', 'Claim the grandmother made every item', 'Honesty also applies to brand stories.'),
  ], { replaceText: [
    ['Sometimes a customer would ask if a piece was real silver, and part of me wanted to stay vague, because vague answers sold more products.', 'Customers asked about silver, measurements, care, and small defects. Vague answers could increase sales but would hide information needed for a fair choice.'],
    ['But I remembered her fabric stall, and I started answering every question completely, even when the honest answer occasionally lost me a sale.', 'I remembered her stall and wrote clear product descriptions, including materials and known limits, even when an honest answer lost a sale.'],
    ['I named my business after her last month, quietly, without announcing why, because some tributes feel more honest when they aren\'t explained to everyone.', 'I named the business after her. I do not use her memory as an emotional sales trick, but I explain the true connection when the brand story is relevant.'],
  ] }),

  R('08', 'keep; already models privacy, financial controls, transparent reporting, and dignified aid', [
    q('Why does the owner reject emotional family details?', 'A difficult private week should not become public content', 'The families refuse all food', 'Reports are more emotional', 'The creator cannot record video', 'Aid must not trade dignity for attention.'),
    q('What does “accountability” mean in this project?', 'Showing how money was counted and used', 'Showing every receiver’s face', 'Trusting the owner without records', 'Counting video views', 'Receipts and reports make funds answerable.'),
    q('Why do two volunteers count the money?', 'A second person reduces mistakes and misuse', 'The box is too heavy', 'Families choose the total', 'The creator requests it', 'A sound system does not depend on one reputation.'),
    q('How does numbered collection protect families?', 'It reduces attention while organizing different pickup times', 'It removes the need for records', 'It lets donors choose recipients', 'It increases the queue', 'The system supports privacy and order together.'),
    q('Which summary best fits the monologue?', 'Sincere aid needs both compassionate intention and reliable controls', 'Private projects should publish no information', 'Popular videos guarantee better charity', 'Only large shops can protect dignity', 'The final lines unite intention, systems, and privacy.'),
  ]),

  R('09', 'keep; already demonstrates anonymization, relevant-data limits, two-person review, and blame-free system repair', [
    q('Why might deleting the signature be insufficient?', 'Other details may still identify the applicant locally', 'The committee needs the full email', 'Signatures decide eligibility', 'The name appears only on paper', 'Re-identification can happen through context.'),
    q('What information must the neutral summary preserve?', 'Facts relevant to scholarship eligibility', 'Every family member’s name', 'The volunteer’s opinion', 'The applicant’s full workplace', 'Anonymization should not change the fair decision basis.'),
    q('Why will Jamal check Samira’s review?', 'Sensitive data is safer with a second careful review', 'Samira cannot edit a spreadsheet', 'The meeting is already over', 'Jamal wants to rank applicants alone', 'Two-person checking catches overlooked identifiers.'),
    q('Why do they avoid blaming the volunteer?', 'The instructions and example also failed to guide the action', 'The copied email is harmless', 'Volunteers cannot learn privacy rules', 'No correction is needed', 'They repair both the error and its system cause.'),
    q('What does “make the right action easy” imply?', 'Forms and training should guide safe data entry', 'Reviewers should depend on memory', 'Applicants should remove all evidence', 'Only managers may see spreadsheets', 'Design can prevent repeated mistakes.'),
  ]),

  R('10', 'keep; already presents evidence-based correction without assuming the higher or lower total is automatically true', [
    q('Why does Arman not immediately demand forty-six hours?', 'The coordinator may have valid counted time missing from his log', 'He wants to hide all volunteering', 'The certificate cannot be changed', 'Zaki recorded every event', 'He seeks the verified number, not a preferred number.'),
    q('What tone should Arman use?', 'Thankful, factual, and non-accusing', 'Angry and public', 'Silent until after submission', 'Apologetic for volunteering', 'A calculation question can be respectful.'),
    q('What does the personal log provide?', 'Dates and activities that can be compared with the certificate', 'Proof that every event lasted five hours', 'A replacement certificate', 'A job offer', 'Specific evidence supports review.'),
    q('When should Arman upload the certificate?', 'After asking for and resolving the calculation', 'Before checking because sixty looks better', 'Only if the hours are reduced', 'After deleting his own log', 'He avoids making a claim he already doubts.'),
    q('What broader principle does the dialogue teach?', 'Honesty follows verified facts even when an error flatters us', 'Honesty always selects the smaller number', 'Official documents cannot contain mistakes', 'Applications should omit volunteer work', 'Truth is neither self-serving nor automatically self-harming.'),
  ]),
];
