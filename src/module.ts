import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'text',
      name: 'Simple text option',
      description: 'Description of panel option',
      defaultValue: 'Default value of text input option',
    })
    .addRadio({
      path: 'conversionType',
      name: 'Conversion Type',
      description: 'Select the conversion type for table values',
      defaultValue: 'binary',
      settings: {
        options: [
          { value: 'binary', label: 'Binary' },
          { value: 'hexadecimal', label: 'Hexadecimal' },
          { value: 'decimal', label: 'Decimal' },
          { value: 'all', label: 'All' }, // Add option to show all conversions
        ],
      },
    })
    .addBooleanSwitch({
      path: 'showOriginalValues',
      name: 'Show Original Values',
      description: 'Toggle to show original values alongside converted values',
      defaultValue: true,
    })
    .addColorPicker({
      path: 'textColor',
      name: 'Text Color',
      defaultValue: '#000000',  // Default color is black
      description: 'Select the text color for the panel',
    })
    .addSelect({
      path: 'selectedField',
      name: 'Select Field for Conversion',
      defaultValue: '',
      description: 'Choose which field to convert',
      settings: {
        options: [
          { value: '', label: 'None' }, // Add other fields dynamically here based on your dataset
          { value: 'time', label: 'Time' },
          { value: 'otherField', label: 'Other Field' },  // Example of another field
        ],
      },
    });
});