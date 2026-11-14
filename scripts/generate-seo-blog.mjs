#!/usr/bin/env node
import {mkdirSync, writeFileSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const related = JSON.parse(readFileSync(join(root, 'src/data/blog-related-tools.json'), 'utf8'));

const sports = [
  'basketball','boxing','cricket','cycling','golf','hockey','karate','pickleball','soccer','squash','swimming','table-tennis','tennis','wrestling'
];

const sportLabel = {
  basketball:'Basketball', boxing:'Boxing', cricket:'Cricket', cycling:'Cycling', golf:'Golf', hockey:'Hockey',
  karate:'Karate', pickleball:'Pickleball', soccer:'Soccer', squash:'Squash', swimming:'Swimming',
  'table-tennis':'Table Tennis', tennis:'Tennis', wrestling:'Wrestling'
};

const topics = [
  {key:'beginner-fundamentals', title:'Beginner Fundamentals Guide', tag:'beginners', desc:'essential fundamentals, basic skills, and first steps to start {sport} with confidence'},
  {key:'advanced-techniques', title:'Advanced Techniques Guide', tag:'advanced', desc:'advanced techniques, elite skills, and pro-level strategies to elevate your {sport} performance'},
  {key:'training-drills', title:'Training Drills for Skill Development', tag:'training', desc:'effective training drills to build skill, consistency, and game-ready performance in {sport}'},
  {key:'strength-conditioning', title:'Strength and Conditioning Plan', tag:'strength-training', desc:'strength and conditioning principles to improve power, endurance, and resilience for {sport}'},
  {key:'injury-prevention-recovery', title:'Injury Prevention and Recovery', tag:'injury-prevention', desc:'injury prevention strategies, recovery habits, and mobility work to stay healthy in {sport}'},
  {key:'nutrition-fueling', title:'Nutrition and Fueling Guide', tag:'nutrition', desc:'nutrition, hydration, and fueling strategies to support training and competition in {sport}'},
  {key:'mental-toughness', title:'Mental Toughness and Focus', tag:'mental-game', desc:'mental toughness, focus routines, and confidence-building habits for {sport} athletes'},
  {key:'game-strategy-tactics', title:'Game Strategy and Tactics', tag:'strategy', desc:'smart game strategy, tactical decisions, and situational awareness for better {sport} results'},
  {key:'equipment-gear', title:'Equipment and Gear Guide', tag:'equipment', desc:'how to choose the right equipment and gear to improve comfort, safety, and performance in {sport}'},
  {key:'practice-plans', title:'Weekly Practice Plans', tag:'practice', desc:'structured weekly practice plans to build skills, track progress, and stay consistent in {sport}'},
  {key:'common-mistakes', title:'Common Mistakes and How to Fix Them', tag:'tips', desc:'common {sport} mistakes, why they happen, and practical fixes to improve faster'},
  {key:'competition-preparation', title:'Competition Preparation Checklist', tag:'competition', desc:'competition preparation checklist covering training, mindset, logistics, and recovery for {sport}'},
  {key:'speed-agility', title:'Speed and Agility Development', tag:'agility', desc:'speed, agility, and footwork training to move more efficiently and react faster in {sport}'},
  {key:'fitness-testing-progress', title:'Fitness Testing and Progress Tracking', tag:'fitness', desc:'fitness tests, performance benchmarks, and progress tracking methods for {sport} athletes'},
  {key:'youth-development', title:'Youth Development Pathway', tag:'youth', desc:'age-appropriate coaching, skill progression, and long-term development for young {sport} players'}
];

function esc(s){ return s.replace(/"/g,'\\"'); }
function fmtDate(i){
  const base = new Date('2026-03-01T00:00:00Z');
  base.setUTCDate(base.getUTCDate() + i);
  return base.toISOString().slice(0,10);
}

let global = 0;
const created = [];
for (const sport of sports){
  const dir = join(root,'blog',sport);
  mkdirSync(dir,{recursive:true});
  topics.forEach((t, idx) => {
    const date = fmtDate(global++);
    const slug = `${sport}-${t.key}-2026`;
    const file = join(dir, `${slug}.mdx`);
    const title = `${sportLabel[sport]} ${t.title} (2026)`;
    const description = `Complete ${sportLabel[sport].toLowerCase()} guide to ${t.desc.replace('{sport}', sportLabel[sport].toLowerCase())}.`;
    const tags = [sport, t.tag, '2026-guide'];
    const rel = (related[sport]||[]).map(r=>`- [${r.title}](/tools/${r.slug})`).join('\n');
    const nextSport = sports[(sports.indexOf(sport)+1)%sports.length];
    const nextSlug = `${nextSport}-${topics[(idx+1)%topics.length].key}-2026`;
    const content = `---
title: "${esc(title)}"
description: "${esc(description)}"
date: ${date}
slug: "${sport}/${slug}"
tags: [${tags.map(x=>`"${x}"`).join(', ')}]
authors: ["sports-tools-hub"]
---
${description} Use this resource to build better habits, train with purpose, and make steady progress over time.

{/* truncate */}

## Why ${t.title} Matters for ${sportLabel[sport]}

Focusing on ${t.title.toLowerCase()} helps ${sportLabel[sport].toLowerCase()} athletes improve consistency, reduce avoidable setbacks, and perform with more confidence. A clear plan makes training more efficient and easier to sustain.

## Key Principles

- **Build a strong base:** Prioritize fundamentals and repeatable technique before adding complexity.
- **Progress gradually:** Increase volume, intensity, or difficulty in small steps to stay healthy.
- **Be specific:** Match your training to the real demands of ${sportLabel[sport].toLowerCase()}.
- **Recover well:** Sleep, nutrition, hydration, and rest days are part of performance.
- **Track what matters:** Use simple metrics to evaluate progress and adjust your plan.

## Step-by-Step Plan

1. **Assess your starting point:** Identify strengths, gaps, and current capacity.
2. **Set a clear focus:** Choose one or two priorities for the next training block.
3. **Practice with structure:** Use purposeful sessions with defined goals and quality reps.
4. **Review and adjust:** Reflect weekly on what worked and refine the next sessions.
5. **Apply under pressure:** Transfer improvements into game-like or competitive situations.

## Practical Tips for Better Results

- Warm up thoroughly before intense work and cool down afterward.
- Keep technique quality high, especially when fatigue builds.
- Use short, focused sessions when time is limited instead of skipping entirely.
- Pair physical training with decision-making and awareness skills.
- Stay patient—meaningful improvement comes from consistent effort over weeks.

## Common Mistakes to Avoid

- Doing too much too soon without adequate recovery
- Ignoring fundamentals in favor of advanced drills
- Training without clear objectives or feedback
- Neglecting mobility, sleep, or fueling
- Comparing progress to others instead of your own baseline

## How to Measure Progress

Track simple indicators such as technique quality, consistency, workout completion, perceived effort, and performance in practice scenarios. Small, repeatable gains are a strong sign your ${sportLabel[sport].toLowerCase()} plan is working.

## Read Next

- [${sportLabel[nextSport]} ${topics[(idx+1)%topics.length].title} (2026)](/blog/${nextSport}/${nextSlug})

## Related Tools

${rel}
`;
    writeFileSync(file, content, 'utf8');
    created.push(file);
  });
}

const tagsPath = join(root,'blog','tags.yml');
let tags = readFileSync(tagsPath,'utf8');
for (const t of ['2026-guide','agility']){
  if(!tags.includes(`\n${t}:`)){
    tags += `\n${t}:\n  label: "${t === '2026-guide' ? '2026 guide' : 'agility'}"\n`;
  }
}
writeFileSync(tagsPath,tags,'utf8');

console.log(`Created ${created.length} posts`);
