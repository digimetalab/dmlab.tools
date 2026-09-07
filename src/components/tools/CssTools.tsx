import React, { useState } from 'react';
import { CopyButton } from './TextTools';
import { Plus, Trash2, Sliders, RefreshCw, Eye, Download, Code } from 'lucide-react';

// 1. CSS Box Shadow Generator
export function BoxShadowTool() {
  const [layers, setLayers] = useState([
    { x: 0, y: 10, blur: 25, spread: -5, color: '#000000', opacity: 0.15, inset: false },
    { x: 0, y: 8, blur: 10, spread: -6, color: '#000000', opacity: 0.1, inset: false },
  ]);
  const [boxBg, setBoxBg] = useState('#F5F5F7');
  const [previewBg, setPreviewBg] = useState('#F5F5F7');

  const hexToRgba = (hex: string, op: number) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${op})`;
  };

  const shadowCss = layers
    .map(
      l =>
        `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`
    )
    .join(', ');

  const cssRule = `box-shadow: ${shadowCss};`;

  const presets = [
    {
      name: 'Smooth Clean',
      layers: [
        { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false },
        { x: 0, y: 2, blur: 4, spread: -2, color: '#000000', opacity: 0.1, inset: false },
      ],
    },
    {
      name: 'Deep Floating',
      layers: [
        { x: 0, y: 20, blur: 25, spread: -5, color: '#000000', opacity: 0.2, inset: false },
        { x: 0, y: 8, blur: 10, spread: -6, color: '#000000', opacity: 0.15, inset: false },
      ],
    },
    {
      name: 'Neon Glow',
      layers: [
        { x: 0, y: 0, blur: 20, spread: 2, color: '#6c63ff', opacity: 0.5, inset: false },
        { x: 0, y: 0, blur: 40, spread: 10, color: '#38b2ac', opacity: 0.25, inset: false },
      ],
    },
    {
      name: 'Soft Inset',
      layers: [
        { x: 0, y: 4, blur: 8, spread: 0, color: '#000000', opacity: 0.15, inset: true },
        { x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 0.08, inset: true },
      ],
    },
  ];

  return (
    <div id="box-shadow-tool" className="space-y-6">
      {/* Live Canvas Preview */}
      <div
        className="h-64 rounded-[28px] flex items-center justify-center transition-colors neu-pressed-deep"
      >
        <div
          className="w-52 h-36 rounded-2xl flex items-center justify-center text-sm font-extrabold text-[#3D4852] dark:text-slate-100 transition-all font-display"
          style={{
            backgroundColor: boxBg,
            boxShadow: shadowCss,
          }}
        >
          DMLab Shadow
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layer Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">Shadow Layers ({layers.length})</span>
            <button
              type="button"
              onClick={() =>
                setLayers(prev => [
                  ...prev,
                  { x: 0, y: 8, blur: 16, spread: 0, color: '#000000', opacity: 0.15, inset: false },
                ])
              }
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold neu-convex-xs text-[#6C63FF] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Layer
            </button>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {layers.map((layer, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl neu-flat space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#3D4852] dark:text-slate-200">
                  <span>Layer #{idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={layer.inset}
                        onChange={e => {
                          const updated = [...layers];
                          updated[idx].inset = e.target.checked;
                          setLayers(updated);
                        }}
                        className="rounded text-[#6C63FF]"
                      />
                      <span>Inset</span>
                    </label>
                    {layers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setLayers(layers.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-[#6B7280]">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Offset X: {layer.x}px</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={layer.x}
                      onChange={e => {
                        const updated = [...layers];
                        updated[idx].x = parseInt(e.target.value);
                        setLayers(updated);
                      }}
                      className="w-full accent-[#6C63FF]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Offset Y: {layer.y}px</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={layer.y}
                      onChange={e => {
                        const updated = [...layers];
                        updated[idx].y = parseInt(e.target.value);
                        setLayers(updated);
                      }}
                      className="w-full accent-[#6C63FF]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Blur: {layer.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={layer.blur}
                      onChange={e => {
                        const updated = [...layers];
                        updated[idx].blur = parseInt(e.target.value);
                        setLayers(updated);
                      }}
                      className="w-full accent-[#6C63FF]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Spread: {layer.spread}px</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={layer.spread}
                      onChange={e => {
                        const updated = [...layers];
                        updated[idx].spread = parseInt(e.target.value);
                        setLayers(updated);
                      }}
                      className="w-full accent-[#6C63FF]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-[#6B7280] pt-1">
                  <div className="flex items-center gap-2">
                    <span>Color:</span>
                    <input
                      type="color"
                      value={layer.color}
                      onChange={e => {
                        const updated = [...layers];
                        updated[idx].color = e.target.value;
                        setLayers(updated);
                      }}
                      className="w-7 h-7 rounded-lg border-none cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span>Opacity: {Math.round(layer.opacity * 100)}%</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={layer.opacity}
                      onChange={e => {
                        const updated = [...layers];
                        updated[idx].opacity = parseFloat(e.target.value);
                        setLayers(updated);
                      }}
                      className="w-full accent-[#6C63FF]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Presets & Code Output */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase text-[#6B7280] mb-2 block">Curated Presets</span>
            <div className="grid grid-cols-2 gap-2.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLayers(p.layers)}
                  className="p-3.5 rounded-2xl neu-convex-xs text-left text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] transition-colors cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#6B7280]">Generated CSS</span>
              <CopyButton text={cssRule} label="Copy CSS" />
            </div>
            <pre className="p-5 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
              <code>{cssRule}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. CSS Gradient Generator
export function GradientGeneratorTool() {
  const [type, setType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { color: '#6c63ff', pos: 0 },
    { color: '#38b2ac', pos: 100 },
  ]);

  const stopsStr = stops.map(s => `${s.color} ${s.pos}%`).join(', ');
  let gradientCss = '';
  if (type === 'linear') {
    gradientCss = `linear-gradient(${angle}deg, ${stopsStr})`;
  } else if (type === 'radial') {
    gradientCss = `radial-gradient(circle, ${stopsStr})`;
  } else {
    gradientCss = `conic-gradient(from ${angle}deg, ${stopsStr})`;
  }

  const cssRule = `background: ${gradientCss};`;

  const presetGradients = [
    { name: 'Aurora Velvet', type: 'linear' as const, angle: 135, stops: [{ color: '#6C63FF', pos: 0 }, { color: '#38B2AC', pos: 100 }] },
    { name: 'Ocean Dusk', type: 'linear' as const, angle: 90, stops: [{ color: '#06B6D4', pos: 0 }, { color: '#3B82F6', pos: 100 }] },
    { name: 'Emerald Wave', type: 'linear' as const, angle: 45, stops: [{ color: '#10B981', pos: 0 }, { color: '#047857', pos: 100 }] },
    { name: 'Sunset Radial', type: 'radial' as const, angle: 0, stops: [{ color: '#F59E0B', pos: 0 }, { color: '#EF4444', pos: 100 }] },
  ];

  return (
    <div id="gradient-generator-tool" className="space-y-6">
      {/* Preview Card */}
      <div
        className="h-56 rounded-[28px] flex items-center justify-center shadow-lg border border-white/20 transition-all"
        style={{ background: gradientCss }}
      >
        <div className="px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md text-white font-mono text-xs font-extrabold shadow-sm">
          {gradientCss}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div className="flex items-center justify-between">
            <span className="uppercase">Gradient Type</span>
            <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
              {(['linear', 'radial', 'conic'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    type === t ? 'neu-tab-active' : 'text-[#6B7280] hover:text-[#3D4852]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {type !== 'radial' && (
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Angle: {angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={e => setAngle(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>
          )}

          {/* Color Stops */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="uppercase">Color Stops ({stops.length})</span>
              {stops.length < 5 && (
                <button
                  type="button"
                  onClick={() => setStops([...stops, { color: '#8B84FF', pos: 50 }])}
                  className="text-xs text-[#6C63FF] font-extrabold cursor-pointer"
                >
                  + Add Stop
                </button>
              )}
            </div>

            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <input
                  type="color"
                  value={stop.color}
                  onChange={e => {
                    const next = [...stops];
                    next[i].color = e.target.value;
                    setStops(next);
                  }}
                  className="w-7 h-7 rounded-lg border-none cursor-pointer shrink-0"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.pos}
                  onChange={e => {
                    const next = [...stops];
                    next[i].pos = parseInt(e.target.value);
                    setStops(next);
                  }}
                  className="w-full accent-[#6C63FF]"
                />
                <span className="w-10 font-mono text-[#6B7280]">{stop.pos}%</span>
                {stops.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setStops(stops.filter((_, idx) => idx !== i))}
                    className="text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Presets & CSS */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">Quick Presets</span>
            <div className="grid grid-cols-2 gap-2.5">
              {presetGradients.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setType(p.type);
                    setAngle(p.angle);
                    setStops(p.stops);
                  }}
                  className="p-3 rounded-2xl neu-convex-xs text-left text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] flex items-center gap-2.5 cursor-pointer"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${p.stops.map(s => `${s.color} ${s.pos}%`).join(', ')})`,
                    }}
                  />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#6B7280]">CSS Output</span>
              <CopyButton text={cssRule} label="Copy CSS" />
            </div>
            <pre className="p-5 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
              <code>{cssRule}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Glassmorphism Generator
