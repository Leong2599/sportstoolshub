import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type BikeType =
  | 'road'
  | 'mountain'
  | 'gravel'
  | 'hybrid'
  | 'cyclocross'
  | 'time-trial'
  | 'touring'
  | 'custom';

export type RiderType =
  | 'spinner'
  | 'masher'
  | 'balanced'
  | 'climber'
  | 'sprinter';

export type GearTerrain =
  | 'flat'
  | 'rolling'
  | 'climbing'
  | 'mixed'
  | 'off-road'
  | 'time-trial';

export type GearFitnessLevel =
  | 'beginner'
  | 'recreational'
  | 'competitive'
  | 'advanced'
  | 'elite';

export type GearWheelSize =
  | '700c'
  | '650b'
  | '26inch'
  | '29er'
  | '650c';

export type GearValues = {
  bikeType: BikeType | '';
  chainrings: string;
  cassette: string;
  wheelSize: GearWheelSize | '';
  tireSize: string;
  targetCadence: string;
  riderType: RiderType | '';
  terrainType: GearTerrain | '';
  fitnessLevel: GearFitnessLevel | '';
};

export type GearOption = {
  value: string;
  label: string;
};

export type BikeSetup = {
  chainrings: readonly GearOption[];
  cassettes: readonly GearOption[];
  tires: readonly GearOption[];
};

export type GearRow = {
  chainring: number;
  cog: number;
  gearRatio: string;
  metersPerCrank: string;
  speedAtTargetCadence: string;
  gearInches: string;
  development: string;
};

export type GearResult = {
  bikeType: BikeType;
  chainrings: string;
  cassette: string;
  targetCadence: number;
  wheelCircumference: number;
  gears: readonly GearRow[];
  highestGear: GearRow;
  lowestGear: GearRow;
  cruisingGear: GearRow | undefined;
  climbingGear: GearRow | undefined;
  highCadenceGear: GearRow | undefined;
  gearRange: number;
  recommendedCadence: number;
  speedBands: readonly {label: string; gears: readonly string[]}[];
  recommendations: readonly string[];
  insights: readonly string[];
};

export const BIKE_TYPES: readonly {value: BikeType; label: string}[] = [
  {value: 'road', label: 'Road Bike'},
  {value: 'mountain', label: 'Mountain Bike'},
  {value: 'gravel', label: 'Gravel Bike'},
  {value: 'hybrid', label: 'Hybrid Bike'},
  {value: 'cyclocross', label: 'Cyclocross Bike'},
  {value: 'time-trial', label: 'Time Trial/Triathlon'},
  {value: 'touring', label: 'Touring Bike'},
  {value: 'custom', label: 'Custom Setup'},
] as const;

export const GEAR_WHEEL_SIZES: readonly {
  value: GearWheelSize;
  label: string;
}[] = [
  {value: '700c', label: '700c (Standard Road)'},
  {value: '650b', label: '650b (27.5" MTB)'},
  {value: '26inch', label: '26" MTB'},
  {value: '29er', label: '29er MTB'},
  {value: '650c', label: '650c (Small Road/Triathlon)'},
] as const;

export const GEAR_RIDER_TYPES: readonly {
  value: RiderType;
  label: string;
}[] = [
  {value: 'spinner', label: 'Spinner (High cadence 90-100 RPM)'},
  {value: 'masher', label: 'Masher (Low cadence 70-80 RPM)'},
  {value: 'balanced', label: 'Balanced (80-90 RPM)'},
  {value: 'climber', label: 'Climber (Variable cadence)'},
  {value: 'sprinter', label: 'Sprinter (High power, variable cadence)'},
] as const;

export const GEAR_TERRAINS: readonly {
  value: GearTerrain;
  label: string;
}[] = [
  {value: 'flat', label: 'Flat Roads/Race Courses'},
  {value: 'rolling', label: 'Rolling Hills'},
  {value: 'climbing', label: 'Mountain Climbing'},
  {value: 'mixed', label: 'Mixed Terrain'},
  {value: 'off-road', label: 'Off-Road/Trail'},
  {value: 'time-trial', label: 'Time Trial/Flat Racing'},
] as const;

export const GEAR_FITNESS_LEVELS: readonly {
  value: GearFitnessLevel;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (<1 year)'},
  {value: 'recreational', label: 'Recreational (1-3 years)'},
  {value: 'competitive', label: 'Competitive (3-5 years)'},
  {value: 'advanced', label: 'Advanced (5-10 years)'},
  {value: 'elite', label: 'Elite/Professional'},
] as const;

