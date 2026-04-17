export type MeasurementType = 'LengthUnit' | 'WeightUnit' | 'VolumeUnit' | 'TemperatureUnit';

export const MEASUREMENT_TYPES: { id: MeasurementType; label: string }[] = [
  { id: 'LengthUnit', label: 'Length' },
  { id: 'WeightUnit', label: 'Weight' },
  { id: 'VolumeUnit', label: 'Volume' },
  { id: 'TemperatureUnit', label: 'Temperature' }
];

export const UNITS_BY_TYPE: Record<MeasurementType, { id: string; label: string }[]> = {
  LengthUnit: [
    { id: 'FEET', label: 'Feet' },
    { id: 'INCHES', label: 'Inches' },
    { id: 'YARDS', label: 'Yards' },
    { id: 'CENTIMETERS', label: 'Centimeters' },
    { id: 'METER', label: 'Meter' }
  ],
  WeightUnit: [
    { id: 'KILOGRAM', label: 'Kilogram' },
    { id: 'GRAM', label: 'Gram' },
    { id: 'POUND', label: 'Pound' }
  ],
  VolumeUnit: [
    { id: 'LITRE', label: 'Litre' },
    { id: 'MILLILITRE', label: 'Millilitre' },
    { id: 'GALLON', label: 'Gallon' }
  ],
  TemperatureUnit: [
    { id: 'CELSIUS', label: 'Celsius' },
    { id: 'FAHRENHEIT', label: 'Fahrenheit' },
    { id: 'KELVIN', label: 'Kelvin' }
  ]
};

