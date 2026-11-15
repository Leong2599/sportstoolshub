const category = {
  key: 'fencing',
  label: 'Fencing',
  venue: 'a fencing salle, gym, or competition piste with proper equipment checks',
  demand:
    'explosive lunges, rapid changes of direction, sustained low stances, and split-second decision-making under fatigue',
  equipment: [
    'Fencing mask',
    'Jacket and breeches',
    'Glove',
    'Weapon (foil, epee, or sabre)',
    'Lame or conductive jacket',
    'Chest protector',
  ],
  injuries: ['ankle sprain', 'wrist strain', 'knee pain', 'lower-back strain'],
  terms: [
    ['En garde', 'The starting stance from which fencing actions begin.'],
    ['Lunge', 'An attacking step forward with the front leg and extended arm.'],
    ['Parry', 'A defensive blade action that deflects an opponent’s attack.'],
    ['Riposte', 'An immediate counter-attack after a successful parry.'],
  ],
  tools: [
    { label: 'Heart Rate Calculator', slug: 'heart-rate-calculator' },
    { label: 'Training Load Calculator', slug: 'training-load-calculator' },
    { label: 'Injury Risk Calculator', slug: 'injury-risk-calculator' },
  ],
  posts: [
    {
      slug: 'fencing-beginner-basics',
      title: 'Fencing for Beginners: Weapons, Stance, and First Actions (2026)',
      description:
        'Start fencing with a beginner guide to the three weapons, en garde stance, footwork, and basic attacks.',
      summary:
        'Fencing beginners should learn one weapon, the en garde stance, and simple footwork before chasing complex blade actions. Clear fundamentals make the sport safer and much easier to learn.',
      points: [
        'Choose one weapon to start: foil, epee, or sabre.',
        'Learn the en garde stance with balanced weight and a relaxed weapon hand.',
        'Practise advance and retreat before adding attacks.',
        'Learn the basic lunge with a straight arm and controlled landing.',
        'Always wear the required protective equipment.',
      ],
      drills: [
        'Stance check — hold en garde for thirty seconds and review alignment.',
        'Advance-retreat — move up and down the piste with controlled steps.',
        'Lunge walk-through — rehearse the lunge without a weapon.',
        'Target practice — hit a simple target with a straight attack.',
      ],
      mistakes: [
        'Standing too upright and losing the ability to move quickly.',
        'Bending the weapon arm too early in the attack.',
        'Skipping protective equipment because the drill is light.',
      ],
      faqs: [
        ['Which weapon should a beginner choose?', 'Foil is often recommended for learning technique and priority, epee for simplicity of target, and sabre for speed. Try each before deciding.'],
        ['How long does it take to learn the basics?', 'Most beginners learn the stance, footwork, and simple attacks within a few lessons. Competence takes consistent practice.'],
      ],
    },
    {
      slug: 'fencing-en-garde',
      title: 'Fencing En Garde Stance: Balance and Readiness (2026)',
      description:
        'Build a balanced fencing en garde stance with correct foot placement, weight distribution, and weapon-arm position.',
      summary:
        'The en garde stance is the platform for every fencing action. A balanced base, relaxed shoulders, and a ready weapon arm let you attack, defend, and move without telegraphing.',
      points: [
        'Place the feet about shoulder-width apart with the front foot forward.',
        'Bend both knees and keep the weight centred between the feet.',
        'Turn the torso slightly to present a smaller target.',
        'Hold the weapon arm relaxed with the point toward the opponent.',
        'Keep the free arm back for balance without tension.',
      ],
      drills: [
        'Static hold — hold en garde for thirty seconds and check alignment.',
        'Weight-shift drill — shift weight forward and back without moving the feet.',
        'Mirror check — use a mirror to review the stance from the side.',
        'Stance-to-lunge — move from en garde into a lunge and return.',
      ],
      mistakes: [
        'Standing with straight legs and losing mobility.',
        'Leaning too far forward and becoming off balance.',
        'Tensing the weapon arm and telegraphing the attack.',
      ],
      faqs: [
        ['How far apart should my feet be?', 'Roughly shoulder-width, with enough depth to lunge and recover comfortably. A coach can adjust based on your weapon and style.'],
        ['Should my weight be on the front foot?', 'Keep it centred or slightly forward, but not so far that you cannot retreat quickly.'],
      ],
    },
    {
      slug: 'fencing-footwork',
      title: 'Fencing Footwork: Advances, Retreats, and Distance (2026)',
      description:
        'Improve fencing footwork with controlled advances, retreats, and distance management on the piste.',
      summary:
        'Fencing is often decided by distance and footwork. Smooth advances, quick retreats, and the ability to control the distance make attacks safer and defences more effective.',
      points: [
        'Move the front foot first on an advance and the back foot first on a retreat.',
        'Keep the feet close to the ground and the stance stable.',
        'Maintain the same distance between the feet during movement.',
        'Use small steps to control distance rather than large lunges.',
        'Watch the opponent’s feet and weapon to anticipate their action.',
      ],
      drills: [
        'Advance-retreat ladder — move up and down the piste with clean steps.',
        'Distance game — maintain a set distance from a partner.',
        'Step-and-lunge — advance, then lunge and recover.',
        'Footwork mirror — mirror a partner’s movement without crossing the feet.',
      ],
      mistakes: [
        'Crossing the feet and losing balance.',
        'Taking large steps that leave you unable to react.',
        'Bouncing too high and wasting energy.',
      ],
      faqs: [
        ['How do I improve my footwork?', 'Practise small, controlled steps and distance drills. Footwork improves with repetition and coaching feedback.'],
        ['Why is distance so important?', 'Distance determines whether an attack can land and whether a defence has time to react. Controlling it is a core fencing skill.'],
      ],
    },
    {
      slug: 'fencing-lunge',
      title: 'The Fencing Lunge: Power, Reach, and Recovery (2026)',
      description:
        'Learn a powerful fencing lunge with correct extension, landing, and recovery back to en garde.',
      summary:
        'The lunge is the primary attacking action in fencing. A straight weapon arm, a strong front-leg drive, and a controlled landing produce reach and power without losing balance.',
      points: [
        'Extend the weapon arm before or as the front leg drives forward.',
        'Push from the back leg and land on the front heel first.',
        'Keep the front knee over the foot and the back leg extended.',
        'Do not let the torso collapse forward at full extension.',
        'Recover by pulling the front foot back and returning to en garde.',
      ],
      drills: [
        'Lunge in place — rehearse the footwork without a weapon.',
        'Lunge-to-target — hit a static target at varying distances.',
        'Recovery drill — lunge and recover repeatedly with clean footwork.',
        'Lunge from advance — add an advance before the lunge.',
      ],
      mistakes: [
        'Landing flat-footed and losing the ability to recover.',
        'Dropping the weapon arm and losing reach.',
        'Over-lunging and becoming easy to counter-attack.',
      ],
      faqs: [
        ['How far should I lunge?', 'Far enough to reach the target without overextending or losing balance. Distance should be judged from footwork, not guessed.'],
        ['Why do I lose balance after the lunge?', 'You may be landing too far forward or letting the torso collapse. Keep the front knee over the foot and the chest upright.'],
      ],
    },
    {
      slug: 'fencing-advance-retreat',
      title: 'Fencing Advances and Retreats: Rhythm and Control (2026)',
      description:
        'Refine fencing advances and retreats with rhythm, small steps, and the ability to change direction quickly.',
      summary:
        'Advances and retreats are the rhythm section of fencing. Small, controlled steps and the ability to change direction keep you in range without exposing yourself.',
      points: [
        'Keep steps small and the stance consistent.',
        'Maintain a low centre of gravity for quick changes of direction.',
        'Avoid bouncing or crossing the feet.',
        'Use rhythm changes to disrupt the opponent’s timing.',
        'Stay balanced so you can attack or retreat on any step.',
      ],
      drills: [
        'Step-count drill — advance three, retreat three, keeping the same distance.',
        'Rhythm change — alternate slow and fast steps.',
        'Reaction step — retreat or advance on a partner’s cue.',
        'Piste lengths — travel the piste with controlled steps.',
      ],
      mistakes: [
        'Taking big steps and losing control.',
        'Leaning forward on the advance and backward on the retreat.',
        'Stopping the feet and getting caught flat-footed.',
      ],
      faqs: [
        ['Why do small steps matter?', 'Small steps keep you balanced and able to change direction quickly. Large steps commit you to one movement.'],
        ['How do I change rhythm?', 'Vary the speed and size of your steps while keeping the stance stable. Rhythm changes make your actions harder to predict.'],
      ],
    },
    {
      slug: 'fencing-foil-basics',
      title: 'Foil Fencing Basics: Target, Priority, and Technique (2026)',
      description:
        'Learn foil fencing fundamentals, including the valid target, right of way, and basic attacks and parries.',
      summary:
        'Foil fencing uses a small valid target and the concept of priority. Understanding right of way and controlling the blade are more important than raw speed.',
      points: [
        'The valid target in foil is the torso, including the back and groin, but not the arms or legs.',
        'Establish priority by threatening the opponent’s target with a straight arm.',
        'Use the blade to deflect attacks and create opportunities for ripostes.',
        'Keep the non-weapon arm back and out of the target area.',
        'Practise simple attacks and parries before complex combinations.',
      ],
      drills: [
        'Target drill — hit the valid torso area on a partner or dummy.',
        'Priority walk-through — practise establishing priority with a straight attack.',
        'Parry-riposte — defend a simple attack and counter.',
        'Blade-control drill — move the opponent’s blade with small circles.',
      ],
      mistakes: [
        'Attacking the arms or legs, which are off-target in foil.',
        'Dropping the weapon arm and losing priority.',
        'Using complex blade actions before the basics are reliable.',
      ],
      faqs: [
        ['What is right of way in foil?', 'Right of way, or priority, determines who scores when both fencers hit. The attacker who establishes priority generally receives the point if the action is simultaneous.'],
        ['Is foil good for beginners?', 'Yes. Foil teaches distance, blade control, and priority, which transfer well to other weapons.'],
      ],
    },
    {
      slug: 'fencing-epee-basics',
      title: 'Epee Fencing Basics: Full Target and Timing (2026)',
      description:
        'Learn epee fencing fundamentals, including the full-body target, absence of priority, and timing-based defence.',
      summary:
        'Epee fencing targets the entire body and has no priority rules, so simultaneous hits are common. Patience, distance control, and precise timing matter more than complex blade work.',
      points: [
        'The entire body is valid target, including the arms, legs, and mask.',
        'There is no priority; if both fencers hit, both score.',
        'Control distance carefully to avoid counter-attacks.',
        'Use the point precisely rather than relying on blade strength.',
        'Be patient and look for a clear opening.',
      ],
      drills: [
        'Point-control drill — hit small targets on a dummy.',
        'Distance game — maintain a safe distance from a partner.',
        'Counter-attack drill — practise hitting an opponent’s advance.',
        'Footwork-and-hit — combine footwork with a precise attack.',
      ],
      mistakes: [
        'Attacking from too far away and getting counter-attacked.',
        'Neglecting the hand and arm as targets.',
        'Rushing into simultaneous hits without a plan.',
      ],
      faqs: [
        ['Why are simultaneous hits common in epee?', 'Because there is no priority rule. If both fencers hit within the scoring window, both receive a point.'],
        ['What is the key skill in epee?', 'Distance control and timing. Epee rewards patience and precision more than speed alone.'],
      ],
    },
    {
      slug: 'fencing-sabre-basics',
      title: 'Sabre Fencing Basics: Speed, Cut, and Priority (2026)',
      description:
        'Learn sabre fencing fundamentals, including the target area, priority, and fast cut attacks.',
      summary:
        'Sabre is the fastest fencing weapon, with a target above the waist and priority rules. Quick footwork, a clear attack, and composure under speed are essential.',
      points: [
        'The valid target in sabre is above the waist, including the arms and head.',
        'Establish priority with a forward action and a threatening blade.',
        'Use cuts and thrusts to score, keeping the blade moving.',
        'Keep the non-weapon arm back and out of target.',
        'Practise fast footwork and simple attacks before complex actions.',
      ],
      drills: [
        'Cut drill — practise diagonal and horizontal cuts on a target.',
        'Priority drill — establish priority with a forward step and attack.',
        'Fast footwork — short advances and retreats at speed.',
        'Parry-riposte — defend a cut and counter quickly.',
      ],
      mistakes: [
        'Lifting the blade too high and losing priority.',
        'Attacking from too far away and getting parried.',
        'Letting the free arm drift into the target area.',
      ],
      faqs: [
        ['Is sabre the fastest weapon?', 'Yes, sabre bouts tend to be the fastest because of the shorter target and the priority rules that reward quick attacks.'],
        ['What is the target area in sabre?', 'Everything above the waist, including the head and arms, but not the hands below the wrist.'],
      ],
    },
    {
      slug: 'fencing-parry-riposte',
      title: 'Fencing Parry-Riposte: Defence Into Attack (2026)',
      description:
        'Build reliable parry-riposte actions with correct blade position, timing, and immediate counter-attack.',
      summary:
        'The parry-riposte turns defence into attack. A compact parry that controls the opponent’s blade creates the chance to riposte before they can recover.',
      points: [
        'Keep the parry compact and close to the body.',
        'Meet the opponent’s blade with the strong part of your blade.',
        'Riposte immediately after the parry without resetting.',
        'Maintain distance so the riposte can land.',
        'Practise both simple and circular parries.',
      ],
      drills: [
        'Parry-only drill — defend a slow attack and hold the parry.',
        'Parry-riposte — defend and counter in one motion.',
        'Blade-contact drill — move the opponent’s blade with control.',
        'Reaction drill — parry on a partner’s cue.',
      ],
      mistakes: [
        'Making a large parry that opens the target.',
        'Waiting too long to riposte after the parry.',
        'Using the wrong part of the blade to deflect the attack.',
      ],
      faqs: [
        ['What is the difference between a parry and a riposte?', 'A parry deflects the opponent’s attack; a riposte is the counter-attack that follows immediately.'],
        ['Which parries should beginners learn?', 'Start with simple lateral parries and one circular parry, then expand as your blade control improves.'],
      ],
    },
    {
      slug: 'fencing-attacks',
      title: 'Fencing Attacks: Simple, Compound, and Preparations (2026)',
      description:
        'Learn fencing attack types, including simple attacks, compound attacks, and the preparations that set them up.',
      summary:
        'Fencing attacks range from a direct lunge to multi-action compound attacks. Good attacks start with a preparation that creates an opening and finish with a committed, balanced action.',
      points: [
        'Use a simple attack when the opponent’s blade is out of the way.',
        'Set up compound attacks with a feint or blade movement.',
        'Commit to the final action with a straight arm and strong footwork.',
        'Keep the attack balanced so you can recover if it fails.',
        'Choose the attack based on distance and the opponent’s habits.',
      ],
      drills: [
        'Simple attack — lunge to a static target with a straight arm.',
        'Feint-and-attack — feint to one line and attack another.',
        'Blade-take attack — take the opponent’s blade and attack.',
        'Attack from advance — combine footwork with the final action.',
      ],
      mistakes: [
        'Attacking from out of distance and falling short.',
        'Telegraphing the attack with a bent arm or early foot movement.',
        'Overcommitting and losing balance after the attack.',
      ],
      faqs: [
        ['What is a compound attack?', 'An attack with more than one action, such as a feint followed by a second intention. It is used to draw a reaction and create an opening.'],
        ['When should I attack?', 'Attack when you have distance, priority, and a clear opening. Attacking from poor distance gives the opponent an easy parry.'],
      ],
    },
    {
      slug: 'fencing-defensive-distance',
      title: 'Fencing Defensive Distance: Avoiding the Attack (2026)',
      description:
        'Use distance as a defensive tool in fencing, stepping out of range and creating counter-attack opportunities.',
      summary:
        'Distance is the first defence in fencing. Retreating out of range forces the opponent to fall short, creating chances to counter-attack or take over the attack.',
      points: [
        'Keep enough distance to retreat from an attack.',
        'Watch the opponent’s front foot and arm for cues.',
        'Retreat in balance so you can counter immediately.',
        'Use a half-step or check-step to disrupt timing.',
        'Combine distance with blade actions rather than relying on one alone.',
      ],
      drills: [
        'Distance drill — retreat from a partner’s attack and stay in balance.',
        'Fall-short drill — draw an attack and counter after it misses.',
        'Step-back-and-hit — retreat and counter-attack in one sequence.',
        'Mirror distance — maintain a set distance from a moving partner.',
      ],
      mistakes: [
        'Retreating too far and giving up the piste.',
        'Leaning backward and losing the ability to counter.',
        'Watching the blade instead of the opponent’s feet and body.',
      ],
      faqs: [
        ['How much piste should I give up?', 'Only as much as needed to make the attack fall short. Giving up too much can put you near the back line.'],
        ['What is a check step?', 'A small backward step used to disrupt the opponent’s timing and create distance while staying ready to counter.'],
      ],
    },
    {
      slug: 'fencing-point-control',
      title: 'Fencing Point Control: Precision and Blade Feel (2026)',
      description:
        'Develop fencing point control with grip pressure, wrist movement, and drills that improve accuracy.',
      summary:
        'Point control is the ability to place the tip exactly where you intend. A relaxed grip, small wrist movements, and repeated target practice build the precision fencing demands.',
      points: [
        'Hold the weapon with a relaxed grip and use the fingers to guide the point.',
        'Make small movements with the wrist rather than the whole arm.',
        'Keep the point moving toward the target rather than dropping.',
        'Practise hitting small targets to build accuracy.',
        'Avoid gripping too tightly, which reduces feel.',
      ],
      drills: [
        'Target dots — hit small dots on a wall or dummy.',
        'Circle drill — move the point in small circles with control.',
        'Partner target — hit a moving target on a partner’s glove.',
        'Blind-feel drill — practise slow blade movements to develop feel.',
      ],
      mistakes: [
        'Gripping hard and losing fine control.',
        'Using the whole arm for small corrections.',
        'Practising only at full speed and neglecting accuracy.',
      ],
      faqs: [
        ['How do I improve point control?', 'Slow, accurate repetitions to small targets. Precision improves with deliberate practice, not just hard sparring.'],
        ['Does grip strength matter?', 'A relaxed grip with finger control matters more than raw strength. Excessive tension reduces feel.'],
      ],
    },
    {
      slug: 'fencing-blade-work',
      title: 'Fencing Blade Work: Engagements and Takes (2026)',
      description:
        'Learn fencing blade work, including engagements, beats, and blade takes that create openings.',
      summary:
        'Blade work is about controlling the opponent’s weapon. Engagements, beats, and takes can disrupt their plan and create the opening for an attack.',
      points: [
        'Engage the opponent’s blade to feel their pressure and intention.',
        'Use a beat to knock the blade aside and attack immediately.',
        'Take the blade with a controlled movement rather than a wild swing.',
        'Keep your own blade position stable after the action.',
        'Use blade work to set up an attack, not as an end in itself.',
      ],
      drills: [
        'Engagement drill — engage and disengage with a partner.',
        'Beat attack — beat the blade and lunge to target.',
        'Blade take — take the blade and attack in one motion.',
        'Blade-control game — try to control the partner’s blade at slow speed.',
      ],
      mistakes: [
        'Making large, slow blade movements that telegraph the action.',
        'Losing the line after the blade action.',
        'Using blade work from out of distance.',
      ],
      faqs: [
        ['What is a beat?', 'A beat is a sharp, brief contact with the opponent’s blade to knock it aside and create an opening.'],
        ['What is a blade take?', 'A blade take is a controlled action that captures the opponent’s blade and moves it out of line, opening the target.'],
      ],
    },
    {
      slug: 'fencing-tactics',
      title: 'Fencing Tactics: Reading Opponents and Building a Plan (2026)',
      description:
        'Build a fencing tactical plan by reading opponents, managing distance, and choosing actions with purpose.',
      summary:
        'Fencing tactics turn technique into points. Reading the opponent’s habits, controlling distance, and choosing actions with a purpose make you harder to solve.',
      points: [
        'Observe the opponent’s footwork, blade habits, and preferred distance.',
        'Start with simple actions and adjust based on their responses.',
        'Use distance to bait attacks and create counter opportunities.',
        'Change rhythm and target to prevent them from settling.',
        'Review each bout for patterns rather than only the score.',
      ],
      drills: [
        'Observation bout — watch a partner and note three habits.',
        'Distance baiting — draw an attack and counter.',
        'Action-reaction game — choose an action based on the partner’s cue.',
        'Bout review — discuss tactics after a practice bout.',
      ],
      mistakes: [
        'Repeating the same attack after it stops working.',
        'Ignoring the opponent’s strengths and attacking into them.',
        'Changing tactics randomly instead of based on evidence.',
      ],
      faqs: [
        ['How do I read an opponent quickly?', 'Watch their feet, blade, and rhythm in the first exchanges. Most fencers reveal habits within a few actions.'],
        ['What if my plan is not working?', 'Change one variable at a time: distance, rhythm, or target. Random changes make it harder to learn what works.'],
      ],
    },
    {
      slug: 'fencing-competition-preparation',
      title: 'Fencing Competition Preparation: Warm-Up and Match Plan (2026)',
      description:
        'Prepare for fencing competitions with a reliable warm-up, equipment checks, and a simple bout plan.',
      summary:
        'Fencing competition preparation is about arriving ready to move and think clearly. A consistent warm-up, checked equipment, and a short tactical plan reduce avoidable errors.',
      points: [
        'Warm up the legs, wrists, and shoulders before the first bout.',
        'Check weapons, body cords, and protective equipment before travelling.',
        'Write a simple plan with two priorities for the day.',
        'Use between-bout time to recover and review patterns.',
        'Keep nutrition and hydration consistent.',
      ],
      drills: [
        'Fencing warm-up — footwork, lunges, and blade work for ten minutes.',
        'Equipment check — test weapons and cords.',
        'Bout simulation — fence a short practice bout at competition intensity.',
        'Between-bout routine — practise a short reset and review.',
      ],
      mistakes: [
        'Starting the first bout cold.',
        'Discovering faulty equipment at the venue.',
        'Overthinking tactics between bouts instead of recovering.',
      ],
      faqs: [
        ['How long should a fencing warm-up be?', 'Fifteen to twenty minutes of footwork, lunges, and blade work is typical, finishing close to the first bout.'],
        ['What should I bring to a competition?', 'At least two weapons, spare body cords, protective gear, water, snacks, and a simple repair kit.'],
      ],
    },
    {
      slug: 'fencing-conditioning',
      title: 'Fencing Conditioning: Legs, Lunge Power, and Agility (2026)',
      description:
        'Build fencing conditioning with leg strength, lunge power, agility, and repeated high-intensity efforts.',
      summary:
        'Fencing conditioning supports explosive lunges and repeated bouts. Leg strength, agility, and short high-intensity intervals matter more than long-distance endurance.',
      points: [
        'Build leg strength with lunges, squats, and split squats.',
        'Train short bursts of movement that match bout demands.',
        'Include lateral agility and change-of-direction work.',
        'Strengthen the trunk to support the lunge and recover.',
        'Allow recovery between high-intensity sessions.',
      ],
      drills: [
        'Walking lunge — three sets of ten per leg.',
        'Lateral shuffle — four sets of twenty seconds.',
        'Lunge-and-recover — ten repetitions with full recovery.',
        'Short shuttle — six 10-metre shuttles with rest.',
      ],
      mistakes: [
        'Running long distances and neglecting explosive work.',
        'Adding conditioning during a competition week.',
        'Neglecting trunk and hip strength.',
      ],
      faqs: [
        ['How often should fencers condition?', 'Two sessions per week alongside fencing practice is a good base for most club fencers.'],
        ['Is cardio important in fencing?', 'Yes, but it should be sport-specific. Short, repeated high-intensity efforts are more relevant than long steady runs.'],
      ],
    },
    {
      slug: 'fencing-flexibility',
      title: 'Fencing Flexibility: Hips, Ankles, and Lunge Range (2026)',
      description:
        'Improve fencing flexibility with hip mobility, ankle range, and dynamic warm-up routines that support the lunge.',
      summary:
        'Fencing demands hip and ankle range for a deep, stable lunge. Dynamic mobility before training and gentle stretching after support performance and reduce strain.',
      points: [
        'Warm up with dynamic hip and ankle mobility.',
        'Include hip-flexor and hamstring work after training.',
        'Build ankle range gradually to support the lunge.',
        'Avoid forcing a deeper lunge than your mobility allows.',
        'Use consistency rather than long, occasional stretching sessions.',
      ],
      drills: [
        'Hip circles — ten per direction.',
        'Walking lunge with rotation — ten per side.',
        'Ankle rocks — ten per side.',
        'Hamstring stretch — three holds of thirty seconds after training.',
      ],
      mistakes: [
        'Forcing a deep lunge and straining the hip or knee.',
        'Stretching cold before explosive work.',
        'Ignoring ankle mobility and compensating with the lower back.',
      ],
      faqs: [
        ['Does flexibility affect lunge distance?', 'Yes. Hip and ankle range help you lunge deeper without losing balance or straining tissue.'],
        ['Should I stretch before fencing?', 'Use dynamic mobility before fencing and save static stretching for after training or separate sessions.'],
      ],
    },
    {
      slug: 'fencing-injury-prevention',
      title: 'Fencing Injury Prevention: Ankles, Wrists, and Knees (2026)',
      description:
        'Reduce fencing injuries with ankle stability, wrist care, knee-friendly lunges, and load management.',
      summary:
        'Fencing injuries often involve the ankle, wrist, or knee. Strength work, good lunge mechanics, and gradual increases in training volume keep fencers available to train.',
      points: [
        'Build ankle stability with balance and hopping exercises.',
        'Strengthen the wrist and forearm with controlled resistance work.',
        'Keep the front knee tracking over the foot in the lunge.',
        'Increase fencing volume gradually, especially before competitions.',
        'Wear proper protective equipment and check it regularly.',
      ],
      drills: [
        'Single-leg balance — thirty seconds per side.',
        'Wrist curls and extensions — three sets of twelve.',
        'Lateral hop-and-stick — five hops per side.',
        'Lunge form check — film and review knee alignment.',
      ],
      mistakes: [
        'Lunging with the knee collapsing inward.',
        'Ignoring wrist pain from repeated blade work.',
        'Fencing hard multiple days in a row without recovery.',
      ],
      faqs: [
        ['What is the most common fencing injury?', 'Ankle sprains and lower-limb strains are common, often from footwork and lunging. Wrist and elbow issues also occur from repeated blade work.'],
        ['How do I protect my knees?', 'Keep the front knee over the foot, build leg strength, and avoid sudden increases in volume.'],
      ],
    },
    {
      slug: 'fencing-equipment-guide',
      title: 'Fencing Equipment Guide: Mask, Jacket, and Weapon (2026)',
      description:
        'Choose fencing equipment that fits, protects, and meets competition standards, from mask to weapon.',
      summary:
        'Fencing equipment must protect and fit properly. A well-fitted mask, jacket, glove, and weapon are essential for safety, and competition standards vary by weapon and level.',
      points: [
        'Choose a mask that fits snugly and has no damage.',
        'Wear a jacket and breeches that meet the required safety standard.',
        'Use a glove that fits without restricting finger movement.',
        'Check weapon and body-cord condition regularly.',
        'Follow competition equipment rules for your weapon and age group.',
      ],
      drills: [
        'Fit check — wear all equipment and test movement.',
        'Equipment inspection — check mask mesh, seams, and cords.',
        'Weapon test — verify tip and body-cord function.',
        'Storage routine — dry and store equipment properly after use.',
      ],
      mistakes: [
        'Using a damaged mask or jacket.',
        'Buying equipment that does not meet competition standards.',
        'Neglecting body cords until they fail at a competition.',
      ],
      faqs: [
        ['How often should I replace a fencing mask?', 'Replace it when the mesh is damaged or the fit deteriorates. Inspect it regularly and follow manufacturer guidance.'],
        ['Can I fence in ordinary sports clothing?', 'No. Fencing requires specialised protective clothing that meets safety standards.'],
      ],
    },
    {
      slug: 'fencing-youth-development',
      title: 'Fencing Youth Development: Fun, Footwork, and Fundamentals (2026)',
      description:
        'A youth fencing development approach that builds footwork, blade control, and enjoyment before competition pressure.',
      summary:
        'Young fencers develop best with games, good footwork, and broad athletic movement. Early competition should support learning rather than replace it.',
      points: [
        'Build footwork and balance through games.',
        'Teach simple blade actions before complex tactics.',
        'Keep sessions varied and enjoyable.',
        'Use age-appropriate equipment and supervision.',
        'Praise effort and decision-making, not only wins.',
      ],
      drills: [
        'Footwork tag — a game that reinforces advancing and retreating.',
        'Target game — hit safe targets for points.',
        'Balance circuit — single-leg stands and hops.',
        'Mini-bouts — short practice bouts with simple rules.',
      ],
      mistakes: [
        'Pushing children into competition before they are ready.',
        'Focusing only on winning and neglecting technique.',
        'Using adult training volumes for young fencers.',
      ],
      faqs: [
        ['When can children start fencing?', 'Many clubs accept children around age seven to nine, depending on the programme and equipment.'],
        ['Is fencing safe for children?', 'With proper equipment, supervision, and progression, fencing is a relatively safe sport for young athletes.'],
      ],
    },
  ],
};

export default category;