export const GEAR_ERRORS = {
  bikeType: 'Please select a bike type.',
  chainrings: 'Please select a chainring setup.',
  cassette: 'Please select a cassette range.',
  wheelSize: 'Please select a wheel size.',
  tireSize: 'Please select a tire size.',
  targetCadence: 'Please enter a valid target cadence.',
  riderType: 'Please select a rider type.',
  terrainType: 'Please select a terrain type.',
  fitnessLevel: 'Please select a fitness level.',
} as const;

export const BIKE_SETUPS: Record<BikeType, BikeSetup> = {
  road: {
    chainrings: [
      {value: '53-39', label: '53-39 (Standard)'},
      {value: '52-36', label: '52-36 (Compact)'},
      {value: '50-34', label: '50-34 (Semi-Compact)'},
      {value: '48-32', label: '48-32 (Sub-Compact)'},
      {value: '54-42', label: '54-42 (Classic)'},
    ],
    cassettes: [
      {value: '11-28', label: '11-28T'},
      {value: '11-30', label: '11-30T'},
      {value: '11-32', label: '11-32T'},
      {value: '11-34', label: '11-34T'},
      {value: '12-25', label: '12-25T'},
      {value: '12-27', label: '12-27T'},
    ],
    tires: [
      {value: '23', label: '23mm'},
      {value: '25', label: '25mm'},
      {value: '28', label: '28mm'},
      {value: '30', label: '30mm'},
      {value: '32', label: '32mm'},
    ],
  },
  mountain: {
    chainrings: [
      {value: '34-24', label: '34-24T'},
      {value: '32-22', label: '32-22T'},
      {value: '30-22', label: '30-22T'},
      {value: '36-26', label: '36-26T'},
      {value: '38-28', label: '38-28T'},
      {value: 'single-32', label: 'Single Ring 32T'},
      {value: 'single-34', label: 'Single Ring 34T'},
    ],
    cassettes: [
      {value: '11-46', label: '11-46T (10-speed)'},
      {value: '11-50', label: '11-50T (11-speed)'},
      {value: '10-51', label: '10-51T (12-speed)'},
      {value: '10-52', label: '10-52T (12-speed)'},
      {value: '11-42', label: '11-42T (10-speed)'},
    ],
    tires: [
      {value: '2.1', label: '2.1"'},
      {value: '2.2', label: '2.2"'},
      {value: '2.3', label: '2.3"'},
      {value: '2.4', label: '2.4"'},
      {value: '2.5', label: '2.5"'},
    ],
  },
  gravel: {
    chainrings: [
      {value: '48-32', label: '48-32T'},
      {value: '46-30', label: '46-30T'},
      {value: '44-28', label: '44-28T'},
      {value: '42-28', label: '42-28T'},
      {value: 'single-40', label: 'Single Ring 40T'},
      {value: 'single-42', label: 'Single Ring 42T'},
    ],
    cassettes: [
      {value: '11-32', label: '11-32T'},
      {value: '11-34', label: '11-34T'},
      {value: '11-36', label: '11-36T'},
      {value: '10-44', label: '10-44T'},
      {value: '11-42', label: '11-42T'},
    ],
    tires: [
      {value: '35', label: '35mm'},
      {value: '38', label: '38mm'},
      {value: '40', label: '40mm'},
      {value: '42', label: '42mm'},
      {value: '45', label: '45mm'},
    ],
  },
  hybrid: {
    chainrings: [
      {value: '48-38', label: '48-38T'},
      {value: '46-36', label: '46-36T'},
      {value: '44-32', label: '44-32T'},
      {value: '42-30', label: '42-30T'},
      {value: 'single-42', label: 'Single Ring 42T'},
    ],
    cassettes: [
      {value: '11-32', label: '11-32T'},
      {value: '11-34', label: '11-34T'},
      {value: '12-28', label: '12-28T'},
      {value: '13-26', label: '13-26T'},
    ],
    tires: [
      {value: '32', label: '32mm'},
      {value: '35', label: '35mm'},
      {value: '38', label: '38mm'},
      {value: '40', label: '40mm'},
    ],
  },
  cyclocross: {
    chainrings: [
      {value: '46-36', label: '46-36T'},
      {value: '44-34', label: '44-34T'},
      {value: '42-32', label: '42-32T'},
      {value: 'single-40', label: 'Single Ring 40T'},
      {value: 'single-42', label: 'Single Ring 42T'},
    ],
    cassettes: [
      {value: '11-32', label: '11-32T'},
      {value: '11-34', label: '11-34T'},
      {value: '12-28', label: '12-28T'},
    ],
    tires: [
      {value: '30', label: '30mm'},
      {value: '32', label: '32mm'},
      {value: '33', label: '33mm'},
      {value: '34', label: '34mm'},
    ],
  },
  'time-trial': {
    chainrings: [
      {value: '55-42', label: '55-42T'},
      {value: '54-42', label: '54-42T'},
      {value: '56-44', label: '56-44T'},
      {value: '58-44', label: '58-44T'},
      {value: 'single-55', label: 'Single Ring 55T'},
    ],
    cassettes: [
      {value: '11-23', label: '11-23T'},
      {value: '11-25', label: '11-25T'},
      {value: '12-25', label: '12-25T'},
      {value: '11-26', label: '11-26T'},
    ],
    tires: [
      {value: '20', label: '20mm'},
      {value: '22', label: '22mm'},
      {value: '23', label: '23mm'},
      {value: '25', label: '25mm'},
    ],
  },
  touring: {
    chainrings: [
      {value: '48-36', label: '48-36T'},
      {value: '46-34', label: '46-34T'},
      {value: '44-32', label: '44-32T'},
      {value: '42-30', label: '42-30T'},
      {value: '50-34', label: '50-34T'},
    ],
    cassettes: [
      {value: '11-34', label: '11-34T'},
      {value: '11-36', label: '11-36T'},
      {value: '11-40', label: '11-40T'},
      {value: '12-36', label: '12-36T'},
    ],
    tires: [
      {value: '32', label: '32mm'},
      {value: '35', label: '35mm'},
      {value: '38', label: '38mm'},
      {value: '40', label: '40mm'},
      {value: '42', label: '42mm'},
    ],
  },
  custom: {
    chainrings: [
      {value: '53-39', label: '53-39T'},
      {value: '52-36', label: '52-36T'},
      {value: '50-34', label: '50-34T'},
      {value: '48-32', label: '48-32T'},
      {value: '46-30', label: '46-30T'},
      {value: '44-28', label: '44-28T'},
      {value: 'single-50', label: 'Single Ring 50T'},
    ],
    cassettes: [
      {value: '11-25', label: '11-25T'},
      {value: '11-28', label: '11-28T'},
      {value: '11-32', label: '11-32T'},
      {value: '11-34', label: '11-34T'},
      {value: '11-36', label: '11-36T'},
      {value: '11-40', label: '11-40T'},
      {value: '11-46', label: '11-46T'},
    ],
    tires: [
      {value: '23', label: '23mm'},
      {value: '25', label: '25mm'},
      {value: '28', label: '28mm'},
      {value: '32', label: '32mm'},
      {value: '35', label: '35mm'},
      {value: '40', label: '40mm'},
      {value: '45', label: '45mm'},
    ],
  },
};

