import React, { useState } from 'react';
import { PanelProps } from '@grafana/data'; // Remove getColorForTheme import
import { SimpleOptions } from '../types';
import { useStyles2, useTheme } from '@grafana/ui'; // Ensure useTheme is imported
import { css } from '@emotion/css';
import DataGrid, { Column } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { format } from 'date-fns';

interface Props extends PanelProps<SimpleOptions> {}

const excelColumns = [
  { bit: 0, name: 'Status (Bit 0)', description: '1=Running, 0=Not Running' },
  { bit: 1, name: 'Stop (Bit 1)', description: '1=Stop, 0=Stop' },
  { bit: 2, name: 'Init. Standby (Bit 2)', description: '1=[SET], 0=[CLR]' },
  { bit: 3, name: 'Key Stop (Bit 3)', description: '1=[SET] Key Stop, 0=[CLR] Key Stop' },
  { bit: 4, name: 'Standby (Bit 4)', description: '1=SET, 0=CLR' },
  { bit: 5, name: 'Emergency Stop (Bit 5)', description: '1=SET, 0=CLR' },
  { bit: 6, name: 'Starting (Bit 6)', description: '1=True, 0=False' },
  { bit: 7, name: 'Stopping (Bit 7)', description: '1=TRUE, 0=FALSE' },
  { bit: 9, name: 'Fault Stop (Bit 9)', description: '1=High, 0=Low' },
  { bit: 10, name: 'Fault Stop (Bit 10)', description: '1=High, 0=Low' },
  { bit: 11, name: 'Derating Running (Bit 11)', description: '1=Running, 0=Not Running' },
  { bit: 13, name: 'IO-DSP Comm Abnormal (Bit 13)', description: '1=Abnormal, 0=Normal' },
  { bit: 17, name: 'Total Signal Bit of Running State (Bit 17)', description: '1=Set, 0=Clear' },
  { bit: 18, name: 'Total Stop Bit (Bit 18)', description: '1=Set, 0=Clear' },
  { bit: 19, name: 'Anti-PID Running (Bit 19)', description: '1=Running, 0=Not Running' },
  { bit: 20, name: 'Anti-PID Running (Bit 20)', description: '1=Running, 0=Not Running' },
];

type DataRow = {
  timestamp: any;
  value: any;
  binary?: string;
  hex?: string;
  [key: string]: any;
};

export const SimplePanel: React.FC<Props> = ({ data, options, width, height }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const theme = useTheme(); // Use the useTheme hook to access the current theme

  const timeField = data.series[0]?.fields.find((field) => field.type === 'time');
  const valueField =
    data.series[0]?.fields.find((field) => field.name === options.selectedField) ||
    data.series[0]?.fields.find((field) => field.type === 'number');

  const toBinary = (value: number, bits = 32): string => value.toString(2).padStart(bits, '0');
  const toHex = (value: number): string => '0x' + value.toString(16).toUpperCase();

  // Use theme.visualization.getColorByName to resolve theme colors
  const textColor = theme.visualization.getColorByName(options.textColor);

  const styles = useStyles2((theme) => ({
    container: css({
      width,
      height,
      overflow: 'auto',
      padding: theme.spacing(1),
      fontFamily: theme.typography.fontFamily,
    }),
    table: css({
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      fontFamily: theme.typography.fontFamily,
    }),
    th: css({
      padding: theme.spacing(1),
      backgroundColor: 'transparent',  // Transparent background
      color: textColor,  // Dynamic text color
      fontSize: theme.typography.size.sm,
      minWidth: '160px',
      textAlign: 'center',
    }),
    td: css({
      padding: theme.spacing(1),
      border: `1px solid ${textColor}`,
      color: textColor,  // Dynamic text color
    }),
    button: css({
      padding: '5px 8px',
      backgroundColor: theme.colors.primary.main,
      color: textColor,
      border: 'none',
      borderRadius: theme.shape.borderRadius(),
      '&:disabled': {
        backgroundColor: theme.colors.action.disabledBackground,
        color: theme.colors.action.disabledText,
      },
    }),
    dataGrid: css({
      backgroundColor: 'transparent !important', // Make the background transparent
      '& .rdg-cell': {
        backgroundColor: 'transparent !important', // Make cell backgrounds transparent
        color: textColor,  // Dynamic text color
      },
    }),
  }));

  if (!data || !data.series || data.series.length === 0 || !timeField || !valueField) {
    return (
      <div className={styles.container}>
        <div>No data</div>
      </div>
    );
  }

  const timeValues = Array.from(timeField.values);
  const valueValues = Array.from(valueField.values);

  const transformedData: DataRow[] = timeValues.map((time, index) => {
    const value = valueValues[index];
    const binaryValue = toBinary(value);

    const bitFields = excelColumns.reduce((acc, col) => {
      acc[col.name] = binaryValue[binaryValue.length - 1 - col.bit] || '0';
      return acc;
    }, {} as Record<string, string>);

    return {
      timestamp: format(new Date(time), 'yyyy-MM-dd HH:mm:ss'),
      value,
      binary: options.conversionType === 'binary' || options.conversionType === 'all' ? toBinary(value) : undefined,
      hex: options.conversionType === 'hexadecimal' || options.conversionType === 'all' ? toHex(value) : undefined,
      ...bitFields,
    };
  });

  const applyColumnFilters = (data: DataRow[]) => {
    return data;
  };

  const filteredData = applyColumnFilters(
    transformedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns: Column<DataRow>[] = [
    { key: 'timestamp', name: 'Timestamp', resizable: true },
    { key: 'value', name: 'Value', resizable: true },
    ...(options.conversionType === 'binary' || options.conversionType === 'all'
      ? [{ key: 'binary', name: 'Binary', resizable: true }]
      : []),
    ...(options.conversionType === 'hexadecimal' || options.conversionType === 'all'
      ? [{ key: 'hex', name: 'Hex', resizable: true }]
      : []),
    ...(options.showConstantColumns
      ? excelColumns.map((col) => ({ key: col.name, name: col.name, resizable: true }))
      : []),
  ];

  return (
    <div className={styles.container}>
      <DataGrid
        columns={columns}
        rows={filteredData}
        rowHeight={30}
        headerRowHeight={30}
        onRowsChange={(rows) => {
          // Handle row changes if needed
        }}
        className={styles.dataGrid} // Apply custom styles to make the background transparent
      />
      <div style={{ marginTop: '5px', textAlign: 'center' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.button}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(transformedData.length / rowsPerPage)}
          className={styles.button}
        >
          Next
        </button>
      </div>
    </div>
  );
};
