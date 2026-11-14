import type {ToolIconName} from './icons';

export const TOOL_CATEGORIES = ['fitness', 'performance', 'nutrition'] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export const TOOL_CATEGORY_LABELS: Record<ToolCategory, string> = {
  fitness: 'Fitness Calculators',
  performance: 'Performance Trackers',
  nutrition: 'Nutrition Tools',
};

type ToolDefinition = {
  readonly slug: string;
  readonly title: string;
  readonly linkLabel: string;
  readonly description: string;
  readonly seoDescription: string;
  readonly category: ToolCategory;
  readonly legacyPath: `/tools/${string}.html`;
  readonly icon: ToolIconName;
  readonly component: string;
};

export const tools = [
  {slug: 'bmi-calculator', title: 'BMI Calculator', linkLabel: 'Use Calculator', description: 'Calculate your Body Mass Index and assess your weight status', seoDescription: 'Calculate your Body Mass Index (BMI) instantly with our free BMI calculator. Get instant results and health recommendations.', category: 'fitness', legacyPath: '/tools/bmi-calculator.html', icon: 'Scale', component: 'BmiCalculator'},
  {slug: 'one-rep-max-calculator', title: 'One Rep Max Calculator', linkLabel: 'Calculate 1RM', description: 'Estimate your maximum lifting potential for strength training', seoDescription: 'Calculate your one-rep max (1RM) for strength training using various formulas.', category: 'fitness', legacyPath: '/tools/one-rep-max-calculator.html', icon: 'Dumbbell', component: 'OneRepMaxCalculator'},
  {slug: 'calorie-calculator', title: 'Calorie Calculator', linkLabel: 'Calculate Now', description: 'Determine daily caloric needs based on activity level and goals', seoDescription: 'Calculate your daily caloric needs with our free calorie calculator. Get personalized recommendations based on age, gender, weight, height, and activity level.', category: 'fitness', legacyPath: '/tools/calorie-calculator.html', icon: 'Flame', component: 'CalorieCalculator'},
  {slug: 'heart-rate-calculator', title: 'Heart Rate Calculator', linkLabel: 'Calculate Zones', description: 'Find your target heart rate zones for optimal training', seoDescription: 'Calculate your target heart rate zones for optimal training with our free heart rate calculator. Get personalized zone recommendations based on age and fitness level.', category: 'fitness', legacyPath: '/tools/heart-rate-calculator.html', icon: 'HeartPulse', component: 'HeartRateCalculator'},
  {slug: 'body-type-quiz', title: 'Body Type Quiz', linkLabel: 'Take Quiz', description: 'Discover your somatotype (body type) for personalized insights', seoDescription: 'Discover your somatotype (body type) - Ectomorph, Mesomorph, or Endomorph - and learn about its implications for fitness and nutrition.', category: 'fitness', legacyPath: '/tools/body-type-quiz.html', icon: 'PersonStanding', component: 'BodyTypeQuiz'},
  {slug: 'body-fat-calculator', title: 'Body Fat Calculator', linkLabel: 'Calculate', description: 'Estimate body fat percentage using various measurement methods', seoDescription: 'Calculate your body fat percentage with our free body fat calculator. Uses multiple methods including US Navy, BMI, and skinfold measurements for accurate results.', category: 'fitness', legacyPath: '/tools/body-fat-calculator.html', icon: 'Percent', component: 'BodyFatCalculator'},
  {slug: 'pace-calculator', title: 'Pace Calculator', linkLabel: 'Track Pace', description: 'Calculate running pace and race time predictions', seoDescription: 'Calculate your running pace and race time predictions with our free pace calculator. Get splits, target paces, and performance predictions for various distances.', category: 'performance', legacyPath: '/tools/pace-calculator.html', icon: 'Timer', component: 'PaceCalculator'},
  {slug: 'cycling-power', title: 'Cycling Power Calculator', linkLabel: 'Calculate Power', description: 'Estimate power output and cycling performance metrics', seoDescription: 'Calculate your cycling power output, watts, and performance metrics with our free cycling power calculator. Get training zones and power recommendations.', category: 'performance', legacyPath: '/tools/cycling-power.html', icon: 'Bike', component: 'CyclingPowerCalculator'},
  {slug: 'swim-pace', title: 'Swim Pace Calculator', linkLabel: 'Calculate', description: 'Track swimming pace and interval times', seoDescription: 'Calculate your swimming pace, interval times, and race predictions with our free swim pace calculator. Perfect for triathletes and competitive swimmers.', category: 'performance', legacyPath: '/tools/swim-pace.html', icon: 'Waves', component: 'SwimPaceCalculator'},
  {slug: 'running-calorie-calculator', title: 'Running Calorie Calculator', linkLabel: 'Calculate Calories', description: 'Calculate calories burned during running with terrain factors', seoDescription: 'Calculate calories burned during running with our free running calorie calculator. Get accurate estimates based on distance, pace, weight, and terrain.', category: 'performance', legacyPath: '/tools/running-calorie-calculator.html', icon: 'Footprints', component: 'RunningCalorieCalculator'},
  {slug: 'vo2max-calculator', title: 'VO2 Max Calculator', linkLabel: 'Calculate VO2 Max', description: 'Estimate your maximum oxygen uptake and cardiovascular fitness', seoDescription: 'Calculate your VO2 Max (maximum oxygen uptake) to assess cardiovascular fitness and aerobic capacity. Get instant results and fitness level rankings.', category: 'performance', legacyPath: '/tools/vo2max-calculator.html', icon: 'Wind', component: 'Vo2MaxCalculator'},
  {slug: 'golf-handicap-calculator', title: 'Golf Handicap Calculator', linkLabel: 'Calculate Handicap', description: 'Calculate your golf handicap index and course handicap', seoDescription: 'Calculate your golf handicap index with our free handicap calculator. Get accurate USGA handicap calculations and course handicap predictions.', category: 'performance', legacyPath: '/tools/golf-handicap-calculator.html', icon: 'Flag', component: 'GolfHandicapCalculator'},
  {slug: 'injury-risk-calculator', title: 'Sports Injury Risk Calculator', linkLabel: 'Assess Risk', description: 'Assess your injury risk factors and get prevention strategies', seoDescription: 'Assess your sports injury risk factors with our free injury risk calculator. Get personalized recommendations to prevent injuries and optimize performance.', category: 'performance', legacyPath: '/tools/injury-risk-calculator.html', icon: 'ShieldAlert', component: 'InjuryRiskCalculator'},
  {slug: 'yoga-calorie-calculator', title: 'Yoga Calorie Calculator', linkLabel: 'Calculate Calories', description: 'Calculate calories burned during different yoga styles', seoDescription: 'Calculate calories burned during yoga with our free yoga calorie calculator. Get accurate estimates for different yoga styles and session durations.', category: 'performance', legacyPath: '/tools/yoga-calorie-calculator.html', icon: 'Flower2', component: 'YogaCalorieCalculator'},
  {slug: 'lean-body-mass-calculator', title: 'Lean Body Mass Calculator', linkLabel: 'Calculate LBM', description: 'Estimate your lean body mass and body fat percentage', seoDescription: 'Estimate your Lean Body Mass (LBM) and body fat percentage using the Boer formula.', category: 'performance', legacyPath: '/tools/lean-body-mass-calculator.html', icon: 'Activity', component: 'LeanBodyMassCalculator'},
  {slug: 'basketball-vertical-jump-analyzer', title: 'Basketball Vertical Jump Analyzer', linkLabel: 'Analyze Jump', description: 'Analyze vertical jump with power output and performance metrics', seoDescription: 'Analyze your basketball vertical jump with advanced metrics including power output, force generation, and performance comparison', category: 'performance', legacyPath: '/tools/basketball-vertical-jump-analyzer.html', icon: 'ArrowUpFromLine', component: 'BasketballVerticalJumpAnalyzer'},
  {slug: 'soccer-match-load-calculator', title: 'Soccer Match Load Calculator', linkLabel: 'Calculate Load', description: 'Track match workload, distance covered, and recovery needs', seoDescription: 'Calculate soccer match load, distance covered, intensity levels, and recovery needs with advanced performance metrics', category: 'performance', legacyPath: '/tools/soccer-match-load-calculator.html', icon: 'Goal', component: 'SoccerMatchLoadCalculator'},
  {slug: 'cricket-bowling-workload-tracker', title: 'Cricket Bowling Workload Tracker', linkLabel: 'Track Workload', description: 'Monitor bowling workload and calculate injury risk factors', seoDescription: 'Track cricket bowling workload, monitor injury risk, and optimize performance with comprehensive analytics', category: 'performance', legacyPath: '/tools/cricket-bowling-workload-tracker.html', icon: 'Target', component: 'CricketBowlingWorkloadTracker'},
  {slug: 'tennis-match-energy-expenditure-tool', title: 'Tennis Match Energy Expenditure', linkLabel: 'Calculate Energy', description: 'Calculate match calories burned and recovery requirements', seoDescription: 'Calculate tennis match energy expenditure, calorie burn, and recovery needs with advanced performance metrics', category: 'performance', legacyPath: '/tools/tennis-match-energy-expenditure-tool.html', icon: 'Trophy', component: 'TennisMatchEnergyExpenditureTool'},
  {slug: 'badminton-rally-intensity-calculator', title: 'Badminton Rally Intensity Calculator', linkLabel: 'Analyze Rally', description: 'Analyze rally intensity, shot patterns, and tactical diversity', seoDescription: 'Calculate badminton rally intensity, analyze shot patterns, and optimize training with advanced performance metrics', category: 'performance', legacyPath: '/tools/badminton-rally-intensity-calculator.html', icon: 'Feather', component: 'BadmintonRallyIntensityCalculator'},
  {slug: 'combat-sports-weight-class-optimizer', title: 'Combat Sports Weight Class Optimizer', linkLabel: 'Optimize Weight', description: 'Optimize weight class for MMA, boxing, wrestling, and martial arts', seoDescription: 'Optimize combat sports weight class with advanced analysis for MMA, boxing, wrestling, and martial arts performance', category: 'performance', legacyPath: '/tools/combat-sports-weight-class-optimizer.html', icon: 'Swords', component: 'CombatSportsWeightClassOptimizer'},
  {slug: 'training-load-calculator', title: 'Training Load Calculator (CTL/ATL/TSB)', linkLabel: 'Calculate Load', description: 'Fatigue and form modeling with chronic/acute training load analysis', seoDescription: 'Calculate training load with CTL, ATL, TSB metrics for optimal fatigue and form modeling in endurance sports', category: 'performance', legacyPath: '/tools/training-load-calculator.html', icon: 'ChartLine', component: 'TrainingLoadCalculator'},
  {slug: 'race-strategy-planner', title: 'Race Strategy Planner', linkLabel: 'Plan Strategy', description: 'Negative split and fueling strategy for endurance events', seoDescription: 'Plan race strategy with negative splits and optimal fueling strategies for endurance events and competitions', category: 'performance', legacyPath: '/tools/race-strategy-planner.html', icon: 'FlagTriangleRight', component: 'RaceStrategyPlanner'},
  {slug: 'heat-acclimatization-calculator', title: 'Heat Acclimatization Calculator', linkLabel: 'Heat Adjustment', description: 'Adjust pace and hydration for hot climate training and racing', seoDescription: 'Adjust pace and hydration for hot climates with heat acclimatization calculator for endurance athletes', category: 'performance', legacyPath: '/tools/heat-acclimatization-calculator.html', icon: 'ThermometerSun', component: 'HeatAcclimatizationCalculator'},
  {slug: 'altitude-adjustment-calculator', title: 'Altitude Adjustment Calculator', linkLabel: 'Altitude Pacing', description: 'Training and race pacing adjustments for high altitude performance', seoDescription: 'Calculate altitude adjustments for training and race pacing with scientific altitude performance calculations', category: 'performance', legacyPath: '/tools/altitude-adjustment-calculator.html', icon: 'Mountain', component: 'AltitudeAdjustmentCalculator'},
  {slug: 'stride-length-cadence-calculator', title: 'Stride Length & Cadence Calculator', linkLabel: 'Analyze Gait', description: 'Running efficiency metrics and optimal form analysis', seoDescription: 'Calculate stride length and cadence for optimal running efficiency with detailed biomechanical analysis', category: 'performance', legacyPath: '/tools/stride-length-cadence-calculator.html', icon: 'Ruler', component: 'StrideLengthCadenceCalculator'},
  {slug: 'cycling-gear-ratio-calculator', title: 'Cycling Gear Ratio Calculator', linkLabel: 'Gear Analysis', description: 'Cadence vs speed analysis by terrain and gearing optimization', seoDescription: 'Calculate cycling gear ratios for optimal cadence vs speed analysis across different terrains and conditions', category: 'performance', legacyPath: '/tools/cycling-gear-ratio-calculator.html', icon: 'Cog', component: 'CyclingGearRatioCalculator'},
  {slug: 'swimming-stroke-efficiency-calculator', title: 'Swimming Stroke Efficiency Calculator', linkLabel: 'Stroke Analysis', description: 'SWOLF and stroke rate analysis for swimming performance', seoDescription: 'Calculate swimming stroke efficiency with SWOLF score and stroke rate analysis for optimal performance', category: 'performance', legacyPath: '/tools/swimming-stroke-efficiency-calculator.html', icon: 'Gauge', component: 'SwimmingStrokeEfficiencyCalculator'},
  {slug: 'protein-calculator', title: 'Protein Calculator', linkLabel: 'Calculate', description: 'Calculate daily protein needs for muscle building', seoDescription: 'Calculate your daily protein needs for muscle building and fitness goals with our free protein calculator. Get personalized recommendations based on weight, activity, and goals.', category: 'nutrition', legacyPath: '/tools/protein-calculator.html', icon: 'Beef', component: 'ProteinCalculator'},
  {slug: 'tdee-calculator', title: 'TDEE Calculator', linkLabel: 'Calculate TDEE', description: 'Estimate your total daily caloric expenditure for weight goals', seoDescription: 'Calculate your Total Daily Energy Expenditure (TDEE) to understand your caloric needs for weight management.', category: 'nutrition', legacyPath: '/tools/tdee-calculator.html', icon: 'Calculator', component: 'TDEECalculator'},
  {slug: 'hydration-calculator', title: 'Hydration Calculator', linkLabel: 'Calculate', description: 'Determine optimal daily water intake', seoDescription: 'Calculate your daily water intake and hydration needs with our free hydration calculator. Get personalized recommendations based on weight, activity, and climate.', category: 'nutrition', legacyPath: '/tools/hydration-calculator.html', icon: 'Droplets', component: 'HydrationCalculator'},
  {slug: 'macro-calculator', title: 'Macro Calculator', linkLabel: 'Calculate Macros', description: 'Balance carbohydrates, proteins, and fats', seoDescription: 'Calculate your macronutrient needs (carbs, protein, fats) with our free macro calculator. Get personalized ratios for your fitness goals and dietary preferences.', category: 'nutrition', legacyPath: '/tools/macro-calculator.html', icon: 'PieChart', component: 'MacroCalculator'},
  {slug: 'meal-timing', title: 'Meal Timing Planner', linkLabel: 'Plan Meals', description: 'Optimize meal timing around workouts', seoDescription: 'Plan your optimal meal timing and nutrient schedule with our free meal timing planner. Get personalized recommendations for pre and post-workout nutrition.', category: 'nutrition', legacyPath: '/tools/meal-timing.html', icon: 'Clock', component: 'MealTimingPlanner'},
  {slug: 'bmr-calculator', title: 'BMR Calculator', linkLabel: 'Calculate BMR', description: 'Calculate your Basal Metabolic Rate (BMR)', seoDescription: "Calculate your Basal Metabolic Rate (BMR) to determine your body's baseline calorie needs at rest.", category: 'nutrition', legacyPath: '/tools/bmr-calculator.html', icon: 'BedDouble', component: 'BMRCalculator'},
  {slug: 'micronutrient-checker', title: 'Micronutrient Intake Checker', linkLabel: 'Check Levels', description: 'Vitamin & mineral sufficiency score analysis', seoDescription: 'Calculate your micronutrient intake and vitamin/mineral sufficiency score for optimal health and athletic performance', category: 'nutrition', legacyPath: '/tools/micronutrient-checker.html', icon: 'Pill', component: 'MicronutrientChecker'},
  {slug: 'glycemic-load-calculator', title: 'Glycemic Load Calculator', linkLabel: 'Calculate GL', description: 'Carb quality analysis for blood sugar management', seoDescription: 'Calculate glycemic load of meals and analyze carbohydrate quality for optimal blood sugar management and athletic performance', category: 'nutrition', legacyPath: '/tools/glycemic-load-calculator.html', icon: 'Candy', component: 'GlycemicLoadCalculator'},
  {slug: 'pre-workout-nutrition', title: 'Pre-Workout Nutrition Planner', linkLabel: 'Plan Nutrition', description: 'Timing and macro optimization for training', seoDescription: 'Plan optimal pre-workout nutrition with perfect timing and macro optimization for peak athletic performance', category: 'nutrition', legacyPath: '/tools/pre-workout-nutrition.html', icon: 'Zap', component: 'PreWorkoutNutritionPlanner'},
  {slug: 'post-workout-recovery', title: 'Post-Workout Recovery Meal Builder', linkLabel: 'Build Meal', description: 'Protein/carb ratio optimization for recovery', seoDescription: 'Build optimal post-workout recovery meals with perfect protein/carb ratios for muscle repair and glycogen replenishment', category: 'nutrition', legacyPath: '/tools/post-workout-recovery.html', icon: 'BatteryCharging', component: 'PostWorkoutRecoveryMealBuilder'},
  {slug: 'intermittent-fasting-planner', title: 'Intermittent Fasting Planner', linkLabel: 'Plan Fasting', description: 'Fasting windows and training alignment', seoDescription: 'Plan optimal intermittent fasting windows and align them with your training schedule for maximum performance and fat loss', category: 'nutrition', legacyPath: '/tools/intermittent-fasting-planner.html', icon: 'Hourglass', component: 'IntermittentFastingPlanner'},
  {slug: 'refeed-day-calculator', title: 'Refeed Day Calculator', linkLabel: 'Plan Refeed', description: 'Strategic carb refeed planning for diet breaks', seoDescription: 'Calculate strategic carbohydrate refeed days for diet breaks, metabolic boosting, and sustained fat loss during cutting phases', category: 'nutrition', legacyPath: '/tools/refeed-day-calculator.html', icon: 'Wheat', component: 'RefeedDayCalculator'},
  {slug: 'weight-cut-gain-planner', title: 'Weight-Cut / Weight-Gain Planner', linkLabel: 'Plan Weight', description: 'Safe weekly targets and realistic timelines', seoDescription: 'Plan safe weight cutting and gaining strategies with sustainable weekly targets and realistic timelines for athletes', category: 'nutrition', legacyPath: '/tools/weight-cut-gain-planner.html', icon: 'ArrowDownUp', component: 'WeightCutGainPlanner'},
] as const satisfies readonly ToolDefinition[];

