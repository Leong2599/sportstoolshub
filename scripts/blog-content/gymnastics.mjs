const category = {
  key: 'gymnastics',
  label: 'Gymnastics',
  venue: 'a gymnastics gym with mats, apparatus, and qualified spotting support',
  demand:
    'high levels of relative strength, shoulder and wrist loading, flexibility, and precise body control under speed and rotation',
  equipment: [
    'Chalk',
    'Grips',
    'Wrist supports',
    'Crash mats',
    'Balance beam',
    'Resistance bands',
  ],
  injuries: ['wrist sprain', 'ankle sprain', 'shoulder impingement', 'lower-back strain'],
  terms: [
    ['Shape', 'The body position used in a skill, such as hollow, arch, or tuck.'],
    ['Amplitude', 'The height, distance, or range of a skill or swing.'],
    ['Spot', 'Physical assistance from a coach to support or guide a skill.'],
    ['Routine', 'A choreographed sequence of skills performed on an apparatus.'],
  ],
  tools: [
    { label: 'One-Rep Max Calculator', slug: 'one-rep-max-calculator' },
    { label: 'Body Fat Calculator', slug: 'body-fat-calculator' },
    { label: 'Injury Risk Calculator', slug: 'injury-risk-calculator' },
  ],
  posts: [
    {
      slug: 'gymnastics-beginner-basics',
      title: 'Gymnastics for Beginners: Shapes, Safety, and First Skills (2026)',
      description:
        'Start gymnastics with a beginner guide to body shapes, safe progressions, and the first floor skills.',
      summary:
        'Gymnastics beginners should learn body shapes and safe falling before tumbling. Good shapes, patient progressions, and qualified spotting make every later skill easier and safer.',
      points: [
        'Learn the hollow, arch, and tuck shapes before attempting rotations.',
        'Practise safe landings and falling with bent knees.',
        'Master forward and backward rolls on a mat before adding height.',
        'Use a coach for spotting on any inverted or aerial skill.',
        'Build wrist and shoulder strength gradually.',
      ],
      drills: [
        'Shape holds — hollow and arch holds for ten seconds.',
        'Forward roll — roll on a mat with a tucked chin.',
        'Backward roll — roll with hands ready to support.',
        'Landing practice — jump and stick on a soft mat.',
      ],
      mistakes: [
        'Attempting skills beyond your level without a spot.',
        'Skipping body shapes and relying on momentum.',
        'Landing stiff-legged and risking an ankle or knee injury.',
      ],
      faqs: [
        ['How old should children start gymnastics?', 'Many programmes start around age three to five with playful movement, and formal skills build gradually after that.'],
        ['Do I need a coach for the basics?', 'A coach is strongly recommended for safe progressions and spotting, especially for inverted skills.'],
      ],
    },
    {
      slug: 'gymnastics-body-shapes',
      title: 'Gymnastics Body Shapes: Hollow, Arch, and Tuck (2026)',
      description:
        'Learn the foundational gymnastics body shapes and how they transfer to rolls, swings, and tumbling.',
      summary:
        'Body shapes are the alphabet of gymnastics. A tight hollow, a controlled arch, and a compact tuck give every skill its structure and make movement predictable.',
      points: [
        'In a hollow, press the lower back into the floor and keep the ribs down.',
        'In an arch, lift the chest and legs while keeping the shoulders controlled.',
        'In a tuck, pull the knees to the chest and round the spine.',
        'Practise shapes slowly before adding speed or rotation.',
        'Use a mirror or video to check alignment.',
      ],
      drills: [
        'Hollow hold — ten to twenty seconds on the floor.',
        'Arch hold — ten seconds with the arms overhead.',
        'Tuck hold — hold a tight tuck on a mat.',
        'Shape transitions — move between hollow, arch, and tuck on command.',
      ],
      mistakes: [
        'Letting the lower back arch in a hollow shape.',
        'Holding the breath and tensing the neck.',
        'Rushing through shapes without checking alignment.',
      ],
      faqs: [
        ['Why are body shapes important?', 'Every gymnastics skill depends on a shape. Strong shapes make skills safer, cleaner, and easier to learn.'],
        ['How long should I hold a shape?', 'Start with ten seconds and build to twenty or thirty as strength improves. Quality matters more than duration.'],
      ],
    },
    {
      slug: 'gymnastics-flexibility',
      title: 'Gymnastics Flexibility: Safe Stretching for Range (2026)',
      description:
        'Build gymnastics flexibility safely with dynamic warm-ups, controlled stretching, and consistency.',
      summary:
        'Gymnastics flexibility should be built gradually and paired with strength. Forcing range before the body is ready increases injury risk and rarely produces lasting change.',
      points: [
        'Warm up before any deep stretching.',
        'Use dynamic mobility to prepare the hips and shoulders.',
        'Stretch consistently in short sessions rather than occasionally for a long time.',
        'Pair flexibility work with strength at the new range.',
        'Avoid pushing into sharp pain or bouncing aggressively.',
      ],
      drills: [
        'Leg swings — ten per direction.',
        'Hip-flexor stretch — three holds of thirty seconds.',
        'Shoulder pass-through — ten with a band or stick.',
        'Split progression — controlled holds with support.',
      ],
      mistakes: [
        'Stretching cold before training.',
        'Forcing splits before the hips are ready.',
        'Neglecting strength work at the end range.',
      ],
      faqs: [
        ['How long does it take to improve flexibility?', 'Noticeable changes often take several weeks of consistent work. Gymnastics range is built gradually over months and years.'],
        ['Is stretching before gymnastics good?', 'Dynamic mobility is better before training. Save longer static stretches for after or separate sessions.'],
      ],
    },
    {
      slug: 'gymnastics-handstand',
      title: 'Gymnastics Handstand: Alignment, Balance, and Practice (2026)',
      description:
        'Learn a gymnastics handstand with proper alignment, wall drills, and balance progressions.',
      summary:
        'The handstand is a foundational gymnastics skill built on alignment and patience. Wall drills and consistent practice develop the shoulder strength and body awareness needed to balance.',
      points: [
        'Place the hands shoulder-width apart with fingers spread.',
        'Stack the shoulders over the wrists and the hips over the shoulders.',
        'Keep the body tight in a hollow shape.',
        'Practise against a wall before attempting freestanding balance.',
        'Use a coach or spotter when learning to fall safely.',
      ],
      drills: [
        'Wall handstand — hold with the chest facing the wall.',
        'Chest-to-wall hold — build alignment with the back to the wall.',
        'Kick-up practice — kick to a wall with controlled force.',
        'Balance drill — shift weight between the fingers and palm.',
      ],
      mistakes: [
        'Arching the back and losing the hollow shape.',
        'Bending the elbows and collapsing into the shoulders.',
        'Practising on a hard surface without a safe fall.',
      ],
      faqs: [
        ['How long does it take to learn a handstand?', 'It varies widely. With consistent practice, many people can hold a wall handstand within weeks and a freestanding handstand within months.'],
        ['Should I learn to fall first?', 'Yes. Learning to step out of a handstand or roll safely reduces fear and injury risk.'],
      ],
    },
    {
      slug: 'gymnastics-cartwheel',
      title: 'Gymnastics Cartwheel: Technique and Progressions (2026)',
      description:
        'Learn a gymnastics cartwheel with correct hand placement, body shape, and safe progressions.',
      summary:
        'The cartwheel teaches sideways rotation and hand support. A straight body, a clear hand placement, and a controlled landing make the skill safe and repeatable.',
      points: [
        'Start in a lunge with the arms reaching toward the mat.',
        'Place the first hand, then the second, in a straight line.',
        'Keep the legs straight and the hips high as you pass over.',
        'Land one foot at a time and finish in a lunge.',
        'Use a mat and a spotter when first learning.',
      ],
      drills: [
        'Hand placement — practise placing hands in a line on a mat.',
        'Cartwheel over a line — use a line on the floor as a guide.',
        'Wall cartwheel — practise the shape against a wall.',
        'Cartwheel to lunge — focus on the landing position.',
      ],
      mistakes: [
        'Bending the elbows and collapsing into the shoulders.',
        'Placing the hands too far apart and losing alignment.',
        'Landing with straight legs and heavy impact.',
      ],
      faqs: [
        ['Do I need a spotter for a cartwheel?', 'A spotter is helpful when first learning, though a cartwheel is lower risk than many gymnastics skills. Use a mat.'],
        ['Why do I land off balance?', 'Hand placement and hip height are usually the cause. Practise the line and the lunge landing slowly.'],
      ],
    },
    {
      slug: 'gymnastics-forward-roll',
      title: 'Gymnastics Forward Roll: Technique and Common Fixes (2026)',
      description:
        'Learn a safe gymnastics forward roll with tucked chin, rounded back, and a controlled finish.',
      summary:
        'The forward roll is a foundational gymnastics skill that teaches rotation and safe falling. A tucked chin, rounded spine, and controlled finish prevent neck strain and build confidence.',
      points: [
        'Start in a squat with hands placed shoulder-width apart.',
        'Tuck the chin and round the back before rolling.',
        'Push through the hands and roll over the shoulders, not the head.',
        'Bring the feet under the body and finish in a squat.',
        'Use a mat and keep the neck relaxed.',
      ],
      drills: [
        'Rock-and-roll — rock backward and forward in a tuck.',
        'Roll down a wedge — use a wedge mat to learn rotation.',
        'Tuck chin drill — practise the chin tuck in a squat.',
        'Roll to squat — finish in a stable squat each time.',
      ],
      mistakes: [
        'Putting weight on the head instead of the shoulders.',
        'Keeping the legs straight and falling over.',
        'Finishing with straight legs and losing balance.',
      ],
      faqs: [
        ['Is a forward roll safe?', 'Yes, with a mat and proper technique. Avoid rolling on hard surfaces or over the head.'],
        ['Why does my roll hurt my neck?', 'You may be tucking the chin too late or putting weight on the head. Practise the tuck and roll over the shoulders.'],
      ],
    },
    {
      slug: 'gymnastics-backward-roll',
      title: 'Gymnastics Backward Roll: Progressions and Safety (2026)',
      description:
        'Learn a safe gymnastics backward roll with hand support, body shape, and controlled progressions.',
      summary:
        'The backward roll requires more shoulder mobility and spatial awareness than the forward roll. Hand placement and a tight tuck make the skill safer and smoother.',
      points: [
        'Start in a squat with the hands ready beside the ears.',
        'Roll backward with a tight tuck and keep the chin tucked.',
        'Place the hands to support the shoulders as the body rotates.',
        'Push through the hands to bring the feet under the body.',
        'Use a mat and a spotter when first learning.',
      ],
      drills: [
        'Rock backward — practise the tuck and roll to the shoulders.',
        'Backward roll down a wedge — use an incline to build momentum.',
        'Hand-placement drill — practise placing the hands beside the head.',
        'Roll to squat — focus on the finish position.',
      ],
      mistakes: [
        'Rolling straight over the neck without hand support.',
        'Losing the tuck and landing heavily.',
        'Placing the hands too late to support the shoulders.',
      ],
      faqs: [
        ['Is the backward roll harder than the forward roll?', 'For most people, yes, because it requires shoulder mobility and hand support behind the body.'],
        ['Do I need a spotter?', 'A spotter is recommended when learning, especially if you are new to inverted movement.'],
      ],
    },
    {
      slug: 'gymnastics-balance-beam',
      title: 'Gymnastics Balance Beam: Confidence and Basic Skills (2026)',
      description:
        'Build balance beam confidence with basic walks, turns, and safe progressions from floor to beam.',
      summary:
        'Balance beam confidence comes from repetition and a low centre of gravity. Start on a line on the floor, then a low beam, before moving to full height.',
      points: [
        'Start on a floor line and practise walking with a tall posture.',
        'Keep the eyes focused ahead, not down at the beam.',
        'Use a low beam before moving to a high beam.',
        'Practise turns with a spotter and a controlled finish.',
        'Keep the arms relaxed and ready to adjust balance.',
      ],
      drills: [
        'Floor line walk — walk forward and backward on a line.',
        'Low-beam walk — walk on a low beam with a coach nearby.',
        'Pivot turn — practise a simple turn on a low beam.',
        'Balance holds — stand on one leg on a low beam.',
      ],
      mistakes: [
        'Looking down and losing spatial awareness.',
        'Rushing the skills before the beam confidence is there.',
        'Tensing the whole body and losing the ability to adjust.',
      ],
      faqs: [
        ['How do I get over fear of the beam?', 'Progress gradually from floor to low beam to high beam, and use a spotter. Confidence comes from repeated safe exposure.'],
        ['What is the best first beam skill?', 'A simple walk and a pivot turn. These build comfort before more complex skills.'],
      ],
    },
    {
      slug: 'gymnastics-vault',
      title: 'Gymnastics Vault: Run-Up, Board, and Landing (2026)',
      description:
        'Learn gymnastics vault fundamentals, including the run-up, hurdle, board contact, and safe landing.',
      summary:
        'Vaulting depends on a fast, consistent run-up and a strong board contact. The goal is to transfer speed into the vault and land safely with bent knees.',
      points: [
        'Use a measured run-up and accelerate through the board.',
        'Hurdle onto the board with both feet and a quick rebound.',
        'Reach for the vault table with straight arms.',
        'Keep the body tight and controlled in the air.',
        'Land with bent knees and a stable finish.',
      ],
      drills: [
        'Run-up rehearsal — measure and practise the approach.',
        'Board rebound — jump off the board to a mat.',
        'Table support — practise straight-arm support on the table.',
        'Landing practice — jump and stick on a soft mat.',
      ],
      mistakes: [
        'Slowing down before the board and losing power.',
        'Reaching for the table with bent arms.',
        'Landing stiff-legged and heavy.',
      ],
      faqs: [
        ['What is the safest first vault?', 'A simple straight jump or squat-on vault with a coach and appropriate mats. Progress under supervision.'],
        ['How important is the run-up?', 'Very. A consistent, fast run-up is the foundation of every vault.'],
      ],
    },
    {
      slug: 'gymnastics-bars',
      title: 'Gymnastics Bars: Grip, Swing, and Basic Skills (2026)',
      description:
        'Learn gymnastics bar basics, including grip, swing, support, and safe progressions with a coach.',
      summary:
        'Bar skills require grip strength, shoulder stability, and swing timing. Beginners should start with support holds and small swings under qualified supervision.',
      points: [
        'Use chalk and grips appropriate to the bar and your level.',
        'Start with support holds and small swings.',
        'Keep the shoulders active and the body tight.',
        'Learn to fall safely with a coach and mats.',
        'Progress skills gradually rather than rushing to releases.',
      ],
      drills: [
        'Support hold — hold the top of the bar with straight arms.',
        'Small swing — practise a controlled swing with a spotter.',
        'Front support — hold a front support position.',
        'Grip-strength work — hanging holds and band exercises.',
      ],
      mistakes: [
        'Swinging without shoulder control.',
        'Using worn grips or skipping chalk.',
        'Attempting release skills without qualified coaching.',
      ],
      faqs: [
        ['Are bars dangerous?', 'Bars carry risk, especially for release skills. Always train with qualified supervision and proper mats.'],
        ['How do I build grip strength?', 'Hanging holds, rows, and grip-specific exercises build the strength needed for bar work.'],
      ],
    },
    {
      slug: 'gymnastics-floor-routine',
      title: 'Gymnastics Floor Routine: Composition and Performance (2026)',
      description:
        'Build a gymnastics floor routine with clean shapes, sensible skill selection, and performance quality.',
      summary:
        'A floor routine should show your strengths and stay within your ability. Clean shapes, consistent skills, and confident performance score better than risky skills performed badly.',
      points: [
        'Choose skills you can perform consistently.',
        'Connect skills with clean shapes and controlled landings.',
        'Use the whole floor and vary levels and directions.',
        'Practise the routine under competition conditions.',
        'Finish each pass with a strong, balanced landing.',
      ],
      drills: [
        'Skill-consistency check — perform each skill ten times.',
        'Routine sections — practise in short chunks.',
        'Full run-through — perform the complete routine with rest.',
        'Landing holds — stick each landing for two seconds.',
      ],
      mistakes: [
        'Including skills that are not yet consistent.',
        'Neglecting performance quality and focus.',
        'Only practising the full routine and never the individual parts.',
      ],
      faqs: [
        ['How long should a floor routine be?', 'Routine length depends on the level and rules. Check your competition requirements and build to them.'],
        ['Should I include my hardest skill?', 'Only if it is consistent and clean. A well-executed routine usually scores better than a risky one with falls.'],
      ],
    },
    {
      slug: 'gymnastics-tumbling',
      title: 'Gymnastics Tumbling: Power, Rotation, and Safety (2026)',
      description:
        'Develop gymnastics tumbling with power, rotation, and safe progressions for rolls, handsprings, and saltos.',
      summary:
        'Tumbling combines speed, rotation, and landing control. Progressions and qualified spotting are essential, especially for aerial skills.',
      points: [
        'Build a strong rebound and landing before adding rotation.',
        'Use progressions and drills for each new skill.',
        'Keep the body tight in rotation and open for landing.',
        'Train on appropriate mats with a coach.',
        'Stop when technique deteriorates with fatigue.',
      ],
      drills: [
        'Rebound jumps — jump and stick on a mat.',
        'Round-off drill — practise the round-off into a rebound.',
        'Back handspring progression — use a wedge and spotter.',
        'Tumbling line — connect two skills with control.',
      ],
      mistakes: [
        'Attempting saltos without qualified coaching.',
        'Losing body tension in rotation.',
        'Training tumbling on hard surfaces.',
      ],
      faqs: [
        ['When can I learn a backflip?', 'Only with a qualified coach and appropriate progressions. Age, strength, and skill base all matter.'],
        ['How do I improve tumbling power?', 'Build rebound, leg strength, and technique. Power without control increases injury risk.'],
      ],
    },
    {
      slug: 'gymnastics-rings',
      title: 'Gymnastics Rings: Strength, Support, and Control (2026)',
      description:
        'Build gymnastics ring strength with support holds, rows, and controlled progressions.',
      summary:
        'Rings demand shoulder stability and relative strength. Start with support holds and rows before attempting swings or strength elements.',
      points: [
        'Build a strong support hold with straight arms.',
        'Keep the shoulders depressed and the body tight.',
        'Use rows and push-up progressions to build strength.',
        'Progress slowly and avoid swinging before control is established.',
        'Train with a coach and appropriate mats.',
      ],
      drills: [
        'Ring support — hold for ten to twenty seconds.',
        'Ring row — three sets of eight.',
        'Ring push-up — three sets of six to ten.',
        'Hollow hold on rings — ten seconds.',
      ],
      mistakes: [
        'Letting the shoulders shrug up in support.',
        'Attempting muscle-ups before building strength.',
        'Swinging without control.',
      ],
      faqs: [
        ['Are rings good for beginners?', 'Basic support and row progressions are accessible, but advanced elements require significant strength and coaching.'],
        ['How do I build ring strength?', 'Support holds, rows, push-ups, and hanging work build the foundation. Progress gradually.'],
      ],
    },
    {
      slug: 'gymnastics-pommel-horse',
      title: 'Gymnastics Pommel Horse: Support and Circles (2026)',
      description:
        'Learn pommel horse basics, including support position, weight shift, and circle progressions.',
      summary:
        'Pommel horse is a men’s artistic gymnastics apparatus that demands shoulder stability and weight transfer. Beginners start with support holds and small circles.',
      points: [
        'Build a strong support hold with straight arms.',
        'Shift weight from hand to hand smoothly.',
        'Start circles slowly and with a coach spotting.',
        'Keep the body tight and the hips controlled.',
        'Progress gradually to longer circle sequences.',
      ],
      drills: [
        'Support hold — hold the pommels with straight arms.',
        'Weight-shift drill — shift from one hand to the other.',
        'Circle on a mushroom — practise circles on a low mushroom.',
        'Hip-control drill — keep the hips tight in support.',
      ],
      mistakes: [
        'Bending the arms and collapsing in support.',
        'Rushing circles before weight shift is controlled.',
        'Losing body tension and swinging the legs.',
      ],
      faqs: [
        ['Is pommel horse suitable for beginners?', 'Basic support and circles on a mushroom are accessible with coaching. The full apparatus is advanced.'],
        ['Why is weight shift important?', 'Circles depend on transferring weight smoothly from hand to hand. Without it, the rhythm and control break down.'],
      ],
    },
    {
      slug: 'gymnastics-conditioning',
      title: 'Gymnastics Conditioning: Strength Without Equipment (2026)',
      description:
        'Build gymnastics conditioning with bodyweight strength, core work, and shoulder stability exercises.',
      summary:
        'Gymnastics conditioning is mostly bodyweight strength and control. Hollow holds, push-ups, rows, and leg work build the foundation for every apparatus.',
      points: [
        'Build core strength with hollow and arch holds.',
        'Train pushing and pulling strength with bodyweight exercises.',
        'Strengthen the shoulders and wrists gradually.',
        'Include leg strength for jumps and landings.',
        'Keep sessions short and consistent rather than exhausting.',
      ],
      drills: [
        'Hollow hold — three sets of fifteen seconds.',
        'Push-up progression — three sets of six to twelve.',
        'Inverted row — three sets of eight.',
        'Squat jump — three sets of six with a soft landing.',
      ],
      mistakes: [
        'Doing high-repetition work with poor form.',
        'Neglecting wrist and shoulder preparation.',
        'Conditioning hard before skill work and arriving fatigued.',
      ],
      faqs: [
        ['How often should gymnasts condition?', 'Two or three short sessions per week alongside skill work is a good base for recreational gymnasts.'],
        ['Do gymnasts need weights?', 'Bodyweight strength is the foundation. Added resistance can help later, but only with qualified guidance.'],
      ],
    },
    {
      slug: 'gymnastics-core-strength',
      title: 'Gymnastics Core Strength: Hollow, Arch, and Control (2026)',
      description:
        'Develop gymnastics core strength with hollow holds, arch work, and anti-rotation exercises.',
      summary:
        'Core strength in gymnastics is about controlling the relationship between the ribs and pelvis. Hollow and arch holds teach the tension that keeps the body tight through skills.',
      points: [
        'Keep the ribs down and the lower back pressed into the floor in a hollow.',
        'Build arch strength without overextending the lower back.',
        'Train anti-rotation to control twisting forces.',
        'Use slow, controlled repetitions rather than fast, sloppy ones.',
        'Progress duration and difficulty gradually.',
      ],
      drills: [
        'Hollow hold — three sets of fifteen seconds.',
        'Arch hold — three sets of ten seconds.',
        'Dead bug — three sets of ten per side.',
        'Pallof press — three sets of ten per side.',
      ],
      mistakes: [
        'Letting the lower back arch during hollow holds.',
        'Holding the breath and straining the neck.',
        'Adding difficulty before the basic hold is solid.',
      ],
      faqs: [
        ['How long should I hold a hollow?', 'Start with ten seconds and build to thirty as control improves. Quality matters more than duration.'],
        ['Is core strength important for gymnastics?', 'Yes. It connects the upper and lower body and keeps skills tight and controlled.'],
      ],
    },
    {
      slug: 'gymnastics-injury-prevention',
      title: 'Gymnastics Injury Prevention: Wrists, Ankles, and Shoulders (2026)',
      description:
        'Reduce gymnastics injuries with wrist preparation, ankle stability, shoulder care, and load management.',
      summary:
        'Gymnastics loads the wrists, ankles, and shoulders heavily. Gradual progressions, strength work, and recovery habits protect the joints that absorb repeated impact.',
      points: [
        'Prepare the wrists before any hand-support work.',
        'Build ankle stability for landings and jumps.',
        'Strengthen the shoulders and scapular muscles.',
        'Increase training volume gradually, especially before competitions.',
        'Use mats and spotting for new skills.',
      ],
      drills: [
        'Wrist mobility — circles and gentle stretches.',
        'Single-leg balance — thirty seconds per side.',
        'Band external rotation — three sets of twelve.',
        'Landing practice — jump and stick with soft knees.',
      ],
      mistakes: [
        'Skipping wrist preparation before tumbling.',
        'Landing on stiff legs and loading the ankles.',
        'Adding new skills without adjusting recovery.',
      ],
      faqs: [
        ['Why do gymnasts have wrist pain?', 'Repeated hand support loads the wrists heavily. Gradual progression and wrist preparation reduce irritation.'],
        ['How do I protect my ankles?', 'Build balance and landing strength, and use mats for new skills.'],
      ],
    },
    {
      slug: 'gymnastics-wrist-care',
      title: 'Gymnastics Wrist Care: Preparation and Recovery (2026)',
      description:
        'Care for gymnastics wrists with warm-up, strengthening, taping, and load management.',
      summary:
        'Gymnastics wrists tolerate a lot of loading, but they need preparation and recovery. A simple wrist routine and gradual progressions prevent most irritation.',
      points: [
        'Warm up the wrists before hand-support work.',
        'Strengthen the forearms with controlled exercises.',
        'Use taping or supports only as advised.',
        'Increase hand-support volume gradually.',
        'Rest and seek advice if pain persists.',
      ],
      drills: [
        'Wrist circles — ten per direction.',
        'Wrist rocks — ten per direction.',
        'Wrist curls — three sets of twelve.',
        'Grip squeeze — three sets of ten.',
      ],
      mistakes: [
        'Loading the wrists cold.',
        'Using tape to mask pain and continue training.',
        'Increasing tumbling volume sharply.',
      ],
      faqs: [
        ['Should I tape my wrists?', 'Taping can help support the wrist, but it should not replace strength work or mask persistent pain. Ask a coach or clinician.'],
        ['How do I strengthen my wrists?', 'Controlled wrist curls, extensions, and grip work build resilience gradually.'],
      ],
    },
    {
      slug: 'gymnastics-youth-development',
      title: 'Gymnastics Youth Development: Play, Shapes, and Patience (2026)',
      description:
        'A youth gymnastics development approach built on play, body awareness, and safe progressions.',
      summary:
        'Young gymnasts develop best through play and broad movement. Body shapes, landings, and confidence come before advanced skills, and fun keeps them engaged.',
      points: [
        'Use games to build body awareness and balance.',
        'Teach shapes and landings before rotations.',
        'Keep sessions short and varied.',
        'Use qualified coaching and appropriate equipment.',
        'Praise effort and progress rather than comparison.',
      ],
      drills: [
        'Animal walks — bear, crab, and frog walks.',
        'Shape game — hollow, arch, and tuck on command.',
        'Balance circuit — walk on lines and low beams.',
        'Jump-and-stick — land softly on a mat.',
      ],
      mistakes: [
        'Pushing advanced skills before the basics.',
        'Comparing children to each other.',
        'Ignoring rest and recovery in a high-volume programme.',
      ],
      faqs: [
        ['When should children start gymnastics?', 'Many programmes start around age three to five with playful movement. Formal skill progression comes later.'],
        ['Is gymnastics good for young children?', 'Yes. It builds strength, balance, flexibility, and confidence when taught safely and age-appropriately.'],
      ],
    },
    {
      slug: 'gymnastics-competition-preparation',
      title: 'Gymnastics Competition Preparation: Routine and Routine (2026)',
      description:
        'Prepare for gymnastics competitions with routine rehearsal, equipment checks, and a calm competition routine.',
      summary:
        'Competition preparation in gymnastics is about repetition and predictability. Rehearsing routines under pressure and keeping the warm-up consistent reduce mistakes on the day.',
      points: [
        'Practise full routines under competition-like conditions.',
        'Rehearse the warm-up and equipment checks.',
        'Prepare backup grips, tape, and chalk.',
        'Keep the pre-competition routine consistent.',
        'Focus on process goals rather than only scores.',
      ],
      drills: [
        'Full routine run-through — perform each routine with rest.',
        'Pressure set — perform a routine with a judge or coach watching.',
        'Equipment rehearsal — set up grips and chalk as at the venue.',
        'Visualisation — rehearse each routine mentally before competing.',
      ],
      mistakes: [
        'Trying new skills at the competition.',
        'Changing the warm-up routine at the venue.',
        'Letting one mistake derail the rest of the routine.',
      ],
      faqs: [
        ['How should I prepare the week before a competition?', 'Reduce volume, rehearse routines, and keep skills familiar. Avoid new equipment or skills.'],
        ['What should I bring?', 'Grips, tape, chalk, spare clothing, water, snacks, and any required competition documents.'],
      ],
    },
  ],
};

export default category;
