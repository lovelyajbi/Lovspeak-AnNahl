import { q } from '../helpers.mjs';

const R = (id, decision, additions, extra = {}) => ({
  id: `b1-travel-${id}`,
  level: 'B1',
  scriptDecision: decision,
  tags: { 0: 'thoughtful', 2: 'carefully', 4: 'reflective', 6: 'honestly', 8: 'seriously', 10: 'gently', 12: 'encouraging', 14: 'sincere', 16: 'thoughtful', 18: 'carefully', 20: 'reflective' },
  additions,
  ...extra,
});

export const reviews = [
  R('01', 'revise; add authoritative disruption checks, document and border verification, cost and refund review, and safety before an improvised international route', [
    q('What earlier action would have improved the narrator’s options?', 'Checking authoritative travel updates before departure', 'Packing fewer clothes', 'Arriving after the strike began', 'Ignoring the airline message', 'Early verified information supports replanning.'),
    q('Why was the alternate route not chosen immediately?', 'Documents, entry rules, availability, safety, cost, and accessibility first needed checking', 'Trains never cross borders', 'The woman refused the ferry', 'The narrator disliked stations', 'An improvised route still requires due diligence.'),
    q('What did helping the woman involve?', 'Holding her queue place while she contacted an official channel', 'Promising she would reach the wedding', 'Taking control of her passport', 'Buying an unknown ticket', 'The assistance was limited and practical.'),
    q('What uncertainty remained?', 'Transport disruption and border connections could still change', 'The wedding had been cancelled', 'The strike covered every train', 'The narrator had no identification', 'A plan reduces risk without guaranteeing arrival.'),
    q('What lesson is balanced at the end?', 'Stay open to alternatives while verifying them and retaining realistic expectations', 'Every delay produces a friendship', 'A cancelled flight improves every trip', 'Spontaneous routes need no planning', 'The reflection avoids romanticizing disruption.'),
  ], { replaceText: [
    ['Had I checked the news that morning instead of packing, I would have known the strike had been announced three days earlier.', 'Had I checked the airline, airport, and official travel updates earlier, I would have known the strike had been announced three days before.'],
    ['I could either wait it out in an airport hotel or take a longer route involving a train and a ferry instead.', 'The agent described rebooking and refund options. A train-and-ferry route was possible only after checking tickets, passports, entry and transit rules, safety, cost, accessibility, and insurance terms.'],
    ['I chose the train, mainly because sitting still for two days sounded worse than any amount of extra travel time.', 'After those checks, I chose the available rail-and-ferry route. I kept official contacts and enough time for uncertain connections.'],
    ['The woman decided to come with me, since her wedding mattered too much to risk waiting for a flight that might not happen.', 'The woman independently checked her documents and booked the same public route. Neither of us treated the other as responsible for guaranteeing arrival.'],
    ['I still check strike schedules before booking flights, but I no longer assume that a ruined plan means a ruined trip.', 'I now monitor official disruption notices, understand passenger options, and verify alternatives. A changed plan may still work, but not every disruption becomes a happy story.'],
  ] }),

  R('02', 'revise; clarify the travelers are spouses and add privacy, document, accessibility, safety, cancellation, and total-journey checks without promising good sleep', [
    q('Why can the shorter flight take more total time than expected?', 'Security, airport transfers, and early arrival add to the journey', 'Flights always depart late', 'Trains skip city centers', 'The cabin moves slowly', 'Door-to-door comparison differs from vehicle time.'),
    q('What makes the private cabin appropriate for Amir and Noor?', 'They are spouses traveling together', 'All strangers may share one cabin', 'The railway ignores privacy', 'Their parents chose the seats', 'The revision removes ambiguity about mixed private accommodation.'),
    q('What should reviews not be used to promise?', 'That Amir will definitely sleep well', 'That the train reaches the city', 'That a cabin has a door', 'That snacks can be packed', 'Other passengers’ experiences do not guarantee an individual response.'),
    q('Which comparison is most complete?', 'Door-to-door time, total cost, rest, safety, access, documents, and cancellation terms', 'Vehicle speed alone', 'Scenery alone', 'The cheapest advertised fare', 'Several practical factors determine suitability.'),
    q('What do they decide?', 'Book a suitable private sleeper cabin after confirming details', 'Buy an ordinary shared seat immediately', 'Travel without documents', 'Rely only on dining-car food', 'The decision follows verification.'),
  ], { replaceText: [
    ['We could book the sleeper cabin instead. It costs more than a seat, but it\'s still cheaper than the flight plus a taxi into town.', 'As spouses, we could book a suitable private sleeper cabin. Let us confirm privacy, safety, accessibility, documents, arrival time, and cancellation terms before comparing total cost.'],
    ['The cabins have proper beds now, unlike the trains our parents used to complain about. I checked the reviews carefully.', 'The operator confirms proper beds in this cabin type, and reviews add context. They cannot promise how well either of us will sleep.'],
    ['Deal. Though I doubt that\'ll happen, since the gentle motion usually puts people to sleep faster than they expect.', 'Deal, although neither the motion nor the bed guarantees rest. We should keep the first day flexible.'],
    ['Fine, you\'ve convinced me. Let\'s book the sleeper cabin tonight before the good ones sell out.', 'You have convinced me to compare the complete journey. If the details match, we will book the private cabin through the official channel.'],
  ] }),

  R('03', 'revise; remove speculation about a “sensitive” neighbor and unsafe stair advice, then use neutral quiet rules, accessible options, and host responsibility', [
    q('Why does the host share responsibility?', 'The quiet conditions and thin walls were not explained before arrival', 'The guest had broken furniture', 'The neighbor owned the apartment', 'The elevator was new', 'Accurate listing information shapes expectations.'),
    q('Why is the neighbor’s work schedule removed?', 'The host should not disclose or guess private personal details', 'Neighbors never work early', 'Quiet hours require no reason', 'The guest requested a biography', 'A rule can be explained without exposing another resident.'),
    q('What replaces advice to use the stairs?', 'Follow building rules while keeping safe and accessible lift use available', 'Avoid leaving after ten', 'Carry luggage down emergency stairs', 'Turn the elevator off', 'Noise reduction should not create access or safety barriers.'),
    q('What principle guides the resolution?', 'Use clear shared rules without blaming or exposing a resident', 'Let the loudest person decide', 'Avoid all building facilities', 'Publish the complaint details', 'The response combines accountability and privacy.'),
    q('What long-term correction does the host make?', 'Update the listing and arrival information with clear quiet policies', 'Label the neighbor sensitive', 'Ban all balcony access', 'Promise complete silence', 'Future guests need accurate advance notice.'),
  ], { baseQuiz: [
    q('Why does the host contact the guest?', 'A resident reported late balcony voices', 'The booking was cancelled', 'The elevator stopped', 'The guest lost a key', 'The message concerns a noise report.'),
    q('What was the reported source?', 'A normal conversation on the balcony', 'A television indoors', 'Construction work', 'A suitcase in the lift', 'The voices carried farther than expected.'),
    q('Why does the host accept responsibility?', 'Important building and quiet-hour information was missing', 'The guest had paid too little', 'The host joined the conversation', 'The resident had no complaint', 'Advance disclosure was incomplete.'),
    q('What does the guest agree to do?', 'Keep later conversations indoors', 'Use only the stairs', 'End the stay', 'Stop speaking after dinner', 'They choose a practical adjustment.'),
    q('What will the host improve?', 'The listing and arrival instructions', 'The resident’s work schedule', 'The guest’s travel plan', 'The apartment price', 'Clear information can prevent repetition.'),
  ], replaceText: [
    ['A bit of both, if I\'m being fully transparent. He works early mornings, so even normal sounds bother him more than most people.', 'I should not describe the resident as sensitive or disclose private details. The relevant facts are the agreed quiet hours, thin walls, and shared-building rules.'],
    ['Just that the elevator is noisy after ten as well, so some guests choose the stairs during quiet hours instead.', 'The lift can be noisy, but guests who need it should use it safely. I will report the maintenance issue rather than shifting the burden to stairs.'],
    ['Good to know. We\'ll take the stairs tonight, then, and keep future conversations indoors after nine.', 'We will keep later conversations indoors and follow the building guidance while using whichever safe, accessible route we need.'],
  ] }),

  R('04', 'revise; replace broad market stereotypes and pressure to offer half with local research, consent to negotiate, fair dealing, product checks, and respectful refusal', [
    q('Why was the guide’s claim about future tourists too broad?', 'One purchase does not justify predicting an entire market’s prices', 'Tourists never affect demand', 'Vendors use fixed prices everywhere', 'The narrator bought no spice', 'The causal claim exceeded the available evidence.'),
    q('What should a traveler check before bargaining?', 'Whether negotiation is customary and welcomed for that place and item', 'Whether half-price offers are always required', 'Whether tea is included', 'Whether other tourists are watching', 'Norms vary by context.'),
    q('What makes a negotiation fair?', 'Respectful offers, truthful information, no pressure, and freedom to walk away', 'Forcing the lowest possible price', 'Assuming every vendor enjoys theater', 'Comparing livelihoods publicly', 'Both parties retain agency.'),
    q('What practical checks are added?', 'Quantity, quality, ingredients, origin claims, import rules, and total price', 'Only the color of the package', 'The vendor’s private income', 'A promise of authenticity', 'Travel purchases can involve product and border questions.'),
    q('What does the narrator ultimately value?', 'A respectful exchange without turning people into a cultural performance', 'Winning every bargain', 'Paying half in every market', 'Receiving free tea', 'The revised reflection preserves human dignity.'),
  ], { replaceText: [
    ['My guide later told me that paying the first price wasn\'t just unnecessary, it actually made future tourists\' bargaining harder too.', 'My guide said negotiation was common in that part of this market, but customs differed by stall, item, and posted-price policy.'],
    ['She said that when tourists pay whatever is asked, vendors raise their opening prices for everyone who visits after them.', 'She did not claim my purchase controlled future prices. She advised checking local norms and asking politely whether the price was negotiable.'],
    ['My hands were slightly shaking as I offered half the asking price, unsure whether that would insult the vendor.', 'I asked whether negotiation was welcome, checked quantity and quality, then made a respectful offer based on local guidance rather than automatically cutting the price in half.'],
    ['Sitting there, sipping tea I hadn\'t expected, I realized bargaining wasn\'t really about the money at all.', 'I accepted the tea without assuming hospitality was part of every sale. Price still mattered because fair dealing affects both buyer and seller.'],
    ['It was a small ritual, a bit of theater almost, where both people got to feel like they had won something.', 'The exchange felt friendly, but I avoided turning the vendor into a performance for my travel story. Either person could decline and end the negotiation.'],
    ['Over the following days, I bargained for almost everything, and each exchange felt less like a transaction and more like a conversation.', 'Later I negotiated only where it was customary, accepted posted prices elsewhere, checked import rules, and walked away respectfully when we did not agree.'],
  ] }),

  R('05', 'revise; add work authorization, tax, insurance, data security, time-zone expectations, accommodation reliability, and nonpublic handling of client information', [
    q('What major issue is missing from glamorous travel photos?', 'Remote work still depends on reliable systems, lawful status, and ordinary routines', 'Every destination has fast internet', 'Clients prefer café meetings', 'Travel eliminates loneliness', 'The lifestyle has operational and legal conditions.'),
    q('Why was public café Wi-Fi a poor default?', 'Sensitive client work requires approved security and privacy controls', 'Cafés never offer internet', 'Video calls are unlawful abroad', 'Coffee damages computers', 'Connectivity quality is not the only concern.'),
    q('What must be checked before working in another place?', 'Entry and work rules, tax, insurance, employer policy, and client obligations', 'Only accommodation photographs', 'Only weather and food', 'Only the return flight', 'Remote work is not automatically authorized by tourist entry.'),
    q('Why does Rizky stay longer?', 'It supports routine and deeper local relationships', 'It guarantees friendship', 'It removes every tax issue', 'It makes internet free', 'The change addresses pace and connection without promises.'),
    q('What does “test it” now include?', 'A lawful limited trial with secure work and realistic cost and health planning', 'Working secretly for one month', 'Using any public network', 'Ignoring time-zone duties', 'A trial still needs responsible preparation.'),
  ], { replaceText: [
    ['I missed an important client call because the café\'s wifi failed completely, right as I was about to present.', 'I once relied on café Wi-Fi for a client call. Beyond failure, public work raised privacy and security concerns, so I now use approved protected arrangements and suitable private space.'],
    ['Beyond internet issues, what else surprised you about this lifestyle once you actually started living it?', 'What else must someone examine before working from another country or region?'],
    ['Loneliness, honestly. Even though I\'m constantly meeting new people, deep friendships take longer to build when you leave every few weeks.', 'Entry and work authorization, tax, insurance, employer and client policy, data location, time zones, healthcare, cost, and suitable accommodation. Loneliness also affected me.'],
    ['Test it before committing fully. Take one month away first, since it reveals whether you genuinely enjoy this, or just enjoy the idea of it.', 'After confirming lawful work and organizational approval, test a limited period. Use secure systems, a realistic budget, health planning, and an emergency route rather than copying an online image.'],
  ] }),

  R('06', 'retain; reflective travel monologue carefully distinguishing memory, idealization, disappointment, change, and new observation', [
    q('Why had the childhood city become idealized?', 'Few memories left space for feeling and imagination to replace detail', 'The city advertised itself falsely', 'The park had never existed', 'The bakery family wrote to her', 'Distance and incomplete memory shaped expectations.'),
    q('What does the smaller slide demonstrate?', 'Childhood scale and present reality can differ', 'The city wanted to disappoint her', 'Modern equipment is always worse', 'The park had closed', 'A concrete object exposes the memory comparison.'),
    q('Why does she call her first reaction unfair?', 'The city had continued changing during the twenty years she was away', 'Travelers must like every change', 'Childhood memories are false', 'The bakery was unchanged', 'The place did not owe her preservation.'),
    q('What role does the bakery play?', 'A sensory continuity coexists with wider change', 'It proves the whole city stayed the same', 'It restores the old slide', 'It identifies the narrator', 'One familiar detail carries emotion without freezing the city.'),
    q('How does the narrator’s attention change?', 'She stops demanding the past and notices the present city', 'She searches only for childhood objects', 'She leaves immediately', 'She photographs every old corner', 'Acceptance allows new memories.'),
  ]),

  R('07', 'revise; fix the repeated tag and add consent, separate plans, lodging changes, safety contacts, accessibility, finances, and boundaries to the travel-companion compromise', [
    q('Why was a room change a legitimate option?', 'Compatibility, privacy, sleep, safety, or access needs may justify separate lodging', 'Travel partners must remain together', 'The guide chooses all friendships', 'Spontaneous travelers cannot share rooms', 'Compromise is not mandatory when important needs conflict.'),
    q('What did direct conversation reveal?', 'Planning reduced the caller’s anxiety while flexibility mattered to her roommate', 'One person had lost the itinerary', 'The tour required early mornings', 'Neither wanted afternoon activities', 'The disagreement concerned needs, not bad character.'),
    q('What else should companions agree besides schedule?', 'Budget, privacy, worship, safety contacts, access needs, and independent movement', 'One person’s passwords', 'A rule never to separate', 'Public sharing of locations', 'Travel compatibility has several practical dimensions.'),
    q('Why did the morning-afternoon plan work?', 'It protected a shared anchor while allowing separate choices', 'It forced both to be spontaneous', 'It removed the tour schedule', 'It guaranteed every discovery', 'The compromise preserved both structure and autonomy.'),
    q('What conclusion avoids overgeneralization?', 'This pairing enriched this trip, but different companions may need other boundaries', 'Opposites always travel best', 'Room changes prove failure', 'Planning prevents discovery', 'One positive experience is not a universal rule.'),
  ], { replaceText: [
    ['She suggested a compromise, that we\'d plan mornings together but leave afternoons open for whichever of us wanted structure or freedom.', 'She suggested shared morning plans and independent afternoons. We also agreed on check-ins, budget, room privacy, worship, safety, access needs, and how to say no.'],
    ['It worked beautifully, surprisingly. Her spontaneous afternoons led us to places no itinerary would have suggested.', 'It worked for us. We could still request separate rooms or plans if sleep, privacy, safety, health, or accessibility needs made compromise unsuitable.'],
    ['That despite our differences, or maybe because of them, the trip became far richer than if I\'d traveled with someone exactly like myself.', 'Our differences enriched this trip after honest agreements. That does not mean opposites always travel well or that anyone must remain in an uncomfortable pairing.'],
    ['Beautiful story. Are you two still in touch after the tour ended?', 'That is a useful, balanced lesson. Are you still in touch?'],
    ['We are, actually. We\'re already planning our next trip together, mornings mine, afternoons hers.', 'We are. For the next trip, we will review the same boundaries instead of assuming the first arrangement must always fit.'],
  ] }),

  R('08', 'retain; strong accessible-travel account centered on disabled agency, functional information, verified features, safe alternatives, privacy, and ordinary shared responsibility', [
    q('What did the broken museum lift reveal?', 'A website label can remain visible after real access conditions change', 'Museums never repair lifts', 'Salma preferred outdoor travel', 'The group had no schedule', 'Current confirmation mattered.'),
    q('Why did the hotel send measurements and photographs?', 'Specific evidence helped Salma judge whether the room met her needs', 'The group requested a diagnosis', 'The hotel wanted public advertising', 'Measurements replace every inspection', 'Concrete facts support personal decisions.'),
    q('What does choosing another café demonstrate?', 'Access is a requirement, not a favor requiring unsafe acceptance', 'Portable ramps are always forbidden', 'Staff should carry every chair', 'The group disliked the menu', 'The response protects safety and dignity.'),
    q('Why is “overcoming the city” rejected?', 'It would place attention on Salma’s body instead of barriers and shared planning', 'Salma did not enjoy travel', 'The city had no hills', 'Wheelchairs remove every barrier', 'The narrative avoids inspiration stereotypes.'),
    q('What is the strongest accessibility description?', 'Actual features, measurements, current status, alternatives, and a confirmation contact', 'A single symbol', 'A five-star review', 'A promise that staff will help', 'Usable information is detailed and verifiable.'),
  ]),

  R('09', 'retain; strong baggage-claim monologue integrating official reporting, identifier privacy, accurate valuation, receipts, insurance limits, and separate security response', [
    q('Why did the narrator verify the helper?', 'A stressful airport problem can create opportunities for impersonation or fraud', 'Airline staff never leave desks', 'The exit was locked', 'Only police handle luggage', 'Official identity and channel reduced risk.'),
    q('Why were passport and medicine in hand luggage?', 'Important items required continuous access under relevant guidance', 'Checked bags never return', 'The airline demanded it', 'Insurance covers no medicine', 'Packing reduced dependence on the missing bag.'),
    q('What did reasonable values prevent?', 'An inaccurate or inflated claim based on tired memory', 'The airline locating the bag', 'The purchase of replacements', 'A security review', 'Records supported honest valuation.'),
    q('Why did the bag’s return not close every issue?', 'Temporary costs and possible information exposure still needed accurate resolution', 'Returned bags cannot be used', 'The trip had ended', 'The hotel owned the contents', 'Different consequences followed separate processes.'),
    q('What record-keeping principle closes the story?', 'Preserve evidence and update claims when facts change', 'Submit the highest possible value', 'Post reference numbers publicly', 'Wait before reporting sensitive contents', 'Accurate documentation is continuous.'),
  ]),

  R('10', 'retain; strong responsible-tourism dialogue protecting children, dignity, safeguarding, local authority, privacy, worker conditions, and accountable community benefit', [
    q('Why may guardian permission still be insufficient for travel photography?', 'Dignity, safeguarding, future exposure, and the child’s own wishes also matter', 'Children can never be photographed', 'Tourists own every image', 'Locations are not private', 'A signature does not settle every ethical concern.'),
    q('Why can donated goods create problems?', 'They may be unneeded, wasteful, difficult to import, or harmful to local providers', 'All supplies are prohibited', 'Communities prefer cash only', 'Visitors cannot carry bags', 'Needs should be defined locally.'),
    q('What makes the cooperative promising but not automatically approved?', 'Its published practices still require verification', 'Women cannot run tours', 'Public prices are confidential', 'Photography rules guarantee fairness', 'Transparent claims are evidence to check, not proof by themselves.'),
    q('Why does Amina avoid attacking the first operator publicly?', 'She lacks full evidence and can raise specific concerns through responsible channels', 'Online reviews are always wrong', 'The center requested praise', 'Safeguarding concerns should be hidden', 'Accuracy and process matter even when declining.'),
    q('What does responsible travel keep local?', 'Decision-making, dignity, and a fair share of benefits', 'Only tourist entertainment', 'Private stories for marketing', 'Untrained teaching roles', 'Community authority is central.'),
  ]),
];
