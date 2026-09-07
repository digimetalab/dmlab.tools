import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Sliders,
  Scissors,
  EyeOff,
  Maximize2,
  RefreshCw,
  FileDown,
  Layers,
  Sparkles,
  RotateCw,
  FlipHorizontal,
  FileText,
  Copy,
  Check,
  Palette,
  ShieldAlert,
  Grid,
  Waves,
  Zap,
} from 'lucide-react';
import { CopyButton } from './TextTools';

// Sample demo images
const SAMPLE_PHOTOS = [
  { name: 'Landscape', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80' },
  { name: 'Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80' },
  { name: 'Architecture', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80' },
  { name: 'Neon Cyber', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
];

// ============================================================================
// 1. IMAGE CROPPER & RESIZER
// ============================================================================
export function ImageCropperTool() {
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [aspect, setAspect] = useState<string>('1:1');
  const [cropWidth, setCropWidth] = useState<number>(400);
  const [cropHeight, setCropHeight] = useState<number>(400);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(92);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 800, h: 600 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        setImageSrc(src);
        const img = new Image();
        img.onload = () => {
          setImgNaturalSize({ w: img.width, h: img.height });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const setPresetRatio = (ratio: string, w: number, h: number) => {
    setAspect(ratio);
    setCropWidth(w);
    setCropHeight(h);
  };

  const handleDownloadCropped = () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.save();
      // Background for transparent png conversion to jpeg
      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, cropWidth, cropHeight);
      }

      // Center transformations
      ctx.translate(cropWidth / 2, cropHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, 1);

      const targetAspect = cropWidth / cropHeight;
      const imgAspect = img.width / img.height;

      let drawW = cropWidth * zoom;
      let drawH = cropHeight * zoom;

      if (imgAspect > targetAspect) {
        drawW = drawH * imgAspect;
      } else {
        drawH = drawW / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const a = document.createElement('a');
      a.href = canvas.toDataURL(mimeType, quality / 100);
      a.download = `cropped-${cropWidth}x${cropHeight}.${format}`;
      a.click();
      setIsProcessing(false);
    };
    img.onerror = () => setIsProcessing(false);
    img.src = imageSrc;
  };

  return (
    <div id="image-cropper-tool" className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        {/* Sample pickers & upload */}
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl neu-convex-xs text-[#6C63FF] hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 font-bold">
            <Upload className="w-3.5 h-3.5" /> Upload Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <span className="text-[#9CA3AF] hidden sm:inline">or Sample:</span>
          <div className="hidden sm:flex items-center gap-1.5">
            {SAMPLE_PHOTOS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImageSrc(p.url)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  imageSrc === p.url ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Download Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {(['png', 'jpeg', 'webp'] as const).map(fmt => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-bold cursor-pointer ${
                  format === fmt ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDownloadCropped}
            className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> {isProcessing ? 'Processing...' : 'Download Cropped'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="space-y-4 p-6 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
          {/* Aspect Ratio Presets */}
          <div className="space-y-2">
            <span className="uppercase text-[#3D4852] dark:text-slate-200">Aspect Ratio</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '1:1 Square', w: 600, h: 600, ratio: '1:1' },
                { label: '16:9 Banner', w: 960, h: 540, ratio: '16:9' },
                { label: '4:3 Standard', w: 800, h: 600, ratio: '4:3' },
                { label: '9:16 Story', w: 540, h: 960, ratio: '9:16' },
                { label: '3:2 Photo', w: 900, h: 600, ratio: '3:2' },
                { label: '21:9 Ultra', w: 1050, h: 450, ratio: '21:9' },
              ].map(r => (
                <button
                  key={r.ratio}
                  type="button"
                  onClick={() => setPresetRatio(r.ratio, r.w, r.h)}
                  className={`p-2 rounded-xl text-[11px] text-center cursor-pointer transition-all ${
                    aspect === r.ratio ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimension Output */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-[11px]">Width: {cropWidth}px</span>
              <input
                type="number"
                min={50}
                max={3000}
                value={cropWidth}
                onChange={e => setCropWidth(parseInt(e.target.value) || 100)}
                className="w-full mt-1 px-3 py-1.5 rounded-xl neu-pressed-deep text-xs font-mono font-bold text-[#3D4852] dark:text-white"
              />
            </div>
            <div>
              <span className="text-[11px]">Height: {cropHeight}px</span>
              <input
                type="number"
                min={50}
                max={3000}
                value={cropHeight}
                onChange={e => setCropHeight(parseInt(e.target.value) || 100)}
                className="w-full mt-1 px-3 py-1.5 rounded-xl neu-pressed-deep text-xs font-mono font-bold text-[#3D4852] dark:text-white"
              />
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between">
              <span>Zoom Scale: {zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          {/* Rotate & Flip */}
          <div className="pt-2 flex items-center justify-between">
            <span className="uppercase text-[#3D4852] dark:text-slate-200">Transform</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="p-2 rounded-xl neu-convex-xs text-[#6C63FF] hover:opacity-80 transition-all flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" /> {rotation}°
              </button>
              <button
                type="button"
                onClick={() => setFlipH(!flipH)}
                className={`p-2 rounded-xl text-[11px] cursor-pointer ${
                  flipH ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" /> Flip
              </button>
            </div>
          </div>

          {/* Quality Slider for WebP / JPEG */}
          {format !== 'png' && (
            <div className="space-y-1 pt-2">
              <div className="flex justify-between">
                <span>Output Quality: {quality}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={quality}
                onChange={e => setQuality(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>
          )}
        </div>

        {/* Interactive Preview Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-8 rounded-3xl neu-pressed-deep flex flex-col items-center justify-center min-h-[380px] overflow-hidden relative">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#6C63FF] flex items-center justify-center bg-black/10"
              style={{
                width: `${Math.min(cropWidth * 0.5, 380)}px`,
                height: `${Math.min(cropHeight * 0.5, 380)}px`,
                aspectRatio: `${cropWidth} / ${cropHeight}`,
              }}
            >
              <img
                src={imageSrc}
                alt="Crop preview"
                className="max-w-none transition-transform duration-100 select-none pointer-events-none"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div className="absolute inset-0 border border-dashed border-white/60 pointer-events-none grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-white/30" />
                <div className="border-r border-white/30" />
                <div />
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[11px] font-mono font-bold text-[#6B7280]">
                Output: {cropWidth} × {cropHeight} px • Format: {format.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. IMAGE FILTERS & PHOTO EFFECTS
// ============================================================================
export function ImageFiltersTool() {
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_PHOTOS[1].url);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [hueRotate, setHueRotate] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [saturate, setSaturate] = useState<number>(100);

  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg) invert(${invert}%) saturate(${saturate}%)`;

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
    setInvert(0);
    setSaturate(100);
  };

  const presetFilters = [
    { name: 'Original', b: 100, c: 100, g: 0, s: 0, bl: 0, h: 0, inv: 0, sat: 100 },
    { name: 'Vintage 1977', b: 110, c: 120, g: 0, s: 45, bl: 0, h: 350, inv: 0, sat: 130 },
    { name: 'Cyberpunk Neon', b: 105, c: 140, g: 0, s: 0, bl: 0, h: 290, inv: 0, sat: 180 },
    { name: 'Noir Classic', b: 95, c: 150, g: 100, s: 0, bl: 0, h: 0, inv: 0, sat: 0 },
    { name: 'Golden Warmth', b: 108, c: 105, g: 0, s: 30, bl: 0, h: 10, inv: 0, sat: 140 },
    { name: 'Emerald Wave', b: 100, c: 115, g: 0, s: 0, bl: 0, h: 90, inv: 0, sat: 135 },
    { name: 'Dramatic Crisp', b: 102, c: 165, g: 0, s: 0, bl: 0, h: 0, inv: 0, sat: 125 },
  ];

  const applyPreset = (p: typeof presetFilters[0]) => {
    setBrightness(p.b);
    setContrast(p.c);
    setGrayscale(p.g);
    setSepia(p.s);
    setBlur(p.bl);
    setHueRotate(p.h);
    setInvert(p.inv);
    setSaturate(p.sat);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadFiltered = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.filter = filterStyle;
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'filtered-image.png';
      a.click();
    };
    img.src = imageSrc;
  };

  return (
    <div id="image-filters-tool" className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl neu-convex-xs text-[#6C63FF] cursor-pointer flex items-center gap-1.5 font-bold">
            <Upload className="w-3.5 h-3.5" /> Upload Custom Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <div className="hidden sm:flex items-center gap-1.5">
            {SAMPLE_PHOTOS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImageSrc(p.url)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  imageSrc === p.url ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-1.5 rounded-xl neu-convex-xs text-[#6B7280] hover:text-[#6C63FF] transition-all flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={handleDownloadFiltered}
            className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Filtered
          </button>
        </div>
      </div>

      {/* Preset Badges */}
      <div className="p-4 rounded-2xl neu-flat space-y-2">
        <span className="text-xs font-extrabold uppercase text-[#6B7280] block">1-Click Filter Presets</span>
        <div className="flex flex-wrap gap-2">
          {presetFilters.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-xl neu-convex-xs text-xs font-bold text-[#3D4852] dark:text-slate-200 hover:text-[#6C63FF] transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="space-y-3.5 p-6 rounded-2xl neu-flat">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-2">Adjustments</span>

          {[
            { label: 'Brightness', val: brightness, set: setBrightness, min: 0, max: 200, unit: '%' },
            { label: 'Contrast', val: contrast, set: setContrast, min: 0, max: 200, unit: '%' },
            { label: 'Saturation', val: saturate, set: setSaturate, min: 0, max: 250, unit: '%' },
            { label: 'Grayscale', val: grayscale, set: setGrayscale, min: 0, max: 100, unit: '%' },
            { label: 'Sepia Tone', val: sepia, set: setSepia, min: 0, max: 100, unit: '%' },
            { label: 'Hue Rotate', val: hueRotate, set: setHueRotate, min: 0, max: 360, unit: '°' },
            { label: 'Blur', val: blur, set: setBlur, min: 0, max: 12, unit: 'px' },
            { label: 'Invert', val: invert, set: setInvert, min: 0, max: 100, unit: '%' },
          ].map(ctrl => (
            <div key={ctrl.label} className="space-y-1 text-xs font-bold text-[#6B7280]">
              <div className="flex justify-between">
                <span>{ctrl.label}</span>
                <span className="font-mono">{ctrl.val}{ctrl.unit}</span>
              </div>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                value={ctrl.val}
                onChange={e => ctrl.set(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>
          ))}

          <div className="pt-2">
            <CopyButton text={`filter: ${filterStyle};`} label="Copy CSS Filter Rule" />
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-8 rounded-3xl neu-pressed-deep flex items-center justify-center min-h-[380px] overflow-hidden">
            <img
              src={imageSrc}
              alt="Filtered preview"
              className="max-h-[360px] rounded-2xl object-cover shadow-2xl transition-all duration-150"
              style={{ filter: filterStyle }}
            />
          </div>

          <div className="p-4 rounded-2xl neu-flat space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase text-[#6B7280]">Generated CSS Property</span>
            <pre className="p-3 rounded-xl neu-pressed-deep font-mono text-xs text-[#3D4852] dark:text-slate-100 overflow-x-auto">
              <code>filter: {filterStyle};</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. IMAGE TO BASE64 DATA URI CONVERTER
// ============================================================================
export function ImageToBase64Tool() {
  const [base64, setBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('sample-icon.png');
  const [fileSize, setFileSize] = useState<number>(1420);
  const [mimeType, setMimeType] = useState<string>('image/png');

  useEffect(() => {
    // Generate initial sample base64 1x1 or sample icon
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 120, 120);
      grad.addColorStop(0, '#6C63FF');
      grad.addColorStop(1, '#38B2AC');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(60, 60, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DM', 60, 68);
      const dataUri = canvas.toDataURL('image/png');
      setBase64(dataUri);
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      setMimeType(file.type || 'image/png');
      const reader = new FileReader();
      reader.onload = () => {
        setBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const base64Raw = base64.includes(',') ? base64.split(',')[1] : base64;
  const htmlImgTag = `<img src="${base64}" alt="${fileName}" />`;
  const cssBgSnippet = `background-image: url("${base64}");`;

  return (
    <div id="image-to-base64-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <label className="px-4 py-2 rounded-xl neu-convex-xs text-[#6C63FF] hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 font-bold">
          <Upload className="w-4 h-4" /> Select Image to Convert
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        <div className="flex items-center gap-3">
          <span>File: <strong className="text-[#3D4852] dark:text-white">{fileName}</strong></span>
          <span className="px-2 py-0.5 rounded-md neu-pressed-sm font-mono text-[11px]">
            {Math.round(fileSize / 1024)} KB
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Copy Options */}
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <span className="text-xs font-extrabold uppercase text-[#6B7280] block">Copy Formats</span>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl neu-pressed-deep space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#3D4852] dark:text-slate-200">Complete Data URI</span>
                <CopyButton text={base64} label="Copy URI" />
              </div>
              <p className="text-[11px] font-mono text-[#6B7280] truncate">{base64.substring(0, 70)}...</p>
            </div>

            <div className="p-3.5 rounded-xl neu-pressed-deep space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#3D4852] dark:text-slate-200">HTML &lt;img&gt; Tag</span>
                <CopyButton text={htmlImgTag} label="Copy HTML" />
              </div>
              <p className="text-[11px] font-mono text-[#6B7280] truncate">{htmlImgTag.substring(0, 70)}...</p>
            </div>

            <div className="p-3.5 rounded-xl neu-pressed-deep space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#3D4852] dark:text-slate-200">CSS Background Image</span>
                <CopyButton text={cssBgSnippet} label="Copy CSS" />
              </div>
              <p className="text-[11px] font-mono text-[#6B7280] truncate">{cssBgSnippet.substring(0, 70)}...</p>
            </div>

            <div className="p-3.5 rounded-xl neu-pressed-deep space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#3D4852] dark:text-slate-200">Raw Base64 (Without Header)</span>
                <CopyButton text={base64Raw} label="Copy Raw" />
              </div>
              <p className="text-[11px] font-mono text-[#6B7280] truncate">{base64Raw.substring(0, 70)}...</p>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4 p-6 rounded-2xl neu-flat flex flex-col items-center justify-center">
          <span className="text-xs font-extrabold uppercase text-[#6B7280] self-start">Decoded Image Preview</span>
          <div className="w-full flex-1 min-h-[220px] rounded-2xl neu-pressed-deep flex items-center justify-center p-6">
            {base64 ? (
              <img src={base64} alt="Decoded preview" className="max-h-48 max-w-full rounded-xl object-contain shadow-lg" />
            ) : (
              <span className="text-xs text-[#6B7280]">No image loaded</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. BASE64 TO IMAGE DECODER
// ============================================================================
export function Base64ToImageTool() {
  const [base64Input, setBase64Input] = useState<string>(
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%236C63FF"/><path d="M35 50 L45 60 L65 40" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/></svg>'
  );

  const sampleIcons = [
    {
      name: 'Checkmark Icon',
      data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%236C63FF"/><path d="M35 50 L45 60 L65 40" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
    },
    {
      name: 'Pixel Star',
      data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><polygon points="50,10 63,38 93,42 71,63 77,93 50,78 23,93 29,63 7,42 37,38" fill="%23F59E0B"/></svg>',
    },
  ];

  const handleDownload = () => {
    if (!base64Input) return;
    const a = document.createElement('a');
    a.href = base64Input.trim();
    a.download = 'decoded-image.png';
    a.click();
  };

  return (
    <div id="base64-to-image-tool" className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Paste Base64 Data URI or String</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9CA3AF]">Samples:</span>
            {sampleIcons.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setBase64Input(s.data)}
                className="px-2.5 py-1 rounded-lg neu-convex-xs text-xs font-bold text-[#6C63FF] cursor-pointer"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={base64Input}
          onChange={e => setBase64Input(e.target.value)}
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ..."
          rows={6}
          className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-xs font-mono text-[#3D4852] dark:text-slate-100 leading-relaxed break-all"
        />
      </div>

      {base64Input && (
        <div className="p-6 rounded-2xl neu-flat space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Decoded Live Render</span>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Decoded File
            </button>
          </div>
          <div className="flex justify-center p-8 rounded-2xl neu-pressed-deep min-h-[220px] items-center">
            <img
              src={base64Input.trim()}
              alt="Rendered base64"
              className="max-h-[200px] rounded-xl object-contain shadow-md"
              onError={e => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. PHOTO CENSOR & PRIVACY MASK
// ============================================================================
export function PhotoCensorTool() {
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_PHOTOS[1].url);
  const [censorType, setCensorType] = useState<'pixelate' | 'blackout' | 'stamp'>('blackout');
  const [censorY, setCensorY] = useState<number>(38);
  const [censorX, setCensorX] = useState<number>(10);
  const [censorWidth, setCensorWidth] = useState<number>(80);
  const [censorHeight, setCensorHeight] = useState<number>(16);
  const [stampText, setStampText] = useState<string>('TOP SECRET');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadCensored = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const bx = (censorX / 100) * img.width;
      const by = (censorY / 100) * img.height;
      const bw = (censorWidth / 100) * img.width;
      const bh = (censorHeight / 100) * img.height;

      if (censorType === 'blackout') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(bx, by, bw, bh);
      } else if (censorType === 'stamp') {
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.max(18, Math.floor(bh * 0.5))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(stampText, bx + bw / 2, by + bh / 2 + Math.floor(bh * 0.18));
      } else {
        // Pixelate block
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.max(16, Math.floor(bh * 0.45))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('CENSORED', bx + bw / 2, by + bh / 2 + Math.floor(bh * 0.16));
      }

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'censored-photo.png';
      a.click();
    };
    img.src = imageSrc;
  };

  return (
    <div id="photo-censor-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl neu-convex-xs text-[#6C63FF] cursor-pointer flex items-center gap-1.5 font-bold">
            <Upload className="w-3.5 h-3.5" /> Upload Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <div className="hidden sm:flex items-center gap-1.5">
            {SAMPLE_PHOTOS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImageSrc(p.url)}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${imageSrc === p.url ? 'neu-tab-active' : 'neu-convex-xs'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadCensored}
          className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Download Censored Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4 p-6 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
          <span className="uppercase text-[#3D4852] dark:text-slate-200">Censor Style</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'blackout', label: 'Blackout' },
              { id: 'pixelate', label: 'Mosaic' },
              { id: 'stamp', label: 'Stamp' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setCensorType(m.id as any)}
                className={`p-2 rounded-xl text-center cursor-pointer transition-all ${
                  censorType === m.id ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {censorType === 'stamp' && (
            <div className="space-y-1 pt-1">
              <span>Stamp Text:</span>
              <input
                type="text"
                value={stampText}
                onChange={e => setStampText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl neu-pressed-deep font-bold text-xs text-[#3D4852] dark:text-white"
              />
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between mb-1">
                <span>Vertical Position (Y): {censorY}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={censorY}
                onChange={e => setCensorY(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Horizontal Position (X): {censorX}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={censorX}
                onChange={e => setCensorX(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Mask Width: {censorWidth}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={censorWidth}
                onChange={e => setCensorWidth(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Mask Height: {censorHeight}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={censorHeight}
                onChange={e => setCensorHeight(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-2 p-8 rounded-3xl neu-pressed-deep flex items-center justify-center min-h-[380px]">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm">
            <img src={imageSrc} alt="Censor preview" className="w-full h-auto object-cover select-none" />
            <div
              className={`absolute transition-all flex items-center justify-center font-extrabold tracking-widest text-xs shadow-md ${
                censorType === 'blackout'
                  ? 'bg-black text-transparent'
                  : censorType === 'stamp'
                  ? 'bg-red-600 border-2 border-white text-white font-serif'
                  : 'bg-slate-900/95 backdrop-blur-md text-white border-y border-white/30'
              }`}
              style={{
                top: `${censorY}%`,
                left: `${censorX}%`,
                width: `${censorWidth}%`,
                height: `${censorHeight}%`,
              }}
            >
              {censorType === 'stamp' ? stampText : censorType === 'pixelate' ? 'CENSORED' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. SVG TO PNG / RASTER CONVERTER
// ============================================================================
export function SvgToPngTool() {
  const [svgCode, setSvgCode] = useState<string>(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6C63FF" />
      <stop offset="100%" stop-color="#38B2AC" />
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#grad)" />
  <circle cx="60" cy="60" r="32" fill="#ffffff" opacity="0.2" />
  <path d="M42 60 L54 72 L78 48" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>`
  );
  const [scale, setScale] = useState<number>(4);
  const [bgChoice, setBgChoice] = useState<'transparent' | 'white' | 'dark'>('transparent');

  const svgPresets = [
    {
      name: 'Gradient Badge',
      code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6C63FF" />
      <stop offset="100%" stop-color="#38B2AC" />
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#grad)" />
  <path d="M42 60 L54 72 L78 48" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>`,
    },
    {
      name: 'Rocket Launch',
      code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="45" fill="#4F46E5" />
  <path d="M50 20 C60 35 65 50 60 70 L50 65 L40 70 C35 50 40 35 50 20 Z" fill="#F43F5E" />
  <circle cx="50" cy="42" r="5" fill="#FFFFFF" />
  <polygon points="50,65 55,80 50,75 45,80" fill="#FBBF24" />
</svg>`,
    },
    {
      name: 'Golden Star',
      code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <polygon points="50,10 63,38 93,42 71,63 77,93 50,78 23,93 29,63 7,42 37,38" fill="#F59E0B" />
</svg>`,
    },
  ];

  const handleUploadSvg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSvgCode(reader.result as string);
      reader.readAsText(file);
    }
  };

  const handleDownloadPng = () => {
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const baseDim = 120;
      const canvas = document.createElement('canvas');
      canvas.width = baseDim * scale;
      canvas.height = baseDim * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (bgChoice === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgChoice === 'dark') {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `vector-export-${canvas.width}x${canvas.height}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div id="svg-to-png-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl neu-convex-xs text-[#6C63FF] cursor-pointer flex items-center gap-1.5 font-bold">
            <Upload className="w-3.5 h-3.5" /> Upload .svg File
            <input type="file" accept=".svg" onChange={handleUploadSvg} className="hidden" />
          </label>
          <div className="hidden sm:flex items-center gap-1.5">
            {svgPresets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSvgCode(p.code)}
                className="px-2.5 py-1 rounded-lg neu-convex-xs text-xs font-bold text-[#6B7280] cursor-pointer hover:text-[#6C63FF]"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {[1, 2, 4, 8].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setScale(s)}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${scale === s ? 'neu-tab-active' : ''}`}
              >
                {s}x ({s * 120}px)
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export PNG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">SVG Source Code</span>
            <CopyButton text={svgCode} label="Copy SVG" />
          </div>
          <textarea
            value={svgCode}
            onChange={e => setSvgCode(e.target.value)}
            rows={11}
            className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-xs font-mono text-[#3D4852] dark:text-slate-100"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Raster Background</span>
            <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm text-xs font-bold">
              {(['transparent', 'white', 'dark'] as const).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBgChoice(b)}
                  className={`px-3 py-1 rounded-lg capitalize cursor-pointer ${bgChoice === b ? 'neu-tab-active' : ''}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`p-10 rounded-2xl neu-pressed-deep flex items-center justify-center min-h-[240px] ${
              bgChoice === 'white' ? 'bg-white' : bgChoice === 'dark' ? 'bg-slate-900' : ''
            }`}
          >
            <div
              className="w-36 h-36 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. SVG PATTERN GENERATOR
// ============================================================================
export function SvgPatternTool() {
  const [patternType, setPatternType] = useState<'dots' | 'grid' | 'stripes' | 'chevrons' | 'cross' | 'waves'>('dots');
  const [color, setColor] = useState<string>('#6C63FF');
  const [bgColor, setBgColor] = useState<string>('#F5F5F7');
  const [size, setSize] = useState<number>(28);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  const getSvgPatternCode = () => {
    switch (patternType) {
      case 'dots':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 6}" fill="${color}"/>
</svg>`;
      case 'grid':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>
</svg>`;
      case 'stripes':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth}"/>
</svg>`;
      case 'chevrons':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <path d="M 0 ${size / 2} L ${size / 2} 0 L ${size} ${size / 2}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>
</svg>`;
      case 'cross':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <path d="M ${size / 2} 0 L ${size / 2} ${size} M 0 ${size / 2} L ${size} ${size / 2}" stroke="${color}" stroke-width="${strokeWidth}"/>
</svg>`;
      case 'waves':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <path d="M 0 ${size / 2} Q ${size / 4} 0, ${size / 2} ${size / 2} T ${size} ${size / 2}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>
</svg>`;
    }
  };

  const patternSvg = getSvgPatternCode();
  const cssBackgroundRule = `background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(patternSvg)}");`;

  return (
    <div id="svg-pattern-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <span>Pattern:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            {(['dots', 'grid', 'stripes', 'chevrons', 'cross', 'waves'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPatternType(p)}
                className={`px-3 py-1 rounded-lg capitalize cursor-pointer ${patternType === p ? 'neu-tab-active' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Pattern Color:</span>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <span>Background:</span>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
          </div>
          <CopyButton text={cssBackgroundRule} label="Copy CSS" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div>
            <div className="flex justify-between mb-1">
              <span>Grid / Pattern Scale: {size}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={64}
              value={size}
              onChange={e => setSize(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Stroke Thickness: {strokeWidth}px</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={strokeWidth}
              onChange={e => setStrokeWidth(parseInt(e.target.value))}
              className="w-full accent-[#6C63FF]"
            />
          </div>

          <div className="pt-2">
            <CopyButton text={patternSvg} label="Copy Raw SVG XML" />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div
            className="h-72 rounded-3xl neu-pressed-deep border border-[#cbd5e1] dark:border-slate-800 transition-all shadow-inner"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(patternSvg)}")`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. IMAGE WATERMARK & CAPTION WRITER
// ============================================================================
export function ImageCaptionTool() {
  const [caption, setCaption] = useState<string>('DMLab Studios • Copyright 2026');
  const [captionPosition, setCaptionPosition] = useState<'bottom' | 'top' | 'center' | 'tiled'>('bottom');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [bgColor, setBgColor] = useState<string>('#000000');
  const [bgOpacity, setBgOpacity] = useState<number>(0.65);
  const [fontSize, setFontSize] = useState<number>(24);
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_PHOTOS[3].url);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadCaption = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const scaledFontSize = Math.max(18, Math.floor(fontSize * (img.width / 600)));
      ctx.font = `bold ${scaledFontSize}px sans-serif`;

      if (captionPosition === 'tiled') {
        ctx.save();
        ctx.rotate((-25 * Math.PI) / 180);
        ctx.fillStyle = `rgba(255, 255, 255, 0.35)`;
        ctx.font = `bold ${scaledFontSize * 1.2}px sans-serif`;
        for (let x = -img.width; x < img.width * 2; x += 300) {
          for (let y = -img.height; y < img.height * 2; y += 150) {
            ctx.fillText(caption, x, y);
          }
        }
        ctx.restore();
      } else {
        let y = img.height - 40;
        if (captionPosition === 'top') y = 60;
        if (captionPosition === 'center') y = img.height / 2;

        // Draw banner
        const bannerH = scaledFontSize * 1.8;
        const bannerY = y - scaledFontSize * 1.2;
        ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacity})`;
        ctx.fillRect(0, bannerY, img.width, bannerH);

        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(caption, img.width / 2, y);
      }

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'watermarked-image.png';
      a.click();
    };
    img.src = imageSrc;
  };

  return (
    <div id="image-caption-tool" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl neu-convex-xs text-[#6C63FF] cursor-pointer flex items-center gap-1.5 font-bold">
            <Upload className="w-3.5 h-3.5" /> Upload Image
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          <div className="hidden sm:flex items-center gap-1.5">
            {SAMPLE_PHOTOS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImageSrc(p.url)}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${imageSrc === p.url ? 'neu-tab-active' : 'neu-convex-xs'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadCaption}
          className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Download Watermarked Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 p-6 rounded-2xl neu-flat text-xs font-bold text-[#6B7280]">
          <div className="space-y-1">
            <span className="uppercase text-[#3D4852] dark:text-slate-200">Watermark Text</span>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-bold text-xs text-[#3D4852] dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <span className="uppercase text-[#3D4852] dark:text-slate-200">Position Style</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['bottom', 'top', 'center', 'tiled'] as const).map(pos => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setCaptionPosition(pos)}
                  className={`p-2 rounded-xl capitalize text-center cursor-pointer transition-all ${
                    captionPosition === pos ? 'neu-tab-active' : 'neu-convex-xs text-[#6B7280]'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between mb-1">
                <span>Font Size: {fontSize}px</span>
              </div>
              <input
                type="range"
                min={14}
                max={48}
                value={fontSize}
                onChange={e => setFontSize(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Banner Opacity: {Math.round(bgOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={bgOpacity}
                onChange={e => setBgOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span>Text:</span>
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer" />
              </div>
              <div className="flex items-center gap-2">
                <span>Banner:</span>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 p-8 rounded-3xl neu-pressed-deep flex items-center justify-center min-h-[360px]">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md w-full">
            <img src={imageSrc} alt="Preview" className="w-full h-auto object-cover select-none" />

            {captionPosition === 'tiled' ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="transform -rotate-25 text-white/35 font-extrabold text-lg tracking-widest text-center select-none space-y-8">
                  <div>{caption}</div>
                  <div>{caption}</div>
                  <div>{caption}</div>
                </div>
              </div>
            ) : (
              <div
                className={`absolute left-0 right-0 text-center p-3 font-bold transition-all ${
                  captionPosition === 'top'
                    ? 'top-0'
                    : captionPosition === 'center'
                    ? 'top-1/2 -translate-y-1/2'
                    : 'bottom-0'
                }`}
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                }}
              >
                {caption}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
