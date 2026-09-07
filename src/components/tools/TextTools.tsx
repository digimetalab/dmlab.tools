import React, { useState, useId } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  FileDown,
  Trash2,
  ListOrdered,
  Layers,
  FileCode,
  FileCheck,
} from 'lucide-react';

interface ToolCommonProps {
  onCopySuccess?: (text: string) => void;
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const btnId = useId();

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      id={`btn-copy-${btnId}`}
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
        copied
          ? 'neu-pressed text-emerald-600 dark:text-emerald-400'
          : 'neu-convex-xs text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] disabled:opacity-40 disabled:cursor-not-allowed'
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
}

// 1. Case Converter Tool
export function CaseConverterTool() {
  const [input, setInput] = useState(
    'The quick brown Fox jumps over the lazy Dog! DMLab Tools is an all-in-one digital toolbox for modern creators.'
  );

  const conversions = [
    { name: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { name: 'lowercase', fn: (s: string) => s.toLowerCase() },
    {
      name: 'Title Case',
      fn: (s: string) =>
        s
          .toLowerCase()
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
    },
    {
      name: 'Sentence case',
      fn: (s: string) =>
        s
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
    },
    {
      name: 'camelCase',
      fn: (s: string) =>
        s
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[A-Z]/, c => c.toLowerCase()),
    },
    {
      name: 'PascalCase',
      fn: (s: string) =>
        s
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[a-z]/, c => c.toUpperCase()),
    },
    {
      name: 'snake_case',
      fn: (s: string) =>
        s
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, ''),
    },
    {
      name: 'CONSTANT_CASE',
      fn: (s: string) =>
        s
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, ''),
    },
    {
      name: 'kebab-case',
      fn: (s: string) =>
        s
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
    },
    {
      name: 'dot.case',
      fn: (s: string) =>
        s
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '.')
          .replace(/^\.+|\.+$/g, ''),
    },
    {
      name: 'Alternating cAsE',
      fn: (s: string) =>
        s
          .split('')
          .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
          .join(''),
    },
  ];

  return (
    <div id="case-converter-tool" className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="case-input" className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Source Text
          </label>
          <div className="flex items-center gap-2">
            <button
              id="btn-case-sample"
              type="button"
              onClick={() =>
                setInput('Transform your words into clean, standard naming conventions with DMLab Tools.')
              }
              className="text-xs font-bold text-[#6C63FF] hover:underline cursor-pointer"
            >
              Load Sample
            </button>
            <button
              id="btn-case-clear"
              type="button"
              onClick={() => setInput('')}
              className="text-xs font-bold text-[#6B7280] hover:text-red-500 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          id="case-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          placeholder="Type or paste your text here..."
          className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm font-sans leading-relaxed text-[#3D4852] dark:text-slate-100 placeholder:text-[#6B7280]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conversions.map((conv, idx) => {
          const result = conv.fn(input || '');
          return (
            <div
              key={idx}
              id={`case-card-${idx}`}
              className="p-5 rounded-2xl neu-flat flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
                  {conv.name}
                </span>
                <CopyButton text={result} />
              </div>
              <div className="text-sm font-mono text-[#3D4852] dark:text-slate-200 break-all select-all min-h-[1.5rem]">
                {result || <span className="text-[#6B7280] text-xs italic">Waiting for text...</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. Word & Character Counter Tool
export function WordCounterTool() {
  const [text, setText] = useState(
    'DMLab Tools provides a comprehensive digital workspace with dozens of online utilities. It is designed for developers, designers, writers, and marketers who value speed, precision, and privacy.'
  );

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = cleanText ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = cleanText ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeSec = Math.ceil((words / 200) * 60);
  const speakingTimeSec = Math.ceil((words / 130) * 60);

  // Word density analysis
  const wordFrequency: Record<string, number> = {};
  if (cleanText) {
    const rawWords = cleanText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    rawWords.forEach(w => {
      if (w.length > 2) {
        wordFrequency[w] = (wordFrequency[w] || 0) + 1;
      }
    });
  }
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div id="word-counter-tool" className="space-y-6">
      {/* Key Metric Tiles in Tactile Soft UI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: 'Words', val: words, color: 'text-[#6C63FF]' },
          { label: 'Characters', val: characters, color: 'text-[#38B2AC]' },
          { label: 'Without Spaces', val: charactersNoSpaces, color: 'text-[#8B84FF]' },
          { label: 'Sentences', val: sentences, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Paragraphs', val: paragraphs, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Reading Time', val: `${readingTimeSec}s`, color: 'text-rose-500' },
        ].map((stat, i) => (
          <div
            key={i}
            id={`stat-tile-${i}`}
            className="p-4 rounded-2xl neu-flat flex flex-col items-center justify-center text-center"
          >
            <span className={`text-2xl font-extrabold font-mono ${stat.color}`}>{stat.val}</span>
            <span className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 font-bold">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="word-counter-input" className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Live Text Editor
          </label>
          <div className="flex items-center gap-2">
            <CopyButton text={text} label="Copy Text" />
            <button
              id="btn-word-counter-clear"
              type="button"
              onClick={() => setText('')}
              className="text-xs text-[#6B7280] hover:text-red-500 font-bold px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          id="word-counter-input"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          placeholder="Paste or type text to inspect real-time statistics..."
          className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm leading-relaxed text-[#3D4852] dark:text-slate-100 placeholder:text-[#6B7280]"
        />
      </div>

      {sortedWords.length > 0 && (
        <div id="word-density-panel" className="p-5 rounded-2xl neu-flat space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
            Top Keyword Density
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sortedWords.map(([w, count], i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl neu-convex-xs text-xs"
              >
                <span className="font-mono text-[#3D4852] dark:text-slate-200 font-bold">{w}</span>
                <span className="text-[#6B7280] font-bold">{count}x ({((count / words) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Slug Generator Tool
export function SlugGeneratorTool() {
  const [input, setInput] = useState('Build Faster Web Applications with DMLab Tools in 2026!');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeNumbers, setRemoveNumbers] = useState(false);

  let slug = input.trim();
  if (lowercase) slug = slug.toLowerCase();
  if (removeNumbers) slug = slug.replace(/[0-9]/g, '');
  slug = slug
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, separator)
    .replace(new RegExp(`\\${separator}+`, 'g'), separator)
    .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');

  return (
    <div id="slug-generator-tool" className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="slug-input" className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Input Title or Headline
        </label>
        <input
          id="slug-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. 10 Best Tools for Web Developers"
          className="w-full px-5 py-3.5 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100 placeholder:text-[#6B7280]"
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-6 p-5 rounded-2xl neu-flat text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#6B7280]">Separator:</span>
          {['-', '_', '.'].map(sep => (
            <button
              key={sep}
              id={`btn-sep-${sep}`}
              type="button"
              onClick={() => setSeparator(sep)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                separator === sep
                  ? 'neu-pressed text-[#6C63FF]'
                  : 'neu-convex-xs text-[#3D4852] dark:text-slate-200'
              }`}
            >
              {sep === '-' ? 'Hyphen (-)' : sep === '_' ? 'Underscore (_)' : 'Dot (.)'}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#3D4852] dark:text-slate-200">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={e => setLowercase(e.target.checked)}
            className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
          />
          <span>Lowercase</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#3D4852] dark:text-slate-200">
          <input
            type="checkbox"
            checked={removeNumbers}
            onChange={e => setRemoveNumbers(e.target.checked)}
            className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
          />
          <span>Strip Numbers</span>
        </label>
      </div>

      {/* Result Output */}
      <div className="p-6 rounded-2xl neu-flat flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
            Generated SEO Slug
          </span>
          <div className="text-base font-mono font-bold text-[#3D4852] dark:text-white break-all">
            {slug || <span className="text-[#6B7280] font-normal">slug-will-appear-here</span>}
          </div>
        </div>
        <CopyButton text={slug} label="Copy Slug" />
      </div>
    </div>
  );
}

// 4. Lorem Ipsum Generator Tool
export function LoremGeneratorTool() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words' | 'list'>('paragraphs');
  const [asHtml, setAsHtml] = useState(false);

  const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut',
    'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris',
    'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor',
    'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat',
    'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt',
    'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateSentence = () => {
    const len = 8 + Math.floor(Math.random() * 8);
    const wordsArr = [];
    for (let i = 0; i < len; i++) {
      wordsArr.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const sent = wordsArr.join(' ');
    return sent.charAt(0).toUpperCase() + sent.slice(1) + '.';
  };

  const generateParagraph = () => {
    const sentencesCount = 4 + Math.floor(Math.random() * 3);
    const p = [];
    for (let i = 0; i < sentencesCount; i++) {
      p.push(generateSentence());
    }
    return p.join(' ');
  };

  let output = '';
  if (type === 'paragraphs') {
    const arr = Array.from({ length: count }, () => generateParagraph());
    output = asHtml ? arr.map(p => `<p>${p}</p>`).join('\n\n') : arr.join('\n\n');
  } else if (type === 'sentences') {
    const arr = Array.from({ length: count }, () => generateSentence());
    output = asHtml ? arr.map(s => `<span>${s}</span>`).join(' ') : arr.join(' ');
  } else if (type === 'words') {
    const arr = Array.from({ length: count }, (_, i) => LOREM_WORDS[i % LOREM_WORDS.length]);
    output = arr.join(' ');
  } else if (type === 'list') {
    const items = Array.from({ length: count }, () => generateSentence().replace('.', ''));
    output = asHtml
      ? `<ul>\n${items.map(it => `  <li>${it}</li>`).join('\n')}\n</ul>`
      : items.map((it, idx) => `${idx + 1}. ${it}`).join('\n');
  }

  return (
    <div id="lorem-generator-tool" className="space-y-6">
      {/* Controls */}
      <div className="p-5 rounded-2xl neu-flat flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="lorem-count" className="text-xs font-bold uppercase text-[#6B7280]">
              Count:
            </label>
            <input
              id="lorem-count"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-3 py-1.5 rounded-xl neu-pressed-deep text-sm text-center font-mono font-bold text-[#3D4852] dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl neu-pressed-sm">
            {(['paragraphs', 'sentences', 'words', 'list'] as const).map(t => (
              <button
                key={t}
                id={`btn-lorem-${t}`}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  type === t
                    ? 'neu-tab-active'
                    : 'text-[#6B7280] hover:text-[#3D4852]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#3D4852] dark:text-slate-200 ml-2">
            <input
              type="checkbox"
              checked={asHtml}
              onChange={e => setAsHtml(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Wrap in HTML tags</span>
          </label>
        </div>

        <CopyButton text={output} label="Copy Output" />
      </div>

      <div className="relative">
        <textarea
          id="lorem-output"
          readOnly
          value={output}
          rows={10}
          className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-serif leading-relaxed text-sm"
        />
      </div>
    </div>
  );
}

// 5. Text Diff Checker Tool
export function TextDiffTool() {
  const [original, setOriginal] = useState(
    `const app = "DMLab Tools";\nconst version = "1.0.0";\nconsole.log("Ready to build!");\nconst isPremium = false;`
  );
  const [modified, setModified] = useState(
    `const app = "DMLab Tools";\nconst version = "2.0.0";\nconsole.log("Ready to build modern apps!");\nconst isPremium = true;\nconst activeUsers = 5000;`
  );

  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const maxLines = Math.max(origLines.length, modLines.length);

  return (
    <div id="text-diff-tool" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Original Text (Before)
          </label>
          <textarea
            value={original}
            onChange={e => setOriginal(e.target.value)}
            rows={7}
            className="w-full px-4 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Modified Text (After)
          </label>
          <textarea
            value={modified}
            onChange={e => setModified(e.target.value)}
            rows={7}
            className="w-full px-4 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>
      </div>

      {/* Side-by-side Visual Diff Viewer */}
      <div className="rounded-2xl neu-flat overflow-hidden">
        <div className="px-5 py-3 border-b border-[#cbd5e1]/40 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#6B7280]">
          <span>Side-by-Side Comparison</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Removed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Added</span>
          </div>
        </div>
        <div className="divide-y divide-[#cbd5e1]/20 dark:divide-slate-800 text-xs font-mono">
          {Array.from({ length: maxLines }).map((_, idx) => {
            const left = origLines[idx] ?? '';
            const right = modLines[idx] ?? '';
            const isDiff = left !== right;

            return (
              <div key={idx} className="grid grid-cols-2 divide-x divide-[#cbd5e1]/30 dark:divide-slate-800">
                <div
                  className={`p-2.5 flex items-start gap-2 ${
                    isDiff && left ? 'bg-red-500/10 text-red-700 dark:text-red-300' : 'text-[#3D4852] dark:text-slate-200'
                  }`}
                >
                  <span className="text-[#6B7280] select-none w-6 text-right shrink-0">{idx + 1}</span>
                  <span className="break-all">{left || <span className="text-[#6B7280] select-none">-</span>}</span>
                </div>
                <div
                  className={`p-2.5 flex items-start gap-2 ${
                    isDiff && right ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-[#3D4852] dark:text-slate-200'
                  }`}
                >
                  <span className="text-[#6B7280] select-none w-6 text-right shrink-0">{idx + 1}</span>
                  <span className="break-all">{right || <span className="text-[#6B7280] select-none">-</span>}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 6. Duplicate Lines Remover Tool
export function DuplicateRemoverTool() {
  const [text, setText] = useState(
    `apple\norange\nbanana\napple\ngrapes\norange\nwatermelon\nbanana\npineapple`
  );
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [sortLines, setSortLines] = useState(false);

  const rawLines = text.split('\n');
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  rawLines.forEach(line => {
    let processed = trimLines ? line.trim() : line;
    let compareKey = caseSensitive ? processed : processed.toLowerCase();
    if (!seen.has(compareKey)) {
      seen.add(compareKey);
      uniqueLines.push(processed);
    }
  });

  if (sortLines) {
    uniqueLines.sort((a, b) => a.localeCompare(b));
  }

  const resultText = uniqueLines.join('\n');
  const duplicatesRemoved = rawLines.length - uniqueLines.length;

  return (
    <div id="duplicate-remover-tool" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Input List ({rawLines.length} lines)
            </label>
            <button
              type="button"
              onClick={() => setText('')}
              className="text-xs text-[#6B7280] hover:text-red-500 font-bold cursor-pointer"
            >
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={10}
            placeholder="Paste lines with duplicates here..."
            className="w-full px-4 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Unique Output ({uniqueLines.length} lines)
            </label>
            <CopyButton text={resultText} label="Copy Unique" />
          </div>
          <textarea
            readOnly
            value={resultText}
            rows={10}
            className="w-full px-4 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl neu-flat flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 cursor-pointer text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={e => setCaseSensitive(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={e => setTrimLines(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Trim Whitespace</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={sortLines}
              onChange={e => setSortLines(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Alphabetical Sort</span>
          </label>
        </div>

        <div className="px-3.5 py-1.5 rounded-full neu-convex-xs text-[#6C63FF]">
          {duplicatesRemoved} duplicate line{duplicatesRemoved !== 1 ? 's' : ''} removed
        </div>
      </div>
    </div>
  );
}

// 7. Base64 Text Encoder/Decoder Tool
export function Base64TextTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Hello from DMLab Tools! 🚀');
  const [urlSafe, setUrlSafe] = useState(false);

  let output = '';
  let error = '';

  try {
    if (mode === 'encode') {
      const utf8Bytes = new TextEncoder().encode(input);
      let binary = '';
      utf8Bytes.forEach(b => (binary += String.fromCharCode(b)));
      let b64 = btoa(binary);
      if (urlSafe) {
        b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      output = b64;
    } else {
      let b64 = input.trim();
      if (urlSafe) {
        b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
      }
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      output = new TextDecoder().decode(bytes);
    }
  } catch (err: any) {
    error = 'Invalid Base64 input string for decoding.';
  }

  return (
    <div id="base64-text-tool" className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'encode'
                ? 'neu-tab-active'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            Encode Plain Text
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'decode'
                ? 'neu-tab-active'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            Decode Base64
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-[#6B7280] cursor-pointer">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={e => setUrlSafe(e.target.checked)}
            className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
          />
          <span>URL Safe Base64 (- and _)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            {mode === 'encode' ? 'Plain Text Source' : 'Base64 Input'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 string to decode...'}
            className="w-full px-4 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              {mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Plain Text'}
            </label>
            <CopyButton text={output} label="Copy Output" />
          </div>
          <textarea
            readOnly
            value={error || output}
            rows={8}
            className={`w-full px-4 py-3 rounded-2xl neu-pressed-deep font-mono text-xs ${
              error ? 'text-red-500 font-bold' : 'text-[#3D4852] dark:text-slate-100'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// 8. URL Encoder / Decoder Tool
export function UrlEncoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('https://dmlab.tools/search?q=developer tools&category=css & design');
  const [componentMode, setComponentMode] = useState(false);

  let output = '';
  let error = '';

  try {
    if (mode === 'encode') {
      output = componentMode ? encodeURIComponent(input) : encodeURI(input);
    } else {
      output = componentMode ? decodeURIComponent(input) : decodeURI(input);
    }
  } catch (err) {
    error = 'Malformed URI sequence encountered during decoding.';
  }

  return (
    <div id="url-encoder-tool" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'encode'
                ? 'neu-tab-active'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            URL Encode
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'decode'
                ? 'neu-tab-active'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            URL Decode
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-[#6B7280] cursor-pointer">
          <input
            type="checkbox"
            checked={componentMode}
            onChange={e => setComponentMode(e.target.checked)}
            className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
          />
          <span>encodeURIComponent Mode (Encodes ? & = /)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Source URL / String
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            placeholder="Enter URL to encode or decode..."
            className="w-full px-4 py-3 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Processed Output
            </label>
            <CopyButton text={output} label="Copy URL" />
          </div>
          <textarea
            readOnly
            value={error || output}
            rows={8}
            className={`w-full px-4 py-3 rounded-2xl neu-pressed-deep font-mono text-xs ${
              error ? 'text-red-500 font-bold' : 'text-[#3D4852] dark:text-slate-100'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// 9. Markdown Editor & Live Preview Tool
export function MarkdownEditorTool() {
  const [md, setMd] = useState(
`# Welcome to DMLab Tools 🚀

DMLab Tools is an **all-in-one digital toolbox** designed for developers, designers, and digital marketers.

### Key Capabilities
* **Text Tools**: Case converters, word metrics, slugs, diff checkers
* **CSS Generators**: Box shadows, gradients, neumorphism, clip paths
* **Coding Tools**: JSON formatters, JWT decoders, SQL builders

\`\`\`typescript
const tool = "DMLab";
console.log(\`Running \${tool} workspace!\`);
\`\`\`

> Craftsmanship is the intersection of mathematical precision and deliberate simplicity.

Check out our [Palette Generator](#) and explore 35+ tools!`
  );

  const renderMarkdownHtml = (source: string) => {
    let html = source
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-[#3D4852] dark:text-white mb-3">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#3D4852] dark:text-slate-100 mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#3D4852] dark:text-slate-200 mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-extrabold text-[#3D4852] dark:text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded-lg neu-pressed-sm font-mono text-xs text-[#6C63FF]">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#6C63FF] pl-4 py-1 italic text-[#6B7280] my-2">$1</blockquote>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-[#3D4852] dark:text-slate-200">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[#6C63FF] underline font-bold hover:opacity-80">$1</a>')
      .replace(/\n\n/gim, '<div class="h-3"></div>');
    return html;
  };

  const handleDownloadMd = () => {
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="markdown-editor-tool" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl neu-flat">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMd(prev => prev + '\n\n## New Heading\n')}
            className="px-3 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 cursor-pointer"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => setMd(prev => prev + ' **bold text** ')}
            className="px-3 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 cursor-pointer"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => setMd(prev => prev + ' *italic text* ')}
            className="px-3 py-1.5 rounded-xl neu-convex-xs text-xs italic font-bold text-[#3D4852] dark:text-slate-200 cursor-pointer"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => setMd(prev => prev + '\n* Bullet point\n')}
            className="px-3 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 cursor-pointer"
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setMd(prev => prev + '\n```javascript\nconsole.log("code");\n```\n')}
            className="px-3 py-1.5 rounded-xl neu-convex-xs text-xs font-mono font-bold text-[#3D4852] dark:text-slate-200 cursor-pointer"
          >
            Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadMd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            Download .md
          </button>
          <CopyButton text={md} label="Copy Markdown" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Markdown Source</span>
          <textarea
            value={md}
            onChange={e => setMd(e.target.value)}
            rows={14}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Live HTML Render</span>
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdownHtml(md) }}
            className="w-full min-h-[340px] px-6 py-5 rounded-2xl neu-flat text-[#3D4852] dark:text-slate-100 text-sm overflow-y-auto leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

// 10. Text to Handwriting Converter
export function TextToHandwritingTool() {
  const [text, setText] = useState(
    'Dear Student,\n\nPractice makes progress. Never stop learning new technologies, building creative projects, and refining your craft every day.\n\nWarm regards,\nDMLab Tools'
  );
  const [inkColor, setInkColor] = useState('#0f172a');
  const [fontSize, setFontSize] = useState(20);
  const [paperStyle, setPaperStyle] = useState<'lined' | 'plain' | 'grid'>('lined');

  const handleDownloadNote = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, 800, 1000);

    // Margins
    if (paperStyle === 'lined') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 80; y < 980; y += 32) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(760, y);
        ctx.stroke();
      }
      // Red margin line
      ctx.strokeStyle = '#fca5a5';
      ctx.beginPath();
      ctx.moveTo(100, 40);
      ctx.lineTo(100, 960);
      ctx.stroke();
    } else if (paperStyle === 'grid') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 40; x < 760; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 960);
        ctx.stroke();
      }
      for (let y = 40; y < 960; y += 25) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(760, y);
        ctx.stroke();
      }
    }

    // Text
    ctx.fillStyle = inkColor;
    ctx.font = `italic ${fontSize}px "Caveat", "Dancing Script", cursive, sans-serif`;
    const lines = text.split('\n');
    let curY = 80;
    const startX = paperStyle === 'lined' ? 120 : 60;

    lines.forEach(line => {
      ctx.fillText(line, startX, curY);
      curY += 32;
    });

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'handwritten-note.png';
    a.click();
  };

  return (
    <div id="text-to-handwriting-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-3">
          <span>Ink Color:</span>
          <div className="flex items-center gap-2">
            {['#0f172a', '#1e3a8a', '#065f46', '#991b1b'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setInkColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${inkColor === c ? 'scale-125 ring-2 ring-[#6C63FF]' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>Paper:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {(['lined', 'plain', 'grid'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPaperStyle(p)}
                className={`px-3 py-1 rounded-lg capitalize cursor-pointer ${paperStyle === p ? 'neu-tab-active' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadNote}
          className="px-4 py-2 rounded-xl neu-btn-primary font-bold inline-flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <FileDown className="w-3.5 h-3.5" /> Download Note PNG
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Input Text</span>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={12}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Handwritten Sheet Preview</span>
          <div
            className={`min-h-[300px] p-8 rounded-2xl shadow-inner text-base transition-all font-serif italic ${
              paperStyle === 'lined'
                ? 'bg-[#faf8f5] bg-[linear-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:100%_32px] border-l-4 border-rose-300'
                : paperStyle === 'grid'
                ? 'bg-[#faf8f5] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:16px_16px]'
                : 'bg-[#faf8f5]'
            }`}
            style={{ color: inkColor, fontFamily: 'cursive, Georgia, serif' }}
          >
            <div className="whitespace-pre-wrap leading-8 tracking-wide">
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 11. Bionic Reading Converter
export function BionicReadingTool() {
  const [input, setInput] = useState(
    'Bionic Reading is a new method facilitating the reading process by guiding the eyes through text with artificial fixation points. As a result, the eye is guided over the text and the brain recognizes and processes the words much faster.'
  );

  const convertToBionic = (str: string) => {
    return str
      .split(' ')
      .map(word => {
        if (!word) return '';
        const len = word.length;
        const mid = Math.ceil(len / 2);
        const boldPart = word.slice(0, mid);
        const restPart = word.slice(mid);
        return `<b>${boldPart}</b>${restPart}`;
      })
      .join(' ');
  };

  const bionicHtml = convertToBionic(input);

  return (
    <div id="bionic-reading-tool" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Standard Text Input</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={10}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Bionic Reading Output</span>
            <CopyButton text={input} label="Copy Raw" />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: bionicHtml }}
            className="w-full min-h-[220px] p-6 rounded-2xl neu-flat text-[#3D4852] dark:text-slate-100 text-base leading-relaxed tracking-wide"
          />
        </div>
      </div>
    </div>
  );
}

// 12. Multiple Whitespace Remover
export function WhitespaceRemoverTool() {
  const [input, setInput] = useState(
    'This   is   a    sample     text\n\n\nwith     irregular       spacing    and   redundant     blank   lines.'
  );
  const [trimLines, setTrimLines] = useState(true);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);

  const processText = () => {
    let res = input;
    if (removeExtraSpaces) {
      res = res.replace(/[ \t]+/g, ' ');
    }
    if (trimLines) {
      res = res
        .split('\n')
        .map(l => l.trim())
        .join('\n');
    }
    if (removeEmptyLines) {
      res = res
        .split('\n')
        .filter(l => l.trim().length > 0)
        .join('\n');
    }
    return res;
  };

  const output = processText();

  return (
    <div id="whitespace-remover-tool" className="space-y-6">
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl neu-flat text-xs font-bold text-[#3D4852] dark:text-slate-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeExtraSpaces}
            onChange={e => setRemoveExtraSpaces(e.target.checked)}
            className="rounded text-[#6C63FF]"
          />
          <span>Collapse Multiple Spaces into One</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={e => setTrimLines(e.target.checked)}
            className="rounded text-[#6C63FF]"
          />
          <span>Trim Line Ends</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmptyLines}
            onChange={e => setRemoveEmptyLines(e.target.checked)}
            className="rounded text-[#6C63FF]"
          />
          <span>Remove Empty Lines</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Original Text</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Cleaned Text</span>
            <CopyButton text={output} label="Copy Clean Text" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-flat text-sm text-[#3D4852] dark:text-slate-100 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

// 13. Text Sorter / Alphabetizer
export function TextAlphabetizerTool() {
  const [input, setInput] = useState('Banana\nApple\nDragonfruit\nCherry\nElderberry\nBlueberry');
  const [order, setOrder] = useState<'asc' | 'desc' | 'length_asc' | 'length_desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const getSorted = () => {
    const lines = input.split('\n').filter(l => l.trim().length > 0);
    return lines
      .sort((a, b) => {
        if (order === 'length_asc') return a.length - b.length;
        if (order === 'length_desc') return b.length - a.length;
        const strA = caseSensitive ? a : a.toLowerCase();
        const strB = caseSensitive ? b : b.toLowerCase();
        return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      })
      .join('\n');
  };

  const output = getSorted();

  return (
    <div id="text-alphabetizer-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <span>Sort By:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {[
              { id: 'asc', label: 'A → Z' },
              { id: 'desc', label: 'Z → A' },
              { id: 'length_asc', label: 'Shortest' },
              { id: 'length_desc', label: 'Longest' },
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setOrder(s.id as any)}
                className={`px-3 py-1 rounded-lg cursor-pointer ${order === s.id ? 'neu-tab-active' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-[#3D4852] dark:text-slate-200">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={e => setCaseSensitive(e.target.checked)}
            className="rounded text-[#6C63FF]"
          />
          <span>Case Sensitive</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Input List</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Sorted List</span>
            <CopyButton text={output} label="Copy Sorted" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-flat text-sm text-[#3D4852] dark:text-slate-100 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

// 14. Reverse Text & String Inverter
export function ReverseTextTool() {
  const [input, setInput] = useState('Hello World! DMLab Tools');
  const [mode, setMode] = useState<'chars' | 'words' | 'upside_down'>('chars');

  const upsideDownMap: Record<string, string> = {
    a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
    k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
    u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
    A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ',
    K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'ɹ', S: 'S', T: '┴',
    U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
    '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
    '?': '¿', '!': '¡', '.': '˙', ',': '\'', '(': ')', ')': '(',
  };

  const getReversed = () => {
    if (mode === 'chars') {
      return input.split('').reverse().join('');
    }
    if (mode === 'words') {
      return input.split(' ').reverse().join(' ');
    }
    // Upside down
    return input
      .split('')
      .reverse()
      .map(char => upsideDownMap[char] || char)
      .join('');
  };

  const output = getReversed();

  return (
    <div id="reverse-text-tool" className="space-y-6">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm w-fit">
        {[
          { id: 'chars', label: 'Reverse Characters' },
          { id: 'words', label: 'Reverse Words' },
          { id: 'upside_down', label: 'Flip Upside Down' },
        ].map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              mode === m.id ? 'neu-tab-active' : 'text-[#6B7280]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Original Text</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={6}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Inverted Text</span>
            <CopyButton text={output} label="Copy Result" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full px-5 py-4 rounded-2xl neu-flat text-sm text-[#3D4852] dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

// 15. ASCII Art & Figlet Generator
export function AsciiArtTool() {
  const [text, setText] = useState('DEV TOOLS');
  const [font, setFont] = useState<'standard' | 'block' | 'bubble'>('standard');

  const asciiFonts: Record<string, Record<string, string[]>> = {
    standard: {
      A: ['  /\\  ', ' /  \\ ', '/ /\\ \\', '/ ____\\', '/_/  \\_\\'],
      B: [' ____  ', '|  _ \\ ', '| |_) |', '|  _ < ', '|____/ '],
      C: ['  ____ ', ' / ___|', '| |    ', '| |___ ', ' \\____|'],
      D: [' ____  ', '|  _ \\ ', '| | | |', '| |_| |', '|____/ '],
      E: [' _____ ', '| ____|', '|  _|  ', '| |___ ', '|_____|'],
      F: [' _____ ', '|  ___|', '| |_   ', '|  _|  ', '|_|    '],
      G: ['  ____ ', ' / ___|', '| |  _ ', '| |_| |', ' \\____|'],
      H: [' _   _ ', '| | | |', '| |_| |', '|  _  |', '|_| |_|'],
      I: [' ___ ', '|_ _|', ' | | ', ' | | ', '|___|'],
      J: ['     _ ', '    | |', ' _  | |', '| |_| |', ' \\___/ '],
      K: [' _  __', '| |/ /', '| ' + "' " + '/ ', '| . \\ ', '|_|\\_\\'],
      L: [' _     ', '| |    ', '| |    ', '| |___ ', '|_____|'],
      M: [' __  __ ', '|  \\/  |', '| |\\/| |', '| |  | |', '|_|  |_|'],
      N: [' _   _ ', '| \\ | |', '|  \\| |', '| |\\  |', '|_| \\_|'],
      O: ['  ___  ', ' / _ \\ ', '| | | |', '| |_| |', ' \\___/ '],
      P: [' ____  ', '|  _ \\ ', '| |_) |', '|  __/ ', '|_|    '],
      Q: ['  ___  ', ' / _ \\ ', '| | | |', '| |_| |', ' \\__\\_\\'],
      R: [' ____  ', '|  _ \\ ', '| |_) |', '|  _ < ', '|_| \\_\\'],
      S: [' ____  ', '/ ___| ', '\\___ \\ ', ' ___) |', '|____/ '],
      T: [' _____ ', '|_   _|', '  | |  ', '  | |  ', '  |_|  '],
      U: [' _   _ ', '| | | |', '| | | |', '| |_| |', ' \\___/ '],
      V: [' _   _ ', '| | | |', '| | | |', ' \\ V / ', '  \\_/  '],
      W: ['__        __', '\\ \\      / /', ' \\ \\ /\\ / / ', '  \\ V  V /  ', '   \\_/\\_/   '],
      X: ['__  __', '\\ \\/ /', ' \\  / ', ' /  \\ ', '/_/\\_\\'],
      Y: ['__   __', '\\ \\ / /', ' \\ V / ', '  | |  ', '  |_|  '],
      Z: [' _____ ', '|__  / ', '  / /  ', ' / /_  ', '/____| '],
      '0': ['  ___  ', ' / _ \\ ', '| | | |', '| |_| |', ' \\___/ '],
      '1': [' _ ', '/ |', '| |', '| |', '|_|'],
      '2': [' ____  ', '|___ \\ ', '  __) |', ' / __/ ', '|_____|'],
      '3': [' _____ ', '|___ / ', '  |_ \\ ', ' ___) |', '|____/ '],
      '4': [' _  _   ', '| || |  ', '| || |_ ', '|__   _|', '   |_|  '],
      '5': [' _____ ', '| ____|', '|___ \\ ', ' ___) |', '|____/ '],
      '6': ['  ____ ', ' / ___|', '| |___ ', '| ___ \\', '|_____/'],
      '7': [' _____ ', '|___  /', '   / / ', '  / /  ', ' /_/   '],
      '8': ['  ___  ', ' ( _ ) ', ' / _ \\ ', '| (_) |', ' \\___/ '],
      '9': ['  ___  ', ' / _ \\ ', '| (_) |', ' \\__, |', '   /_/ '],
      ' ': ['   ', '   ', '   ', '   ', '   '],
      '-': ['     ', '     ', ' --- ', '     ', '     '],
      '!': [' _ ', '| |', '| |', '|_|', '(_)'],
      '?': [' ___ ', '|_  |', '  | |', '  |_|', '  (_)'],
    },
    block: {
      A: ['[■■■■]', '[■  ■]', '[■■■■]', '[■  ■]', '[■  ■]'],
      B: ['[■■■ ]', '[■  ■]', '[■■■ ]', '[■  ■]', '[■■■ ]'],
      C: ['[■■■■]', '[■   ]', '[■   ]', '[■   ]', '[■■■■]'],
      D: ['[■■■ ]', '[■  ■]', '[■  ■]', '[■  ■]', '[■■■ ]'],
      E: ['[■■■■]', '[■   ]', '[■■■ ]', '[■   ]', '[■■■■]'],
      L: ['[■   ]', '[■   ]', '[■   ]', '[■   ]', '[■■■■]'],
      O: ['[■■■■]', '[■  ■]', '[■  ■]', '[■  ■]', '[■■■■]'],
      S: ['[■■■■]', '[■   ]', '[■■■■]', '[   ■]', '[■■■■]'],
      T: ['[■■■■]', '[ ■  ]', '[ ■  ]', '[ ■  ]', '[ ■  ]'],
      ' ': ['     ', '     ', '     ', '     ', '     '],
    },
  };

  const generateAscii = () => {
    const letters = text.toUpperCase().split('');
    const fontMap = asciiFonts[font] || asciiFonts.standard;
    const fallback = asciiFonts.standard;
    const lines = ['', '', '', '', ''];

    letters.forEach(char => {
      const art = fontMap[char] || fallback[char] || [' ___ ', '|   |', '|   |', '|___|', '     '];
      for (let i = 0; i < 5; i++) {
        lines[i] += (art[i] || '     ') + ' ';
      }
    });

    return lines.join('\n');
  };

  const output = generateAscii();

  return (
    <div id="ascii-art-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl neu-flat">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">Input Text:</span>
          <input
            type="text"
            value={text}
            maxLength={16}
            onChange={e => setText(e.target.value)}
            className="w-56 px-4 py-2 rounded-xl neu-pressed-deep font-mono text-sm font-bold text-[#3D4852] dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {(['standard', 'block'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFont(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize cursor-pointer transition-all ${
                  font === f ? 'neu-tab-active' : 'text-[#6B7280]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <CopyButton text={output} label="Copy ASCII Art" />
        </div>
      </div>

      <pre className="p-6 rounded-2xl neu-pressed-deep font-mono text-xs overflow-x-auto text-[#6C63FF] leading-tight whitespace-pre">
        {output}
      </pre>
    </div>
  );
}

// 16. HTML Entity Encoder & Decoder
// 17. Morse Code Translator with Audio Beep Simulator
export function MorseCodeTool() {
  const [input, setInput] = useState('SOS DMLAB TOOLS 2026');
  const [mode, setMode] = useState<'text_to_morse' | 'morse_to_text'>('text_to_morse');
  const [isPlaying, setIsPlaying] = useState(false);

  const MORSE_CODE_MAP: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
    I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
    Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/',
  };

  const REVERSE_MORSE_MAP: Record<string, string> = Object.entries(MORSE_CODE_MAP).reduce(
    (acc, [char, code]) => {
      acc[code] = char;
      return acc;
    },
    {} as Record<string, string>
  );

  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map(ch => MORSE_CODE_MAP[ch] || (ch === ' ' ? '/' : ''))
      .filter(Boolean)
      .join(' ');
  };

  const morseToText = (morse: string): string => {
    return morse
      .trim()
      .split(/\s+/)
      .map(code => {
        if (code === '/') return ' ';
        return REVERSE_MORSE_MAP[code] || '?';
      })
      .join('');
  };

  const output = mode === 'text_to_morse' ? textToMorse(input) : morseToText(input);

  const playMorseAudio = () => {
    if (isPlaying) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const morseString = mode === 'text_to_morse' ? output : input;
      const dotDuration = 0.08;
      let time = audioCtx.currentTime + 0.05;
      setIsPlaying(true);

      for (let i = 0; i < morseString.length; i++) {
        const symbol = morseString[i];
        if (symbol === '.' || symbol === '-') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(700, time);
          gain.gain.setValueAtTime(0.2, time);

          const dur = symbol === '.' ? dotDuration : dotDuration * 3;
          gain.gain.setValueAtTime(0.2, time + dur - 0.01);
          gain.gain.linearRampToValueAtTime(0.001, time + dur);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(time);
          osc.stop(time + dur);
          time += dur + dotDuration;
        } else if (symbol === ' ') {
          time += dotDuration * 2;
        } else if (symbol === '/') {
          time += dotDuration * 5;
        }
      }

      setTimeout(() => {
        setIsPlaying(false);
      }, (time - audioCtx.currentTime) * 1000);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div id="morse-code-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm">
          <button
            type="button"
            onClick={() => setMode('text_to_morse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'text_to_morse' ? 'neu-tab-active' : 'text-[#6B7280]'
            }`}
          >
            Text → Morse Code
          </button>
          <button
            type="button"
            onClick={() => setMode('morse_to_text')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'morse_to_text' ? 'neu-tab-active' : 'text-[#6B7280]'
            }`}
          >
            Morse Code → Text
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playMorseAudio}
            disabled={isPlaying || !output}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all ${
              isPlaying
                ? 'neu-pressed text-[#6C63FF]'
                : 'neu-convex-xs text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'Beeping Audio...' : 'Play Audio Beep'}</span>
          </button>
          <CopyButton text={output} label="Copy Result" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            {mode === 'text_to_morse' ? 'Input Text' : 'Input Morse Code (. and - with / for space)'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm font-mono text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            {mode === 'text_to_morse' ? 'Morse Code Output' : 'Decoded Text'}
          </label>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-flat text-sm font-mono text-[#3D4852] dark:text-slate-100 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

// 18. String & Email Obfuscator
export function StringObfuscatorTool() {
  const [input, setInput] = useState('contact@dmlabtools.dev');
  const [method, setMethod] = useState<'hex_entities' | 'decimal_entities' | 'js_charcode' | 'rot13'>('hex_entities');

  const obfuscate = (): { result: string; htmlPreview?: string } => {
    if (!input) return { result: '' };

    if (method === 'hex_entities') {
      const res = input
        .split('')
        .map(c => `&#x${c.charCodeAt(0).toString(16)};`)
        .join('');
      return { result: res, htmlPreview: `<a href="mailto:${res}">Send Email</a>` };
    }
    if (method === 'decimal_entities') {
      const res = input
        .split('')
        .map(c => `&#${c.charCodeAt(0)};`)
        .join('');
      return { result: res, htmlPreview: `<a href="mailto:${res}">Send Email</a>` };
    }
    if (method === 'js_charcode') {
      const codes = input.split('').map(c => c.charCodeAt(0)).join(',');
      const res = `<script>document.write(String.fromCharCode(${codes}));</script>`;
      return { result: res };
    }
    // ROT13
    const rot = input.replace(/[a-zA-Z]/g, c => {
      const code = c.charCodeAt(0);
      const base = code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - base + 13) % 26) + base);
    });
    return { result: rot };
  };

  const { result, htmlPreview } = obfuscate();

  return (
    <div id="string-obfuscator-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm">
          {[
            { id: 'hex_entities', label: 'HTML Hex (&#x..)' },
            { id: 'decimal_entities', label: 'Decimal (&#..)' },
            { id: 'js_charcode', label: 'JS charCode' },
            { id: 'rot13', label: 'ROT13 Cipher' },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                method === m.id ? 'neu-tab-active' : 'text-[#6B7280]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <CopyButton text={result} label="Copy Obfuscated" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Target String / Email
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={7}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm font-mono text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Obfuscated Output (Scraper Safe)
          </label>
          <textarea
            readOnly
            value={result}
            rows={7}
            className="w-full px-5 py-4 rounded-2xl neu-flat text-sm font-mono text-[#3D4852] dark:text-slate-100 break-all"
          />
        </div>
      </div>

      {htmlPreview && (
        <div className="p-5 rounded-2xl neu-flat space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">Embeddable HTML Link Snippet</span>
            <CopyButton text={htmlPreview} label="Copy HTML Tag" />
          </div>
          <code className="block p-3 rounded-xl neu-pressed-deep font-mono text-xs text-[#6C63FF] overflow-x-auto">
            {htmlPreview}
          </code>
        </div>
      )}
    </div>
  );
}

// 19. Binary to Text & Base Converter
export function BinaryTranslatorTool() {
  const [input, setInput] = useState('Hello DMLab!');
  const [mode, setMode] = useState<'text_to_bin' | 'bin_to_text' | 'text_to_hex' | 'hex_to_text'>('text_to_bin');

  const convert = (): string => {
    try {
      if (mode === 'text_to_bin') {
        return input
          .split('')
          .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
      }
      if (mode === 'bin_to_text') {
        return input
          .trim()
          .split(/\s+/)
          .map(b => String.fromCharCode(parseInt(b, 2)))
          .join('');
      }
      if (mode === 'text_to_hex') {
        return input
          .split('')
          .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(' ')
          .toUpperCase();
      }
      if (mode === 'hex_to_text') {
        const clean = input.replace(/\s+/g, '');
        let res = '';
        for (let i = 0; i < clean.length; i += 2) {
          res += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
        }
        return res;
      }
    } catch {
      return 'Error: Invalid format input.';
    }
    return '';
  };

  const output = convert();

  return (
    <div id="binary-translator-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm">
          {[
            { id: 'text_to_bin', label: 'Text → Binary' },
            { id: 'bin_to_text', label: 'Binary → Text' },
            { id: 'text_to_hex', label: 'Text → Hex' },
            { id: 'hex_to_text', label: 'Hex → Text' },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === m.id ? 'neu-tab-active' : 'text-[#6B7280]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <CopyButton text={output} label="Copy Output" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Source Value</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm font-mono text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Converted Result</label>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-flat text-sm font-mono text-[#3D4852] dark:text-slate-100 leading-relaxed break-all"
          />
        </div>
      </div>
    </div>
  );
}

// 20. Zalgo & Glitch Text Generator
export function ZalgoTextTool() {
  const [input, setInput] = useState('DMLAB GLITCH TEXT');
  const [intensity, setIntensity] = useState<'mini' | 'medium' | 'maximum'>('medium');
  const [up, setUp] = useState(true);
  const [mid, setMid] = useState(true);
  const [down, setDown] = useState(true);

  // Unicode combining diacritic marks
  const zalgoUp = [
    '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310',
    '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343',
    '\u0344', '\u034a', '\u034b', '\u034c', '\u0350', '\u0300', '\u0301', '\u0302',
  ];
  const zalgoMid = [
    '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327',
    '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e',
  ];
  const zalgoDown = [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f',
    '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c',
    '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339',
  ];

  const generateZalgo = (): string => {
    const numDiacritics = intensity === 'mini' ? 2 : intensity === 'medium' ? 6 : 14;
    let result = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === ' ') {
        result += ' ';
        continue;
      }
      result += char;
      if (up) {
        for (let j = 0; j < Math.floor(Math.random() * numDiacritics); j++) {
          result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
        }
      }
      if (mid) {
        for (let j = 0; j < Math.floor(Math.random() * (numDiacritics / 2)); j++) {
          result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
        }
      }
      if (down) {
        for (let j = 0; j < Math.floor(Math.random() * numDiacritics); j++) {
          result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
        }
      }
    }
    return result;
  };

  const output = generateZalgo();

  return (
    <div id="zalgo-text-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-3">
          <span>Glitch Intensity:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {(['mini', 'medium', 'maximum'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setIntensity(lvl)}
                className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-all ${
                  intensity === lvl ? 'neu-tab-active' : ''
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={up} onChange={e => setUp(e.target.checked)} className="rounded text-[#6C63FF]" />
            <span>Top</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={mid} onChange={e => setMid(e.target.checked)} className="rounded text-[#6C63FF]" />
            <span>Middle</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={down} onChange={e => setDown(e.target.checked)} className="rounded text-[#6C63FF]" />
            <span>Bottom</span>
          </label>
        </div>

        <CopyButton text={output} label="Copy Zalgo Text" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Normal Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={6}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm font-sans text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Corrupted Zalgo Result</label>
          <div className="w-full min-h-[160px] p-6 rounded-2xl neu-flat text-sm font-mono text-rose-500 overflow-y-auto leading-loose whitespace-pre-wrap select-all">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}

// 21. NATO Phonetic Alphabet & Aviation Spelling
export function PhoneticAlphabetTool() {
  const [input, setInput] = useState('BRAVO DELTA 2026');

  const NATO_ALPHABET: Record<string, string> = {
    A: 'Alfa (AL-fah)', B: 'Bravo (BRAH-voh)', C: 'Charlie (CHAR-lee)', D: 'Delta (DELL-tah)',
    E: 'Echo (ECK-oh)', F: 'Foxtrot (FOKS-trot)', G: 'Golf (GOLF)', H: 'Hotel (hoh-TELL)',
    I: 'India (IN-dee-ah)', J: 'Juliett (JEW-lee-ETT)', K: 'Kilo (KEY-loh)', L: 'Lima (LEE-mah)',
    M: 'Mike (MIKE)', N: 'November (no-VEM-ber)', O: 'Oscar (OSS-cah)', P: 'Papa (pah-PAH)',
    Q: 'Quebec (keh-BECK)', R: 'Romeo (ROW-me-oh)', S: 'Sierra (see-AIR-rah)', T: 'Tango (TANG-go)',
    U: 'Uniform (YOU-nee-form)', V: 'Victor (VIK-tah)', W: 'Whiskey (WISS-key)', X: 'X-ray (ECKS-ray)',
    Y: 'Yankee (YANG-key)', Z: 'Zulu (ZOO-loo)',
    '0': 'Zero (ZEE-ro)', '1': 'One (WUN)', '2': 'Two (TOO)', '3': 'Three (TREE)',
    '4': 'Four (FOW-er)', '5': 'Five (FIFE)', '6': 'Six (SIX)', '7': 'Seven (SEV-en)',
    '8': 'Eight (AIT)', '9': 'Nine (NIN-er)',
  };

  const getPhoneticSpelling = (str: string): string[] => {
    return str
      .toUpperCase()
      .split('')
      .map(char => {
        if (NATO_ALPHABET[char]) return NATO_ALPHABET[char];
        if (char === ' ') return '— [SPACE] —';
        return char;
      });
  };

  const phoneticLines = getPhoneticSpelling(input);
  const plainWords = phoneticLines.map(l => l.split(' ')[0]).join(' ');

  return (
    <div id="phonetic-alphabet-tool" className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Input Word or Code to Spell Out
          </label>
          <CopyButton text={plainWords} label="Copy Phonetics" />
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Flight GA402 or Password..."
          className="w-full px-5 py-3.5 rounded-2xl neu-pressed-deep text-base font-mono font-bold text-[#3D4852] dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {input
          .toUpperCase()
          .split('')
          .filter(c => c.trim().length > 0)
          .map((char, idx) => {
            const phonetic = NATO_ALPHABET[char] || char;
            const [word, pron] = phonetic.includes('(')
              ? phonetic.replace(')', '').split(' (')
              : [phonetic, ''];

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl neu-flat flex items-center justify-between gap-3"
              >
                <div className="w-10 h-10 rounded-xl neu-pressed-deep flex items-center justify-center font-display font-extrabold text-lg text-[#6C63FF]">
                  {char}
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#3D4852] dark:text-slate-100">{word}</div>
                  {pron && <div className="text-[11px] font-mono text-[#6B7280]">{pron}</div>}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// 22. Text Statistics & Readability Analyzer
export function TextStatisticsTool() {
  const [text, setText] = useState(
    `Quality code requires disciplined focus and mathematical clarity. Writing maintainable software is both an art and an engineering science. Modern tools should deliver immediate value with zero friction.`
  );

  const clean = text.trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = text.length;
  const sentenceCount = clean ? (clean.match(/[.!?]+/g) || []).length || 1 : 0;
  const paragraphCount = clean ? (clean.split(/\n\s*\n/).filter(Boolean).length || 1) : 0;

  // Syllable counter approximation
  const countSyllables = (word: string) => {
    let w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
    w = w.replace(/^y/, '');
    const matched = w.match(/[aeiouy]{1,2}/g);
    return matched ? matched.length : 1;
  };

  const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);

  // Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  const fleschEase =
    wordCount > 0 && sentenceCount > 0
      ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount)
      : 0;

  // Flesch-Kincaid Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
  const fkGrade =
    wordCount > 0 && sentenceCount > 0
      ? 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59
      : 0;

  const getReadabilityLabel = (score: number) => {
    if (score >= 90) return { label: 'Very Easy (5th Grade)', color: 'text-emerald-500' };
    if (score >= 70) return { label: 'Fairly Easy (7th Grade)', color: 'text-emerald-400' };
    if (score >= 60) return { label: 'Standard (8th-9th Grade)', color: 'text-blue-500' };
    if (score >= 50) return { label: 'Fairly Difficult (High School)', color: 'text-amber-500' };
    if (score >= 30) return { label: 'Difficult (College Level)', color: 'text-rose-500' };
    return { label: 'Very Confusing / Academic', color: 'text-purple-500' };
  };

  const easeInfo = getReadabilityLabel(fleschEase);

  return (
    <div id="text-statistics-tool" className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl neu-flat text-center">
          <span className="text-2xl font-mono font-extrabold text-[#6C63FF]">{fleschEase.toFixed(1)}</span>
          <span className="block text-xs font-bold text-[#6B7280] mt-1">Flesch Ease Score</span>
          <span className={`text-[11px] font-bold mt-1 block ${easeInfo.color}`}>{easeInfo.label}</span>
        </div>

        <div className="p-5 rounded-2xl neu-flat text-center">
          <span className="text-2xl font-mono font-extrabold text-[#38B2AC]">{Math.max(1, fkGrade).toFixed(1)}</span>
          <span className="block text-xs font-bold text-[#6B7280] mt-1">Grade Level</span>
          <span className="text-[11px] font-bold text-[#6B7280] mt-1 block">US School Grade</span>
        </div>

        <div className="p-5 rounded-2xl neu-flat text-center">
          <span className="text-2xl font-mono font-extrabold text-[#8B84FF]">
            {wordCount > 0 ? (totalSyllables / wordCount).toFixed(2) : 0}
          </span>
          <span className="block text-xs font-bold text-[#6B7280] mt-1">Avg Syllables / Word</span>
          <span className="text-[11px] font-bold text-[#6B7280] mt-1 block">{totalSyllables} total syllables</span>
        </div>

        <div className="p-5 rounded-2xl neu-flat text-center">
          <span className="text-2xl font-mono font-extrabold text-amber-500">
            {sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0}
          </span>
          <span className="block text-xs font-bold text-[#6B7280] mt-1">Words / Sentence</span>
          <span className="text-[11px] font-bold text-[#6B7280] mt-1 block">{sentenceCount} sentences</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Text Content to Analyze
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#6B7280]">{wordCount} words • {charCount} chars</span>
            <CopyButton text={text} label="Copy Text" />
          </div>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm leading-relaxed text-[#3D4852] dark:text-slate-100"
        />
      </div>
    </div>
  );
}

// 23. Number to Words Converter (English & Indonesian)
export function NumberToWordsTool() {
  const [numInput, setNumInput] = useState('1250000');
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [currencyMode, setCurrencyMode] = useState(true);

  const convertEnglish = (num: number): string => {
    if (num === 0) return 'zero';
    const belowTwenty = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand', 'million', 'billion', 'trillion'];

    let word = '';
    let i = 0;

    while (num > 0) {
      if (num % 1000 !== 0) {
        let chunk = '';
        let n = num % 1000;
        if (Math.floor(n / 100) > 0) {
          chunk += belowTwenty[Math.floor(n / 100)] + ' hundred ';
          n %= 100;
        }
        if (n >= 20) {
          chunk += tens[Math.floor(n / 10)] + ' ';
          n %= 10;
        }
        if (n > 0) {
          chunk += belowTwenty[n] + ' ';
        }
        word = chunk + thousands[i] + ' ' + word;
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return word.trim();
  };

  const convertIndonesian = (n: number): string => {
    if (n === 0) return 'nol';
    const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

    const terbilang = (x: number): string => {
      if (x < 12) return satuan[x];
      if (x < 20) return terbilang(x - 10) + ' belas';
      if (x < 100) return terbilang(Math.floor(x / 10)) + ' puluh ' + terbilang(x % 10);
      if (x < 200) return 'seratus ' + terbilang(x - 100);
      if (x < 1000) return terbilang(Math.floor(x / 100)) + ' ratus ' + terbilang(x % 100);
      if (x < 2000) return 'seribu ' + terbilang(x - 1000);
      if (x < 1000000) return terbilang(Math.floor(x / 1000)) + ' ribu ' + terbilang(x % 1000);
      if (x < 1000000000) return terbilang(Math.floor(x / 1000000)) + ' juta ' + terbilang(x % 1000000);
      if (x < 1000000000000) return terbilang(Math.floor(x / 1000000000)) + ' miliar ' + terbilang(x % 1000000000);
      if (x < 1000000000000000) return terbilang(Math.floor(x / 1000000000000)) + ' triliun ' + terbilang(x % 1000000000000);
      return '';
    };

    return terbilang(n).replace(/\s+/g, ' ').trim();
  };

  const numVal = Math.abs(parseFloat(numInput.replace(/[^0-9.]/g, '')) || 0);
  let wordsResult = lang === 'id' ? convertIndonesian(Math.floor(numVal)) : convertEnglish(Math.floor(numVal));

  if (currencyMode) {
    if (lang === 'id') {
      wordsResult = wordsResult + ' rupiah';
    } else {
      wordsResult = wordsResult + ' dollars';
    }
  }

  // Capitalize first letter
  const formattedWords = wordsResult.charAt(0).toUpperCase() + wordsResult.slice(1);

  return (
    <div id="number-to-words-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#6B7280]">Language:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            <button
              type="button"
              onClick={() => setLang('id')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                lang === 'id' ? 'neu-tab-active' : 'text-[#6B7280]'
              }`}
            >
              Bahasa Indonesia
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                lang === 'en' ? 'neu-tab-active' : 'text-[#6B7280]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-[#3D4852] dark:text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={currencyMode}
            onChange={e => setCurrencyMode(e.target.checked)}
            className="rounded text-[#6C63FF]"
          />
          <span>Append Currency ({lang === 'id' ? 'Rupiah' : 'Dollars'})</span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Enter Number</label>
        <input
          type="text"
          value={numInput}
          onChange={e => setNumInput(e.target.value)}
          placeholder="e.g. 1500000"
          className="w-full px-5 py-4 rounded-2xl neu-pressed-deep font-mono text-xl font-extrabold text-[#6C63FF]"
        />
      </div>

      <div className="p-6 rounded-2xl neu-flat space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-[#6B7280]">Words Output / Terbilang</span>
          <CopyButton text={formattedWords} label="Copy Words" />
        </div>
        <div className="text-lg font-serif italic leading-relaxed text-[#3D4852] dark:text-slate-100 p-4 rounded-xl neu-pressed-sm select-all">
          "{formattedWords}"
        </div>
      </div>
    </div>
  );
}

// 24. HTML Entity Encoder & Decoder
export function HtmlEntityTool() {
  const [input, setInput] = useState('<div class="box">© 2026 "DMLab" & \'Tools\' — Special Symbols: → ⚡ ★</div>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encodeHtml = (str: string) => {
    return str.replace(/[\u00A0-\u9999<>&"']/g, i => `&#${i.charCodeAt(0)};`);
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
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            mode === 'encode' ? 'neu-tab-active' : 'text-[#6B7280]'
          }`}
        >
          Encode Entities
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            mode === 'decode' ? 'neu-tab-active' : 'text-[#6B7280]'
          }`}
        >
          Decode Entities
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Source Content</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Converted Result</span>
            <CopyButton text={output} label="Copy Entities" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full px-5 py-4 rounded-2xl neu-flat text-sm text-[#3D4852] dark:text-slate-100 font-mono"
          />
        </div>
      </div>
    </div>
  );
}



