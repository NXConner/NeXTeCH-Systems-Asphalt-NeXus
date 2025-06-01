import React, { useState } from 'react';
import styles from './PopoutCalculator.module.css';

export const PopoutCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [show, setShow] = useState(true);

  const handleButtonClick = (value: string) => {
    setInput(input + value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleEquals = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(input);
      setResult(evalResult.toString());
    } catch {
      setResult('Error');
    }
  };

  if (!show) return null;

  return (
    <div className={styles.popoutCalculator} aria-label="Popout Calculator" role="dialog">
      <div className={styles.header}>
        <strong id="calculator-title">Calculator</strong>
        <button onClick={() => setShow(false)} className={styles.closeButton} aria-label="Close Calculator">&times;</button>
      </div>
      <div className={styles.inputDisplay} aria-live="polite">{input || '0'}</div>
      <div className={styles.resultDisplay} aria-live="polite">{result}</div>
      <div className={styles.buttonGrid}>
        {[7,8,9,'/'].map(v => <button key={v} onClick={() => handleButtonClick(v.toString())} className={styles.button} aria-label={v.toString()}>{v}</button>)}
        {[4,5,6,'*'].map(v => <button key={v} onClick={() => handleButtonClick(v.toString())} className={styles.button} aria-label={v.toString()}>{v}</button>)}
        {[1,2,3,'-'].map(v => <button key={v} onClick={() => handleButtonClick(v.toString())} className={styles.button} aria-label={v.toString()}>{v}</button>)}
        {[0,'.','=','+'].map(v => v === '=' ? <button key={v} onClick={handleEquals} className={styles.equalsButton} aria-label="Equals">=</button> : <button key={v} onClick={() => handleButtonClick(v.toString())} className={styles.button} aria-label={v.toString()}>{v}</button>)}
      </div>
      <button onClick={handleClear} className={styles.clearButton} aria-label="Clear Calculator">Clear</button>
    </div>
  );
}; 