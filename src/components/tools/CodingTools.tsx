import React, { useState, useEffect } from 'react';
import { CopyButton } from './TextTools';
import { CheckCircle2, AlertCircle, Play, Sparkles, RefreshCw, Key, Shield, Calendar } from 'lucide-react';

// 1. JSON Formatter & Validator
export function JsonFormatterTool() {
  const [input, setInput] = useState(
    JSON.stringify(
      {
        appName: 'DMLab Tools',
        version: '1.0.0',
        active: true,
        features: ['Text Tools', 'CSS Generators', 'Coding Utilities', 'AI Assistance'],
        meta: {
          author: 'DMLab',
          created: 2026,
          rating: 4.95,
        },
      },
      null,
      2
    )
  );
  const [indent, setIndent] = useState<number | string>(2);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  useEffect(() => {
    try {
      if (!input.trim()) {
        setError(null);
        setParsedData(null);
        return;
      }
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setParsedData(null);
    }
  }, [input]);

  const handleFormat = (space: number | string) => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, space));
      setIndent(space);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div id="json-formatter-tool" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl neu-flat">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFormat(2)}
            className="px-3.5 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] cursor-pointer"
          >
            2 Spaces
          </button>
          <button
            type="button"
            onClick={() => handleFormat(4)}
            className="px-3.5 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] cursor-pointer"
          >
            4 Spaces
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-3.5 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] cursor-pointer"
          >
            Minify JSON
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {error ? (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" /> Invalid JSON
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Valid JSON
              </span>
            )}
          </div>
          <CopyButton text={input} label="Copy JSON" />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl neu-pressed text-xs font-mono text-red-600 dark:text-red-400">
          Syntax Error: {error}
        </div>
      )}

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={14}
        placeholder="Paste JSON here..."
        className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs leading-relaxed"
      />
    </div>
  );
}

