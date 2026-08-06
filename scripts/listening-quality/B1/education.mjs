import { q } from '../helpers.mjs';

const R = (id, decision, additions, extra = {}) => ({
  id: `b1-education-${id}`,
  level: 'B1',
  scriptDecision: decision,
  tags: { 0: 'thoughtful', 2: 'carefully', 4: 'reflective', 6: 'honestly', 8: 'seriously', 10: 'gently', 12: 'encouraging', 14: 'sincere', 16: 'thoughtful', 18: 'carefully' },
  additions,
  ...extra,
});

export const reviews = [
  R('01', 'revise; add accreditation, finance, childcare consent, health, employer boundaries, support, and alternatives rather than glorifying exhaustion or promising career mobility', [
    q('Why did the narrator research recognition?', 'A degree’s value depends partly on the provider, program, and intended role', 'Every master’s guarantees promotion', 'Tuition defines quality', 'Managers grant accreditation', 'The credential needed a verified purpose.'),
    q('What belongs in the full cost?', 'Tuition, materials, travel, childcare, lost time, finance terms, and emergency margin', 'Tuition alone', 'Only application fees', 'Her colleagues’ salaries', 'Affordability extends beyond the advertised fee.'),
    q('Why is her daughter not simply a “trade-off”?', 'Care arrangements and the child’s wellbeing require planning and consent from responsible adults', 'Children prevent all study', 'Parents must hide tiredness', 'The manager chooses childcare', 'Ambition does not erase care duties.'),
    q('What should happen if exhaustion harms health or safety?', 'Use appropriate health, academic, work, and family support rather than push through automatically', 'Add more classes', 'Ignore warning signs', 'Let the schedule decide', 'Persistence needs limits.'),
    q('What can she honestly tell colleagues?', 'Explore suitable routes and costs without promising one degree will remove a career barrier', 'Every ceiling is fixed', 'Comfort must always be sacrificed', 'Advanced study is the only route', 'Her experience offers questions, not a guarantee.'),
  ], { replaceText: [
    ['So I spent a month researching part-time programs, and even though the tuition made me nervous, I eventually convinced myself that waiting for a perfect moment would mean waiting forever.', 'I checked recognition, entry and role requirements, teaching support, total costs, finance terms, schedule, accessibility, workload, and alternatives before choosing a part-time program.'],
    ['The first semester nearly broke me, though, because I underestimated how draining it is to sit through lectures after a full day of meetings.', 'The first semester was unsustainable. I discussed workload, health, study support, and realistic pacing rather than treating severe exhaustion as proof of commitment.'],
    ['I also had to accept that my daughter would sometimes see me exhausted and distracted, which is a trade-off no parent enjoys making, however necessary it feels.', 'Our family agreed on childcare, protected time together, backup care, and a review point. My daughter’s needs were not an automatic cost she had to absorb.'],
    ['Whenever a colleague mentions feeling stuck, I tell them the ceiling isn\'t always as fixed as it seems, provided you\'re willing to trade some comfort for a few years.', 'I tell colleagues to examine the real barrier and compare recognized study, workplace learning, mentoring, role change, cost, care, health, and likely—not guaranteed—outcomes.'],
  ] }),

  R('02', 'revise; remove peer permission to leave class, then use course policy, disability and health support, legitimate absence routes, accessible materials, and qualified review of persistent exhaustion', [
    q('Why cannot Yusuf approve partial attendance?', 'Only the course’s actual policy and authorized staff can determine attendance arrangements', 'Students may never leave a room', 'Nadia has no timetable', 'Reading is prohibited', 'A peer cannot invent institutional permission.'),
    q('What should Nadia clarify first?', 'Attendance requirements, learning outcomes, recordings or materials, and available support', 'Whether Yusuf finds lectures boring', 'The professor’s private schedule', 'Other students’ grades', 'The plan needs authoritative information.'),
    q('Why does persistent exhaustion need attention?', 'It may affect health, safety, disability access, or study capacity and has many possible causes', 'It proves poor motivation', 'Lectures cause every illness', 'Sleep advice from Yusuf is treatment', 'A study partner should not diagnose it.'),
    q('What is a responsible short-term plan?', 'Use approved absence or access arrangements and obtain missed content through permitted channels', 'Leave secretly every week', 'Copy another student’s work', 'Ignore required discussion', 'Flexibility remains within course rules.'),
    q('What does Yusuf offer appropriately?', 'Help identify questions and support Nadia in contacting authorized staff', 'Diagnose her sleep', 'Guarantee special treatment', 'Write the assessment', 'Peer support can facilitate rather than decide.'),
  ], { replaceText: [
    ['Have you considered going for the first half and leaving if you\'re genuinely struggling?', 'I cannot decide that partial attendance is allowed. Check the syllabus or ask the professor or student-support office about requirements and approved options.'],
    ['It isn\'t. As long as you\'re not disruptive, most professors don\'t mind, provided you\'re not doing it every single week.', 'Policies differ. Ask about absence, recordings, accessible materials, participation alternatives, disability support, and how missed learning should be completed.'],
    ['That actually sounds reasonable. I could catch the main explanation, then study the rest independently once I\'m less drained.', 'I will contact the authorized staff today and follow the approved plan rather than assuming attendance is all-or-nothing.'],
    ['And if you\'re still exhausted next week, we can talk about your sleep schedule instead of just your study habits.', 'If exhaustion persists or affects safety and function, seek suitable health and student support. I can listen, but I should not diagnose or prescribe sleep.'],
  ] }),

  R('03', 'revise; preserve supervision boundaries and confidentiality, assess barriers without diagnosis, set staged research tasks, follow academic integrity, and avoid normalizing midnight work', [
    q('What is Professor Hana careful not to diagnose?', 'The cause of Wulan’s avoidance from a brief conversation', 'Whether the thesis has a title', 'The Friday deadline', 'Her own drafting style', 'Similar behavior may have different causes.'),
    q('Why is one rough page useful?', 'It is a bounded diagnostic step that can receive specific feedback', 'Bad writing should be submitted as final', 'Page length proves competence', 'Revision is unnecessary', 'A small artifact reveals where support is needed.'),
    q('What rules still apply to a rough draft?', 'Citation, research ethics, data security, originality, and disclosed permitted assistance', 'No academic rules apply before final submission', 'Sources may be invented', 'Private data may be pasted anywhere', 'Draft status does not suspend integrity.'),
    q('How are boundaries protected?', 'Feedback uses official secure channels and agreed hours rather than private family access or midnight pressure', 'Her husband edits student work', 'Wulan sends passwords', 'The professor offers constant contact', 'Support should remain professional.'),
    q('What broader support may be relevant?', 'Academic-skills, disability, language, wellbeing, or research-method support according to need', 'A punishment for every delay', 'Only motivational advice', 'Another student’s thesis', 'Procrastination can signal different barriers.'),
  ], { replaceText: [
    ['Is it that you don\'t know what to write, or that you\'re afraid of writing it badly?', 'Is the barrier scope, evidence, method, language, access, wellbeing, fear of imperfection, or something else? I will not diagnose it from one answer.'],
    ['My first drafts are embarrassing, Wulan. Nobody sees those except me, and occasionally my patient husband.', 'My first drafts are rough. I protect student and research confidentiality and do not share supervised work with family or unauthorized readers.'],
    ['Give yourself permission to write a rough paragraph today, knowing you\'ll revise it later.', 'Draft one bounded paragraph with honest sources. Rough work still follows citation, research ethics, data security, originality, and permitted-tool rules.'],
    ['Send me one rough page by Friday, regardless of how unfinished it feels to you.', 'Send one rough page through the official secure channel by our agreed deadline; then we can identify the next specific support.'],
    ['I\'ll try to remember that the next time I\'m staring at an empty document at midnight.', 'I will also stop treating midnight work as the only path and use academic-skills, disability, language, or wellbeing support if relevant.'],
  ] }),

  R('04', 'revise; remove poverty and ability stereotypes, place child safeguarding and curriculum under the center, distinguish volunteer support from qualified teaching, and protect child privacy', [
    q('Why is “without much money” removed from the framing?', 'A neighborhood should not be reduced to deficit or assumed need', 'Tutoring may occur only in wealthy areas', 'The center hid its address', 'Money never affects education', 'The revised title and account respect community dignity.'),
    q('What did onboarding establish?', 'Safeguarding, background requirements, role limits, curriculum, supervision, reporting, and privacy', 'The volunteer could teach anything', 'Parents waived every right', 'Children’s stories were public', 'Work with minors needs institutional controls.'),
    q('Why was Dimas not labelled as lacking confidence or ability?', 'Silence and errors do not establish a diagnosis, capacity, or cause', 'He always knew the answer', 'Volunteers cannot ask questions', 'Tests are meaningless', 'Observation should remain limited.'),
    q('What is consistency unable to replace?', 'Qualified teaching, special support, safeguarding, and stable program resources', 'A friendly greeting', 'Regular attendance', 'Clear explanations', 'Reliability helps but is not equivalent to expertise.'),
    q('How is child privacy protected?', 'No unnecessary names, images, histories, or progress details are shared outside authorized channels', 'All success is posted online', 'Volunteers keep personal files', 'Parents receive other children’s scores', 'Educational stories should not expose minors.'),
  ], { title: 'Learning My Role as a Community-Center Tutor', replaceText: [
    ['I started tutoring in that neighborhood almost by accident, after a coworker mentioned that the local community center needed volunteers, and I had nothing better to do on Sunday afternoons.', 'I applied to a community-center tutoring program. Before meeting children, I completed its screening, safeguarding, role, curriculum, privacy, and reporting requirements.'],
    ['Within weeks, though, I noticed something that surprised me: these kids weren\'t behind because they lacked ability, but because nobody had ever explained things slowly enough for them.', 'I could observe learning responses, but I could not declare why a child struggled. Teachers and relevant specialists handled assessment and individualized support.'],
    ['Several mentioned tutors who had quit after a few sessions, so consistency alone, just showing up every single Sunday, mattered more than any clever teaching method.', 'Reliable attendance mattered, yet consistency did not replace qualified teachers, safeguarding, special support, curriculum, or stable resources.'],
    ['I\'ve since realized that despite having far less time than a certified teacher, showing up reliably can matter as much as expertise does.', 'I learned that a supervised volunteer can support practice and encouragement without claiming equivalence to a qualified teacher.'],
    ['Even though I still don\'t always know the right explanation immediately, I\'ve learned that admitting confusion openly builds more trust than pretending certainty.', 'When unsure, I use approved materials or ask the supervisor. I never invent an explanation or share a child’s name, image, history, or progress publicly.'],
  ] }),

  R('05', 'revise; make nursing a regulated transition requiring accredited education, supervised clinical competence, licensing, finances, health, patient privacy, and no guaranteed temporary discomfort', [
    q('Why did caring for her father not qualify Ratna as a nurse?', 'Inspiration is different from accredited education, supervised competence, and authorization', 'Family members cannot observe care', 'Accounting forbids health study', 'Emotion has no value', 'Motivation does not replace professional requirements.'),
    q('What did Ratna verify before enrolling?', 'Entry, accreditation, clinical placement, licensing, cost, schedule, health, and background requirements', 'Only the course advertisement', 'Her father’s records', 'A guaranteed hospital job', 'Regulated work requires a complete pathway.'),
    q('How did accounting remain relevant?', 'Attention to detail and transferable skills helped, while clinical skills still needed assessment', 'It removed clinical training', 'It guaranteed licensing', 'It replaced patient communication', 'Transferable ability has limits.'),
    q('Why is “discomfort is temporary” revised?', 'Difficulty, disability, finance, care, and outcomes vary and cannot be promised', 'Beginners never feel discomfort', 'Career change is always permanent', 'Older students cannot qualify', 'Encouragement should not erase real constraints.'),
    q('What must Ratna protect when discussing motivation?', 'Her father’s medical privacy and dignity', 'The school’s marketing plan', 'Her former salary only', 'A classmate’s exam result', 'A family experience is not public clinical data.'),
  ], { replaceText: [
    ['My father was hospitalized for several weeks, and watching the nurses care for him, I felt something I hadn\'t felt at my desk in years.', 'A family hospital experience motivated me, but I protect my father’s medical privacy. Inspiration did not establish my suitability or competence.'],
    ['Badly, at first. I underestimated how tired I\'d be studying anatomy after eight hours of spreadsheets.', 'Before enrolling, I checked accredited education, entry, clinical placement, licensing, cost, schedule, health, background, care, and support requirements. The workload still required adjustment.'],
    ['Surprisingly not. The attention to detail translated directly, even though the subject matter felt worlds apart.', 'Attention to detail transferred, but accounting did not replace supervised clinical learning, patient safety, communication, or formal competence assessment.'],
    ['Provided you\'re willing to feel like a beginner again, the discomfort is temporary, but staying stuck rarely is.', 'Investigate the regulated pathway, finances, care, health, aptitude, and alternatives. Discomfort and outcomes vary; no story guarantees qualification or employment.'],
  ] }),

  R('06', 'revise; require immediate reporting of an exposed answer key, protect assessment integrity and classmate privacy, and avoid using another disciplinary case as a dramatic moral device', [
    q('What should the narrator have done when the key was visible?', 'Look away and notify the proctor so exposure could be controlled and documented', 'Continue the exam silently', 'Photograph the screen as proof', 'Tell classmates afterward', 'Protecting integrity requires more than personal restraint.'),
    q('Why might the practice exam need review?', 'Other students may have seen the key and question security may be affected', 'Every wrong answer must be removed', 'The narrator lost ten points', 'Practice work has no rules', 'The institution must assess broader exposure.'),
    q('Why is the classmate’s later sanction removed?', 'A student’s disciplinary details require privacy and fair process', 'Misconduct has no consequences', 'The narrator caused the copying', 'Schools cannot investigate', 'Moral learning should not expose another person.'),
    q('What pressure affected the narrator?', 'Scholarship consequences and two unanswered questions', 'A request from the classmate', 'A public ranking', 'The proctor’s instruction to copy', 'The temptation had a specific context.'),
    q('How is integrity defined?', 'Honest repeated choices plus reporting conditions that threaten fairness', 'A fixed trait only some people possess', 'Perfect grades', 'Private guilt alone', 'Integrity includes action toward the system.'),
  ], { baseQuiz: [
    q('What was visible during the practice exam?', 'A classmate’s answer key on a laptop', 'The narrator’s scholarship letter', 'A final grade list', 'A teacher’s private email', 'The key created an assessment exposure.'),
    q('What did the narrator do first?', 'Looked away from the answers', 'Copied two answers', 'Closed the classmate’s laptop', 'Sent a photograph', 'She refused the immediate temptation.'),
    q('What should have happened next?', 'The proctor should have been notified promptly', 'The key should remain visible', 'The classmate should be accused publicly', 'The narrator should leave without explanation', 'Authorized staff needed to control the exposure.'),
    q('What happened to the narrator’s score?', 'Two guesses were wrong and the score fell', 'The exam was automatically passed', 'The scholarship ended immediately', 'The key improved the grade', 'The honest choice had an academic cost in the story.'),
    q('What does the narrator learn?', 'Integrity is repeated action under pressure, not a claim of superiority', 'Honest work always earns the highest score', 'Rules matter only when discovered', 'One good decision proves perfect character', 'The conclusion remains humble.'),
  ], replaceText: [
    ['I looked away and stared at my own blank answer instead, which felt oddly harder than the temptation itself had been.', 'I looked away and alerted the proctor privately. Staff secured the screen and documented the possible exposure without asking me to investigate.'],
    ['A week later, that same classmate was caught copying answers during the actual final exam, and the consequences were severe, a suspension that delayed his graduation by a full year.', 'The institution reviewed whether other students saw the key and whether questions remained valid. I was not entitled to another student’s confidential disciplinary record.'],
    ['I remember feeling relieved rather than superior, because I recognized how easily that could have been me, had circumstances been slightly different that day.', 'I felt relief rather than superiority. Reporting the exposure protected fairness better than merely looking away while leaving the key available.'],
  ] }),

  R('07', 'revise; qualify online-course credibility through recognition, assessment, identity and privacy controls, accessibility, support, practical competence, and learner context', [
    q('Why did recorded lectures support Sinta?', 'They fit her care schedule and could be revisited', 'Online courses require no deadlines', 'Her son completed modules', 'Every parent studies at night', 'Flexibility addressed a particular constraint.'),
    q('What should be checked before enrollment?', 'Recognition, outcomes, assessment, support, access, data use, cost, and practical requirements', 'The building’s location only', 'Testimonials only', 'Whether classrooms will disappear', 'Suitability requires verifiable details.'),
    q('Why is “self-discipline” an incomplete explanation?', 'Course design, disability, language, technology, care, and support also affect participation', 'Learners have no responsibility', 'Recorded lectures guarantee success', 'Classrooms require no effort', 'Achievement is not merely personal willpower.'),
    q('What cannot a screen alone establish for some subjects?', 'Observed safe practical competence', 'Any theoretical knowledge', 'Student identity', 'Written reflection', 'Some outcomes require supervised practice.'),
    q('How is credibility judged responsibly?', 'By recognized purpose, valid assessment, evidence of outcomes, and requirements of the intended role', 'Only by what a learner says was applied', 'Only by a physical campus', 'By course length alone', 'Neither delivery mode nor self-report is sufficient.'),
  ], { replaceText: [
    ['I would, provided they understand it demands more self-discipline than a classroom does, since nobody\'s checking whether you actually watched the lecture.', 'I would ask them to check recognition, outcomes, assessment, support, accessibility, technology, privacy, cost, care, and practical requirements. Design matters as well as self-management.'],
    ['I\'d say credibility depends on what you actually learned and applied, not merely on which building you sat in while learning it.', 'Credibility depends on the intended role, recognized provider or award where required, valid assessment, identity controls, and evidence of learning—not location alone.'],
    ['Some subjects, especially hands-on ones, still need physical practice that a screen simply can\'t replicate.', 'Some outcomes require authorized equipment, supervised practice, safety checks, and observed competence. Online theory can support but not automatically replace them.'],
    ['Thank you for having me. I hope other parents hesitating out there give it a genuine try.', 'Thank you. Parents and other learners should choose the format that is recognized, accessible, safe, affordable, and realistic for their circumstances.'],
  ] }),

  R('08', 'retain; strong course-selection monologue testing accreditation, professional requirements, endorsements, outcomes, total cost, privacy, support, and marketing pressure', [
    q('What did the restarting countdown suggest?', 'The scarcity claim may have been a recurring marketing device', 'The final place was sold', 'The authority controlled enrollment', 'The course began each morning', 'Repeated urgency weakened the claim.'),
    q('Why did the narrator contact an external authority?', 'The provider’s claim needed independent confirmation for the intended occupation', 'Authorities choose every student', 'The manager requested it', 'Testimonials were confidential', 'Recognition should be verified at its source.'),
    q('What did independent graduate contact improve?', 'It reduced provider selection of only favorable testimonials', 'It guaranteed salary data', 'It proved accreditation', 'It removed privacy obligations', 'Source independence broadens evidence.'),
    q('Why did the narrator ask the employer too?', 'Role acceptance can have organizational criteria in addition to formal requirements', 'A manager can override licensing', 'The employer pays every fee', 'Authorities lack registers', 'Several decision-makers may matter.'),
    q('What does the final route refuse to promise?', 'Employment or a salary increase', 'Recognized assessment', 'Learning support', 'A clear schedule', 'A credible course still cannot control labor outcomes.'),
  ]),

  R('09', 'retain; strong research-ethics monologue limiting consent by purpose and audience, managing re-identification, tools, quotation accuracy, retention, and new educational use', [
    q('Why could voice identify a participant?', 'Speech and contextual details can reveal identity even without a name', 'Every voice is legally public', 'Audio cannot be edited', 'Codes contain names', 'De-identification is not automatic anonymity.'),
    q('Why was public transcription software avoided?', 'The institution had not approved it for the protected data', 'Automatic transcription is always inaccurate', 'Only paper transcripts are ethical', 'Participants disliked computers', 'Tool convenience did not determine authorization.'),
    q('What would sentence combining risk?', 'Creating a claim the participant did not make', 'Making the report too short', 'Revealing the interviewer’s name', 'Changing the file format', 'Accurate representation includes context.'),
    q('Why might fresh consent still be unsuitable?', 'Power, privacy, or future harm may prevent a genuinely safe reuse', 'Consent can never change', 'Education is not a valid purpose', 'Fictional examples require no agreement', 'Permission is not the only ethical condition.'),
    q('What promise controls the project?', 'The terms given when each person agreed to participate', 'The student’s later preference', 'The public course deadline', 'A software default', 'Ethics follows the original relationship.'),
  ]),

  R('10', 'retain with concise phrasing; strong academic-integrity dialogue using multiple evidence sources, proportionate privacy, defined policy, hearing, reassessment, education, confidentiality, and appeal', [
    q('Why does Layla not receive another paper?', 'Another student’s privacy is not necessary to explain her son’s criteria', 'Comparison is never useful', 'The papers were deleted', 'Parents cannot see school records', 'Transparency should not expose unrelated learners.'),
    q('What distinction does the policy draw?', 'Specified language support may be allowed while original reasoning and disclosure remain required', 'All automated help is cheating', 'Any tool may write the assignment', 'Spelling support proves originality', 'Permitted assistance is bounded.'),
    q('Why may a support person attend?', 'To help the student participate fairly where policy allows', 'To answer every question', 'To decide the result', 'To reveal other students’ cases', 'Procedural support does not replace testimony.'),
    q('What does staged task design provide?', 'Evidence of learning development before the final submission', 'A way to hide tool use', 'Fewer instructions', 'Automatic guilt detection', 'Process evidence can reduce uncertainty.'),
    q('Who is accountable at the end?', 'Both the student for honest work and the school for fair reliable procedure', 'Only the detection software', 'Only the parent', 'Only the teacher’s intuition', 'Integrity and due process are mutual duties.'),
  ], { replaceText: [
    ['No final judgment has been made. A software indicator raised a concern, but such indicators can be wrong and cannot decide the case alone.', 'No judgment has been made. A software indicator can be wrong and cannot decide the case.'],
  ] }),
];
