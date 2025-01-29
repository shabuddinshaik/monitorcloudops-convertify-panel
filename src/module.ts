import { PanelPlugin } from '@grafana/data';
import { SimplePanel } from './components/SimplePanel';
import { SimpleOptions } from './types';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addSelect({
      path: 'textSize',
      name: 'Text Size',
      defaultValue: 'medium',
      settings: {
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
    })
    .addFieldNamePicker({
      path: 'selectedField',
      name: 'Field',
      defaultValue: '',
    })
    .addRadio({
      path: 'conversionType',
      name: 'Conversion Type',
      defaultValue: 'all',
      settings: {
        options: [
          { value: 'none', label: 'None' },
          { value: 'binary', label: 'Binary' },
          { value: 'hexadecimal', label: 'Hexadecimal' },
          { value: 'all', label: 'All' },
        ],
      },
    })
    .addColorPicker({
      path: 'textColor',
      name: 'Text Color',
      description: 'Choose a color for the table text and header',
      defaultValue: 'white',
    })
    .addBooleanSwitch({
      path: 'showConstantColumns',
      name: 'Show Constant Columns',
      defaultValue: true,
    });
});