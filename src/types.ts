type FieldName = string;

export type ConversionType = 'binary' | 'hexadecimal' | 'all';

export interface SimpleOptions {
  text: string;
  conversionType: string;
  textColor: string;
  selectedField: FieldName;  // Use FieldName here
  showConstantColumns: boolean;
}