const WHEEL_DIAMETERS: Record<GearWheelSize, number> = {
  '700c': 622,
  '650b': 584,
  '26inch': 559,
  '29er': 622,
  '650c': 571,
};

const BASE_CADENCE: Record<RiderType, number> = {
  spinner: 95,
  masher: 75,
  balanced: 85,
  climber: 80,
  sprinter: 90,
};

const TERRAIN_CADENCE_ADJUSTMENT: Record<GearTerrain, number> = {
  climbing: -10,
  flat: 0,
  rolling: 5,
  'time-trial': 10,
  'off-road': -5,
  mixed: 0,
};

export function parseChainrings(chainrings: string): number[] {
  if (chainrings.includes('single')) {
    const teeth = Number.parseInt(chainrings.split('-')[1], 10);

    return Number.isNaN(teeth) ? [] : [teeth];
  }

  return chainrings
    .split('-')
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => !Number.isNaN(value));
}

export function parseCassette(cassette: string): number[] {
  const range = cassette.split('-');
  const start = Number.parseInt(range[0], 10);
  const end = Number.parseInt(range[1], 10);

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return [];
  }

  const teeth = [start];
  let current = start;

  while (current < end) {
    if (current <= 15) {
      current += 1;
    } else {
      current += 2;
    }

    teeth.push(Math.min(current, end));
  }

  return teeth;
}

export function calculateWheelCircumference(
  wheelSize: GearWheelSize,
  tireSize: number,
): number {
  const baseDiameter = WHEEL_DIAMETERS[wheelSize] || 622;
  const totalDiameter = baseDiameter + tireSize * 2;

  return totalDiameter * Math.PI;
}

