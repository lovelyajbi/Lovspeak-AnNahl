import { q } from '../helpers.mjs';

const R = (id, decision, additions, extra = {}) => ({
  id: `b1-social-${id}`,
  level: 'B1',
  scriptDecision: decision,
  tags: { 0: 'thoughtful', 2: 'carefully', 4: 'reflective', 6: 'honestly', 8: 'seriously', 10: 'gently', 12: 'encouraging', 14: 'sincere', 16: 'thoughtful', 18: 'carefully' },
  additions,
  ...extra,
});

export const reviews = [
  R('01', 'revise; make boundaries compatible with genuine duties, emergencies, safeguarding, and respectful family communication without promising every refusal will be accepted', [
    q('Why did automatic agreement damage important relationships?', 'The narrator arrived distracted and resentful instead of offering honest attention', 'Every invitation was harmful', 'Her sister demanded all her time', 'Friends stopped asking for help', 'An unexamined yes had a hidden relational cost.'),
    q('What does the pause before answering create?', 'Time to assess capacity, responsibility, urgency, and alternatives', 'A reason to ignore the requester', 'A guarantee that guilt disappears', 'Permission to cancel every duty', 'The pause supports a considered response.'),
    q('When is a simple refusal not enough?', 'When safety, a real duty, or a dependent person requires responsible arrangements', 'Whenever a relative is older', 'Whenever the request is inconvenient', 'When friends expect an instant answer', 'Boundaries do not remove obligations.'),
    q('Why should her experience not become a promise?', 'Some people may react badly, so context and safety planning matter', 'No friendship respects honesty', 'Only relatives need boundaries', 'Guilt always proves wrongdoing', 'Outcomes differ across relationships.'),
    q('How can she address an older relative respectfully?', 'Use clear, gentle words while preserving lawful duties and seeking support if needed', 'Agree resentfully', 'Criticize them publicly', 'Stop all family contact', 'Adab and boundaries can operate together.'),
  ], { replaceText: [
    ['The first few times I declined an invitation, I felt genuinely sick with guilt, even though nobody reacted badly at all.', 'The first refusals brought strong guilt. Most people accepted them, but that outcome is not guaranteed in every family, workplace, or controlling relationship.'],
    ['If a friend asks for something I truly cannot give right now, I\'ve learned to say so clearly, rather than agreeing and quietly falling apart later.', 'I answer clearly, but I first distinguish an optional request from a real duty, emergency, safeguarding concern, or care arrangement that cannot simply be abandoned.'],
    ['I still struggle sometimes, particularly with older relatives who expect automatic agreement, but I remind myself that boundaries and kindness aren\'t opposites.', 'With older relatives, I use gentle language and preserve lawful duties. If refusal may trigger harm or coercion, I seek a safe plan and trusted support.'],
  ] }),

  R('02', 'revise; turn a promotional cleanup into an authorized, risk-assessed activity with child safeguarding, protective equipment, waste handling, accessibility, and no pressure on households', [
    q('Why is direct household contact not automatically better?', 'It can inform people but may also pressure them or exclude those needing another format', 'Flyers are always unlawful', 'Every resident wants to volunteer', 'Children choose for their parents', 'Outreach should preserve free choice and access.'),
    q('What must happen before volunteers reach the riverbank?', 'Permission, hazard assessment, waste plan, weather check, and safety briefing', 'A music playlist only', 'A public promise of clean water', 'Children must arrive first', 'Environmental work requires operational safety.'),
    q('Which waste should ordinary volunteers avoid?', 'Sharps, chemicals, medical waste, unstable debris, or other hazardous material', 'Dry leaves', 'Empty paper packaging', 'A labelled recycling bag', 'Hazardous material needs trained authorized handling.'),
    q('How may children participate?', 'With guardian consent, suitable tasks, supervision, and no hazardous exposure', 'By collecting unknown objects alone', 'As a way to force parents to attend', 'Without protective equipment', 'Participation must be safe and voluntary.'),
    q('What can the group honestly claim afterward?', 'What it collected and observed, not that one event restored the river', 'The river is permanently clean', 'Every household supported the event', 'No waste will return', 'Measured action should not become an inflated impact claim.'),
  ], { replaceText: [
    ['If we ask each household directly, rather than just posting a notice, people are far more likely to feel personally responsible for showing up.', 'We can offer invitations in accessible formats without pressure and ask residents what times, tasks, or barriers matter to them.'],
    ['I also want to involve the children this time, since their parents are more likely to participate if their kids are excited about it.', 'Children may join only with guardian consent, suitable supervision, protective equipment, and age-appropriate tasks away from hazardous waste or water.'],
    ['Exactly. If we provide snacks and music afterward, people might remember it as a pleasant morning, rather than an obligation.', 'Before refreshments, we need land and authority permission, a hazard and weather check, safe equipment, waste separation and disposal, first aid, and an emergency plan.'],
    ['I\'ll also ask the small shop owner if he\'ll donate drinks, since he\'s always saying he wants to support the community somehow.', 'I will ask whether the shop wishes to donate, with no public pressure or advertising promise, and we will check sealed drinks and dietary needs.'],
    ['True, and honestly, a cleaner riverbank matters regardless of how many hands actually helped make it happen.', 'Yes. We can report what was safely collected without claiming one event repaired the river or replacing long-term waste and drainage action.'],
  ] }),

  R('03', 'revise; avoid treating marriage and children as the expected life path, add mutual consent and privacy to contact methods, and distinguish busyness from neglect or unsafe relationships', [
    q('What assumption is corrected in the discussion?', 'Adults may become less available for many reasons, not only marriage or children', 'Friendship never changes with time', 'Parents cannot maintain friendships', 'Single adults are always free', 'Life stages and responsibilities vary.'),
    q('Why should Dimas ask before sending voice notes?', 'The friend may have privacy, access, work, or listening constraints', 'Voice notes are never friendly', 'Calls are always preferable', 'Messages require an hour', 'A convenient format for one person may burden another.'),
    q('What should someone do before assuming rejection?', 'Ask respectfully and allow an honest answer', 'Demand an immediate explanation', 'Contact the friend’s family', 'Measure friendship only by frequency', 'Direct communication tests the assumption.'),
    q('When is patience not the whole answer?', 'Repeated harm, manipulation, or one-sided demands may require firmer boundaries', 'Whenever a reply takes one day', 'When a friend has children', 'When schedules differ', 'Not every distance is harmless busyness.'),
    q('How does Dimas now judge friendship?', 'By mutual honesty, care, and workable expectations rather than contact count alone', 'By identical life choices', 'By daily messages', 'By public photographs', 'Quality is described as mutual and contextual.'),
  ], { replaceText: [
    ['Honestly, marriage and children changed everything faster than I expected. Suddenly, a friend who used to be free every evening could barely manage one call a month.', 'Work, study, health, marriage, parenting, caregiving, distance, and other changes affected people differently. No single path defines adult life.'],
    ['Definitely. If a friend can\'t talk for an hour, I\'ve learned to send a short voice message instead, so the connection continues in smaller pieces.', 'I ask which format and frequency work. A short voice message can help, but only if privacy, accessibility, work, and listening conditions suit the friend.'],
    ['I\'d say, ask directly before assuming the worst. Often, the person isn\'t pulling away emotionally; they\'re simply overwhelmed by a season of life you haven\'t experienced yet.', 'Ask respectfully before assuming rejection. Busyness may explain distance, but listen to the answer; repeated harm, manipulation, or neglect may need firmer boundaries.'],
    ['Be patient with people whose lives look busier than yours, and don\'t disappear yourself just because contact has become less frequent than before.', 'Offer patience without ranking whose life is busier. Agree on realistic contact, accept changes, and do not demand access another person cannot freely give.'],
  ] }),

  R('04', 'revise; separate family reconciliation from Islamic inheritance and legal rights, reject unsupported accusation, add estate process and mediation, and ensure apology does not erase anyone’s entitlement', [
    q('Why was the accusation especially harmful?', 'It alleged serious pressure without evidence and damaged Reza publicly', 'It changed the house price', 'It proved the narrator owned the home', 'It settled the inheritance', 'A serious claim requires evidence and proper process.'),
    q('What must be handled before heirs divide an estate?', 'Verified ownership, funeral obligations, debts, valid bequests, heirs, and applicable shares', 'Family feelings alone', 'The oldest cousin’s preference', 'A public vote at a wedding', 'Estate rights need qualified orderly handling.'),
    q('What does reconciliation not require?', 'Waiving a valid inheritance or legal right', 'Retracting an unsupported accusation', 'Speaking respectfully', 'Using mediation', 'Relationship repair and property rights are distinct.'),
    q('Why is the wedding not used to settle the dispute?', 'A social event lacks privacy, documents, and qualified process', 'Weddings prohibit family conversation', 'Reza has no rights', 'The house no longer exists', 'The conversation can reopen contact without deciding the estate.'),
    q('What is the responsible next step?', 'Use qualified Islamic and local legal guidance with documented mediation', 'Ignore the property forever', 'Let the narrator choose shares', 'Sell before identifying heirs', 'High-stakes rights need appropriate authority.'),
  ], { replaceText: [
    ['When our grandfather passed away, my cousin Reza and I ended up on opposite sides of a disagreement about how his small house should be divided.', 'After our grandfather died, a dispute arose about his house. We had not yet completed a qualified Islamic inheritance and local legal review.'],
    ['Neither of us was purely greedy, I think, but grief has a way of making people defend positions more fiercely than the situation actually requires.', 'I cannot judge every person’s intention. The estate required verified ownership, funeral obligations, debts, valid bequests, identified heirs, and applicable shares.'],
    ['I told him I regretted the accusation, and that even if I still disagreed about the house, I shouldn\'t have questioned his character so publicly.', 'I retracted the unsupported accusation, apologized for the public harm, and did not make forgiveness depend on Reza surrendering any valid right.'],
    ['We still haven\'t fully resolved the property question, and honestly, we may never agree on it completely.', 'We did not settle property at the wedding. We agreed to bring documents to qualified Islamic and local legal advisers and use an appropriate mediator.'],
    ['However, we agreed that the house wasn\'t worth losing each other over, especially since our grandfather would have hated seeing us this divided.', 'We agreed that reconciliation and justice belong together: repairing contact does not cancel an heir’s entitlement or permit an invalid division.'],
    ['If I\'ve learned anything, it\'s that being technically right rarely feels as good as people expect, especially once the people around you start disappearing.', 'I learned that claiming to be right is not enough. Evidence, repentance, due process, and the rights Allah has assigned must not be replaced by pride or pressure.'],
  ] }),

  R('05', 'revise; remove assumptions about origin, language, anxiety, and isolation, then make the welcome optional, accessible, privacy-aware, and suitable for dietary and family preferences', [
    q('What do Nadia and Hasan actually know?', 'A family recently moved upstairs; their origin, language, and feelings have not been confirmed', 'The mother is afraid of neighbors', 'The children need friends', 'The family wants a gathering', 'Observation should not become a personal story.'),
    q('How should an invitation be offered?', 'Through a low-pressure choice of contact method, timing, and whether to attend', 'By entering without notice', 'By inviting the whole building first', 'By assuming a local dialect problem', 'A welcome preserves the new family’s control.'),
    q('What should hosts check before serving food?', 'Dietary, allergy, halal, privacy, and accessibility preferences', 'The family’s immigration history', 'The children’s school records', 'A reason for moving', 'Hospitality needs relevant consent, not private biography.'),
    q('Why might a written message be useful?', 'It can allow translation, processing time, and a response without doorstep pressure', 'It always feels more personal', 'Speaking is impolite', 'Notes guarantee attendance', 'Different communication modes support choice.'),
    q('What is the aim of the welcome?', 'Offer connection without defining the family as outsiders or demanding gratitude', 'Make the family explain its region', 'Prevent private time', 'Teach them how neighbors must behave', 'Belonging is invited rather than imposed.'),
  ], { replaceText: [
    ['Hasan, have you met the new family who moved into the unit upstairs? I think they arrived from another region and barely know anyone here yet.', 'Hasan, a family moved upstairs. We should not guess their origin, language, relationships, or whether they feel isolated from boxes and one hallway meeting.'],
    ['Not really. I said hello in the hallway, and the mother looked nervous, as though she wasn\'t sure how neighbors here usually behave.', 'I said hello, but I cannot infer how the mother felt. We can offer useful building information and an optional welcome without demanding personal details.'],
    ['Let\'s knock and mention it in person. A note might feel a little impersonal for a first introduction, don\'t you think?', 'We can ask which contact method they prefer. A simple translated note may give time to respond; a visit should be at a suitable time and easy to decline.'],
    ['I\'m not certain, but it wouldn\'t hurt to speak clearly and patiently, regardless. Nobody minds being spoken to with a little extra care.', 'We should ask rather than simplify speech in a patronizing way. Translation, writing, sign language, or another accessible method may help if they choose.'],
    ['Agreed. It costs us very little, and honestly, everyone deserves to feel noticed when they arrive somewhere new.', 'Agreed. We will check dietary, allergy, halal, access, child-safety, and privacy preferences and keep participation genuinely optional.'],
  ] }),

  R('06', 'revise; avoid universal claims about adult friendship and add safe organized activities, privacy, accessibility, lawful social settings, gradual trust, and support for persistent loneliness', [
    q('Why was repeated attendance useful for this narrator?', 'Familiar, low-pressure contact allowed trust to grow gradually', 'Every group member became a close friend', 'Hiking removes loneliness', 'Confidence must come after risk', 'The personal mechanism was repeated contact.'),
    q('What did the narrator check before joining?', 'Organizer, route, safety, transport, group expectations, access, and emergency plan', 'Members’ private addresses', 'A guarantee of friendship', 'Whether everyone was single', 'Social effort should not ignore physical safety.'),
    q('How were monthly meals kept appropriate?', 'Invitations respected privacy, capacity, dietary needs, prayer, and lawful boundaries', 'Every coworker had to attend', 'Guests brought strangers without consent', 'Food needs were guessed', 'Hospitality included consent and context.'),
    q('What does a declined invitation mean?', 'Only that the invitation was declined; it does not prove rejection or bad character', 'The friendship is impossible', 'The host should ask repeatedly', 'The person dislikes the city', 'The narrator learns not to overinterpret.'),
    q('When may additional support help?', 'When loneliness is persistent, severe, or affecting health and daily function', 'After one quiet evening', 'Only when a group ends', 'Never alongside friendship', 'Community activity is not a universal treatment.'),
  ], { replaceText: [
    ['Nobody approaches strangers the way children do on a playground, and I quickly realized that friendship here required actual effort, not just proximity.', 'My experience was harder than school, although adults and cultures differ. I needed repeated, respectful contact rather than assuming proximity would create trust.'],
    ['Eventually, a coworker invited me to a weekend hiking group, and even though I almost declined out of habit, something made me say yes that time.', 'A coworker invited me to an organized hiking group. I checked the organizer, route, weather, transport, safety and emergency plan, accessibility, and group expectations.'],
    ['I also started hosting a small dinner once a month, inviting a mix of people I liked but who didn\'t necessarily know each other yet.', 'I hosted a small monthly meal with consent-based invitations, suitable privacy and lawful boundaries, dietary and prayer planning, and no pressure to attend.'],
    ['I\'ve realized that adult friendship rarely happens by accident. It happens because someone, at some point, decided to show up anyway.', 'For me, friendship grew through safe repeated contact and mutual effort. Persistent loneliness affecting health or function may also deserve qualified support.'],
  ] }),

  R('07', 'revise; make private conversation an option rather than a rule, add safety and support routes, protect sensitive details, and reject guaranteed relationship improvement', [
    q('Why were the aunt’s topics intrusive?', 'Career, body, and marriage are personal and repeated public comments caused harm', 'Relatives may never discuss plans', 'Ratih had no career', 'The aunt intended punishment', 'Good intention did not remove impact.'),
    q('Why is private discussion not always required?', 'Direct privacy may be unsafe or unsuitable in coercive or abusive relationships', 'Public conflict is always better', 'Boundaries require an audience', 'Family members cannot speak alone', 'Safety determines the communication method.'),
    q('What alternatives may Ratih use?', 'A brief boundary, leaving, a trusted ally, written message, or relevant support channel', 'Disclosing medical information', 'Insulting the aunt online', 'Agreeing to every comment', 'Several proportionate options preserve agency.'),
    q('What result cannot be promised?', 'That setting a boundary will strengthen every relationship', 'That Ratih may name the impact', 'That the aunt sometimes stops herself', 'That privacy can help in this case', 'This positive experience is not universal.'),
    q('What should happen if body comments affect eating or mental health?', 'Seek appropriate qualified support rather than treating it only as family etiquette', 'Start a public diet debate', 'Hide all distress', 'Ask the aunt for treatment', 'The impact may extend beyond conversation skills.'),
  ], { replaceText: [
    ['I told her privately that I appreciated her concern, but that comments about my career and body genuinely affected my confidence, even if she didn\'t intend that.', 'I chose a private setting because it felt safe in my case. I named the comments and requested that career, body, and marriage discussions stop.'],
    ['Address it privately and calmly, not during a family gathering, since public confrontation usually makes people defensive rather than genuinely reflective.', 'Choose a safe method: private words, a brief public boundary, leaving, writing, or a trusted ally. Coercion, abuse, or serious harm may need specialist support.'],
    ['Honestly, in spite of my fear, our relationship grew stronger, not weaker, once I stopped pretending those comments didn\'t bother me.', 'Our relationship improved, but I cannot promise that result. Safety and wellbeing matter more than preserving contact at any cost.'],
    ['Thank you for listening. I hope it helps someone else find the courage to speak up too.', 'Thank you. People affected in eating, mental health, work, or safety should seek suitable qualified support as well as communication advice.'],
  ] }),

  R('08', 'retain; strong community-moderation monologue balancing urgent health channels, evidence preservation, privacy, non-diagnosis, fair process, correction, and prevention of harassment', [
    q('Why did the moderator restrict forwarding?', 'To slow unsupported spread while preserving a route for responsible review', 'To prove the seller was innocent', 'To hide an official warning', 'To prevent all food reports', 'Containment did not decide the allegation.'),
    q('What did the original poster actually know?', 'Only a second-hand claim without contact with the alleged patient or an official report', 'A laboratory result', 'The seller’s confession', 'A health authority finding', 'The evidence was weaker than the post suggested.'),
    q('Why were alleged patients not asked to prove illness publicly?', 'Medical privacy and proper assessment belong outside a group chat', 'Illness can never be reported', 'Moderators cannot read replies', 'The seller requested silence', 'Verification must respect health data and competence.'),
    q('What does equal visibility for corrections address?', 'A quiet correction may not reach people who saw the original accusation', 'Corrections should repeat private names', 'Rumors become true over time', 'Authorities require publicity', 'Repair should match the reach of harm where possible.'),
    q('Which distinction becomes a group rule?', 'Direct observation, inference, rumor, and official information must not be presented as the same', 'Every forwarded claim is direct evidence', 'Only businesses may post', 'Moderators decide medical causes', 'Source status changes reliability.'),
  ]),

  R('09', 'retain; strong financial-ethics monologue covering debt, evidence, gifts, refunds, verified payment, data minimization, correction, and escalation limits', [
    q('Why did the narrator’s income comparison not matter?', 'Huda’s greater earnings did not remove her property right', 'Friends must have equal salaries', 'The debt was a gift', 'Travel costs cannot be shared', 'Rights do not depend on who appears wealthier.'),
    q('What made the initial table trustworthy but revisable?', 'It exposed the calculation and allowed both people to test it against records', 'It used the highest amount', 'It omitted all dates', 'Only the debtor could edit it', 'Transparency enabled correction.'),
    q('Why was the invited meal excluded?', 'It had been clearly offered as a personal gift rather than a shared expense', 'Meals are never shared', 'Huda had lost the receipt', 'The restaurant refunded it', 'The original agreement determined treatment.'),
    q('Why did the narrator verify the payment account?', 'An old forwarded message could be outdated or fraudulent', 'Bank transfers are always unsafe', 'Huda requested cash publicly', 'The account had no name', 'Recipient verification protects settlement.'),
    q('What does willingness to lower the balance demonstrate?', 'Honesty includes correcting an error that would benefit oneself', 'Debts may be estimated freely', 'Friendship cancels records', 'The larger amount was more generous', 'Integrity is tested when correction reduces one’s advantage.'),
  ]),

  R('10', 'retain; strong bereavement-support dialogue grounded in condolence, dua, consent, privacy, dignity, practical help, emotional patience, and appropriate crisis escalation', [
    q('Why is the whole study group not sent immediately?', 'The family’s desired privacy, timing, and arrangements are not yet known', 'Group condolences are forbidden', 'Lina has left the city', 'Only relatives may help', 'Support should not become an uninvited burden.'),
    q('What is wrong with “call if you need anything”?', 'It can place planning work on a person with little energy', 'Open offers are always dishonest', 'Lina has no telephone', 'Friends should decide without asking', 'A specific optional offer reduces cognitive burden.'),
    q('How does the dialogue treat grief-related anger or confusion?', 'Listen without debating the emotion and seek urgent help if danger is present', 'Correct the feeling immediately', 'Treat it as weak faith', 'Publish it for advice', 'Compassion does not require controlling emotion.'),
    q('Why is later contact emphasized?', 'Support often decreases while practical grief continues', 'The first days do not matter', 'Mourning has a fixed duration', 'Friends should visit daily', 'Care can remain available without imposing.'),
    q('What makes assistance Islamic and responsible here?', 'Mercy, dua, lawful help, privacy, dignity, patience, and no unsupported unseen claim', 'Explaining Allah’s exact hidden purpose', 'Demanding visible gratitude', 'Taking control of mourning', 'The closing integrates belief with restraint.'),
  ]),
];
