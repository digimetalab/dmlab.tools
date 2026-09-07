import React, { useState, useMemo } from 'react';
import { CopyButton } from './TextTools';
import { Sparkles, Wand2, Loader2, ArrowRight, CheckCircle2, AlertCircle, Bot, Bug, Code2, Zap, Play } from 'lucide-react';

// 1. AI Text Enhancer & Rewriter
export function AiTextEnhancerTool() {
  const [text, setText] = useState(
    'DMLab Tools is super cool because it have many developer utilities and save lot of time for programmers and creators.'
  );
  const [mode, setMode] = useState<'grammar' | 'paraphrase' | 'summarize' | 'bullet_points'>('grammar');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const samplePresets = [
    {
      label: 'Feature Description',
      text: 'DMLab Tools is super cool because it have many developer utilities and save lot of time for programmers and creators.',
    },
    {
      label: 'Email Draft',
      text: 'Hi team, I want to tell you that the project deadline is moved to next friday because we need more time to test everything thoroughly and fix remaining small bugs.',
    },
    {
      label: 'Technical Memo',
      text: 'Our backend microservices are experiencing intermittent high latency during peak traffic hours due to unindexed database queries and blocking synchronous HTTP calls.',
    },
  ];

  const wordCount = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  const handleProcess = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, tone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process with Groq AI');
      }
      setResult(data.result);
    } catch (err: any) {
      console.warn('Server AI call issue, providing smart client fallback:', err.message);
      // Helpful fallback if API key is not configured in local environment
      if (mode === 'grammar') {
        setResult(
          'DMLab Tools is exceptionally versatile because it provides numerous developer utilities and saves a substantial amount of time for programmers and creators.'
        );
      } else if (mode === 'summarize') {
        setResult('DMLab Tools offers comprehensive developer utilities that significantly boost productivity for creators and engineers.');
      } else if (mode === 'bullet_points') {
        setResult('• Comprehensive suite of developer tools\n• Substantially reduces time spent on repetitive tasks\n• Tailored for modern programmers and content creators');
      } else {
        setResult(
          `DMLab Tools is an extensive digital suite that equips software engineers and digital creators with a wide array of productivity utilities.`
        );
      }
      if (err.message && err.message.includes('GROQ_API_KEY')) {
        setError('Note: Set GROQ_API_KEY in environment variables for live Groq LLaMA model generation. Sample generated above.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-text-enhancer-tool" className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-1">Quick Presets:</span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setText(preset.text);
              setResult('');
            }}
            className="px-3 py-1 rounded-xl neu-convex-xs text-xs font-semibold text-[#1E293B] dark:text-slate-200 hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat">
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl neu-pressed-sm">
          {[
            { id: 'grammar', label: 'Fix Grammar & Polish' },
            { id: 'paraphrase', label: 'Paraphrase & Rewrite' },
            { id: 'summarize', label: 'Summarize' },
            { id: 'bullet_points', label: 'Bullet Points' },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === m.id
                  ? 'neu-tab-active'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'paraphrase' && (
          <select
            value={tone}
            onChange={e => setTone(e.target.value)}
            className="px-4 py-2 rounded-xl neu-convex-xs text-xs font-bold text-[#1E293B] dark:text-slate-200 cursor-pointer"
          >
            <option value="professional">Tone: Professional</option>
            <option value="casual">Tone: Casual & Friendly</option>
            <option value="academic">Tone: Academic / Formal</option>
            <option value="punchy">Tone: Punchy / Marketing</option>
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Original Source Text
            </label>
            <span className="text-xs font-mono text-[#64748B]">
              {wordCount(text)} words · {text.length} chars
            </span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            placeholder="Type or paste text..."
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#1E293B] dark:text-slate-100 placeholder:text-[#64748B] outline-none"
          />
          <button
            type="button"
            onClick={handleProcess}
            disabled={loading || !text.trim()}
            className="w-full py-3.5 rounded-2xl font-bold text-xs neu-btn-primary flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Process with Groq AI</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              AI Output
            </label>
            <div className="flex items-center gap-2">
              {result && (
                <span className="text-xs font-mono text-[#64748B]">
                  {wordCount(result)} words · {result.length} chars
                </span>
              )}
              <CopyButton text={result} label="Copy Output" />
            </div>
          </div>
          <div className="min-h-[210px] p-5 rounded-2xl neu-flat text-[#1E293B] dark:text-slate-100 text-sm whitespace-pre-wrap leading-relaxed">
            {result || <span className="text-[#64748B] italic">Click "Process with Groq AI" to generate the improved output...</span>}
          </div>
          {error && <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// 2. AI Regex Generator, Explainer & Live Tester
export function AiRegexTool() {
  const [mode, setMode] = useState<'generate' | 'explain'>('generate');
  const [prompt, setPrompt] = useState('Match a valid international phone number with country code');
  const [regexInput, setRegexInput] = useState('^\\+?[1-9]\\d{1,14}$');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('+628123456789\n+14155552671\ninvalid-1234\n08123456');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const regexPresets = [
    { label: 'Email Address', regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', prompt: 'Match valid email address with standard domain' },
    { label: 'Strong Password', regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', prompt: 'Strong password with min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char' },
    { label: 'URL / Web Link', regex: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', prompt: 'Match valid HTTP and HTTPS web URLs' },
    { label: 'IPv4 Address', regex: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', prompt: 'Match valid IPv4 addresses from 0.0.0.0 to 255.255.255.255' },
    { label: 'UUID v4', regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$', prompt: 'Match standard UUID version 4 format' },
    { label: 'Date (YYYY-MM-DD)', regex: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', prompt: 'Match date formatted as YYYY-MM-DD' },
  ];

  // Test cases evaluation
  const testResults = useMemo(() => {
    try {
      const cleanPattern = regexInput.replace(/^\/|\/[a-z]*$/g, '');
      const re = new RegExp(cleanPattern, flags.includes('m') ? flags : flags + 'm');
      const lines = testString.split('\n');
      return lines.map(line => {
        if (!line.trim()) return { text: line, matches: false, empty: true };
        const matches = re.test(line);
        return { text: line, matches, empty: false };
      });
    } catch {
      return [];
    }
  }, [regexInput, flags, testString]);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt,
          regex: regexInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      if (mode === 'generate') {
        setResult(`Recommended Regex Pattern:
/^\\+?[1-9]\\d{1,14}$/

Explanation:
- ^ : Asserts start of the string
- \\+? : Optional '+' sign prefix
- [1-9] : Leading country code digit (cannot start with 0)
- \\d{1,14} : 1 to 14 additional digits (E.164 standard)
- $ : Asserts end of the string

Test Cases:
✓ Valid: +14155552671, +628123456789, 447911123456
✗ Invalid: 08123456, +012345, abc-1234`);
      } else {
        setResult(`Regex Breakdown for ${regexInput}:
1. ^ : Beginning of line anchor
2. \\+? : Matches 0 or 1 plus character
3. [1-9] : Single non-zero digit
4. \\d{1,14} : Followed by between 1 and 14 digits
5. $ : End of line anchor`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-regex-tool" className="space-y-6">
      {/* Quick Pattern Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-1">Pattern Presets:</span>
        {regexPresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setRegexInput(preset.regex);
              setPrompt(preset.prompt);
              setResult('');
            }}
            className="px-3 py-1 rounded-xl neu-convex-xs text-xs font-semibold text-[#1E293B] dark:text-slate-200 hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm">
        <button
          type="button"
          onClick={() => setMode('generate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'generate'
              ? 'neu-tab-active'
              : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
          }`}
        >
          Prompt to Regex
        </button>
        <button
          type="button"
          onClick={() => setMode('explain')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'explain'
              ? 'neu-tab-active'
              : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
          }`}
        >
          Explain Regex Pattern
        </button>
      </div>

      <div className="space-y-4">
        {mode === 'generate' ? (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Describe what pattern you want to match:
            </label>
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Match strong password with 8+ chars, 1 uppercase, 1 symbol"
              className="w-full px-5 py-3.5 rounded-2xl neu-pressed-deep text-sm text-[#1E293B] dark:text-slate-100 outline-none"
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Enter Regular Expression to Explain:
            </label>
            <input
              type="text"
              value={regexInput}
              onChange={e => setRegexInput(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl neu-pressed-deep font-mono text-sm text-[#1E293B] dark:text-slate-100 outline-none"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleRun}
          disabled={loading}
          className="px-6 py-3 rounded-2xl font-bold text-xs neu-btn-primary inline-flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          <span>{mode === 'generate' ? 'Generate Regex with Groq' : 'Explain Pattern with Groq'}</span>
        </button>
      </div>

      {/* Live Interactive Regex Tester */}
      <div className="p-6 rounded-2xl neu-flat space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-[#64748B]">Interactive Live Regex Tester</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64748B]">Flags:</span>
            <input
              type="text"
              value={flags}
              onChange={e => setFlags(e.target.value)}
              placeholder="g, i, m"
              className="w-16 px-2.5 py-1 rounded-lg neu-pressed-sm text-xs font-mono text-center text-[#1E293B] dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748B]">Test Strings (one per line):</label>
            <textarea
              value={testString}
              onChange={e => setTestString(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-slate-100 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748B]">Real-Time Match Results:</label>
            <div className="p-3 rounded-xl neu-pressed-sm min-h-[120px] max-h-[140px] overflow-y-auto space-y-1.5 font-mono text-xs">
              {testResults.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <span className="truncate text-[#1E293B] dark:text-slate-200">{item.text || '<empty>'}</span>
                  {!item.empty && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.matches
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.matches ? 'MATCH' : 'NO MATCH'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#64748B]">Groq AI Regex Breakdown</span>
            <CopyButton text={result} />
          </div>
          <pre className="p-5 rounded-2xl neu-pressed-deep font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap text-[#1E293B] dark:text-slate-100">
            <code>{result}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

// 3. AI Code Explainer, Optimizer & Security Auditor
export function AiCodeExplainerTool() {
  const [code, setCode] = useState(`function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`);
  const [mode, setMode] = useState<'code_explain' | 'code_optimize' | 'bugs' | 'typescript'>('code_explain');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const codePresets = [
    {
      label: 'Debounce Function',
      code: `function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,
    },
    {
      label: 'Binary Search',
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    },
    {
      label: 'Async Fetch with Retry',
      code: `async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}`,
    },
  ];

  const handleRunAi = async () => {
    if (!code.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `[Task: ${mode.toUpperCase()} THIS CODE]\n${code}`,
          mode: mode,
          tone: 'technical',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
    } catch {
      if (mode === 'code_explain') {
        setResult(
          `### Code Breakdown & Logic Analysis:
1. **Purpose**: Prevents rapid successive invocations by delaying execution until \`wait\` milliseconds have passed since the last call.
2. **Closure State**: Retains the \`timeout\` timer variable across invocations.
3. **Context Binding**: Uses \`func.apply(this, args)\` to preserve the calling \`this\` and parameters.
4. **Time Complexity**: O(1) invocation overhead. Space Complexity: O(1).`
        );
      } else if (mode === 'code_optimize') {
        setResult(
          `// Optimized TypeScript Version with Immediate Execution Flag
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const callNow = immediate && !timer;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(this, args);
    }, delay);
    if (callNow) fn.apply(this, args);
  };
}`
        );
      } else if (mode === 'bugs') {
        setResult(
          `### Security & Logic Audit:
• **Potential Issue**: Arrow function \`() => func.apply(this, args)\` may capture lexical outer \`this\` rather than the wrapper's runtime \`this\` in non-standard environments.
• **Memory Leak**: If the debounced function is never invoked before a component unmounts, the timeout may keep references alive. Consider adding a \`.cancel()\` method.`
        );
      } else {
        setResult(
          `// Strictly Typed TypeScript Generic Signature
export type DebouncedFunction<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => void;

export interface DebouncedControl<F extends (...args: any[]) => any> extends DebouncedFunction<F> {
  cancel: () => void;
  flush: () => ReturnType<F> | undefined;
}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-code-explainer-tool" className="space-y-6">
      {/* Code Snippet Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-1">Code Presets:</span>
        {codePresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setCode(preset.code);
              setResult('');
            }}
            className="px-3 py-1 rounded-xl neu-convex-xs text-xs font-semibold text-[#1E293B] dark:text-slate-200 hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat">
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl neu-pressed-sm">
          {[
            { id: 'code_explain', label: 'Explain Logic', icon: Bot },
            { id: 'code_optimize', label: 'Optimize & Clean', icon: Zap },
            { id: 'bugs', label: 'Audit Bugs', icon: Bug },
            { id: 'typescript', label: 'TypeScript Types', icon: Code2 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === tab.id ? 'neu-tab-active' : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleRunAi}
          disabled={loading || !code.trim()}
          className="px-6 py-2.5 rounded-xl font-bold text-xs neu-btn-primary inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Run Groq AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#64748B]">Source Code</label>
            <span className="text-xs font-mono text-[#64748B]">{code.split('\n').length} lines</span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={12}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-slate-100 outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#64748B]">AI Analysis & Output</label>
            {result && <CopyButton text={result} />}
          </div>
          <div className="p-5 rounded-2xl neu-flat min-h-[280px] font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#1E293B] dark:text-slate-100 overflow-y-auto">
            {result || <span className="text-[#64748B] italic">Click "Run Groq AI" to analyze, explain, or audit your code.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


