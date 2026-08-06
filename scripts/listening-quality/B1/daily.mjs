import { q } from '../helpers.mjs';

const R = (id, decision, additions, extra = {}) => ({
  id: `b1-daily-${id}`,
  level: 'B1',
  scriptDecision: decision,
  tags: { 0: 'thoughtful', 2: 'carefully', 4: 'reflective', 6: 'honestly', 8: 'seriously', 10: 'gently', 12: 'encouraging', 14: 'sincere', 16: 'thoughtful', 18: 'carefully' },
  additions,
  ...extra,
});

export const reviews = [
  R('01', 'revise; identify Salma and Bayu as adult siblings and include time, effort, frequency, ability, safety, preference, invisible planning, and review rather than crude task points', [
    q('Why was counting tasks misleading?', 'Tasks differed in time, effort, frequency, and invisible planning', 'Rubbish was never removed', 'Bathroom cleaning was optional', 'Bayu worked fewer hours', 'Equal numbers did not mean equal burden.'),
    q('What personal factors should affect rotation?', 'Workload, health, disability, ability, safety, and changing capacity', 'Who complains first', 'Only who dislikes a task', 'Age without any context', 'Fairness is responsive rather than mechanically identical.'),
    q('Why must competence and safety be considered?', 'A person should not perform a hazardous task without ability, equipment, or instruction', 'Every chore is dangerous', 'Only professionals may clean', 'Points remove all risk', 'Allocation cannot override safety.'),
    q('What happens after a difficult week?', 'They communicate, rebalance, or reschedule rather than silently creating debt', 'The person is automatically punished', 'All chores move to one sibling', 'The system ends', 'A flexible review is fairer than rigid catch-up.'),
    q('What keeps the system accountable?', 'A written list and regular review of work that is actually being done', 'Memory alone', 'A permanent score for each task', 'Avoiding awkward conversation', 'Visibility and revision reduce resentment.'),
  ], { replaceText: [
    ['Bayu, before we get annoyed at each other again, can we actually sit down and rework this chore list properly?', 'Bayu, as adult siblings sharing this home, can we rework the chores before resentment builds again?'],
    ['What if we assigned points instead of tasks? Heavier jobs earn more points, and each week should balance out fairly.', 'Let us compare time, effort, frequency, unpleasantness, planning, work schedules, health, ability, safety, and preferences, then rotate suitable tasks.'],
    ['Alright, bathroom cleaning gets the highest score then, since neither of us particularly enjoys doing it.', 'Bathroom cleaning needs suitable products, ventilation, equipment, and safe instructions. Disliking it matters, but competence and health matter too.'],
    ['And if either of us falls behind one week, we simply catch up the following week instead of complaining silently.', 'If capacity changes, we tell each other, rebalance or reschedule, and review the written plan rather than turning chores into silent debt.'],
  ] }),

  R('02', 'revise; remove shaming language and add route, road-law, equipment, visibility, weather, air quality, secure parking, fitness, accessibility, and alternatives', [
    q('Why was “laziness” an unhelpful label?', 'Barriers may involve safety, disability, cost, care duties, weather, or infrastructure', 'Cycling never requires effort', 'Cold weather is imaginary', 'Drivers cannot exercise', 'A moral label can hide real constraints.'),
    q('What did route research need beyond travel time?', 'Traffic risk, law, lighting, surface, crossings, weather, and secure parking', 'Only the shortest distance', 'Colleagues’ clothing', 'A promise of clear roads', 'A safe route is more than a fast route.'),
    q('Why is his fitness change not a prescription?', 'It is one personal outcome and others may need medical or accessibility guidance', 'Fitness cannot change', 'Cycling treats every illness', 'Doctors oppose commuting', 'Experience should not become universal health advice.'),
    q('What are valid alternatives?', 'Walking, public transport, shared travel, remote work, or driving as needs allow', 'Cycling in every condition', 'Skipping work', 'Using an unsafe road', 'The goal is suitable transport, not one moral choice.'),
    q('What finally supports regular cycling?', 'A checked route, suitable equipment, realistic pace, facilities, and fallback plan', 'A single traffic jam', 'Pressure from smug colleagues', 'Ignoring rain', 'Sustainable change required preparation.'),
  ], { replaceText: [
    ['My excuses were always the same: the distance, the traffic, and, frankly, my own laziness on cold mornings.', 'My concerns included distance and traffic. I stopped calling every barrier laziness; disability, care, cost, weather, air, and infrastructure differ.'],
    ['That evening, I looked up the cycling route properly, and it turned out to be barely twenty minutes if the roads were clear.', 'I checked road rules, a lower-risk route, crossings, lighting, surface, weather and air alerts, secure parking, and workplace changing facilities.'],
    ['Eventually, I solved that by packing a change of shirt, which sounds obvious now but hadn\'t occurred to me at all.', 'I used suitable clothing, a correctly fitted cycle and protective equipment required or recommended locally, lights, visibility, water, and a change of shirt.'],
    ['Within a month, my fitness improved noticeably, even though improving fitness had never actually been my original goal.', 'I noticed a personal fitness change, but that does not prescribe cycling for everyone. Health conditions or disability may need individualized advice and adaptations.'],
    ['If a single traffic jam could change my mind after years of excuses, maybe your excuses aren\'t as solid as they feel either.', 'My plan suits me. Others may reasonably choose walking, public transport, shared travel, remote work, or driving according to safety and need.'],
  ] }),

  R('03', 'revise; use identity verification, minimum order disclosure, documented authority, current written refund terms, and no guaranteed processing time', [
    q('Why should Ratih verify the service channel?', 'Order details and refunds involve personal and financial information', 'Telephone support is always fraudulent', 'The order number is public', 'Agents cannot issue refunds', 'Routine disputes still need privacy controls.'),
    q('What evidence supports the complaint?', 'The confirmed delivery promise, tracking record, and missed occasion', 'A rumor about the sorting center', 'The agent’s personal opinion', 'Another customer’s invoice', 'Specific records define the failure.'),
    q('What must Dimas confirm before offering remedies?', 'Identity, order, authority, eligibility, amount, return conditions, and current terms', 'Ratih’s family history', 'The item’s future use only', 'A promise from a coworker', 'A valid remedy follows controlled checks.'),
    q('Why is the refund timing qualified?', 'Payment providers and current policy may affect when funds appear', 'Refunds are never processed', 'Ratih chose a full refund', 'The parcel must arrive first', 'The agent should not promise what the process cannot guarantee.'),
    q('What systemic feedback does Ratih give?', 'Notify customers promptly when a promised delivery changes', 'Stop using sorting facilities', 'Never offer partial refunds', 'Call every customer publicly', 'The issue extends beyond her individual remedy.'),
  ], { replaceText: [
    ['Could you give me the order number so I can look into what\'s happened?', 'First, please confirm you reached our official service channel. I will verify only the identity and order information required by policy.'],
    ['Yes, it\'s four seven two nine one. I needed this item for a family gathering that already took place yesterday.', 'I have completed the approved verification without reading private identifiers aloud unnecessarily. The confirmed delivery date was before yesterday’s family gathering.'],
    ['That\'s completely reasonable. I can offer a full refund, or alternatively, you could keep the item and receive thirty percent back.', 'After checking my authority and the current terms, the eligible options are a full refund under the stated return conditions or keeping the item with thirty percent refunded.'],
    ['It should appear within three to five business days, which is considerably faster than our standard refund process.', 'Our written estimate is three to five business days after processing, but the payment provider may affect when funds appear. I will send confirmation and a reference.'],
  ] }),

  R('04', 'revise; add nutrition and medical individualization, halal and allergy checks, cooling and storage safety, date labels, reheating guidance, waste control, and flexible alternatives', [
    q('Why is batch cooking not automatically healthy?', 'Nutrition and suitability depend on ingredients, portions, needs, and medical context', 'Containers remove nutrients', 'Takeout is always unhealthy', 'Sunday cooking treats disease', 'Preparation method alone does not determine health.'),
    q('What food-safety steps are added?', 'Safe cooking, rapid cooling, date labels, correct storage, reheating, and discarding unsafe food', 'Leaving food warm all day', 'Smelling food as the only test', 'Keeping every meal for a week', 'Batch size increases storage responsibility.'),
    q('What should be checked before cooking for others?', 'Allergies, halal requirements, dietary needs, and cross-contact', 'Their bank balance', 'Their preferred container color', 'Whether they tease meal prep', 'Shared food needs consent and accurate information.'),
    q('Why does the narrator plan fewer meals sometimes?', 'Time, energy, storage, and changing schedules make flexibility more sustainable', 'Two meals are always healthier', 'Five containers are forbidden', 'Sunday is the only cooking day', 'The routine adapts instead of failing completely.'),
    q('What is the main nonfinancial benefit?', 'Fewer rushed decisions during busy weekdays', 'A guaranteed cure for stress', 'No need to choose food again', 'Perfect weeks every time', 'Planning reduced decision load without absolute claims.'),
  ], { replaceText: [
    ['I chose three simple recipes, bought ingredients in bulk, and set aside three uninterrupted hours on Sunday afternoon.', 'I chose suitable recipes and portions, checked allergies, halal and dietary needs, storage space, safe cooking, cooling, labels, and reheating guidance.'],
    ['As the week continued, I noticed I wasn\'t just saving money, I was also making fewer impulsive, unhealthy decisions when I felt hungry and tired.', 'I saved money and made fewer rushed choices. Batch cooking is not automatically nutritious or suitable; individual health needs may require qualified advice.'],
    ['I\'ve learned to accept that imperfect prepping still beats no prepping, even if it\'s only two meals instead of five.', 'Some weeks I prepare only two meals, freeze suitable portions, or use other safe options. Food outside its safe storage limit is discarded.'],
    ['If your weekdays constantly feel rushed, one deliberate Sunday afternoon might give you back more time than you\'d expect.', 'If weekdays feel rushed, test a plan that fits your time, ability, budget, culture, nutrition, and food-safety needs rather than copying mine.'],
  ] }),

  R('05', 'revise; make remote work conditional on role, authorization, privacy, security, ergonomics, accessibility, care needs, work-time rules, and team coordination', [
    q('Why did the laptop drawer help only one part of the problem?', 'A physical closing cue did not itself set workload, labor, security, or care boundaries', 'Drawers damage computers', 'Remote work requires no schedule', 'Hendra had lost the laptop', 'Personal ritual and organizational policy solve different issues.'),
    q('What must be suitable at home?', 'Authorized private workspace, secure systems, ergonomics, access, and emergency arrangements', 'Only a fast internet speed', 'A visible dining table', 'Laundry during meetings', 'Remote work has practical requirements.'),
    q('Why is hybrid not the universal compromise?', 'Roles, disabilities, care duties, locations, and team needs differ', 'Every company prohibits it', 'Offices always improve focus', 'Home always improves wellbeing', 'One arrangement cannot fit all contexts.'),
    q('What team rules matter?', 'Availability, handoffs, documentation, security, meetings, and genuine urgent channels', 'Keeping laptops open all evening', 'Sharing accounts', 'Spontaneous calls only', 'Coordination needs explicit design.'),
    q('What should Wulan do before requesting change?', 'Review role and policy, identify needs and evidence, and use the appropriate process', 'Assume Hendra’s arrangement is a right everywhere', 'Share confidential work at home', 'Threaten resignation', 'Her request needs her own context.'),
  ], { replaceText: [
    ['Exactly. So I started closing my laptop physically, putting it in a drawer, instead of leaving it open on the table.', 'I used a closing routine, but we also clarified hours, workload, response expectations, handoffs, and genuine urgent channels.'],
    ['It depends. Fewer interruptions from colleagues, certainly, but more temptation to do laundry or scroll my phone.', 'It depends on role and person. Privacy, security, ergonomics, accessibility, care duties, space, connection, and interruptions all affect suitability.'],
    ['I\'d probably choose a hybrid arrangement, provided my team could still coordinate effectively across different days.', 'I prefer hybrid for my role, but it is not a universal answer. The team needs agreed presence, documentation, secure access, meetings, and reasonable adjustments.'],
    ['Maybe it\'s time you asked your own manager about a hybrid option too.', 'Review your role and policy, then raise your needs and evidence through the appropriate process without assuming my arrangement fits yours.'],
  ] }),

  R('06', 'revise; add ownership and consent checks, data-bearing device security, safe disposal, donation quality, hazardous items, and no universal mental-health promise', [
    q('What should be checked before removing an item?', 'Ownership, borrowing, family rights, records, safety, and whether consent is needed', 'Only whether it is six months old', 'Whether a friend dislikes it', 'The size of the apartment', 'Not everything present belongs solely to the narrator.'),
    q('Why do digital devices need a separate process?', 'Accounts and recoverable personal data may remain after ordinary deletion', 'Devices cannot be donated', 'Photographs are never private', 'Broken umbrellas store passwords', 'Decluttering can create data exposure.'),
    q('What makes a donation responsible?', 'The item is safe, clean, usable, wanted, and accepted by the recipient organization', 'Anything is better than disposal', 'The donor avoids every fee', 'Broken goods create more choice', 'Donation should not transfer waste.'),
    q('Why is feeling calmer described cautiously?', 'It was a personal response, not a guaranteed mental-health treatment', 'Clutter never affects anyone', 'Only large homes need calm', 'Memories should always be discarded', 'The account avoids a universal clinical claim.'),
    q('What replaces the six-month question alone?', 'Purpose, rights, condition, records, memory value, safety, and realistic future use', 'Market price only', 'A rule to own nothing', 'Friends’ opinions', 'Intentional ownership uses several considerations.'),
  ], { replaceText: [
    ['Even so, I forced myself to ask one honest question about each item: would I genuinely miss this in six months?', 'I asked about ownership, borrowing, family or estate rights, records, safety, condition, memory, purpose, and realistic future use—not one rigid question.'],
    ['Everything else went into three piles: donate, sell, and, reluctantly, discard what nobody could reasonably use anymore.', 'Safe, clean, wanted items went only to organizations that accepted them. Hazardous goods followed local rules; data-bearing devices received verified secure erasure.'],
    ['What surprised me most was how much calmer I felt afterward, as though the clutter had been quietly weighing on my thoughts too.', 'I personally felt calmer, but decluttering is not a promised mental-health treatment. Severe accumulation or distress may need qualified, nonjudgmental support.'],
    ['If your own space feels heavier than it should, maybe start with something small, like three broken umbrellas you\'ve been quietly avoiding.', 'If you begin, choose a small safe category, preserve other people’s rights and important records, and use responsible reuse, recycling, or disposal routes.'],
  ] }),

  R('07', 'revise; remove unnecessary disclosure of a night shift and shame about building management, then add permits, lawful hours, written notice, dust and access controls, and escalation routes', [
    q('Why need Ibu Sri not explain her work schedule?', 'The early-noise concern can be addressed without private employment information', 'Night work is forbidden', 'Renovations never affect sleep', 'Pak Wawan owns the building', 'A valid request does not require unnecessary disclosure.'),
    q('What must Pak Wawan verify?', 'Permits, building rules, lawful hours, contractor controls, dust, debris, access, and safety', 'Ibu Sri’s employer', 'Only the expected end date', 'Whether neighbors enjoy drilling', 'Renovation responsibility is broader than start time.'),
    q('What makes nine o’clock provisional?', 'It must comply with rules and consider affected residents and required work', 'The workers refuse mornings', 'No work may start at nine', 'Ibu Sri controls every renovation', 'A bilateral preference cannot replace building requirements.'),
    q('Why is management not treated as hostile?', 'It may be the proper channel for records, enforcement, access, or unresolved risk', 'Neighbors should never speak directly', 'Management caused the noise', 'Complaints are always public', 'Direct dialogue and formal process can coexist.'),
    q('What future notice is useful?', 'Written schedule, especially loud work, changes, contact route, and safety or access impacts', 'A promise nothing unexpected occurs', 'Worker names and private numbers', 'Only the final completion date', 'Specific notice helps planning and accountability.'),
  ], { replaceText: [
    ['Do you work night shifts, by any chance? That would explain why early mornings matter so much to you specifically.', 'You do not need to justify the request with private work or health details. I should verify permitted hours and the building’s renovation rules.'],
    ['Yes, exactly. I usually get home around five and finally fall asleep just before the drilling seems to start.', 'Thank you. Six o’clock conflicts with the schedule residents were given, and the unexpected noise affects my use of the home.'],
    ['Consider it done. I\'ll speak with the workers today and adjust their start time from tomorrow onward.', 'I will stop starts outside the approved schedule, confirm lawful hours with management, and document the agreed timing with the contractor.'],
    ['I\'ll also let you know in advance whenever something particularly loud is planned, so it doesn\'t catch you off guard again.', 'I will provide written notice of loud work and changes, plus dust, debris, lift, entrance, and emergency-access impacts and a contact route.'],
    ['Consider it agreed then. Thank you for coming to talk instead of simply complaining to the building management first.', 'Thank you for speaking with me. Building management remains an appropriate route if rules, records, safety, access, or resolution require it.'],
  ] }),

  R('08', 'retain; strong household emergency-preparedness monologue covering verified guidance, medical storage, fire and carbon-monoxide risk, accessibility, privacy, roles, and recurring tests', [
    q('Why was the garage-gate problem important?', 'A normal powered exit could fail and its authorized manual process was unknown', 'The family needed a new car', 'Garage doors never open manually', 'The storm damaged every key', 'Access procedures belong in outage planning.'),
    q('Why should the refrigerator stay closed?', 'Unnecessary opening can shorten safe temperature retention', 'Medicine must never be checked', 'Food causes every outage', 'Cold air is dangerous', 'The plan follows product-specific guidance.'),
    q('What makes carbon monoxide especially dangerous?', 'It cannot be reliably detected by human smell', 'It comes only from candles', 'It is harmless near windows', 'Power banks produce it', 'Sensory guessing cannot establish safety.'),
    q('How are neighbors included?', 'Through agreed assistance and roles without public medical disclosure', 'By assigning diagnoses in a group chat', 'By entering every home', 'By replacing emergency services', 'Community help retains consent and privacy.'),
    q('Why is the plan tested repeatedly?', 'Equipment, contacts, supplies, people, and seasonal risks change', 'One successful outage guarantees the future', 'Tests consume every battery', 'Official guidance expires monthly', 'Preparedness is maintained rather than stored once.'),
  ]),

  R('09', 'retain; strong records-management monologue balancing ownership, consent, least access, retention, secure disposal, authentication, tested recovery, metadata, and data minimization', [
    q('Why did household members identify document ownership first?', 'Living together did not give everyone authority over each adult’s records', 'Common bills have no owner', 'Scanning changes ownership', 'Only paper can be private', 'Shared location and shared rights are different.'),
    q('What did the retention review prevent?', 'Both needless storage and premature destruction of required records', 'All document deletion', 'Every legal question', 'The need for backups', 'Retention has risks in both directions.'),
    q('Why was an emergency index safer than one open folder?', 'It pointed authorized people to essential information without exposing all contents', 'Indexes encrypt accounts', 'Emergencies cancel privacy', 'Only one person could read', 'Discovery and unrestricted access were separated.'),
    q('What phishing cue appears?', 'A new chat number with an official-looking logo requests identity documents', 'A known provider sends a paper bill', 'A household member updates consent', 'A tested backup completes', 'Appearance alone does not verify the recipient.'),
    q('What does the final “restraint” mean?', 'Hold and share records only for a known purpose, audience, and period', 'Never create household records', 'Keep everything permanently', 'Give access to all adults', 'Organization includes controlled reduction.')
  ]),

  R('10', 'retain with concise phrasing; strong allergy-safety dialogue with individualized medical planning, cross-contact controls, minimum disclosure, prompt emergency action, medicine checks, and preserved independence', [
    q('Why does Nisa reject a total packaged-food ban?', 'The response should follow her actual clinical plan rather than panic', 'Packaged foods never contain allergens', 'Rina owns the kitchen', 'Bans treat reactions', 'Proportionate controls depend on individual risk.'),
    q('What does labelling equipment achieve?', 'It makes agreed separate-use controls visible and repeatable', 'It diagnoses contamination', 'It replaces cleaning', 'It guarantees food safety everywhere', 'A practical cue supports the plan.'),
    q('Why should symptoms not be watched until severe?', 'The written emergency plan requires prompt action and delay can be dangerous', 'Every mild symptom is harmless', 'Food treats reactions', 'Only Nisa may call for help', 'Escalation timing follows qualified instructions.'),
    q('Who maintains routine clinical responsibility?', 'Nisa with her qualified clinician', 'Rina alone', 'Every guest', 'The food seller', 'Prepared assistance does not remove patient agency.'),
    q('What emotional balance closes the dialogue?', 'Serious safety can coexist with privacy, independence, calm, and no blame', 'The kitchen should remain unused', 'Rina must inspect every meal', 'Nisa should hide the allergy', 'A specific system avoids both dismissal and takeover.'),
  ], { replaceText: [
    ['Thank you for telling me. What arrangements has your clinician advised, and what should I do if you cannot speak for yourself?', 'Thank you. What has your clinician advised, and what should I do if you cannot speak?'],
    ['Should we simply ban every packaged food from the apartment?', 'Should we ban packaged food?'],
    ['What creates the greatest risk in our kitchen?', 'What creates the main risk here?'],
    ['Follow the cleaning method in my plan. Some porous or difficult-to-clean items may need to remain separate, so we will label equipment clearly.', 'Follow my cleaning plan. Some difficult-to-clean items stay separate, so we will label them.'],
    ['Tell them the kitchen rule they must follow, not my whole medical history. Ask me before sharing anything beyond what safety requires.', 'Tell them the required kitchen rule, not my medical history. Ask before sharing more than safety requires.'],
    ['I appreciate that you explained the exact process instead of expecting me to understand allergy from one word.', 'I appreciate the specific process instead of one vague word.'],
  ] }),
];
