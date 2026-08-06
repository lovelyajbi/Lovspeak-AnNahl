import { q } from '../helpers.mjs';

const R = (id, decision, additions, extra = {}) => ({
  id: `b1-work-${id}`,
  level: 'B1',
  scriptDecision: decision,
  tags: { 0: 'thoughtful', 2: 'carefully', 4: 'reflective', 6: 'honestly', 8: 'seriously', 10: 'gently', 12: 'encouraging', 14: 'sincere', 16: 'thoughtful' },
  additions,
  ...extra,
});

export const reviews = [
  R('01', 'revise; add written change control, schedule and fee impact, payment protection, and mutual confirmation to the scope-boundary lesson', [
    q('Why did the project keep expanding?', 'Small separate requests were never evaluated as a combined scope change', 'The original agreement included a store', 'The narrator removed two pages', 'The client refused every email', 'Individually small additions created a large unpriced workload.'),
    q('What made the narrator’s first response weak?', 'Silence hid the cost and allowed expectations to remain unclear', 'She used a fixed price', 'She listed the original pages', 'She requested payment', 'Avoiding conflict delayed necessary information.'),
    q('What should a change record specify?', 'New deliverables, price, schedule, responsibilities, and approval', 'Only the preferred colors', 'The freelancer’s private expenses', 'A promise of unlimited revisions', 'A proper change affects more than the task list.'),
    q('Why is the client’s apology not the only protection needed?', 'A repeatable written process should not depend on goodwill', 'Apologies cancel contracts', 'Clients never understand websites', 'Designers should work without payment', 'Professional safeguards must survive a less cooperative case.'),
    q('What does the narrator now understand by professionalism?', 'Clear commitments, timely communication, and fair handling of changes', 'Agreeing to every request', 'Avoiding written records', 'Charging without explanation', 'Boundaries support reliable delivery.'),
  ], { replaceText: [
    ['So I wrote him a clear message, listing everything we had agreed to originally, and everything that had since been added.', 'I wrote a clear change record listing the original scope, new requests, work already completed, and effects on price and schedule.'],
    ['I proposed two options: either we reduce the project back to its original scope, or we adjust the price to reflect the additional work fairly.', 'I proposed returning to the original scope or approving a revised fee and timeline in writing before additional work continued. I also followed the agreed invoicing and payment terms.'],
    ['Now, whenever a project starts drifting beyond its original scope, I address it immediately rather than letting resentment quietly build underneath a polite smile.', 'Now I define deliverables, revision limits, payment stages, ownership, acceptance, and a change process at the start, then confirm later changes promptly.'],
  ] }),

  R('02', 'revise; replace quiet invoice editing and promised trust with documented correction, escalation, client notification, record preservation, and process learning', [
    q('Why would quietly editing the invoice be inadequate?', 'It could hide the audit trail and fail to notify people affected by the error', 'Invoices cannot be edited', 'The client prefers duplicate charges', 'Only managers may read reports', 'Correction needs documentation and communication.'),
    q('What should Farah bring to the manager?', 'The evidence, affected records, and what she has verified without changing them', 'A deleted spreadsheet', 'A public accusation', 'A promise that no other errors exist', 'Preserving facts supports investigation.'),
    q('Why is Reza’s support useful?', 'He can accompany her without taking over the report or hiding responsibility', 'He can change the invoice secretly', 'He guarantees the manager’s reaction', 'He can contact the client privately', 'Support helps action but does not replace procedure.'),
    q('What outcome cannot be promised?', 'That the client will trust the company more after correction', 'That the duplicate should be corrected', 'That the issue needs escalation', 'That evidence should be preserved', 'An organization controls its response, not another party’s trust.'),
    q('What wider improvement should follow?', 'Review the control failure and reduce the chance of recurrence', 'Blame one employee publicly', 'Remove all reviews', 'Hide the incident after refunding', 'Ethical correction includes system learning.'),
  ], { replaceText: [
    ['I know that logically, however part of me still wants to just quietly fix the invoice and hope nobody asks questions.', 'I know. Part of me wants to edit it quietly, but that could hide the audit trail and fail to notify everyone affected.'],
    ['Managers generally respect honesty more than perfection anyway. Nobody expects a system with zero errors, only people willing to fix them.', 'I cannot promise how the manager will react. We can preserve the records, report what you verified, follow the correction and client-notification process, and avoid blaming someone before review.'],
    ['That\'s the right instinct. As a result of this, the client will trust our company even more once we correct it ourselves.', 'That is the responsible step. We cannot control the client’s trust, but we can correct the charge, communicate accurately, and review why the control failed.'],
  ] }),

  R('03', 'revise; avoid presenting illness as a productivity lesson, add timely care, workload ownership, prioritization, accommodation, and limits to individual boundary-setting', [
    q('Why is accepting every task not reliable?', 'Hidden overload makes deadlines and quality less predictable', 'Helping colleagues is always wrong', 'Supervisors dislike questions', 'Schedules never change', 'Capacity information is necessary for planning.'),
    q('What does the postponement question accomplish?', 'It makes priorities and trade-offs visible to the requester', 'It transfers every task away', 'It guarantees overtime pay', 'It diagnoses exhaustion', 'The question turns a vague no into a planning decision.'),
    q('Who also owns workload decisions?', 'Managers and the organization, not only the employee', 'Clients alone', 'The sick employee’s family', 'Nobody once tasks are assigned', 'Systems control staffing and priorities.'),
    q('What should happen if health is affected?', 'Seek appropriate care and use available workplace support or accommodation channels', 'Wait until collapse', 'Give colleagues a diagnosis', 'Accept more work to prove commitment', 'Health needs are not solved only by saying no.'),
    q('Why does the narrator’s “yes” become more trustworthy?', 'It reflects actual capacity rather than fear of refusal', 'It always means immediate completion', 'It removes every future conflict', 'It requires no prioritization', 'A credible commitment is capacity-aware.'),
  ], { replaceText: [
    ['Eventually, my body forced the decision for me. I got sick, seriously enough that I needed a full week away from work.', 'Eventually I became ill and sought appropriate care, taking a week of leave. I do not claim workload alone diagnosed or caused the illness.'],
    ['Lying in bed that week, I finally admitted something uncomfortable: I hadn\'t actually been helping my team, I had been avoiding conflict.', 'During recovery, I recognized that hiding overload was not helping planning. Managers also had responsibility for staffing, priorities, and a safe workload.'],
    ['These days, I still help whenever I genuinely can, but I no longer treat every request as an emergency requiring immediate agreement.', 'Now I discuss priorities early and use appropriate support or accommodation channels when health or disability needs are relevant, without sharing unnecessary details.'],
  ] }),

  R('04', 'revise; broaden the decision beyond salary and remove casual assumptions that showing a competing offer is always low-risk or permitted', [
    q('What financial information matters beyond headline salary?', 'Benefits, taxes, costs, stability, leave, and total compensation', 'Only the percentage increase', 'The company logo', 'Deni’s current salary', 'A large increase may have different net value.'),
    q('Why might Wulan avoid sharing the offer document?', 'It may contain confidential terms or restrictions', 'Managers cannot discuss retention', 'Competitors never make offers', 'The salary is imaginary', 'A negotiation should respect obligations.'),
    q('What nonfinancial factors deserve review?', 'Role scope, manager, ethics, culture, flexibility, growth, and security', 'Only familiarity with coworkers', 'Only fear of change', 'Only office distance', 'The decision has several dimensions.'),
    q('What is wrong with calling a refusal the worst outcome?', 'Disclosure could affect relationships or create other risks depending on context', 'A refusal always increases salary', 'No workplace has policy', 'Offers cannot expire', 'The dialogue should not promise a harmless negotiation.'),
    q('What is Wulan’s next responsible step?', 'Review terms and obligations, then choose whether and how to discuss retention', 'Threaten immediate resignation', 'Accept both jobs secretly', 'Send confidential documents to coworkers', 'Preparation precedes negotiation.'),
  ], { replaceText: [
    ['Have you considered mentioning the offer to our own manager, before deciding anything permanently either way?', 'You could first compare total compensation, role scope, manager, ethics, flexibility, growth, stability, travel, and the effect on people who depend on you.'],
    ['Not necessarily, if you\'re honest about your reasoning. Most managers would rather negotiate than lose someone valuable without even trying.', 'A respectful retention conversation may be possible, but check policy and contractual duties. Do not share a confidential offer document or make a threat you are not prepared to follow.'],
    ['I suppose the worst outcome is simply hearing no, and then I\'m exactly where I already am now.', 'So “no” is not the only risk. The conversation could affect expectations, and the external deadline may continue, so I should plan my response carefully.'],
    ['Exactly, and in spite of feeling awkward, having that conversation gives you information you don\'t currently have.', 'Yes. Decide what information you need, what terms matter, and whether local professional advice is needed for restrictive clauses or legal questions.'],
  ] }),

  R('05', 'revise; protect the mentee’s privacy, avoid diagnosing long-term harm from one event, and make confidence-building evidence-based rather than dependent on public confrontation', [
    q('What mistake would the mentor make by focusing only on confidence?', 'A real quality problem or unsafe team culture could be overlooked', 'Confidence always lowers accuracy', 'Mentoring requires public criticism', 'Junior staff cannot analyze data', 'Evidence and environment both need review.'),
    q('How does the mentor respond to Tia’s disclosure?', 'Listens, protects privacy, asks what support she wants, and follows relevant channels', 'Shares it with the team', 'Diagnoses trauma', 'Promises the manager will change', 'Support remains consent-based and role-appropriate.'),
    q('What did defending conclusions practice?', 'Connecting a claim to evidence and uncertainty before receiving feedback', 'Winning every disagreement', 'Avoiding correction', 'Speaking louder than managers', 'The method develops reasoning, not performance alone.'),
    q('Why should public disagreement not be the main sign of growth?', 'Good judgment may appear through questions, corrections, or private escalation depending on context', 'Managers must never be challenged', 'Evidence belongs only in reports', 'Confidence has no value', 'Different situations require different communication.'),
    q('What makes praise useful?', 'It identifies specific reasoning or behavior rather than offering empty reassurance', 'It guarantees promotion', 'It removes all doubt', 'It replaces work evidence', 'Specific feedback is more informative than general compliments.'),
  ], { replaceText: [
    ['That explanation didn\'t surprise me. A single harsh moment can quietly shape how someone speaks for years afterward, despite time passing.', 'I did not diagnose the effect of one event. I listened, kept the disclosure private, asked what support she wanted, and explained relevant workplace channels.'],
    ['So instead of only reviewing her work, I started asking her to defend her own conclusions before I offered any opinion at all.', 'With her agreement, I asked her to connect conclusions to evidence, name uncertainty, and identify what would change her view before I offered feedback.'],
    ['Last week, she disagreed openly with a senior manager during a meeting, calmly explaining why his assumption was incorrect, using solid evidence.', 'Last week, she respectfully questioned a senior manager’s assumption, explained the evidence, and invited the group to check the source.'],
    ['Mentoring taught me that confidence rarely arrives through compliments alone; it grows through being trusted with real responsibility, repeatedly.', 'Mentoring taught me to combine specific feedback, safe responsibility, evidence-based practice, and attention to the team environment rather than praising confidence alone.'],
  ] }),

  R('06', 'revise; make hybrid-work analysis role- and person-specific, include accessibility and care needs, and use broader evidence than output totals', [
    q('Why is experience level an imperfect rule?', 'New and senior staff can have different tasks, support, disability, or care needs', 'Experience never matters', 'All roles are remote', 'New employees refuse guidance', 'One category cannot capture every relevant need.'),
    q('What should the policy define?', 'Which activities need presence, what flexibility exists, and how exceptions or adjustments work', 'One schedule without reasons', 'Only managers’ preferences', 'A ban on video calls', 'Clear purpose makes requirements reviewable.'),
    q('What evidence goes beyond output totals?', 'Quality, inclusion, learning, service, security, wellbeing, and collaboration', 'Office attendance alone', 'Employee complaints alone', 'The number of desks', 'A workplace policy has several outcomes.'),
    q('Why are accessibility and care mentioned?', 'A standard schedule can create unequal effects that need lawful and fair consideration', 'Remote work cures disability', 'Care duties remove job standards', 'Policies cannot have exceptions', 'Implementation affects people differently.'),
    q('What is their planned approach?', 'Gather mixed evidence and propose a reviewable role-based framework', 'Refuse every office day', 'Accept without discussion', 'Compare only senior workers', 'Their argument becomes more complete than personal preference.'),
  ], { replaceText: [
    ['What if the policy applied differently depending on experience, rather than forcing everyone into the exact same schedule?', 'What if the policy identifies which activities genuinely need presence, then allows role-based flexibility and a clear process for disability, health, or care needs?'],
    ['Senior employees who\'ve proven they work well remotely shouldn\'t necessarily be treated the same as brand-new hires.', 'Experience may matter, but new and senior staff can each need flexibility or support. The task and individual context are better than a simple category.'],
    ['I\'ll gather some data on our team\'s output over the past year, so the argument isn\'t based purely on personal preference.', 'I will gather output, quality, collaboration, learning, inclusion, service, security, and wellbeing evidence, and propose a review date for any change.'],
    ['Good idea. Numbers tend to persuade decision-makers far more effectively than frustration alone, no matter how justified that frustration feels.', 'Good. We should combine quantitative data with staff experience and avoid collecting unnecessary private information while evaluating the policy.'],
  ] }),

  R('07', 'revise; add confidentiality and retaliation limits, factual documentation, appropriate reporting channels, and no promise that feedback will produce change', [
    q('Why might an employee limit exit-interview detail?', 'Confidentiality, future references, legal duties, and retaliation concerns may vary', 'Exit interviews require praise only', 'HR already knows every fact', 'Employees cannot describe workload', 'Honesty should be informed by context and obligations.'),
    q('What type of feedback is strongest?', 'Specific examples, dates, impact, and feasible process changes', 'Rumors about named coworkers', 'A list of insults', 'Promises about other employees', 'Evidence and actionability improve the record.'),
    q('What should not wait for an exit interview?', 'Serious safety, harassment, discrimination, fraud, or legal concerns needing proper channels', 'A positive message to a manager', 'A request for a copy of notes', 'A career reflection', 'Some issues require timely formal escalation.'),
    q('What can the HR manager promise?', 'To record and route feedback accurately, not to guarantee an outcome', 'That the department will change', 'That all comments stay secret in every case', 'That Arman will return', 'The listener controls process commitments, not results.'),
    q('What balance does Arman maintain?', 'He identifies systemic concerns while recognizing valuable people and learning', 'He withdraws every criticism', 'He shares private colleague files', 'He demands a promotion after leaving', 'Balanced feedback can remain specific.'),
  ], { replaceText: [
    ['Thank you for agreeing to this exit interview, Arman. We genuinely want honest feedback, even if it\'s uncomfortable to hear.', 'Thank you for joining. I will explain how notes are used, who may see them, and the limits of confidentiality. You may decline a question or request a copy where policy allows.'],
    ['Thank you for joining. I will explain how notes are used, who may see them, and the limits of confidentiality. You may decline a question or request a copy where policy allows.', 'Thank you for joining. I will explain who may see the notes and the confidentiality limits. You may decline a question or request a copy where policy permits.'],
    ['That\'s fair, and frankly useful feedback for us to take seriously going forward.', 'That is useful. Specific examples, dates, impact, and possible process changes will help me record it accurately without including unnecessary personal information.'],
    ['Noted. Is there anything positive you\'d want your manager to specifically hear, despite everything else we\'ve discussed today?', 'Noted. Serious safety, harassment, discrimination, fraud, or legal concerns should also use the appropriate formal channel rather than wait for an exit interview. Is there a positive message you want recorded?'],
    ['Noted. Serious safety, harassment, discrimination, fraud, or legal concerns should also use the appropriate formal channel rather than wait for an exit interview. Is there a positive message you want recorded?', 'Serious safety, harassment, discrimination, fraud, or legal concerns need an appropriate formal channel. Is there also a positive message to record?'],
    ['I will make sure he hears that directly. Thank you for such thoughtful and balanced honesty today, Arman.', 'I will record and route that message. I cannot guarantee what changes will follow, but I can document the feedback and the next responsible owner.'],
  ] }),

  R('08', 'retain; strong secure-handover monologue covering individual accounts, least privilege, expiry, data minimization, escalation, leave boundaries, and rehearsal', [
    q('Why did the long document fail by itself?', 'The covering colleague lacked approved access to required systems', 'It contained too many deadlines', 'The manager rejected annual leave', 'The colleague could not read', 'Knowledge and authorization were separate needs.'),
    q('Why did the team use sample or permitted data?', 'Training did not justify copying real customer information', 'Sample data always predicts clients', 'Real systems were unavailable', 'The colleague owned the records', 'Learning should follow data-use limits.'),
    q('What protected the narrator’s leave?', 'A documented emergency route that did not depend on routine personal contact', 'A promise to check every message', 'Sharing a private telephone publicly', 'Cancelling unresolved tasks', 'Continuity was designed without erasing time off.'),
    q('What does the one delay show?', 'A controlled process may still have imperfection while preserving accountability', 'Password sharing would prevent every delay', 'The handover failed completely', 'All old systems are secure', 'Reliability is not the same as zero friction.'),
    q('Which four aims close the account?', 'Security, accountability, respected leave, and understandable knowledge', 'Speed, secrecy, overtime, and memory', 'Access, sales, travel, and salary', 'Automation, ownership, discipline, and profit', 'The conclusion names the handover’s wider value.'),
  ]),

  R('09', 'retain; strong recruitment account testing proportionality, commercial use, rights, access, privacy, structured criteria, and local legal limits', [
    q('Why did the two-hour estimate matter?', 'It understated the realistic burden of launch-ready work', 'Candidates preferred weekend tasks', 'The role required timekeeping', 'The budget was two hours late', 'Estimated and actual effort affected fairness.'),
    q('What privacy boundary did the narrator keep?', 'Former clients’ confidential work was not sent as proof of skill', 'The recruiter received every old file', 'Company plans were posted publicly', 'No experience was discussed', 'A portfolio request does not cancel prior duties.'),
    q('Why did the shorter fictional task improve the process?', 'It could test reasoning with less extraction of real commercial value', 'It guaranteed a fair workplace', 'It removed all evaluation', 'Candidates transferred more rights', 'The revision better matched assessment purpose.'),
    q('What did the narrator request at the final conversation?', 'Written evaluation criteria', 'Another unpaid campaign', 'The other candidates’ scores', 'A former client list', 'Criteria make the decision more understandable.'),
    q('Why is local advice mentioned?', 'Legal protections and contract rights differ by place and case', 'Personal emails are illegal', 'Marketing tests require a lawyer everywhere', 'Recruiters cannot change assignments', 'The text avoids universal legal claims.'),
  ]),

  R('10', 'retain with concise phrasing; strong promotion-process dialogue balancing transparent criteria, evidence, bias controls, privacy, adjustments, appeal, and documented follow-through', [
    q('What is problematic about “leadership presence”?', 'It can become an undefined personal impression', 'Leadership never matters', 'Presence means attendance by law', 'Only remote workers lead', 'Vague language can hide inconsistent judgment.'),
    q('Why use several informed reviewers?', 'Multiple evidence-based perspectives can reduce reliance on one person’s impression', 'They guarantee identical scores', 'They may share private files freely', 'Applicants choose their own result', 'Review structure can improve consistency without promising perfection.'),
    q('What right does Sari have regarding her own evidence?', 'Review it within policy, correct factual errors, and add relevant omissions', 'Read every colleague’s evaluation', 'Choose the final promotion', 'Delete unfavorable facts', 'Process access is bounded by accuracy and privacy.'),
    q('How is fairness separated from confidentiality?', 'Criteria and process can be explained without exposing another employee’s record', 'All evaluations must be public', 'Nothing about selection can be shared', 'Privacy prevents written criteria', 'Both values can be protected together.'),
    q('Why does Yusuf document the conversation?', 'To create accountability for the actions he agreed to take', 'To promise Sari the role', 'To replace the formal policy', 'To distribute it to the team', 'A record supports follow-through.'),
  ], { replaceText: [
    ['I see why that feels unclear. The process should have been communicated earlier. I cannot discuss another employee’s private evaluation, but I can explain the criteria and your own record.', 'I see why that feels unclear. I cannot discuss another employee’s private evaluation, but I can explain the criteria and your record.'],
    ['They include technical quality, judgment, collaboration, communication, and sustained responsibility at the next level. I will send the documented descriptions rather than inventing examples now.', 'They include quality, judgment, collaboration, communication, and sustained next-level responsibility. I will send the documented descriptions.'],
    ['That is a fair concern. We should use work evidence from a defined period, several informed reviewers, and consistent scoring, then check whether vague language creates bias.', 'We should use work evidence from a defined period, informed reviewers, consistent scoring, and checks for bias in vague language.'],
    ['Location should not become a hidden requirement. We need role-relevant evidence and reasonable adjustments, while recognizing that some tasks have genuine in-person needs.', 'Location should not be a hidden requirement. Use role-relevant evidence and reasonable adjustments while recognizing genuine in-person needs.'],
  ] }),
];
