const category = {
  key: 'archery',
  label: 'Archery',
  venue: 'an archery range, field course, or supervised indoor lane with a safe backstop',
  demand:
    'sustained isometric shoulder tension, precise repeatability, trunk stability, and concentration across many shots',
  equipment: [
    'Bow',
    'Arrows',
    'Arm guard',
    'Finger tab or release aid',
    'Bow stringer',
    'Target face and backstop',
  ],
  injuries: ['shoulder strain', 'rotator cuff irritation', 'elbow tendinopathy', 'lower-back fatigue'],
  terms: [
    ['Anchor', 'The consistent reference point where the drawing hand rests at full draw.'],
    ['Draw length', 'The distance the bowstring is pulled back at full draw.'],
    ['Tiller', 'The relative stiffness and adjustment of the upper and lower limbs.'],
    ['Nock', 'The notch at the end of the arrow that attaches to the bowstring.'],
  ],
  tools: [
    { label: 'Heart Rate Calculator', slug: 'heart-rate-calculator' },
    { label: 'Body Fat Calculator', slug: 'body-fat-calculator' },
    { label: 'Training Load Calculator', slug: 'training-load-calculator' },
  ],
  posts: [
    {
      slug: 'archery-beginner-basics',
      title: 'Archery for Beginners: Bows, Safety, and First Shots (2026)',
      description:
        'Start archery with a beginner guide to bow types, range safety, stance, and the first steps of the shot process.',
      summary:
        'Archery beginners should learn range safety and one repeatable shot process before worrying about accuracy. A safe range, a comfortable bow, and a simple routine make the first sessions productive.',
      points: [
        'Learn and follow range safety commands before touching a bow.',
        'Start with a lightweight bow that you can draw comfortably.',
        'Use a bow stringer to string and unstring the bow safely.',
        'Learn a simple stance, grip, and anchor point.',
        'Focus on the process rather than hitting the centre on day one.',
      ],
      drills: [
        'Safety walk-through — review the range rules and commands.',
        'Blank-bale practice — shoot at a blank target from close range.',
        'Draw-and-let-down — practise drawing and letting down safely.',
        'Anchor drill — draw to the anchor and hold for a few seconds.',
      ],
      mistakes: [
        'Drawing a bow that is too heavy and losing technique.',
        'Skipping the safety briefing and range rules.',
        'Chasing accuracy before the shot process is repeatable.',
      ],
      faqs: [
        ['What bow should a beginner use?', 'A lightweight recurve or a rental bow suited to your draw length is a good start. Avoid heavy hunting bows until your technique is solid.'],
        ['How do I find a safe place to shoot?', 'Use a supervised archery range with a proper backstop. Never shoot in an unsecured area.'],
      ],
    },
    {
      slug: 'archery-stance',
      title: 'Archery Stance: Balance and Alignment (2026)',
      description:
        'Build a stable archery stance with correct foot placement, body alignment, and relaxed posture.',
      summary:
        'A stable archery stance is the foundation of repeatability. Balanced feet, relaxed shoulders, and consistent alignment let the shot process repeat without unnecessary tension.',
      points: [
        'Stand with the feet about shoulder-width apart and perpendicular to the target.',
        'Keep the weight evenly distributed and the knees soft.',
        'Turn the hips and shoulders into line with the target.',
        'Keep the bow arm relaxed but straight.',
        'Avoid leaning back or forward during the draw.',
      ],
      drills: [
        'Stance check — stand on a line and review alignment.',
        'Wall drill — stand with the back against a wall to check posture.',
        'Draw-and-hold — draw and hold for three seconds without leaning.',
        'Mirror review — film the stance from the side.',
      ],
      mistakes: [
        'Standing too narrow and losing stability.',
        'Leaning back to counter the bow weight.',
        'Tensing the legs and upper body.',
      ],
      faqs: [
        ['Which stance is best?', 'The square stance is a good starting point. Open and close stances may suit different body types and bows.'],
        ['Why does my stance matter if I shoot from a fixed position?', 'A repeatable stance reduces variation in the shot and helps you maintain balance through the draw.'],
      ],
    },
    {
      slug: 'archery-grip',
      title: 'Archery Bow Grip: Relaxed Hand and Consistent Pressure (2026)',
      description:
        'Learn the archery bow grip with a relaxed hand, consistent pressure point, and no torque.',
      summary:
        'The bow grip should be relaxed and consistent. Gripping too tightly twists the bow and sends arrows off line, while a relaxed hand lets the bow settle naturally.',
      points: [
        'Place the hand on the grip with the knuckles at about forty-five degrees.',
        'Keep the fingers relaxed and the thumb clear of the arrow.',
        'Use a consistent pressure point in the palm.',
        'Avoid squeezing the grip during the draw.',
        'Let the bow rotate naturally in the hand after release.',
      ],
      drills: [
        'Grip check — hold the bow and confirm the pressure point.',
        'Draw-and-hold with relaxed hand — notice tension.',
        'Blank-bale shots — focus on a relaxed grip without aiming.',
        'Bow-sling practice — use a sling to learn to relax the hand.',
      ],
      mistakes: [
        'Gripping tightly and torquing the bow.',
        'Placing the hand too high or too low on the grip.',
        'Catching the bow after release instead of letting it fall into the sling.',
      ],
      faqs: [
        ['Should I use a bow sling?', 'A sling lets you relax the hand fully and catch the bow after release. Many target archers use one.'],
        ['Why do my arrows go left or right?', 'Grip torque is a common cause. Review the hand position and relax the grip.'],
      ],
    },
    {
      slug: 'archery-draw',
      title: 'Archery Draw: Back Tension and Smooth Execution (2026)',
      description:
        'Learn a smooth archery draw using back tension, correct elbow alignment, and controlled execution.',
      summary:
        'A good archery draw uses the large muscles of the back rather than the arms alone. Smooth, controlled drawing keeps the shoulders aligned and sets up a clean release.',
      points: [
        'Raise the bow arm and set the grip before drawing.',
        'Draw by pulling the elbow back and using the back muscles.',
        'Keep the drawing hand relaxed and the wrist straight.',
        'Draw smoothly without stopping and starting.',
        'Arrive at full draw with the shoulders aligned.',
      ],
      drills: [
        'Draw-and-let-down — draw without releasing and return safely.',
        'Back-tension drill — use a stretch band to feel the back muscles.',
        'Slow draw — draw over five seconds with a coach watching.',
        'Wall drill — draw while keeping the elbow aligned.',
      ],
      mistakes: [
        'Drawing with the arm and shoulder only.',
        'Rushing the draw and losing alignment.',
        'Stopping mid-draw and readjusting.',
      ],
      faqs: [
        ['Why is back tension important?', 'Back tension uses stronger muscle groups and helps keep the shot smooth and repeatable.'],
        ['How do I know my draw length is right?', 'A bow shop or coach can measure it. The anchor and elbow alignment should feel natural at full draw.'],
      ],
    },
    {
      slug: 'archery-anchor',
      title: 'Archery Anchor Point: Consistency at Full Draw (2026)',
      description:
        'Find and maintain a consistent archery anchor point with the hand, string, and facial references.',
      summary:
        'The anchor point is the reference that makes every shot repeatable. A consistent hand position against the face and a stable head position reduce vertical and horizontal variation.',
      points: [
        'Choose an anchor that puts the drawing hand against a firm facial reference.',
        'Keep the head still and the string touching the same point each time.',
        'Use the nose or chin as a reference depending on your style.',
        'Arrive at the anchor smoothly and hold briefly before release.',
        'Check the anchor after every shot in practice.',
      ],
      drills: [
        'Anchor-and-hold — draw to anchor and hold for three seconds.',
        'Blank-bale anchor practice — focus only on the anchor.',
        'String-on-nose drill — confirm the same contact point each shot.',
        'Video review — film the anchor from the side.',
      ],
      mistakes: [
        'Changing the anchor between shots.',
        'Moving the head toward the string instead of the hand to the face.',
        'Rushing the release before the anchor is set.',
      ],
      faqs: [
        ['What is the best anchor point?', 'One that is comfortable, repeatable, and consistent with your bow and style. A coach can help you find it.'],
        ['Why does my anchor change under pressure?', 'Fatigue and tension often cause it. Keep shot volume manageable and rehearse the anchor in practice.'],
      ],
    },
    {
      slug: 'archery-aiming',
      title: 'Archery Aiming: Sight Picture and Focus (2026)',
      description:
        'Improve archery aiming with a consistent sight picture, focus, and a calm, patient approach.',
      summary:
        'Aiming in archery is about a repeatable sight picture and relaxed focus. Staring too hard or chasing the pin creates tension that undermines the shot.',
      points: [
        'Align the sight pin or reference with the target consistently.',
        'Focus on the target and let the sight settle rather than forcing it.',
        'Keep the bow arm steady and the breathing calm.',
        'Accept a small natural float instead of chasing perfection.',
        'Release when the sight picture is stable, not when it is perfect.',
      ],
      drills: [
        'Blank-bale aiming — aim at a blank target to reduce target panic.',
        'Sight-picture drill — hold the sight on the target for five seconds.',
        'Breathing drill — breathe calmly while holding at full draw.',
        'Close-range accuracy — shoot at a large target from close range.',
      ],
      mistakes: [
        'Staring at the pin and losing awareness of the target.',
        'Holding too long and becoming fatigued.',
        'Chasing the sight picture and snatching the release.',
      ],
      faqs: [
        ['Should I aim with one eye or two?', 'Most archers aim with the dominant eye. A coach can help if you are cross-dominant.'],
        ['How do I stop target panic?', 'Work on blank-bale practice, a calm shot process, and accepting a natural float. Seek coaching if it persists.'],
      ],
    },
    {
      slug: 'archery-release',
      title: 'Archery Release: Clean Execution and Follow-Through (2026)',
      description:
        'Execute a clean archery release with relaxed fingers, back tension, and a natural follow-through.',
      summary:
        'A clean release happens when the back continues to pull and the fingers relax rather than snap open. Trying to make the release happen usually introduces torque and inconsistency.',
      points: [
        'Continue pulling through the shot with the back.',
        'Relax the fingers rather than opening them deliberately.',
        'Keep the drawing hand close to the face after release.',
        'Let the bow fall forward into the sling naturally.',
        'Maintain the follow-through until the arrow hits.',
      ],
      drills: [
        'Release drill with a stretch band — practise the back-tension release.',
        'Blank-bale release — focus on relaxation rather than accuracy.',
        'Follow-through hold — hold the position for two seconds after release.',
        'Slow-motion release — rehearse the motion without a bow.',
      ],
      mistakes: [
        'Snapping the fingers open and plucking the string.',
        'Dropping the bow arm before the arrow clears.',
        'Stopping the back tension at release.',
      ],
      faqs: [
        ['What is a pluck?', 'A pluck is a release where the string is pulled away from the face, sending arrows off line. A relaxed release and continued back tension help.'],
        ['Should I use a mechanical release?', 'Compound archers often use a release aid. Traditional and recurve archers typically use fingers. Choose based on your bow and style.'],
      ],
    },
    {
      slug: 'archery-follow-through',
      title: 'Archery Follow-Through: Holding the Shot (2026)',
      description:
        'Build a consistent archery follow-through that supports accuracy and reveals execution errors.',
      summary:
        'Follow-through is the body’s response to a clean release. Holding the position after the shot helps you diagnose errors and prevents premature movement.',
      points: [
        'Keep the bow arm up until the arrow lands.',
        'Allow the drawing hand to finish naturally near the face.',
        'Do not drop the bow or step out of the stance immediately.',
        'Observe the arrow flight and note what happened.',
        'Use the follow-through as feedback, not a pose.',
      ],
      drills: [
        'Hold-the-finish drill — hold for three seconds after release.',
        'Video review — film the follow-through from the side.',
        'Blank-bale consistency — shoot a set and check the finish each time.',
        'Partner observation — ask a partner to watch the follow-through.',
      ],
      mistakes: [
        'Dropping the bow arm to see the arrow.',
        'Stepping out of the stance before the shot finishes.',
        'Rushing the next arrow without evaluating the shot.',
      ],
      faqs: [
        ['Why does follow-through matter?', 'It shows whether the shot was executed cleanly and prevents movement that affects the arrow before it clears the bow.'],
        ['How long should I hold the finish?', 'Two to three seconds is enough. The goal is to avoid premature movement, not to strike a pose.'],
      ],
    },
    {
      slug: 'archery-recurve',
      title: 'Recurve Archery: Setup, Technique, and Tuning (2026)',
      description:
        'Learn recurve archery fundamentals, including bow setup, sight use, and a repeatable shot process.',
      summary:
        'Recurve archery is the Olympic discipline and rewards a clean, repeatable process. Bow setup, sight adjustment, and consistent form matter more than raw draw weight.',
      points: [
        'Choose a draw weight you can control for a full session.',
        'Set the brace height and tiller according to the manufacturer’s guidance.',
        'Use a sight and adjust it based on where arrows group.',
        'Learn a consistent anchor and release.',
        'Tune the bow and arrows together for clean flight.',
      ],
      drills: [
        'Blank-bale form — shoot at close range with no target face.',
        'Sight-walk — adjust the sight based on group position.',
        'Draw-weight check — draw repeatedly and assess control.',
        'Grouping practice — shoot a set and analyse the group.',
      ],
      mistakes: [
        'Starting with too heavy a draw weight.',
        'Adjusting the sight without a consistent group.',
        'Ignoring arrow spine and bow tuning.',
      ],
      faqs: [
        ['What draw weight should a beginner recurve archer use?', 'A weight you can draw smoothly for many shots, often around 20-30 pounds for adults depending on fitness. A coach can advise.'],
        ['How often should I tune my bow?', 'Check brace height and sight regularly, and tune when changing arrows or string.'],
      ],
    },
    {
      slug: 'archery-compound',
      title: 'Compound Archery: Let-Off, Release Aids, and Setup (2026)',
      description:
        'Understand compound archery, including let-off, release aids, sight setup, and a repeatable shooting process.',
      summary:
        'Compound bows use let-off and mechanical releases to make holding at full draw easier. Precision comes from a consistent setup, a repeatable process, and good release execution.',
      points: [
        'Set the draw length and let-off to suit your body and style.',
        'Use a mechanical release aid consistently.',
        'Set the sight and peep so the sight picture is clear.',
        'Keep the release hand relaxed and use back tension.',
        'Tune the bow and arrows for clean flight.',
      ],
      drills: [
        'Release-aid practice — draw and release with a trained coach.',
        'Peep alignment drill — check the sight picture at full draw.',
        'Grouping practice — shoot sets and analyse the group.',
        'Back-tension drill — use a stretch band to feel the execution.',
      ],
      mistakes: [
        'Using a draw weight or let-off that does not fit your style.',
        'Punching the release aid instead of using back tension.',
        'Changing multiple bow settings at once.',
      ],
      faqs: [
        ['What is let-off?', 'Let-off reduces the holding weight at full draw, making it easier to aim steadily.'],
        ['Do compound archers use sights?', 'Yes. Most use a sight with pins or a scope, and a peep sight in the string.'],
      ],
    },
    {
      slug: 'archery-barebow',
      title: 'Barebow Archery: Traditional Technique and Consistency (2026)',
      description:
        'Learn barebow archery with no sights, relying on anchor consistency and instinctive aiming.',
      summary:
        'Barebow archery removes sights and relies on a consistent anchor, string picture, and instinctive aim. Repeatability matters more than perfect sight settings.',
      points: [
        'Use a consistent anchor and string reference.',
        'Aim instinctively by focusing on the target.',
        'Keep the bow hand relaxed and the draw smooth.',
        'Use a consistent stance and release.',
        'Practise at varying distances to build judgement.',
      ],
      drills: [
        'Instinctive shooting — shoot at close targets without a sight.',
        'Anchor consistency — hold at anchor and check the string picture.',
        'Distance variation — shoot from several distances.',
        'Blank-bale practice — focus on form and release.',
      ],
      mistakes: [
        'Changing the anchor between shots.',
        'Trying to aim with the arrow tip instead of focusing on the target.',
        'Practising only one distance and struggling to adapt.',
      ],
      faqs: [
        ['Is barebow harder than sighted archery?', 'It demands more consistency and judgement, but many archers find it rewarding and simpler to set up.'],
        ['Can I hunt with a barebow?', 'Rules vary by region. Check local hunting regulations and always prioritise safety and ethics.'],
      ],
    },
    {
      slug: 'archery-form-corrections',
      title: 'Archery Form Corrections: Diagnosing Common Errors (2026)',
      description:
        'Diagnose and correct common archery form errors, including grip torque, collapsing, and inconsistent anchors.',
      summary:
        'Most archery errors show up as arrow grouping patterns or inconsistent shot execution. Filming your shot and checking the process one step at a time is the fastest way to correct them.',
      points: [
        'Check the stance and alignment before changing the shot.',
        'Review the grip for tension and torque.',
        'Confirm the anchor is repeatable.',
        'Look for collapsing or rushing at release.',
        'Change one variable at a time and test the result.',
      ],
      drills: [
        'Video analysis — film from the side and behind.',
        'Blank-bale set — shoot without a target face to isolate form.',
        'One-change session — adjust one element and compare.',
        'Coach feedback — ask a coach to observe a set.',
      ],
      mistakes: [
        'Changing several form elements at once.',
        'Blaming equipment before checking the process.',
        'Practising errors at high volume.',
      ],
      faqs: [
        ['How do I know what is causing my misses?', 'Use the group pattern and video to trace the error back to the shot process. A coach can speed this up.'],
        ['How often should I film my shot?', 'Every few weeks, or whenever something feels different. Video is a useful unbiased reference.'],
      ],
    },
    {
      slug: 'archery-distance-judging',
      title: 'Archery Distance Judging: Field and 3D Skills (2026)',
      description:
        'Improve archery distance judging for field and 3D courses with reference points and practice routines.',
      summary:
        'Field and 3D archery require accurate distance judgement. Consistent reference points, practice at unknown distances, and calm decision-making improve scoring.',
      points: [
        'Use known reference objects and terrain features to estimate distance.',
        'Practise at unknown distances rather than always shooting marked targets.',
        'Keep a consistent anchor and aim for the centre of the target.',
        'Account for slope and lighting conditions.',
        'Record estimated versus actual distances to improve judgement.',
      ],
      drills: [
        'Unknown-distance practice — shoot at unmarked targets and measure.',
        'Estimation walk — pace out distances and check accuracy.',
        'Slope practice — shoot uphill and downhill to learn the effect.',
        'Field course round — complete a course and review misses.',
      ],
      mistakes: [
        'Rushing the distance estimate and shooting without a plan.',
        'Ignoring slope and lighting effects.',
        'Using the same aim point regardless of distance.',
      ],
      faqs: [
        ['Why is distance judging important?', 'In field and 3D archery, targets are often unmarked, so an accurate estimate determines the correct aim.'],
        ['How can I practise?', 'Shoot at unknown distances regularly and compare your estimate with the measured distance.'],
      ],
    },
    {
      slug: 'archery-wind-reading',
      title: 'Archery Wind Reading: Aiming Off and Adjustments (2026)',
      description:
        'Learn to read wind in archery and make sensible aim adjustments without overcorrecting.',
      summary:
        'Wind moves arrows in flight, and archers must decide whether to aim off or adjust the sight. Consistent practice and conservative adjustments prevent overcorrection.',
      points: [
        'Observe flags, grass, and dust to judge wind direction and strength.',
        'Make small adjustments and observe the group.',
        'Aim off only when the wind is steady enough to justify it.',
        'Keep the shot process consistent even in wind.',
        'Record wind conditions and outcomes in practice.',
      ],
      drills: [
        'Wind-drill sets — shoot in crosswinds and record group shift.',
        'Flag observation — watch range flags and estimate wind.',
        'Aim-off practice — deliberately aim off and compare results.',
        'Sight adjustment — make small changes and observe the group.',
      ],
      mistakes: [
        'Overcorrecting for every gust.',
        'Changing the sight and the aim point at the same time.',
        'Ignoring wind during practice and being surprised in competition.',
      ],
      faqs: [
        ['Should I aim off or adjust the sight?', 'Either can work, but be consistent. Small, measured adjustments are safer than big guesses.'],
        ['How do I learn to read wind?', 'Practice in different conditions and pay attention to flags, trees, and how your arrows group.'],
      ],
    },
    {
      slug: 'archery-equipment-setup',
      title: 'Archery Equipment Setup: Bow, Arrows, and Accessories (2026)',
      description:
        'Set up archery equipment correctly, including bow length, draw weight, arrow spine, and accessories.',
      summary:
        'A safe, well-matched setup makes archery easier to learn. Bow length, draw weight, arrow spine, and accessories should suit your body and discipline.',
      points: [
        'Choose a bow length and draw weight that match your size and strength.',
        'Match arrow spine to the bow’s draw weight.',
        'Use a bow stringer and check the string regularly.',
        'Add an arm guard and finger tab for protection and consistency.',
        'Have a shop or coach check the setup before shooting.',
      ],
      drills: [
        'Draw-length check — measure with a shop or coach.',
        'Arrow-spine check — confirm arrows match the bow.',
        'String inspection — check for wear before each session.',
        'Accessory fit — adjust the arm guard and tab.',
      ],
      mistakes: [
        'Using arrows with the wrong spine.',
        'Shooting a bow that is too heavy for your strength.',
        'Skipping the arm guard and finger protection.',
      ],
      faqs: [
        ['How do I choose arrow spine?', 'Arrow spine must match draw weight and arrow length. Use a spine chart or ask a shop for help.'],
        ['Can I use any arrow with any bow?', 'No. Mismatched arrows can fly poorly and may be unsafe. Match the spine to the bow.'],
      ],
    },
    {
      slug: 'archery-tuning',
      title: 'Archery Bow Tuning: Brace Height and Arrow Flight (2026)',
      description:
        'Tune an archery bow with brace height, nocking point, and arrow-flight checks.',
      summary:
        'Bow tuning aligns the bow and arrows for clean flight. Brace height, nocking point, and arrow spine all affect consistency, and changes should be made one at a time.',
      points: [
        'Set the brace height to the manufacturer’s recommendation.',
        'Check the nocking point so arrows leave the string cleanly.',
        'Use paper tuning or group tuning to assess flight.',
        'Change one variable at a time and record the result.',
        'Ask a coach or shop for help with advanced tuning.',
      ],
      drills: [
        'Brace-height check — measure and compare to spec.',
        'Paper test — shoot through paper and inspect the tear.',
        'Nocking-point check — confirm arrow height on the string.',
        'Group tuning — shoot groups and adjust as needed.',
      ],
      mistakes: [
        'Changing several tuning variables at once.',
        'Tuning before your form is consistent.',
        'Ignoring tuning and blaming the archer for every miss.',
      ],
      faqs: [
        ['What is paper tuning?', 'Shooting an arrow through paper at close range to inspect the tear pattern, which indicates whether the arrow is leaving the bow straight.'],
        ['How often should I tune?', 'When changing arrows, string, or major setup, or when arrow flight changes noticeably.'],
      ],
    },
    {
      slug: 'archery-mental-game',
      title: 'Archery Mental Game: Focus and Shot Routine (2026)',
      description:
        'Build a stronger archery mental game with a repeatable shot routine, focus cues, and pressure practice.',
      summary:
        'Archery is a mental sport as much as a physical one. A consistent shot routine, simple focus cues, and practice under pressure help archers perform when it matters.',
      points: [
        'Use a consistent pre-shot routine.',
        'Focus on one process cue rather than the outcome.',
        'Breathe calmly and settle before drawing.',
        'Accept a bad shot and reset for the next arrow.',
        'Practise pressure situations regularly.',
      ],
      drills: [
        'Shot-routine rehearsal — practise the routine without a bow.',
        'Process-cue practice — focus on one cue for a whole set.',
        'Pressure sets — shoot a set with a consequence for a miss.',
        'Reset drill — shoot a bad arrow and immediately reset.',
      ],
      mistakes: [
        'Thinking about the score while shooting.',
        'Letting one bad arrow affect the next.',
        'Changing the routine under pressure.',
      ],
      faqs: [
        ['How do I handle competition nerves?', 'Use a consistent routine, breathe calmly, and focus on process cues. Practice under pressure makes competition feel more familiar.'],
        ['Should I visualise my shots?', 'Yes. Visualising the shot process and a clean release can help prepare the body and mind.'],
      ],
    },
    {
      slug: 'archery-conditioning',
      title: 'Archery Conditioning: Shoulders, Back, and Endurance (2026)',
      description:
        'Build archery conditioning with shoulder stability, back strength, and endurance for long shooting sessions.',
      summary:
        'Archery conditioning supports the sustained isometric effort of drawing and holding. Shoulder stability, back strength, and general endurance reduce fatigue and improve consistency.',
      points: [
        'Strengthen the back and shoulders with rows and band work.',
        'Build shoulder stability with external rotation exercises.',
        'Train grip and forearm endurance.',
        'Include general aerobic work for long sessions.',
        'Progress draw volume gradually.',
      ],
      drills: [
        'Band rows — three sets of twelve.',
        'External rotation — three sets of twelve per arm.',
        'Draw-and-hold endurance — repeat with a light band.',
        'Easy walk or jog — twenty to thirty minutes.',
      ],
      mistakes: [
        'Increasing draw volume sharply before a competition.',
        'Neglecting shoulder stability work.',
        'Training through shoulder pain.',
      ],
      faqs: [
        ['How do I build endurance for many arrows?', 'Gradually increase draw volume and include shoulder and back strength work. Recovery matters as much as volume.'],
        ['Should archers lift weights?', 'General strength work supports archery, but focus on shoulder stability and back strength rather than maximum lifts.'],
      ],
    },
    {
      slug: 'archery-injury-prevention',
      title: 'Archery Injury Prevention: Shoulder and Back Care (2026)',
      description:
        'Reduce archery injuries with shoulder care, back strength, load management, and proper technique.',
      summary:
        'Archery injuries usually develop gradually in the shoulder, elbow, or lower back. Gradual load increases, strength work, and good technique keep archers shooting comfortably.',
      points: [
        'Warm up the shoulders and back before shooting.',
        'Build rotator cuff and scapular strength.',
        'Increase draw volume gradually.',
        'Keep the stance balanced to avoid lower-back strain.',
        'Stop and seek advice if pain persists.',
      ],
      drills: [
        'Shoulder circles — ten per direction.',
        'Band external rotation — three sets of twelve.',
        'Scapular retraction — three sets of ten.',
        'Draw-volume progression — add arrows slowly week to week.',
      ],
      mistakes: [
        'Shooting hundreds of arrows after a break.',
        'Ignoring shoulder pain because it only appears at full draw.',
        'Using poor posture that strains the lower back.',
      ],
      faqs: [
        ['What is archer’s shoulder?', 'A general term for shoulder pain from repeated drawing. Gradual load and shoulder strength work reduce the risk.'],
        ['How many arrows should I shoot?', 'Build volume gradually and stop when form deteriorates. Quality matters more than volume.'],
      ],
    },
    {
      slug: 'archery-tournament-preparation',
      title: 'Archery Tournament Preparation: Equipment and Routine (2026)',
      description:
        'Prepare for archery tournaments with equipment checks, a range routine, and a calm competition plan.',
      summary:
        'Archery tournament preparation is mostly about familiarity. Checked equipment, a rehearsed routine, and a simple plan reduce surprises and help you focus on the shot.',
      points: [
        'Check bow, arrows, string, and accessories before travelling.',
        'Bring spare parts and tools.',
        'Rehearse the competition shot routine.',
        'Plan food, water, and rest for a long day.',
        'Focus on process goals rather than score.',
      ],
      drills: [
        'Equipment check — inspect all gear and spares.',
        'Routine rehearsal — shoot a full set using the competition routine.',
        'Pressure practice — shoot with a timer or an audience.',
        'Range walk-through — visualise the venue and schedule.',
      ],
      mistakes: [
        'Trying new equipment at the tournament.',
        'Rushing the shot routine because of the clock.',
        'Ignoring hydration and fatigue over a long day.',
      ],
      faqs: [
        ['What should I bring to an archery tournament?', 'Bow, arrows, spare string, tools, arm guard, tab, water, snacks, and weather-appropriate clothing.'],
        ['How do I handle a long competition day?', 'Pace your energy, hydrate, eat familiar food, and stick to your routine.'],
      ],
    },
  ],
};

export default category;