export type Tool = (typeof tools)[number];
export type ToolSlug = Tool['slug'];
export type ToolComponentKey = Tool['component'];

export const toolsByCategory: Record<ToolCategory, readonly Tool[]> = {
  fitness: tools.filter((tool) => tool.category === 'fitness'),
  performance: tools.filter((tool) => tool.category === 'performance'),
  nutrition: tools.filter((tool) => tool.category === 'nutrition'),
};

export type ToolCategorySection = {
  readonly category: ToolCategory;
  readonly label: string;
  readonly tools: readonly Tool[];
};

export const toolCategorySections: readonly ToolCategorySection[] = TOOL_CATEGORIES.map(
  (category) => ({
    category,
    label: TOOL_CATEGORY_LABELS[category],
    tools: toolsByCategory[category],
  }),
);

export function getToolsByCategory(category: ToolCategory): readonly Tool[] {
  return toolsByCategory[category];
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(toolOrSlug: Tool | ToolSlug, limit = 3): readonly Tool[] {
  const tool = typeof toolOrSlug === 'string' ? getToolBySlug(toolOrSlug) : toolOrSlug;
  if (!tool || limit <= 0) {
    return [];
  }
  return tools
    .filter(
      (candidate) =>
        candidate.category === tool.category && candidate.slug !== tool.slug,
    )
    .slice(0, limit);
}

export function getToolRoute(toolOrSlug: Tool | ToolSlug): string | undefined {
  const tool = typeof toolOrSlug === 'string' ? getToolBySlug(toolOrSlug) : toolOrSlug;
  return tool ? `/tools/${tool.slug}` : undefined;
}

export function getToolByLegacyPath(legacyPath: string): Tool | undefined {
  return tools.find((tool) => tool.legacyPath === legacyPath);
}

export function getLegacyTarget(legacyPath: string): string | undefined {
  const tool = getToolByLegacyPath(legacyPath);
  return tool ? getToolRoute(tool) : undefined;
}
