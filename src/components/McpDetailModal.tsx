import React, { useState } from 'react';
import { McpServerItem } from '../types';
import {
  X,
  Copy,
  Check,
  Terminal,
  Server,
  Settings,
  Shield,
  Layers,
  Bookmark,
  ExternalLink,
  Code2,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface McpDetailModalProps {
  server: McpServerItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault?: (title: string, content: string, type: 'mcp') => void;
}

export const McpDetailModal: React.FC<McpDetailModalProps> = ({
  server,
  isOpen,
  onClose,
  onSaveToVault,
}) => {
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'tools' | 'guide'>('config');
  const [clientType, setClientType] = useState<'claude' | 'cursor'>('claude');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamic environment variables state
  const [envValues, setEnvValues] = useState<{ [key: string]: string }>({});

  if (!isOpen || !server) return null;

  const handleEnvChange = (key: string, val: string) => {
    setEnvValues((prev) => ({ ...prev, [key]: val }));
  };

  // Generate dynamic config json based on user-entered env vars
  const generateDynamicConfig = () => {
    if (clientType === 'cursor' && server.clientConfigSample.cursorConfig) {
      return JSON.stringify({ mcpServers: server.clientConfigSample.cursorConfig }, null, 2);
    }

    const baseConfig = JSON.parse(JSON.stringify(server.clientConfigSample.claudeDesktop));
    const serverKey = Object.keys(baseConfig.mcpServers || {})[0];
    if (serverKey && baseConfig.mcpServers[serverKey]) {
      if (server.envVars && server.envVars.length > 0) {
        baseConfig.mcpServers[serverKey].env = baseConfig.mcpServers[serverKey].env || {};
        server.envVars.forEach((v) => {
          baseConfig.mcpServers[serverKey].env[v.name] = envValues[v.name] || v.placeholder || 'YOUR_KEY_HERE';
        });
      }
    }
    return JSON.stringify(baseConfig, null, 2);
  };

  const dynamicConfigString = generateDynamicConfig();

  const handleCopy = (text: string, type: 'config' | 'cli') => {
    navigator.clipboard.writeText(text);
    if (type === 'config') {
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  const handleVaultSave = () => {
    if (onSaveToVault) {
      onSaveToVault(`${server.name} (MCP Setup)`, dynamicConfigString, 'mcp');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] neu-flat bg-[#EBECF0] dark:bg-[#1E222B] border border-white/50 dark:border-white/5 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 pb-4 border-b border-[#D1D9E6]/60 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl neu-convex flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1E293B] dark:text-white">
                  {server.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                  {server.transport.toUpperCase()}
                </span>
                {server.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    {server.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 mt-1">
                {server.tagline}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl neu-convex-sm flex items-center justify-center text-[#64748B] hover:text-[#1E293B] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="px-6 py-3 bg-[#E2E5EC]/50 dark:bg-[#171A21]/50 border-b border-[#D1D9E6]/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-deep">
            <button
              type="button"
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'config'
                  ? 'neu-convex text-[#6C63FF]'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              Client Config (JSON)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tools'
                  ? 'neu-convex text-[#6C63FF]'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              Tools & Schema ({server.toolsProvided.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'neu-convex text-[#6C63FF]'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              Setup Guide
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(dynamicConfigString, 'config')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-convex-sm text-xs font-bold text-[#6C63FF] hover:scale-[1.02] cursor-pointer"
            >
              {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedConfig ? 'Copied Config' : 'Copy Config'}</span>
            </button>

            {onSaveToVault && (
              <button
                type="button"
                onClick={handleVaultSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn-primary text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Saved!' : 'Save to Vault'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'config' && (
            <div className="space-y-6">
              {/* Quick Run Command */}
              <div className="p-4 rounded-2xl neu-flat space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-[#64748B] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Direct CLI Execution</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(server.cliCommand, 'cli')}
                    className="text-[11px] font-bold text-[#6C63FF] hover:underline cursor-pointer"
                  >
                    {copiedCli ? 'Copied CLI!' : 'Copy CLI'}
                  </button>
                </div>
                <pre className="p-3 rounded-xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-cyan-300 overflow-x-auto">
                  {server.cliCommand}
                </pre>
              </div>

              {/* Environment Variables Inputs (if any) */}
              {server.envVars && server.envVars.length > 0 && (
                <div className="p-4 rounded-2xl neu-pressed-deep space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF] flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure Server Environment Variables</span>
                  </h4>
                  <div className="space-y-3">
                    {server.envVars.map((env) => (
                      <div key={env.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-[#1E293B] dark:text-white">
                            {env.name} {env.required && <span className="text-red-500">*</span>}
                          </span>
                          <span className="text-[10px] text-[#64748B]">{env.description}</span>
                        </div>
                        <input
                          type="text"
                          value={envValues[env.name] || ''}
                          onChange={(e) => handleEnvChange(env.name, e.target.value)}
                          placeholder={env.placeholder}
                          className="w-full p-2.5 rounded-xl neu-pressed font-mono text-xs text-[#1E293B] dark:text-slate-100 outline-none placeholder:text-[#64748B]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client JSON Config Selector & Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setClientType('claude')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        clientType === 'claude' ? 'neu-pressed text-[#6C63FF]' : 'neu-convex-xs text-[#64748B]'
                      }`}
                    >
                      Claude Desktop Config
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientType('cursor')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        clientType === 'cursor' ? 'neu-pressed text-[#6C63FF]' : 'neu-convex-xs text-[#64748B]'
                      }`}
                    >
                      Cursor / Cline Config
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {dynamicConfigString}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                Available Tools & Functions
              </h4>
              <div className="space-y-3">
                {server.toolsProvided.map((tool) => (
                  <div key={tool.name} className="p-4 rounded-2xl neu-flat space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-xs font-bold text-[#6C63FF]">
                        {tool.name}
                      </code>
                      <span className="text-[10px] font-mono text-[#64748B]">
                        {Object.keys(tool.parameters).length} params
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] dark:text-slate-300">
                      {tool.description}
                    </p>
                    {Object.keys(tool.parameters).length > 0 && (
                      <div className="p-2 rounded-xl neu-pressed-deep text-[11px] font-mono text-[#64748B] flex flex-wrap gap-2">
                        {Object.entries(tool.parameters).map(([param, type]) => (
                          <span key={param}>
                            <strong className="text-[#1E293B] dark:text-slate-200">{param}</strong>: {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <textarea
                readOnly
                value={server.setupGuideMarkdown}
                className="w-full h-80 p-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-slate-100 outline-none resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