export function calculateGearAnalysis(
  chainringTeeth: readonly number[],
  cassetteTeeth: readonly number[],
  wheelCircumference: number,
  targetCadence: number,
): GearRow[] {
  const analysis: GearRow[] = [];

  chainringTeeth.forEach((chainring) => {
    cassetteTeeth.forEach((cog) => {
      const gearRatio = chainring / cog;
      const metersPerCrank = (wheelCircumference * gearRatio) / 1000;
      const speedAtTargetCadence =
        (metersPerCrank * targetCadence * 60) / 1000;
      const gearInches = gearRatio * 27;

      analysis.push({
        chainring,
        cog,
        gearRatio: gearRatio.toFixed(2),
        metersPerCrank: metersPerCrank.toFixed(2),
        speedAtTargetCadence: speedAtTargetCadence.toFixed(1),
        gearInches: gearInches.toFixed(1),
        development: metersPerCrank.toFixed(2),
      });
    });
  });

  analysis.sort(
    (a, b) => parseFloat(b.gearRatio) - parseFloat(a.gearRatio),
  );

  return analysis;
}

export function getRecommendedCadence(
  riderType: RiderType,
  terrain: GearTerrain,
): number {
  const baseCadence = BASE_CADENCE[riderType] || 85;
  const terrainAdjustment = TERRAIN_CADENCE_ADJUSTMENT[terrain] || 0;

  return baseCadence + terrainAdjustment;
}

export function validateGearValues(values: GearValues): FieldErrors<GearValues> {
  const errors: FieldErrors<GearValues> = {};

  if (!values.bikeType) {
    errors.bikeType = GEAR_ERRORS.bikeType;
  }

  if (!values.chainrings) {
    errors.chainrings = GEAR_ERRORS.chainrings;
  }

  if (!values.cassette) {
    errors.cassette = GEAR_ERRORS.cassette;
  }

  if (!values.wheelSize) {
    errors.wheelSize = GEAR_ERRORS.wheelSize;
  }

  if (!values.tireSize) {
    errors.tireSize = GEAR_ERRORS.tireSize;
  }

  const targetCadence = parseNumber(values.targetCadence);

  if (targetCadence === null || targetCadence <= 0) {
    errors.targetCadence = GEAR_ERRORS.targetCadence;
  }

  if (!values.riderType) {
    errors.riderType = GEAR_ERRORS.riderType;
  }

  if (!values.terrainType) {
    errors.terrainType = GEAR_ERRORS.terrainType;
  }

  if (!values.fitnessLevel) {
    errors.fitnessLevel = GEAR_ERRORS.fitnessLevel;
  }

  return errors;
}

function generateGearRecommendations(
  optimal: {lowestGear: GearRow; gearRange: number},
  terrain: GearTerrain,
  riderType: RiderType,
  fitness: GearFitnessLevel,
): string[] {
  const recommendations: string[] = [];

  if (terrain === 'climbing') {
    if (parseFloat(optimal.lowestGear.gearRatio) > 0.7) {
      recommendations.push(
        'Consider easier cassette (larger rear cogs) for steep climbs',
      );
    }

    recommendations.push(
      'Your lowest gear should allow climbing at 60-70 RPM',
    );
  } else if (terrain === 'time-trial') {
    recommendations.push(
      'Consider narrower cassette range for smoother gear transitions',
    );
    recommendations.push('Aim for consistent cadence in your primary gear');
  } else if (terrain === 'off-road') {
    recommendations.push('Wide gear range is essential for varied terrain');
    recommendations.push(
      'Consider 1x setup for simplicity if terrain allows',
    );
  }

  if (riderType === 'spinner') {
    recommendations.push('Ensure you have gears to maintain 90-100+ RPM');
  } else if (riderType === 'masher') {
    recommendations.push(
      'Your setup favors lower cadences - ensure adequate low gears',
    );
  }

  if (fitness === 'beginner') {
    recommendations.push(
      'Wider gear range helps manage varying fitness levels',
    );
    recommendations.push(
      'Focus on maintaining comfortable cadence rather than speed',
    );
  } else if (fitness === 'elite') {
    recommendations.push(
      'Consider tight gear spacing for optimal power output',
    );
    recommendations.push('Fine-tune gear ratios for specific race demands');
  }

  if (optimal.gearRange > 3.5) {
    recommendations.push(
      'Very wide gear range - excellent for varied terrain',
    );
  } else if (optimal.gearRange < 2.5) {
    recommendations.push(
      'Narrow gear range - may be limiting for diverse terrain',
    );
  }

  return recommendations;
}

