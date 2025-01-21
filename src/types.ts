type FieldName = string;

export type ConversionType = 'binary' | 'hexadecimal' | 'all';

export interface SimpleOptions {
  text: string;
  conversionType: ConversionType;
  showOriginalValues: boolean;
  textColor: string;  // Text color property
  selectedField: FieldName; // You can keep this if you are using it, or remove it
}