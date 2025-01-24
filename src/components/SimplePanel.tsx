import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from '../types';

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

type Row = {
  timestamp: any;
  value: any;
  binary?: string;
  hex?: string;
  [key: string]: any;
};

export const SimplePanel: React.FC<Props> = ({ data, options, width, height }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<any>({});
  const rowsPerPage = 10;

  const toBinary = (value: number, bits = 32): string => value.toString(2).padStart(bits, '0');
  const toHex = (value: number): string => '0x' + value.toString(16).toUpperCase();

  const series = data.series[0];

  const timeField = series?.fields.find((field) => field.type === 'time');
  const valueField =
    series?.fields.find((field) => field.name === options.selectedField) ||
    series?.fields.find((field) => field.type === 'number');

  if (!timeField || !valueField) {
    return (
      <div style={{ width, height, padding: '10px', fontFamily: 'Arial, sans-serif' }}>
        No valid time or value field found.
      </div>
    );
  }

  const timeValues = Array.from(timeField.values);
  const valueValues = Array.from(valueField.values);

  const transformedData: Row[] = timeValues.map((time, index) => {
    const value = valueValues[index];
    const binaryValue = toBinary(value);

    const bitFields = excelColumns.reduce((acc, col) => {
      acc[col.name] = binaryValue[binaryValue.length - 1 - col.bit] || '0';
      return acc;
    }, {} as Record<string, string>);

    return {
      timestamp: time,
      value,
      binary: options.conversionType === 'binary' || options.conversionType === 'all' ? toBinary(value) : undefined,
      hex: options.conversionType === 'hexadecimal' || options.conversionType === 'all' ? toHex(value) : undefined,
      ...bitFields,
    };
  });

  // Check if transformed data is empty and display "No Data" message
  if (transformedData.length === 0) {
    return (
      <div style={{ width, height, padding: '10px', fontFamily: 'Arial, sans-serif' }}>
        No Data
      </div>
    );
  }

  const uniqueColumnValues = (column: string) => {
    return [...new Set(transformedData.map((row) => row[column]))];
  };

  const applyColumnFilters = (data: Row[]) => {
    if (Object.keys(columnFilters).length === 0) return data;

    return data.filter((row) => {
      return Object.keys(columnFilters).every((column) => {
        const filterValue = columnFilters[column];
        if (!filterValue || filterValue === 'All') return true;
        return row[column]?.toString() === filterValue;
      });
    });
  };

  const filteredData = applyColumnFilters(
    transformedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prevFilters: any) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  return (
    <div style={{ width, height, overflow: 'auto', padding: '5px', fontFamily: 'Arial, sans-serif' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontFamily: 'Arial, sans-serif',
          border: '1px solid #ddd',
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: '5px', backgroundColor: '#0056b3', color: '#fff', fontSize: '12px', minWidth: '160px' }}>Timestamp</th>
            <th style={{ padding: '5px', backgroundColor: '#0056b3', color: '#fff', fontSize: '12px' }}>Value</th>
            {options.conversionType === 'binary' || options.conversionType === 'all' ? (
              <th style={{ padding: '5px', backgroundColor: '#0056b3', color: '#fff', fontSize: '12px' }}>Binary</th>
            ) : null}
            {options.conversionType === 'hexadecimal' || options.conversionType === 'all' ? (
              <th style={{ padding: '5px', backgroundColor: '#0056b3', color: '#fff', fontSize: '12px' }}>Hex</th>
            ) : null}
            {options.showConstantColumns &&
              excelColumns.map((col) => (
                <th
                  key={col.bit}
                  style={{
                    padding: '6px',
                    backgroundColor: '#0056b3',
                    color: '#fff',
                    fontSize: '10px',
                    position: 'relative',
                    minWidth: '150px', // Adjust this value as needed
                    textAlign: 'center',
                  }}
                >
                  {col.name}
                  <select
                    onChange={(e) => handleColumnFilterChange(col.name, e.target.value)}
                    style={{
                      marginTop: '4px',
                      width: '90%',
                      padding: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '10px',
                    }}
                  >
                    <option value="All">All</option>
                    {uniqueColumnValues(col.name).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '6px', border: '1px solid #ddd' }}>
                {new Date(row.timestamp).toLocaleString()}
              </td>
              <td style={{ padding: '6px', border: '1px solid #ddd' }}>{row.value}</td>
              {row.binary ? <td style={{ padding: '6px', border: '1px solid #ddd' }}>{row.binary}</td> : null}
              {row.hex ? <td style={{ padding: '6px', border: '1px solid #ddd' }}>{row.hex}</td> : null}
              {options.showConstantColumns &&
                excelColumns.map((col) => (
                  <td
                    key={col.bit}
                    style={{
                      padding: '6px',
                      border: '1px solid #ddd',
                      minWidth: '150px', // Adjust this value as needed
                      textAlign: 'center',
                    }}
                  >
                    {row[col.name]}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '5px', textAlign: 'center' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            margin: '5px',
            padding: '5px 8px',
            backgroundColor: '#0056b3',
            color: '#fff',
            border: 'none',
          }}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(transformedData.length / rowsPerPage)}
          style={{
            margin: '5px',
            padding: '4px 6px',
            backgroundColor: '#0056b3',
            color: '#fff',
            border: 'none',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};