function generateGearInsights(
  gears: readonly GearRow[],
  riderType: RiderType,
  terrain: GearTerrain,
  bikeType: BikeType,
): string[] {
  const insights: string[] = [];
  const totalGears = gears.length;
  const uniqueGears = new Set(gears.map((gear) => gear.gearRatio)).size;

  if (uniqueGears < totalGears) {
    insights.push(
      'Some gear ratios are duplicated - consider more distinct gear combinations',
    );
  }

  const speedRange =
    parseFloat(gears[0].speedAtTargetCadence) -
    parseFloat(gears[gears.length - 1].speedAtTargetCadence);

  if (speedRange > 50) {
    insights.push(
      'Excellent speed range - versatile setup for all conditions',
    );
  } else if (speedRange < 25) {
    insights.push(
      'Limited speed range - may struggle with extreme conditions',
    );
  }

  if (riderType === 'spinner' && bikeType === 'mountain') {
    insights.push(
      'High cadence preference with mountain biking - ensure adequate low gears',
    );
  }

  if (terrain === 'mixed' && totalGears < 18) {
    insights.push(
      'Mixed terrain benefits from wider gear range - consider 2x setup',
    );
  }

  return insights;
}

export function calculateGearRatios(values: GearValues): GearResult {
  if (!values.bikeType) {
    throw new Error(GEAR_ERRORS.bikeType);
  }

  if (!values.chainrings) {
    throw new Error(GEAR_ERRORS.chainrings);
  }

  if (!values.cassette) {
    throw new Error(GEAR_ERRORS.cassette);
  }

  if (!values.wheelSize) {
    throw new Error(GEAR_ERRORS.wheelSize);
  }

  const tireSize = parseNumber(values.tireSize);

  if (tireSize === null) {
    throw new Error(GEAR_ERRORS.tireSize);
  }

  const targetCadence = parseNumber(values.targetCadence);

  if (targetCadence === null || targetCadence <= 0) {
    throw new Error(GEAR_ERRORS.targetCadence);
  }

  if (!values.riderType) {
    throw new Error(GEAR_ERRORS.riderType);
  }

  if (!values.terrainType) {
    throw new Error(GEAR_ERRORS.terrainType);
  }

  if (!values.fitnessLevel) {
    throw new Error(GEAR_ERRORS.fitnessLevel);
  }

  const chainringTeeth = parseChainrings(values.chainrings);
  const cassetteTeeth = parseCassette(values.cassette);
  const wheelCircumference = calculateWheelCircumference(
    values.wheelSize,
    tireSize,
  );
  const gears = calculateGearAnalysis(
    chainringTeeth,
    cassetteTeeth,
    wheelCircumference,
    targetCadence,
  );

  const highestGear = gears[0];
  const lowestGear = gears[gears.length - 1];
  const gearRange =
    parseFloat(highestGear.gearRatio) / parseFloat(lowestGear.gearRatio);
  const cruisingTarget =
    values.fitnessLevel === 'elite'
      ? 35
      : values.fitnessLevel === 'advanced'
        ? 30
        : 25;
  const cruisingGear =
    gears.find(
      (gear) =>
        Math.abs(parseFloat(gear.speedAtTargetCadence) - cruisingTarget) < 2,
    ) ?? gears[Math.floor(gears.length / 2)];
  const climbingGear =
    gears.find(
      (gear) => Math.abs(parseFloat(gear.speedAtTargetCadence) - 18) < 3,
    ) ?? gears[Math.floor(gears.length * 0.8)];
  const highCadenceGear = gears[Math.floor(gears.length * 0.2)];
  const recommendedCadence = getRecommendedCadence(
    values.riderType,
    values.terrainType,
  );

  const speedBands = [
    {label: '20 km/h', min: 19, max: 21},
    {label: '30 km/h', min: 29, max: 31},
    {label: '40 km/h', min: 39, max: 41},
  ].map((band) => ({
    label: band.label,
    gears: gears
      .filter((gear) => {
        const speed = parseFloat(gear.speedAtTargetCadence);

        return speed >= band.min && speed <= band.max;
      })
      .slice(0, 3)
      .map((gear) => `${gear.chainring}/${gear.cog}`),
  }));

  return {
    bikeType: values.bikeType,
    chainrings: values.chainrings,
    cassette: values.cassette,
    targetCadence,
    wheelCircumference,
    gears,
    highestGear,
    lowestGear,
    cruisingGear,
    climbingGear,
    highCadenceGear,
    gearRange,
    recommendedCadence,
    speedBands,
    recommendations: generateGearRecommendations(
      {lowestGear, gearRange},
      values.terrainType,
      values.riderType,
      values.fitnessLevel,
    ),
    insights: generateGearInsights(
      gears,
      values.riderType,
      values.terrainType,
      values.bikeType,
    ),
  };
}
