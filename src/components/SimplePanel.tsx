import React, { useState, useRef } from 'react';
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
  const [columnWidths, setColumnWidths] = useState<any>({});
  const [columnFilters, setColumnFilters] = useState<any>({});
  const rowsPerPage = 10;
  const tableRef = useRef<HTMLTableElement>(null);

  const toBinary = (value: number, bits = 32): string => value.toString(2).padStart(bits, '0');
  const toHex = (value: number): string => '0x' + value.toString(16).toUpperCase();

  const series = data.series[0];
  const timeField = series?.fields.find((field) => field.name === 'time');
  const valueField = series?.fields.find((field) => field.name === 'value');

  const timeValues = timeField ? Array.from(timeField.values) : [];
  const valueValues = valueField ? Array.from(valueField.values) : [];

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

  const pageCount = Math.ceil(transformedData.length / rowsPerPage);

  // Apply filters
  const applyColumnFilters = (data: Row[]) => {
    if (Object.keys(columnFilters).length === 0) return data;

    return data.filter((row) => {
      return Object.keys(columnFilters).every((column) => {
        const filterValue = columnFilters[column].toLowerCase();
        const rowValue = row[column] ? row[column].toString().toLowerCase() : '';
        return rowValue.includes(filterValue);
      });
    });
  };

  // Paginate and filter data
  const filteredData = applyColumnFilters(
    transformedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleColumnResize = (index: number, width: number) => {
    setColumnWidths((prevWidths: any) => ({
      ...prevWidths,
      [index]: width,
    }));
  };

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prevFilters: any) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  // Check for "No Data"
  if (!data || !data.series || data.series.length === 0) {
    return (
      <div style={{ width, height, padding: '10px', fontFamily: 'Arial, sans-serif' }}>
        No data
      </div>
    );
  }

  return (
    <div style={{ width, height, overflow: 'auto', padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '10px' }}>
        {/* Display circle when data is present */}
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'green' }}></div>
      </div>
      <table ref={tableRef} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', boxSizing: 'border-box' }}>
        <thead>
          <tr>
            <th
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                backgroundColor: '#1e73be', // Darker header color
                color: 'white',
                textAlign: 'center',
              }}
            >
              Timestamp
            </th>
            <th
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                backgroundColor: '#1e73be', // Darker header color
                color: 'white',
                textAlign: 'center',
              }}
            >
              Value
            </th>
            {options.conversionType === 'binary' || options.conversionType === 'all' ? (
              <th
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  backgroundColor: '#1e73be', // Darker header color
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Binary
              </th>
            ) : null}
            {options.conversionType === 'hexadecimal' || options.conversionType === 'all' ? (
              <th
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  backgroundColor: '#1e73be', // Darker header color
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Hex
              </th>
            ) : null}
            {excelColumns.map((col, index) => (
              <th
                key={col.bit}
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  backgroundColor: '#1e73be', // Darker header color
                  color: 'white',
                  minWidth: columnWidths[index] || 'auto',
                  cursor: 'col-resize',
                  textAlign: 'center',
                }}
                onMouseDown={(e) => {
                  const startX = e.pageX;
                  const startWidth = tableRef.current?.rows[0].cells[index].offsetWidth || 0;
                  const onMouseMove = (moveEvent: MouseEvent) => {
                    const newWidth = startWidth + (moveEvent.pageX - startX);
                    handleColumnResize(index, newWidth);
                  };
                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                  };
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                }}
              >
                {col.name}
                {/* Excel-like filter dropdown */}
                <select
                  onChange={(e) => handleColumnFilterChange(col.name, e.target.value)}
                  style={{
                    marginTop: '5px',
                    padding: '5px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    backgroundColor: '#f4f6f9',
                  }}
                >
                  <option value="">All</option>
                  {Array.from(new Set(transformedData.map((row) => row[col.name]))).map((uniqueValue, i) => (
                    <option key={i} value={uniqueValue}>
                      {uniqueValue}
                    </option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{row.timestamp}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{row.value}</td>
              {row.binary ? <td style={{ padding: '12px', border: '1px solid #ddd' }}>{row.binary}</td> : null}
              {row.hex ? <td style={{ padding: '12px', border: '1px solid #ddd' }}>{row.hex}</td> : null}
              {excelColumns.map((col) => (
                <td key={col.bit} style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {row[col.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ paddingTop: '10px', textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: '5px 10px', marginRight: '10px', backgroundColor: '#1e73be', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Previous
        </button>
        <span style={{ padding: '0 10px', fontWeight: 'bold' }}>
          Page {currentPage} of {pageCount}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          style={{ padding: '5px 10px', marginLeft: '10px', backgroundColor: '#1e73be', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};