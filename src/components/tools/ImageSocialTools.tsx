import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CopyButton } from './TextTools';
import { Download, Share2, Youtube, Wifi, Globe, Mail, User, Image, Check, Heart, MessageCircle, Repeat2 } from 'lucide-react';

// 1. QR Code Generator
export function QrCodeGeneratorTool() {
  const [type, setType] = useState<'url' | 'wifi' | 'text' | 'email'>('url');
  const [text, setText] = useState('https://dmlab.tools');
  const [wifiSsid, setWifiSsid] = useState('Office_5G');
  const [wifiPass, setWifiPass] = useState('SuperSecretPass');
  const [wifiSec, setWifiSec] = useState('WPA');
  const [emailTo, setEmailTo] = useState('support@dmlab.tools');
  const [emailSub, setEmailSub] = useState('Inquiry about DMLab Tools');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const getPayload = () => {
    if (type === 'url' || type === 'text') return text;
    if (type === 'wifi') return `WIFI:S:${wifiSsid};T:${wifiSec};P:${wifiPass};;`;
    if (type === 'email') return `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}`;
    return text;
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload) return;

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [type, text, wifiSsid, wifiPass, wifiSec, emailTo, emailSub, fgColor, bgColor]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'dmlab-qrcode.png';
    a.click();
  };

  return (
    <div id="qr-generator-tool" className="space-y-6">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-sm">
        {[
          { id: 'url', label: 'URL / Link', icon: Globe },
          { id: 'wifi', label: 'WiFi Network', icon: Wifi },
          { id: 'text', label: 'Plain Text', icon: User },
          { id: 'email', label: 'Email', icon: Mail },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setType(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === tab.id
                  ? 'neu-tab-active'
                  : 'text-[#6B7280] hover:text-[#3D4852]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Form Inputs */}
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          {type === 'url' && (
            <div className="space-y-1.5">
              <label className="text-[#3D4852] dark:text-slate-200">Website URL</label>
              <input
                type="url"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
          )}

          {type === 'wifi' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[#3D4852] dark:text-slate-200">Network SSID</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={e => setWifiSsid(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#3D4852] dark:text-slate-200">Password</label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={e => setWifiPass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {type === 'text' && (
            <div className="space-y-1.5">
              <label className="text-[#3D4852] dark:text-slate-200">Raw Text Content</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
              />
            </div>
          )}

          {type === 'email' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[#3D4852] dark:text-slate-200">Recipient Email</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#3D4852] dark:text-slate-200">Subject</label>
                <input
                  type="text"
                  value={emailSub}
                  onChange={e => setEmailSub(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#cbd5e1]/40 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span>QR Color:</span>
              <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-7 h-7 rounded-lg border-none cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <span>Background:</span>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-7 h-7 rounded-lg border-none cursor-pointer" />
            </div>
          </div>
        </div>

        {/* QR Output */}
        <div className="p-8 rounded-[28px] neu-flat flex flex-col items-center justify-center space-y-5 text-center">
          {qrDataUrl ? (
            <div className="p-4 rounded-2xl bg-white shadow-md">
              <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 object-contain" />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-2xl neu-pressed-deep flex items-center justify-center text-xs text-[#6B7280]">
              Generating QR...
            </div>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl neu-btn-primary text-xs font-bold cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. YouTube Thumbnail Downloader & Embed Generator
export function YoutubeThumbnailTool() {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [autoplay, setAutoplay] = useState(false);
  const [mute, setMute] = useState(false);
  const [controls, setControls] = useState(true);
  const [loop, setLoop] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const extractVideoId = (inputUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(url) || 'dQw4w9WgXcQ';

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${mute ? 1 : 0}&controls=${controls ? 1 : 0}${loop ? `&loop=1&playlist=${videoId}` : ''}${startTime > 0 ? `&start=${startTime}` : ''}`;
  const iframeCode = `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

  const resolutions = [
    { label: 'Maximum Resolution (1080p HD)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
    { label: 'Standard Definition (640x480)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
    { label: 'High Quality (480x360)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
    { label: 'Medium Quality (320x180)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
  ];

  return (
    <div id="youtube-thumbnail-tool" className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          YouTube Video Link / ID
        </label>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-5 py-3 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
        />
      </div>

      {/* Embed Code Generator */}
      <div className="p-6 rounded-2xl neu-flat space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-[#6B7280]">Responsive Embed Code Generator</span>
          <CopyButton text={iframeCode} label="Copy Embed HTML" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-[#6B7280]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={e => setAutoplay(e.target.checked)}
              className="rounded text-[#6C63FF]"
            />
            <span>Autoplay</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mute}
              onChange={e => setMute(e.target.checked)}
              className="rounded text-[#6C63FF]"
            />
            <span>Mute Audio</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={controls}
              onChange={e => setControls(e.target.checked)}
              className="rounded text-[#6C63FF]"
            />
            <span>Show Controls</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={loop}
              onChange={e => setLoop(e.target.checked)}
              className="rounded text-[#6C63FF]"
            />
            <span>Loop Video</span>
          </label>
        </div>

        <pre className="p-4 rounded-xl neu-pressed-deep text-xs font-mono text-[#3D4852] dark:text-slate-100 overflow-x-auto">
          <code>{iframeCode}</code>
        </pre>
      </div>

      {/* Thumbnails */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold uppercase text-[#6B7280] block">Video Thumbnails</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {resolutions.map((res, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl neu-flat space-y-3.5"
            >
              <span className="text-xs font-bold text-[#3D4852] dark:text-slate-200 block">{res.label}</span>
              <div className="aspect-video rounded-xl overflow-hidden shadow-inner neu-pressed-deep">
                <img
                  src={res.url}
                  alt={res.label}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#6C63FF] hover:underline"
                >
                  View Full Size
                </a>
                <CopyButton text={res.url} label="Copy URL" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Social Post / Tweet Mockup Generator
export function TweetMockupTool() {
  const [name, setName] = useState('DMLab Tools');
  const [handle, setHandle] = useState('dmlab_tools');
  const [verified, setVerified] = useState(true);
  const [content, setContent] = useState(
    'Just discovered DMLab Tools — an all-in-one toolbox featuring dozens of free, super-fast developer, CSS, and text tools in one clean interface! 🚀💻'
  );
  const [date, setDate] = useState('10:42 AM · Aug 21, 2026');
  const [likes, setLikes] = useState('2.4K');
  const [retweets, setRetweets] = useState('482');

  return (
    <div id="tweet-mockup-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Controls */}
        <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#3D4852] dark:text-slate-200">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[#3D4852] dark:text-slate-200">Handle (@)</label>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Post Text</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#3D4852] dark:text-slate-200">Date/Time</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[#3D4852] dark:text-slate-200">Likes</label>
              <input
                type="text"
                value={likes}
                onChange={e => setLikes(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[#3D4852] dark:text-slate-200">Reposts</label>
              <input
                type="text"
                value={retweets}
                onChange={e => setRetweets(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2 text-[#3D4852] dark:text-slate-200">
            <input
              type="checkbox"
              checked={verified}
              onChange={e => setVerified(e.target.checked)}
              className="rounded text-[#6C63FF] focus:ring-0 cursor-pointer"
            />
            <span>Verified Blue Badge</span>
          </label>
        </div>

        {/* Live Mockup Preview */}
        <div className="p-7 rounded-[28px] neu-flat space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full neu-convex flex items-center justify-center font-bold text-base text-[#6C63FF]">
                {name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-[#3D4852] dark:text-white">{name}</span>
                  {verified && <span className="text-[#6C63FF] text-xs">✓</span>}
                </div>
                <span className="text-xs text-[#6B7280]">@{handle}</span>
              </div>
            </div>
            <span className="text-base font-extrabold text-[#6B7280]">𝕏</span>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#3D4852] dark:text-slate-100">{content}</p>

          <div className="text-xs text-[#6B7280] pt-2 border-b border-[#cbd5e1]/40 dark:border-slate-800 pb-3 font-bold">
            {date}
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-[#6B7280]">
            <div className="flex items-center gap-1.5 hover:text-[#6C63FF] cursor-pointer">
              <MessageCircle className="w-4 h-4" /> <span>34</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-emerald-500 cursor-pointer">
              <Repeat2 className="w-4 h-4" /> <span>{retweets}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer">
              <Heart className="w-4 h-4" /> <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Open Graph & Meta Tag Generator
export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState('DMLab Tools - All-in-One Digital Toolbox');
  const [desc, setDesc] = useState('35+ high-performance online developer, designer, and marketing tools in one modern workspace.');
  const [url, setUrl] = useState('https://dmlab.tools');
  const [image, setImage] = useState('https://dmlab.tools/og-banner.png');

  const metaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image}">`;

  return (
    <div id="meta-tag-generator-tool" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl neu-flat space-y-3.5 text-xs font-bold text-[#6B7280]">
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Page Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Site Canonical URL</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Social Share Image (OG Banner)</label>
            <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#6B7280]">HTML Meta Tags</span>
            <CopyButton text={metaHtml} label="Copy Tags" />
          </div>
          <pre className="p-5 rounded-2xl neu-pressed-deep font-mono text-xs overflow-x-auto leading-relaxed text-[#3D4852] dark:text-slate-100">
            <code>{metaHtml}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// 5. UTM Campaign URL Builder
export function UtmBuilderTool() {
  const [baseUrl, setBaseUrl] = useState('https://dmlab.tools/pricing');
  const [source, setSource] = useState('newsletter');
  const [medium, setMedium] = useState('email');
  const [campaign, setCampaign] = useState('summer_launch_2026');
  const [term, setTerm] = useState('pro_tools');
  const [content, setContent] = useState('header_cta_button');

  const buildUrl = () => {
    try {
      const url = new URL(baseUrl);
      if (source) url.searchParams.set('utm_source', source);
      if (medium) url.searchParams.set('utm_medium', medium);
      if (campaign) url.searchParams.set('utm_campaign', campaign);
      if (term) url.searchParams.set('utm_term', term);
      if (content) url.searchParams.set('utm_content', content);
      return url.toString();
    } catch {
      return `${baseUrl}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
    }
  };

  const finalUrl = buildUrl();

  return (
    <div id="utm-builder-tool" className="space-y-6">
      <div className="p-6 rounded-2xl neu-flat space-y-4 text-xs font-bold text-[#6B7280]">
        <div>
          <label className="text-[#3D4852] dark:text-slate-200">Website URL *</label>
          <input type="url" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep mt-1 text-sm text-[#3D4852] dark:text-slate-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Campaign Source (e.g. google, newsletter) *</label>
            <input type="text" value={source} onChange={e => setSource(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Campaign Medium (e.g. cpc, email, banner) *</label>
            <input type="text" value={medium} onChange={e => setMedium(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Campaign Name</label>
            <input type="text" value={campaign} onChange={e => setCampaign(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Campaign Term</label>
            <input type="text" value={term} onChange={e => setTerm(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
          <div>
            <label className="text-[#3D4852] dark:text-slate-200">Campaign Content</label>
            <input type="text" value={content} onChange={e => setContent(e.target.value)} className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-slate-100" />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl neu-flat flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
            Generated Tracking URL
          </span>
          <div className="text-sm font-mono font-bold text-[#3D4852] dark:text-white break-all">
            {finalUrl}
          </div>
        </div>
        <CopyButton text={finalUrl} label="Copy Link" />
      </div>
    </div>
  );
}

// 7. Instagram Post Mockup Generator
export function InstagramPostMockupTool() {
  const [username, setUsername] = useState('dmlab_official');
  const [caption, setCaption] = useState('Crafting the ultimate digital toolbox with neumorphic design principles. ⚡️ #devtools #productivity');
  const [likes, setLikes] = useState(1420);
  const [comments, setComments] = useState(84);
  const [imageSrc] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop');

  return (
    <div id="instagram-post-mockup-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <div>
            <label className="text-xs font-bold text-[#6B7280]">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs font-bold text-[#3D4852] dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B7280]">Caption</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#6B7280]">Likes Count</label>
              <input
                type="number"
                value={likes}
                onChange={e => setLikes(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs font-bold text-[#3D4852] dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#6B7280]">Comments Count</label>
              <input
                type="number"
                value={comments}
                onChange={e => setComments(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs font-bold text-[#3D4852] dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center p-6 rounded-3xl neu-pressed-deep">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-[#cbd5e1] dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-xs text-[#6C63FF]">
                    {username.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white">{username}</span>
              </div>
              <span className="text-slate-400 font-bold">•••</span>
            </div>

            {/* Post Image */}
            <img src={imageSrc} alt="Post" className="w-full aspect-square object-cover" />

            {/* Action Bar */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-rose-500">
                  <Heart className="w-5 h-5 fill-rose-500" />
                  <MessageCircle className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                  <Share2 className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                </div>
              </div>

              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {likes.toLocaleString()} likes
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white mr-1">{username}</strong>
                {caption}
              </div>

              <div className="text-[11px] text-slate-400">
                View all {comments} comments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Social Character & Post Counter (Multi-platform)
export function SocialPostLengthTool() {
  const [text, setText] = useState('Check out 75+ developer and designer tools in one unified workspace! #tools #productivity');

  const platforms = [
    { name: 'Twitter / X', max: 280, icon: '𝕏' },
    { name: 'LinkedIn Post', max: 3000, icon: 'in' },
    { name: 'Instagram Caption', max: 2200, icon: 'IG' },
    { name: 'Facebook Post', max: 63206, icon: 'fb' },
    { name: 'Pinterest Description', max: 500, icon: 'P' },
    { name: 'TikTok Caption', max: 2200, icon: 'TT' },
  ];

  return (
    <div id="social-post-length-tool" className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Draft Social Post</span>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          className="w-full px-5 py-4 rounded-2xl neu-pressed-deep text-sm text-[#3D4852] dark:text-slate-100"
          placeholder="Type your social post content here..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map(p => {
          const remaining = p.max - text.length;
          const isOver = remaining < 0;
          const pct = Math.min(100, Math.round((text.length / p.max) * 100));

          return (
            <div key={p.name} className="p-5 rounded-2xl neu-flat space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3D4852] dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg neu-pressed-sm flex items-center justify-center text-[10px] font-bold text-[#6C63FF]">
                    {p.icon}
                  </span>
                  {p.name}
                </span>
                <span className={`text-xs font-mono font-bold ${isOver ? 'text-rose-500' : 'text-[#6C63FF]'}`}>
                  {text.length}/{p.max}
                </span>
              </div>

              <div className="w-full h-2 rounded-full neu-pressed-deep overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : 'bg-[#6C63FF]'}`}
                />
              </div>

              <span className={`text-[11px] font-bold block ${isOver ? 'text-rose-500' : 'text-[#6B7280]'}`}>
                {isOver ? `${Math.abs(remaining)} chars over limit` : `${remaining} chars remaining`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 9. Open Graph & Social Share Previewer
export function OpenGraphPreviewTool() {
  const [ogTitle, setOgTitle] = useState('DMLab Tools - 75+ Free Online Developer & Designer Utilities');
  const [ogDesc, setOgDesc] = useState('All-in-one suite with text analyzers, CSS generators, coding validators, color harmonies, image editors, and AI assistants.');
  const [ogSite, setOgSite] = useState('dmlab.tools');
  const [ogImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop');

  const metaTags = `<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDesc}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:url" content="https://${ogSite}" />
<meta name="twitter:card" content="summary_large_image" />`;

  return (
    <div id="open-graph-preview-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl neu-flat">
          <div>
            <label className="text-xs font-bold text-[#6B7280]">OG Title</label>
            <input
              type="text"
              value={ogTitle}
              onChange={e => setOgTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs font-bold text-[#3D4852] dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B7280]">OG Description</label>
            <textarea
              value={ogDesc}
              onChange={e => setOgDesc(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B7280]">Domain</label>
            <input
              type="text"
              value={ogSite}
              onChange={e => setOgSite(e.target.value)}
              className="w-full px-4 py-2 rounded-xl neu-pressed-deep mt-1 text-xs text-[#3D4852] dark:text-white"
            />
          </div>

          <div className="pt-2">
            <CopyButton text={metaTags} label="Copy HTML Meta Tags" />
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Facebook & Twitter Card Preview</span>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-[#cbd5e1] dark:border-slate-800 bg-white dark:bg-slate-900">
            <img src={ogImage} alt="OG" className="w-full h-44 object-cover" />
            <div className="p-4 space-y-1 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] uppercase font-bold text-slate-400">{ogSite}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{ogTitle}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{ogDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

