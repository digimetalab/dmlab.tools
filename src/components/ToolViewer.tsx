import React, { useState } from 'react';
import { ToolItem } from '../types';
import { DynamicIcon } from '../utils/iconHelper';
import { Star, ArrowLeft, Sparkles, Bookmark, Share2, Check, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import {
  CaseConverterTool,
  WordCounterTool,
  SlugGeneratorTool,
  LoremGeneratorTool,
  TextDiffTool,
  DuplicateRemoverTool,
  Base64TextTool,
  UrlEncoderTool,
  MarkdownEditorTool,
  TextToHandwritingTool,
  BionicReadingTool,
  WhitespaceRemoverTool,
  TextAlphabetizerTool,
  ReverseTextTool,
  AsciiArtTool,
  HtmlEntityTool,
  MorseCodeTool,
  StringObfuscatorTool,
  BinaryTranslatorTool,
  ZalgoTextTool,
  PhoneticAlphabetTool,
  TextStatisticsTool,
  NumberToWordsTool,
} from './tools/TextTools';
import {
  BoxShadowTool,
  GradientGeneratorTool,
  GlassmorphismTool,
  NeumorphismTool,
  BorderRadiusTool,
  ClipPathTool,
  WaveBlobTool,
  CssTriangleTool,
  CssSwitchTool,
  CubicBezierTool,
  TextGlitchTool,
  CssAnimationTool,
  FlexboxPlaygroundTool,
  GridGeneratorTool,
} from './tools/CssTools';
import {
  JsonFormatterTool,
  CodeMinifierTool,
  SqlFormatterTool,
  TimestampConverterTool,
  UuidGeneratorTool,
  JwtDecoderTool,
  HashGeneratorTool,
  CronBuilderTool,
  CodeToImageTool,
  CsvJsonTool,
  ReactNativeShadowTool,
  XmlJsonTool,
  CodeFormatterTool,
} from './tools/CodingTools';
import {
  ColorPaletteTool,
  ColorConverterTool,
  ContrastCheckerTool,
  ImageColorExtractorTool,
  ColorBlindnessTool,
  ColorHarmoniesTool,
  TailwindColorTool,
  ColorShadesTool,
  ColorBlenderTool,
} from './tools/ColorTools';
import {
  ImageCropperTool,
  ImageFiltersTool,
  ImageToBase64Tool,
  Base64ToImageTool,
  PhotoCensorTool,
  SvgToPngTool,
  SvgPatternTool,
  ImageCaptionTool,
} from './tools/ImageTools';
import {
  QrCodeGeneratorTool,
  YoutubeThumbnailTool,
  TweetMockupTool,
  MetaTagGeneratorTool,
  UtmBuilderTool,
  InstagramPostMockupTool,
  SocialPostLengthTool,
  OpenGraphPreviewTool,
} from './tools/ImageSocialTools';
import {
  PercentageCalculatorTool,
  AspectRatioTool,
  StorageConverterTool,
  RomanNumeralTool,
  TimeDifferenceTool,
  LoremIpsumGeneratorTool,
  SubnetCalculatorTool,
  LengthWeightUnitConverterTool,
  DiscountTaxCalculatorTool,
} from './tools/MathTools';
import {
  AiTextEnhancerTool,
  AiRegexTool,
  AiCodeExplainerTool,
} from './tools/AiTools';
import {
  WhoisLookupTool,
  DnsLookupTool,
  PingLatencyTool,
  IpSubnetCalculatorTool,
  MyIpLookupTool,
  HttpHeadersTool,
  SslCheckerTool,
  MacLookupTool,
  PortReferenceTool,
  UserAgentParserTool,
  UrlAnalyzerTool,
  BandwidthCalculatorTool,
} from './tools/NetworkTools';

interface ToolViewerProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  onBack: () => void;
  onSelectTool: (tool: ToolItem) => void;
  allTools: ToolItem[];
}

