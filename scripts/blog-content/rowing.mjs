const category = {
  key: 'rowing',
  label: 'Rowing',
  venue: 'a rowing tank, ergometer gym, or calm-water lake with safety cover',
  demand:
    'repeated leg drive, sustained trunk stability, grip endurance, and the coordination to match force and timing with other rowers',
  equipment: [
    'Rowing shell',
    'Oars or sculls',
    'Ergometer',
    'Seat pad',
    'Blister tape',
    'Water bottle',
  ],
  injuries: ['lower-back strain', 'rib stress injury', 'wrist tendinopathy', 'knee pain'],
  terms: [
    ['Catch', 'The moment the blade enters the water at the front of the stroke.'],
    ['Drive', 'The power phase when the legs push and the blade propels the boat.'],
    ['Finish', 'The end of the drive when the blade is extracted and the hands tap down.'],
    ['Ratio', 'The relationship between time spent on the drive and time spent on the recovery.'],
  ],
  tools: [
    { label: 'Training Load Calculator', slug: 'training-load-calculator' },
    { label: 'Heart Rate Calculator', slug: 'heart-rate-calculator' },
    { label: 'VO2 Max Calculator', slug: 'vo2max-calculator' },
  ],
  posts: [
    {
      slug: 'rowing-beginner-basics',
      title: 'Rowing for Beginners: The Stroke, Safety, and First Sessions (2026)',
      description:
        'Start rowing with a beginner guide to the stroke sequence, boat safety, and the first drills on an erg and in a boat.',
      summary:
        'Rowing beginners should learn the sequence of the stroke on an erg before adding boat balance. Legs, body, then arms on the drive, and the reverse on the recovery, is the foundation of every good stroke.',
      points: [
        'Learn the drive sequence: legs, then body swing, then arms.',
        'Reverse the sequence on the recovery: arms, body, then legs.',
        'Keep the handle moving in a straight horizontal path.',
        'Never row alone without safety cover and a buoyancy aid where required.',
        'Build duration gradually before chasing power or rate.',
      ],
      drills: [
        'Legs-only drill — drive with the legs while the body stays forward.',
        'Pick drill — add body swing, then arms, in stages.',
        'Pause drill — pause at the catch and finish to check position.',
        'Steady-state erg — twenty minutes at an easy, consistent rate.',
      ],
      mistakes: [
        'Opening the back too early and losing leg power.',
        'Rushing the recovery and disrupting the ratio.',
        'Skipping safety checks before getting on the water.',
      ],
      faqs: [
        ['Should I learn on an erg or in a boat?', 'Most beginners start on an erg to learn the sequence, then move into a stable boat with coaching.'],
        ['What is a good stroke rate for beginners?', 'Around 18-22 strokes per minute on the erg is a good starting range for steady technique work.'],
      ],
    },
    {
      slug: 'rowing-catch-technique',
      title: 'Rowing Catch Technique: Blade Entry and Connection (2026)',
      description:
        'Improve the rowing catch with a strong body position, clean blade entry, and immediate connection.',
      summary:
        'The catch sets up the whole stroke. A strong forward position, relaxed shoulders, and a clean blade entry create immediate connection and prevent wasted force.',
      points: [
        'Reach forward from the hips with a stable, flat back.',
        'Keep the shoulders relaxed and the arms straight at the catch.',
        'Place the blade in the water cleanly without skying or burying it.',
        'Connect the blade before applying leg force.',
        'Avoid overreaching and losing the power position.',
      ],
      drills: [
        'Catch pause — pause at the catch and check blade depth.',
        'Front-end drill — row with legs only from the catch.',
        'Blade-entry drill — place the blade repeatedly without driving.',
        'Video review — film from the side to check reach and connection.',
      ],
      mistakes: [
        'Opening the back before the blade is connected.',
        'Skying the blades and losing the first part of the drive.',
        'Overreaching and rounding the lower back.',
      ],
      faqs: [
        ['How deep should the blade be at the catch?', 'The blade should be fully covered but not buried. The goal is a clean, quick connection.'],
        ['Why do I feel no power at the catch?', 'You may be rushing the entry or opening the back early. Slow the recovery and connect before driving.'],
      ],
    },
    {
      slug: 'rowing-drive-phase',
      title: 'Rowing Drive Phase: Leg Power and Sequential Force (2026)',
      description:
        'Build a stronger rowing drive with sequential leg, body, and arm force and a stable trunk.',
      summary:
        'The drive is where the boat moves. Force should build from the legs, transfer through a stable trunk, and finish with the arms, without losing connection to the water.',
      points: [
        'Drive with the legs first and keep the trunk stable.',
        'Swing the body through only after the legs are mostly extended.',
        'Finish with the arms and a strong draw through the handle.',
        'Keep the blade covered throughout the drive.',
        'Avoid opening the back early and wasting leg force.',
      ],
      drills: [
        'Legs-only drive — build power without body swing.',
        'Body-swing drill — add the trunk after leg drive.',
        'Power tens — ten hard strokes with a focus on sequence.',
        'Erg force curve — review the force curve for a smooth build.',
      ],
      mistakes: [
        'Shooting the slide and losing connection at the catch.',
        'Using the arms before the legs have finished.',
        'Letting the blade slip through the water during the drive.',
      ],
      faqs: [
        ['What is shooting the slide?', 'Shooting the slide is when the seat moves backward faster than the handle at the catch, losing connection and power.'],
        ['How do I get a stronger drive?', 'Prioritise leg drive and connection before adding rate or effort. Technique transfers force more effectively than muscling.'],
      ],
    },
    {
      slug: 'rowing-finish-release',
      title: 'Rowing Finish and Release: Clean Extraction and Balance (2026)',
      description:
        'Finish the rowing stroke cleanly with correct handle height, body position, and blade extraction.',
      summary:
        'A clean finish sets up a balanced recovery. The handle should come into the body at the right height, the elbows should finish naturally, and the blades should release without dragging.',
      points: [
        'Draw the handle to the lower ribs with the elbows relaxed.',
        'Keep the wrists flat and the blade covered until the finish.',
        'Tap the handle down to extract the blade cleanly.',
        'Keep the body upright and the trunk stable at the finish.',
        'Avoid leaning back excessively and losing balance.',
      ],
      drills: [
        'Finish pause — pause at the finish and check handle height.',
        'Tap drill — practise the down-and-away extraction.',
        'Arms-only rowing — row with the body set and arms only.',
        'Balance drill — row with the blades off the water at the finish.',
      ],
      mistakes: [
        'Pulling the handle too high or too low into the body.',
        'Leaning back too far and losing the connection.',
        'Dragging the blades on the recovery.',
      ],
      faqs: [
        ['Where should the handle finish?', 'Around the lower ribs, with the elbows relaxed and the wrists flat. Exact position varies slightly by boat type.'],
        ['Why do my blades drag on the recovery?', 'The tap down may be too weak or the hands too low. Practise a clean extraction and a relaxed recovery.'],
      ],
    },
    {
      slug: 'rowing-recovery-phase',
      title: 'Rowing Recovery: Ratio, Relaxation, and Rhythm (2026)',
      description:
        'Use the rowing recovery to reset the body, control the ratio, and prepare for the next catch.',
      summary:
        'The recovery is where rowers recover and prepare. A relaxed, controlled recovery with the correct ratio sets up a strong catch and keeps the boat balanced.',
      points: [
        'Release the arms first, then swing the body, then bend the legs.',
        'Keep the recovery slower than the drive.',
        'Relax the shoulders and grip during the recovery.',
        'Keep the handle moving smoothly without rushing.',
        'Arrive at the catch ready to connect immediately.',
      ],
      drills: [
        'Arms-body-legs sequence — rehearse the recovery order slowly.',
        'Ratio drill — row with a deliberate pause on the recovery.',
        'Feet-out rowing — row with feet out of the stretchers to develop balance.',
        'Steady-state rhythm — maintain a consistent rate for ten minutes.',
      ],
      mistakes: [
        'Rushing the recovery and arriving at the catch unprepared.',
        'Bending the legs before the arms and body are set.',
        'Tensing the shoulders and losing relaxation.',
      ],
      faqs: [
        ['What is the correct recovery order?', 'Hands away, body over, then legs. Reversing the drive sequence keeps the boat balanced.'],
        ['Why is the recovery important?', 'It sets up the catch, controls the stroke rate, and gives the rower a chance to relax and recover before the next drive.'],
      ],
    },
    {
      slug: 'rowing-ratio-rhythm',
      title: 'Rowing Ratio and Rhythm: Controlling the Stroke (2026)',
      description:
        'Understand rowing ratio and rhythm, and use them to row more efficiently at different rates.',
      summary:
        'Ratio is the balance between the drive and recovery. A longer recovery at lower rates lets rowers relax, while higher rates shorten the ratio without turning the recovery into a rush.',
      points: [
        'Keep the drive quick and powerful; make the recovery longer and relaxed.',
        'At low rates, emphasise the pause and relaxation on the recovery.',
        'As rate rises, shorten the recovery without rushing the drive.',
        'Use a metronome or erg rate display to build consistency.',
        'Match the crew’s rhythm rather than rowing independently.',
      ],
      drills: [
        'Rate ladder — row at 18, 20, 22, and 24 strokes per minute.',
        'Pause-row — add a one-second pause at the finish.',
        'Metronome rowing — match a steady beat on the erg.',
        'Crew rhythm drill — row in a group with a coach calling the ratio.',
      ],
      mistakes: [
        'Rushing the recovery at low rates and losing relaxation.',
        'Slowing the drive at high rates and losing boat speed.',
        'Rowing out of sync with the crew.',
      ],
      faqs: [
        ['What is a good stroke rate for steady rowing?', 'Most steady sessions sit around 18-24 strokes per minute, depending on the boat and the athlete.'],
        ['How do I row at a higher rate without rushing?', 'Shorten the recovery rather than speeding up the drive, and keep the sequence clean.'],
      ],
    },
    {
      slug: 'rowing-sweep-vs-sculling',
      title: 'Sweep vs Sculling: Differences in Technique and Boats (2026)',
      description:
        'Compare sweep rowing and sculling, including blade use, balance, and the skills each discipline develops.',
      summary:
        'Sweep rowing uses one oar and relies on crew balance, while sculling uses two oars and demands individual symmetry. Both share the same drive sequence but feel very different on the water.',
      points: [
        'Sweep rowers handle one oar and rely on the crew for balance.',
        'Scullers handle two oars and control both sides independently.',
        'The drive sequence is the same: legs, body, arms.',
        'Sculling develops symmetry and individual boat-handling skills.',
        'Sweep rowing develops teamwork and crew timing.',
      ],
      drills: [
        'Sculling in a single — practise balance with two oars.',
        'Sweep tank session — row one side in a controlled environment.',
        'Switch-side drill — learn both sides in sweep rowing.',
        'Crew timing drill — row in a sweep boat with a coach.',
      ],
      mistakes: [
        'Assuming sweep and sculling technique are identical at the handle.',
        'Neglecting balance work when moving from sweep to sculling.',
        'Rowing one side only and creating strength imbalances.',
      ],
      faqs: [
        ['Which is easier to learn?', 'Many beginners find sculling in a stable single easier to understand because both sides are independent, while sweep rowing depends on crew balance.'],
        ['Can I do both?', 'Yes, and many rowers do. The skills complement each other, especially balance and blade work.'],
      ],
    },
    {
      slug: 'rowing-sculling-technique',
      title: 'Sculling Technique: Two-Oar Balance and Blade Work (2026)',
      description:
        'Improve sculling technique with better balance, blade depth, and independent hand control.',
      summary:
        'Sculling requires independent control of two oars and constant balance adjustments. A relaxed grip, level hands, and clean blade work make the single stable and efficient.',
      points: [
        'Keep the hands level and the pressure even on both oars.',
        'Set the boat with a light, relaxed grip.',
        'Keep the blades covered at the catch and clean at the release.',
        'Use the legs for power and the hands for control.',
        'Practise balance drills before adding rate.',
      ],
      drills: [
        'Balance drill — sit at the finish with blades off the water.',
        'Feet-out sculling — row with feet out to develop stability.',
        'Square-blade rowing — row with square blades to improve control.',
        'Pause sculling — pause at the catch and finish to check balance.',
      ],
      mistakes: [
        'Gripping the handles too tightly and losing feel.',
        'Letting one hand drop and tilting the boat.',
        'Rushing the recovery and losing balance.',
      ],
      faqs: [
        ['Why does my single feel unstable?', 'Balance improves with relaxed hands, level blades, and patient recovery. Practise balance drills before adding power.'],
        ['How wide should my hands be?', 'About shoulder-width apart, with the handles level and relaxed. Adjust based on boat and rigging.'],
      ],
    },
    {
      slug: 'rowing-sweep-technique',
      title: 'Sweep Rowing Technique: One Oar, Crew Balance (2026)',
      description:
        'Learn sweep rowing technique, including handle control, body position, and working with a crew.',
      summary:
        'Sweep rowing demands one-sided power and crew balance. Rowers must keep the handle level, drive with the legs, and match the crew’s rhythm to keep the boat set.',
      points: [
        'Keep the outside hand on the end of the handle and the inside hand relaxed.',
        'Drive with the legs and keep the trunk stable.',
        'Match the crew’s timing at the catch and finish.',
        'Keep the blade covered and release cleanly.',
        'Use the crew’s rhythm to maintain balance.',
      ],
      drills: [
        'Tank rowing — practise the stroke in a controlled tank.',
        'Legs-only sweep — drive with the legs while the body stays set.',
        'Crew pause drill — pause at the finish as a crew.',
        'Blade-work drill — practise entry and extraction on one side.',
      ],
      mistakes: [
        'Pulling with the inside arm and losing handle control.',
        'Rowing out of sync with the crew.',
        'Letting the boat tilt because the handle is too high or low.',
      ],
      faqs: [
        ['Which hand is the outside hand?', 'The outside hand is the one nearer the blade, at the end of the handle. It controls the blade and the handle height.'],
        ['How do I improve crew timing?', 'Row together at low rates with a coach calling the catch and finish. Consistency matters more than power.'],
      ],
    },
    {
      slug: 'rowing-ergometer',
      title: 'Rowing Ergometer: Technique, Damper, and Workouts (2026)',
      description:
        'Use the rowing ergometer effectively with good technique, sensible damper settings, and structured workouts.',
      summary:
        'The rowing ergometer is a training tool, not a different sport. Good technique, a sensible damper setting, and structured sessions make erg work transfer to the water.',
      points: [
        'Set the damper around 3-5 for most training; higher is not automatically better.',
        'Use the same legs-body-arms sequence as on the water.',
        'Keep the chain moving horizontally and avoid opening the back early.',
        'Train at a range of rates and durations rather than always going hard.',
        'Record splits and rate to track progress.',
      ],
      drills: [
        'Technique session — twenty minutes at low rate with a focus on sequence.',
        'Rate ladder — 18, 20, 22, 24 strokes per minute for four minutes each.',
        'Interval set — six times 500 metres with two minutes recovery.',
        'Steady state — forty minutes at an easy, consistent effort.',
      ],
      mistakes: [
        'Setting the damper to 10 and rowing with poor technique.',
        'Racing every erg session and accumulating fatigue.',
        'Ignoring the recovery ratio and rushing the slide.',
      ],
      faqs: [
        ['What damper setting should I use?', 'Most training is done around 3-5. The best setting depends on the individual, and drag factor is a better guide than the damper number.'],
        ['Is the erg bad for my back?', 'Poor technique can strain the back, but good sequencing and load management make erg work safe for most rowers.'],
      ],
    },
    {
      slug: 'rowing-team-synchronization',
      title: 'Rowing Team Synchronization: Moving as One (2026)',
      description:
        'Improve crew synchronization with shared rhythm, catch timing, and communication in the boat.',
      summary:
        'A synchronized crew moves as one unit. Matching the catch, finish, and recovery rhythm turns individual power into boat speed and reduces wasted energy.',
      points: [
        'Match the catch together rather than entering one by one.',
        'Keep the drive timing consistent across the crew.',
        'Release the blades together and recover in unison.',
        'Use a coxswain or stroke seat to set the rhythm.',
        'Communicate clearly and briefly when adjustments are needed.',
      ],
      drills: [
        'Catch-timing drill — pause at the catch as a crew.',
        'Finish-timing drill — release together and balance.',
        'Rate ladder as a crew — build rate while staying synchronized.',
        'Eyes-closed drill — row a few strokes with eyes closed to feel rhythm.',
      ],
      mistakes: [
        'Rushing the catch individually and disrupting the crew.',
        'Ignoring the stroke seat’s rhythm.',
        'Talking over the coxswain during a technical session.',
      ],
      faqs: [
        ['How do we fix a crew that is out of sync?', 'Slow down and row at a low rate with pauses at the catch and finish. Coordination improves when the rate is low enough to feel.'],
        ['What is the stroke seat’s role?', 'The stroke seat sets the rhythm and technique for the crew to follow.'],
      ],
    },
    {
      slug: 'rowing-coxswain',
      title: 'Rowing Coxswain: Steering, Calls, and Crew Leadership (2026)',
      description:
        'Learn the rowing coxswain role, including steering, safety, race calls, and crew communication.',
      summary:
        'A good coxswain keeps the crew safe, on course, and synchronized. Clear calls, calm steering, and awareness of the crew’s effort make a measurable difference in racing.',
      points: [
        'Steer a straight line and anticipate buoys and obstacles early.',
        'Keep calls short, calm, and specific.',
        'Know the crew’s race plan and pacing.',
        'Monitor safety, weather, and other boats.',
        'Build trust with consistent, honest feedback.',
      ],
      drills: [
        'Steering drill — follow a straight line on calm water.',
        'Call rehearsal — practise race calls on land.',
        'Buoy course — navigate a simple course with turns.',
        'Crew feedback — ask rowers what calls help most.',
      ],
      mistakes: [
        'Over-coaching technique during a race instead of executing the plan.',
        'Steering late and forcing the crew to correct.',
        'Giving vague or panicked calls.',
      ],
      faqs: [
        ['Do coxswains need to be light?', 'Weight matters in racing, but skill, safety, and leadership matter more at most levels.'],
        ['What should a coxswain call?', 'Rate, rhythm, technical cues, race position, and safety information. Keep it short and relevant.'],
      ],
    },
    {
      slug: 'rowing-race-pacing',
      title: 'Rowing Race Pacing: Splits, Starts, and Finishes (2026)',
      description:
        'Plan rowing race pacing with controlled starts, target splits, and a finish that does not fade.',
      summary:
        'Rowing races are won by crews that pace intelligently. A controlled start, consistent middle splits, and a strong finish usually beat an all-out opening that leaves nothing left.',
      points: [
        'Set target splits for each 500-metre segment.',
        'Use a strong but controlled start rather than a sprint.',
        'Settle into race pace and protect technique.',
        'Plan the move for the third quarter when others may fade.',
        'Finish with a controlled lift rather than a desperate rush.',
      ],
      drills: [
        'Split-practice pieces — row 4 x 500 metres at target pace.',
        'Race simulation — row the full distance with splits called.',
        'Negative-split piece — row the second half faster than the first.',
        'Start rehearsal — practise the first 250 metres repeatedly.',
      ],
      mistakes: [
        'Going out too hard and fading in the middle.',
        'Ignoring splits and relying on feel.',
        'Losing technique when the rate rises.',
      ],
      faqs: [
        ['Should I negative split a rowing race?', 'A slight negative split or even pacing is usually effective. Most crews do best when they avoid a fast start and a big fade.'],
        ['How do I practise race pace?', 'Use intervals at or near target split, with full recovery, and rehearse the full race distance periodically.'],
      ],
    },
    {
      slug: 'rowing-rigging',
      title: 'Rowing Rigging: Span, Height, and Pitch Basics (2026)',
      description:
        'Understand basic rowing rigging, including span, oar length, height, and pitch adjustments.',
      summary:
        'Rigging connects the rower to the boat and affects comfort, balance, and power. Small adjustments can make a big difference, but changes should be made one at a time.',
      points: [
        'Measure span and oar length before changing anything.',
        'Set the oarlock height so the handle is comfortable at the finish.',
        'Check blade pitch and gate tightness regularly.',
        'Change one variable at a time and test it on the water.',
        'Keep a rigging log for your boat.',
      ],
      drills: [
        'Rig check — measure span, height, and oar length.',
        'Handle-height test — row and check comfort at the finish.',
        'Pitch review — inspect blades and gates.',
        'Adjust-and-test — make one change and evaluate the feel.',
      ],
      mistakes: [
        'Changing multiple rigging variables at once.',
        'Ignoring worn oarlocks and gates.',
        'Setting the boat up for someone else’s measurements.',
      ],
      faqs: [
        ['What is span?', 'Span is the distance between the oarlocks. It affects leverage and comfort, and it is set relative to the rower’s size.'],
        ['Do I need to adjust my own rigging?', 'Learn the basics with a coach or experienced rower. Random adjustments can make a boat harder to row.'],
      ],
    },
    {
      slug: 'rowing-conditioning',
      title: 'Rowing Conditioning: Endurance, Power, and Recovery (2026)',
      description:
        'Build rowing conditioning with steady-state work, intervals, and strength that supports the rowing stroke.',
      summary:
        'Rowing conditioning blends aerobic endurance and repeated power. Most training should be steady and technique-focused, with a smaller amount of high-intensity work.',
      points: [
        'Build an aerobic base with steady-state rowing.',
        'Add intervals at race pace for specific fitness.',
        'Strengthen the legs and trunk for force production.',
        'Protect the lower back with good technique and load management.',
        'Include recovery days and sleep as part of the plan.',
      ],
      drills: [
        'Steady state — forty to sixty minutes at an easy rate.',
        'Threshold intervals — four times eight minutes with recovery.',
        'Power pieces — ten strokes hard, ten easy, repeated.',
        'Strength circuit — squats, rows, dead bugs, and planks.',
      ],
      mistakes: [
        'Rowing every session at maximum effort.',
        'Neglecting strength work and relying only on the erg.',
        'Ignoring back soreness until it becomes an injury.',
      ],
      faqs: [
        ['How much steady-state rowing is enough?', 'It depends on your goals, but two to three aerobic sessions per week is a good base for most recreational rowers.'],
        ['Can rowing replace strength training?', 'No. Rowing builds endurance and some power, but targeted strength work supports technique and durability.'],
      ],
    },
    {
      slug: 'rowing-strength-training',
      title: 'Rowing Strength Training: Legs, Trunk, and Posterior Chain (2026)',
      description:
        'Build rowing strength with squats, hinges, pulls, and trunk work that transfers to the boat.',
      summary:
        'Rowing strength comes from the legs and trunk. Compound movements that train the posterior chain and pulling pattern support the drive and protect the lower back.',
      points: [
        'Train the squat pattern for leg drive.',
        'Use a hinge for posterior-chain strength.',
        'Include pulling movements for the upper back and arms.',
        'Build trunk stability with anti-extension and anti-rotation work.',
        'Progress loads gradually and avoid training heavy before racing.',
      ],
      drills: [
        'Front squat — three sets of five.',
        'Romanian deadlift — three sets of six.',
        'Cable row or barbell row — three sets of eight.',
        'Dead bug — three sets of ten per side.',
      ],
      mistakes: [
        'Chasing maximum loads and compromising technique.',
        'Neglecting trunk work and relying on the lower back.',
        'Scheduling heavy lifting immediately before a race.',
      ],
      faqs: [
        ['How often should rowers lift?', 'Two sessions per week alongside rowing is a good starting point, adjusted for competition and recovery.'],
        ['Will lifting make me too bulky for rowing?', 'No. Strength work supports power and durability. Bulking depends on nutrition and programming, not lifting alone.'],
      ],
    },
    {
      slug: 'rowing-injury-prevention',
      title: 'Rowing Injury Prevention: Back, Ribs, and Wrists (2026)',
      description:
        'Reduce rowing injuries with better sequencing, load management, and strength work for the back, ribs, and wrists.',
      summary:
        'Rowing injuries often build gradually in the lower back, ribs, and wrists. Good sequencing, gradual load increases, and strength work are the most reliable prevention tools.',
      points: [
        'Keep the back stable and avoid opening it early.',
        'Increase training volume gradually, especially before racing season.',
        'Build trunk and hip strength to support the stroke.',
        'Check handle grip and wrist position to reduce wrist strain.',
        'Treat persistent rib or back pain as a signal to reduce load and seek advice.',
      ],
      drills: [
        'Dead bug — three sets of ten per side.',
        'Bird dog — three sets of eight per side.',
        'Hip hinge — three sets of eight with a neutral spine.',
        'Wrist mobility — gentle circles and stretches before rowing.',
      ],
      mistakes: [
        'Rowing through rib pain because it is not yet severe.',
        'Adding hard intervals without building an aerobic base.',
        'Gripping the handle too tightly and straining the wrists.',
      ],
      faqs: [
        ['What causes rib pain in rowers?', 'Repeated force through the rib cage can cause stress injuries, especially with rapid increases in volume or intensity. Seek medical advice for persistent pain.'],
        ['How do I protect my lower back?', 'Maintain a stable trunk, avoid opening the back early, and build strength with hinges and trunk exercises.'],
      ],
    },
    {
      slug: 'rowing-blister-prevention',
      title: 'Rowing Blister Prevention: Hand Care and Grip (2026)',
      description:
        'Prevent and manage rowing blisters with better grip technique, hand care, and taping routines.',
      summary:
        'Blisters are common in rowing but often preventable. A relaxed grip, consistent hand care, and early taping keep hands comfortable and reduce time off the water.',
      points: [
        'Grip the handle in the fingers rather than crushing it with the palm.',
        'Keep the grip relaxed except during the drive.',
        'Dry the hands and handle before rowing.',
        'Tape hot spots early rather than waiting for a blister.',
        'Let blisters heal before returning to high-volume sessions.',
      ],
      drills: [
        'Grip check — row at low rate and notice hand tension.',
        'Tape routine — practise applying tape before a session.',
        'Hand-care routine — clean, moisturise, and inspect after rowing.',
        'Volume progression — build calluses gradually.',
      ],
      mistakes: [
        'Gripping too tightly and creating unnecessary friction.',
        'Popping a blister and continuing to row.',
        'Using worn or slippery handle grips.',
      ],
      faqs: [
        ['Should I wear gloves?', 'Most rowers do not, because gloves can reduce feel. Taping hot spots is usually more effective.'],
        ['How long do blisters take to heal?', 'Minor blisters often settle in a few days, but high-volume rowing may need to be reduced. Keep the area clean.'],
      ],
    },
    {
      slug: 'rowing-youth-development',
      title: 'Rowing Youth Development: Technique Before Volume (2026)',
      description:
        'A youth rowing development approach that prioritises technique, safety, and enjoyment before high-volume training.',
      summary:
        'Young rowers develop best with good technique, broad athleticism, and gradual volume. Heavy erg scores should never come at the expense of movement quality or enjoyment.',
      points: [
        'Teach the stroke sequence before adding rate or load.',
        'Build general athleticism with running, jumping, and strength work.',
        'Keep erg volume moderate and age-appropriate.',
        'Prioritise safety and water confidence.',
        'Celebrate technique and teamwork, not only scores.',
      ],
      drills: [
        'Technique erg — ten minutes at low rate with a coach.',
        'Balance drill — scull in a stable single.',
        'Athletic circuit — squats, rows, planks, and short runs.',
        'Team relay — rowing games that reinforce rhythm.',
      ],
      mistakes: [
        'Pushing young rowers into high-volume erg training too early.',
        'Neglecting technique in favour of scores.',
        'Ignoring safety cover and water confidence.',
      ],
      faqs: [
        ['When should young rowers start erg training?', 'Follow club and coaching guidance. Technique and enjoyment come first, and volume should be age-appropriate.'],
        ['Should youth rowers lift weights?', 'Supervised strength work with bodyweight and light loads can be appropriate, but technique and growth considerations come first.'],
      ],
    },
    {
      slug: 'rowing-regatta-preparation',
      title: 'Rowing Regatta Preparation: Taper, Crew, and Logistics (2026)',
      description:
        'Prepare for a rowing regatta with a sensible taper, crew rehearsal, and race-day logistics.',
      summary:
        'Regatta preparation is about arriving fresh and organised. A short taper, final crew rehearsals, and a clear race plan reduce surprises on the day.',
      points: [
        'Reduce volume in the final week while keeping short race-pace pieces.',
        'Rehearse the start and race plan as a crew.',
        'Check boat, oars, and rigging before travelling.',
        'Plan food, water, and shelter for a long day at the venue.',
        'Keep the warm-up and race routine consistent.',
      ],
      drills: [
        'Start rehearsal — practise the first 250 metres.',
        'Race-pace pieces — short efforts at target split.',
        'Crew meeting — review the race plan and roles.',
        'Boat check — inspect hull, rigging, and safety equipment.',
      ],
      mistakes: [
        'Training hard in the days before the regatta.',
        'Changing the crew line-up or rigging at the last minute.',
        'Ignoring weather and water conditions in the race plan.',
      ],
      faqs: [
        ['How long should a regatta taper be?', 'Five to seven days of reduced volume works for most crews. Keep some race-pace work so the rhythm stays sharp.'],
        ['What should I bring to a regatta?', 'Water, snacks, sun protection, spare clothing, tools, and any required safety equipment.'],
      ],
    },
  ],
};

export default category;
