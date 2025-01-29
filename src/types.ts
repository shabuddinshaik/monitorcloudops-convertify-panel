// types.ts
export interface SimpleOptions {
  conversionType: 'binary' | 'hexadecimal' | 'decimal' | 'all';
  enablePagination: boolean;
  showConstantColumns: boolean;
  textColor: string;
  selectedField?: string; // Optional field for selecting a specific field from the data
}