export function GlassmorphismTool() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.25);
  const [saturation, setSaturation] = useState(180);
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderOpacity, setBorderOpacity] = useState(0.3);

  const glassStyle = {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
  };

  const cssCode = `/* Glassmorphism CSS */
background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: ${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
border-radius: 24px;`;

  return (
    <div id="glassmorphism-tool" className="space-y-6">
      {/* Background Graphic Canvas */}
      <div className="relative h-64 rounded-[28px] overflow-hidden flex items-center justify-center bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-6">
        <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-cyan-400/80 filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-yellow-300/80 filter blur-xl animate-pulse"></div>

        <div style={glassStyle} className="relative z-10 p-6 rounded-2xl max-w-sm text-center text-white shadow-2xl">
          <h4 className="text-lg font-extrabold font-display">Frosted Glass</h4>
          <p className="text-xs text-white/90 mt-1 font-medium">
            Modern UI aesthetic with hardware-accelerated CSS backdrop-filter.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div>
            <div className="flex justify-between mb-1">
              <span>Blur: {blur}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={blur}
              onChange={e => setBlur(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Transparency: {Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.9}
              step={0.01}
              value={opacity}
              onChange={e => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Saturation: {saturation}%</span>
            </div>
            <input
              type="range"
              min={100}
              max={250}
              value={saturation}
              onChange={e => setSaturation(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Border Opacity: {Math.round(borderOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={borderOpacity}
              onChange={e => setBorderOpacity(parseFloat(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">CSS Code</span>
            <CopyButton text={cssCode} label="Copy CSS" />
          </div>
          <pre className="p-5 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <code>{cssCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// 4. Neumorphism Soft UI Generator
export function NeumorphismTool() {
  const [size, setSize] = useState(160);
  const [radius, setRadius] = useState(32);
  const [distance, setDistance] = useState(9);
  const [blur, setBlur] = useState(16);
  const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
  const [bgColor, setBgColor] = useState('#F5F5F7');

  const cssStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${radius}px`,
    backgroundColor: bgColor,
    boxShadow:
      shape === 'pressed'
        ? `inset ${distance}px ${distance}px ${blur}px rgb(163,177,198,0.6), inset -${distance}px -${distance}px ${blur}px rgba(255,255,255,0.5)`
        : `${distance}px ${distance}px ${blur}px rgb(163,177,198,0.6), -${distance}px -${distance}px ${blur}px rgba(255,255,255,0.5)`,
    background:
      shape === 'convex'
        ? `linear-gradient(145deg, #f0f5fc, #d5dae2)`
        : shape === 'concave'
        ? `linear-gradient(145deg, #d5dae2, #f0f5fc)`
        : bgColor,
  };

  const cssSnippet = `border-radius: ${radius}px;
background: ${bgColor};
box-shadow: ${
    shape === 'pressed'
      ? `inset ${distance}px ${distance}px ${blur}px rgb(163,177,198,0.6), inset -${distance}px -${distance}px ${blur}px rgba(255,255,255,0.5);`
      : `${distance}px ${distance}px ${blur}px rgb(163,177,198,0.6), -${distance}px -${distance}px ${blur}px rgba(255,255,255,0.5);`
  }`;

  return (
    <div id="neumorphism-tool" className="space-y-6">
      <div
        className="h-64 rounded-[32px] flex items-center justify-center neu-pressed-deep transition-colors"
      >
        <div style={cssStyle} className="flex items-center justify-center font-display font-extrabold text-[#3D4852] select-none text-base">
          Soft UI
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#3D4852] dark:text-slate-200">Shape Variant</span>
            <div className="flex items-center gap-1.5 neu-pressed-deep p-1 rounded-xl">
              {(['flat', 'concave', 'convex', 'pressed'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShape(s)}
                  className={`px-3 py-1 rounded-lg capitalize font-bold text-xs transition-all cursor-pointer ${
                    shape === s ? 'neu-convex text-[#6C63FF]' : 'text-[#6B7280]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-semibold text-[#6B7280]">
              <span>Distance: {distance}px</span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              value={distance}
              onChange={e => setDistance(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-semibold text-[#6B7280]">
              <span>Blur: {blur}px</span>
            </div>
            <input
              type="range"
              min={4}
              max={40}
              value={blur}
              onChange={e => setBlur(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-semibold text-[#6B7280]">
              <span>Border Radius: {radius}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={size / 2}
              value={radius}
              onChange={e => setRadius(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#6B7280]">CSS Snippet</span>
            <CopyButton text={cssSnippet} label="Copy CSS" />
          </div>
          <pre className="p-5 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <code>{cssSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// 5. Border Radius Generator
export function BorderRadiusTool() {
  const [tl, setTl] = useState(30);
  const [tr, setTr] = useState(70);
  const [br, setBr] = useState(70);
  const [bl, setBl] = useState(30);
  const [t2, setT2] = useState(30);
  const [r2, setR2] = useState(30);
  const [b2, setB2] = useState(70);
  const [l2, setL2] = useState(70);
  const [is8Point, setIs8Point] = useState(true);

  const radiusStr = is8Point
    ? `${tl}% ${tr}% ${br}% ${bl}% / ${t2}% ${r2}% ${b2}% ${l2}%`
    : `${tl}% ${tr}% ${br}% ${bl}%`;
  const cssRule = `border-radius: ${radiusStr};`;

  const organicPresets = [
    { name: 'Organic Egg', vals: [50, 50, 50, 50, 60, 60, 40, 40] },
    { name: 'Water Droplet', vals: [50, 50, 50, 50, 30, 80, 20, 80] },
    { name: 'Smooth Blob', vals: [30, 70, 70, 30, 30, 30, 70, 70] },
    { name: 'Pebble Stone', vals: [60, 40, 30, 70, 60, 30, 70, 40] },
    { name: 'Shield Badge', vals: [50, 50, 50, 50, 20, 20, 80, 80] },
    { name: 'Leaf Petal', vals: [0, 100, 0, 100, 0, 100, 0, 100] },
  ];

  const applyPreset = (vals: number[]) => {
    setIs8Point(true);
    setTl(vals[0]);
    setTr(vals[1]);
    setBr(vals[2]);
    setBl(vals[3]);
    setT2(vals[4]);
    setR2(vals[5]);
    setB2(vals[6]);
    setL2(vals[7]);
  };

  return (
    <div id="border-radius-tool" className="space-y-6">
      <div className="h-64 rounded-[28px] flex items-center justify-center neu-pressed-deep">
        <div
          style={{ borderRadius: radiusStr }}
          className="w-48 h-48 bg-gradient-to-tr from-[#6C63FF] to-[#38B2AC] shadow-xl flex items-center justify-center text-white font-extrabold text-sm transition-all duration-300 font-display"
        >
          Organic Shape
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div className="flex items-center justify-between">
            <span className="text-[#3D4852] dark:text-slate-200 uppercase block">Mode & Presets</span>
            <button
              type="button"
              onClick={() => setIs8Point(!is8Point)}
              className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                is8Point ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
              }`}
            >
              {is8Point ? '8-Point Full Axis' : '4-Corner Standard'}
            </button>
          </div>

          <div>
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider block mb-2">Presets</span>
            <div className="grid grid-cols-3 gap-2">
              {organicPresets.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p.vals)}
                  className="px-2.5 py-1.5 rounded-xl neu-convex-xs text-[11px] font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] transition-colors cursor-pointer text-center truncate"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#3D4852] dark:text-slate-200">
              {is8Point ? 'Horizontal Axis Radii (Top / Right / Bottom / Left)' : 'Corner Radii'}
            </span>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <span>Top-Left: {tl}%</span>
                <input type="range" min={0} max={100} value={tl} onChange={e => setTl(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
              </div>
              <div>
                <span>Top-Right: {tr}%</span>
                <input type="range" min={0} max={100} value={tr} onChange={e => setTr(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
              </div>
              <div>
                <span>Bottom-Right: {br}%</span>
                <input type="range" min={0} max={100} value={br} onChange={e => setBr(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
              </div>
              <div>
                <span>Bottom-Left: {bl}%</span>
                <input type="range" min={0} max={100} value={bl} onChange={e => setBl(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
              </div>
            </div>

            {is8Point && (
              <div className="pt-2 space-y-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-[#3D4852] dark:text-slate-200">
                  Vertical Axis Radii (Top / Right / Bottom / Left)
                </span>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <span>V-Top: {t2}%</span>
                    <input type="range" min={0} max={100} value={t2} onChange={e => setT2(parseInt(e.target.value))} className="w-full accent-[#38B2AC]" />
                  </div>
                  <div>
                    <span>V-Right: {r2}%</span>
                    <input type="range" min={0} max={100} value={r2} onChange={e => setR2(parseInt(e.target.value))} className="w-full accent-[#38B2AC]" />
                  </div>
                  <div>
                    <span>V-Bottom: {b2}%</span>
                    <input type="range" min={0} max={100} value={b2} onChange={e => setB2(parseInt(e.target.value))} className="w-full accent-[#38B2AC]" />
                  </div>
                  <div>
                    <span>V-Left: {l2}%</span>
                    <input type="range" min={0} max={100} value={l2} onChange={e => setL2(parseInt(e.target.value))} className="w-full accent-[#38B2AC]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">CSS Code</span>
            <CopyButton text={cssRule} label="Copy CSS" />
          </div>
          <pre className="p-5 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <code>{cssRule}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// 6. CSS Clip-Path Maker
export function ClipPathTool() {
  const [shape, setShape] = useState<string>('hexagon');

  const shapesMap: Record<string, string> = {
    triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    octagon: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
    star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    cross: 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)',
    bubble: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
    arrow: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
    rhombus: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    chevron: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
    parallelogram: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
    tag: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)',
  };

  const clipPathValue = shapesMap[shape] || shapesMap.hexagon;
  const cssRule = `clip-path: ${clipPathValue};`;

  return (
    <div id="clip-path-tool" className="space-y-6">
      <div className="h-64 rounded-[28px] flex items-center justify-center neu-pressed-deep">
        <div
          style={{ clipPath: clipPathValue }}
          className="w-52 h-52 bg-gradient-to-tr from-[#38B2AC] via-[#6C63FF] to-[#8B84FF] flex items-center justify-center text-white font-extrabold text-sm shadow-md transition-all duration-300 font-display"
        >
          Clip Path
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-3">
          <span className="text-xs font-extrabold uppercase text-[#6B7280]">Geometric Shapes ({Object.keys(shapesMap).length})</span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Object.keys(shapesMap).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setShape(s)}
                className={`p-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer truncate ${
                  shape === s
                    ? 'neu-pressed text-[#6C63FF]'
                    : 'neu-convex-xs text-[#3D4852] dark:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">CSS Rule</span>
            <CopyButton text={cssRule} label="Copy CSS" />
          </div>
          <pre className="p-5 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <code>{cssRule}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// 7. SVG Wave & Blob Generator
export function WaveBlobTool() {
  const [type, setType] = useState<'wave' | 'blob'>('wave');
  const [complexity, setComplexity] = useState(4);
  const [color, setColor] = useState('#6C63FF');
  const [color2, setColor2] = useState('#38B2AC');
  const [useGradient, setUseGradient] = useState(true);
  const [layers, setLayers] = useState<number>(2);
  const [seed, setSeed] = useState<number>(42);

  // Organic wave calculation with seed
  const generateWave = (layerIdx: number) => {
    const offset = layerIdx * 15;
    const amp = (complexity * 7) + (layerIdx * 8);
    const y1 = 50 + offset + Math.sin(seed + layerIdx) * 10;
    const y2 = 70 + offset - Math.cos(seed + layerIdx * 2) * 10;
    return `M 0,${y1} Q 250,${y1 - amp} 500,${y1} T 1000,${y1} L 1000,160 L 0,160 Z`;
  };

  // Organic blob path generator
  const generateBlob = () => {
    const points = 6;
    const radius = 70;
    const center = 100;
    const step = (Math.PI * 2) / points;
    let path = '';

    for (let i = 0; i < points; i++) {
      const angle = i * step;
      const variation = Math.sin(seed * (i + 1) * 0.7) * (complexity * 4.5);
      const r = radius + variation;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      if (i === 0) {
        path += `M ${x.toFixed(1)},${y.toFixed(1)}`;
      } else {
        const prevAngle = (i - 1) * step;
        const prevVar = Math.sin(seed * i * 0.7) * (complexity * 4.5);
        const prevR = radius + prevVar;
        const cpAngle = prevAngle + step / 2;
        const cpR = (prevR + r) / 2 + 10;
        const cpx = center + cpR * Math.cos(cpAngle);
        const cpy = center + cpR * Math.sin(cpAngle);
        path += ` Q ${cpx.toFixed(1)},${cpy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
      }
    }
    path += ' Z';
    return path;
  };

  const wavePaths = Array.from({ length: layers }).map((_, i) => generateWave(i));
  const blobPath = generateBlob();

  const fillDef = useGradient
    ? `<defs><linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${color2}"/></linearGradient></defs>`
    : '';

  const fillRef = useGradient ? 'url(#waveGrad)' : color;

  const svgString =
    type === 'wave'
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 160">\n  ${fillDef}\n  ${wavePaths
          .map((p, idx) => `<path d="${p}" fill="${fillRef}" opacity="${1 - idx * 0.35}"/>`)
          .join('\n  ')}\n</svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">\n  ${fillDef}\n  <path d="${blobPath}" fill="${fillRef}"/>\n</svg>`;

  const handleDownloadSvg = () => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-shape-${seed}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="wave-blob-tool" className="space-y-6">
      <div className="h-64 rounded-[28px] flex items-center justify-center neu-pressed-deep overflow-hidden p-6">
        {type === 'wave' ? (
          <div className="w-full h-full flex items-end" dangerouslySetInnerHTML={{ __html: svgString }} />
        ) : (
          <div className="w-52 h-52 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgString }} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div className="flex items-center justify-between">
            <span className="text-[#3D4852] dark:text-slate-200">Generator Mode</span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl neu-pressed-sm">
              <button
                type="button"
                onClick={() => setType('wave')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${type === 'wave' ? 'neu-tab-active' : 'text-[#6B7280]'}`}
              >
                Wave Divider
              </button>
              <button
                type="button"
                onClick={() => setType('blob')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${type === 'blob' ? 'neu-tab-active' : 'text-[#6B7280]'}`}
              >
                Organic Blob
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Curvature / Complexity: {complexity}</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={complexity}
              onChange={e => setComplexity(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          {type === 'wave' && (
            <div>
              <div className="flex justify-between mb-1">
                <span>Wave Layers: {layers}</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                value={layers}
                onChange={e => setLayers(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer" />
              {useGradient && (
                <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer" />
              )}
              <label className="flex items-center gap-1 cursor-pointer text-xs ml-1">
                <input type="checkbox" checked={useGradient} onChange={e => setUseGradient(e.target.checked)} className="rounded" />
                <span>Gradient</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setSeed(Math.floor(Math.random() * 10000))}
              className="px-3 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#6C63FF] hover:opacity-80 transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Randomize
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">SVG Output</span>
            <div className="flex items-center gap-2">
              <CopyButton text={svgString} label="Copy SVG" />
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="px-3 py-1.5 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> .svg
              </button>
            </div>
          </div>
          <pre className="p-5 rounded-2xl neu-pressed-deep text-[#3D4852] dark:text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-48">
            <code>{svgString}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// 8. CSS Triangle Generator
export function CssTriangleTool() {
  const [direction, setDirection] = useState<'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top');
  const [width, setWidth] = useState<number>(60);
  const [height, setHeight] = useState<number>(60);
  const [color, setColor] = useState<string>('#6C63FF');

  const getTriangleStyles = () => {
    const halfW = width / 2;
    const halfH = height / 2;

    switch (direction) {
      case 'top':
        return {
          width: 0,
          height: 0,
          borderLeft: `${halfW}px solid transparent`,
          borderRight: `${halfW}px solid transparent`,
          borderBottom: `${height}px solid ${color}`,
        };
      case 'bottom':
        return {
          width: 0,
          height: 0,
          borderLeft: `${halfW}px solid transparent`,
          borderRight: `${halfW}px solid transparent`,
          borderTop: `${height}px solid ${color}`,
        };
      case 'left':
        return {
          width: 0,
          height: 0,
          borderTop: `${halfH}px solid transparent`,
          borderBottom: `${halfH}px solid transparent`,
          borderRight: `${width}px solid ${color}`,
        };
      case 'right':
        return {
          width: 0,
          height: 0,
          borderTop: `${halfH}px solid transparent`,
          borderBottom: `${halfH}px solid transparent`,
          borderLeft: `${width}px solid ${color}`,
        };
      case 'top-left':
        return {
          width: 0,
          height: 0,
          borderTop: `${height}px solid ${color}`,
          borderRight: `${width}px solid transparent`,
        };
      case 'top-right':
        return {
          width: 0,
          height: 0,
          borderTop: `${height}px solid ${color}`,
          borderLeft: `${width}px solid transparent`,
        };
      case 'bottom-left':
        return {
          width: 0,
          height: 0,
          borderBottom: `${height}px solid ${color}`,
          borderRight: `${width}px solid transparent`,
        };
      case 'bottom-right':
        return {
          width: 0,
          height: 0,
          borderBottom: `${height}px solid ${color}`,
          borderLeft: `${width}px solid transparent`,
        };
    }
  };

  const styleObj = getTriangleStyles();
  const cssCode = `width: 0;\nheight: 0;\n${Object.entries(styleObj)
    .filter(([k]) => k.startsWith('border'))
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
    .join('\n')}`;

  return (
    <div id="css-triangle-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5 p-6 rounded-2xl neu-flat">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Direction</span>
            <div className="grid grid-cols-4 gap-2">
              {(['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all ${
                    direction === d ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-[#6B7280]">Width: {width}px</span>
              <input type="range" min={10} max={150} value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#6B7280]">Height: {height}px</span>
              <input type="range" min={10} max={150} value={height} onChange={e => setHeight(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#6B7280]">Color:</span>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
            <span className="text-xs font-mono font-bold text-[#3D4852] dark:text-white">{color}</span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#6B7280]">Generated CSS</span>
              <CopyButton text={cssCode} label="Copy CSS" />
            </div>
            <pre className="p-4 rounded-xl neu-pressed-deep text-xs font-mono text-[#3D4852] dark:text-slate-100">
              <code>{cssCode}</code>
            </pre>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-12 rounded-3xl neu-pressed-deep min-h-[300px]">
          <div style={styleObj as any} className="transition-all duration-200" />
        </div>
      </div>
    </div>
  );
}

// 9. CSS Switch / Toggle Generator
export function CssSwitchTool() {
  const [active, setActive] = useState(true);
  const [activeColor, setActiveColor] = useState('#6C63FF');
  const [inactiveColor, setInactiveColor] = useState('#cbd5e1');
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(32);
  const [radius, setRadius] = useState(32);

  const knobSize = height - 8;

  const cssCode = `/* Switch Container */
.switch {
  position: relative;
  display: inline-block;
  width: ${width}px;
  height: ${height}px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; cursor: pointer; inset: 0;
  background-color: ${inactiveColor};
  border-radius: ${radius}px;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slider:before {
  position: absolute; content: "";
  height: ${knobSize}px; width: ${knobSize}px;
  left: 4px; bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
}
input:checked + .slider { background-color: ${activeColor}; }
input:checked + .slider:before {
  transform: translateX(${width - height}px);
}`;

  return (
    <div id="css-switch-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Toggle Colors</span>
            <div className="flex items-center gap-3">
              <input type="color" value={activeColor} onChange={e => setActiveColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
              <input type="color" value={inactiveColor} onChange={e => setInactiveColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-[#6B7280]">Width: {width}px</span>
              <input type="range" min={40} max={100} value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#6B7280]">Height: {height}px</span>
              <input type="range" min={24} max={50} value={height} onChange={e => setHeight(parseInt(e.target.value))} className="w-full accent-[#6C63FF]" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#6B7280]">CSS Snippet</span>
              <CopyButton text={cssCode} label="Copy Switch CSS" />
            </div>
            <pre className="p-4 rounded-xl neu-pressed-deep text-xs font-mono text-[#3D4852] dark:text-slate-100 max-h-56 overflow-y-auto">
              <code>{cssCode}</code>
            </pre>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-12 rounded-3xl neu-pressed-deep space-y-4">
          <span className="text-xs font-bold text-[#6B7280]">Interactive Preview (Click to toggle):</span>
          <button
            type="button"
            onClick={() => setActive(!active)}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              borderRadius: `${radius}px`,
              backgroundColor: active ? activeColor : inactiveColor,
            }}
            className="relative cursor-pointer transition-colors shadow-inner flex items-center p-1"
          >
            <div
              style={{
                width: `${knobSize}px`,
                height: `${knobSize}px`,
                transform: active ? `translateX(${width - height}px)` : 'translateX(0px)',
              }}
              className="bg-white rounded-full shadow-md transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// 10. Cubic-Bezier & Easing Generator
export function CubicBezierTool() {
  const [p1, setP1] = useState(0.25);
  const [p2, setP2] = useState(0.1);
  const [p3, setP3] = useState(0.25);
  const [p4, setP4] = useState(1.0);
  const [isAnimating, setIsAnimating] = useState(false);

  const bezierStr = `cubic-bezier(${p1}, ${p2}, ${p3}, ${p4})`;

  const presets = [
    { name: 'Ease In Out', vals: [0.42, 0, 0.58, 1] },
    { name: 'Ease Out Back (Bounce)', vals: [0.34, 1.56, 0.64, 1] },
    { name: 'Snappy Elastic', vals: [0.68, -0.6, 0.32, 1.6] },
    { name: 'Fast Ease Out', vals: [0, 0, 0.2, 1] },
  ];

  const triggerAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 20);
  };

  return (
    <div id="cubic-bezier-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map(pr => (
                <button
                  key={pr.name}
                  type="button"
                  onClick={() => {
                    setP1(pr.vals[0]);
                    setP2(pr.vals[1]);
                    setP3(pr.vals[2]);
                    setP4(pr.vals[3]);
                  }}
                  className="px-2.5 py-1 rounded-lg neu-convex-xs text-xs font-bold text-[#6C63FF] cursor-pointer"
                >
                  {pr.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'X1', val: p1, set: setP1 },
              { label: 'Y1', val: p2, set: setP2 },
              { label: 'X2', val: p3, set: setP3 },
              { label: 'Y2', val: p4, set: setP4 },
            ].map(param => (
              <div key={param.label}>
                <span className="text-xs font-bold text-[#6B7280]">{param.label}: {param.val}</span>
                <input
                  type="range"
                  min={param.label.startsWith('Y') ? -1 : 0}
                  max={param.label.startsWith('Y') ? 2 : 1}
                  step={0.05}
                  value={param.val}
                  onChange={e => param.set(parseFloat(e.target.value))}
                  className="w-full accent-[#6C63FF]"
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <CopyButton text={`transition: all 0.8s ${bezierStr};`} label="Copy Transition CSS" />
          </div>
        </div>

        <div className="p-8 rounded-3xl neu-pressed-deep space-y-6 flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-[#6C63FF]">{bezierStr}</span>
            <button
              type="button"
              onClick={triggerAnimation}
              className="px-3 py-1.5 rounded-xl neu-btn-primary text-xs font-bold cursor-pointer"
            >
              Play Animation
            </button>
          </div>

          <div className="h-12 bg-white/40 dark:bg-black/20 rounded-xl p-2 relative overflow-hidden">
            <div
              style={{
                transition: `transform 1s ${bezierStr}`,
                transform: isAnimating ? 'translateX(260px)' : 'translateX(0px)',
              }}
              className="w-8 h-8 rounded-lg bg-[#6C63FF] shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 11. CSS Text Glitch Effect Generator
export function TextGlitchTool() {
  const [text, setText] = useState('CYBERPUNK 2077');
  const [color1, setColor1] = useState('#ff0055');
  const [color2, setColor2] = useState('#00e5ff');

  const cssSnippet = `@keyframes glitch {
  0% { text-shadow: 2px 2px ${color1}, -2px -2px ${color2}; }
  25% { text-shadow: -2px 2px ${color1}, 2px -2px ${color2}; }
  50% { text-shadow: 2px -2px ${color1}, -2px 2px ${color2}; }
  75% { text-shadow: -2px -2px ${color1}, 2px 2px ${color2}; }
  100% { text-shadow: 2px 2px ${color1}, -2px -2px ${color2}; }
}
.glitch-text {
  animation: glitch 0.3s infinite;
}`;

  return (
    <div id="text-glitch-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Glitch Headline</span>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl neu-pressed-deep text-sm font-bold text-[#3D4852] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7280]">Shadow 1:</span>
              <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7280]">Shadow 2:</span>
              <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            </div>
          </div>

          <div className="pt-2">
            <CopyButton text={cssSnippet} label="Copy Glitch Animation CSS" />
          </div>
        </div>

        <div className="p-12 rounded-3xl neu-pressed-deep flex items-center justify-center min-h-[220px]">
          <h2
            style={{
              textShadow: `2px 2px ${color1}, -2px -2px ${color2}`,
            }}
            className="text-4xl font-extrabold tracking-widest text-[#3D4852] dark:text-white animate-pulse"
          >
            {text}
          </h2>
        </div>
      </div>
    </div>
  );
}

// 12. CSS Animation & Keyframes Maker
export function CssAnimationTool() {
  const [animType, setAnimType] = useState<'bounce' | 'pulse' | 'spin' | 'shake' | 'float' | 'wobble' | 'heartbeat' | 'flip'>('bounce');
  const [duration, setDuration] = useState(1);
  const [timing, setTiming] = useState('ease-in-out');
  const [iteration, setIteration] = useState('infinite');

  const keyframesMap: Record<string, string> = {
    bounce: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25px); }
}`,
    pulse: `@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.85; }
}`,
    spin: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    shake: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
}`,
    float: `@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(4deg); }
}`,
    wobble: `@keyframes wobble {
  0%, 100% { transform: translateX(0%); }
  15% { transform: translateX(-25%) rotate(-5deg); }
  30% { transform: translateX(20%) rotate(3deg); }
  45% { transform: translateX(-15%) rotate(-3deg); }
  60% { transform: translateX(10%) rotate(2deg); }
  75% { transform: translateX(-5%) rotate(-1deg); }
}`,
    heartbeat: `@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}`,
    flip: `@keyframes flip {
  0% { transform: perspective(400px) rotateY(0); }
  100% { transform: perspective(400px) rotateY(360deg); }
}`,
  };

  const fullCss = `${keyframesMap[animType]}

.animated-element {
  animation: ${animType} ${duration}s ${timing} ${iteration};
}`;

  return (
    <div id="css-animation-tool" className="space-y-6">
      {/* Dynamic Keyframes Tag */}
      <style>{keyframesMap[animType]}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Animation Preset</span>
            <div className="grid grid-cols-4 gap-2">
              {(['bounce', 'pulse', 'spin', 'shake', 'float', 'wobble', 'heartbeat', 'flip'] as const).map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAnimType(a)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all ${
                    animType === a ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-[#6B7280]">Duration: {duration}s</span>
              <input
                type="range"
                min={0.2}
                max={4}
                step={0.1}
                value={duration}
                onChange={e => setDuration(parseFloat(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-[#6B7280]">Timing Function</span>
              <select
                value={timing}
                onChange={e => setTiming(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl neu-pressed-deep text-xs font-bold text-[#3D4852] dark:text-white"
              >
                <option value="ease">ease</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="linear">linear</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#6B7280]">Generated CSS & Keyframes</span>
              <CopyButton text={fullCss} label="Copy All CSS" />
            </div>
            <pre className="p-4 rounded-xl neu-pressed-deep text-xs font-mono text-[#3D4852] dark:text-slate-100 max-h-48 overflow-y-auto">
              <code>{fullCss}</code>
            </pre>
          </div>
        </div>

        <div className="p-12 rounded-3xl neu-pressed-deep flex flex-col items-center justify-center min-h-[260px] space-y-4">
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Live Animated Preview</span>
          <div
            style={{
              animation: `${animType} ${duration}s ${timing} ${iteration}`,
            }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#38B2AC] shadow-2xl flex items-center justify-center text-white font-extrabold text-sm font-display select-none"
          >
            {animType}
          </div>
        </div>
      </div>
    </div>
  );
}

// 13. CSS Flexbox Playground
export function FlexboxPlaygroundTool() {
  const [flexDirection, setFlexDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('center');
  const [alignItems, setAlignItems] = useState<'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'>('center');
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('wrap');
  const [gap, setGap] = useState<number>(16);
  const [itemCount, setItemCount] = useState<number>(5);

  const cssCode = `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`;

  return (
    <div id="flexbox-generator-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">flex-direction</label>
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              {(['row', 'row-reverse', 'column', 'column-reverse'] as const).map(dir => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setFlexDirection(dir)}
                  className={`p-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                    flexDirection === dir ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#3D4852] dark:text-slate-200">justify-content</label>
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const).map(jc => (
                <button
                  key={jc}
                  type="button"
                  onClick={() => setJustifyContent(jc)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                    justifyContent === jc ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {jc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#3D4852] dark:text-slate-200">align-items</label>
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              {(['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] as const).map(ai => (
                <button
                  key={ai}
                  type="button"
                  onClick={() => setAlignItems(ai)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                    alignItems === ai ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {ai}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#3D4852] dark:text-slate-200">flex-wrap</label>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {(['nowrap', 'wrap', 'wrap-reverse'] as const).map(fw => (
                <button
                  key={fw}
                  type="button"
                  onClick={() => setFlexWrap(fw)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                    flexWrap === fw ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-[11px]">Gap: {gap}px</span>
              <input
                type="range"
                min={0}
                max={48}
                value={gap}
                onChange={e => setGap(parseInt(e.target.value))}
                className="w-full mt-1 accent-[#6C63FF]"
              />
            </div>
            <div>
              <span className="text-[11px]">Items: {itemCount}</span>
              <input
                type="range"
                min={2}
                max={10}
                value={itemCount}
                onChange={e => setItemCount(parseInt(e.target.value))}
                className="w-full mt-1 accent-[#6C63FF]"
              />
            </div>
          </div>
        </div>

        {/* Live Canvas & CSS */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="min-h-[300px] p-6 rounded-3xl neu-pressed-deep border border-[#cbd5e1]/40 dark:border-slate-800 transition-all overflow-hidden"
            style={{
              display: 'flex',
              flexDirection,
              justifyContent,
              alignItems,
              flexWrap,
              gap: `${gap}px`,
            }}
          >
            {Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl neu-flat flex flex-col items-center justify-center font-display font-extrabold text-sm text-[#6C63FF] shadow-md hover:scale-105 transition-transform"
                style={{
                  minWidth: flexDirection.startsWith('col') ? 'auto' : '64px',
                  minHeight: '64px',
                }}
              >
                <span>#{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl neu-flat space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#6B7280]">Generated CSS</span>
              <CopyButton text={cssCode} label="Copy Flexbox CSS" />
            </div>
            <pre className="p-4 rounded-xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100 overflow-x-auto">
              <code>{cssCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// 14. CSS Grid Layout Generator
export function GridGeneratorTool() {
  const [columns, setColumns] = useState<number>(3);
  const [rows, setRows] = useState<number>(3);
  const [colGap, setColGap] = useState<number>(16);
  const [rowGap, setRowGap] = useState<number>(16);

  const gridCss = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${rowGap}px ${colGap}px;
}`;

  return (
    <div id="grid-generator-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div>
            <div className="flex justify-between">
              <label className="text-[#3D4852] dark:text-slate-200">Columns: {columns}</label>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={columns}
              onChange={e => setColumns(parseInt(e.target.value))}
              className="w-full mt-1.5 accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-[#3D4852] dark:text-slate-200">Rows: {rows}</label>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={rows}
              onChange={e => setRows(parseInt(e.target.value))}
              className="w-full mt-1.5 accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-[#3D4852] dark:text-slate-200">Column Gap: {colGap}px</label>
            </div>
            <input
              type="range"
              min={0}
              max={32}
              value={colGap}
              onChange={e => setColGap(parseInt(e.target.value))}
              className="w-full mt-1.5 accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-[#3D4852] dark:text-slate-200">Row Gap: {rowGap}px</label>
            </div>
            <input
              type="range"
              min={0}
              max={32}
              value={rowGap}
              onChange={e => setRowGap(parseInt(e.target.value))}
              className="w-full mt-1.5 accent-[#6C63FF]"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div
            className="min-h-[300px] p-6 rounded-3xl neu-pressed-deep border border-[#cbd5e1]/40 dark:border-slate-800 transition-all"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: `${rowGap}px ${colGap}px`,
            }}
          >
            {Array.from({ length: columns * rows }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl neu-flat flex items-center justify-center font-display font-extrabold text-xs text-[#6C63FF] shadow-sm hover:scale-105 transition-transform"
              >
                Cell {i + 1}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl neu-flat space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#6B7280]">Generated CSS</span>
              <CopyButton text={gridCss} label="Copy Grid CSS" />
            </div>
            <pre className="p-4 rounded-xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100 overflow-x-auto">
              <code>{gridCss}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

