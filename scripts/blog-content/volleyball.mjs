const category = {
  key: 'volleyball',
  label: 'Volleyball',
  venue: 'an indoor volleyball court, beach court, or training gym with a safe net setup',
  demand:
    'repeated jumps, lateral shuffles, overhead reaching, and short explosive contacts separated by brief rallies and quick transitions',
  equipment: [
    'Volleyball',
    'Knee pads',
    'Court shoes with grip',
    'Ankle support (optional)',
    'Net and antenna set',
    'Agility ladder',
  ],
  injuries: ['ankle sprains', 'jumper’s knee', 'shoulder overuse', 'finger jamming'],
  terms: [
    ['Pass', 'The first contact after the serve, used to control the ball to the setter.'],
    ['Set', 'The second contact that positions the ball for an attacker.'],
    ['Dig', 'A defensive contact against a hard-driven ball.'],
    ['Rotation', 'The clockwise movement of players through six court positions after winning serve.'],
  ],
  tools: [
    { label: 'Basketball Vertical Jump Analyzer', slug: 'basketball-vertical-jump-analyzer' },
    { label: 'Heart Rate Calculator', slug: 'heart-rate-calculator' },
    { label: 'Training Load Calculator', slug: 'training-load-calculator' },
  ],
  posts: [
    {
      slug: 'volleyball-beginner-basics',
      title: 'Volleyball for Beginners: Rules, Roles, and First Contacts (2026)',
      description:
        'Learn volleyball basics including rotations, the three-contact rule, passing, setting, and serving with simple beginner drills.',
      summary:
        'Volleyball beginners should learn the three-contact rhythm and a reliable forearm pass before chasing spikes. A simple base position and calm contacts make the game understandable and enjoyable from the first session.',
      points: [
        'Use a forearm pass for the first contact and aim high toward the setter.',
        'Call the ball early to avoid collisions and hesitation.',
        'Learn the six rotations so you know where to stand and when to move.',
        'Serve underhand or with a simple float serve until the motion is repeatable.',
        'Move to the ball before contact rather than reaching with your arms.',
      ],
      drills: [
        'Self-pass ladder — pass the ball to yourself ten times, alternating height and control.',
        'Partner pass-and-set — pass, set, and catch with a partner for twenty repetitions.',
        'Serve-target practice — serve ten balls into a marked zone.',
        'Three-contact rally — play cooperative rallies using pass, set, and free ball.',
      ],
      mistakes: [
        'Swinging the arms at the ball instead of using the legs to get into position.',
        'Standing upright and flat-footed before the serve.',
        'Trying to spike before passing and setting are consistent.',
      ],
      faqs: [
        ['How many touches are allowed?', 'Each team may contact the ball up to three times before sending it over. A block does not count as one of the three touches.'],
        ['What should a beginner learn first?', 'The forearm pass and ready position. Everything else depends on controlling the first contact.'],
      ],
    },
    {
      slug: 'volleyball-passing',
      title: 'Volleyball Passing: Platform Control and First-Contact Accuracy (2026)',
      description:
        'Improve volleyball passing with a stable platform, early movement, and simple cues that send the ball to the setter.',
      summary:
        'Volleyball passing is the foundation of every attack. A stable platform, quiet shoulders, and early movement let you control the first contact and give the setter a playable ball.',
      points: [
        'Lock the arms early and form a flat platform with the thumbs together.',
        'Move the feet to the ball so the platform stays in front of the body.',
        'Angle the platform toward the setter and use the legs to lift the ball.',
        'Keep the shoulders quiet and avoid swinging the arms after contact.',
        'Call the ball loudly and early to establish ownership.',
      ],
      drills: [
        'Wall passing — pass against a wall continuously, aiming for a consistent height.',
        'Partner pass to target — pass to a setter target from different angles.',
        'Serve-receive reps — receive ten serves and score each pass for accuracy.',
        'Lateral shuffle pass — shuffle to a fed ball and pass without crossing the feet.',
      ],
      mistakes: [
        'Bending the elbows and swinging at the ball.',
        'Letting the platform drift outside the body, which sends the ball sideways.',
        'Standing too far back and reaching forward instead of moving early.',
      ],
      faqs: [
        ['Why do my passes go too high?', 'A too-high pass usually comes from an open platform angle or too much leg drive. Aim the platform flatter toward the setter.'],
        ['Should I pass with straight arms?', 'Yes, the elbows should be relatively straight and locked before contact so the platform stays stable.'],
      ],
    },
    {
      slug: 'volleyball-setting',
      title: 'Volleyball Setting: Hand Position, Footwork, and Decisions (2026)',
      description:
        'Set with cleaner hands and better footwork, including back sets, quick sets, and out-of-system decisions.',
      summary:
        'Volleyball setting is about consistency and deception. Good setters arrive early, shape their hands around the ball, and choose an attack that matches the pass and the block.',
      points: [
        'Get to the ball early so you can set with balanced feet and a stable base.',
        'Shape the hands into a window above the forehead and contact with all fingers.',
        'Push through the ball with the legs and arms together rather than flicking the wrists.',
        'Turn the shoulders toward the target on back sets to disguise the direction.',
        'Decide early based on the pass, the hitter, and the opponent’s block.',
      ],
      drills: [
        'Wall setting — set against a wall with a consistent contact point.',
        'Partner set-and-catch — set to a partner who catches and returns.',
        'Back-set target — set to a target behind you and check the arc.',
        'Transition setting — start from defence and set a fed ball to the outside.',
      ],
      mistakes: [
        'Contacting the ball behind the head and pushing it forward.',
        'Using only the wrists and losing power and accuracy.',
        'Setting every ball to the same hitter, which makes the attack predictable.',
      ],
      faqs: [
        ['How do I stop double contacts?', 'Keep the hands close together and contact the ball simultaneously. Slower, cleaner reps build the feel.'],
        ['When should I set the middle?', 'Set the middle when the pass allows a quick attack and the middle blocker is out of position. Respect the pass quality first.'],
      ],
    },
    {
      slug: 'volleyball-spiking',
      title: 'Volleyball Spiking: Approach, Arm Swing, and Contact (2026)',
      description:
        'Develop a more powerful volleyball spike with a consistent approach, full arm swing, and better contact point.',
      summary:
        'A strong volleyball spike is built on rhythm, not raw jumping ability. A consistent approach, an aggressive arm swing, and contact in front of the shoulder turn good sets into points.',
      points: [
        'Use a three- or four-step approach and accelerate through the last two steps.',
        'Swing both arms back and up to load the jump and the attack.',
        'Reach high with the hitting hand and contact the ball in front of the shoulder.',
        'Snap the wrist through the ball and finish with the hand pointing at the target.',
        'Land on both feet with bent knees to absorb force and prepare for the next play.',
      ],
      drills: [
        'Approach footwork — rehearse the steps without a ball, focusing on rhythm.',
        'Spike from a box — hit from a lower box to isolate the arm swing and contact.',
        'Partner toss spike — approach and hit a tossed ball to a target zone.',
        'Approach-and-land — jump repeatedly and hold the landing to build control.',
      ],
      mistakes: [
        'Taking a long, slow approach that arrives late to the ball.',
        'Contacting the ball behind the shoulder, which reduces power and control.',
        'Landing on one leg and drifting into the net or a teammate.',
      ],
      faqs: [
        ['How do I jump higher for a spike?', 'Improve approach timing and lower-body strength first. Jump training helps, but a well-timed approach often adds more than raw power.'],
        ['Where should I aim my spike?', 'Aim for the deep corners and the gaps between defenders. Hitting straight into a block or the middle of the court is low percentage.'],
      ],
    },
    {
      slug: 'volleyball-blocking',
      title: 'Volleyball Blocking: Footwork, Hand Position, and Reading (2026)',
      description:
        'Learn volleyball blocking technique, from the ready position and footwork to penetrating hands and reading the setter.',
      summary:
        'Volleyball blocking starts with reading the play and moving early. A blocker who arrives balanced with penetrating hands can take away space even without a perfect jump.',
      points: [
        'Watch the setter’s hands and shoulders to predict the attack direction.',
        'Use a short shuffle or cross-step to get in front of the hitter before jumping.',
        'Press the hands over the net with fingers spread and thumbs close together.',
        'Keep the eyes on the hitter’s arm and adjust the block to the swing.',
        'Land balanced and transition quickly to defence or the next attack.',
      ],
      drills: [
        'Block-footwork ladder — shuffle and cross-step along the net without jumping.',
        'Wall block holds — press the hands against a wall and hold the penetration position.',
        'Read-the-setter drill — a setter sets different hitters while you call the block direction.',
        'Live block touches — block a controlled attack and focus on hand position.',
      ],
      mistakes: [
        'Jumping too early and dropping the hands before the hitter swings.',
        'Reaching across the net and committing a net fault.',
        'Landing off balance and taking too long to transition.',
      ],
      faqs: [
        ['Should I try to block every ball?', 'No. Read the set and the hitter. A disciplined block that takes away the best option is better than chasing every attack.'],
        ['How do I avoid net faults?', 'Jump vertically and press over the net without reaching across. Keep your landing under control.'],
      ],
    },
    {
      slug: 'volleyball-serving',
      title: 'Volleyball Serving: Float, Jump Float, and Standing Serve (2026)',
      description:
        'Serve with more consistency and purpose using the float serve, jump float, and a repeatable toss.',
      summary:
        'A reliable volleyball serve puts pressure on the opponent without giving away free points. The float serve is the best starting point because it is accurate, difficult to pass, and mechanically simple.',
      points: [
        'Use a consistent toss that stays in front of the hitting shoulder.',
        'Contact the ball with a firm, flat hand through the middle for a float serve.',
        'Keep the arm swing short and repeatable rather than trying to hit it as hard as possible.',
        'Aim for seams and deep zones instead of the libero.',
        'Serve to a plan: target a player or a zone based on the opponent’s formation.',
      ],
      drills: [
        'Toss-and-catch — rehearse the toss ten times without hitting.',
        'Serve-target zones — serve ten balls into each of three marked areas.',
        'Pressure serving — serve ten in a row with a consequence for each miss.',
        'Jump-float progression — start with a standing float, then add a small jump.',
      ],
      mistakes: [
        'Tossing the ball too far back or too high and losing timing.',
        'Hitting the ball with a wrist snap that reduces float movement.',
        'Serving without a target and giving the opponent an easy first contact.',
      ],
      faqs: [
        ['What is a float serve?', 'A serve hit with a firm, flat hand that creates little spin, causing the ball to move unpredictably in the air.'],
        ['Should beginners jump serve?', 'Not until the standing serve is consistent. The standing float gives more control and fewer errors.'],
      ],
    },
    {
      slug: 'volleyball-digging',
      title: 'Volleyball Digging: Defence, Platform Angle, and Reactions (2026)',
      description:
        'Dig hard-driven attacks with a stable base, correct platform angle, and better reaction to the hitter’s arm.',
      summary:
        'Volleyball digging is a reaction skill supported by good positioning. Defenders who stay low, watch the hitter’s arm, and angle the platform toward the target give their team a chance to counter.',
      points: [
        'Start in a low, balanced defensive stance with the weight on the balls of the feet.',
        'Read the hitter’s approach and arm swing rather than the ball after contact.',
        'Keep the platform in front and angle it toward the setter or target.',
        'Absorb hard hits with soft arms instead of swinging through the ball.',
        'Stay low after the dig and transition immediately to the next play.',
      ],
      drills: [
        'Coach-driven digs — dig balls hit from a box at increasing speed.',
        'Dig-to-target — dig ten attacks and score the accuracy of the deflection.',
        'Reaction ball drill — use a reaction ball to improve hand-eye response.',
        'Defence-to-transition — dig, then move into an attack approach.',
      ],
      mistakes: [
        'Standing tall and getting beaten under the arms.',
        'Swinging the arms at a hard-driven ball instead of holding the platform.',
        'Watching the ball instead of the hitter’s arm before contact.',
      ],
      faqs: [
        ['How do I dig a hard spike?', 'Stay low, get the platform behind the ball, and let the ball rebound. Trying to swing at a hard attack usually sends it out of control.'],
        ['Where should defenders stand?', 'Position based on the block and the hitter’s tendencies. Good defenders adjust before the attack rather than after.'],
      ],
    },
    {
      slug: 'volleyball-footwork',
      title: 'Volleyball Footwork: Shuffles, Crossovers, and Court Movement (2026)',
      description:
        'Move better on the volleyball court with shuffle steps, crossovers, and efficient transitions between defence and attack.',
      summary:
        'Volleyball footwork is about arriving balanced and early. Shuffles, crossovers, and a consistent transition pattern keep players in position and reduce collisions.',
      points: [
        'Stay low with the hips back and the feet active before the ball is contacted.',
        'Use shuffle steps for short distances and crossovers for longer ranges.',
        'Keep the feet moving through contact instead of stopping flat-footed.',
        'Use a drop step to open the hips when moving backward.',
        'Practise transitions from defence to attack so the movement becomes automatic.',
      ],
      drills: [
        'Ladder series — two-step, lateral, and in-out patterns through an agility ladder.',
        'Shuffle-and-reach — shuffle to cones and reach as if passing.',
        'Defence-to-approach — dig a fed ball, then transition into a spike approach.',
        'Mirror drill — a partner moves side to side while you mirror the footwork.',
      ],
      mistakes: [
        'Crossing the feet on short movements and losing balance.',
        'Standing upright and reaching with the arms instead of moving the feet.',
        'Stopping after contact and being late for the next play.',
      ],
      faqs: [
        ['What is the most important footwork pattern?', 'The shuffle step, because it keeps the body balanced and the platform stable for passing and defence.'],
        ['How can I move faster on the court?', 'Improve your ready position and reaction time. Faster movement starts before the ball is hit.'],
      ],
    },
    {
      slug: 'volleyball-rotation-system',
      title: 'Volleyball Rotations: The 5-1 System Explained (2026)',
      description:
        'Understand volleyball rotations, the 5-1 system, base positions, and the overlap rules that govern legal alignment.',
      summary:
        'Volleyball rotations determine where players stand and who attacks from which position. Learning the 5-1 system and the overlap rules removes confusion and prevents costly alignment faults.',
      points: [
        'Learn the six base positions and the clockwise rotation after winning serve.',
        'Understand the front-row and back-row overlap rules before serving.',
        'In a 5-1, the setter plays opposite the middle blocker in the front row.',
        'Back-row players cannot attack in front of the attack line.',
        'Communicate substitutions and libero replacements clearly.',
      ],
      drills: [
        'Rotation walk-through — move through all six rotations without a ball.',
        'Overlap check — serve and call the alignment before each point.',
        'Serve-receive positioning — set up the serve-receive formation for each rotation.',
        'Substitution rehearsal — practise libero and substitute entries.',
      ],
      mistakes: [
        'Standing out of rotation and giving away a point on an overlap fault.',
        'Forgetting which player is the setter in a given rotation.',
        'Back-row attackers leaving the ground in front of the attack line.',
      ],
      faqs: [
        ['What is a 5-1 rotation?', 'A system using one setter for all six rotations, with five hitters. It provides consistency but requires the setter to play front and back row.'],
        ['What is an overlap fault?', 'An illegal alignment where players are not in the correct relative positions at the moment of serve. The referee signals a fault and awards the point.'],
      ],
    },
    {
      slug: 'volleyball-serve-receive',
      title: 'Volleyball Serve Receive: Formations and First-Contact Control (2026)',
      description:
        'Build a reliable volleyball serve-receive formation with clear responsibilities, communication, and target passing.',
      summary:
        'Serve receive determines whether a team can run its offence. Clear seams, early communication, and a simple target give the setter the best chance to run a varied attack.',
      points: [
        'Assign seams clearly so two players never hesitate on the same ball.',
        'Keep the passing platform ready and the feet active before the serve.',
        'Pass high to the setter’s target area rather than trying to pass perfectly every time.',
        'Adjust the formation based on the server’s angle and power.',
        'Communicate early with a simple call system to establish ownership.',
      ],
      drills: [
        'Three-person serve receive — pass ten serves and score each to a target.',
        'Seam drill — receive serves aimed at the gap between two passers.',
        'Serve-receive to attack — pass, set, and attack in a live sequence.',
        'Pressure receive — receive ten serves with a consequence for each error.',
      ],
      mistakes: [
        'Two players stepping toward the same ball and leaving a seam open.',
        'Standing too deep or too shallow for the server’s power.',
        'Passing too flat and limiting the setter’s options.',
      ],
      faqs: [
        ['How many passers should a team use?', 'Most teams use two or three primary passers depending on the level and formation. The key is clear responsibility.'],
        ['What is a good pass height?', 'High enough for the setter to move under it, usually around two to three metres above the net.'],
      ],
    },
    {
      slug: 'volleyball-transition-play',
      title: 'Volleyball Transition Play: Defence to Attack in Seconds (2026)',
      description:
        'Improve volleyball transition play by linking digs and blocks to a fast, organised counter-attack.',
      summary:
        'Volleyball transition is the moment a defensive play becomes an attacking opportunity. Teams that organise quickly after a dig or block turn rallies into points before the opponent can reset.',
      points: [
        'Land from the block or dig ready to move, not flat-footed.',
        'Call the ball early and send a high, playable first contact to the setter.',
        'The setter should move to the target area immediately after the defensive contact.',
        'Hitters transition off the net and prepare their approach before the set arrives.',
        'Prioritise a good first contact over a perfect attack; transition starts with control.',
      ],
      drills: [
        'Dig-to-attack — dig a fed ball, transition, and attack in one sequence.',
        'Block-to-transition — block, land, and move into an approach.',
        'Transition rally — play live rallies starting from a defensive contact.',
        'Three-contact transition — force a dig, set, and attack within a time limit.',
      ],
      mistakes: [
        'Watching the dig instead of moving into the next action.',
        'The setter waiting for the ball instead of moving to the target early.',
        'Hitters starting their approach too late and arriving under the ball.',
      ],
      faqs: [
        ['Why is transition so important?', 'Most rallies are won or lost in transition because the defence is scrambled and the attack can be quick. Organised transition creates easy points.'],
        ['What should the setter do after a dig?', 'Move immediately to the setting target, call the play, and give the hitters a clear cue.'],
      ],
    },
    {
      slug: 'volleyball-beach-volleyball',
      title: 'Beach Volleyball: Movement, Partner Play, and Wind (2026)',
      description:
        'Adapt your game to beach volleyball with sand-specific movement, partner communication, and wind-aware tactics.',
      summary:
        'Beach volleyball rewards patience, communication, and adaptable movement. The sand slows the game slightly but demands more endurance, and the wind changes every tactical decision.',
      points: [
        'Move with shorter steps and keep the feet active to avoid sinking in the sand.',
        'Communicate constantly with your partner about seams and responsibilities.',
        'Use high, deep serves to exploit the wind and keep the opponent off the net.',
        'Attack with placement and angle rather than trying to overpower the block.',
        'Practise setting in the wind and adjust the contact point accordingly.',
      ],
      drills: [
        'Sand shuffle drill — move laterally through cones with short, quick steps.',
        'Partner serve-receive — pass, set, and attack with only two players.',
        'Wind-adjustment serves — serve with and against the wind and note the difference.',
        'Two-touch rally — play rallies where every ball must be controlled by both players.',
      ],
      mistakes: [
        'Using indoor footwork that is too long for the sand.',
        'Leaving seams undefined and colliding with a partner.',
        'Ignoring the wind when serving or setting.',
      ],
      faqs: [
        ['How is beach volleyball scored?', 'Most beach matches are best of three sets, with the first two sets played to 21 and the deciding set to 15, all with a two-point margin.'],
        ['Do I need different shoes?', 'Beach players usually play barefoot. If you wear shoes, choose a light pair that does not trap sand.'],
      ],
    },
    {
      slug: 'volleyball-libero-play',
      title: 'Volleyball Libero Play: Responsibilities and Serve Receive (2026)',
      description:
        'Understand the volleyball libero role, replacement rules, passing responsibilities, and how to excel as a defensive specialist.',
      summary:
        'The volleyball libero is a defensive specialist who stabilises serve receive and defence. Great liberos communicate early, pass accurately, and bring energy without needing to attack.',
      points: [
        'Wear a contrasting jersey and enter the court only during a legal replacement.',
        'Take responsibility for the seams and communicate ownership early.',
        'Pass high and accurately to the setter’s target.',
        'Read the hitter’s arm and position yourself before the attack.',
        'Bring consistent energy and organisation to the back row.',
      ],
      drills: [
        'Serve-receive reps — pass twenty serves and score accuracy.',
        'Dig-and-transition — dig a fed attack and move into a support position.',
        'Seam communication — receive serves aimed between passers while calling the ball.',
        'Replacement rehearsal — practise legal libero entries and exits.',
      ],
      mistakes: [
        'Replacing incorrectly and causing a delay or fault.',
        'Trying to do too much and taking balls that belong to a teammate.',
        'Neglecting communication because the role feels individual.',
      ],
      faqs: [
        ['Can a libero serve?', 'In many indoor rules, yes, but only in one rotation. Check your competition’s regulations.'],
        ['Can a libero attack?', 'No. A libero cannot complete an attack hit from anywhere on the court if the ball is entirely above the net.'],
      ],
    },
    {
      slug: 'volleyball-team-communication',
      title: 'Volleyball Team Communication: Calls, Systems, and Trust (2026)',
      description:
        'Build clearer volleyball communication with simple calls, seam responsibility, and routines that reduce collisions.',
      summary:
        'Volleyball communication prevents collisions, organises the defence, and keeps five players connected to the same plan. Simple, early calls are more useful than complicated systems.',
      points: [
        'Use a short, consistent call for ownership: mine, yours, or a name.',
        'Call the ball before it crosses the net, not at the last moment.',
        'Assign seams and transition responsibilities before the serve.',
        'Use hand signals for blocking and defensive schemes.',
        'Reinforce good communication with positive feedback, not only corrections.',
      ],
      drills: [
        'Silent-to-vocal drill — play a rally where every contact must be called aloud.',
        'Seam ownership — feed balls into gaps and require an early call.',
        'Block-signal practice — rehearse hand signals before each serve.',
        'Team huddle routine — practise a short between-point reset.',
      ],
      mistakes: [
        'Calling the ball too late and forcing a teammate to guess.',
        'Using different words for the same action, which creates hesitation.',
        'Going silent after an error instead of resetting the team.',
      ],
      faqs: [
        ['What should players call?', 'Keep it simple: mine, yours, help, and the play name. Consistency matters more than variety.'],
        ['How do we reduce collisions?', 'Assign seams in advance and require early calls. Most collisions come from late communication, not poor movement.'],
      ],
    },
    {
      slug: 'volleyball-conditioning',
      title: 'Volleyball Conditioning: Jumping, Speed, and Repeat Efforts (2026)',
      description:
        'Build volleyball conditioning with jump training, short court sprints, and strength work that supports repeated efforts.',
      summary:
        'Volleyball conditioning should prepare players for repeated jumps and short bursts rather than long runs. Strength, landing control, and recovery between rallies matter most.',
      points: [
        'Train short accelerations and lateral movement that match court demands.',
        'Include jump and landing practice with an emphasis on soft, controlled landings.',
        'Build lower-body strength to support jumping and change of direction.',
        'Strengthen the shoulder and scapular muscles for repeated attacks.',
        'Allow full recovery between high-quality efforts so technique stays clean.',
      ],
      drills: [
        'Court sprint intervals — six 20-metre sprints with full recovery.',
        'Jump-and-stick — five jumps per set, holding each landing for two seconds.',
        'Lateral shuffle series — three sets of twenty seconds per direction.',
        'Strength circuit — split squats, step-ups, rows, and band external rotations.',
      ],
      mistakes: [
        'Running long distances and neglecting explosive qualities.',
        'Jumping on tired legs without attention to landing mechanics.',
        'Adding conditioning during a heavy competition week.',
      ],
      faqs: [
        ['How often should volleyball players jump train?', 'Two or three short sessions per week is usually enough. Quality and recovery matter more than volume.'],
        ['Is strength training safe for young players?', 'Yes, with appropriate supervision, technique, and load. Bodyweight and light resistance are a good starting point.'],
      ],
    },
    {
      slug: 'volleyball-jump-training',
      title: 'Volleyball Jump Training: Approach Timing and Landing Control (2026)',
      description:
        'Add height and control to your volleyball jump with approach timing, strength work, and safe landing mechanics.',
      summary:
        'Volleyball jump training is not just about adding centimetres; it is about arriving at the right time and landing safely. Better timing often produces more effective attacks than raw vertical gain.',
      points: [
        'Time the approach so you are still rising when you contact the ball.',
        'Use a penultimate step that is long and low, then a fast final step into the jump.',
        'Swing the arms aggressively to add momentum without losing balance.',
        'Land on both feet with bent knees and the hips back.',
        'Build strength and elasticity gradually with consistent jump sessions.',
      ],
      drills: [
        'Approach-timing drill — approach and jump to a target without a ball.',
        'Box jumps — three sets of five controlled jumps with a soft landing.',
        'Split-squat jumps — three sets of six per leg with full recovery.',
        'Spike-timing drill — hit a tossed ball while a coach calls the timing.',
      ],
      mistakes: [
        'Jumping too early and contacting the ball on the way down.',
        'Landing stiff-legged and shifting weight onto the toes.',
        'Adding jump volume too quickly and irritating the knees or tendons.',
      ],
      faqs: [
        ['How much can I improve my vertical jump?', 'With consistent strength and jump training, many players gain several centimetres over a season. Genetics and training age matter.'],
        ['Do I need special equipment?', 'No. Bodyweight jumps, a box, and a safe surface are enough to start. Add resistance only with qualified guidance.'],
      ],
    },
    {
      slug: 'volleyball-injury-prevention',
      title: 'Volleyball Injury Prevention: Ankles, Knees, and Shoulders (2026)',
      description:
        'Reduce volleyball injuries with ankle stability work, knee-friendly landing mechanics, and shoulder care for repeated spikes.',
      summary:
        'Volleyball injuries cluster around the ankle, knee, and shoulder. Consistent strength work, good landings, and sensible training loads protect the joints that absorb the most repeated stress.',
      points: [
        'Build ankle stability with balance and hopping exercises.',
        'Practise landing with the knees tracking over the toes.',
        'Strengthen the rotator cuff and scapular muscles for overhead hitting.',
        'Warm up the shoulders before serving and attacking.',
        'Increase jump and spike volume gradually rather than in spikes.',
      ],
      drills: [
        'Single-leg balance — thirty seconds per side with eyes open, then closed.',
        'Lateral hop-and-stick — five hops per direction with a two-second hold.',
        'Band external rotation — three sets of twelve per arm.',
        'Wall slides — two sets of ten for scapular control.',
      ],
      mistakes: [
        'Wearing loose ankle support that does not fit properly.',
        'Landing on one leg and drifting into the net or a teammate.',
        'Ignoring shoulder pain because it only appears when hitting.',
      ],
      faqs: [
        ['Are ankle braces necessary?', 'They can help players with a history of sprains, but strength and balance work are the foundation. Use braces under professional guidance.'],
        ['What causes jumper’s knee?', 'Repeated jumping and landing with insufficient recovery can irritate the patellar tendon. Load management and strength work are key.'],
      ],
    },
    {
      slug: 'volleyball-knee-pads',
      title: 'Volleyball Knee Pads: Fit, Protection, and When to Wear Them (2026)',
      description:
        'Choose volleyball knee pads that stay in place, protect the knees during floor defence, and do not restrict movement.',
      summary:
        'Volleyball knee pads protect the knees during digs and floor play, but a poor fit can restrict movement or slide out of position. The right pair balances padding, grip, and breathability.',
      points: [
        'Choose a pad that stays in place when you kneel and move laterally.',
        'Prioritise padding over the kneecap without making the pad bulky.',
        'Check the sleeve or strap system so it does not cut off circulation.',
        'Wash pads regularly and replace them when the padding compresses.',
        'Some players prefer sleeves for movement; use what supports your role and comfort.',
      ],
      drills: [
        'Kneel-and-slide check — kneel and move sideways to test whether the pad stays put.',
        'Dig rehearsal — practise floor defence with the pads you will wear in matches.',
        'Fit comparison — try two sizes and compare restriction and stability.',
        'Care routine — wash after each session and air-dry fully.',
      ],
      mistakes: [
        'Buying pads that are too loose and slide down during play.',
        'Choosing the thickest pad available and losing knee mobility.',
        'Wearing worn-out pads that no longer absorb impact.',
      ],
      faqs: [
        ['Are knee pads required?', 'Rules vary by competition, but most indoor players wear them for floor defence. Check your league’s requirements.'],
        ['Can knee pads prevent injury?', 'They reduce impact and abrasion but do not replace strength, technique, and load management.'],
      ],
    },
    {
      slug: 'volleyball-youth-development',
      title: 'Volleyball Youth Development: Skills Before Systems (2026)',
      description:
        'A youth volleyball development plan that prioritises movement, ball control, and enjoyment before complex systems.',
      summary:
        'Young volleyball players develop best through broad movement, lots of ball contacts, and simple games. Complex rotations and heavy jump volume can wait until the fundamentals are secure.',
      points: [
        'Build general athleticism with running, jumping, and throwing games.',
        'Give every player experience passing, setting, and attacking.',
        'Keep sessions game-based so decision-making develops alongside technique.',
        'Limit repeated jump volume and emphasise landing control.',
        'Celebrate effort and improvement rather than early results.',
      ],
      drills: [
        'Cooperative rally game — keep the ball alive as a team for as many contacts as possible.',
        'Mini-volleyball — smaller courts and lower nets for more contacts.',
        'Pass-and-move game — pass, move to a new position, and receive again.',
        'Jump-and-land circuit — low-volume jumps with a focus on soft landings.',
      ],
      mistakes: [
        'Specialising players into one position too early.',
        'Using adult rotations before players can pass and set.',
        'Measuring success only by winning youth matches.',
      ],
      faqs: [
        ['When should kids specialise?', 'Most development guidance suggests delaying specialisation until late adolescence. Early variety builds better all-round athletes.'],
        ['How much should youth players jump?', 'Keep volume modest and focus on technique. Young players should not be doing adult-level jump programmes.'],
      ],
    },
    {
      slug: 'volleyball-tournament-preparation',
      title: 'Volleyball Tournament Preparation: Taper, Scouting, and Routine (2026)',
      description:
        'Prepare for a volleyball tournament with a sensible taper, opponent scouting, match routines, and recovery planning.',
      summary:
        'Volleyball tournament preparation is about arriving fresh and organised. A short taper, a clear scouting report, and a repeatable warm-up reduce uncertainty and help teams perform under pressure.',
      points: [
        'Reduce jump and high-intensity volume in the final week.',
        'Scout opponents for serving tendencies, favourite hitters, and blocking schemes.',
        'Write a short game plan with two or three tactical priorities.',
        'Rehearse the exact warm-up and between-set routine you will use.',
        'Plan hydration, snacks, and rest between matches.',
      ],
      drills: [
        'Scored practice sets — play first-to-15 games with a specific tactical focus.',
        'Serve-pressure routine — serve ten balls with a consequence for each error.',
        'Warm-up rehearsal — run the tournament warm-up at the same pace.',
        'Between-set reset — practise a short team huddle and cue.',
      ],
      mistakes: [
        'Training harder than usual in the days before the event.',
        'Trying a new rotation or serve at the tournament.',
        'Ignoring recovery between pool matches.',
      ],
      faqs: [
        ['How long should a volleyball taper be?', 'Three to seven days of reduced volume works for most players. Keep some short intensity so timing stays sharp.'],
        ['What should I eat between matches?', 'Familiar carbohydrate and protein snacks, plus fluids. Avoid trying new foods on match day.'],
      ],
    },
  ],
};

export default category;
