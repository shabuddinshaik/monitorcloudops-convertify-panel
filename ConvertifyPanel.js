import React from 'react';
import { PanelProps } from '@grafana/data';

export const ConvertifyPanel = ({ options, data, width, height }: PanelProps) => {
  return (
    <div style={{ width, height }}>
      <h2>Convertify Panel</h2>
      <p>This panel is used to visualize and convert data formats.</p>
    </div>
  );
};
