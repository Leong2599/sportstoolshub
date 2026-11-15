import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import badminton from './blog-content/badminton.mjs';
import baseball from './blog-content/baseball.mjs';
import volleyball from './blog-content/volleyball.mjs';
import rugby from './blog-content/rugby.mjs';
import athletics from './blog-content/athletics.mjs';
import skiing from './blog-content/skiing.mjs';
import rowing from './blog-content/rowing.mjs';
import fencing from './blog-content/fencing.mjs';
import gymnastics from './blog-content/gymnastics.mjs';
import archery from './blog-content/archery.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const blogDir = path.join(root, 'blog');

const categories = [
  badminton,
  baseball,
  volleyball,
  rugby,
  athletics,
  skiing,
  rowing,
  fencing,
  gymnastics,
  archery,
];

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick(items, seed) {
  return items[seed % items.length];
}

function yaml(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function toDate(offset) {
  const start = new Date(Date.UTC(2026, 0, 5));
  start.setUTCDate(start.getUTCDate() + offset);
  return start.toISOString().slice(0, 10);
}

const openers = [
  'The details below turn that idea into repeatable sessions you can run this week.',
  'This guide translates the principle into concrete cues, drills, and checkpoints.',
  'What follows is a practical framework rather than a list of vague tips.',
  'The goal is simple: make the skill measurable, repeatable, and durable under pressure.',
  'Use the sections in order the first time, then revisit the part that matches your current block.',
  'Treat each suggestion as a small experiment and keep the changes that improve your execution.',
];

const whyClosers = [
  'Small technical gains compound quickly because better positions reduce wasted effort and lower the risk of injury.',
  'Improvement here also buys you time: cleaner movement means earlier preparation and calmer decisions.',
  'Coaches value this quality because it holds up when heart rate rises and the environment becomes unpredictable.',
  'The athletes who progress fastest are rarely the ones doing the most work; they are the ones repeating the right work.',
  'A clear focus makes feedback useful, because you know exactly which variable you are trying to change.',
  'This is one of the highest-leverage skills in the sport, and it responds well to short, deliberate practice.',
];

const principleIntros = [
  'Anchor every session on these coaching principles:',
  'Keep these non-negotiables in mind while you train:',
  'These principles separate functional technique from busy practice:',
  'Use these cues to keep quality high from the first repetition:',
  'The following standards keep the work honest:',
  'Build each session around this short checklist:',
];

const stepTemplates = [
  (focus, sport) => `**Audit your starting point.** Film 3-5 minutes of ${focus} in ${sport} and note two strengths and one limiter before changing anything.`,
  (focus) => `**Set one target for the block.** Choose a single, observable outcome for ${focus} and write it where you will see it each session.`,
  (focus) => `**Warm up with the movement pattern.** Use low-intensity repetitions of ${focus} to prepare joints, coordination, and timing.`,
  (focus) => `**Practise in short quality sets.** Keep work bouts brief enough that technique does not decay; rest fully between sets.`,
  (focus) => `**Add controlled pressure.** Introduce fatigue, time limits, or a partner to test whether ${focus} survives beyond a calm drill.`,
  (focus) => `**Review and progress.** Compare the session with your baseline, keep what worked, and change only one variable next time.`,
];

const sampleWeeks = [
  [
    '**Day 1 — Technique:** Low-intensity repetitions with frequent feedback and full recovery.',
    '**Day 2 — Strength and mobility:** General strength plus targeted mobility for the positions the sport demands.',
    '**Day 3 — Skill application:** Drills that combine the focus with movement, decision-making, or a partner.',
    '**Day 4 — Recovery:** Easy movement, stretching, and sleep priority; no high-intensity work.',
    '**Day 5 — Pressure session:** Score-based or time-based practice that tests technique under fatigue.',
    '**Day 6 — Top-up:** Short, specific work on the weakest link plus light conditioning.',
    '**Day 7 — Rest:** Full day off to consolidate adaptation and restore motivation.',
  ],
  [
    '**Day 1 — Assessment and technique:** Establish a baseline, then rehearse clean repetitions.',
    '**Day 2 — Conditioning:** Sport-specific intervals that support the energy demands of the discipline.',
    '**Day 3 — Skill under light fatigue:** Moderate volume with an emphasis on posture and decision quality.',
    '**Day 4 — Mobility and recovery:** Gentle movement, soft-tissue work, and an early night.',
    '**Day 5 — Applied practice:** Partner or scenario work that mimics competition constraints.',
    '**Day 6 — Optional low intensity:** Technique review at conversational effort, or complete rest if sore.',
    '**Day 7 — Rest and review:** Note what improved and choose the next single focus.',
  ],
  [
    '**Day 1 — Quality first:** Short sets, complete rest, and one or two explicit cues.',
    '**Day 2 — General preparation:** Strength, stability, and mobility with controlled effort.',
    '**Day 3 — Specific endurance:** Repeat the skill in sets that resemble match demands.',
    '**Day 4 — Active recovery:** Walk, stretch, hydrate, and prioritise sleep.',
    '**Day 5 — Decision-making:** Add variability, opponents, or changing conditions.',
    '**Day 6 — Consolidation:** Moderate volume at high quality, then stop while execution is still good.',
    '**Day 7 — Rest:** No structured training; return fresher for the next block.',
  ],
];

const equipmentAdvice = [
  'check fit and condition before every session rather than replacing it on a hunch',
  'choose the option that matches your current level and the surface you train on most',
  'keep it clean and stored correctly; neglect shortens useful life and hurts performance',
  'prioritise comfort and safety over the newest model or marketing claim',
  'test any change in a low-stakes session before using it in competition',
  'carry a simple backup for the item you rely on most',
];

const safetyAdvice = [
  'build volume gradually and avoid sharp spikes after time off',
  'warm up thoroughly and include sport-specific preparation before high speed work',
  'respect pain that changes your movement; persistent symptoms deserve professional assessment',
  'schedule recovery as deliberately as you schedule training',
  'use appropriate protective equipment and check it regularly',
  'communicate with a coach or medical professional when symptoms persist',
];

const progressTemplates = [
  () => 'Your technique looks the same on video at the start and end of a set, even when fatigue rises.',
  (sport) => `You recover faster between efforts and feel ready for the next ${sport} session rather than depleted.`,
  () => 'Your error rate drops without a corresponding drop in speed or intent.',
  () => 'You can explain what you changed and why it worked, rather than relying on feel alone.',
  () => 'A partner or coach notices the improvement before you do, which usually signals a real change.',
  () => 'The skill transfers into scored practice, not just isolated drills.',
];

const genericFaqs = [
  [
    'How quickly can I expect progress?',
    'Expect small technical changes within two to four weeks of consistent practice. Meaningful performance gains usually take a full training block of six to twelve weeks, depending on your starting point and how often you train.',
  ],
  [
    'Do I need a coach to improve?',
    'A coach accelerates feedback, but you can make real progress with video review, clear cues, and a simple training log. The key is comparing execution with a standard rather than guessing.',
  ],
  [
    'How do I fit this into a busy week?',
    'Two or three focused sessions of 30-45 minutes beat one long, unfocused session. Keep the quality high, reduce volume when time is short, and protect sleep.',
  ],
];

const closingLines = [
  'The best plan is the one you can repeat. Start with the smallest version of this routine, measure it honestly, and let consistency do the rest.',
  'Progress in this area is rarely dramatic day to day, but it is unmistakable over a season. Stay patient, keep notes, and protect the quality of each repetition.',
  'Choose one cue, one drill, and one checkpoint for the next two weeks. When those become automatic, add the next layer.',
];

function focusOf(post, category) {
  const base = post.slug.startsWith(`${category.key}-`)
    ? post.slug.slice(category.key.length + 1)
    : post.slug;
  return base.replace(/-/g, ' ');
}

function buildPost(category, post, index, offset) {
  const focus = post.focus ?? focusOf(post, category);
  const seed = hash(`${category.key}-${post.slug}`);
  const lines = [];
  const push = (...items) => lines.push(...items);

  push('---');
  push(`title: ${yaml(post.title)}`);
  push(`description: ${yaml(post.description)}`);
  push(`date: ${toDate(offset)}`);
  push(`slug: ${yaml(`${category.key}/${post.slug}-2026`)}`);
  push(`tags: [${yaml(category.key)}, "2026-guide"]`);
  push('authors: ["sports-tools-hub"]');
  push('---');
  push(post.summary);
  push('');
  push(pick(openers, seed));
  push('');
  push('{/* truncate */}');
  push('');
  push(`## Why ${focus} matters in ${category.label}`);
  push('');
  push(`${post.summary} ${pick(whyClosers, seed >> 2)}`);
  push('');
  push(
    `${category.label} places specific demands on the body and the decision-maker: ${category.demand}. This skill is where those demands meet technique, so improving it makes every surrounding skill easier to express.`,
  );
  push('');
  push('## What This Guide Covers');
  push('');
  push(`- The technical model behind ${focus} and the cues that keep it repeatable.`);
  push('- A step-by-step practice plan you can run without specialist supervision.');
  push(`- Sport-specific drills that make ${focus} usable under pressure.`);
  push('- Common mistakes, equipment checks, and recovery habits that protect progress.');
  push('- Simple checkpoints so you know whether the work is actually changing performance.');
  push('');
  push('## Technique Essentials');
  push('');
  push(pick(principleIntros, seed >> 3));
  push('');
  for (const point of post.points) {
    push(`- ${point}`);
  }
  push('');
  push('## Step-by-Step Practice Plan');
  push('');
  for (let i = 0; i < 6; i += 1) {
    push(`${i + 1}. ${stepTemplates[i](focus, category.label)}`);
  }
  push('');
  push('## Drills to Build the Skill');
  push('');
  for (const drill of post.drills) {
    push(`- ${drill}`);
  }
  push('');
  push('## Common Mistakes to Avoid');
  push('');
  for (const mistake of post.mistakes) {
    push(`- ${mistake}`);
  }
  push(`- Copying an advanced athlete's routine without adapting it to your current capacity and schedule.`);
  push(`- Treating one good session as proof of mastery instead of testing the skill again under different conditions.`);
  push('');
  push('## Sample Training Week');
  push('');
  push(`Adapt this template to your level, available time, and competition calendar. The aim is quality, not exhaustion.`);
  push('');
  for (const day of pick(sampleWeeks, seed >> 4)) {
    push(`- ${day}`);
  }
  push('');
  push('## Progress Checkpoints');
  push('');
  push('Review these signals every two weeks:');
  push('');
  const checkpoints = [
    pick(progressTemplates, seed >> 1)(category.label),
    'Your coach or training partner needs fewer corrections on the same cue.',
    'You can reproduce the skill in a scored or timed context without losing form.',
    'Soreness resolves within 24-48 hours and does not accumulate across the week.',
  ];
  for (const checkpoint of checkpoints) {
    push(`- ${checkpoint}`);
  }
  push('');
  push('## Equipment and Setup');
  push('');
  push(`Train at ${category.venue}. Check these items before the session starts:`);
  push('');
  category.equipment.forEach((item, i) => {
    push(`- **${item}:** ${pick(equipmentAdvice, seed + i)}.`);
  });
  push('');
  push('## Safety and Injury Prevention');
  push('');
  push(
    `Common issues in ${category.label} include ${category.injuries.join(', ')}. Reduce risk with a few consistent habits:`,
  );
  push('');
  category.injuries.slice(0, 3).forEach((injury, i) => {
    push(`- **${injury}:** ${pick(safetyAdvice, seed + i)}.`);
  });
  push('- Keep a short log of volume, intensity, and symptoms so you can spot a trend before it becomes an injury.');
  push('');
  push('## Terminology');
  push('');
  for (const [term, definition] of category.terms) {
    push(`- **${term}:** ${definition}`);
  }
  push('');
  push('## Frequently Asked Questions');
  push('');
  const faqs = [...post.faqs, pick(genericFaqs, seed >> 5)];
  for (const [question, answer] of faqs) {
    push(`**${question}**  `);
    push(answer);
    push('');
  }
  push('## Read Next');
  push('');
  const siblings = category.posts;
  const nextOne = siblings[(index + 1) % siblings.length];
  const nextTwo = siblings[(index + 2) % siblings.length];
  push(
    `- [${nextOne.title}](/blog/${category.key}/${nextOne.slug}-2026)`,
  );
  push(
    `- [${nextTwo.title}](/blog/${category.key}/${nextTwo.slug}-2026)`,
  );
  push('');
  push('## Related Tools');
  push('');
  for (const tool of category.tools) {
    push(`- [${tool.label}](/tools/${tool.slug})`);
  }
  push('');
  push('## Final Word');
  push('');
  push(pick(closingLines, seed >> 6));
  push('');

  const nonEmpty = lines.filter((line) => line.trim() !== '').length;
  if (nonEmpty < 115) {
    push('## Practical Coaching Cues');
    push('');
    push(`Keep these cues short enough to use in the middle of a session:`);
    push('');
    push(`- **Prepare early:** start the movement before the pressure arrives, so ${focus} has room to work.`);
    push(`- **Stay relaxed:** grip, shoulders, and face should stay loose until the moment force is required.`);
    push(`- **Finish balanced:** if you cannot hold the landing or follow-through for two seconds, reduce the effort.`);
    push(`- **Use one cue:** pick a single word or image and repeat it for the whole set.`);
    push(`- **Stop while quality is high:** end the drill one or two repetitions before form starts to decay.`);
    push('');
    push('## Recovery and Load Notes');
    push('');
    push(`- Give ${category.label} sessions at least 24 hours before repeating high-intensity work in the same pattern.`);
    push(`- Increase weekly volume by no more than roughly ten percent at a time.`);
    push(`- Use sleep, appetite, and morning soreness as simple recovery checkpoints.`);
    push(`- Schedule a lighter week every three to four weeks to consolidate adaptation.`);
    push('');
    push('## Session Checklist');
    push('');
    for (const point of post.points.slice(0, 4)) {
      push(`- [ ] ${point}`);
    }
    push(`- [ ] Record one note about what changed and what still needs work.`);
    push('');
  }

  return lines.join('\n');
}

async function main() {
  let offset = 0;
  let count = 0;

  for (const category of categories) {
    const dir = path.join(blogDir, category.key);
    await mkdir(dir, { recursive: true });

    for (let i = 0; i < category.posts.length; i += 1) {
      const post = category.posts[i];
      const content = buildPost(category, post, i, offset);
      const file = path.join(dir, `${post.slug}-2026.mdx`);
      await writeFile(file, content, 'utf8');
      offset += 1;
      count += 1;
    }
  }

  console.log(`Generated ${count} posts across ${categories.length} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
