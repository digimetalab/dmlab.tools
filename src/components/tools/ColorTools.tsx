import React, { useState, useEffect, useRef } from 'react';
import { CopyButton } from './TextTools';
import { Lock, Unlock, RefreshCw, Upload, Check, Eye, Palette, Sparkles } from 'lucide-react';

// 1. Color Palette Generator
export function ColorPaletteTool() {
  const [colors, setColors] = useState([
    { hex: '#6366F1', locked: false, name: 'Indigo' },
    { hex: '#EC4899', locked: false, name: 'Pink' },
    { hex: '#F59E0B', locked: false, name: 'Amber' },
    { hex: '#10B981', locked: false, name: 'Emerald' },
    { hex: '#06B6D4', locked: false, name: 'Cyan' },
  ]);

  const randomHex = () => {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase()
    );
  };

  const generateNew = () => {
    setColors(prev =>
      prev.map(c => (c.locked ? c : { ...c, hex: randomHex() }))
    );
  };

  const toggleLock = (idx: number) => {
    setColors(prev => {
      const next = [...prev];
      next[idx].locked = !next[idx].locked;
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generateNew();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div id="color-palette-tool" className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl neu-flat">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={generateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-btn-primary text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Generate Palette
          </button>
          <span className="text-xs text-[#6B7280] font-bold hidden sm:inline">(or press Spacebar)</span>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={colors.map(c => c.hex).join(', ')} label="Copy All HEX" />
        </div>
      </div>

      {/* Palette Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 h-[380px] sm:h-72">
        {colors.map((color, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: color.hex }}
            className="rounded-2xl p-4 flex flex-row sm:flex-col justify-between items-center sm:items-center text-white shadow-md transition-all relative group"
          >
            <button
              type="button"
              onClick={() => toggleLock(idx)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                color.locked
                  ? 'bg-black/60 text-amber-300 shadow-md scale-110'
                  : 'bg-black/25 text-white hover:bg-black/50'
              }`}
              title={color.locked ? 'Unlock Color' : 'Lock Color'}
            >
              {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            <div className="text-center bg-black/50 backdrop-blur-sm px-3.5 py-1.5 rounded-xl font-mono text-sm font-extrabold tracking-wider shadow-sm">
              {color.hex}
            </div>

            <div className="hidden sm:block">
              <CopyButton text={color.hex} label="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Color Converter & Shades Tool
export function ColorConverterTool() {
  const [hex, setHex] = useState('#6366F1');

  const hexToRgb = (h: string) => {
    const clean = h.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return { r, g, b };
  };

  const rgb = hexToRgb(hex);

  const rNorm = rgb.r / 255;
  const gNorm = rgb.g / 255;
  const bNorm = rgb.b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  const tintsShades = Array.from({ length: 9 }, (_, i) => {
    const factor = (i + 1) * 0.1;
    const newL = Math.min(0.95, Math.max(0.05, factor));
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(newL * 100)}%)`;
  });

  return (
    <div id="color-converter-tool" className="space-y-6">
      <div className="p-6 sm:p-8 rounded-[28px] neu-flat flex flex-col sm:flex-row items-center gap-6">
        <div
          style={{ backgroundColor: hex }}
          className="w-28 h-28 rounded-2xl shadow-md border-2 border-white/20 shrink-0"
        />
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={hex}
              onChange={e => setHex(e.target.value.toUpperCase())}
              className="w-10 h-10 rounded-xl cursor-pointer border-none"
            />
            <input
              type="text"
              value={hex}
              onChange={e => setHex(e.target.value.toUpperCase())}
              className="px-4 py-2 rounded-xl neu-pressed-deep font-mono font-extrabold text-sm w-36 text-[#3D4852] dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl neu-convex-xs flex items-center justify-between">
              <span className="font-mono font-bold text-[#3D4852] dark:text-slate-200">{rgbStr}</span>
              <CopyButton text={rgbStr} />
            </div>
            <div className="p-3.5 rounded-xl neu-convex-xs flex items-center justify-between">
              <span className="font-mono font-bold text-[#3D4852] dark:text-slate-200">{hsl}</span>
              <CopyButton text={hsl} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase text-[#6B7280]">10-Step Luminance Ladder</span>
        <div className="grid grid-cols-9 h-16 rounded-2xl overflow-hidden shadow-xs">
          {tintsShades.map((shade, i) => (
            <div
              key={i}
              style={{ backgroundColor: shade }}
              className="h-full flex items-end justify-center pb-1 text-[10px] font-mono text-black/70 dark:text-white font-bold"
            >
              {(i + 1) * 10}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Contrast Checker Tool (WCAG 2.1)
export function ContrastCheckerTool() {
  const [fg, setFg] = useState('#FFFFFF');
  const [bg, setBg] = useState('#4F46E5');

  const getLuminance = (hex: string) => {
    const clean = hex.replace('#', '');
    const rgb = [
      parseInt(clean.substring(0, 2), 16) / 255,
      parseInt(clean.substring(2, 4), 16) / 255,
      parseInt(clean.substring(4, 6), 16) / 255,
    ].map(val => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  const ratioRounded = ratio.toFixed(2);

  const passAANormal = ratio >= 4.5;
  const passAALarge = ratio >= 3.0;
  const passAAANormal = ratio >= 7.0;
  const passAAALarge = ratio >= 4.5;

  return (
    <div id="contrast-checker-tool" className="space-y-6">
      {/* Live Preview Card */}
      <div
        style={{ backgroundColor: bg, color: fg }}
        className="p-8 sm:p-10 rounded-[28px] text-center shadow-lg transition-colors"
      >
        <h3 className="text-2xl font-extrabold">Contrast Text Preview</h3>
        <p className="text-sm mt-2 max-w-md mx-auto opacity-90">
          This sample text illustrates real-time visual legibility and compliance against WCAG 2.1 accessibility criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">Foreground Text</span>
            <div className="flex items-center gap-2">
              <input type="color" value={fg} onChange={e => setFg(e.target.value.toUpperCase())} className="w-8 h-8 rounded-lg cursor-pointer border-none" />
              <input type="text" value={fg} onChange={e => setFg(e.target.value.toUpperCase())} className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-xl neu-pressed-deep text-[#3D4852] dark:text-slate-100" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">Background</span>
            <div className="flex items-center gap-2">
              <input type="color" value={bg} onChange={e => setBg(e.target.value.toUpperCase())} className="w-8 h-8 rounded-lg cursor-pointer border-none" />
              <input type="text" value={bg} onChange={e => setBg(e.target.value.toUpperCase())} className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-xl neu-pressed-deep text-[#3D4852] dark:text-slate-100" />
            </div>
          </div>
        </div>

        {/* WCAG Badges */}
        <div className="p-6 rounded-2xl neu-flat space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#6B7280] uppercase">Contrast Ratio</span>
            <span className="text-2xl font-extrabold font-mono text-[#6C63FF]">{ratioRounded} : 1</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <div className={`p-3 rounded-xl neu-convex-xs flex items-center justify-between ${passAANormal ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              <span>AA Normal Text</span>
              <span>{passAANormal ? 'Pass' : 'Fail'}</span>
            </div>
            <div className={`p-3 rounded-xl neu-convex-xs flex items-center justify-between ${passAALarge ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              <span>AA Large Text</span>
              <span>{passAALarge ? 'Pass' : 'Fail'}</span>
            </div>
            <div className={`p-3 rounded-xl neu-convex-xs flex items-center justify-between ${passAAANormal ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              <span>AAA Normal Text</span>
              <span>{passAAANormal ? 'Pass' : 'Fail'}</span>
            </div>
            <div className={`p-3 rounded-xl neu-convex-xs flex items-center justify-between ${passAAALarge ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              <span>AAA Large Text</span>
              <span>{passAAALarge ? 'Pass' : 'Fail'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Image Color Palette Extractor
export function ImageColorExtractorTool() {
  const [imageSrc, setImageSrc] = useState<string>('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop');
  const [extractedColors, setExtractedColors] = useState<Array<{ hex: string; percent: number; name: string }>>([
    { hex: '#D97706', percent: 34, name: 'Amber Gold' },
    { hex: '#4F46E5', percent: 26, name: 'Indigo Dream' },
    { hex: '#EC4899', percent: 18, name: 'Pink Rose' },
    { hex: '#059669', percent: 14, name: 'Emerald' },
    { hex: '#1E293B', percent: 8, name: 'Slate Dark' },
  ]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sampleImages = [
    { name: 'Art Painting', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop' },
    { name: 'Sunset Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop' },
    { name: 'Neon City', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const src = event.target?.result as string;
      setImageSrc(src);
      extractFromImage(src);
    };
    reader.readAsDataURL(file);
  };

  const extractFromImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 60;
      canvas.height = 60;
      ctx.drawImage(img, 0, 0, 60, 60);

      const imgData = ctx.getImageData(0, 0, 60, 60).data;
      const colorCounts: Record<string, number> = {};

      for (let i = 0; i < imgData.length; i += 16) {
        const r = Math.round(imgData[i] / 20) * 20;
        const g = Math.round(imgData[i + 1] / 20) * 20;
        const b = Math.round(imgData[i + 2] / 20) * 20;
        const hex =
          '#' +
          [r, g, b]
            .map(x => Math.min(255, x).toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const total = sorted.reduce((acc, curr) => acc + curr[1], 0) || 1;

      const formatted = sorted.map(([hex, count], idx) => ({
        hex,
        percent: Math.round((count / total) * 100),
        name: `Color ${idx + 1}`,
      }));

      setExtractedColors(formatted);
    };
    img.src = src;
  };

  const cssVars = `:root {\n${extractedColors.map((c, i) => `  --color-palette-${i + 1}: ${c.hex};`).join('\n')}\n}`;

  return (
    <div id="image-color-extractor-tool" className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl neu-convex-xs text-[#6C63FF] cursor-pointer flex items-center gap-1.5 font-bold">
            <Upload className="w-3.5 h-3.5" /> Upload Image / Logo
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <div className="hidden sm:flex items-center gap-1.5">
            {sampleImages.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setImageSrc(s.url);
                  extractFromImage(s.url);
                }}
                className="px-2.5 py-1 rounded-lg neu-convex-xs text-xs font-bold text-[#6B7280] hover:text-[#6C63FF] cursor-pointer"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={extractedColors.map(c => c.hex).join(', ')} label="Copy HEX List" />
          <CopyButton text={cssVars} label="Copy CSS Vars" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Preview */}
        <div className="lg:col-span-1 p-6 rounded-2xl neu-flat flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-extrabold uppercase text-[#6B7280] self-start">Source Image</span>
          <img
            src={imageSrc}
            alt="Source"
            className="max-h-48 max-w-full rounded-2xl object-cover shadow-lg border border-white/20"
          />
        </div>

        {/* Extracted Swatches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase text-[#6B7280] block">Dominant Color Swatches</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {extractedColors.map((color, idx) => (
                <div key={idx} className="p-3 rounded-2xl neu-flat space-y-2 text-center">
                  <div
                    style={{ backgroundColor: color.hex }}
                    className="h-16 rounded-xl shadow-inner border border-black/10 transition-transform hover:scale-105"
                  />
                  <div>
                    <div className="font-mono text-xs font-extrabold text-[#3D4852] dark:text-slate-100">
                      {color.hex}
                    </div>
                    <div className="text-[10px] font-bold text-[#6B7280]">{color.percent}% match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Palette Proportion Bar */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase">Color Distribution</span>
            <div className="h-4 rounded-xl overflow-hidden flex shadow-xs">
              {extractedColors.map((c, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: c.hex, width: `${c.percent}%` }}
                  title={`${c.hex}: ${c.percent}%`}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Color Blindness Simulator
export function ColorBlindnessTool() {
  const [hex, setHex] = useState('#6C63FF');

  const simulateBlindness = (hexCode: string, type: string) => {
    // Basic color transform approximation for simulation
    const r = parseInt(hexCode.slice(1, 3), 16) || 0;
    const g = parseInt(hexCode.slice(3, 5), 16) || 0;
    const b = parseInt(hexCode.slice(5, 7), 16) || 0;

    let nr = r, ng = g, nb = b;
    if (type === 'protanopia') {
      nr = 0.56667 * r + 0.43333 * g;
      ng = 0.55833 * r + 0.44167 * g;
      nb = 0.24167 * g + 0.75833 * b;
    } else if (type === 'deuteranopia') {
      nr = 0.625 * r + 0.375 * g;
      ng = 0.7 * r + 0.3 * g;
      nb = 0.3 * g + 0.7 * b;
    } else if (type === 'tritanopia') {
      nr = 0.95 * r + 0.05 * g;
      ng = 0.43333 * g + 0.56667 * b;
      nb = 0.475 * g + 0.525 * b;
    } else if (type === 'achromatopsia') {
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      nr = ng = nb = gray;
    }

    const toHex = (c: number) => Math.min(255, Math.max(0, Math.round(c))).toString(16).padStart(2, '0');
    return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`.toUpperCase();
  };

  const types = [
    { id: 'normal', name: 'Normal Vision', desc: 'Trichromacy' },
    { id: 'protanopia', name: 'Protanopia', desc: 'Red-blind (1% of men)' },
    { id: 'deuteranopia', name: 'Deuteranopia', desc: 'Green-blind (6% of men)' },
    { id: 'tritanopia', name: 'Tritanopia', desc: 'Blue-blind (Rare)' },
    { id: 'achromatopsia', name: 'Achromatopsia', desc: 'Total color blindness' },
  ];

  return (
    <div id="color-blindness-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl neu-flat">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">Select Base Color:</span>
          <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer" />
          <input
            type="text"
            value={hex}
            onChange={e => setHex(e.target.value)}
            className="w-28 px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-xs font-bold text-[#3D4852] dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {types.map(t => {
          const simColor = t.id === 'normal' ? hex : simulateBlindness(hex, t.id);
          return (
            <div key={t.id} className="p-5 rounded-2xl neu-flat space-y-3">
              <div style={{ backgroundColor: simColor }} className="h-24 rounded-xl shadow-inner transition-colors" />
              <div>
                <span className="text-xs font-bold text-[#3D4852] dark:text-white block">{t.name}</span>
                <span className="text-[10px] text-[#6B7280]">{t.desc}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-xs font-bold text-[#6C63FF]">{simColor}</span>
                <CopyButton text={simColor} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 7. Color Harmonies & Wheel Generator
export function ColorHarmoniesTool() {
  const [baseHex, setBaseHex] = useState('#6C63FF');

  const hexToHsl = (H: string) => {
    let r = parseInt(H.slice(1, 3), 16) / 255;
    let g = parseInt(H.slice(3, 5), 16) / 255;
    let b = parseInt(H.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    let a = s * Math.min(l, 1 - l);
    let f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    let toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
  };

  const [h, s, l] = hexToHsl(baseHex);

  const harmonies = [
    {
      name: 'Complementary',
      colors: [baseHex, hslToHex((h + 180) % 360, s, l)],
    },
    {
      name: 'Analogous',
      colors: [hslToHex((h + 330) % 360, s, l), baseHex, hslToHex((h + 30) % 360, s, l)],
    },
    {
      name: 'Triadic',
      colors: [baseHex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
    },
    {
      name: 'Tetradic',
      colors: [baseHex, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)],
    },
  ];

  return (
    <div id="color-harmonies-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl neu-flat">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">Select Key Color:</span>
          <input type="color" value={baseHex} onChange={e => setBaseHex(e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer" />
          <span className="font-mono text-xs font-bold text-[#3D4852] dark:text-white">{baseHex}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {harmonies.map(har => (
          <div key={har.name} className="p-6 rounded-2xl neu-flat space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3D4852] dark:text-white">{har.name}</span>
              <CopyButton text={har.colors.join(', ')} label="Copy Hexes" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {har.colors.map((c, i) => (
                <div key={i} className="space-y-1.5 text-center">
                  <div style={{ backgroundColor: c }} className="h-16 rounded-xl shadow-inner" />
                  <span className="font-mono text-[11px] font-bold text-[#6B7280]">{c}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Tailwind Shades Scale Generator (50 to 950)
export function TailwindColorTool() {
  const [brandColor, setBrandColor] = useState('#6C63FF');
  const [colorName, setColorName] = useState('brand');

  const shades = [
    { stop: '50', opacity: 0.95, tint: true },
    { stop: '100', opacity: 0.9, tint: true },
    { stop: '200', opacity: 0.75, tint: true },
    { stop: '300', opacity: 0.55, tint: true },
    { stop: '400', opacity: 0.3, tint: true },
    { stop: '500', opacity: 0, tint: false }, // base
    { stop: '600', opacity: 0.2, tint: false },
    { stop: '700', opacity: 0.4, tint: false },
    { stop: '800', opacity: 0.6, tint: false },
    { stop: '900', opacity: 0.8, tint: false },
    { stop: '950', opacity: 0.9, tint: false },
  ];

  const tailwindConfig = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${colorName}': {
          '50': '#f5f3ff',
          '100': '#ede9fe',
          '200': '#ddd6fe',
          '300': '#c4b5fd',
          '400': '#a78bfa',
          '500': '${brandColor}',
          '600': '#7c3aed',
          '700': '#6d28d9',
          '800': '#5b21b6',
          '900': '#4c1d95',
          '950': '#2e1065',
        }
      }
    }
  }
}`;

  return (
    <div id="tailwind-color-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl neu-flat">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">Primary Color:</span>
          <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer" />
          <input
            type="text"
            value={colorName}
            onChange={e => setColorName(e.target.value)}
            placeholder="Color Name"
            className="w-28 px-3 py-1.5 rounded-xl neu-pressed-deep text-xs font-bold text-[#3D4852] dark:text-white"
          />
        </div>
        <CopyButton text={tailwindConfig} label="Copy Tailwind Config" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Palette Steps</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
          {shades.map(s => (
            <div key={s.stop} className="p-2.5 rounded-xl neu-flat text-center space-y-2">
              <div
                style={{
                  backgroundColor: brandColor,
                  filter: s.tint ? `brightness(${1 + s.opacity * 0.8})` : `brightness(${1 - s.opacity * 0.7})`,
                }}
                className="h-14 rounded-lg shadow-inner"
              />
              <span className="text-xs font-bold text-[#3D4852] dark:text-white block">{s.stop}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 9. Color Shades & Tint Generator
export function ColorShadesTool() {
  const [baseHex, setBaseHex] = useState('#6C63FF');
  const [stepsCount, setStepsCount] = useState<number>(10);

  const hexToRgb = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.substring(0, 2), 16) || 0,
      parseInt(clean.substring(2, 4), 16) || 0,
      parseInt(clean.substring(4, 6), 16) || 0,
    ];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const [r, g, b] = hexToRgb(baseHex);

  // Tints (mix with white)
  const tints: { pct: number; hex: string }[] = [];
  for (let i = stepsCount; i >= 1; i--) {
    const factor = i / (stepsCount + 1);
    const tr = r + (255 - r) * factor;
    const tg = g + (255 - g) * factor;
    const tb = b + (255 - b) * factor;
    tints.push({ pct: Math.round(factor * 100), hex: rgbToHex(tr, tg, tb) });
  }

  // Shades (mix with black)
  const shades: { pct: number; hex: string }[] = [];
  for (let i = 1; i <= stepsCount; i++) {
    const factor = i / (stepsCount + 1);
    const sr = r * (1 - factor);
    const sg = g * (1 - factor);
    const sb = b * (1 - factor);
    shades.push({ pct: Math.round(factor * 100), hex: rgbToHex(sr, sg, sb) });
  }

  const allHexes = [...tints.map(t => t.hex), baseHex, ...shades.map(s => s.hex)].join(', ');

  return (
    <div id="color-shades-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl neu-flat">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">Base Color:</span>
          <input type="color" value={baseHex} onChange={e => setBaseHex(e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer" />
          <input
            type="text"
            value={baseHex}
            onChange={e => setBaseHex(e.target.value)}
            className="w-28 px-3 py-1.5 rounded-xl neu-pressed-deep font-mono text-xs font-bold text-[#3D4852] dark:text-white"
          />
        </div>
        <CopyButton text={allHexes} label="Copy All Hexes" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tints (Lighter) */}
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D4852] dark:text-white">
              Tints (+ White)
            </span>
            <span className="text-xs text-[#6B7280] font-bold">{tints.length} steps</span>
          </div>

          <div className="space-y-2">
            {tints.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl neu-pressed-sm">
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: t.hex }} className="w-8 h-8 rounded-lg shadow-sm" />
                  <span className="text-xs font-mono font-bold text-[#3D4852] dark:text-white">{t.hex}</span>
                </div>
                <span className="text-[11px] font-bold text-[#6B7280]">+{t.pct}% White</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shades (Darker) */}
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D4852] dark:text-white">
              Shades (+ Black)
            </span>
            <span className="text-xs text-[#6B7280] font-bold">{shades.length} steps</span>
          </div>

          <div className="space-y-2">
            {shades.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl neu-pressed-sm">
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: s.hex }} className="w-8 h-8 rounded-lg shadow-sm" />
                  <span className="text-xs font-mono font-bold text-[#3D4852] dark:text-white">{s.hex}</span>
                </div>
                <span className="text-[11px] font-bold text-[#6B7280]">+{s.pct}% Black</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. Multi-Stop Color Blender
export function ColorBlenderTool() {
  const [color1, setColor1] = useState('#6C63FF');
  const [color2, setColor2] = useState('#38B2AC');
  const [steps, setSteps] = useState<number>(7);

  const hexToRgb = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.substring(0, 2), 16) || 0,
      parseInt(clean.substring(2, 4), 16) || 0,
      parseInt(clean.substring(4, 6), 16) || 0,
    ];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  const blendedColors: string[] = [];
  for (let i = 0; i < steps; i++) {
    const factor = i / (steps - 1);
    const r = r1 + (r2 - r1) * factor;
    const g = g1 + (g2 - g1) * factor;
    const b = b1 + (b2 - b1) * factor;
    blendedColors.push(rgbToHex(r, g, b));
  }

  const gradientCss = `background: linear-gradient(90deg, ${blendedColors.join(', ')});`;

  return (
    <div id="color-blender-tool" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl neu-flat">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">Start Color:</span>
          <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer" />
          <span className="font-mono text-xs font-bold text-[#3D4852] dark:text-white">{color1}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">End Color:</span>
          <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer" />
          <span className="font-mono text-xs font-bold text-[#3D4852] dark:text-white">{color2}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#6B7280]">Steps: {steps}</span>
          <input
            type="range"
            min={3}
            max={15}
            value={steps}
            onChange={e => setSteps(parseInt(e.target.value))}
            className="w-full accent-[#6C63FF]"
          />
        </div>
      </div>

      <div
        style={{ background: `linear-gradient(90deg, ${color1}, ${color2})` }}
        className="h-20 rounded-2xl shadow-md"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-[#6B7280]">Interpolated Swatches ({steps})</span>
          <CopyButton text={blendedColors.join(', ')} label="Copy Array" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {blendedColors.map((c, i) => (
            <div key={i} className="p-3 rounded-xl neu-flat text-center space-y-2">
              <div style={{ backgroundColor: c }} className="h-14 rounded-lg shadow-inner" />
              <span className="text-xs font-mono font-bold text-[#3D4852] dark:text-white block">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

