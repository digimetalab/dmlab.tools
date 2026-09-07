import React, { useState } from 'react';
import { CopyButton } from './TextTools';
import { Percent, Ratio, HardDrive } from 'lucide-react';

// 1. Percentage Calculator
export function PercentageCalculatorTool() {
  // Mode 1: What is X% of Y?
  const [p1X, setP1X] = useState<number>(15);
  const [p1Y, setP1Y] = useState<number>(250);
  const res1 = (p1X / 100) * p1Y;

  // Mode 2: X is what % of Y?
  const [p2X, setP2X] = useState<number>(45);
  const [p2Y, setP2Y] = useState<number>(180);
  const res2 = p2Y ? ((p2X / p2Y) * 100).toFixed(2) : '0';

  // Mode 3: % Increase/Decrease from X to Y
  const [p3X, setP3X] = useState<number>(80);
  const [p3Y, setP3Y] = useState<number>(120);
  const diff3 = p3Y - p3X;
  const res3 = p3X ? (((p3Y - p3X) / p3X) * 100).toFixed(2) : '0';

  return (
    <div id="percentage-calculator-tool" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Calculation 1 */}
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
            What is X% of Y?
          </span>
          <div className="space-y-2.5 text-xs font-bold text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-20">Percent (%):</span>
              <input
                type="number"
                value={p1X}
                onChange={e => setP1X(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20">Of Value:</span>
              <input
                type="number"
                value={p1Y}
                onChange={e => setP1Y(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-[#cbd5e1]/40 dark:border-slate-800 flex items-center justify-between">
            <span className="text-2xl font-extrabold font-mono text-[#3D4852] dark:text-white">{res1}</span>
            <CopyButton text={String(res1)} />
          </div>
        </div>

        {/* Calculation 2 */}
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#38B2AC]">
            X is what % of Y?
          </span>
          <div className="space-y-2.5 text-xs font-bold text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-20">Value X:</span>
              <input
                type="number"
                value={p2X}
                onChange={e => setP2X(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20">Total Y:</span>
              <input
                type="number"
                value={p2Y}
                onChange={e => setP2Y(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-[#cbd5e1]/40 dark:border-slate-800 flex items-center justify-between">
            <span className="text-2xl font-extrabold font-mono text-[#3D4852] dark:text-white">{res2}%</span>
            <CopyButton text={`${res2}%`} />
          </div>
        </div>

        {/* Calculation 3 */}
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            % Change from X to Y
          </span>
          <div className="space-y-2.5 text-xs font-bold text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-20">Initial X:</span>
              <input
                type="number"
                value={p3X}
                onChange={e => setP3X(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20">Final Y:</span>
              <input
                type="number"
                value={p3Y}
                onChange={e => setP3Y(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-[#cbd5e1]/40 dark:border-slate-800 flex items-center justify-between">
            <span className={`text-2xl font-extrabold font-mono ${diff3 >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              {diff3 >= 0 ? `+${res3}%` : `${res3}%`}
            </span>
            <CopyButton text={`${res3}%`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Aspect Ratio Calculator
export function AspectRatioTool() {
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (ratioW && ratioH) {
      setHeight(Math.round((val * ratioH) / ratioW));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (ratioW && ratioH) {
      setWidth(Math.round((val * ratioW) / ratioH));
    }
  };

  const presetRatios = [
    { label: '16:9 (HD / YouTube)', w: 16, h: 9 },
    { label: '4:3 (Standard Screen)', w: 4, h: 3 },
    { label: '1:1 (Square / Post)', w: 1, h: 1 },
    { label: '9:16 (Stories / Reels)', w: 9, h: 16 },
    { label: '21:9 (Ultrawide)', w: 21, h: 9 },
  ];

  return (
    <div id="aspect-ratio-tool" className="space-y-6">
      <div className="p-6 rounded-2xl neu-flat space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {presetRatios.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setRatioW(p.w);
                setRatioH(p.h);
                setHeight(Math.round((width * p.h) / p.w));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                ratioW === p.w && ratioH === p.h
                  ? 'neu-pressed text-[#6C63FF]'
                  : 'neu-convex-xs text-[#3D4852] dark:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-[#6B7280]">
          <div>
            <span>Ratio Width</span>
            <input
              type="number"
              value={ratioW}
              onChange={e => setRatioW(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl neu-pressed-deep mt-1 font-mono text-sm text-[#3D4852] dark:text-slate-100"
            />
          </div>
          <div>
            <span>Ratio Height</span>
            <input
              type="number"
              value={ratioH}
              onChange={e => setRatioH(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl neu-pressed-deep mt-1 font-mono text-sm text-[#3D4852] dark:text-slate-100"
            />
          </div>
          <div>
            <span>Pixel Width (px)</span>
            <input
              type="number"
              value={width}
              onChange={e => handleWidthChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl neu-pressed-deep mt-1 font-mono text-sm text-[#6C63FF] font-extrabold"
            />
          </div>
          <div>
            <span>Pixel Height (px)</span>
            <input
              type="number"
              value={height}
              onChange={e => handleHeightChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl neu-pressed-deep mt-1 font-mono text-sm text-[#6C63FF] font-extrabold"
            />
          </div>
        </div>
      </div>

      <div className="h-56 rounded-[28px] flex items-center justify-center neu-pressed-deep p-6 overflow-hidden">
        <div
          style={{ aspectRatio: `${ratioW} / ${ratioH}` }}
          className="max-h-full max-w-full neu-flat rounded-2xl flex items-center justify-center text-[#3D4852] dark:text-slate-100 font-mono text-sm font-extrabold p-4"
        >
          {width} × {height} ({ratioW}:{ratioH})
        </div>
      </div>
    </div>
  );
}

// 3. Data Storage Unit Converter
export function StorageConverterTool() {
  const [val, setVal] = useState<number>(10);
  const [unit, setUnit] = useState<'GB' | 'MB' | 'KB' | 'TB' | 'Bytes'>('GB');

  const unitMultipliers: Record<string, number> = {
    Bytes: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  const bytes = (val || 0) * (unitMultipliers[unit] || 1);
  const unitsList = ['Bytes', 'KB', 'MB', 'GB', 'TB'] as const;

  return (
    <div id="storage-converter-tool" className="space-y-6">
      <div className="p-6 rounded-2xl neu-flat flex items-center gap-4">
        <input
          type="number"
          value={val}
          onChange={e => setVal(parseFloat(e.target.value) || 0)}
          className="w-48 px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-lg font-extrabold text-[#3D4852] dark:text-slate-100"
        />
        <select
          value={unit}
          onChange={e => setUnit(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl neu-convex-xs font-bold text-sm text-[#3D4852] dark:text-slate-200 cursor-pointer"
        >
          {unitsList.map(u => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {unitsList.map(u => {
          const converted = bytes / unitMultipliers[u];
          const displayVal = converted < 0.0001 && converted > 0 ? converted.toExponential(4) : converted.toLocaleString();
          return (
            <div
              key={u}
              className="p-5 rounded-2xl neu-flat flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-[#6B7280] uppercase font-extrabold">{u}</span>
                <div className="text-lg font-mono font-extrabold text-[#3D4852] dark:text-slate-100">{displayVal}</div>
              </div>
              <CopyButton text={String(converted)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Roman Numeral Converter
export function RomanNumeralTool() {
  const [arabic, setArabic] = useState<number>(2026);
  const [roman, setRoman] = useState<string>('MMXXVI');

  const toRoman = (num: number): string => {
    if (num <= 0 || num > 3999) return 'Out of range (1-3999)';
    const map: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let res = '';
    for (const [val, letter] of map) {
      while (num >= val) {
        res += letter;
        num -= val;
      }
    }
    return res;
  };

  const fromRoman = (str: string): number => {
    const map: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    };
    let total = 0;
    let upper = str.toUpperCase().trim();
    for (let i = 0; i < upper.length; i++) {
      const curr = map[upper[i]] || 0;
      const next = map[upper[i + 1]] || 0;
      if (curr < next) {
        total += next - curr;
        i++;
      } else {
        total += curr;
      }
    }
    return total;
  };

  const handleArabicChange = (val: number) => {
    setArabic(val);
    setRoman(toRoman(val));
  };

  const handleRomanChange = (str: string) => {
    setRoman(str.toUpperCase());
    setArabic(fromRoman(str));
  };

  return (
    <div id="roman-numeral-tool" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Arabic Number (1-3999)</label>
          <input
            type="number"
            min={1}
            max={3999}
            value={arabic}
            onChange={e => handleArabicChange(parseInt(e.target.value) || 0)}
            className="w-full px-5 py-3.5 rounded-xl neu-pressed-deep font-mono text-xl font-bold text-[#3D4852] dark:text-white"
          />
        </div>

        <div className="p-6 rounded-2xl neu-flat space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Roman Numeral</label>
            <CopyButton text={roman} label="Copy" />
          </div>
          <input
            type="text"
            value={roman}
            onChange={e => handleRomanChange(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl neu-pressed-deep font-mono text-xl font-bold text-[#6C63FF]"
          />
        </div>
      </div>
    </div>
  );
}

// 5. Date & Time Difference Calculator
export function TimeDifferenceTool() {
  const [startDate, setStartDate] = useState('2026-01-01T00:00');
  const [endDate, setEndDate] = useState('2026-12-31T23:59');

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffMs = Math.max(0, end - start);

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = (totalDays / 7).toFixed(1);

  return (
    <div id="time-difference-tool" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl neu-flat">
        <div>
          <label className="text-xs font-bold text-[#6B7280]">Start Date & Time</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep mt-1 font-mono text-xs font-bold text-[#3D4852] dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#6B7280]">End Date & Time</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep mt-1 font-mono text-xs font-bold text-[#3D4852] dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Days', val: totalDays.toLocaleString() },
          { label: 'Total Weeks', val: totalWeeks },
          { label: 'Total Hours', val: totalHours.toLocaleString() },
          { label: 'Total Minutes', val: totalMinutes.toLocaleString() },
        ].map(item => (
          <div key={item.label} className="p-5 rounded-2xl neu-flat text-center space-y-1">
            <span className="text-xs font-bold text-[#6B7280]">{item.label}</span>
            <div className="text-2xl font-mono font-extrabold text-[#6C63FF]">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Lorem Ipsum & Dummy Text Generator
export function LoremIpsumGeneratorTool() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');

  const baseWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
    'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
    'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
    'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
    'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateLorem = () => {
    if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(baseWords[i % baseWords.length]);
      }
      return words.join(' ');
    }
    if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        const sentenceLength = 8 + (i % 6);
        const words = [];
        for (let j = 0; j < sentenceLength; j++) {
          words.push(baseWords[(i * 7 + j) % baseWords.length]);
        }
        const s = words.join(' ');
        sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
      }
      return sentences.join(' ');
    }
    // paragraphs
    const paragraphs = [];
    for (let p = 0; p < count; p++) {
      const sentences = [];
      for (let s = 0; s < 4; s++) {
        const words = [];
        for (let w = 0; w < 10; w++) {
          words.push(baseWords[(p * 40 + s * 10 + w) % baseWords.length]);
        }
        const sent = words.join(' ');
        sentences.push(sent.charAt(0).toUpperCase() + sent.slice(1) + '.');
      }
      paragraphs.push(sentences.join(' '));
    }
    return paragraphs.join('\n\n');
  };

  const output = generateLorem();

  return (
    <div id="lorem-ipsum-generator-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-3">
          <span>Generate:</span>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-center text-sm font-bold text-[#3D4852] dark:text-white"
          />
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {(['paragraphs', 'sentences', 'words'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg capitalize cursor-pointer ${type === t ? 'neu-tab-active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <CopyButton text={output} label="Copy Text" />
      </div>

      <textarea
        readOnly
        value={output}
        rows={10}
        className="w-full px-6 py-5 rounded-2xl neu-flat text-sm leading-relaxed text-[#3D4852] dark:text-slate-100"
      />
    </div>
  );
}

// 7. IPv4 Subnet Calculator
export function SubnetCalculatorTool() {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

  const getSubnetMask = (c: number) => {
    let mask = [];
    for (let i = 0; i < 4; i++) {
      let n = Math.min(c, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      c -= n;
    }
    return mask.join('.');
  };

  return (
    <div id="subnet-calculator-tool" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl neu-flat">
        <div>
          <label className="text-xs font-bold text-[#6B7280]">IP Address</label>
          <input
            type="text"
            value={ip}
            onChange={e => setIp(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep mt-1 font-mono text-xs font-bold text-[#3D4852] dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#6B7280]">CIDR Prefix: /{cidr}</label>
          <input
            type="range"
            min={1}
            max={32}
            value={cidr}
            onChange={e => setCidr(parseInt(e.target.value))}
            className="w-full mt-3 accent-[#6C63FF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl neu-flat space-y-1">
          <span className="text-xs font-bold text-[#6B7280]">Subnet Mask</span>
          <div className="text-lg font-mono font-extrabold text-[#6C63FF]">{getSubnetMask(cidr)}</div>
        </div>
        <div className="p-5 rounded-2xl neu-flat space-y-1">
          <span className="text-xs font-bold text-[#6B7280]">Total Addresses</span>
          <div className="text-lg font-mono font-extrabold text-[#3D4852] dark:text-white">{totalHosts.toLocaleString()}</div>
        </div>
        <div className="p-5 rounded-2xl neu-flat space-y-1">
          <span className="text-xs font-bold text-[#6B7280]">Usable Host IPs</span>
          <div className="text-lg font-mono font-extrabold text-emerald-500">{usableHosts.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

// 8. Length & Weight Unit Converter
export function LengthWeightUnitConverterTool() {
  const [category, setCategory] = useState<'length' | 'weight' | 'temperature'>('length');
  const [val, setVal] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  // Conversion factors relative to standard base unit (meter, kg)
  const lengthFactors: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  };

  const weightFactors: Record<string, number> = {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    ton: 1000,
    oz: 0.0283495,
    lb: 0.453592,
  };

  const unitLabels: Record<string, string> = {
    mm: 'Millimeter (mm)',
    cm: 'Centimeter (cm)',
    m: 'Meter (m)',
    km: 'Kilometer (km)',
    in: 'Inch (in)',
    ft: 'Foot (ft)',
    yd: 'Yard (yd)',
    mi: 'Mile (mi)',
    mg: 'Milligram (mg)',
    g: 'Gram (g)',
    kg: 'Kilogram (kg)',
    ton: 'Metric Ton (t)',
    oz: 'Ounce (oz)',
    lb: 'Pound (lb)',
    c: 'Celsius (°C)',
    f: 'Fahrenheit (°F)',
    k: 'Kelvin (K)',
  };

  const calculateResult = (): number => {
    if (category === 'length') {
      const inMeters = val * (lengthFactors[fromUnit] || 1);
      return inMeters / (lengthFactors[toUnit] || 1);
    }
    if (category === 'weight') {
      const inKg = val * (weightFactors[fromUnit] || 1);
      return inKg / (weightFactors[toUnit] || 1);
    }
    // Temperature
    if (fromUnit === toUnit) return val;
    let inC = val;
    if (fromUnit === 'f') inC = (val - 32) * (5 / 9);
    if (fromUnit === 'k') inC = val - 273.15;

    if (toUnit === 'c') return inC;
    if (toUnit === 'f') return (inC * 9) / 5 + 32;
    if (toUnit === 'k') return inC + 273.15;
    return val;
  };

  const result = calculateResult();

  return (
    <div id="unit-converter-tool" className="space-y-6">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm w-fit">
        {(['length', 'weight', 'temperature'] as const).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              if (cat === 'length') {
                setFromUnit('m');
                setToUnit('ft');
              } else if (cat === 'weight') {
                setFromUnit('kg');
                setToUnit('lb');
              } else {
                setFromUnit('c');
                setToUnit('f');
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all ${
              category === cat ? 'neu-tab-active' : 'text-[#6B7280]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl neu-flat">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#6B7280]">From Value</label>
            <input
              type="number"
              value={val}
              onChange={e => setVal(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-sm font-bold text-[#3D4852] dark:text-white mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B7280]">From Unit</label>
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs font-bold text-[#3D4852] dark:text-white mt-1 bg-transparent cursor-pointer"
            >
              {category === 'length' &&
                Object.keys(lengthFactors).map(u => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {unitLabels[u]}
                  </option>
                ))}
              {category === 'weight' &&
                Object.keys(weightFactors).map(u => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {unitLabels[u]}
                  </option>
                ))}
              {category === 'temperature' &&
                ['c', 'f', 'k'].map(u => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {unitLabels[u]}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#6B7280]">Converted Value</label>
              <CopyButton text={result.toLocaleString(undefined, { maximumFractionDigits: 6 })} />
            </div>
            <div className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-sm font-extrabold text-[#6C63FF] mt-1 overflow-x-auto">
              {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B7280]">To Unit</label>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs font-bold text-[#3D4852] dark:text-white mt-1 bg-transparent cursor-pointer"
            >
              {category === 'length' &&
                Object.keys(lengthFactors).map(u => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {unitLabels[u]}
                  </option>
                ))}
              {category === 'weight' &&
                Object.keys(weightFactors).map(u => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {unitLabels[u]}
                  </option>
                ))}
              {category === 'temperature' &&
                ['c', 'f', 'k'].map(u => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {unitLabels[u]}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. Discount & Sales Tax Calculator
export function DiscountTaxCalculatorTool() {
  const [originalPrice, setOriginalPrice] = useState<number>(150);
  const [discountPct, setDiscountPct] = useState<number>(20);
  const [extraCouponPct, setExtraCouponPct] = useState<number>(10);
  const [taxPct, setTaxPct] = useState<number>(8.5);

  const priceAfterFirstDiscount = originalPrice * (1 - discountPct / 100);
  const priceAfterCoupon = priceAfterFirstDiscount * (1 - extraCouponPct / 100);
  const totalSavings = originalPrice - priceAfterCoupon;
  const taxAmount = priceAfterCoupon * (taxPct / 100);
  const finalPrice = priceAfterCoupon + taxAmount;
  const effectiveSavingsPct = originalPrice > 0 ? (totalSavings / originalPrice) * 100 : 0;

  const breakdownSummary = `Original Price: $${originalPrice.toFixed(2)}
Discount: ${discountPct}% + Extra ${extraCouponPct}% Coupon
Total Savings: $${totalSavings.toFixed(2)} (${effectiveSavingsPct.toFixed(1)}% off)
Sales Tax (${taxPct}%): $${taxAmount.toFixed(2)}
Final Total to Pay: $${finalPrice.toFixed(2)}`;

  return (
    <div id="discount-calculator-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Original Price ($)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={e => setOriginalPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-sm font-bold text-[#3D4852] dark:text-white mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#3D4852] dark:text-slate-200">Discount ({discountPct}%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discountPct}
                onChange={e => setDiscountPct(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-white mt-1"
              />
            </div>
            <div>
              <label className="text-[#3D4852] dark:text-slate-200">Coupon Code ({extraCouponPct}%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={extraCouponPct}
                onChange={e => setExtraCouponPct(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-white mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Regional Sales Tax ({taxPct}%)</label>
            <input
              type="number"
              min={0}
              max={50}
              step={0.1}
              value={taxPct}
              onChange={e => setTaxPct(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-white mt-1"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 rounded-3xl neu-pressed-deep space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#cbd5e1]/40 dark:border-slate-800">
              <span className="text-xs font-bold text-[#6B7280]">Total Discount Savings</span>
              <span className="text-base font-extrabold text-emerald-500 font-mono">
                -${totalSavings.toFixed(2)} ({effectiveSavingsPct.toFixed(1)}%)
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#cbd5e1]/40 dark:border-slate-800">
              <span className="text-xs font-bold text-[#6B7280]">Sales Tax ({taxPct}%)</span>
              <span className="text-xs font-bold font-mono text-[#3D4852] dark:text-white">+${taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Final Total to Pay</span>
                <div className="text-3xl font-extrabold font-mono text-[#6C63FF]">${finalPrice.toFixed(2)}</div>
              </div>
              <CopyButton text={breakdownSummary} label="Copy Receipt" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

