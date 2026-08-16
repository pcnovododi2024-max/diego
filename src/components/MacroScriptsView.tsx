import React, { useState } from 'react';
import { BotSettings, ScreenCoordinate } from '../types';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  Monitor, 
  AlertTriangle, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { generateAHKScript, generatePythonScript, downloadFile } from '../utils/scriptGenerator';

interface MacroScriptsViewProps {
  settings: BotSettings;
  coordinates: ScreenCoordinate[];
}

export const MacroScriptsView: React.FC<MacroScriptsViewProps> = ({
  settings,
  coordinates,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'ahk' | 'python'>('ahk');
  const [copied, setCopied] = useState<boolean>(false);

  const ahkCode = generateAHKScript(settings, coordinates);
  const pythonCode = generatePythonScript(settings, coordinates);

  const activeCode = selectedFormat === 'ahk' ? ahkCode : pythonCode;
  const activeFileName = selectedFormat === 'ahk' ? 'CryptRider_1360x768.ahk' : 'crypt_rider_1360x768.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(activeCode, activeFileName, 'text/plain');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              Macro & Automation Script Exporter
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold uppercase">
                1360 × 768 READY
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Export standalone AutoHotkey v2 or Python bot scripts calibrated exactly with your current 1360x768 coordinates.
            </p>
          </div>
        </div>

        {/* Format Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-[#0A0B0D] p-1 rounded border border-zinc-800">
            <button
              onClick={() => setSelectedFormat('ahk')}
              className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition ${
                selectedFormat === 'ahk'
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              AutoHotkey (.ahk)
            </button>
            <button
              onClick={() => setSelectedFormat('python')}
              className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition ${
                selectedFormat === 'python'
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Python 3 (.py)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-bold uppercase text-zinc-200 border border-zinc-800 transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_12px_rgba(220,38,38,0.4)] transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download {activeFileName}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-[#0A0B0D] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-[#0F1116] px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
            <Terminal className="w-4 h-4 text-red-500" />
            <span className="font-bold text-white uppercase">{activeFileName}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 uppercase">Resolution: 1360 x 768</span>
            <span className="text-zinc-600">•</span>
            <span className="text-red-400 font-bold uppercase">{settings.activeCaptainIds.length} Captains Configured</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono uppercase">
            <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-white font-bold">F10: START</span>
            <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold">F11: PAUSE</span>
            <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-red-400 font-bold">F12: KILL</span>
          </div>
        </div>

        {/* Code Content */}
        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[500px] leading-relaxed select-all">
          <code>{activeCode}</code>
        </pre>
      </div>

      {/* Setup Instructions Card for 1360x768 Screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-tight text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>How to Run AutoHotkey on 1360×768</span>
          </div>
          <ol className="list-decimal list-inside text-xs text-zinc-400 space-y-2 leading-relaxed font-sans">
            <li>Download and install <strong>AutoHotkey v2</strong> from official autohotkey.com.</li>
            <li>Click <strong>"Download CryptRider_1360x768.ahk"</strong> above.</li>
            <li>Launch your <strong>Total Battle</strong> game client on your 1360x768 monitor.</li>
            <li>Double-click the <code className="bg-[#0A0B0D] px-1 py-0.5 rounded text-red-400 font-mono">.ahk</code> script to start background listener.</li>
            <li>Press <kbd className="bg-zinc-900 px-1.5 py-0.5 rounded text-white font-mono font-bold border border-zinc-700">F10</kbd> anywhere to start automatic crypt raiding!</li>
          </ol>
        </div>

        <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-tight text-sm">
            <Zap className="w-4 h-4" />
            <span>Game Display Settings</span>
          </div>
          <ul className="list-disc list-inside text-xs text-zinc-400 space-y-2 leading-relaxed font-sans">
            <li>Set Windows Display Scaling to <strong>100%</strong> (Settings &gt; System &gt; Display &gt; Scale: 100%).</li>
            <li>Set Game Language to <strong>English</strong> (Watchtower layout requirement).</li>
            <li>Maximize Total Battle window to fill 1360x768 screen resolution.</li>
            <li>Anti-ban protection: The generated scripts include randomized human mouse jitter and micro-delays.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
