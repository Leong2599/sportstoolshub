const category = {
  key: 'rugby',
  label: 'Rugby',
  venue: 'a rugby pitch, gym, or contact training area with qualified supervision',
  demand:
    'repeated collisions, sprinting, grappling, and changes of direction, plus the aerobic capacity to recover between bouts of high-intensity contact',
  equipment: [
    'Mouthguard',
    'Rugby boots',
    'Headgear (optional)',
    'Training bibs',
    'Tackle bags',
    'Rugby ball',
  ],
  injuries: ['concussion', 'shoulder dislocation', 'knee ligament injury', 'ankle sprain'],
  terms: [
    ['Ruck', 'A contest for the ball on the ground after a tackle, with players bound over the ball.'],
    ['Maul', 'A dynamic contest where players bind and drive while the ball is held off the ground.'],
    ['Lineout', 'A restart where forwards contest a thrown ball along the touchline.'],
    ['Breakdown', 'The phase immediately after contact when the ball must be secured or turned over.'],
  ],
  tools: [
    { label: 'Training Load Calculator', slug: 'training-load-calculator' },
    { label: 'One-Rep Max Calculator', slug: 'one-rep-max-calculator' },
    { label: 'Injury Risk Calculator', slug: 'injury-risk-calculator' },
  ],
  posts: [
    {
      slug: 'rugby-beginner-basics',
      title: 'Rugby for Beginners: Rules, Positions, and First Skills (2026)',
      description:
        'A beginner rugby guide covering scoring, positions, passing, tackling, and safe contact progressions.',
      summary:
        'Rugby beginners need a clear picture of the game’s shape before contact: how scoring works, why passes go backward, and how to tackle safely. Simple progressions build confidence without skipping safety.',
      points: [
        'Learn to pass backward and across the body while running forward.',
        'Practise tackling technique from kneeling, then walking, then jogging before full contact.',
        'Understand the offside line and how it changes after a ruck or maul.',
        'Support the ball carrier from behind and communicate early.',
        'Use a mouthguard in every contact session.',
      ],
      drills: [
        'Passing in pairs — pass backward while moving forward at walking pace.',
        'Kneeling tackle — practise the shoulder contact and head position on a bag.',
        'Walk-through ruck — rehearse the approach, bind, and ball placement.',
        'Support lines — run behind a ball carrier and call the next action.',
      ],
      mistakes: [
        'Passing forward under pressure because the hands turn too late.',
        'Tackling with the head in front of the ball carrier.',
        'Standing flat and watching instead of supporting the ball carrier.',
      ],
      faqs: [
        ['Is rugby safe for beginners?', 'Rugby carries contact risk, but gradual progressions, qualified coaching, and correct technique reduce it substantially. Never skip the contact progression.'],
        ['What should I learn first?', 'Passing and safe tackle technique. These two skills underpin almost everything else.'],
      ],
    },
    {
      slug: 'rugby-passing',
      title: 'Rugby Passing: Backward Hands, Spiral, and Catch (2026)',
      description:
        'Improve rugby passing with a clean spiral, correct hand position, and the footwork to pass while running forward.',
      summary:
        'Rugby passing looks simple until you try it at speed. The ball must travel backward relative to the passer, so hand position, hip rotation, and timing all matter.',
      points: [
        'Hold the ball with both hands and point the non-throwing shoulder at the target.',
        'Rotate the hips and follow through so the ball travels backward and across.',
        'Use a wrist snap to create a spiral that is easier to catch.',
        'Pass in front of the receiver’s chest, not at their feet or above their head.',
        'Keep the hands ready to catch with fingers spread and elbows soft.',
      ],
      drills: [
        'Stationary spiral passes — pass ten metres to a partner and focus on spin.',
        'Moving pass — pass while jogging forward, then increase speed.',
        'Catch-and-pass — receive and pass in one motion without stopping.',
        'Pressure passing — pass while a defender applies light pressure.',
      ],
      mistakes: [
        'Throwing with straight arms and no hip rotation.',
        'Passing at the receiver’s chest but too late, forcing a forward pass.',
        'Catching with stiff hands and dropping the ball.',
      ],
      faqs: [
        ['Why do my passes float?', 'A floating pass usually lacks wrist snap and hip rotation. Practise the spiral at short distance before adding speed.'],
        ['How do I pass to my right?', 'Turn the hips and follow through across the body. The ball should still travel backward relative to your run.'],
      ],
    },
    {
      slug: 'rugby-tackling',
      title: 'Rugby Tackling Technique: Safety, Footwork, and Finish (2026)',
      description:
        'Learn safe rugby tackling with head placement, shoulder contact, leg drive, and a controlled finish on the ground.',
      summary:
        'Safe rugby tackling is a technical skill built through progression. The tackler must get close, keep the head out of the contact, and drive through the ball carrier’s legs to finish the tackle.',
      points: [
        'Approach with short steps and get the head behind or to the side of the ball carrier.',
        'Contact with the shoulder, not the head, and wrap the arms around the legs or torso.',
        'Drive with the legs through contact rather than diving at the player.',
        'Keep the eyes open and the chin off the chest throughout.',
        'Finish in a strong position and release quickly to contest the ball.',
      ],
      drills: [
        'Kneeling tackle — contact a bag from one knee and rehearse head position.',
        'Walk-and-wrap — tackle a walking partner with controlled contact.',
        'Side-on tackle — approach from an angle and drive through the legs.',
        'Tackle-to-ruck — tackle a bag, release, and compete for the ball.',
      ],
      mistakes: [
        'Dropping the head and losing sight of the target.',
        'Tackling with the arms only and failing to drive with the legs.',
        'Standing too upright at contact and losing leverage.',
      ],
      faqs: [
        ['What is the safest tackle height?', 'Follow your competition’s rules and coaching guidance. Many programmes emphasise tackling below the ball carrier’s shoulder to reduce head contact.'],
        ['How do I get over fear of contact?', 'Progress gradually from bags to walking contact to controlled live drills. Confidence comes from competence and repetition.'],
      ],
    },
    {
      slug: 'rugby-breakdown',
      title: 'Rugby Breakdown: Rucking, Ball Placement, and Turnovers (2026)',
      description:
        'Master the rugby breakdown with better body height, ball placement, and decisions that protect possession.',
      summary:
        'The rugby breakdown decides who keeps the ball after contact. Low body height, a strong base, and quick decisions turn a tackle into clean possession or a turnover.',
      points: [
        'Arrive at the breakdown low and from behind the ball carrier.',
        'Place the ball back toward your team and protect it with the body.',
        'Bind tightly with the shoulders and drive through the legs.',
        'Keep the hips low and the back flat when contesting.',
        'Know when to compete and when to leave the ball alone.',
      ],
      drills: [
        'Low-clear drill — clear a bag with a low body position and strong bind.',
        'Ball-placement practice — fall and place the ball consistently to the side.',
        'Two-player ruck — one clears while the other contests.',
        'Decision drill — a coach calls compete or leave and the player reacts.',
      ],
      mistakes: [
        'Standing tall and getting driven backward.',
        'Binding with the arms instead of the shoulders.',
        'Contesting every ruck and conceding a penalty for hands in the wrong place.',
      ],
      faqs: [
        ['What is the biggest breakdown error?', 'Arriving too high. Low hips and a strong base are the foundation of a safe, effective clear-out.'],
        ['When should I contest?', 'Contest when you can get there early, stay on your feet, and stay legal. If not, set up in defence.'],
      ],
    },
    {
      slug: 'rugby-scrummaging',
      title: 'Rugby Scrummaging: Bind, Body Position, and Push (2026)',
      description:
        'Learn safe rugby scrummaging with a stable bind, flat back, and coordinated eight-person push.',
      summary:
        'Rugby scrummaging is a collective skill. Safety depends on a strong bind, a flat back, and all eight players pushing together rather than individually.',
      points: [
        'Bind tightly before the engagement and keep the shoulders square.',
        'Set the back flat and the hips lower than the shoulders.',
        'Push through the legs with the feet driving backward.',
        'Keep the chin off the chest and the neck neutral.',
        'Communicate the push count so all eight players move together.',
      ],
      drills: [
        'Bind walk-through — rehearse the bind and stance without engagement.',
        'Machine push — push a scrum machine with a controlled count.',
        'Eight-person hold — hold the scrum position for three seconds.',
        'Controlled engagement — practise the crouch, bind, and set sequence.',
      ],
      mistakes: [
        'Binding loosely and losing connection at engagement.',
        'Pushing with the upper body while the legs are passive.',
        'Standing too high and putting the neck under pressure.',
      ],
      faqs: [
        ['Is scrummaging safe for beginners?', 'Only with qualified coaching and a gradual progression. Beginners should not be exposed to full contested scrummaging before learning the technique.'],
        ['What is the most important scrum cue?', 'A flat back and a strong bind. Everything else follows from a stable, connected position.'],
      ],
    },
    {
      slug: 'rugby-lineout',
      title: 'Rugby Lineout: Throwing, Lifting, and Jumping (2026)',
      description:
        'Understand rugby lineout roles, including accurate throwing, safe lifting, and timing the jump.',
      summary:
        'The rugby lineout is a set piece built on timing and trust. Accurate throws, safe lifting technique, and a coordinated jump give the team a clean platform for attack.',
      points: [
        'Throw with two hands and a straight, repeatable action toward the target.',
        'Lifters should grip the shorts and drive upward with the legs.',
        'The jumper should jump straight up and keep the body stable.',
        'Time the jump to the throw, not before or after it.',
        'Communicate the lineout call early so everyone knows their role.',
      ],
      drills: [
        'Throw-to-target — throw ten balls at a stationary target.',
        'Lift rehearsal — practise the grip and lift with a partner at low height.',
        'Jump-and-catch — jump and catch a ball without opposition.',
        'Timed lineout — run the full lineout against a passive defence.',
      ],
      mistakes: [
        'Throwing the ball before the jumper is ready.',
        'Lifting with the arms only and putting stress on the back.',
        'Jumping early and catching the ball on the way down.',
      ],
      faqs: [
        ['Who can lift in a lineout?', 'Usually the two players nearest the jumper. Safety requires proper technique and training.'],
        ['How do I throw straighter?', 'Use a consistent grip and follow through toward the target. Practise at short distance before adding height.'],
      ],
    },
    {
      slug: 'rugby-kicking',
      title: 'Rugby Kicking: Goal Kicking, Punts, and Tactical Kicks (2026)',
      description:
        'Improve rugby kicking with a repeatable goal-kicking routine, clean punting technique, and smart tactical decisions.',
      summary:
        'Rugby kicking covers points, territory, and restarts. A repeatable routine and clean contact matter more than raw power, especially under pressure.',
      points: [
        'Set up goal kicks with the same alignment and breathing routine every time.',
        'Contact the ball with the sweet spot and follow through toward the target.',
        'Use a spiral punt for distance and a lower, flatter kick for touch.',
        'Kick to space rather than directly to the opposition when playing tactically.',
        'Practise under fatigue to simulate late-game decisions.',
      ],
      drills: [
        'Goal-kick ladder — kick from three angles and distances.',
        'Punt-for-distance — measure ten punts and track consistency.',
        'Kick-to-space — kick to marked zones on the pitch.',
        'Pressure kicks — take five kicks with a consequence for each miss.',
      ],
      mistakes: [
        'Changing the routine under pressure.',
        'Leaning back at contact and lifting the kick too high.',
        'Kicking without scanning the space and the chasing players.',
      ],
      faqs: [
        ['How do I improve goal-kicking accuracy?', 'Build a repeatable routine, film your alignment, and practise from the same spots until the process is automatic.'],
        ['What is a good tactical kick?', 'One that puts the opposition in a worse position or gives your chasers time to arrive. Distance alone is not the goal.'],
      ],
    },
    {
      slug: 'rugby-running-lines',
      title: 'Rugby Running Lines: Angles, Depth, and Support (2026)',
      description:
        'Run better rugby attacking lines with correct depth, angles, and support that create space for the ball carrier.',
      summary:
        'Rugby running lines turn possession into momentum. Players who run at the right depth and angle give the passer a clear option and ask questions of the defence.',
      points: [
        'Start deep enough to accelerate onto the pass rather than catching it flat.',
        'Run at a defender’s inside shoulder to hold them and create space outside.',
        'Change angle late to prevent the defence from drifting early.',
        'Communicate with the ball carrier so the pass and the line are connected.',
        'Support from behind the ball carrier to keep the offload option alive.',
      ],
      drills: [
        'Depth-and-accelerate — run onto a pass from a deeper starting position.',
        'Angle-change drill — start straight then cut late against a bag.',
        'Two-on-one — attack a defender with a support runner.',
        'Support-line rehearsal — follow a ball carrier and call the offload.',
      ],
      mistakes: [
        'Running too flat and arriving before the pass.',
        'Drifting sideways and taking space from the next attacker.',
        'Changing angle too early and allowing the defender to adjust.',
      ],
      faqs: [
        ['What is good attacking depth?', 'Deep enough that you are accelerating when you catch the ball. Too flat and you lose momentum; too deep and you run out of space.'],
        ['How do I support a ball carrier?', 'Stay behind the ball and communicate. Be close enough for an offload but far enough to react to a turnover.'],
      ],
    },
    {
      slug: 'rugby-rucking',
      title: 'Rugby Rucking: Clears, Body Height, and Possession (2026)',
      description:
        'Improve rugby rucking with low body height, effective clears, and decisions that secure fast possession.',
      summary:
        'Rucking is about securing the ball quickly and legally. Low body height, a strong bind, and a clear plan turn a messy breakdown into a platform for the next attack.',
      points: [
        'Approach low with the hips bent and the back flat.',
        'Bind with the shoulders and drive with the legs rather than reaching with the arms.',
        'Clear beyond the ball so the halfback has space to pass.',
        'Keep the feet moving and stay on your feet.',
        'Know the team’s priority: fast ball, slow ball, or turnover.',
      ],
      drills: [
        'Clear-the-bag — drive a bag beyond a line with a low body position.',
        'Ruck-to-pass — clear, then pass to a halfback in one sequence.',
        'Two-v-one clear — one player clears while another contests.',
        'Fast-ball drill — time how quickly the ball is available after contact.',
      ],
      mistakes: [
        'Arriving high and getting stopped at the contact.',
        'Stopping on the ball and blocking the halfback’s access.',
        'Reaching with the hands instead of driving with the legs.',
      ],
      faqs: [
        ['What does clearing beyond the ball mean?', 'Driving the opponent past the ball so the halfback has a clean channel to pass. Clearing only to the ball can leave it trapped.'],
        ['How do I stay legal at the ruck?', 'Stay on your feet, bind correctly, and do not play the ball with your hands in an illegal position. Ask your coach to review the current laws.'],
      ],
    },
    {
      slug: 'rugby-mauling',
      title: 'Rugby Mauling: Bind, Drive, and Ball Control (2026)',
      description:
        'Learn rugby mauling technique, including the bind, body position, and controlled forward drive.',
      summary:
        'A good rugby maul can be a powerful attacking platform or a safe way to retain possession. It depends on a tight bind, low body position, and coordinated leg drive.',
      points: [
        'Bind tightly to the ball carrier and form a connected unit.',
        'Keep the hips low and drive with the legs, not the arms.',
        'The ball carrier should stay on their feet and keep the ball secure.',
        'Move forward together on a clear call rather than pushing individually.',
        'Know when to use the maul and when to release the ball.',
      ],
      drills: [
        'Bind-and-drive — three players bind and drive a bag together.',
        'Maul walk-through — rehearse the formation and the drive without opposition.',
        'Controlled maul — practice against a passive defence.',
        'Maul-to-attack — release the ball from the maul and attack the next phase.',
      ],
      mistakes: [
        'Binding loosely and losing connection.',
        'Standing tall and getting stopped or driven backward.',
        'Holding the ball too long and allowing the defence to set.',
      ],
      faqs: [
        ['When is a maul legal?', 'A maul forms when the ball carrier is held by at least one opponent and at least one teammate binds. It must move forward or the referee may call for use.'],
        ['How do we stop a maul?', 'Get low, bind legally, and drive through the ball carrier’s hips. Avoid collapsing the maul illegally.'],
      ],
    },
    {
      slug: 'rugby-defense-systems',
      title: 'Rugby Defence Systems: Line Speed, Drift, and Blitz (2026)',
      description:
        'Compare rugby defence systems and learn how line speed, spacing, and communication shape the defensive picture.',
      summary:
        'Rugby defence is organised pressure. Whether a team drifts or blitzes, the keys are line speed, connected spacing, and clear communication about who takes the inside shoulder.',
      points: [
        'Set a defensive line with hands ready and feet alive.',
        'Move up together so no defender arrives alone.',
        'Keep spacing tight enough to prevent gaps but wide enough to cover the field.',
        'Communicate the tackle and the next threat continuously.',
        'Decide as a unit whether to drift or blitz and commit fully.',
      ],
      drills: [
        'Line-speed drill — advance together and stop on a cone.',
        'Two-on-two defence — defend a narrow channel against two attackers.',
        'Drift-and-tackle — practise drifting as a line and tackling the outside runner.',
        'Communication drill — call the tackle and the next threat through a phase.',
      ],
      mistakes: [
        'Rushing up alone and creating a gap beside you.',
        'Stopping the feet before the tackle.',
        'Mixing systems mid-phase because nobody called the decision.',
      ],
      faqs: [
        ['What is a blitz defence?', 'A system where defenders move aggressively upfield to pressure the attack and cut down time and space.'],
        ['What is a drift defence?', 'A system that moves sideways as a line to push the attack toward the touchline and protect the outside.'],
      ],
    },
    {
      slug: 'rugby-attack-shapes',
      title: 'Rugby Attack Shapes: Pods, Width, and Phase Play (2026)',
      description:
        'Build rugby attack shapes with pods, width, and phase play that stretch the defence and create quick ball.',
      summary:
        'Rugby attack shapes organise players around the ball so the team can ask different questions of the defence. Width, pods, and quick ruck ball create the space for line breaks.',
      points: [
        'Set pods with two or three forwards to create a forward threat and a passing option.',
        'Keep width so the defence cannot compress the field.',
        'Use quick ruck ball to attack before the defence resets.',
        'Change the point of attack with passes or kicks rather than always going forward.',
        'Communicate the shape before the phase begins.',
      ],
      drills: [
        'Pod passing — three players pass and re-form in a pod.',
        'Width drill — attack from one side to the other with support runners.',
        'Phase-play game — play four phases with a requirement to use width.',
        'Quick-ball drill — secure the ruck and attack immediately.',
      ],
      mistakes: [
        'Standing too flat and crowding the ball carrier.',
        'Always attacking the same channel and letting the defence settle.',
        'Slowing the ruck and losing the advantage of quick ball.',
      ],
      faqs: [
        ['How many phases should we plan?', 'Plan patterns for two or three phases, then play what is in front of you. Rigid multi-phase plans often break down.'],
        ['What is a pod?', 'A small group of forwards bound close together to offer a carrying threat and support options.'],
      ],
    },
    {
      slug: 'rugby-sevens',
      title: 'Rugby Sevens: Speed, Space, and Tournament Fitness (2026)',
      description:
        'Adapt to rugby sevens with space-aware attack, aggressive defence, and conditioning for repeated high-speed efforts.',
      summary:
        'Rugby sevens rewards speed, decision-making, and recovery. With fewer players and more space, every missed tackle and slow support line is magnified.',
      points: [
        'Attack with width and keep the ball alive through offloads.',
        'Defend with aggressive line speed and press the ball carrier.',
        'Recover quickly between matches with hydration and short rests.',
        'Use the kick as a space-gaining option when the attack is crowded.',
        'Prioritise repeat-sprint fitness over long-distance endurance.',
      ],
      drills: [
        'Repeat-sprint sets — six 30-metre sprints with short recovery.',
        'Seven-on-seven touch — play touch rugby to develop width and support.',
        'Two-on-one finishing — attack space with a support runner.',
        'Kick-and-chase — practise contestable kicks and recovery.',
      ],
      mistakes: [
        'Playing like fifteen-a-side and using too many forwards around the ball.',
        'Standing flat in defence and giving the attack easy outside space.',
        'Neglecting recovery between tournament matches.',
      ],
      faqs: [
        ['How long is a sevens match?', 'Usually two seven-minute halves with a short half-time. Tournament days can include several matches.'],
        ['What is the key fitness quality?', 'Repeat-sprint ability. Sevens is a series of high-speed efforts with incomplete recovery.'],
      ],
    },
    {
      slug: 'rugby-forwards-play',
      title: 'Rugby Forwards: Carrying, Clearing, and Set Pieces (2026)',
      description:
        'Develop rugby forward skills including carrying, clearing, lineout work, and scrummaging.',
      summary:
        'Rugby forwards win the physical contests that allow the team to play. Carrying with intent, clearing rucks, and set-piece competence create the platform for the backs.',
      points: [
        'Carry low and with leg drive to win the collision.',
        'Clear rucks with a low body position and a strong bind.',
        'Work on lineout timing and scrum body position as a unit.',
        'Support the ball carrier from behind to keep the offload alive.',
        'Communicate the set-piece plan early.',
      ],
      drills: [
        'Carry-and-place — carry into a bag and place the ball back.',
        'Clear-and-drive — clear a ruck and drive a bag.',
        'Lineout unit — run the lineout with lifters and jumper.',
        'Scrum machine — push with a coordinated count.',
      ],
      mistakes: [
        'Carrying upright and getting stopped behind the gain line.',
        'Standing up in the clear-out and losing leverage.',
        'Treating set pieces as individual efforts rather than unit skills.',
      ],
      faqs: [
        ['What makes a good ball carrier?', 'Footwork before contact, low body height, and leg drive after contact. Winning the collision is a skill.'],
        ['How important are forwards in sevens?', 'Sevens uses fewer forwards, so all players need handling and speed. Forwards still provide power at the breakdown.'],
      ],
    },
    {
      slug: 'rugby-backs-play',
      title: 'Rugby Backs: Passing, Kicking, and Finishing (2026)',
      description:
        'Improve rugby back play with accurate passing, smart kicking, and finishing that converts chances into points.',
      summary:
        'Rugby backs turn possession into points. Accurate passing, timing, and finishing under pressure separate good back lines from dangerous ones.',
      points: [
        'Pass accurately to the receiver’s chest and keep the hands ready.',
        'Run onto the ball at speed rather than catching it standing still.',
        'Kick with a purpose: territory, chase, or relief.',
        'Finish with two hands on the ball and a low body position.',
        'Communicate the attack shape before the phase begins.',
      ],
      drills: [
        'Passing under fatigue — pass accurately after a short sprint.',
        'Catch-and-accelerate — receive and accelerate through a gate.',
        'Kick-to-space — kick to a target zone and chase.',
        'Finishing drill — attack the corner and score under pressure.',
      ],
      mistakes: [
        'Passing behind the receiver and killing momentum.',
        'Kicking without a chase or a clear purpose.',
        'Carrying the ball loosely in contact and losing it.',
      ],
      faqs: [
        ['How do I improve my passing distance?', 'Build a clean spiral and use hip rotation. Distance comes from technique and timing, not just arm strength.'],
        ['What is the best finish?', 'One that protects the ball and the body while getting low. Reaching out with one hand invites a knock-on or a turnover.'],
      ],
    },
    {
      slug: 'rugby-conditioning',
      title: 'Rugby Conditioning: Collision Fitness and Repeat Sprint (2026)',
      description:
        'Build rugby conditioning for collisions, repeated sprints, and the aerobic recovery needed between high-intensity efforts.',
      summary:
        'Rugby conditioning must prepare players for repeated collisions and sprints, not just steady running. A mix of strength, interval work, and recovery builds durable match fitness.',
      points: [
        'Use short, high-intensity intervals that mimic match efforts.',
        'Build lower-body and trunk strength for collision and scrum demands.',
        'Include repeat-sprint work with incomplete recovery.',
        'Train neck and shoulder strength with appropriate supervision.',
        'Balance conditioning with contact load so fatigue does not compromise technique.',
      ],
      drills: [
        'Repeat-sprint shuttle — six 20-metre shuttles with 20 seconds rest.',
        'Sled push — three sets of 15 metres with controlled effort.',
        'Med-ball rotational throws — three sets of six per side.',
        'Contact-fit circuit — bag carries, clears, and short sprints.',
      ],
      mistakes: [
        'Doing only long-distance running for rugby fitness.',
        'Adding contact volume on top of hard conditioning without recovery.',
        'Neglecting neck and shoulder strength for contact.',
      ],
      faqs: [
        ['How fit do I need to be for rugby?', 'Fit enough to repeat high-intensity efforts and recover between them. Match-specific intervals are more useful than a single distance test.'],
        ['How much strength training is enough?', 'Two sessions per week with compound movements and trunk work is a solid base for most amateur players.'],
      ],
    },
    {
      slug: 'rugby-strength-training',
      title: 'Rugby Strength Training: Squat, Hinge, Push, and Pull (2026)',
      description:
        'Build rugby strength with a simple programme based on squats, hinges, pushes, pulls, and trunk stability.',
      summary:
        'Rugby strength training supports collisions, sprinting, and set pieces. A small number of compound movements performed consistently beats a complicated programme.',
      points: [
        'Train a squat pattern for leg strength and scrum positioning.',
        'Use a hinge pattern for posterior-chain power and sprinting.',
        'Include upper-body pushing and pulling for contact and ball control.',
        'Build trunk stability to transfer force through the body.',
        'Progress load gradually and prioritise technique over ego lifting.',
      ],
      drills: [
        'Back squat — three sets of five with controlled depth.',
        'Romanian deadlift — three sets of six with a neutral spine.',
        'Pull-up or row — three sets of six to ten.',
        'Pallof press — three sets of ten per side.',
      ],
      mistakes: [
        'Adding weight before technique is stable.',
        'Skipping unilateral work and creating side-to-side imbalances.',
        'Training heavy the day before a match.',
      ],
      faqs: [
        ['Should rugby players bench press?', 'Yes, pressing strength supports contact and general athleticism. Pair it with pulling work to keep the shoulders balanced.'],
        ['How do I start strength training?', 'Learn the movements with bodyweight and light loads, then add weight gradually under qualified supervision.'],
      ],
    },
    {
      slug: 'rugby-injury-prevention',
      title: 'Rugby Injury Prevention: Concussion, Shoulders, and Knees (2026)',
      description:
        'Reduce rugby injuries with safe contact technique, concussion protocols, shoulder strength, and load management.',
      summary:
        'Rugby injury prevention starts with safe technique and honest reporting. Concussion, shoulder, and knee injuries are the major concerns, and all three respond to preparation and load control.',
      points: [
        'Never continue playing after a suspected head injury; follow the concussion protocol.',
        'Build shoulder and neck strength for contact tolerance.',
        'Practise tackle technique at low intensity before full contact.',
        'Manage contact volume across the week and the season.',
        'Report pain and fatigue early rather than playing through symptoms.',
      ],
      drills: [
        'Neck isometrics — gentle holds in four directions with qualified guidance.',
        'Band external rotation — three sets of twelve per arm.',
        'Low-intensity tackle technique — rehearse head position on a bag.',
        'Single-leg balance — thirty seconds per side.',
      ],
      mistakes: [
        'Hiding concussion symptoms to stay on the pitch.',
        'Adding contact sessions without adjusting recovery.',
        'Using poor tackle technique because it feels faster.',
      ],
      faqs: [
        ['What should I do if I have a headache after a tackle?', 'Stop playing, tell a coach or medic, and follow the concussion protocol. Do not return until cleared by a qualified professional.'],
        ['Can strength training reduce injury risk?', 'Yes. Stronger, better-prepared tissue tolerates contact and sprinting better, provided load is managed.'],
      ],
    },
    {
      slug: 'rugby-mouthguard-guide',
      title: 'Rugby Mouthguard Guide: Fit, Care, and Protection (2026)',
      description:
        'Choose and care for a rugby mouthguard that fits well, protects the teeth, and stays comfortable during contact.',
      summary:
        'A well-fitted rugby mouthguard protects the teeth and jaw and makes contact more comfortable. Boil-and-bite options work for many players, while custom guards offer the best fit.',
      points: [
        'Choose a guard that covers the upper teeth and sits comfortably without gagging.',
        'Follow the fitting instructions carefully and trim only where necessary.',
        'Wear the guard in every contact session, not just matches.',
        'Clean the guard after every use and store it in a ventilated case.',
        'Replace a guard that becomes loose, torn, or uncomfortable.',
      ],
      drills: [
        'Fit check — wear the guard for ten minutes and check speech and breathing.',
        'Contact rehearsal — wear the guard during a light contact drill.',
        'Cleaning routine — rinse, dry, and store after every session.',
        'Replacement review — inspect the guard monthly for wear.',
      ],
      mistakes: [
        'Buying a guard that is too bulky and restricts breathing.',
        'Leaving the guard in a hot car or bag where it warps.',
        'Wearing a damaged guard because it still feels comfortable.',
      ],
      faqs: [
        ['Are custom mouthguards worth it?', 'They offer the best fit and comfort, especially for players with braces or a history of dental work. Boil-and-bite guards are a reasonable alternative.'],
        ['Can I wear braces with a mouthguard?', 'Yes, but choose a guard designed for braces or ask your dentist for advice.'],
      ],
    },
    {
      slug: 'rugby-match-preparation',
      title: 'Rugby Match Preparation: Warm-Up, Taper, and Routine (2026)',
      description:
        'Prepare for rugby matches with a proper warm-up, a short taper, and routines that support performance under pressure.',
      summary:
        'Rugby match preparation should leave you fresh, organised, and confident. A consistent warm-up, a short taper, and clear roles reduce errors and injury risk.',
      points: [
        'Reduce contact volume in the final week while keeping short, sharp movement.',
        'Use a warm-up that includes movement, passing, contact preparation, and set-piece rehearsal.',
        'Rehearse kick-offs and first-phase plays before the match.',
        'Plan hydration, snacks, and travel so you arrive early.',
        'Keep the pre-match talk short and focused on two or three priorities.',
      ],
      drills: [
        'Warm-up rehearsal — run the exact pre-match warm-up at the same pace.',
        'Set-piece walk-through — rehearse the first two set pieces.',
        'Kick-off drill — practise receiving and contesting the kick-off.',
        'Pressure passing — complete ten passes while tired.',
      ],
      mistakes: [
        'Doing heavy contact work in the days before a match.',
        'Changing the warm-up routine at the venue.',
        'Cramming too much tactical information into the final talk.',
      ],
      faqs: [
        ['How long should a rugby warm-up be?', 'Twenty to thirty minutes is typical, including movement, passing, contact preparation, and a short set-piece rehearsal.'],
        ['What should I eat before a match?', 'A familiar meal with carbohydrate and moderate protein two to three hours before kick-off, plus fluids and snacks.'],
      ],
    },
  ],
};

export default category;
