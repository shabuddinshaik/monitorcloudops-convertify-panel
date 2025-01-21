import { PanelPlugin } from '@grafana/data';
import { ConvertifyPanel } from './ConvertifyPanel';  // Import the main panel component

export const plugin = new PanelPlugin(ConvertifyPanel);
