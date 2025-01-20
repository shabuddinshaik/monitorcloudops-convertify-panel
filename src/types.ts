type FieldName = string;

export type ConversionType = 'binary' | 'hexadecimal' | 'decimal' | 'all';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: 'small' | 'medium' | 'large';  // Corrected or defined series size
  conversionType: ConversionType;
  showOriginalValues: boolean;
  textColor: string;  // Text color property
  selectedField: FieldName; // You can keep this if you are using it, or remove it
}

