const category = {
  key: 'skiing',
  label: 'Skiing',
  venue: 'a snow-covered slope, indoor ski centre, or dry-slope facility with marked boundaries',
  demand:
    'sustained isometric leg work, balance under changing terrain, cold exposure, and rapid adjustments to snow, light, and crowds',
  equipment: [
    'Skis',
    'Ski boots',
    'Poles',
    'Helmet',
    'Goggles',
    'Thermal layers',
    'Ski wax',
  ],
  injuries: ['ACL tear', 'thumb injury', 'wrist sprain', 'concussion'],
  terms: [
    ['Fall line', 'The most direct downhill path on a slope.'],
    ['Edge angle', 'The angle between the ski base and the snow, which controls grip and turn shape.'],
    ['Carve', 'A turn where the ski bends and grips through the arc with minimal skidding.'],
    ['DIN', 'The release setting on a binding, adjusted to the skier’s measurements and ability.'],
  ],
  tools: [
    { label: 'Altitude Adjustment Calculator', slug: 'altitude-adjustment-calculator' },
    { label: 'Heart Rate Calculator', slug: 'heart-rate-calculator' },
    { label: 'Injury Risk Calculator', slug: 'injury-risk-calculator' },
  ],
  posts: [
    {
      slug: 'skiing-beginner-basics',
      title: 'Skiing for Beginners: Gear, Stance, and First Turns (2026)',
      description:
        'A beginner skiing guide covering gear, the basic stance, snowplough turns, and how to stay safe on the slopes.',
      summary:
        'Skiing beginners should focus on balance, a stable stance, and one turning skill before worrying about speed. Good habits on easy terrain make every later skill easier and safer.',
      points: [
        'Stand with the feet hip-width apart, knees soft, and weight centred over the skis.',
        'Keep the hands forward and the poles lightly touching the snow.',
        'Learn the snowplough to control speed and stop.',
        'Turn by shifting weight to the outside ski rather than twisting the upper body.',
        'Stay on gentle, marked terrain until the basics are consistent.',
      ],
      drills: [
        'Straight-run glide — glide down a gentle slope with a balanced stance.',
        'Snowplough stop — practise stopping from a straight run.',
        'Snowplough turn — turn left and right using weight shift.',
        'Side-slip — slide sideways to learn edge control.',
      ],
      mistakes: [
        'Leaning back and losing control of the ski tips.',
        'Looking down at the skis instead of ahead at the slope.',
        'Skiing beyond your ability because the lift is convenient.',
      ],
      faqs: [
        ['How long does it take to learn to ski?', 'Most beginners can link basic turns within a few days of lessons. Consistent practice and professional instruction accelerate progress.'],
        ['Should I rent or buy gear?', 'Rent for your first trips. Buying is better once you know your preferred terrain and have consistent sizing.'],
      ],
    },
    {
      slug: 'skiing-stance-balance',
      title: 'Skiing Stance and Balance: The Athletic Position (2026)',
      description:
        'Build a balanced skiing stance with ankle flex, hip position, and quiet upper-body movement.',
      summary:
        'A balanced skiing stance is athletic and dynamic, not stiff. Flexed ankles, soft knees, and a centred hip position let you pressure the ski and adjust to terrain.',
      points: [
        'Flex the ankles forward inside the boot to engage the ski tips.',
        'Keep the knees soft and the hips centred over the feet.',
        'Hold the hands forward so the arms support balance without tension.',
        'Keep the upper body quiet while the legs absorb terrain.',
        'Look ahead and breathe to prevent unnecessary stiffness.',
      ],
      drills: [
        'Static stance check — stand on a flat area and review alignment.',
        'Glide-and-touch — glide and touch the boot buckles to feel ankle flex.',
        'Side-slip — practise balance on the edges while sliding sideways.',
        'Traverse — hold a steady stance across a gentle slope.',
      ],
      mistakes: [
        'Standing too upright and losing pressure on the ski tips.',
        'Leaning back to feel safe, which makes turning harder.',
        'Gripping the poles tightly and tensing the upper body.',
      ],
      faqs: [
        ['Why do I lean back when nervous?', 'It is a natural reaction to fear, but it moves pressure away from the ski tips. Focus on a gentle ankle flex and look at the slope ahead.'],
        ['How wide should my stance be?', 'About hip-width apart for most recreational skiing. A wider stance can help stability on rough terrain.'],
      ],
    },
    {
      slug: 'skiing-parallel-turns',
      title: 'Parallel Turns: Skis Together and Smooth Transitions (2026)',
      description:
        'Progress from snowplough to parallel turns with better edge control, weight transfer, and turn timing.',
      summary:
        'Parallel turns come from matching the skis early and steering with the legs. Rushing the transition creates skidding, while a smooth release and edge change produce a controlled arc.',
      points: [
        'Start the turn by releasing the old edge and moving the hips across the skis.',
        'Match the inside ski to the outside ski early in the turn.',
        'Steer both legs through the turn rather than twisting the upper body.',
        'Keep the hands forward and the pole plant light.',
        'Finish the turn with the skis across the fall line before releasing.',
      ],
      drills: [
        'Snowplough-to-parallel — start in a snowplough and match the skis at the fall line.',
        'Garland drill — linked turns across a gentle slope with a focus on edge release.',
        'Thousand-step — lift and step the inside ski to feel weight transfer.',
        'Short-radius turns — make small parallel turns to develop quick edge changes.',
      ],
      mistakes: [
        'Twisting the shoulders to start the turn instead of using the legs.',
        'Keeping the inside ski on the wrong edge and crossing the tips.',
        'Rushing the transition and skidding the tails.',
      ],
      faqs: [
        ['How do I stop my skis from crossing?', 'Match the skis earlier and keep the inside ski slightly ahead. Crossing usually comes from late edge change.'],
        ['Do I need to ski parallel to have fun?', 'No. A controlled snowplough on the right terrain is perfectly enjoyable. Progress at your own pace.'],
      ],
    },
    {
      slug: 'skiing-carving',
      title: 'Carving Skis: Edge Angle, Grip, and Arc Control (2026)',
      description:
        'Learn to carve clean arcs with earlier edge angle, pressure control, and a stable upper body.',
      summary:
        'Carving turns use the ski’s sidecut and edge grip rather than skidding. A progressive edge angle, centred pressure, and patience through the arc produce a clean, fast turn.',
      points: [
        'Tilt the skis progressively onto the new edge at the start of the turn.',
        'Keep pressure centred along the ski rather than pushing only the tips.',
        'Let the ski bend and follow its natural arc.',
        'Keep the upper body quiet and the hands forward.',
        'Finish the turn with enough edge grip to control speed.',
      ],
      drills: [
        'Railroad tracks — carve clean arcs on a gentle slope and inspect the tracks.',
        'Edge-set drill — practise setting and releasing the edge on a traverse.',
        'Long-radius carves — make wide turns at moderate speed.',
        'Short-radius carves — tighten the arc while maintaining grip.',
      ],
      mistakes: [
        'Skidding the tails because the edge angle is applied too late.',
        'Leaning the whole body instead of tilting the skis.',
        'Trying to carve on terrain that is too steep or icy for your skill level.',
      ],
      faqs: [
        ['What is the difference between carving and skidding?', 'A carved turn follows the ski’s sidecut with minimal sideways slip; a skidded turn brushes the tails across the snow.'],
        ['Can I carve on any ski?', 'Most modern recreational skis can carve, but width, sidecut, and tune affect how easily they grip.'],
      ],
    },
    {
      slug: 'skiing-moguls',
      title: 'Skiing Moguls: Absorption, Rhythm, and Line Choice (2026)',
      description:
        'Ski moguls with better absorption, turn rhythm, and line selection instead of fighting the terrain.',
      summary:
        'Mogul skiing is about absorbing terrain and staying in rhythm. Soft knees, a quiet upper body, and a consistent line make the bumps feel smaller and more predictable.',
      points: [
        'Choose a line before you enter the mogul field.',
        'Absorb the bump with the legs while keeping the upper body stable.',
        'Turn on the top of the bump where the snow is usually softer.',
        'Keep the hands forward and the pole plant quick.',
        'Maintain a steady rhythm rather than making one huge turn.',
      ],
      drills: [
        'Absorption drill — ski over small bumps and focus on legs compressing.',
        'Traverse bumps — traverse a mogul field slowly to learn the terrain.',
        'Short-radius turns — practise quick turns on groomed terrain.',
        'Line-choice drill — pick three bumps ahead and follow the line.',
      ],
      mistakes: [
        'Standing tall and getting thrown by the bump.',
        'Looking at the bump in front of the ski tips instead of ahead.',
        'Trying to ski moguls fast before the rhythm is established.',
      ],
      faqs: [
        ['What is absorption in mogul skiing?', 'Absorption is the legs bending to soak up the bump while the upper body stays quiet. It keeps pressure on the snow and prevents loss of control.'],
        ['Are moguls harder than groomed runs?', 'They demand more rhythm and leg strength, but a controlled line often feels easier than fighting a steep groomed slope.'],
      ],
    },
    {
      slug: 'skiing-powder',
      title: 'Skiing Powder: Float, Rhythm, and Safe Terrain (2026)',
      description:
        'Learn to ski powder with a balanced stance, rhythmic turns, and safe terrain choices.',
      summary:
        'Powder skiing rewards a centred stance and rhythmic turns. Skis float when the body is balanced and the turns are linked, not when the skier leans back and fights the snow.',
      points: [
        'Keep the stance centred and the skis close together for float.',
        'Turn rhythmically so the skis stay near the surface.',
        'Use a slightly wider stance in deep, heavy snow for stability.',
        'Keep the hands forward and the pole plant light.',
        'Stay on terrain you can safely exit and never ski deep snow alone without proper gear.',
      ],
      drills: [
        'Powder traverse — traverse a soft slope to feel float.',
        'Rhythm turns — link turns at a steady count in soft snow.',
        'Pole-plant drill — practise a light pole plant in powder.',
        'Short powder turns — make tight turns to stay near the surface.',
      ],
      mistakes: [
        'Leaning back and burying the ski tails.',
        'Skiing too slowly and losing float.',
        'Entering deep snow without avalanche awareness or a partner.',
      ],
      faqs: [
        ['Why do my skis sink in powder?', 'Ski width, speed, and stance all affect float. A centred stance and rhythmic turns help more than leaning back.'],
        ['Do I need wider skis for powder?', 'Wider skis help float, but technique matters more. Rent a powder ski before buying if you are new to deep snow.'],
      ],
    },
    {
      slug: 'skiing-ice-technique',
      title: 'Skiing on Ice: Edge Grip and Controlled Braking (2026)',
      description:
        'Stay in control on icy slopes with earlier edge engagement, gentle pressure, and conservative speed.',
      summary:
        'Ice removes the margin for error, so grip depends on smooth edge engagement and patience. Sharp edges, a quiet upper body, and lower speed keep you in control on hard snow.',
      points: [
        'Keep the skis tuned and the edges sharp before icy days.',
        'Engage the edge early and progressively rather than slamming it down.',
        'Keep the upper body quiet and the pressure smooth.',
        'Reduce speed and make rounder turns to avoid skidding.',
        'Stay on terrain that matches your grip and confidence.',
      ],
      drills: [
        'Edge-set traverse — set the edge on a traverse and hold a clean line.',
        'Round-turn drill — make smooth, round turns on hard snow.',
        'Side-slip — practise controlled side-slipping on ice.',
        'Short-radius turns — keep speed low with quick, accurate turns.',
      ],
      mistakes: [
        'Skiing on dull edges and blaming the conditions.',
        'Slamming the edges and losing grip.',
        'Carrying too much speed into an icy section.',
      ],
      faqs: [
        ['How often should I tune my skis?', 'Check edges regularly and tune when they feel dull or the snow is aggressive. Icy conditions demand sharp edges.'],
        ['Is it safe to ski ice?', 'It can be safe with appropriate speed and technique. If you are uncomfortable, choose easier terrain.'],
      ],
    },
    {
      slug: 'skiing-poles',
      title: 'Ski Pole Technique: Planting, Timing, and Balance (2026)',
      description:
        'Use ski poles effectively for rhythm, timing, and balance instead of dragging them behind you.',
      summary:
        'Ski poles support timing and balance, especially in short turns and moguls. A light, well-timed plant helps the skier move across the skis without becoming a crutch.',
      points: [
        'Hold the poles with the hands forward and the straps correctly positioned.',
        'Plant the pole lightly as the turn begins, not after it is finished.',
        'Use the pole to support the move into the new turn, not to push backward.',
        'Keep the pole tips near the snow in bumps and steeps.',
        'Relax the grip so the wrist can move naturally.',
      ],
      drills: [
        'Pole-tap drill — tap the pole on each turn without pushing.',
        'No-pole turns — ski without poles to develop balance.',
        'Rhythm drill — link turns to a steady pole-plant count.',
        'Mogul plant — practise a quick plant on the top of small bumps.',
      ],
      mistakes: [
        'Dragging the poles behind and losing the timing cue.',
        'Planting too hard and pushing the body back.',
        'Holding the poles too tightly and stiffening the arms.',
      ],
      faqs: [
        ['Are poles necessary for beginners?', 'They help with balance and rhythm, but beginners can learn without them. Use them once the basic stance is stable.'],
        ['How long should my poles be?', 'A common guide is that the pole should reach roughly to the floor when the ski is on edge and the hand is under the grip. Ask a shop to check.'],
      ],
    },
    {
      slug: 'skiing-lift-safety',
      title: 'Ski Lift Safety: Loading, Riding, and Unloading (2026)',
      description:
        'Ride ski lifts safely with correct loading, bar use, and unloading procedures for chairs and surface lifts.',
      summary:
        'Ski lift safety is mostly routine: line up calmly, sit back, lower the bar, and prepare early to unload. Most incidents come from rushing or ignoring instructions.',
      points: [
        'Follow the lift operator’s instructions and load one at a time.',
        'Sit back against the chair and keep skis pointed forward.',
        'Lower the safety bar once everyone is seated.',
        'Keep backpacks and loose clothing clear of moving parts.',
        'Raise the bar early and prepare to ski away smoothly at the top.',
      ],
      drills: [
        'Load rehearsal — practise the approach and seating on a beginner lift.',
        'Unload rehearsal — stand and ski away on a gentle slope.',
        'Bar routine — rehearse lowering and raising the bar as a group.',
        'Surface-lift practice — use a button lift with a coach nearby.',
      ],
      mistakes: [
        'Rushing the load and sitting off-centre.',
        'Leaning forward with the bar down and getting caught.',
        'Standing up too late and missing the unloading ramp.',
      ],
      faqs: [
        ['What should I do if I fall getting off a lift?', 'Move away from the unloading area as quickly as possible and signal to the operator. Do not stand in the path of the next chair.'],
        ['Can children ride lifts alone?', 'Follow the resort’s age and height rules, and supervise young children closely.'],
      ],
    },
    {
      slug: 'skiing-terrain-reading',
      title: 'Skiing Terrain Reading: Snow, Light, and Line Choice (2026)',
      description:
        'Read ski terrain and snow conditions to choose safer lines, anticipate hazards, and ski with more confidence.',
      summary:
        'Terrain reading is a safety skill. Understanding snow texture, light, exposure, and traffic helps you choose a line that matches your ability and the conditions.',
      points: [
        'Look at the slope shape and identify convex rolls, concavities, and fall-away edges.',
        'Read snow texture: soft, wind-packed, icy, or wet snow each demands different tactics.',
        'Use flat light cautiously and rely on terrain feel rather than sharp visual contrast.',
        'Watch for rocks, trees, and other skiers before committing to a line.',
        'Choose an exit point before entering a new area.',
      ],
      drills: [
        'Stop-and-scan — stop at the top of a run and describe the terrain aloud.',
        'Line-choice drill — pick a line and identify two escape routes.',
        'Snow-texture walk — inspect snow at different aspects and elevations.',
        'Low-light drill — ski a familiar easy run in flat light with a coach.',
      ],
      mistakes: [
        'Dropping into terrain without seeing the exit.',
        'Skiing by colour grade alone and ignoring snow conditions.',
        'Following another skier’s line without checking whether it suits you.',
      ],
      faqs: [
        ['What is flat light?', 'Flat light is low-contrast light that hides terrain features. Slow down and use gentle turns until visibility improves.'],
        ['How do I know if a slope is too steep?', 'If you cannot picture a controlled turn or a safe stop, it is too steep for your current level. Choose easier terrain.'],
      ],
    },
    {
      slug: 'skiing-skate-skiing',
      title: 'Skate Skiing: Technique, Rhythm, and Conditioning (2026)',
      description:
        'Learn skate skiing with the basic V-skate, weight transfer, and conditioning for cross-country terrain.',
      summary:
        'Skate skiing is a fast, athletic cross-country technique built on weight transfer and glide. A stable glide ski, a strong push, and a relaxed rhythm make the technique efficient.',
      points: [
        'Start on a flat, groomed surface with a wide skate lane.',
        'Push the glide ski out to the side and transfer weight fully.',
        'Keep the poles swinging naturally to support the rhythm.',
        'Use a slight forward lean and relaxed shoulders.',
        'Build duration gradually as technique becomes stable.',
      ],
      drills: [
        'Glide-and-push — practise pushing one ski out and gliding on the other.',
        'No-pole skating — develop balance without poles.',
        'V-skate repeats — short efforts on a flat loop.',
        'Pole-only drill — practise the upper-body rhythm on gentle terrain.',
      ],
      mistakes: [
        'Standing too upright and losing the forward glide.',
        'Pushing with the heel instead of the ball of the foot.',
        'Trying to skate on terrain that is too steep for the technique.',
      ],
      faqs: [
        ['Do I need different skis for skate skiing?', 'Yes. Skate skis are shorter and stiffer than classic skis and are designed for the skating motion.'],
        ['Is skate skiing harder than classic?', 'It demands more balance and coordination, but many skiers find it faster and more rhythmical once learned.'],
      ],
    },
    {
      slug: 'skiing-cross-country-classic',
      title: 'Classic Cross-Country Skiing: Grip, Glide, and Rhythm (2026)',
      description:
        'Learn classic cross-country skiing with diagonal stride, kick-and-glide timing, and wax basics.',
      summary:
        'Classic cross-country skiing blends grip and glide. A relaxed diagonal stride, good weight transfer, and correctly waxed skis make the technique feel smooth and efficient.',
      points: [
        'Use the diagonal stride on moderate terrain with opposite arm and leg.',
        'Shift weight fully onto the kick ski to engage the grip zone.',
        'Let the ski glide after the kick rather than rushing the next step.',
        'Keep the poles angled back and the arms relaxed.',
        'Match wax to snow temperature and conditions.',
      ],
      drills: [
        'Diagonal stride — practise the arm-leg rhythm on a flat track.',
        'Kick-and-glide — emphasise the kick and let the ski run.',
        'No-pole stride — develop balance without poles.',
        'Double-pole drill — build upper-body strength on gentle terrain.',
      ],
      mistakes: [
        'Skiing with stiff legs and losing the glide.',
        'Using the wrong wax and slipping on every kick.',
        'Bending at the waist instead of driving from the legs.',
      ],
      faqs: [
        ['Do I need to wax my skis?', 'Most recreational classic skis need grip wax or use skin/scale bases. Ask a shop for a simple waxing routine for your conditions.'],
        ['What is the difference between classic and skate?', 'Classic uses a forward stride in prepared tracks, while skate skiing uses a side-to-side motion on a wide groomed surface.'],
      ],
    },
    {
      slug: 'skiing-downhill-racing',
      title: 'Downhill Racing Basics: Line, Tuck, and Course Strategy (2026)',
      description:
        'Understand downhill racing fundamentals, including the tuck, line selection, and course inspection.',
      summary:
        'Downhill racing rewards aerodynamics, line choice, and courage. A stable tuck and a precise line through the gates matter more than raw skiing aggression.',
      points: [
        'Inspect the course and choose a line before the run.',
        'Use a compact tuck to reduce drag on straight sections.',
        'Stay balanced over the skis and absorb terrain changes.',
        'Commit to the line early and avoid late corrections.',
        'Practise speed in controlled, supervised settings.',
      ],
      drills: [
        'Tuck rehearsal — practise the tuck on a gentle slope.',
        'Terrain absorption — ski through rolls at moderate speed.',
        'Gate-line drill — practise a set line of gates at controlled speed.',
        'Speed progression — increase speed only when the line is consistent.',
      ],
      mistakes: [
        'Tucking in terrain where you cannot see the line.',
        'Standing up and losing speed on flat sections.',
        'Skiing beyond your ability in the name of racing.',
      ],
      faqs: [
        ['Is downhill racing dangerous?', 'It carries significant risk and should be done on closed courses with proper supervision and protective equipment.'],
        ['How do I start racing?', 'Join a club with coaching and progress through appropriate age and ability categories.'],
      ],
    },
    {
      slug: 'skiing-boot-fit',
      title: 'Ski Boot Fit: Flex, Volume, and Comfort (2026)',
      description:
        'Choose ski boots that fit properly, including flex rating, shell volume, and liner comfort.',
      summary:
        'Ski boots are the most important piece of equipment for control and comfort. A correct fit balances snugness, flex, and circulation, and no amount of skill can fix a bad fit.',
      points: [
        'Choose a flex rating that matches your weight, ability, and terrain.',
        'Check shell volume so the foot is snug without pressure points.',
        'Ensure the heel stays locked down and the toes just touch the front.',
        'Use custom footbeds if needed for arch support and alignment.',
        'Break boots in gradually and adjust buckles before skiing.',
      ],
      drills: [
        'Shell-fit check — remove the liner and place the foot inside the shell.',
        'Buckle check — tighten from the bottom up and check circulation.',
        'Flex test — flex the boot in a shop and compare control.',
        'Walk test — wear the boots for ten minutes and note pressure points.',
      ],
      mistakes: [
        'Buying boots that are too large and losing control.',
        'Choosing an overly stiff flex before developing technique.',
        'Ignoring pressure points that will worsen over a ski day.',
      ],
      faqs: [
        ['How tight should ski boots be?', 'Snug with no heel lift and no painful pressure points. You should be able to wiggle your toes slightly.'],
        ['Do I need custom insoles?', 'Many skiers benefit from them, especially with flat feet or alignment issues. A boot fitter can advise.'],
      ],
    },
    {
      slug: 'skiing-ski-selection',
      title: 'Ski Selection: Width, Length, and Terrain Match (2026)',
      description:
        'Choose the right skis for your terrain and ability, including width, length, and rocker profile.',
      summary:
        'The right skis match your terrain, ability, and snow conditions. Width affects float, length affects stability, and rocker changes how the ski behaves in different conditions.',
      points: [
        'Choose narrower skis for groomed runs and wider skis for powder.',
        'Match length to your height, weight, and ability.',
        'Understand rocker and camber profiles before buying.',
        'Demo skis on the terrain you actually ski.',
        'Do not buy expert skis before your technique is ready.',
      ],
      drills: [
        'Demo comparison — ski two different widths on the same run.',
        'Length check — compare a shorter and longer ski in your size range.',
        'Terrain test — ski the same run on a groomer and in softer snow.',
        'Shop-fit review — confirm binding compatibility and mount point.',
      ],
      mistakes: [
        'Buying powder skis for a resort with mostly groomed runs.',
        'Choosing skis that are too long and difficult to turn.',
        'Ignoring binding compatibility and safety settings.',
      ],
      faqs: [
        ['What ski width should I start with?', 'Around 75-90 mm underfoot suits most recreational skiers on groomed terrain, with wider options for soft snow.'],
        ['Should I buy used skis?', 'Used skis can be good value, but check the base, edges, and binding condition. Have a shop inspect them.'],
      ],
    },
    {
      slug: 'skiing-waxing',
      title: 'Ski Waxing: Glide, Grip, and Temperature Match (2026)',
      description:
        'Understand ski waxing for glide and grip, including temperature ranges, application, and basic maintenance.',
      summary:
        'Wax affects how skis glide and grip. Matching wax to snow temperature and keeping the base clean are simple habits that make skiing easier and more predictable.',
      points: [
        'Match glide wax to the snow temperature and humidity.',
        'Clean the base before applying new wax.',
        'Use a waxing iron at the recommended temperature to avoid base damage.',
        'Scrape and brush the wax for a smooth glide.',
        'For classic skiing, match grip wax to the conditions.',
      ],
      drills: [
        'Base cleaning — brush and wipe the base before waxing.',
        'Iron practice — apply wax on an old ski to learn temperature control.',
        'Scrape-and-brush — finish a wax job and inspect the base.',
        'Condition notes — record temperature, wax, and glide quality.',
      ],
      mistakes: [
        'Using an iron that is too hot and damaging the base.',
        'Skipping scraping and leaving excess wax on the base.',
        'Using the same wax in all conditions.',
      ],
      faqs: [
        ['How often should I wax my skis?', 'Every few ski days, or more often in aggressive snow. A clean, waxed base glides better and lasts longer.'],
        ['Do I need different wax for classic and skate?', 'Yes. Classic skiing uses grip wax or skin/scale bases in addition to glide wax; skate skis use glide wax along the whole base.'],
      ],
    },
    {
      slug: 'skiing-conditioning',
      title: 'Skiing Conditioning: Legs, Core, and Cold Fitness (2026)',
      description:
        'Prepare for ski season with leg strength, core stability, balance, and cardiovascular conditioning.',
      summary:
        'Skiing conditioning should build leg endurance, balance, and core stability. Pre-season strength work reduces fatigue and helps protect the knees on long descents.',
      points: [
        'Build leg strength with squats, lunges, and step-ups.',
        'Train balance on unstable surfaces and single-leg positions.',
        'Develop core stability for a quiet upper body.',
        'Include aerobic work for altitude and cold exposure.',
        'Progress gradually before the season starts.',
      ],
      drills: [
        'Wall sit — three sets of 30-60 seconds.',
        'Lateral lunge — three sets of eight per side.',
        'Single-leg balance — thirty seconds per side.',
        'Step-up — three sets of ten per leg.',
      ],
      mistakes: [
        'Starting conditioning only when the season begins.',
        'Doing only cardio and neglecting leg strength.',
        'Skiing hard on the first day after months off.',
      ],
      faqs: [
        ['How early should I start ski conditioning?', 'Six to eight weeks before the season is a good window. Start earlier if you are returning from injury.'],
        ['Does cycling help for skiing?', 'It builds leg endurance, but you still need strength, balance, and eccentric control for skiing.'],
      ],
    },
    {
      slug: 'skiing-injury-prevention',
      title: 'Skiing Injury Prevention: Knees, Thumbs, and Falls (2026)',
      description:
        'Reduce skiing injuries with knee-friendly technique, proper binding settings, and safe falling habits.',
      summary:
        'Skiing injuries often involve the knee, thumb, or head. Correct binding settings, strength work, and learning to fall safely reduce the risk of serious damage.',
      points: [
        'Have bindings set by a qualified technician using your measurements.',
        'Build leg strength and balance before the season.',
        'Keep the hands on the poles and avoid planting a thumb in a fall.',
        'Wear a helmet and goggles on every run.',
        'Know how to fall: sit down and protect the head rather than reaching out.',
      ],
      drills: [
        'Balance series — single-leg stands and reaches.',
        'Lateral hop-and-stick — five hops per side with a controlled landing.',
        'Fall rehearsal — practise sitting down safely on a soft slope.',
        'Binding check — review settings with a technician each season.',
      ],
      mistakes: [
        'Borrowing skis without adjusting bindings.',
        'Skiing tired on the last run of the day.',
        'Trying to save a fall with an outstretched hand and injuring the thumb.',
      ],
      faqs: [
        ['What is skier’s thumb?', 'An injury to the ligament at the base of the thumb, often caused by falling onto a pole. Keeping the hand around the grip and not looping the strap over the thumb helps.'],
        ['Should I wear a helmet?', 'Yes. A helmet is strongly recommended for all skiers and is required at many resorts.'],
      ],
    },
    {
      slug: 'skiing-avalanche-safety',
      title: 'Skiing Avalanche Safety: Awareness, Gear, and Decisions (2026)',
      description:
        'Understand basic avalanche safety for skiers, including forecasts, transceiver use, and conservative decision-making.',
      summary:
        'Avalanche safety is a serious backcountry skill that cannot be learned from an article alone. Recreational skiers should stay in bounds unless trained, equipped, and accompanied by experienced partners.',
      points: [
        'Check the avalanche forecast before any backcountry trip.',
        'Carry a transceiver, probe, and shovel, and know how to use them.',
        'Take a recognised avalanche course before travelling in avalanche terrain.',
        'Avoid steep, wind-loaded slopes and convex rolls.',
        'Make conservative decisions and turn around when uncertainty is high.',
      ],
      drills: [
        'Transceiver practice — search for buried beacons in a training area.',
        'Forecast review — read and discuss the daily avalanche bulletin.',
        'Terrain walk — identify avalanche paths from a safe distance.',
        'Rescue rehearsal — practise a beacon search with a partner.',
      ],
      mistakes: [
        'Entering avalanche terrain without training or equipment.',
        'Ignoring recent wind loading or warming temperatures.',
        'Letting group dynamics push you into a decision you would not make alone.',
      ],
      faqs: [
        ['Can I learn avalanche safety online?', 'Online resources help with awareness, but practical training and rescue practice are essential. Take a recognised course.'],
        ['Is resort skiing avalanche-safe?', 'Resorts manage avalanche risk within their boundaries, but sidecountry and out-of-bounds areas are not controlled.'],
      ],
    },
    {
      slug: 'skiing-family-guide',
      title: 'Family Skiing: Choosing Resorts and Teaching Kids (2026)',
      description:
        'Plan a family ski trip with the right resort, lesson programme, and routines that keep children warm and happy.',
      summary:
        'A successful family ski trip depends on choosing the right terrain, booking lessons, and keeping the day short enough for children. Fun and warmth matter more than mileage.',
      points: [
        'Choose a resort with beginner terrain and a good ski school.',
        'Book lessons with qualified instructors rather than teaching everything yourself.',
        'Keep sessions short and take warm-up breaks.',
        'Rent gear for growing children instead of buying.',
        'Use a meeting point and a clear plan if anyone gets separated.',
      ],
      drills: [
        'Gear check — fit helmets, boots, and goggles before leaving.',
        'Meeting-point rehearsal — walk to the meeting point together.',
        'Snow-play session — let children play in the snow before skiing.',
        'Lesson debrief — ask the instructor what to practise next.',
      ],
      mistakes: [
        'Skiing too long and ending the day with tired, cold children.',
        'Skipping helmets or buying oversized boots.',
        'Pushing children onto terrain beyond their ability.',
      ],
      faqs: [
        ['When can children start skiing?', 'Many programmes start around age four to six, depending on the child’s attention and motor skills. Group lessons are often the best introduction.'],
        ['What should we bring for a family ski day?', 'Layers, snacks, water, sunscreen, spare gloves, and a plan for warm breaks.'],
      ],
    },
  ],
};

export default category;
