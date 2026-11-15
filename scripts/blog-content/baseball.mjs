const category = {
  key: 'baseball',
  label: 'Baseball',
  venue: 'a baseball diamond, batting cage, or open training field with a safe throwing area',
  demand:
    'explosive rotational swings, repeated accelerations and decelerations, overhand throwing, and long periods of standing that precede sudden sprint efforts',
  equipment: [
    'Glove',
    'Bat',
    'Batting helmet',
    'Cleats or turf shoes',
    'Baseballs',
    'Batting tee',
  ],
  injuries: ['shoulder strain', 'elbow ligament stress', 'hamstring strain', 'ankle sprain'],
  terms: [
    ['OPS', 'On-base percentage plus slugging percentage, a compact measure of overall hitting value.'],
    ['Cut-off', 'An infielder positioned to relay a throw from the outfield to a base.'],
    ['Double play', 'Two outs recorded on a single continuous play.'],
    ['Lead-off', 'The initial distance a runner takes from a base before the pitch is delivered.'],
  ],
  tools: [
    { label: 'One-Rep Max Calculator', slug: 'one-rep-max-calculator' },
    { label: 'Heart Rate Calculator', slug: 'heart-rate-calculator' },
    { label: 'Injury Risk Calculator', slug: 'injury-risk-calculator' },
  ],
  posts: [
    {
      slug: 'baseball-beginner-basics',
      title: 'Baseball for Beginners: Rules, Positions, and First Skills (2026)',
      description:
        'A beginner baseball guide covering the basic rules, field positions, throwing, catching, and the first drills to practise.',
      summary:
        'Baseball can look complicated from the stands, but the game rests on a handful of repeatable skills: throwing, catching, hitting, and running the bases. Learning those fundamentals first makes the rules much easier to understand.',
      points: [
        'Learn the catch with two hands and a relaxed glove hand before worrying about transfer speed.',
        'Throw with a proper four-seam grip and point the front shoulder at the target.',
        'Stand in a balanced batting stance with the bat off the shoulder and the knees soft.',
        'Run through first base, but round the bag on the inside line when a further base is possible.',
        'Learn one position at a time so you understand its responsibilities and cut-off roles.',
      ],
      drills: [
        'Partner catch at 10-15 metres — focus on routine, target, and a clean transfer.',
        'Tee swings — hit ten balls from a tee, checking balance and contact point.',
        'Four-corner base running — run the bases at controlled speed while practising turns.',
        'Ground-ball ready position — a coach rolls balls while you work through the approach and fielding triangle.',
      ],
      mistakes: [
        'Throwing with the body facing the target instead of rotating through the throw.',
        'Swinging with only the arms and ignoring the lower half.',
        'Watching the ball after a hit instead of accelerating out of the box.',
      ],
      faqs: [
        ['What is the easiest position for a beginner?', 'Outfield or first base usually involves fewer complex decisions early on. Choose based on the coach’s needs and your throwing ability.'],
        ['How do I learn the strike zone?', 'Use a plate-sized target in batting practice and track every pitch. Repetition with feedback is the fastest way to build a reliable zone.'],
      ],
    },
    {
      slug: 'baseball-batting-stance',
      title: 'Baseball Batting Stance: Balance, Grip, and Setup (2026)',
      description:
        'Build a repeatable baseball batting stance with a balanced base, relaxed grip, and efficient pre-swing movement.',
      summary:
        'A good baseball batting stance is stable enough to generate force and athletic enough to adjust to different pitches. The goal is not a perfect pose but a repeatable starting point that delivers the barrel on time.',
      points: [
        'Stand with feet slightly wider than the shoulders and weight centred over the middle of the feet.',
        'Grip the bat in the fingers, not the palms, with the knocking knuckles roughly aligned.',
        'Hold the bat off the shoulder with the elbows relaxed and the hands around shoulder height.',
        'Keep the head still and the eyes level through the stride and load.',
        'Use a short stride or a simple leg lift that arrives before the swing begins.',
      ],
      drills: [
        'Mirror stance check — use a mirror or phone camera to review alignment from the side and front.',
        'Tee work with pause — set the stance, pause, then swing to reinforce the sequence.',
        'Balance holds — hold the finish position for three seconds after each swing.',
        'Stride-repeat drill — rehearse the load and stride ten times without swinging.',
      ],
      mistakes: [
        'Standing too narrow and losing stability against the swing.',
        'Gripping the bat too tightly, which slows the hands and tightens the forearms.',
        'Overstriding and drifting past the front foot before contact.',
      ],
      faqs: [
        ['Should I use a leg kick?', 'Only if it is consistent and does not delay the swing. A small lift works for many hitters; a big kick demands excellent timing.'],
        ['How far should I stand from the plate?', 'Far enough that the barrel can cover the outside corner while the hands stay comfortable. Adjust in small steps during practice.'],
      ],
    },
    {
      slug: 'baseball-swing-mechanics',
      title: 'Baseball Swing Mechanics: Sequencing, Barrel Path, and Timing (2026)',
      description:
        'Understand baseball swing mechanics from ground force through hip rotation and barrel delivery without overcomplicating your cues.',
      summary:
        'A productive baseball swing transfers energy from the ground through the hips, trunk, and hands into the barrel. Clean sequencing produces power with less effort and keeps the bat on plane longer.',
      points: [
        'Start the swing with the back hip and lower half while the hands stay back briefly.',
        'Keep the front side firm so the body rotates around a stable axis rather than sliding forward.',
        'Keep the barrel above the ball on the approach and let it work through the strike zone.',
        'Match the swing plane to the pitch height instead of trying to lift everything.',
        'Finish balanced with the weight mostly on the front side and the chest facing the pitcher.',
      ],
      drills: [
        'Hip-turn drill — swing with the hands held back to feel the lower body lead the sequence.',
        'Two-tee drill — set one tee slightly ahead of the other to train a level barrel path.',
        'Front-toss — hit ten balls at moderate speed with a focus on balance and contact.',
        'Pause-and-go — pause at load, then complete the swing to reinforce timing.',
      ],
      mistakes: [
        'Starting the hands before the hips, which turns the swing into an arm-only motion.',
        'Dropping the back shoulder and uppercutting every pitch.',
        'Overthinking mechanical cues during a game instead of trusting one simple feel.',
      ],
      faqs: [
        ['Is launch angle worth training?', 'It can help hitters optimise trajectory, but only after consistent contact and balance are established. Chasing a number before contact quality is risky.'],
        ['How many swings should I take in a session?', 'Quality matters more than quantity. Three to five focused rounds with full recovery beat hundreds of tired, sloppy swings.'],
      ],
    },
    {
      slug: 'baseball-bunting',
      title: 'Baseball Bunting: Sacrifice, Drag, and Push Techniques (2026)',
      description:
        'Learn baseball bunting fundamentals, including bat angle, plate coverage, and the difference between sacrifice and drag bunts.',
      summary:
        'Bunting is a control skill that can move runners, score runs, and surprise a defence. Good bunters start from a stable base, get the bat out early, and use their hands to direct the ball.',
      points: [
        'Square around early enough to see the pitch, but keep the bat still until the ball arrives.',
        'Hold the bat with the bottom hand near the knob and the top hand supporting the barrel.',
        'Keep the barrel above the ball and angle it toward the desired side of the infield.',
        'Use the legs and a soft top hand to deaden the ball rather than absorbing it with stiff arms.',
        'Run out of the box immediately after contact, even on a sacrifice.',
      ],
      drills: [
        'Bunt-to-line — bunt ten balls along each foul line from a batting tee.',
        'Soft-hands catch — a partner tosses balls while you practise giving with the top hand.',
        'Sacrifice situational — runner on first, bunt to the first-base side and sprint.',
        'Drag-bunt walk-through — rehearse the pivot and push while moving out of the box.',
      ],
      mistakes: [
        'Squaring too late and getting hit or missing the pitch.',
        'Pushing the barrel at the ball instead of letting it meet the bat.',
        'Bunting a strike up in the zone when the goal is to put it on the ground.',
      ],
      faqs: [
        ['Should I bunt with two strikes?', 'Usually no. A foul bunt with two strikes is a strikeout, so most hitters swing away unless the situation demands otherwise.'],
        ['What is the best bunt direction?', 'Away from the pitcher and toward the corner you want to force the defence to cover. Placement matters more than a perfect technique.'],
      ],
    },
    {
      slug: 'baseball-base-running',
      title: 'Baseball Base Running: Leads, Turns, and Aggression (2026)',
      description:
        'Become a smarter baseball base runner with better leads, efficient turns, and decisions that pressure the defence.',
      summary:
        'Base running turns hits into extra bases and forces defences into mistakes. The best runners combine a measured lead, a strong first step, and the discipline to read the ball and the defender.',
      points: [
        'Take a lead that allows a quick return to the bag without crossing your feet.',
        'Watch the pitcher’s feet and release point rather than guessing from the upper body.',
        'Run through first base in a straight line; veer inside only after passing the bag.',
        'Use a controlled turn at second and third, lowering the centre of gravity around the base.',
        'Read the outfielder’s first movement before committing to an extra base.',
      ],
      drills: [
        'Lead-and-return — practise three leads and returns per pitcher delivery.',
        'Turn-and-look — run from home to second, practising the turn and locating the ball.',
        'First-step reaction — start from a lead when a coach calls go.',
        'Two-base read — watch fungo contact and decide whether to advance beyond first.',
      ],
      mistakes: [
        'Taking a lead so large that the first step back is slow and off balance.',
        'Watching the ball instead of the pitcher before the pitch.',
        'Rounding first base too wide and losing time on the turn.',
      ],
      faqs: [
        ['How big should my lead be?', 'Big enough to get a good start but small enough to return safely on a pickoff. It varies with the pitcher and your speed.'],
        ['When should I steal?', 'Steal when you have a good jump, the count favours you, and the catcher’s release is slow. A poor jump is worse than staying put.'],
      ],
    },
    {
      slug: 'baseball-sliding',
      title: 'Baseball Sliding: Feet-First, Head-First, and Safety (2026)',
      description:
        'Learn safe and effective baseball sliding, including the feet-first pop-up slide and when head-first slides are appropriate.',
      summary:
        'Sliding protects the legs, breaks up double plays, and lets runners reach bases faster than staying upright. Mastering one safe slide and rehearsing it repeatedly is more valuable than learning several flashy variations.',
      points: [
        'Use a feet-first slide by default because it is safer and keeps the hands protected.',
        'Start the slide early enough to reach the base, not so early that you stop short.',
        'Keep the lead leg slightly bent and the trailing leg tucked to avoid catching the ground.',
        'Use a pop-up slide to get back on your feet quickly when another base is available.',
        'Rehearse on soft ground or a sliding mat before using a hard infield.',
      ],
      drills: [
        'Mat slides — practise ten feet-first slides on a mat, focusing on a flat back and protected hands.',
        'Pop-up-to-run — slide on a mat and transition immediately into a sprint.',
        'Approach timing — walk through the final three steps before the slide to find the right distance.',
        'Catch-and-slide — slide into a base while a coach tosses a ball to simulate a close play.',
      ],
      mistakes: [
        'Sliding too late and jamming the lead foot into the base.',
        'Sliding head-first into a base with a defender blocking the path.',
        'Standing upright into a tag instead of getting low and protecting the body.',
      ],
      faqs: [
        ['Are head-first slides faster?', 'Some runners are slightly faster head-first, but the injury risk to hands, wrists, and head is higher. Most coaches prefer feet-first for safety.'],
        ['When is sliding not appropriate?', 'Avoid sliding on a wet, hard surface or when there is no close play. Deceleration and staying on your feet can be safer.'],
      ],
    },
    {
      slug: 'baseball-pitching-mechanics',
      title: 'Baseball Pitching Mechanics: Delivery, Arm Path, and Command (2026)',
      description:
        'A structured look at baseball pitching mechanics, from the wind-up through stride and release, with command-building drills.',
      summary:
        'Repeatable baseball pitching mechanics start with a controlled tempo and a clean arm path. Command improves when the lower body leads the delivery and the release point stays consistent.',
      points: [
        'Use a simple wind-up or stretch that you can repeat identically under pressure.',
        'Lead with the hips and drive down the mound rather than rushing the arm forward.',
        'Keep the throwing elbow at or below shoulder height during the arm path.',
        'Land with the lead foot pointing toward the plate and the chest moving over the front side.',
        'Finish in a balanced fielding position so you can defend the position after release.',
      ],
      drills: [
        'One-knee throwing — isolate the upper-body arm path and release from one knee.',
        'Towel drill — use a towel to rehearse arm extension without a ball.',
        'Target command — throw ten pitches at each corner from sixty feet.',
        'Tempo throws — pitch at 70 percent effort to reinforce rhythm and balance.',
      ],
      mistakes: [
        'Rushing the delivery and letting the arm lead the body.',
        'Flying open with the front shoulder before the arm is ready.',
        'Throwing at maximum effort on every practice pitch and accumulating unnecessary fatigue.',
      ],
      faqs: [
        ['How often should I pitch?', 'Respect rest guidelines for your age and level. Young pitchers in particular need strict pitch-count and recovery limits.'],
        ['Does long toss help velocity?', 'Long toss can build arm strength and throwing range when programmed sensibly, but it is not a substitute for sound mechanics and recovery.'],
      ],
    },
    {
      slug: 'baseball-pitch-types',
      title: 'Baseball Pitch Types: Fastball, Curveball, Changeup, and Slider (2026)',
      description:
        'Compare common baseball pitch types, their grips, movement, and when pitchers should learn them.',
      summary:
        'Pitch types differ in grip, spin, and intent, and each one only works when paired with command. Young pitchers should master a fastball and a changeup before adding breaking balls.',
      points: [
        'Use a four-seam fastball as the foundation because it teaches clean spin and command.',
        'Hold the changeup with a wider grip to reduce speed without changing the arm action.',
        'Throw a curveball with a consistent release and avoid twisting the wrist late.',
        'Use a slider when you can create tilt without shortening the arm path.',
        'Prioritise location and pitch sequencing over the number of pitches in your arsenal.',
      ],
      drills: [
        'Grip walk-through — rehearse each grip without throwing to build feel.',
        'Fastball-command set — ten pitches to each side of the plate.',
        'Changeup catch — play catch with a partner using only changeups.',
        'Bullpen sequencing — throw a simulated three-hitter sequence with a plan.',
      ],
      mistakes: [
        'Learning a breaking ball before throwing strikes consistently.',
        'Changing arm speed for off-speed pitches, which tips the pitch.',
        'Adding pitches to compensate for poor command instead of refining location.',
      ],
      faqs: [
        ['When should a young pitcher learn a curveball?', 'Follow your league and medical guidance. Many development programmes delay breaking balls and prioritise fastball command and athleticism.'],
        ['What is the most important pitch?', 'A well-located fastball. It sets up everything else and teaches the mechanics that all other pitches depend on.'],
      ],
    },
    {
      slug: 'baseball-catching',
      title: 'Baseball Catching: Receiving, Framing, and Blocking (2026)',
      description:
        'Improve baseball catching skills with a quiet glove, soft receiving, blocking technique, and better communication with pitchers.',
      summary:
        'Catching is a position of small margins. A quiet glove, a stable base, and a clear understanding of the pitcher’s plan turn borderline pitches into strikes and prevent avoidable passed balls.',
      points: [
        'Set up low and quiet so the umpire has a clear view of the pitch.',
        'Receive with soft hands and a slight give rather than stabbing at the ball.',
        'Keep the glove in front of the body on low pitches and block with the body behind it.',
        'Frame by receiving the ball toward the middle of the zone without pulling it dramatically.',
        'Communicate with the pitcher between innings about what is working.',
      ],
      drills: [
        'Tennis-ball receiving — catch soft feeds with bare hands to develop give and focus.',
        'Blocking bucket — block ten balls in the dirt, keeping the chin down and chest forward.',
        'Framing targets — receive pitches at the edges and hold the glove still for the umpire.',
        'Pop-time work — practise transfer and footwork on throws to second.',
      ],
      mistakes: [
        'Reaching for the ball with a stiff arm instead of receiving it with soft hands.',
        'Turning the head away when blocking, which exposes the body to the ball.',
        'Standing too high and losing the low strike.',
      ],
      faqs: [
        ['What is framing?', 'Framing is the art of receiving a borderline pitch in a way that makes it look like a strike to the umpire. It works best with a quiet glove and subtle movement.'],
        ['How do I block a breaking ball?', 'Start low, keep the glove down, and let the ball hit the chest protector rather than reaching for it.'],
      ],
    },
    {
      slug: 'baseball-infield-defense',
      title: 'Baseball Infield Defense: Footwork, Angles, and Double Plays (2026)',
      description:
        'Build reliable baseball infield defense with pre-pitch readiness, efficient angles, and clean double-play footwork.',
      summary:
        'Infield defense is decided before the ball is hit. Good infielders set their feet, anticipate the play, and take efficient angles that allow a clean field and a strong throw.',
      points: [
        'Get into a low ready position as the pitch is delivered, with the glove out front.',
        'Take a short first step to the ball rather than reaching with the glove.',
        'Field the ball out front and work through it toward the throwing target.',
        'Use the bag as a reference point on double plays and keep the feet moving through the transfer.',
        'Know the situation before the pitch so the throw decision is automatic.',
      ],
      drills: [
        'Rolling ground balls — field ten forehand and ten backhand balls with a coach rolling at varying speeds.',
        'Double-play footwork — rehearse the approach, touch, and throw without a runner.',
        'Short-hop drill — field balls that bounce just in front of the glove.',
        'Angle drill — start from different positions and take the correct angle to the ball.',
      ],
      mistakes: [
        'Standing upright until the ball is hit and losing the first step.',
        'Fielding the ball under the body instead of out front.',
        'Rushing the transfer on a double play and losing the throw.',
      ],
      faqs: [
        ['How do I improve my backhand?', 'Practise taking the correct angle and fielding the ball with a firm glove. Many errors come from arriving late rather than poor hands.'],
        ['Should I always throw to first?', 'No. Read the situation and take the sure out. Forcing a throw across the diamond can turn one out into two.'],
      ],
    },
    {
      slug: 'baseball-outfield-defense',
      title: 'Baseball Outfield Defense: Reads, Routes, and Throws (2026)',
      description:
        'Play better baseball outfield defense with first-step reads, efficient routes, and throws that hit the cut-off.',
      summary:
        'Outfield defense begins with the first step. Outfielders who read the bat early and take efficient routes cover more ground, while accurate throws to the cut-off prevent extra bases.',
      points: [
        'Watch the bat and the pitch release to get an early read on contact.',
        'Take a drop step in the direction of the ball rather than crossing over immediately.',
        'Run a curved route that keeps the ball in front and allows a strong throwing position.',
        'Use the cut-off man and aim for the relay’s chest rather than trying for a highlight throw.',
        'Communicate loudly with the corner outfielders and infield on balls between positions.',
      ],
      drills: [
        'Fungo reads — react to balls hit to both sides and call the first step aloud.',
        'Route-running drill — run to a spot and catch over the shoulder with a coach directing the path.',
        'Crow-hop throws — practise the crow hop and throw to a relay target.',
        'Communication drill — two outfielders converge on a ball and call it clearly.',
      ],
      mistakes: [
        'Breaking late because the fielder is watching the flight instead of the bat.',
        'Taking a direct route that forces a catch over the shoulder with no throwing momentum.',
        'Throwing over the cut-off and allowing runners to advance.',
      ],
      faqs: [
        ['What is the best first step?', 'A drop step in the direction of the ball gets the hips turned quickly and is faster than a crossover for most balls hit over the head.'],
        ['How do I play the sun?', 'Use sunglasses, pick up the ball early, and position your glove to block the glare if needed. Never lose sight of the ball.'],
      ],
    },
    {
      slug: 'baseball-catcher-skills',
      title: 'Baseball Catcher Skills: Stance, Throwing, and Game Management (2026)',
      description:
        'Develop baseball catcher skills including a stable stance, quick transfers, blocking, and effective game management.',
      summary:
        'A baseball catcher touches the ball on every pitch and influences the entire defence. Stable receiving, a quick transfer, and calm leadership matter more than flashy plays.',
      points: [
        'Set up with a wide, stable base and keep the glove still before the pitch.',
        'Receive with soft hands and a quiet body to help the umpire call strikes.',
        'Block with the body behind the ball and the chin tucked.',
        'Use a quick, short transfer on throws rather than a long arm circle.',
        'Know each pitcher’s plan and communicate adjustments between innings.',
      ],
      drills: [
        'Blocking series — ten balls in the dirt to each side, holding the finish position.',
        'Transfer drill — catch and transfer to the throwing hand repeatedly without throwing.',
        'Pop-time throws — throw to second from a crouch and measure the time.',
        'Pitch-calling review — review a game plan with a coach and discuss sequences.',
      ],
      mistakes: [
        'Reaching for pitches instead of receiving them with soft hands.',
        'Standing up too early on a steal and losing the throw.',
        'Calling pitches based on habit rather than the hitter and the count.',
      ],
      faqs: [
        ['What is a good pop time?', 'Elite catchers are often around 1.8-2.0 seconds, but at most levels consistency and accuracy matter more than raw time.'],
        ['How do I protect my knees?', 'Use proper receiving and blocking mechanics, take recovery seriously, and avoid unnecessary crouching between innings.'],
      ],
    },
    {
      slug: 'baseball-throwing-mechanics',
      title: 'Baseball Throwing Mechanics: Grip, Alignment, and Arm Care (2026)',
      description:
        'Throw with more accuracy and less arm stress by improving grip, body alignment, and a repeatable throwing routine.',
      summary:
        'Accurate baseball throwing comes from a clean grip, a consistent arm slot, and body alignment toward the target. Good throwing routines also build the arm care habits that keep players healthy.',
      points: [
        'Use a four-seam grip for the most predictable flight and a clean release.',
        'Point the front shoulder at the target and step in that direction.',
        'Rotate the trunk and bring the arm through in one continuous motion.',
        'Finish with the throwing hand across the body and the back hip rotated through.',
        'Build throwing volume gradually and include light catch before high-intensity throws.',
      ],
      drills: [
        'Kneeling throws — throw from one knee to isolate the upper-body path.',
        'Line throws — throw along a line on the ground to check alignment.',
        'Crow-hop progression — add a crow hop and throw to a partner at increasing distance.',
        'Accuracy ladder — throw to targets at 10, 20, and 30 metres.',
      ],
      mistakes: [
        'Throwing with the body facing the target and relying on the arm alone.',
        'Squeezing the ball too tightly and losing a clean release.',
        'Throwing at full intensity before the arm is warm.',
      ],
      faqs: [
        ['How do I fix throwing errors?', 'Start with alignment and footwork. Most inaccurate throws come from the lower body before the arm.'],
        ['Is long toss necessary?', 'It can help build arm strength when programmed carefully, but it is not required for every player. Consistency and recovery matter more.'],
      ],
    },
    {
      slug: 'baseball-hitting-approach',
      title: 'Baseball Hitting Approach: Count Awareness and Pitch Selection (2026)',
      description:
        'Build a smarter baseball hitting approach with count awareness, zone discipline, and a plan for each at-bat.',
      summary:
        'A strong baseball hitting approach turns physical ability into consistent production. Hitters who understand the count, hunt a specific zone, and adjust to the pitcher’s plan make better decisions at the plate.',
      points: [
        'Decide on a zone you can drive before the pitch arrives.',
        'Use the count to narrow your approach instead of swinging at anything close.',
        'Track the pitcher’s patterns early in the game and adjust your plan.',
        'Spoil tough pitches with two strikes rather than taking a passive at-bat.',
        'Review each at-bat for process, not just outcome.',
      ],
      drills: [
        'Called-strike game — take pitches and call the zone aloud to build awareness.',
        'Count-specific BP — hit with a coach calling counts and enforcing a plan.',
        'Two-strike battle — foul off borderline pitches and fight until you get a hittable ball.',
        'Pitch-sequence review — study a pitcher’s tendencies before a simulated at-bat.',
      ],
      mistakes: [
        'Swinging at the first hittable pitch without a plan for the situation.',
        'Expanding the zone with two strikes and chasing a pitcher’s pitch.',
        'Changing the approach after one bad at-bat instead of reviewing the process.',
      ],
      faqs: [
        ['What should I do with two strikes?', 'Shorten the swing, protect the plate, and fight off borderline pitches. Avoid the big swing unless the pitch is clearly in your zone.'],
        ['How do I improve pitch recognition?', 'Track pitches from the dugout, use video, and practise calling the pitch type and location in batting practice.'],
      ],
    },
    {
      slug: 'baseball-youth-development',
      title: 'Baseball Youth Development: Skills, Fun, and Long-Term Growth (2026)',
      description:
        'A long-term approach to baseball youth development that prioritises movement skills, enjoyment, and healthy throwing habits.',
      summary:
        'Young baseball players develop best when they play multiple sports, learn broad movement skills, and enjoy the game. Early specialisation and heavy throwing volumes create more problems than they solve.',
      points: [
        'Encourage free play and multiple sports to build general athleticism.',
        'Teach throwing, catching, and running mechanics before advanced tactics.',
        'Keep practice sessions short, varied, and game-based.',
        'Track throwing volume and follow age-appropriate rest guidelines.',
        'Praise effort, decision-making, and teamwork rather than only results.',
      ],
      drills: [
        'Obstacle-course warm-up — running, hopping, and throwing in a playful circuit.',
        'Small-sided games — five-on-five or three-on-three games with simplified rules.',
        'Target throwing — throw to cones and score points for accuracy.',
        'Hit-and-run game — combine a hit with a base-running decision.',
      ],
      mistakes: [
        'Specialising in baseball year-round at a young age.',
        'Measuring success only by hitting statistics.',
        'Ignoring arm fatigue because the player wants to keep playing.',
      ],
      faqs: [
        ['When should kids start pitching?', 'Follow league guidelines and focus on throwing mechanics and enjoyment first. Avoid competitive pitching until the player is physically ready.'],
        ['How many sports should a child play?', 'Two or three is usually plenty. Variety builds coordination and reduces repetitive strain.'],
      ],
    },
    {
      slug: 'baseball-conditioning',
      title: 'Baseball Conditioning: Speed, Power, and Rotational Strength (2026)',
      description:
        'Train baseball-specific conditioning with sprint work, rotational power, and strength that supports throwing and hitting.',
      summary:
        'Baseball conditioning should develop explosive first steps, rotational power, and durability rather than long-distance endurance. The sport rewards short bursts, repeatable effort, and a resilient arm.',
      points: [
        'Train acceleration and first-step quickness over short distances.',
        'Use rotational medicine-ball throws to develop hitting power.',
        'Build lower-body strength with squats, split squats, and hip hinges.',
        'Strengthen the posterior shoulder and scapular muscles for throwing durability.',
        'Allow full recovery between high-intensity efforts rather than training like an endurance athlete.',
      ],
      drills: [
        'Ten-yard accelerations — six reps with full recovery.',
        'Medicine-ball rotational throws — three sets of six per side.',
        'Split-squat series — three sets of eight per leg.',
        'Band pull-aparts — three sets of fifteen for scapular health.',
      ],
      mistakes: [
        'Running long, slow distances and neglecting sprint mechanics.',
        'Adding heavy strength work during the season without adjusting throwing load.',
        'Skipping warm-ups before speed work.',
      ],
      faqs: [
        ['Should baseball players lift weights?', 'Yes, with appropriate programming and supervision. Strength supports throwing, hitting, and injury resilience.'],
        ['How much sprinting is enough?', 'Short, high-quality sprints two or three times per week are plenty for most players.'],
      ],
    },
    {
      slug: 'baseball-injury-prevention',
      title: 'Baseball Injury Prevention: Arm Care, Hamstrings, and Load (2026)',
      description:
        'Protect baseball players with arm-care routines, hamstring strength, throwing-load management, and smart recovery.',
      summary:
        'Baseball injuries often accumulate through repeated throwing and sprinting rather than one dramatic moment. Managing workload and building resilient tissue are the most reliable prevention strategies.',
      points: [
        'Track throwing volume across practices and games, not just formal pitch counts.',
        'Use a consistent arm-care routine for the shoulder and forearm.',
        'Build hamstring strength to reduce Sprint-related strains.',
        'Warm up the arm progressively before any high-intensity throw.',
        'Give young players full rest from throwing for part of the year.',
      ],
      drills: [
        'Band external rotation — three sets of twelve per arm.',
        'Sleeper stretch or cross-body stretch — gentle holds after throwing.',
        'Nordic hamstring curl — three sets of four to six controlled reps.',
        'Catch-play progression — short toss, longer toss, then game-intensity throws.',
      ],
      mistakes: [
        'Counting only game pitches and ignoring practice throws.',
        'Throwing through pain because the player does not want to leave the field.',
        'Returning to full throwing immediately after a period of rest.',
      ],
      faqs: [
        ['How much rest does a young pitcher need?', 'Follow your league’s pitch-count and rest rules, and add rest during off-season periods. When in doubt, err on the side of fewer throws.'],
        ['What are warning signs of arm injury?', 'Persistent pain, loss of velocity, changed arm slot, or pain that wakes the player at night all warrant assessment.'],
      ],
    },
    {
      slug: 'baseball-glove-selection',
      title: 'Baseball Glove Selection: Size, Position, and Break-In (2026)',
      description:
        'Choose the right baseball glove by position, size, web type, and break-in method without overspending.',
      summary:
        'A baseball glove should fit your hand, suit your position, and break in to your own throwing style. The most expensive glove is not automatically the best one for a developing player.',
      points: [
        'Choose glove size by position: smaller for infielders, longer for outfielders, specialised for catchers and first basemen.',
        'Pick a web type that matches the position and your visibility preferences.',
        'Break the glove in gradually with catch play rather than forcing it with oil or steam.',
        'Keep the glove clean and store it with a ball in the pocket to hold shape.',
        'Replace a glove when the leather tears or the fit no longer supports control.',
      ],
      drills: [
        'Catch-play break-in — play light catch daily for two weeks with a new glove.',
        'Pocket-forming drill — catch balls repeatedly in the same spot to shape the pocket.',
        'Position-fit check — try gloves at your position and compare range of motion.',
        'Maintenance routine — clean, condition lightly, and store with a ball.',
      ],
      mistakes: [
        'Buying an oversized glove that makes transfers slow.',
        'Using too much oil and making the leather heavy and floppy.',
        'Choosing a glove based on colour rather than fit and position needs.',
      ],
      faqs: [
        ['How long does a glove take to break in?', 'Two to four weeks of regular catch play is typical. Forced break-in methods can shorten the glove’s life.'],
        ['Should I use a different glove for pitching?', 'Some pitchers prefer a closed web to hide the grip. Otherwise, use the glove that gives you the best feel and control.'],
      ],
    },
    {
      slug: 'baseball-bat-selection',
      title: 'Baseball Bat Selection: Length, Weight, and Material (2026)',
      description:
        'Select a baseball bat that matches your size, strength, and league rules, with tips for testing swing weight and balance.',
      summary:
        'The right baseball bat balances control and power. Length, weight, barrel size, and league certification all matter, and a bat that feels good in the store may behave differently at game speed.',
      points: [
        'Check league certification before buying; an illegal bat is unusable regardless of feel.',
        'Choose a length that lets you cover the plate without losing barrel control.',
        'Pick a weight you can swing repeatedly without a drop in bat speed.',
        'Balance matters as much as total weight; a lighter swing weight often improves timing.',
        'Test a bat in live batting practice rather than only swinging it in a cage.',
      ],
      drills: [
        'Swing-speed check — measure or compare bat speed with two different bats.',
        'Tee comparison — hit ten balls with each bat and compare contact consistency.',
        'Fatigue test — take twenty swings and note whether the last five lose control.',
        'Grip check — confirm the handle size and grip feel suit your hands.',
      ],
      mistakes: [
        'Buying a heavier bat for power and losing bat speed and control.',
        'Ignoring league bat rules and discovering the problem at the field.',
        'Choosing a bat based on a professional’s endorsement instead of your own testing.',
      ],
      faqs: [
        ['Does a heavier bat hit farther?', 'Only if you can swing it at similar speed. Once bat speed drops, the extra mass usually does not compensate.'],
        ['How often should I replace a bat?', 'Replace it when it is cracked, dented, or loses performance. Wooden bats should be inspected regularly for cracks.'],
      ],
    },
    {
      slug: 'baseball-game-strategy',
      title: 'Baseball Game Strategy: Situations, Lineups, and Decisions (2026)',
      description:
        'Understand baseball game strategy from lineup construction and bunting decisions to defensive positioning and bullpen use.',
      summary:
        'Baseball strategy is a series of small decisions shaped by the score, inning, count, and personnel. Good teams plan those decisions in advance so players can react instead of guess.',
      points: [
        'Build the lineup around on-base ability and run production rather than reputation.',
        'Use bunts and steals only when the expected gain justifies the out.',
        'Position defenders based on hitter tendencies and game situation.',
        'Manage the bullpen by workload and matchup, not just by inning.',
        'Communicate the plan clearly so players understand their roles.',
      ],
      drills: [
        'Situation quiz — review ten game scenarios and choose the best action.',
        'Defensive positioning walk-through — align the defence for different hitters.',
        'Two-out pressure game — practise scoring with two outs and a runner in scoring position.',
        'Bullpen planning exercise — map pitcher availability across a three-game series.',
      ],
      mistakes: [
        'Sacrificing an out without a clear statistical or situational reason.',
        'Using the same defensive alignment regardless of hitter tendencies.',
        'Overworking relievers because the plan was not set before the game.',
      ],
      faqs: [
        ['Is bunting still useful?', 'Yes, in specific situations such as moving a runner with a weak hitter or exploiting a defensive weakness. It is not an automatic choice.'],
        ['How important is the lineup order?', 'It matters, but not as much as having good hitters. Putting high on-base players near the top usually helps.'],
      ],
    },
  ],
};

export default category;
