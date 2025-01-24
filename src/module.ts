import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addRadio({
      path: 'conversionType',
      name: 'Conversion Type',
      description: 'Select the conversion type for table values',
      defaultValue: 'binary',
      settings: {
        options: [
          { value: 'binary', label: 'Binary' },
          { value: 'hexadecimal', label: 'Hexadecimal' },
          { value: 'all', label: 'All' },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'showConstantColumns',
      name: 'Show Constant Columns',
      description: 'Toggle to show or hide constant columns',
      defaultValue: true, // Default to show constant columns
    });
});