// types.ts
export interface SimpleOptions {
  conversionType: 'binary' | 'hexadecimal' | 'all';
  enablePagination: boolean;
  showConstantColumns: boolean;
  textColor: string;
  selectedField?: string;
  textSize: 'small' | 'medium' | 'large';
}
