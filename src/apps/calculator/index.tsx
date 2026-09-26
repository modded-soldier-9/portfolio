'use client';

import React, { useState, useCallback } from 'react';
import { CalculatorIcon } from '@/core/assets';
import { aeroSound } from '@/components/AeroSound';
import type { AppModuleContract } from '@/apps/types';

type CalcOp = '+' | '-' | '*' | '/' | null;

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<CalcOp>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [mode, setMode] = useState<'standard' | 'scientific'>('standard');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const formatNumber = (val: number): string => {
    if (!Number.isFinite(val)) return 'Cannot divide by zero';
    const rounded = Math.round(val * 1e10) / 1e10;
    const str = String(rounded);
    return str.length > 16 ? rounded.toPrecision(10) : str;
  };

  const compute = (left: number, right: number, op: CalcOp): number => {
    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return right === 0 ? NaN : left / right;
      default:
        return right;
    }
  };

  const inputDigit = useCallback(
    (digit: string) => {
      aeroSound.playClick();
      if (display === 'Cannot divide by zero') {
        setDisplay(digit);
        setWaitingForOperand(false);
        return;
      }
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === '0' ? digit : display.length < 15 ? display + digit : display);
      }
    },
    [display, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    aeroSound.playClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clearEntry = useCallback(() => {
    aeroSound.playClick();
    setDisplay('0');
  }, []);

  const clearAll = useCallback(() => {
    aeroSound.playClick();
    setDisplay('0');
    setExpression('');
    setAccumulator(null);
    setPendingOp(null);
    setWaitingForOperand(false);
  }, []);

  const backspace = useCallback(() => {
    aeroSound.playClick();
    if (waitingForOperand || display === 'Cannot divide by zero') return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    aeroSound.playClick();
    const val = parseFloat(display);
    if (Number.isNaN(val) || val === 0) return;
    setDisplay(formatNumber(-val));
  }, [display]);

  const handleUnary = useCallback(
    (type: 'sqrt' | 'recip' | 'percent' | 'sq' | 'sin' | 'cos' | 'tan' | 'log' | 'ln') => {
      aeroSound.playClick();
      const val = parseFloat(display);
      if (Number.isNaN(val)) return;
      let res = val;
      let label = '';
      switch (type) {
        case 'sqrt':
          if (val < 0) {
            setDisplay('Invalid input');
            setWaitingForOperand(true);
            return;
          }
          res = Math.sqrt(val);
          label = `√(${val})`;
          break;
        case 'recip':
          if (val === 0) {
            setDisplay('Cannot divide by zero');
            setWaitingForOperand(true);
            return;
          }
          res = 1 / val;
          label = `reciproc(${val})`;
          break;
        case 'percent':
          res = accumulator !== null ? (accumulator * val) / 100 : val / 100;
          label = `${res}`;
          break;
        case 'sq':
          res = val * val;
          label = `sqr(${val})`;
          break;
        case 'sin':
          res = Math.sin((val * Math.PI) / 180);
          label = `sin(${val}°)`;
          break;
        case 'cos':
          res = Math.cos((val * Math.PI) / 180);
          label = `cos(${val}°)`;
          break;
        case 'tan':
          res = Math.tan((val * Math.PI) / 180);
          label = `tan(${val}°)`;
          break;
        case 'log':
          res = Math.log10(val);
          label = `log(${val})`;
          break;
        case 'ln':
          res = Math.log(val);
          label = `ln(${val})`;
          break;
      }
      const formatted = formatNumber(res);
      setDisplay(formatted);
      setExpression(label);
      setWaitingForOperand(true);
    },
    [accumulator, display]
  );

  const performOperation = useCallback(
    (nextOp: CalcOp) => {
      aeroSound.playClick();
      const inputValue = parseFloat(display);
      if (Number.isNaN(inputValue)) return;

      if (accumulator === null) {
        setAccumulator(inputValue);
        setExpression(`${inputValue} ${nextOp}`);
      } else if (pendingOp && !waitingForOperand) {
        const result = compute(accumulator, inputValue, pendingOp);
        const formatted = formatNumber(result);
        setDisplay(formatted);
        if (Number.isFinite(result)) {
          setAccumulator(result);
          setExpression(`${formatted} ${nextOp}`);
          setHistory((prev) => [`${accumulator} ${pendingOp} ${inputValue} = ${formatted}`, ...prev.slice(0, 14)]);
        } else {
          setAccumulator(null);
          setExpression('');
        }
      } else {
        setExpression(`${accumulator} ${nextOp}`);
      }

      setWaitingForOperand(true);
      setPendingOp(nextOp);
    },
    [accumulator, display, pendingOp, waitingForOperand]
  );

  const handleEquals = useCallback(() => {
    aeroSound.playClick();
    const inputValue = parseFloat(display);
    if (accumulator === null || !pendingOp || Number.isNaN(inputValue)) return;

    const result = compute(accumulator, inputValue, pendingOp);
    const formatted = formatNumber(result);
    const entry = `${accumulator} ${pendingOp} ${inputValue} = ${formatted}`;
    setDisplay(formatted);
    setExpression('');
    setAccumulator(null);
    setPendingOp(null);
    setWaitingForOperand(true);
    if (Number.isFinite(result)) {
      setHistory((prev) => [entry, ...prev.slice(0, 14)]);
    }
  }, [accumulator, display, pendingOp]);

  const handleMemory = (action: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => {
    aeroSound.playClick();
    const val = parseFloat(display) || 0;
    switch (action) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(formatNumber(memory));
        setWaitingForOperand(true);
        break;
      case 'MS':
        setMemory(val);
        setWaitingForOperand(true);
        break;
      case 'M+':
        setMemory((m) => m + val);
        setWaitingForOperand(true);
        break;
      case 'M-':
        setMemory((m) => m - val);
        setWaitingForOperand(true);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      inputDigit(e.key);
    } else if (e.key === '.') {
      e.preventDefault();
      inputDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      e.preventDefault();
      performOperation(e.key as CalcOp);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      handleEquals();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      clearAll();
    }
  };

  const calcBtnClass =
    'rounded-[3px] border border-[#8797aa] bg-gradient-to-b from-[#f7fbff] via-[#e4edf8] to-[#cfddef] hover:from-[#fff5e6] hover:via-[#ffe4b8] hover:to-[#ffd085] hover:border-[#d99b26] active:scale-[0.96] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] text-[#1e395b] font-medium text-[13px] flex items-center justify-center cursor-pointer transition-transform select-none';

  const digitBtnClass =
    'rounded-[3px] border border-[#8797aa] bg-gradient-to-b from-[#ffffff] via-[#f2f7fc] to-[#e1ebf6] hover:from-[#fff7eb] hover:via-[#ffe9c4] hover:to-[#ffd794] hover:border-[#d99b26] active:scale-[0.96] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] text-[#11243d] font-semibold text-[15px] flex items-center justify-center cursor-pointer transition-transform select-none';

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Windows 7 Calculator"
      className="flex flex-col h-full bg-gradient-to-b from-[#d9e4f1] via-[#e3ecf7] to-[#edf3fa] select-none outline-none"
    >
      {/* 1. Classic Windows 7 Calculator Menu Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-b from-[#f5f9fe] to-[#dce6f4] border-b border-[#b6c7dc] text-[11.5px] text-[#1e395b]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setMode(mode === 'standard' ? 'scientific' : 'standard');
            }}
            className="px-2 py-0.5 rounded hover:bg-[#c9def7] border border-transparent hover:border-[#7da2ce] cursor-pointer"
          >
            <u>V</u>iew: <strong>{mode === 'standard' ? 'Standard' : 'Scientific'}</strong>
          </button>
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              navigator.clipboard?.writeText(display).catch(() => {});
              setCopiedNotice(true);
              setTimeout(() => setCopiedNotice(false), 1800);
            }}
            className="px-2 py-0.5 rounded hover:bg-[#c9def7] border border-transparent hover:border-[#7da2ce] cursor-pointer"
          >
            <u>E</u>dit ({copiedNotice ? '✓ Copied' : 'Copy'})
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            aeroSound.playClick();
            setShowHistory(!showHistory);
          }}
          className={`px-2 py-0.5 rounded border text-[11px] cursor-pointer ${
            showHistory
              ? 'bg-[#cfe4fa] border-[#5689bd] font-semibold'
              : 'border-transparent hover:bg-[#c9def7] hover:border-[#7da2ce]'
          }`}
        >
          History ({history.length})
        </button>
      </div>

      {/* 2. Beveled Aero LCD Readout Display */}
      <div className="px-3 pt-2.5 pb-1.5">
        <div className="h-[58px] rounded-[4px] border border-[#7288a1] bg-gradient-to-b from-[#e5effa] via-[#f3f8fe] to-[#ffffff] shadow-[inset_0_1px_3px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.85)] px-2.5 py-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#4c627d] h-4">
            <span className="font-bold text-[#003399]">{memory !== 0 ? 'M' : ''}</span>
            <span className="font-mono truncate">{expression}</span>
          </div>
          <div
            data-testid="calculator-display"
            className="text-right font-mono font-bold text-[23px] leading-none text-[#0f1f36] tracking-tight truncate selectable-text"
          >
            {display}
          </div>
        </div>
      </div>

      {/* Optional History Tape Drawer */}
      {showHistory && (
        <div className="mx-3 mb-1.5 max-h-24 overflow-y-auto bg-white/90 border border-[#9ab0c7] rounded p-1.5 text-[11px] font-mono text-[#1e395b] space-y-0.5">
          {history.length === 0 ? (
            <div className="text-center text-[#64748b] py-1">No calculation history yet</div>
          ) : (
            history.map((item, i) => (
              <div key={i} className="flex justify-between border-b border-[#edf2f7] py-0.5">
                <span>{item}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Optional Scientific Function Strip */}
      {mode === 'scientific' && (
        <div className="px-3 pb-1.5 grid grid-cols-5 gap-1.5 h-8">
          <button type="button" onClick={() => handleUnary('sin')} className={calcBtnClass}>
            sin
          </button>
          <button type="button" onClick={() => handleUnary('cos')} className={calcBtnClass}>
            cos
          </button>
          <button type="button" onClick={() => handleUnary('tan')} className={calcBtnClass}>
            tan
          </button>
          <button type="button" onClick={() => handleUnary('sq')} className={calcBtnClass}>
            x²
          </button>
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setDisplay(formatNumber(Math.PI));
              setWaitingForOperand(true);
            }}
            className={calcBtnClass}
          >
            π
          </button>
        </div>
      )}

      {/* 3. Authentic Windows 7 5-Column × 6-Row Button Grid */}
      <div className="flex-1 px-3 pb-3 grid grid-cols-5 grid-rows-6 gap-1.5 min-h-0">
        {/* Row 1: Memory Keys */}
        <button
          type="button"
          disabled={memory === 0}
          onClick={() => handleMemory('MC')}
          className={`${calcBtnClass} text-[11.5px] disabled:opacity-45`}
        >
          MC
        </button>
        <button
          type="button"
          disabled={memory === 0}
          onClick={() => handleMemory('MR')}
          className={`${calcBtnClass} text-[11.5px] disabled:opacity-45`}
        >
          MR
        </button>
        <button
          type="button"
          onClick={() => handleMemory('MS')}
          className={`${calcBtnClass} text-[11.5px]`}
        >
          MS
        </button>
        <button
          type="button"
          onClick={() => handleMemory('M+')}
          className={`${calcBtnClass} text-[11.5px]`}
        >
          M+
        </button>
        <button
          type="button"
          onClick={() => handleMemory('M-')}
          className={`${calcBtnClass} text-[11.5px]`}
        >
          M-
        </button>

        {/* Row 2: Backspace, CE, C, ±, √ */}
        <button type="button" onClick={backspace} aria-label="Backspace" className={calcBtnClass}>
          ←
        </button>
        <button type="button" onClick={clearEntry} className={calcBtnClass}>
          CE
        </button>
        <button type="button" onClick={clearAll} className={calcBtnClass}>
          C
        </button>
        <button type="button" onClick={toggleSign} className={calcBtnClass}>
          ±
        </button>
        <button type="button" onClick={() => handleUnary('sqrt')} className={calcBtnClass}>
          √
        </button>

        {/* Row 3: 7, 8, 9, /, % */}
        <button type="button" onClick={() => inputDigit('7')} className={digitBtnClass}>
          7
        </button>
        <button type="button" onClick={() => inputDigit('8')} className={digitBtnClass}>
          8
        </button>
        <button type="button" onClick={() => inputDigit('9')} className={digitBtnClass}>
          9
        </button>
        <button type="button" onClick={() => performOperation('/')} className={calcBtnClass}>
          /
        </button>
        <button type="button" onClick={() => handleUnary('percent')} className={calcBtnClass}>
          %
        </button>

        {/* Row 4: 4, 5, 6, *, 1/x */}
        <button type="button" onClick={() => inputDigit('4')} className={digitBtnClass}>
          4
        </button>
        <button type="button" onClick={() => inputDigit('5')} className={digitBtnClass}>
          5
        </button>
        <button type="button" onClick={() => inputDigit('6')} className={digitBtnClass}>
          6
        </button>
        <button type="button" onClick={() => performOperation('*')} className={calcBtnClass}>
          *
        </button>
        <button type="button" onClick={() => handleUnary('recip')} className={calcBtnClass}>
          1/x
        </button>

        {/* Row 5: 1, 2, 3, -, and tall '=' spanning rows 5-6 */}
        <button type="button" onClick={() => inputDigit('1')} className={digitBtnClass}>
          1
        </button>
        <button type="button" onClick={() => inputDigit('2')} className={digitBtnClass}>
          2
        </button>
        <button type="button" onClick={() => inputDigit('3')} className={digitBtnClass}>
          3
        </button>
        <button type="button" onClick={() => performOperation('-')} className={calcBtnClass}>
          -
        </button>
        <button
          type="button"
          onClick={handleEquals}
          aria-label="Equals"
          className="row-span-2 rounded-[3px] border border-[#5689bd] bg-gradient-to-b from-[#d9ecff] via-[#a7d2fc] to-[#74b6f7] hover:from-[#fff3db] hover:via-[#ffdc9c] hover:to-[#ffbe55] hover:border-[#d99b26] active:scale-[0.96] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] text-[#0f294a] font-bold text-[18px] flex items-center justify-center cursor-pointer transition-transform select-none"
        >
          =
        </button>

        {/* Row 6: wide '0' spanning 2 cols, '.', '+' */}
        <button
          type="button"
          onClick={() => inputDigit('0')}
          className={`col-span-2 ${digitBtnClass}`}
        >
          0
        </button>
        <button type="button" onClick={inputDecimal} className={digitBtnClass}>
          .
        </button>
        <button type="button" onClick={() => performOperation('+')} className={calcBtnClass}>
          +
        </button>
      </div>
    </div>
  );
};

export const calculatorModule: AppModuleContract = {
  id: 'calculator',
  getWindowConfig: () => ({
    id: 'calculator',
    title: 'Calculator',
    shortLabel: 'Calculator',
    glowColor: 'rgba(96, 165, 250, 0.65)',
    defaultPos: { x: 360, y: 80, width: 320, height: 430 },
    pinned: true,
    category: 'accessory',
    description: 'Windows 7 Aero Standard & Scientific Calculator',
  }),
  renderIcon: (size = 32) => <CalculatorIcon size={size} />,
  Component: CalculatorApp,
};
