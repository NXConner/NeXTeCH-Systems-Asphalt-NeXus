import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { evaluate, parse } from 'mathjs';
import styles from './SealcoatingSpreadsheetApp.module.css';

interface SealcoatingSpreadsheetAppProps {
  onCellSelect?: (value: any) => void;
}

export const SealcoatingSpreadsheetApp: React.FC<SealcoatingSpreadsheetAppProps> = ({ onCellSelect }) => {
  const [sheets, setSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>('');
  const [data, setData] = useState<any[][]>([]);
  const [editCell, setEditCell] = useState<{row: number, col: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{start: {row: number, col: number}, end: {row: number, col: number}} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`sealcoating_sheet_${activeSheet}`);
    if (saved) {
      try {
        setData(JSON.parse(saved));
        return;
      } catch {}
    }
    const loadExcel = async () => {
      try {
        const XLSX = await import('xlsx');
        const response = await fetch('/Sealcoating%20Calc%202010_2016.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        setSheets(workbook.SheetNames);
        const firstSheet = workbook.SheetNames[0];
        setActiveSheet(firstSheet);
        const worksheet = workbook.Sheets[firstSheet];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setData(Array.isArray(json) ? json.map(row => Array.isArray(row) ? row : [row]) : []);
      } catch (err: any) {
        setError('Failed to load spreadsheet: ' + err.message);
      }
    };
    loadExcel();
  }, [activeSheet]);

  useEffect(() => {
    if (data.length && activeSheet) {
      localStorage.setItem(`sealcoating_sheet_${activeSheet}`, JSON.stringify(data));
    }
  }, [data, activeSheet]);

  const handleSheetChange = async (sheet: string) => {
    try {
      const XLSX = await import('xlsx');
      const response = await fetch('/Sealcoating%20Calc%202010_2016.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      setActiveSheet(sheet);
      const worksheet = workbook.Sheets[sheet];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(Array.isArray(json) ? json.map(row => Array.isArray(row) ? row : [row]) : []);
    } catch (err: any) {
      setError('Failed to load sheet: ' + err.message);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (onCellSelect) {
      onCellSelect(data[row][col]);
      return;
    }
    setEditCell({ row, col });
    setEditValue(data[row][col] || '');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditBlur = () => {
    if (editCell) {
      const newData = data.map((rowArr, i) =>
        rowArr.map((cell, j) =>
          i === editCell.row && j === editCell.col ? editValue : cell
        )
      );
      setData(newData);
      setEditCell(null);
      setEditValue('');
    }
  };

  function arrayToCSV(data: any[][]) {
    return data.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
  }

  function csvToArray(csv: string): any[][] {
    return csv.split(/\r?\n/).map(row => row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(cell => cell.replace(/^"|"$/g, '').replace(/""/g, '"')));
  }

  const handleExportCSV = () => {
    const csv = arrayToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${activeSheet || 'sheet'}.csv`);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const arr = csvToArray(text);
      setData(arr);
    };
    reader.readAsText(file);
  };

  function cellRefToIndex(ref: string): [number, number] | null {
    const match = ref.match(/^([A-Z]+)([0-9]+)$/i);
    if (!match) return null;
    const col = match[1].toUpperCase().split('').reduce((acc, c) => acc * 26 + (c.charCodeAt(0) - 64), 0) - 1;
    const row = parseInt(match[2], 10) - 1;
    return [row, col];
  }

  const getDisplayValue = (cell: any, rowIdx?: number, colIdx?: number) => {
    if (typeof cell === 'string' && cell.trim().startsWith('=')) {
      try {
        let expr = cell.slice(1);
        expr = expr.replace(/([A-Z]+[0-9]+)/gi, (ref) => {
          const idx = cellRefToIndex(ref);
          if (!idx) return '0';
          const [r, c] = idx;
          if (data[r] && data[r][c] !== undefined) {
            const v = data[r][c];
            if (typeof v === 'string' && v.trim().startsWith('=')) {
              return getDisplayValue(v, r, c);
            }
            return v || 0;
          }
          return '0';
        });
        return evaluate(expr);
      } catch {
        return 'ERR';
      }
    }
    return cell;
  };

  const handleResetSheet = async () => {
    localStorage.removeItem(`sealcoating_sheet_${activeSheet}`);
    try {
      const XLSX = await import('xlsx');
      const response = await fetch('/Sealcoating%20Calc%202010_2016.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[activeSheet];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(Array.isArray(json) ? json.map(row => Array.isArray(row) ? row : [row]) : []);
    } catch (err: any) {
      setError('Failed to reload sheet: ' + err.message);
    }
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedRange({ start: { row, col }, end: { row, col } });
  };

  const handleCellMouseOver = (row: number, col: number) => {
    if (isSelecting && selectedRange) {
      setSelectedRange({ ...selectedRange, end: { row, col } });
    }
  };

  const handleCellMouseUp = () => {
    setIsSelecting(false);
    if (selectedRange) {
      const { start, end } = selectedRange;
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      const values: any[][] = [];
      for (let i = minRow; i <= maxRow; i++) {
        const rowVals = [];
        for (let j = minCol; j <= maxCol; j++) {
          rowVals.push(data[i]?.[j]);
        }
        values.push(rowVals);
      }
      if (onCellSelect) {
        onCellSelect(values);
      }
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!data.length) {
    return <div>Loading spreadsheet...</div>;
  }

  return (
    <div className={styles.spreadsheetContainer}>
      <strong>Sealcoating Spreadsheet</strong>
      <div className={styles.sheetControls}>
        {sheets.map(sheet => (
          <button
            key={sheet}
            onClick={() => handleSheetChange(sheet)}
            className={sheet === activeSheet ? styles.activeSheetButton : styles.sheetButton}
          >
            {sheet}
          </button>
        ))}
        <button onClick={handleExportCSV} className={styles.exportButton}>Export CSV</button>
        <label className={styles.importLabel}>
          Import CSV
          <input type="file" accept=".csv" onChange={handleImportCSV} className={styles.importInput} />
        </label>
        <button onClick={handleResetSheet} className={styles.resetButton}>Reset Sheet</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell: any, j: number) => {
                let isSelected = false;
                if (selectedRange) {
                  const { start, end } = selectedRange;
                  const minRow = Math.min(start.row, end.row);
                  const maxRow = Math.max(start.row, end.row);
                  const minCol = Math.min(start.col, end.col);
                  const maxCol = Math.max(start.col, end.col);
                  isSelected = i >= minRow && i <= maxRow && j >= minCol && j <= maxCol;
                }
                return (
                  <td
                    key={j}
                    style={{ border: '1px solid #eee', padding: 4, minWidth: 60, cursor: 'pointer', background: isSelected ? '#ffe58f' : (editCell && editCell.row === i && editCell.col === j ? '#e6f7ff' : undefined) }}
                    onClick={() => handleCellClick(i, j)}
                    onMouseDown={() => handleCellMouseDown(i, j)}
                    onMouseOver={() => handleCellMouseOver(i, j)}
                    onMouseUp={handleCellMouseUp}
                    aria-label={`Cell ${i + 1}, ${j + 1}`}
                    tabIndex={0}
                    title={isSelected ? 'Selected for batch mapping' : 'Click or drag to select'}
                  >
                    {editCell && editCell.row === i && editCell.col === j ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                        style={{ width: '100%' }}
                        placeholder="Edit cell value"
                      />
                    ) : (
                      getDisplayValue(cell, i, j)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 