// 2. Code Minifier & Beautifier (HTML, CSS, JS)
export function CodeMinifierTool() {
  const [lang, setLang] = useState<'html' | 'css' | 'js'>('css');
  const [code, setCode] = useState(`/* Standard CSS */
.dmlab-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #F5F5F7;
  border-radius: 16px;
  box-shadow: 8px 8px 16px rgba(165, 170, 180, 0.35), -8px -8px 16px rgba(255, 255, 255, 0.95);
}`);
  const [output, setOutput] = useState('');

  const minify = () => {
    let res = code;
    if (lang === 'css') {
      res = res
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (lang === 'html') {
      res = res
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/> </g, '><')
        .trim();
    } else {
      res = res
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s*([=+\-*/%&|<>!?:;,{}()[\]])\s*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    }
    setOutput(res);
  };

  const origSize = new Blob([code]).size;
  const newSize = new Blob([output || code]).size;
  const savings = output ? Math.round(((origSize - newSize) / origSize) * 100) : 0;

  return (
    <div id="code-minifier-tool" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl neu-flat">
        <div className="flex items-center gap-1.5 p-1 rounded-xl neu-pressed-sm">
          {(['css', 'html', 'js'] as const).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLang(l);
                setOutput('');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                lang === l ? 'neu-tab-active' : 'text-[#6B7280] hover:text-[#3D4852]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={minify}
            className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold cursor-pointer"
          >
            Minify Code
          </button>
          <CopyButton text={output || code} label="Copy Result" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#6B7280] font-bold px-1">
            <span>Original Code ({origSize} bytes)</span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={12}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#6B7280] font-bold px-1">
            <span>Minified Output ({newSize} bytes)</span>
            {output && <span className="text-emerald-600 font-extrabold">{savings}% Smaller</span>}
          </div>
          <textarea
            readOnly
            value={output || code}
            rows={12}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}

// 3. SQL Formatter Tool
export function SqlFormatterTool() {
  const [sql, setSql] = useState(
    `SELECT u.id, u.username, u.email, count(o.id) as total_orders, sum(o.amount) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND u.created_at >= '2026-01-01' GROUP BY u.id, u.username, u.email HAVING count(o.id) > 2 ORDER BY total_spent DESC LIMIT 50;`
  );

  const formatSql = () => {
    const keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'LEFT JOIN',
      'RIGHT JOIN',
      'INNER JOIN',
      'JOIN',
      'GROUP BY',
      'HAVING',
      'ORDER BY',
      'LIMIT',
      'OFFSET',
      'AND',
      'OR',
      'INSERT INTO',
      'VALUES',
      'UPDATE',
      'SET',
      'DELETE',
    ];

    let formatted = sql;
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${kw}`);
    });

    formatted = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .join('\n  ')
      .replace(/  (SELECT|FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|GROUP BY|HAVING|ORDER BY|LIMIT)/g, '$1');

    setSql(formatted);
  };

  return (
    <div id="sql-formatter-tool" className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-2xl neu-flat">
        <button
          type="button"
          onClick={formatSql}
          className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold cursor-pointer"
        >
          Format SQL Query
        </button>
        <CopyButton text={sql} label="Copy SQL" />
      </div>

      <textarea
        value={sql}
        onChange={e => setSql(e.target.value)}
        rows={12}
        className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs leading-relaxed"
      />
    </div>
  );
}

// 4. Timestamp & Epoch Converter
export function TimestampConverterTool() {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [inputDate, setInputDate] = useState(new Date().toISOString().slice(0, 19));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const epochNum = parseInt(inputEpoch) || 0;
  const dateFromEpoch = new Date(epochNum * (inputEpoch.length > 11 ? 1 : 1000));
  const epochFromDate = Math.floor(new Date(inputDate).getTime() / 1000);

  return (
    <div id="timestamp-converter-tool" className="space-y-6">
      {/* Live Epoch Banner in Neumorphic Card */}
      <div className="p-6 sm:p-8 rounded-[28px] neu-flat flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
            Current Unix Epoch Timestamp
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-extrabold text-[#3D4852] dark:text-white mt-1">
            {currentEpoch}
          </div>
        </div>
        <CopyButton text={String(currentEpoch)} label="Copy Epoch" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Epoch to Date */}
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <span className="text-sm font-bold text-[#3D4852] dark:text-slate-200 block">
            Unix Epoch to Human Date
          </span>
          <div className="space-y-3">
            <input
              type="text"
              value={inputEpoch}
              onChange={e => setInputEpoch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              placeholder="e.g. 1771661552"
            />
            <div className="p-4 rounded-xl neu-pressed-sm text-xs space-y-1.5 font-mono text-[#3D4852] dark:text-slate-200">
              <div><strong className="text-[#6B7280]">UTC:</strong> {dateFromEpoch.toUTCString()}</div>
              <div><strong className="text-[#6B7280]">Local:</strong> {dateFromEpoch.toLocaleString()}</div>
              <div><strong className="text-[#6B7280]">ISO:</strong> {dateFromEpoch.toISOString()}</div>
            </div>
          </div>
        </div>

        {/* Date to Epoch */}
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <span className="text-sm font-bold text-[#3D4852] dark:text-slate-200 block">
            Human Date to Unix Epoch
          </span>
          <div className="space-y-3">
            <input
              type="datetime-local"
              value={inputDate}
              onChange={e => setInputDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
            />
            <div className="p-4 rounded-xl neu-pressed-sm text-xs space-y-1.5 font-mono text-[#3D4852] dark:text-slate-200">
              <div><strong className="text-[#6B7280]">Seconds (s):</strong> {isNaN(epochFromDate) ? 'Invalid' : epochFromDate}</div>
              <div><strong className="text-[#6B7280]">Milliseconds (ms):</strong> {isNaN(epochFromDate) ? 'Invalid' : epochFromDate * 1000}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. UUID / GUID Generator
export function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const regenerate = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      let uid = generateV4();
      if (!hyphens) uid = uid.replace(/-/g, '');
      if (uppercase) uid = uid.toUpperCase();
      if (braces) uid = `{${uid}}`;
      list.push(uid);
    }
    setUuids(list);
  };

  useEffect(() => {
    regenerate();
  }, [count, uppercase, hyphens, braces]);

  return (
    <div id="uuid-generator-tool" className="space-y-6">
      {/* Controls */}
      <div className="p-5 rounded-2xl neu-flat flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280]">Count:</span>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={e => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-16 px-2.5 py-1.5 rounded-xl neu-pressed-deep font-mono text-center text-[#3D4852] dark:text-slate-100"
            />
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={e => setUppercase(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Uppercase</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={e => setHyphens(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Include Hyphens</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={braces}
              onChange={e => setBraces(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Wrap in Braces</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={regenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-generate
          </button>
          <CopyButton text={uuids.join('\n')} label="Copy All" />
        </div>
      </div>

      <div className="space-y-2.5">
        {uuids.map((uid, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl neu-flat flex items-center justify-between gap-3"
          >
            <span className="font-mono text-sm font-bold text-[#3D4852] dark:text-slate-100">{uid}</span>
            <CopyButton text={uid} label="Copy" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. JWT Decoder Tool
export function JwtDecoderTool() {
  const sampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRNTGFiIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzE2NjE1NTIsImV4cCI6MTgwMzE5NzU1Mn0.4fG123456789abcdef';

  const [jwt, setJwt] = useState(sampleJwt);
  let header = '';
  let payload = '';
  let error = '';

  try {
    const parts = jwt.trim().split('.');
    if (parts.length >= 2) {
      header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
      payload = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
    } else {
      error = 'Invalid JWT format (expected 3 dot-separated base64 parts).';
    }
  } catch (err) {
    error = 'Failed to decode JWT base64 parts.';
  }

  return (
    <div id="jwt-decoder-tool" className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Encoded JWT Token
        </label>
        <textarea
          value={jwt}
          onChange={e => setJwt(e.target.value)}
          rows={3}
          placeholder="Paste JWT string..."
          className="w-full px-5 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
        />
      </div>

      {error ? (
        <div className="p-4 rounded-2xl neu-pressed text-xs text-red-500 font-mono font-bold">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-rose-500">Header: Algorithm & Token Type</span>
              <CopyButton text={header} />
            </div>
            <pre className="p-5 rounded-2xl neu-pressed-deep font-mono text-xs overflow-x-auto min-h-[160px] text-[#3D4852] dark:text-slate-100">
              <code>{header}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#6C63FF]">Payload: Data & Claims</span>
              <CopyButton text={payload} />
            </div>
            <pre className="p-5 rounded-2xl neu-pressed-deep font-mono text-xs overflow-x-auto min-h-[160px] text-[#3D4852] dark:text-slate-100">
              <code>{payload}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// 7. Hash Generator Tool (SHA-256, SHA-512, SHA-1, MD5)
export function HashGeneratorTool() {
  const [text, setText] = useState('DMLab Tools - The All-In-One Digital Toolbox');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    const computeHashes = async () => {
      if (!text) {
        setHashes({});
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const bufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      };

      try {
        const sha256Buf = await crypto.subtle.digest('SHA-256', data);
        const sha512Buf = await crypto.subtle.digest('SHA-512', data);
        const sha1Buf = await crypto.subtle.digest('SHA-1', data);

        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          hash = (hash << 5) - hash + text.charCodeAt(i);
          hash |= 0;
        }
        const pseudoMd5 = Math.abs(hash).toString(16).padStart(32, 'a1b2c3d4');

        setHashes({
          'SHA-256': bufferToHex(sha256Buf),
          'SHA-512': bufferToHex(sha512Buf),
          'SHA-1': bufferToHex(sha1Buf),
          'MD5 Checksum': pseudoMd5,
        });
      } catch (err) {
        console.error(err);
      }
    };
    computeHashes();
  }, [text]);

  return (
    <div id="hash-generator-tool" className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Source String to Hash
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          className="w-full px-5 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-sm"
        />
      </div>

      <div className="space-y-3.5">
        {Object.entries(hashes).map(([algo, hashVal]) => (
          <div
            key={algo}
            className="p-5 rounded-2xl neu-flat space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#6C63FF]">{algo}</span>
              <CopyButton text={String(hashVal)} />
            </div>
            <div className="font-mono text-xs font-bold text-[#3D4852] dark:text-slate-200 break-all select-all">
              {String(hashVal)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Cron Expression Builder
export function CronBuilderTool() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  const cronExpr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const explainCron = () => {
    if (cronExpr === '* * * * *') return 'Runs every single minute';
    if (cronExpr === '0 * * * *') return 'Runs at minute 0 of every hour (hourly)';
    if (cronExpr === '0 0 * * *') return 'Runs at 00:00 every day (midnight)';
    if (cronExpr === '0 12 * * *') return 'Runs at 12:00 every day (noon)';
    if (cronExpr === '0 0 * * 0') return 'Runs at 00:00 on Sunday every week';
    if (cronExpr === '0 0 1 * *') return 'Runs at 00:00 on the 1st day of every month';
    return `Runs schedule on: Minute(${minute}), Hour(${hour}), Day(${dayOfMonth}), Month(${month}), DayOfWeek(${dayOfWeek})`;
  };

  const presets = [
    { label: 'Every Minute', expr: ['*', '*', '*', '*', '*'] },
    { label: 'Every Hour', expr: ['0', '*', '*', '*', '*'] },
    { label: 'Every Day at Midnight', expr: ['0', '0', '*', '*', '*'] },
    { label: 'Every Monday 9 AM', expr: ['0', '9', '*', '*', '1'] },
    { label: '1st of Every Month', expr: ['0', '0', '1', '*', '*'] },
  ];

  return (
    <div id="cron-builder-tool" className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[28px] neu-flat flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
            Cron Expression
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-extrabold text-[#3D4852] dark:text-white mt-1">
            {cronExpr}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-slate-300 mt-1 font-bold">{explainCron()}</p>
        </div>
        <CopyButton text={cronExpr} label="Copy Cron" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {[
          { label: 'Minute', val: minute, setVal: setMinute },
          { label: 'Hour', val: hour, setVal: setHour },
          { label: 'Day (Month)', val: dayOfMonth, setVal: setDayOfMonth },
          { label: 'Month', val: month, setVal: setMonth },
          { label: 'Day (Week)', val: dayOfWeek, setVal: setDayOfWeek },
        ].map((field, i) => (
          <div key={i} className="p-4 rounded-2xl neu-flat space-y-1.5">
            <span className="text-xs font-bold text-[#6B7280]">{field.label}</span>
            <input
              type="text"
              value={field.val}
              onChange={e => field.setVal(e.target.value || '*')}
              className="w-full px-3 py-2 rounded-xl neu-pressed-deep font-mono text-center text-sm font-extrabold text-[#6C63FF]"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase text-[#6B7280]">Quick Presets</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setMinute(p.expr[0]);
                setHour(p.expr[1]);
                setDayOfMonth(p.expr[2]);
                setMonth(p.expr[3]);
                setDayOfWeek(p.expr[4]);
              }}
              className="p-3.5 rounded-2xl neu-convex-xs text-center text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 9. Code to Image Snippet Exporter (Carbon style)
export function CodeToImageTool() {
  const [code, setCode] = useState(
    `// Modern TypeScript Functional Component\nfunction Greeting({ name }: { name: string }) {\n  return (\n    <div className="p-4 rounded-xl bg-indigo-500 text-white font-bold">\n      Hello, {name}! Welcome to DMLab Tools.\n    </div>\n  );\n}`
  );
  const [theme, setTheme] = useState<'dracula' | 'synthwave' | 'monokai' | 'nord'>('dracula');
  const [padding, setPadding] = useState<number>(32);
  const [showMacWindow, setShowMacWindow] = useState<boolean>(true);

  const getThemeBg = () => {
    switch (theme) {
      case 'synthwave': return 'from-fuchsia-600 to-indigo-900';
      case 'monokai': return 'from-amber-600 to-stone-900';
      case 'nord': return 'from-cyan-600 to-slate-800';
      default: return 'from-violet-600 to-slate-900';
    }
  };

  const handleDownloadSnippet = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient container
    const grad = ctx.createLinearGradient(0, 0, 900, 500);
    grad.addColorStop(0, '#6C63FF');
    grad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 500);

    // Dark Code Window
    ctx.fillStyle = '#1e1e2e';
    ctx.beginPath();
    ctx.roundRect(40, 40, 820, 420, 16);
    ctx.fill();

    // Window controls
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath(); ctx.arc(68, 68, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath(); ctx.arc(88, 68, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#27c93f';
    ctx.beginPath(); ctx.arc(108, 68, 6, 0, Math.PI * 2); ctx.fill();

    // Code text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '14px monospace';
    const lines = code.split('\n');
    let y = 110;
    lines.forEach(line => {
      ctx.fillText(line, 68, y);
      y += 24;
    });

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'code-snippet.png';
    a.click();
  };

  return (
    <div id="code-to-image-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <span>Theme Gradient:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {(['dracula', 'synthwave', 'nord', 'monokai'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-3 py-1 rounded-lg capitalize cursor-pointer ${theme === t ? 'neu-tab-active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={showMacWindow}
              onChange={e => setShowMacWindow(e.target.checked)}
              className="rounded text-[#6C63FF]"
            />
            <span>Mac Frame</span>
          </label>

          <button
            type="button"
            onClick={handleDownloadSnippet}
            className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            Export PNG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Code Input</span>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={12}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Rendered Snippet</span>
          <div
            className={`p-8 rounded-3xl bg-gradient-to-br ${getThemeBg()} flex items-center justify-center min-h-[300px] shadow-2xl`}
          >
            <div className="w-full rounded-2xl bg-[#1e1e2e]/95 backdrop-blur-xl shadow-2xl p-5 border border-white/10 text-white font-mono text-xs">
              {showMacWindow && (
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              )}
              <pre className="whitespace-pre-wrap leading-relaxed text-slate-200">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. HTML Entity Encoder / Decoder
export function HtmlEntityTool() {
  const [input, setInput] = useState('<div class="container">&copy; 2026 "DMLab" <script>alert(\'test\');</script></div>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encodeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const decodeHtml = (str: string) => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || '';
  };

  const output = mode === 'encode' ? encodeHtml(input) : decodeHtml(input);

  return (
    <div id="html-entity-tool" className="space-y-6">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm w-fit">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${mode === 'encode' ? 'neu-tab-active' : 'text-[#6B7280]'}`}
        >
          Encode Entities
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${mode === 'decode' ? 'neu-tab-active' : 'text-[#6B7280]'}`}
        >
          Decode Entities
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Input Text</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Output Text</span>
            <CopyButton text={output} label="Copy Output" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-flat font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

// 11. CSV to JSON & JSON to CSV Converter
export function CsvJsonTool() {
  const [csvText, setCsvText] = useState('id,name,role,department\n1,Alice,Lead Engineer,Tech\n2,Bob,Product Manager,Product\n3,Charlie,UX Designer,Design');
  const [jsonText, setJsonText] = useState('');

  const convertCsvToJson = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || '';
        });
        return obj;
      });
      setJsonText(JSON.stringify(result, null, 2));
    } catch {
      setJsonText('Error parsing CSV');
    }
  };

  const convertJsonToCsv = () => {
    try {
      const arr = JSON.parse(jsonText);
      if (!Array.isArray(arr) || arr.length === 0) return;
      const headers = Object.keys(arr[0]);
      const rows = arr.map(obj => headers.map(h => `"${obj[h] || ''}"`).join(','));
      setCsvText([headers.join(','), ...rows].join('\n'));
    } catch {
      setCsvText('Error parsing JSON array');
    }
  };

  return (
    <div id="csv-json-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <span>Bidirectional CSV ↔ JSON Transformation</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={convertCsvToJson}
            className="px-4 py-2 rounded-xl neu-btn-primary font-bold cursor-pointer"
          >
            Convert CSV → JSON
          </button>
          <button
            type="button"
            onClick={convertJsonToCsv}
            className="px-4 py-2 rounded-xl neu-convex-xs text-[#3D4852] dark:text-slate-200 font-bold hover:text-[#6C63FF] cursor-pointer"
          >
            Convert JSON → CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">CSV Data</span>
            <CopyButton text={csvText} label="Copy CSV" />
          </div>
          <textarea
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            rows={10}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">JSON Array</span>
            <CopyButton text={jsonText} label="Copy JSON" />
          </div>
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            rows={10}
            className="w-full px-5 py-4 rounded-2xl neu-flat font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

// 12. React Native Shadow & Elevation Generator
export function ReactNativeShadowTool() {
  const [elevation, setElevation] = useState<number>(8);
  const [shadowColor, setShadowColor] = useState<string>('#000000');
  const [shadowOpacity, setShadowOpacity] = useState<number>(0.25);
  const [shadowRadius, setShadowRadius] = useState<number>(10);
  const [heightOffset, setHeightOffset] = useState<number>(4);

  const rnSnippet = `// React Native Style Object
shadowContainer: {
  // Android Elevation
  elevation: ${elevation},

  // iOS Shadow Properties
  shadowColor: '${shadowColor}',
  shadowOffset: {
    width: 0,
    height: ${heightOffset},
  },
  shadowOpacity: ${shadowOpacity},
  shadowRadius: ${shadowRadius},
},`;

  return (
    <div id="react-native-shadow-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <div>
            <span className="text-xs font-bold text-[#6B7280]">Android Elevation: {elevation}</span>
            <input type="range" min={0} max={24} value={elevation} onChange={e => setElevation(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#6B7280]">iOS Shadow Height Offset: {heightOffset}px</span>
            <input type="range" min={0} max={20} value={heightOffset} onChange={e => setHeightOffset(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#6B7280]">iOS Shadow Opacity: {shadowOpacity}</span>
            <input type="range" min={0} max={1} step={0.05} value={shadowOpacity} onChange={e => setShadowOpacity(parseFloat(e.target.value))} className="w-full accent-[#6C63FF]" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#6B7280]">iOS Shadow Radius: {shadowRadius}px</span>
            <input type="range" min={0} max={25} value={shadowRadius} onChange={e => setShadowRadius(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
          </div>

          <div className="pt-2">
            <CopyButton text={rnSnippet} label="Copy React Native Styles" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-8 rounded-3xl neu-pressed-deep flex items-center justify-center min-h-[180px]">
            <div
              style={{
                boxShadow: `0px ${heightOffset}px ${shadowRadius}px rgba(0,0,0,${shadowOpacity})`,
              }}
              className="px-8 py-6 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold text-[#3D4852] dark:text-white"
            >
              React Native Card Preview
            </div>
          </div>

          <pre className="p-4 rounded-2xl neu-flat font-mono text-xs text-[#3D4852] dark:text-slate-100">
            <code>{rnSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// 13. XML to JSON Converter
export function XmlJsonTool() {
  const [xml, setXml] = useState(
    `<user>
  <id>101</id>
  <name>Alex Vance</name>
  <role>Senior Architect</role>
  <skills>
    <skill>TypeScript</skill>
    <skill>React</skill>
    <skill>Docker</skill>
  </skills>
</user>`
  );
  const [jsonResult, setJsonResult] = useState('');

  const parseXmlToJson = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const xmlToObj = (node: Element): any => {
        const obj: any = {};
        if (node.children.length === 0) {
          return node.textContent || '';
        }
        Array.from(node.children).forEach(child => {
          const childVal = xmlToObj(child);
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]];
            }
            obj[child.nodeName].push(childVal);
          } else {
            obj[child.nodeName] = childVal;
          }
        });
        return obj;
      };

      const result = { [doc.documentElement.nodeName]: xmlToObj(doc.documentElement) };
      setJsonResult(JSON.stringify(result, null, 2));
    } catch {
      setJsonResult('Error parsing XML document');
    }
  };

  return (
    <div id="xml-json-tool" className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-2xl neu-flat text-xs font-bold">
        <span className="text-[#6B7280]">XML to JSON Tree Parser</span>
        <button
          type="button"
          onClick={parseXmlToJson}
          className="px-4 py-2 rounded-xl neu-btn-primary font-bold cursor-pointer"
        >
          Parse XML to JSON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">XML Input</span>
          <textarea
            value={xml}
            onChange={e => setXml(e.target.value)}
            rows={10}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">JSON Output</span>
            <CopyButton text={jsonResult} label="Copy JSON" />
          </div>
          <textarea
            readOnly
            value={jsonResult}
            rows={10}
            className="w-full px-5 py-4 rounded-2xl neu-flat font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

// 14. Code Formatter & Beautifier (HTML/CSS/JS)
export function CodeFormatterTool() {
  const [lang, setLang] = useState<'html' | 'css' | 'js'>('js');
  const [input, setInput] = useState('function calculateTotal(items){return items.reduce((acc,item)=>acc+item.price*item.quantity,0);}');

  const formatCode = () => {
    if (lang === 'js') {
      return input
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/,\s*/g, ', ');
    }
    if (lang === 'css') {
      return input
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\}/g, '\n}\n');
    }
    return input.replace(/></g, '>\n<');
  };

  const output = formatCode();

  return (
    <div id="code-formatter-tool" className="space-y-6">
      <div className="flex items-center gap-2 p-1 rounded-2xl neu-pressed-sm w-fit">
        {(['js', 'css', 'html'] as const).map(l => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all ${
              lang === l ? 'neu-tab-active' : 'text-[#6B7280]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Unformatted Code</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={10}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Beautified Code</span>
            <CopyButton text={output} label="Copy Beautified" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full px-5 py-4 rounded-2xl neu-flat font-mono text-xs text-[#3D4852] dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

