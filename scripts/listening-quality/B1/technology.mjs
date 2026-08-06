import { q } from '../helpers.mjs';

const R = (id, decision, additions, extra = {}) => ({
  id: `b1-technology-${id}`,
  level: 'B1',
  scriptDecision: decision,
  tags: { 0: 'thoughtful', 2: 'carefully', 4: 'reflective', 6: 'honestly', 8: 'seriously', 10: 'gently', 12: 'encouraging', 14: 'sincere', 16: 'thoughtful', 18: 'carefully' },
  additions,
  ...extra,
});

export const reviews = [
  R('01', 'revise; replace a rigid contact whitelist with agreed expectations, urgent channels, and accessibility-aware notification choices', [
    q('Why is silence not the same as reliability?', 'Reliability depends on clear expectations and appropriate response channels', 'Every message deserves an instant reply', 'Phones measure professional skill', 'Delayed replies are always harmless', 'The narrator separates responsiveness from constant interruption.'),
    q('What makes the new routine responsible?', 'People know the response times and how to reach her for genuine urgency', 'All applications are deleted', 'Her manager reads family messages', 'She never changes the settings', 'Communication and an urgent route support the boundary.'),
    q('Why should another person not copy her exact settings?', 'Jobs, care duties, emergencies, and accessibility needs differ', 'Notification settings are private property', 'Only managers can change phones', 'Every application uses the same alert', 'The lesson is a process, not one universal schedule.'),
    q('What does the burned rice illustrate?', 'Attention switching affected an ordinary task', 'The phone controlled the cooker', 'Her family sent an emergency', 'Dinner caused the messages', 'A concrete consequence supports the wider reflection.'),
    q('What is the narrator’s final position on technology?', 'She values it but wants human priorities to guide attention', 'She believes all phones are harmful', 'She wants colleagues to stop messaging', 'She trusts every alert equally', 'Her conclusion is balanced rather than anti-technology.'),
  ], { replaceText: [
    ["Eventually, I decided to run a small experiment. If a notification wasn't from my manager or my family, then it would simply wait until evening.", 'Eventually, I reviewed each alert. I kept essential safety and accessibility notifications, agreed on response times at work, and silenced the rest until planned checks.'],
    ['Now I check messages three times a day, at set hours, and I tell people clearly so nobody assumes I\'m ignoring them on purpose.', 'Now I check routine messages at planned times. People know when to expect a reply and which agreed channel to use for a genuine urgent need.'],
    ['A few colleagues were skeptical at first, assuming I would miss something important, but nothing serious has ever slipped through in six months.', 'A few colleagues were skeptical, so we reviewed the arrangement after a month. It worked for my role, although another job, care duty, emergency need, or disability could require different settings.'],
  ] }),

  R('02', 'revise; add authorization, confidentiality, evidence checking, disclosure, and human accountability to the AI workflow', [
    q('What important issue had Bima initially overlooked?', 'Whether company data was allowed in the tool', 'Whether the report used enough adjectives', 'Whether Citra owned a computer', 'Whether management preferred handwriting', 'Authorization and confidentiality come before convenience.'),
    q('Why is a fluent report still risky?', 'Polished language can hide invented facts or weak reasoning', 'Good grammar always changes the numbers', 'Long reports cannot be checked', 'Software never produces complete sentences', 'Surface quality is not evidence of accuracy.'),
    q('Who remains accountable for the submitted report?', 'The employee and organization using the tool', 'The software alone', 'An unnamed internet user', 'The first reader only', 'Human responsibility cannot be delegated to generated text.'),
    q('Which workflow do they finally choose?', 'Use approved data, draft an outline, verify claims, edit, and disclose use when required', 'Upload every record and submit the first result', 'Let the tool choose confidential facts', 'Stop understanding the report', 'The ending defines a controlled assistance process.'),
    q('What is Citra’s main concern about repeated dependence?', 'The team may lose subject knowledge and careful pattern recognition', 'Reports will become too short', 'Managers will ban all computers', 'Coworkers will stop speaking', 'Her concern is capability and judgment, not merely style.'),
  ], { replaceText: [
    ['They were accurate on the surface, but the analysis felt generic, as if it could describe almost any team\'s month rather than ours specifically.', 'They looked accurate on the surface, but I found one invented explanation. I also need to know whether our policy allows company data in this tool.'],
    ['That\'s a fair point, although I edited mine afterward, so the final version still reflected our actual numbers and decisions.', 'That is serious. I used a version approved by the company and removed restricted details, but I still should verify every claim against the source records.'],
    ['Precisely. As a result, I still understand what I\'m reporting, instead of just approving whatever sentences appear on the screen.', 'Precisely. I keep the reasoning, evidence, and decisions under human control, then document or disclose the tool use if our policy requires it.'],
    ['Fair enough. I\'ll write my own outline first from now on, then let the tool help with phrasing, the same way you do.', 'Fair enough. I will confirm authorization, use only permitted data, write my own outline, check every factual claim, edit the result, and remain accountable for what I submit.'],
  ] }),

  R('03', 'revise; remove unreliable visual tells and the claim that absent news coverage is evidence, then teach source, context, corroboration, and uncertainty', [
    q('Why can visual defects be a weak test?', 'Manipulated media may look convincing, while genuine compressed video may look strange', 'Lighting never changes naturally', 'All genuine speakers blink equally', 'Only journalists can watch videos', 'Appearance alone can create both false confidence and false suspicion.'),
    q('What should a viewer trace first?', 'The earliest available source and its original context', 'The angriest comment', 'The largest account', 'The shortest copy', 'Provenance helps establish where and when media appeared.'),
    q('Why does missing news coverage not settle the question?', 'A real local event may not yet be reported, and a false claim may be widely repeated', 'News outlets report every event instantly', 'Popular posts are always verified', 'Silence proves a video is false', 'Absence or popularity alone is not proof.'),
    q('What should someone do while verification remains uncertain?', 'Avoid amplifying the claim and describe the uncertainty accurately', 'Add a dramatic caption', 'Download and edit the video', 'Assume the preferred explanation', 'Responsible sharing includes restraint.'),
    q('What emotional reaction does Reza treat as a warning?', 'A sudden urge to share because of anger or fear', 'Calm curiosity about the source', 'A wish to read several reports', 'Concern about the upload date', 'Strong emotion can reduce careful checking.'),
  ], { baseQuiz: [
    q('Why should ordinary listeners care about manipulated videos?', 'Almost anyone can encounter and quickly spread one', 'Only researchers can receive videos', 'Manipulation exists only in films', 'Sharing requires specialist equipment', 'Ordinary sharing decisions affect distribution.'),
    q('What limitation of visual clues does Reza explain?', 'They can mislead because false media may look natural and genuine video may contain defects', 'They work perfectly on every screen', 'They reveal the author’s name', 'They replace source checking', 'Technical appearance is not a complete verification method.'),
    q('What habit matters during fast scrolling?', 'Pausing before sharing emotional content', 'Increasing playback speed', 'Reading only the comments', 'Following the largest account', 'A pause interrupts impulsive amplification.'),
    q('What practical checks are suggested?', 'Trace the source, date, context, and compare reliable independent evidence', 'Count the number of likes', 'Trust any matching repost', 'Judge only the speaker’s face', 'Several contextual checks work together.'),
    q('What is Reza’s final advice?', 'Treat hesitation as a reason to investigate before sharing', 'Share first and correct later', 'Believe every polished clip', 'Ignore uncertainty', 'Doubt should prompt verification rather than amplification.'),
  ], replaceText: [
    ['Lighting inconsistencies are common, along with unnatural blinking, or a voice that doesn\'t quite match the mouth movements if you watch closely enough.', 'Visual or audio defects can be clues, but they are not proof. Manipulated media may look convincing, while genuine compressed or translated video may also look strange.'],
    ['Search whether reliable news outlets are reporting the same event. If nobody credible is covering it, that\'s meaningful information on its own.', 'Trace the earliest available upload, date, location, and full context. Compare independent reliable reporting or fact-checking, but remember that missing coverage alone does not prove a local event is false.'],
    ['Some will, some won\'t, but even a small percentage pausing before sharing reduces how quickly false videos spread across a whole network.', 'Some will and some will not. While a claim remains uncertain, avoid amplifying it, report harmful deception through appropriate channels, and describe what is not yet known.'],
  ] }),

  R('04', 'revise; remove the admission of scrolling at red lights and make disconnection compatible with emergencies, care duties, navigation, and accessibility', [
    q('Why was the original weekend challenge incomplete as general advice?', 'Some people need a reachable device for safety, care, work, navigation, or accessibility', 'Every weekend requires social media', 'Phones cannot make calls', 'Drawers damage batteries', 'A safe boundary depends on real responsibilities.'),
    q('What does the narrator do before planned offline time now?', 'Checks essential duties and gives close contacts an urgent route', 'Blocks every relative', 'Leaves home without directions', 'Turns off emergency alerts', 'Preparation makes the boundary responsible.'),
    q('What did the call with his sister reveal?', 'A longer conversation made space for a concern she had not texted', 'She had lost her telephone', 'Their messages had been deleted', 'She opposed every screen', 'The medium supported a deeper exchange in this case.'),
    q('What conclusion would be too strong?', 'That texting is always shallow and phone-free time suits everyone', 'That attention can become habitual', 'That boundaries can be tested', 'That a call may feel different from a text', 'One personal experience cannot define all communication.'),
    q('What lasting change does he choose?', 'A limited weekly period away from routine phone use', 'A permanent ban on technology', 'No contact with family', 'A week without emergency access', 'The new practice is modest and repeatable.'),
  ], { replaceText: [
    ['I realized how many small moments I used to fill with scrolling, waiting for coffee, riding elevators, sitting at red lights without even noticing.', 'I realized how many safe, unoccupied moments I filled with scrolling—waiting for coffee, riding elevators, or sitting at home between tasks—without noticing. I never use a handheld phone while driving.'],
    ['That conversation made me question whether constant texting actually connects people, or whether it sometimes replaces deeper conversations with quicker, shallower ones.', 'That conversation showed me that a call created room for depth on that occasion. It did not prove that texting is shallow for everyone; different people communicate and access technology differently.'],
    ['As a result, I now leave my phone in another room every Saturday morning, even though nobody is forcing me to anymore.', 'Now I plan a limited phone-free period after checking care, work, travel, and safety needs. Close contacts know an available route for genuine urgency.'],
  ] }),

  R('05', 'revise; keep the guardian in charge and add developmental fit, privacy, safety settings, accessibility, and collaborative review', [
    q('Why do Nadia and Fikri avoid setting rules themselves?', 'Bayu’s guardian has the authority and relevant knowledge', 'They do not know Bayu’s name', 'The tablet belongs to a school', 'Rules are never useful', 'Their role is supportive rather than parental.'),
    q('What should guide a screen plan besides time?', 'Content, purpose, age, privacy, safety, sleep, access needs, and family routines', 'Only the price of the tablet', 'The number of cousins', 'Whatever autoplay recommends', 'The dialogue broadens the plan beyond one clock limit.'),
    q('Why is watching together useful?', 'An adult can discuss content and notice problems rather than leaving autoplay unexamined', 'It guarantees every video is true', 'It removes the need for settings', 'It lets cousins collect passwords', 'Co-use supports guidance but is not a complete safeguard.'),
    q('What private information should Bayu avoid sharing?', 'His location, passwords, school details, or family information', 'His favorite color', 'A book title', 'A general hobby', 'The revised conversation names practical privacy risks.'),
    q('How should the plan change over time?', 'The guardian should review it as Bayu’s needs and behavior change', 'It should remain fixed forever', 'Bayu should hide problems', 'The cousins should enforce it secretly', 'A family plan benefits from review rather than permanent assumptions.'),
  ], { replaceText: [
    ['I don\'t want to lecture our aunt, but if he starts building habits now, they\'ll likely stay with him for years, not just this year.', 'I do not want to lecture our aunt or predict Bayu’s future. Since she asked, we can offer questions while she makes decisions based on his age, needs, and family routines.'],
    ['Maybe something like no screens during meals, and nothing right before bedtime, since that seems to affect how children sleep.', 'Maybe she could test device-free meals and a calm bedtime routine, then adjust them if Bayu’s sleep, learning, accessibility, or family needs suggest something different.'],
    ['Right, so maybe our aunt could watch alongside him sometimes, instead of just handing over the tablet and walking away.', 'Right. She could sometimes watch with him, use age-appropriate safety and privacy settings, and teach him not to share location, passwords, school details, or family information.'],
    ['Exactly. If we only forbid things, he\'ll likely find ways around it later. If we explain reasons, he might actually understand them.', 'Exactly. Clear reasons, a way to report upsetting contact, and regular review may teach judgment better than unexplained punishment alone.'],
  ] }),

  R('06', 'revise; remove the hidden outdoor key and add secure recovery, updates, privacy review, household consent, and safe manual operation', [
    q('Why was a hidden spare key a poor solution?', 'An accessible outdoor key can create a physical security risk', 'Keys cannot open locks', 'Friends dislike metal objects', 'Smart locks never fail', 'A backup should not introduce an obvious new weakness.'),
    q('What does a safe manual backup require?', 'Authorized access that is tested and stored securely', 'A public code beside the door', 'Permanent internet service', 'The same password for every device', 'Resilience includes secure recovery.'),
    q('What privacy question does the narrator add?', 'What data devices collect and whether household members or guests understand it', 'Which light color is fashionable', 'How many switches friends own', 'Whether a thermostat has a screen', 'Convenience can affect other people’s data.'),
    q('Why are software updates mentioned?', 'Unsupported or unpatched devices can increase security risk', 'Updates always remove manual controls', 'Every update changes the electricity supply', 'Old devices cannot contain data', 'Maintenance is part of connected-device safety.'),
    q('What is the main lesson?', 'Convenience should be paired with secure, tested alternatives and informed choices', 'Automation must be rejected completely', 'Internet failures are impossible', 'Manual controls are always superior', 'The conclusion balances usefulness and resilience.'),
  ], { baseQuiz: [
    q('What devices had the narrator installed?', 'Connected lights, heating controls, and a smart lock', 'Only a television', 'Medical equipment', 'A public camera network', 'Several home functions depended on connected devices.'),
    q('What exposed the dependence?', 'A six-hour internet outage', 'A burglary', 'A power bill', 'A visitor’s complaint', 'The outage blocked an ordinary control.'),
    q('What rule did the narrator adopt?', 'Critical devices need a secure, tested offline or manual option', 'Every device needs the same app', 'Keys should be hidden outside', 'Automation must stay online', 'The revised rule combines resilience and security.'),
    q('Did the narrator remove all smart devices?', 'No, the useful devices remained with safer controls', 'Yes, immediately', 'Only the lights remained', 'The apartment was abandoned', 'The conclusion is not anti-technology.'),
    q('What broader review was added?', 'Security updates, data collection, access, consent, and end-of-support', 'Interior decoration only', 'The weather forecast', 'Friends’ preferred brands', 'Ownership includes privacy and maintenance.'),
  ], replaceText: [
    ['I replaced one switch, kept a spare key hidden outside despite the smart lock, and learned exactly how to adjust the thermostat by hand.', 'I restored manual controls, arranged a secure authorized key backup rather than hiding one outside, and tested how to operate the heating safely without the app.'],
    ['It took an afternoon to set up, which felt inconvenient at the time, though it was nothing compared to sitting helplessly in a lit room again.', 'I also reviewed software support, account security, device permissions, and what would happen when a vendor stopped providing updates.'],
    ['But I no longer trust convenience blindly, the way I did when I first filled my apartment with these devices.', 'But I no longer trust convenience blindly. I ask what data is collected and make sure household members and guests understand devices that could affect their privacy.'],
    ['My friends tease me about my hidden spare key, but I notice they\'ve started copying the idea anyway.', 'My friends no longer hear about a key hidden outdoors. They hear about tested recovery, secure storage, limited access, and devices that remain safely usable when a service fails.'],
  ] }),

  R('07', 'revise; prevent screen-time totals from becoming a diagnosis or moral score and include purpose, function, accessibility, and context', [
    q('Why was nine hours not meaningful by itself?', 'The total mixed work, navigation, communication, entertainment, and other purposes', 'The phone had counted twice', 'Nine hours is healthy for everyone', 'Reports never contain categories', 'Context changes how a number should be interpreted.'),
    q('What did the detailed report help the caller identify?', 'Unplanned activities she barely remembered choosing', 'A medical diagnosis', 'Her parents’ passwords', 'A broken screen', 'The breakdown supported a specific behavior change.'),
    q('Why does the host reject comparison with other listeners?', 'Needs, work, disability, care duties, and goals differ', 'Nobody else owns a phone', 'Numbers are legally private', 'Five hours is universally ideal', 'A useful benchmark should be personal and functional.'),
    q('What signs matter beyond the total?', 'Whether use disrupts sleep, worship, safety, work, relationships, or chosen priorities', 'Whether the phone is new', 'Whether games have music', 'Whether friends report a lower number', 'Impact matters more than a moralized score.'),
    q('What does the caller advise listeners to do?', 'Review the pattern without shame and choose one meaningful change', 'Delete all applications immediately', 'Hide the weekly report', 'Compete for the lowest total', 'The revised advice is reflective and practical.'),
  ], { replaceText: [
    ['Honestly, defensiveness. I told myself half of that was work-related, checking emails and messages, so it didn\'t fully count.', 'Honestly, defensiveness. Then I realized the total was not a diagnosis or moral score; it mixed work, navigation, calls, reading, and unplanned entertainment.'],
    ['About five hours, and much of that is genuinely intentional now, video calls with my parents, or music while cooking dinner.', 'About five hours, but I do not treat five as a universal target. More of my use is intentional now, including calls with my parents and music while cooking.'],
    ['Check it anyway, even though it\'s uncomfortable. As a result, you can\'t fix a habit that you\'re still pretending doesn\'t exist.', 'Review it without shame. Consider purpose and whether use disrupts sleep, worship, safety, work, relationships, or chosen priorities, then test one meaningful change.'],
    ['Wise advice. Thank you for being so honest with us and our listeners tonight.', 'Wise advice. Different jobs, disabilities, care duties, and access needs produce different totals, so comparison with another listener may mislead us.'],
  ] }),

  R('08', 'retain; strong practical monologue with staged recovery testing, phishing awareness, and no universal product recommendation', [
    q('Why was email moved before less important accounts?', 'It could be used to reset many other services', 'It had the shortest password', 'It contained no personal information', 'It was the newest account', 'The order reflects account dependence.'),
    q('What does the incorrect recovery code show?', 'A backup is only trustworthy after it has been checked', 'Recovery codes should be posted online', 'The password manager created the mistake', 'Testing important accounts is unsafe', 'Verification turns an assumed backup into evidence.'),
    q('Why are recovery codes stored away from the daily device?', 'One lost or damaged device should not remove both access and recovery', 'Codes work only on paper', 'The device cannot display numbers', 'Friends need to read them', 'Separation reduces a shared point of failure.'),
    q('What tension does the emergency plan address?', 'Giving necessary future access without granting routine access now', 'Making every password public', 'Avoiding all trusted contacts', 'Replacing recovery details with chat messages', 'The plan balances continuity and least privilege.'),
    q('Which summary best captures the migration?', 'Security requires credentials, recovery, verification, and device-loss planning to work together', 'One application removes every risk', 'The fastest migration is always safest', 'Unique passwords make recovery unnecessary', 'The conclusion combines several controls.'),
  ]),

  R('09', 'retain; strong privacy incident narrative using data minimization, limited access, retention, consent, and accountable response', [
    q('Why did fewer details improve the service as well as privacy?', 'Volunteers could find the information needed for delivery more easily', 'Families stopped requesting meals', 'Medical notes became shorter', 'Every volunteer became a clinician', 'Data minimization also reduced operational clutter.'),
    q('What principle separated the two lists?', 'Access should match each person’s task', 'All volunteers should see the source record', 'Sensitive data belongs in group chat', 'Old information must remain forever', 'Permissions were based on operational need.'),
    q('Why did the team document retention?', 'Information should be deleted after its stated purpose ends', 'Spreadsheets cannot be edited', 'Drivers requested more diagnoses', 'The vendor required permanent storage', 'A deletion schedule limits unnecessary exposure.'),
    q('What made the response accountable without becoming punitive?', 'The team contained and recorded the incident while protecting families and avoiding public blame', 'The mistake was ignored', 'The volunteer was named publicly', 'All evidence was erased', 'Responsible response addresses harm and learning.'),
    q('Which assumption changes for the narrator?', 'Collecting more information does not automatically mean providing better care', 'Technology always reduces dignity', 'Addresses are never needed', 'Volunteers should avoid all records', 'The ending distinguishes useful data from excessive collection.'),
  ]),

  R('10', 'retain; strong governance dialogue covering necessity, consent, bias, alternatives, accessibility, retention, and accountability', [
    q('Why is a consent sentence alone inadequate?', 'Guests need understandable information and a fair alternative', 'Consent must always be verbal', 'Registration forms cannot mention cameras', 'Only vendors can give consent', 'Valid choice requires clarity and freedom from unfair disadvantage.'),
    q('What could a false match cause?', 'Delay or an unjust challenge for a guest', 'Automatic deletion of every ticket', 'A faster entrance for everyone', 'A new QR code design', 'The dialogue connects technical error to human impact.'),
    q('Why does “mathematical template” not end the privacy concern?', 'Changing the data format does not remove biometric sensitivity or misuse risk', 'Templates always contain a photograph', 'Mathematics is illegal at events', 'The vendor owns every face', 'A technical label cannot replace risk analysis.'),
    q('Which decision principle is central?', 'Collect sensitive data only when the need and proportionality are established', 'Choose the most modern-looking system', 'Let the vendor define community values', 'Require one method for every guest', 'Necessity controls the technology choice.'),
    q('What does the final line imply?', 'Responsible innovation may mean declining an unnecessary system', 'Simple tools are never innovative', 'The event should have no check-in', 'Facial recognition is required later', 'Governance is judged by fit, not novelty.'),
  ]),
];