export function ToolViewer({
  tool,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSelectTool,
  allTools,
}: ToolViewerProps) {
  // Render specific tool implementation
  const renderToolComponent = () => {
    switch (tool.id) {
      // 1. Text Tools
      case 'case-converter':
        return <CaseConverterTool />;
      case 'word-counter':
        return <WordCounterTool />;
      case 'slug-generator':
        return <SlugGeneratorTool />;
      case 'lorem-generator':
      case 'lorem-ipsum':
        return <LoremGeneratorTool />;
      case 'text-diff':
        return <TextDiffTool />;
      case 'morse-code':
        return <MorseCodeTool />;
      case 'text-sorter':
      case 'text-alphabetizer':
        return <TextAlphabetizerTool />;
      case 'duplicate-remover':
        return <DuplicateRemoverTool />;
      case 'whitespace-remover':
        return <WhitespaceRemoverTool />;
      case 'string-obfuscator':
        return <StringObfuscatorTool />;
      case 'binary-translator':
      case 'binary-converter':
        return <BinaryTranslatorTool />;
      case 'zalgo-text':
        return <ZalgoTextTool />;
      case 'ascii-art':
        return <AsciiArtTool />;
      case 'markdown-editor':
      case 'markdown-preview':
        return <MarkdownEditorTool />;
      case 'phonetic-alphabet':
      case 'nato-phonetic':
        return <PhoneticAlphabetTool />;
      case 'text-statistics':
      case 'readability-analyzer':
        return <TextStatisticsTool />;
      case 'number-to-words':
        return <NumberToWordsTool />;
      case 'base64-text':
      case 'base64-encoder':
        return <Base64TextTool />;
      case 'url-encoder':
        return <UrlEncoderTool />;
      case 'text-handwriting':
      case 'text-to-handwriting':
        return <TextToHandwritingTool />;
      case 'bionic-reading':
        return <BionicReadingTool />;
      case 'reverse-text':
        return <ReverseTextTool />;
      case 'html-entity':
        return <HtmlEntityTool />;

      // 2. Image Tools
      case 'image-cropper':
        return <ImageCropperTool />;
      case 'image-filters':
        return <ImageFiltersTool />;
      case 'image-to-base64':
        return <ImageToBase64Tool />;
      case 'base64-to-image':
        return <Base64ToImageTool />;
      case 'photo-censor':
        return <PhotoCensorTool />;
      case 'svg-to-png':
        return <SvgToPngTool />;
      case 'svg-pattern':
        return <SvgPatternTool />;
      case 'image-caption':
        return <ImageCaptionTool />;
      case 'svg-blob':
      case 'wave-blob':
        return <WaveBlobTool />;
      case 'image-color-extractor':
        return <ImageColorExtractorTool />;

      // 3. CSS Tools
      case 'box-shadow':
        return <BoxShadowTool />;
      case 'gradient-generator':
        return <GradientGeneratorTool />;
      case 'glassmorphism':
        return <GlassmorphismTool />;
      case 'neumorphism':
        return <NeumorphismTool />;
      case 'border-radius':
        return <BorderRadiusTool />;
      case 'clip-path':
        return <ClipPathTool />;
      case 'css-triangle':
        return <CssTriangleTool />;
      case 'css-switch':
        return <CssSwitchTool />;
      case 'cubic-bezier':
        return <CubicBezierTool />;
      case 'text-glitch':
        return <TextGlitchTool />;
      case 'css-animation':
        return <CssAnimationTool />;
      case 'flexbox-generator':
        return <FlexboxPlaygroundTool />;
      case 'grid-generator':
        return <GridGeneratorTool />;

      // 4. Coding Tools
      case 'json-formatter':
        return <JsonFormatterTool />;
      case 'code-minifier':
      case 'html-minifier':
        return <CodeMinifierTool />;
      case 'sql-formatter':
        return <SqlFormatterTool />;
      case 'timestamp-converter':
        return <TimestampConverterTool />;
      case 'uuid-generator':
        return <UuidGeneratorTool />;
      case 'jwt-decoder':
      case 'jwt-debugger':
        return <JwtDecoderTool />;
      case 'hash-generator':
        return <HashGeneratorTool />;
      case 'cron-builder':
        return <CronBuilderTool />;
      case 'code-to-image':
        return <CodeToImageTool />;
      case 'csv-json':
        return <CsvJsonTool />;
      case 'react-native-shadow':
        return <ReactNativeShadowTool />;
      case 'xml-json':
        return <XmlJsonTool />;
      case 'code-formatter':
        return <CodeFormatterTool />;

      // 5. Color Tools
      case 'color-palette':
        return <ColorPaletteTool />;
      case 'color-converter':
        return <ColorConverterTool />;
      case 'contrast-checker':
        return <ContrastCheckerTool />;
      case 'color-blindness':
        return <ColorBlindnessTool />;
      case 'color-harmonies':
        return <ColorHarmoniesTool />;
      case 'tailwind-color':
        return <TailwindColorTool />;
      case 'color-shades':
        return <ColorShadesTool />;
      case 'color-gradient':
        return <ColorBlenderTool />;

      // 6. Social Tools
      case 'qr-generator':
        return <QrCodeGeneratorTool />;
      case 'youtube-thumbnail':
      case 'youtube-embed':
        return <YoutubeThumbnailTool />;
      case 'tweet-mockup':
        return <TweetMockupTool />;
      case 'instagram-mockup':
        return <InstagramPostMockupTool />;
      case 'social-post-length':
        return <SocialPostLengthTool />;
      case 'open-graph-preview':
        return <OpenGraphPreviewTool />;
      case 'meta-tag-generator':
      case 'meta-tags':
        return <MetaTagGeneratorTool />;
      case 'utm-builder':
        return <UtmBuilderTool />;

      // 7. Math & Utilities
      case 'percentage-calculator':
        return <PercentageCalculatorTool />;
      case 'discount-calculator':
        return <DiscountTaxCalculatorTool />;
      case 'aspect-ratio':
        return <AspectRatioTool />;
      case 'storage-converter':
        return <StorageConverterTool />;
      case 'unit-converter':
        return <LengthWeightUnitConverterTool />;
      case 'roman-numeral':
        return <RomanNumeralTool />;
      case 'time-difference':
        return <TimeDifferenceTool />;
      case 'subnet-calculator':
        return <SubnetCalculatorTool />;

      // 8. AI Tools
      case 'ai-text-enhancer':
        return <AiTextEnhancerTool />;
      case 'ai-regex':
        return <AiRegexTool />;
      case 'ai-code-explainer':
        return <AiCodeExplainerTool />;

      // 9. Network Tools
      case 'whois-lookup':
        return <WhoisLookupTool />;
      case 'dns-lookup':
        return <DnsLookupTool />;
      case 'ping-tester':
        return <PingLatencyTool />;
      case 'ip-subnet-calc':
        return <IpSubnetCalculatorTool />;
      case 'my-ip-lookup':
        return <MyIpLookupTool />;
      case 'http-headers':
        return <HttpHeadersTool />;
      case 'ssl-checker':
        return <SslCheckerTool />;
      case 'mac-lookup':
        return <MacLookupTool />;
      case 'port-reference':
        return <PortReferenceTool />;
      case 'user-agent-parser':
        return <UserAgentParserTool />;
      case 'url-analyzer':
        return <UrlAnalyzerTool />;
      case 'bandwidth-calculator':
        return <BandwidthCalculatorTool />;

      default:
        return (
          <div className="p-8 text-center text-[#6B7280]">
            Tool workspace under construction.
          </div>
        );
    }
  };

  const { user, activeWorkspace, saveSnippet } = useAuth();
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetContent, setSnippetContent] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveToVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippetTitle.trim() || !snippetContent.trim()) return;

    await saveSnippet({
      toolId: tool.id,
      toolName: tool.name,
      title: snippetTitle.trim(),
      content: snippetContent.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowVaultModal(false);
      setSnippetTitle('');
      setSnippetContent('');
    }, 1500);
  };

  const relatedTools = allTools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4);

  return (
    <div id="tool-viewer-container" className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Neumorphic Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#cbd5e1]/40 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl neu-convex-xs text-[#64748B] hover:text-[#6C63FF] dark:hover:text-[#8B84FF] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span>/</span>
            <span className="capitalize text-[#64748B]">{tool.category.replace('_', ' ')}</span>
            <span>/</span>
            <span className="text-[#1E293B] dark:text-white font-bold">{tool.name}</span>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Sculpted Inset Icon Well */}
            <div className="w-12 h-12 rounded-2xl neu-pressed-deep text-[#6C63FF] flex items-center justify-center shrink-0">
              <DynamicIcon name={tool.icon} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">
                  {tool.name}
                </h1>
                {tool.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase neu-convex-xs text-[#6C63FF]">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-0.5">
                {tool.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Save to Team Vault Button */}
          <button
            type="button"
            onClick={() => setShowVaultModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold neu-convex-sm text-[#6C63FF] dark:text-[#8C82FF] hover:text-[#5247e6] transition-all cursor-pointer"
            title="Save snippet or payload to team vault"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save to Team Vault</span>
          </button>

          {/* Favorite Action Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(tool.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              isFavorite
                ? 'neu-pressed text-amber-500'
                : 'neu-convex-sm text-[#475569] dark:text-slate-300 hover:text-amber-500'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Save to Team Vault Modal Dialog */}
      {showVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[#EBECF0] dark:bg-[#1E222B] neu-raised-lg border border-white/40 dark:border-white/5 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D1D9E6]/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-[#6C63FF]" />
                <h3 className="text-sm font-black text-[#2D3748] dark:text-slate-100">
                  Save Payload to Team Vault
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVaultModal(false)}
                className="p-1 rounded-lg text-[#718096] hover:text-[#2D3748] dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveToVault} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#64748B]">Snippet Title</label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. Production Config for ${tool.name}`}
                  value={snippetTitle}
                  onChange={e => setSnippetTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#64748B]">Payload / Configuration Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste or write the snippet content, regex, color palette, or payload to sync with your team..."
                  value={snippetContent}
                  onChange={e => setSnippetContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep font-mono text-xs text-[#2D3748] dark:text-slate-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#718096] dark:text-slate-400">
                  Syncs to {activeWorkspace?.name || 'Active Team Workspace'}
                </span>

                <button
                  type="submit"
                  disabled={!snippetTitle.trim() || !snippetContent.trim()}
                  className="px-5 py-2 rounded-xl font-bold text-xs neu-btn-primary inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save to Vault</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Main Interactive Tool Body in Neumorphic Card */}
      <div className="neu-flat rounded-[32px] p-6 sm:p-8">
        {renderToolComponent()}
      </div>

      {/* Related Tools Recommendation */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#cbd5e1]/40 dark:border-slate-800">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B]">
            More in {tool.category.replace('_', ' ').toUpperCase()}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map(rel => (
              <button
                key={rel.id}
                type="button"
                onClick={() => onSelectTool(rel)}
                className="p-4 rounded-2xl neu-flat neu-convex-hover text-left transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl neu-pressed-deep text-[#6C63FF] flex items-center justify-center shrink-0">
                  <DynamicIcon name={rel.icon} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-display text-xs font-bold text-[#1E293B] dark:text-white truncate block group-hover:text-[#6C63FF]">
                    {rel.name}
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400 line-clamp-1 mt-0.5">
                    {rel.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
