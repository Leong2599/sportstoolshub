const category = {
  key: 'athletics',
  label: 'Athletics',
  venue: 'a running track, throwing area, or strength gym with qualified supervision',
  demand:
    'high-speed sprinting, repetitive jumping or throwing, and precise technical execution under the fatigue of multiple attempts',
  equipment: [
    'Track spikes',
    'Training shoes',
    'Starting blocks',
    'Stopwatch or timing system',
    'Throwing implements',
    'Foam roller',
  ],
  injuries: ['hamstring strain', 'Achilles tendinopathy', 'shin splints', 'ankle sprain'],
  terms: [
    ['Split', 'The time recorded at an intermediate point in a race.'],
    ['Cadence', 'The number of steps taken per minute while running.'],
    ['Approach', 'The run-up used before a jump or throw.'],
    ['Pacing', 'The deliberate control of speed across a race or session.'],
  ],
  tools: [
    { label: 'Pace Calculator', slug: 'pace-calculator' },
    { label: 'Stride Length and Cadence Calculator', slug: 'stride-length-cadence-calculator' },
    { label: 'VO2 Max Calculator', slug: 'vo2max-calculator' },
    { label: 'One-Rep Max Calculator', slug: 'one-rep-max-calculator' },
  ],
  posts: [
    {
      slug: 'athletics-beginner-basics',
      title: 'Athletics for Beginners: Events, Training, and First Steps (2026)',
      description:
        'Start athletics with a beginner guide to track and field events, training habits, and the first skills to develop.',
      summary:
        'Athletics covers running, jumping, and throwing, and beginners should sample several event groups before specialising. General movement quality and consistent training matter more than early results.',
      points: [
        'Try sprint, endurance, jump, and throw events before choosing a focus.',
        'Learn a proper warm-up and cooldown routine from the first week.',
        'Build a base of easy running and general strength before intense work.',
        'Keep a simple training log of sessions, sleep, and how you feel.',
        'Choose shoes that match the event and the surface.',
      ],
      drills: [
        'Event sampling circuit — rotate through a short sprint, a jump, and a throw.',
        'Dynamic warm-up — complete a ten-minute routine before every session.',
        'Easy run-walk — alternate two minutes running and one minute walking for twenty minutes.',
        'Bodyweight strength circuit — squats, push-ups, rows, and planks.',
      ],
      mistakes: [
        'Specialising in one event before developing general athleticism.',
        'Skipping warm-ups because the session is short.',
        'Increasing training volume sharply after a good result.',
      ],
      faqs: [
        ['Which event should I choose?', 'Start with the events you enjoy and can train consistently. A coach can help match your build and speed to an event.'],
        ['How often should beginners train?', 'Three sessions per week is a good starting point, with at least one rest day between hard efforts.'],
      ],
    },
    {
      slug: 'athletics-sprint-technique',
      title: 'Sprint Technique: Posture, Arm Action, and Ground Contact (2026)',
      description:
        'Improve sprint technique with better posture, arm drive, and a powerful, efficient ground contact.',
      summary:
        'Sprint technique is about applying force in the right direction with minimal wasted movement. Tall posture, aggressive arm action, and a strong push from the ground produce faster, more relaxed running.',
      points: [
        'Run tall with the hips high and the eyes focused ahead.',
        'Drive the arms from the shoulder with the elbows bent to about ninety degrees.',
        'Strike the ground underneath the hip rather than reaching ahead.',
        'Push back and down through the stance leg to create forward propulsion.',
        'Stay relaxed in the face, shoulders, and hands at top speed.',
      ],
      drills: [
        'A-skips — emphasise knee lift and a tall posture.',
        'Wall drives — drive the knees and arms against a wall.',
        'Straight-leg bounds — develop stiffness and ground contact.',
        'Flying thirties — sprint at top speed through a measured zone.',
      ],
      mistakes: [
        'Reaching the lead foot too far ahead and braking on contact.',
        'Tensing the shoulders and shortening the arm action.',
        'Overstriding instead of letting speed come from force application.',
      ],
      faqs: [
        ['Can technique improve sprint speed?', 'Yes. Better mechanics improve force application and reduce braking, which translates into faster times.'],
        ['How much sprint volume should I do?', 'Keep volume low and quality high. Three to six short sprints with full recovery is often enough for beginners.'],
      ],
    },
    {
      slug: 'athletics-block-starts',
      title: 'Block Starts: Setup, First Step, and Acceleration (2026)',
      description:
        'Learn starting block setup, the set position, and the first steps that create a fast, powerful start.',
      summary:
        'A good block start sets up the entire race. Correct block spacing, a stable set position, and a powerful first push create acceleration without wasted movement.',
      points: [
        'Set the blocks so the front pedal is about two foot-lengths from the line.',
        'Place the hands just behind the line with the shoulders slightly ahead of the hands.',
        'Keep the hips high in the set position and the back flat.',
        'Push hard from both legs and let the first steps be short and powerful.',
        'Rise gradually rather than standing upright immediately.',
      ],
      drills: [
        'Block walk-through — rehearse the setup and positions without sprinting.',
        'Push-and-step — drive out of the blocks for three steps and stop.',
        'Falling start — lean forward and accelerate from a falling position.',
        'Acceleration ladder — sprint 10, 20, and 30 metres from blocks.',
      ],
      mistakes: [
        'Setting the blocks too close and cramping the first step.',
        'Popping upright immediately after the start.',
        'Leaving the back pedal too quickly and losing the push.',
      ],
      faqs: [
        ['Which foot goes in the front block?', 'Usually the dominant leg goes in the front pedal, but experiment with a coach to find what produces the best first push.'],
        ['Why do I fall forward at the start?', 'You may be pushing too high or standing up too early. Focus on a long, low first push.'],
      ],
    },
    {
      slug: 'athletics-relay-exchanges',
      title: 'Relay Exchanges: Baton Passing and Zone Timing (2026)',
      description:
        'Master relay baton exchanges with correct zone timing, hand position, and communication between runners.',
      summary:
        'Relay races are won and lost in the exchange zone. Clear communication, consistent hand position, and disciplined timing turn four good sprinters into a fast relay team.',
      points: [
        'Decide on an upsweep or downsweep exchange and rehearse it consistently.',
        'The incoming runner should call the exchange clearly before the handoff.',
        'The outgoing runner should accelerate before receiving the baton.',
        'Keep the receiving hand steady and the baton moving smoothly.',
        'Mark the check mark based on the outgoing runner’s acceleration.',
      ],
      drills: [
        'Standing exchange — practise the handoff without running.',
        'Walking exchange — complete the exchange while walking.',
        'Zone rehearsal — run the exchange inside the actual zone.',
        'Timed relay — time each exchange and compare consistency.',
      ],
      mistakes: [
        'Looking back for the baton and losing speed.',
        'Standing still and waiting for the baton instead of accelerating.',
        'Exchanging outside the zone and disqualifying the team.',
      ],
      faqs: [
        ['How big is the exchange zone?', 'The zone is typically 30 metres in senior competition, with a 10-metre acceleration area before it. Check your meet rules.'],
        ['What is the safest exchange?', 'A consistent downsweep or upsweep that both runners have rehearsed hundreds of times. Familiarity beats novelty.'],
      ],
    },
    {
      slug: 'athletics-middle-distance-pacing',
      title: 'Middle-Distance Pacing: Even Splits and Race Control (2026)',
      description:
        'Run smarter middle-distance races with even pacing, split awareness, and tactics that match your strengths.',
      summary:
        'Middle-distance racing rewards control. Going out too fast is the most common mistake, and even pacing with a well-judged kick usually beats a reckless start.',
      points: [
        'Set target splits for each lap before the race.',
        'Start conservatively and settle into rhythm rather than sprinting the first 200 metres.',
        'Use a relaxed stride and breathing pattern to conserve energy.',
        'Know where you plan to make your move and rehearse it in training.',
        'Finish with a controlled kick rather than an early panic sprint.',
      ],
      drills: [
        'Even-split intervals — run repeats at target pace and compare splits.',
        'Pace-change run — alternate 200 metres steady and 200 metres faster.',
        'Tempo run — twenty minutes at a controlled threshold effort.',
        'Race simulation — run a full distance with splits called aloud.',
      ],
      mistakes: [
        'Sprinting the first lap and fading badly.',
        'Ignoring splits and relying on feel alone.',
        'Making a move too early and running out of energy.',
      ],
      faqs: [
        ['Should I train with a watch?', 'Yes for pacing practice, but learn to feel the effort too. Races rarely go exactly to plan.'],
        ['How do I find my target pace?', 'Use recent race times or a time trial, then adjust for conditions. A coach can help set realistic splits.'],
      ],
    },
    {
      slug: 'athletics-long-distance-training',
      title: 'Long-Distance Training: Base, Threshold, and Recovery (2026)',
      description:
        'Build a long-distance training week with easy running, threshold work, long runs, and adequate recovery.',
      summary:
        'Long-distance training works best when most running is easy and a small amount is hard. The 80/20 principle keeps athletes fresh enough to absorb quality sessions.',
      points: [
        'Keep the majority of running at an easy, conversational effort.',
        'Include one or two threshold sessions per week.',
        'Run a longer session weekly to build endurance.',
        'Take an easy day or rest day after every hard session.',
        'Increase weekly volume by small increments and back off every few weeks.',
      ],
      drills: [
        'Easy run — forty minutes at conversational pace.',
        'Threshold repeats — four times eight minutes with two minutes recovery.',
        'Long run — sixty to ninety minutes at an easy effort.',
        'Strides — four 20-second accelerations after an easy run.',
      ],
      mistakes: [
        'Running every session at moderate effort and never recovering.',
        'Increasing mileage too quickly.',
        'Neglecting strength and mobility work.',
      ],
      faqs: [
        ['What is the 80/20 rule?', 'Roughly 80 percent of running volume should be easy and 20 percent moderate to hard. It helps balance adaptation and recovery.'],
        ['How long should a long run be?', 'It depends on your event and experience. For most amateur distance runners, 60-90 minutes is a useful weekly long run.'],
      ],
    },
    {
      slug: 'athletics-hurdling',
      title: 'Hurdling Technique: Rhythm, Lead Leg, and Clearance (2026)',
      description:
        'Improve hurdling with better rhythm, lead-leg technique, and efficient clearance over the barriers.',
      summary:
        'Hurdling is sprinting with rhythm. The best hurdlers do not jump; they run through the hurdles with a consistent lead leg, trail leg, and stride pattern.',
      points: [
        'Set the hurdle height and spacing appropriate to your level.',
        'Attack the hurdle with the lead leg rather than lifting the body.',
        'Keep the trail leg tight and snap it through quickly.',
        'Maintain the same stride rhythm between hurdles.',
        'Lean forward slightly over the hurdle and sprint off the landing.',
      ],
      drills: [
        'Lead-leg wall drill — rehearse the lead-leg action against a wall.',
        'Trail-leg pull-through — isolate the trail-leg movement over a low hurdle.',
        'Rhythm drill — run over three low hurdles with a consistent stride pattern.',
        'Hurdle walk-through — step over hurdles at walking pace to learn clearance.',
      ],
      mistakes: [
        'Jumping up instead of attacking forward.',
        'Lifting the trail leg too high and losing rhythm.',
        'Stuttering before the hurdle because the stride pattern is inconsistent.',
      ],
      faqs: [
        ['How do I find my lead leg?', 'Test both legs over a low hurdle. The leg you naturally attack with is usually your lead leg.'],
        ['Why do I lose speed between hurdles?', 'Usually because you jump too high or land off balance. Focus on running through the hurdle rather than over it.'],
      ],
    },
    {
      slug: 'athletics-long-jump',
      title: 'Long Jump: Approach, Takeoff, and Landing (2026)',
      description:
        'Learn long jump technique with a consistent approach, powerful takeoff, and safe landing.',
      summary:
        'Long jump performance depends on an accurate approach and a strong takeoff. A repeatable run-up and a tall, fast takeoff matter more than a dramatic landing.',
      points: [
        'Measure the approach and rehearse the same run-up repeatedly.',
        'Build speed through the approach and avoid overstriding near the board.',
        'Take off tall through the board with a fast, aggressive last step.',
        'Keep the free leg and arms driving forward in flight.',
        'Land with both feet and bend the knees to absorb impact.',
      ],
      drills: [
        'Approach rehearsal — run the run-up and check the takeoff foot placement.',
        'Short-approach jumps — jump from a shorter run-up with a focus on takeoff.',
        'Takeoff drills — hop and bound from the board into the pit.',
        'Landing practice — jump from a low box and practise a two-foot landing.',
      ],
      mistakes: [
        'Changing the run-up length before every attempt.',
        'Slowing down before the board and losing speed.',
        'Landing stiff-legged and risking an ankle or knee injury.',
      ],
      faqs: [
        ['Should I jump with one foot?', 'Yes. The takeoff is from one foot; landing is with two. Practise the transition until it feels natural.'],
        ['How many jumps should I do in a session?', 'Keep volume modest. Ten to fifteen quality jumps with full recovery is usually enough.'],
      ],
    },
    {
      slug: 'athletics-high-jump',
      title: 'High Jump: Curve, Takeoff, and Bar Clearance (2026)',
      description:
        'Understand high jump technique, including the curved approach, takeoff, and Fosbury flop clearance.',
      summary:
        'High jump is a technical event built on a fast curved approach and an explosive takeoff. The clearance over the bar is a consequence of the run-up and takeoff, not a separate jump.',
      points: [
        'Use a curved approach and accelerate through the final steps.',
        'Lean away from the bar on the curve and keep the hips tall.',
        'Take off from the foot farthest from the bar.',
        'Drive the free knee upward and rotate the body over the bar.',
        'Land on the upper back and shoulders on a safe mat.',
      ],
      drills: [
        'Curve running — run the curved approach without jumping.',
        'Takeoff drill — take off from the curve and land on the mat.',
        'Bar clearance from a box — practise the flop shape from a raised platform.',
        'Short-approach jumps — jump from three steps with a focus on takeoff.',
      ],
      mistakes: [
        'Running too straight into the bar and losing the curve.',
        'Taking off too far from the bar and reaching for the height.',
        'Landing on the feet or head instead of the upper back.',
      ],
      faqs: [
        ['How high can a beginner jump?', 'Progress depends on technique, strength, and training history. Focus on a consistent approach before chasing height.'],
        ['Is the flop the only technique?', 'The flop is standard now, but some young athletes start with a scissors technique before progressing.'],
      ],
    },
    {
      slug: 'athletics-triple-jump',
      title: 'Triple Jump: Hop, Step, and Jump Phases (2026)',
      description:
        'Learn triple jump phases, rhythm, and takeoff timing with drills that connect the hop, step, and jump.',
      summary:
        'Triple jump is a rhythm event. The hop, step, and jump must flow together without losing speed, and the approach must be consistent enough to hit the board accurately.',
      points: [
        'Build a consistent approach and hit the board under control.',
        'Keep the first hop low and fast rather than high and slow.',
        'Maintain posture and hip height through the step phase.',
        'Drive the free leg forward and finish with a strong jump into the pit.',
        'Land safely with both feet and bent knees.',
      ],
      drills: [
        'Hop-only drill — practise the first phase with a short approach.',
        'Step-only drill — rehearse the second phase and landing.',
        'Rhythm bounds — bound continuously with an emphasis on posture.',
        'Short-approach triple jumps — combine all three phases from a reduced run-up.',
      ],
      mistakes: [
        'Hopping too high and losing forward speed.',
        'Collapsing at the step and making the final jump weak.',
        'Using an inconsistent approach and fouling or scratching.',
      ],
      faqs: [
        ['Which phase is most important?', 'All three matter, but the hop and step set up the final jump. Losing speed early is the most common problem.'],
        ['How do I avoid injury?', 'Build strength, progress gradually, and limit high-impact volume. Triple jump loads the legs heavily.'],
      ],
    },
    {
      slug: 'athletics-shot-put',
      title: 'Shot Put: Grip, Stance, and Throwing Power (2026)',
      description:
        'Learn shot put fundamentals with the grip, stance, glide or spin, and a powerful release.',
      summary:
        'Shot put combines strength, technique, and timing. A clean grip, a stable stance, and a powerful leg drive produce more distance than arm strength alone.',
      points: [
        'Place the shot against the base of the fingers, not the palm.',
        'Start with a stable stance and the shot tucked under the chin.',
        'Drive with the legs and rotate the hips into the throw.',
        'Release the shot at a consistent angle with a strong follow-through.',
        'Practise the glide or spin without the shot before adding implement weight.',
      ],
      drills: [
        'Standing throw — throw from a static stance to learn the release.',
        'Glide walk-through — rehearse the glide footwork without the shot.',
        'Power position throws — throw from the power position with a light implement.',
        'Release drill — practise the final arm action with a medicine ball.',
      ],
      mistakes: [
        'Holding the shot in the palm and losing control.',
        'Throwing with the arm only and ignoring the legs.',
        'Rushing the glide and losing balance before release.',
      ],
      faqs: [
        ['Should beginners use the glide or spin?', 'Most beginners start with the glide because it is easier to learn and control. The spin requires more technical coaching.'],
        ['How do I choose shot weight?', 'Use the weight specified for your age and competition level. Practise with lighter implements to learn technique.'],
      ],
    },
    {
      slug: 'athletics-discus-throw',
      title: 'Discus Throw: Grip, Wind-Up, and Release (2026)',
      description:
        'Learn discus throw technique with a secure grip, balanced wind-up, and controlled release.',
      summary:
        'Discus throwing rewards rhythm and balance. A secure grip, a smooth wind-up, and a powerful release from the legs produce a controlled throw that stays inside the sector.',
      points: [
        'Grip the discus with the fingers spread and the thumb relaxed.',
        'Start with a balanced stance and a smooth wind-up.',
        'Use the legs and hips to drive the throw, not just the arm.',
        'Release the discus with the palm facing down and a flat trajectory.',
        'Follow through and stay inside the circle.',
      ],
      drills: [
        'Standing throw — throw from a static stance to learn the release.',
        'Wind-up rehearsal — practise the wind-up without releasing.',
        'Power-position throws — throw from the power position with a light discus.',
        'Sector control — throw toward a target and check the landing angle.',
      ],
      mistakes: [
        'Gripping the discus too tightly and losing the release.',
        'Rushing the wind-up and losing balance.',
        'Stepping out of the circle and fouling the throw.',
      ],
      faqs: [
        ['Which hand should I throw with?', 'Throw with your dominant hand and rotate in the direction that feels balanced. A coach can assess your natural rotation.'],
        ['Why does my discus wobble?', 'A wobbly flight usually comes from an uneven release or a loose grip. Focus on a clean, flat release.'],
      ],
    },
    {
      slug: 'athletics-javelin',
      title: 'Javelin Throw: Grip, Run-Up, and Release (2026)',
      description:
        'Learn javelin technique with a secure grip, controlled run-up, and a powerful release angle.',
      summary:
        'Javelin is a throwing event that depends on a fast, controlled run-up and a clean release. The run-up builds momentum, and the final arm action transfers it into the javelin.',
      points: [
        'Grip the javelin with the fingers around the cord and the thumb relaxed.',
        'Build speed through the run-up without losing control.',
        'Turn the throwing shoulder back and keep the javelin aligned.',
        'Release the javelin over the shoulder with a strong follow-through.',
        'Practise the run-up and release separately before combining them.',
      ],
      drills: [
        'Standing throw — throw from a static stance to learn the release.',
        'Run-up walk-through — rehearse the approach without throwing.',
        'Release drill — throw a light ball or javelin at a target.',
        'Cross-step drill — practise the final steps and hip rotation.',
      ],
      mistakes: [
        'Throwing with a stiff arm and no hip rotation.',
        'Losing control of the javelin in the run-up.',
        'Releasing too low and losing distance.',
      ],
      faqs: [
        ['Is javelin dangerous?', 'Yes, it requires strict safety rules and supervision. Never throw without a clear, controlled area and qualified coaching.'],
        ['What is a good release angle?', 'It varies with the implement and conditions, but a slightly upward trajectory is typical. Focus on a clean release first.'],
      ],
    },
    {
      slug: 'athletics-hammer-throw',
      title: 'Hammer Throw: Setup, Turns, and Release (2026)',
      description:
        'Understand hammer throw technique, including the grip, wind-up, turns, and release inside the circle.',
      summary:
        'Hammer throw is a highly technical event that requires rhythm, balance, and precise timing. Beginners must learn the wind-up and turns slowly before adding speed.',
      points: [
        'Wear gloves and check the hammer handle and wire before every session.',
        'Build a stable stance and rehearse the wind-up without releasing.',
        'Turn smoothly and keep the hammer path consistent.',
        'Use the legs to drive the rotation and the arms to guide the hammer.',
        'Release inside the sector and follow through under control.',
      ],
      drills: [
        'Wind-up drill — rehearse the wind-up with a light hammer or handle.',
        'Turn drill — practise the turns without releasing.',
        'Standing throw — throw from a static position to learn the release.',
        'Light-hammer throws — use a lighter implement to develop rhythm.',
      ],
      mistakes: [
        'Rushing the turns and losing balance.',
        'Pulling the hammer with the arms instead of driving with the legs.',
        'Skipping safety checks on the wire and handle.',
      ],
      faqs: [
        ['Is hammer throw suitable for beginners?', 'Only with qualified coaching and strict safety supervision. The implement and circle require careful management.'],
        ['How long does it take to learn?', 'The basics take months of consistent practice. Expect to spend significant time on footwork before throwing hard.'],
      ],
    },
    {
      slug: 'athletics-pole-vault',
      title: 'Pole Vault: Run-Up, Plant, and Clearance (2026)',
      description:
        'Learn pole vault fundamentals from the run-up and plant to the swing and bar clearance.',
      summary:
        'Pole vault combines sprinting, gymnastics, and timing. A consistent run-up, a strong plant, and a controlled swing are the foundations of a safe vault.',
      points: [
        'Use a measured run-up and rehearse it repeatedly.',
        'Plant the pole early and drive the top hand upward.',
        'Swing the legs up and keep the body close to the pole.',
        'Rotate over the bar and release the pole safely.',
        'Land on the mat with the body under control.',
      ],
      drills: [
        'Run-up rehearsal — measure and run the approach without vaulting.',
        'Plant drill — practise the plant against a wall or pole plant box.',
        'Short-run vaults — vault from a short run-up with a low bar.',
        'Swing drill — practise the swing on a high bar or rings.',
      ],
      mistakes: [
        'Planting late and losing the energy from the run-up.',
        'Looking at the bar instead of the pole and losing body position.',
        'Using a pole that is too stiff or too long for your level.',
      ],
      faqs: [
        ['Do I need a coach to pole vault?', 'Yes. Pole vault has significant safety risks and should always be taught by a qualified coach with proper equipment.'],
        ['How do I choose a pole?', 'Pole selection depends on body weight, grip height, and experience. Follow your coach’s guidance and never exceed the pole’s rating.'],
      ],
    },
    {
      slug: 'athletics-race-walking',
      title: 'Race Walking: Technique, Cadence, and Judging (2026)',
      description:
        'Learn race walking technique, including the straight-leg rule, hip rotation, and cadence training.',
      summary:
        'Race walking is a technical endurance event with strict rules. A straight support leg and continuous contact with the ground are non-negotiable, and judges watch both closely.',
      points: [
        'Keep the support leg straight from contact until it passes under the body.',
        'Maintain continuous contact with the ground; no visible flight phase is allowed.',
        'Use hip rotation and arm swing to generate speed.',
        'Build cadence gradually with short, quick steps.',
        'Practise technique in front of a mirror or with video feedback.',
      ],
      drills: [
        'Straight-leg drill — walk slowly and check the support leg.',
        'Cadence ladder — walk short intervals at increasing cadence.',
        'Hip-rotation drill — exaggerate the hip action while walking in place.',
        'Video review — film from the side and check for flight or bent knees.',
      ],
      mistakes: [
        'Bending the support knee and risking a judge’s warning.',
        'Overstriding and losing contact with the ground.',
        'Ignoring technique when fatigue builds late in a session.',
      ],
      faqs: [
        ['What are the two main race walking rules?', 'The support leg must be straight, and at least one foot must be in contact with the ground at all times.'],
        ['How is race walking judged?', 'Judges observe technique around the course and issue warnings or disqualifications for loss of contact or a bent support knee.'],
      ],
    },
    {
      slug: 'athletics-warm-up',
      title: 'Athletics Warm-Up: Dynamic Routine for Track and Field (2026)',
      description:
        'Build a complete athletics warm-up with raising, mobilising, activating, and event-specific preparation.',
      summary:
        'A good athletics warm-up prepares the body for speed, power, and precision without leaving you tired. The best routine is consistent, progressive, and matched to the event.',
      points: [
        'Start with easy movement to raise heart rate and body temperature.',
        'Include dynamic mobility for hips, ankles, and shoulders.',
        'Activate glutes, hamstrings, and trunk before fast work.',
        'Finish with event-specific drills and a few accelerations.',
        'Keep the routine consistent so it becomes a performance cue.',
      ],
      drills: [
        'Raise — five minutes of easy jogging or skipping.',
        'Mobilise — leg swings, hip circles, and ankle rocks.',
        'Activate — glute bridges, band walks, and planks.',
        'Potentiate — three short accelerations or event-specific drills.',
      ],
      mistakes: [
        'Holding long static stretches before explosive work.',
        'Skipping the warm-up because the session is short.',
        'Changing the routine before a competition.',
      ],
      faqs: [
        ['Should I stretch before sprinting?', 'Dynamic mobility is better before explosive work. Save longer static stretches for after training or separate sessions.'],
        ['How long should a warm-up take?', 'Twenty to thirty minutes is typical for a full track session, with shorter versions for easy days.'],
      ],
    },
    {
      slug: 'athletics-strength-training',
      title: 'Athletics Strength Training: Power, Stability, and Durability (2026)',
      description:
        'Build athletics strength with compound lifts, plyometrics, and trunk work that support running, jumping, and throwing.',
      summary:
        'Strength training supports athletics performance by improving force production and tissue resilience. The best programmes are simple, progressive, and matched to the event.',
      points: [
        'Use compound movements such as squats, hinges, and lunges.',
        'Include upper-body pushing and pulling for balance and throwing support.',
        'Add low-volume plyometrics for jump and sprint events.',
        'Train the trunk to resist and transfer force.',
        'Progress load gradually and reduce volume before competitions.',
      ],
      drills: [
        'Back squat — three sets of five with controlled technique.',
        'Romanian deadlift — three sets of six.',
        'Box jumps — three sets of five with a soft landing.',
        'Pallof press — three sets of ten per side.',
      ],
      mistakes: [
        'Adding heavy loads before technique is consistent.',
        'Doing high-volume plyometrics and heavy lifting on the same day.',
        'Ignoring unilateral strength and creating imbalances.',
      ],
      faqs: [
        ['How many strength sessions per week?', 'Two sessions per week is enough for most athletes, with adjustments for event and competition schedule.'],
        ['Can strength training make me slower?', 'Not when programmed sensibly. Strength work supports speed and power; excessive fatigue is the real risk.'],
      ],
    },
    {
      slug: 'athletics-injury-prevention',
      title: 'Athletics Injury Prevention: Hamstrings, Achilles, and Load (2026)',
      description:
        'Reduce common athletics injuries with hamstring strength, Achilles care, load management, and recovery habits.',
      summary:
        'Most athletics injuries are overuse or sprint-related. Hamstring and Achilles problems build when load rises faster than tissue can adapt, so progression and recovery are central.',
      points: [
        'Build hamstring strength with eccentric and Nordic exercises.',
        'Progress running volume and intensity gradually.',
        'Include calf and Achilles loading in the weekly plan.',
        'Warm up thoroughly before sprinting or jumping.',
        'Reduce load when sleep, stress, or soreness signals accumulate.',
      ],
      drills: [
        'Nordic hamstring curl — three sets of four to six controlled reps.',
        'Calf raise — three sets of fifteen with a slow lower.',
        'Single-leg balance — thirty seconds per side.',
        'Easy run — twenty to thirty minutes at conversational pace.',
      ],
      mistakes: [
        'Increasing sprint volume sharply before a competition.',
        'Ignoring tightness that changes running mechanics.',
        'Training through pain because the session is important.',
      ],
      faqs: [
        ['What is the most common track injury?', 'Hamstring strains are common in sprinters, while Achilles and shin issues are common in distance runners. Both benefit from load management.'],
        ['How do I return to running after injury?', 'Progress gradually and follow professional guidance. Start with easy running and add speed only when symptom-free.'],
      ],
    },
    {
      slug: 'athletics-track-meet-preparation',
      title: 'Track Meet Preparation: Warm-Up, Schedule, and Recovery (2026)',
      description:
        'Prepare for a track meet with a reliable warm-up, event schedule planning, and recovery between rounds.',
      summary:
        'Track meet preparation is part logistics and part routine. Knowing when to warm up, what to eat, and how to recover between rounds matters as much as the training you have done.',
      points: [
        'Check the event schedule and plan warm-up timing backward from your start.',
        'Bring layers, snacks, fluids, and spare spikes.',
        'Run the same warm-up you use in training.',
        'Recover between rounds with food, fluids, and light movement.',
        'Review the performance afterward without overreacting to a single result.',
      ],
      drills: [
        'Warm-up rehearsal — run the exact routine at the venue or a similar track.',
        'Stride-outs — complete three to four accelerations before competing.',
        'Between-round recovery — practise a short walk, snack, and hydration routine.',
        'Visualisation — rehearse the event plan before the call room.',
      ],
      mistakes: [
        'Warming up too early and cooling down before the event.',
        'Trying new food or equipment on meet day.',
        'Skipping recovery between rounds and fading in the final.',
      ],
      faqs: [
        ['When should I warm up before my event?', 'Start 30-45 minutes before your event and finish with strides close to the call time. Adjust for weather and schedule delays.'],
        ['What should I eat at a meet?', 'Familiar snacks with carbohydrate and some protein, plus fluids. Avoid heavy meals close to competition.'],
      ],
    },
  ],
};

export default category;
