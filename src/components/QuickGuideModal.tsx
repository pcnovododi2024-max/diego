import React from 'react';
import { X, Monitor, ShieldCheck, Zap, Crosshair, Play, CheckCircle2 } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                1360 × 768 Screen Optimization & Setup Guide
              </h2>
              <p className="text-xs text-slate-400">Total Battle Crypt Rider Best Practices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Sections */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Set Monitor & Game Resolution
            </h3>
            <p>
              Your monitor is <strong>1360 × 768</strong> pixels (standard 16:9 laptop/desktop display).
              To ensure all automation clicks land on the exact Watchtower buttons:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li>In Windows: Set <strong>Display Scale to 100%</strong> (avoid 125% or 150% DPI scaling).</li>
              <li>Open Total Battle and maximize the window so it spans the entire 1360x768 area.</li>
              <li>Set the in-game language to <strong>English</strong> so modal layouts remain standard.</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              2. Calibrating Coordinate Targets
            </h3>
            <p>
              Under the <strong>"1360x768 Calibration"</strong> tab in this app, you will find interactive pins for Watchtower, Search button, Level selectors, Captain slots (1 to 6), and the March dispatch trigger.
            </p>
            <p>
              You can test click on any pin to view the ripple animation and nudge any coordinate by +/- 2 pixels if your taskbar is placed on the side.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. Anti-Detection & Safe Farming
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li><strong>Humanized Delays:</strong> The bot injects randomized 150ms-450ms pauses and +/- 2px jitter to prevent geometric pattern detection.</li>
              <li><strong>Hotkeys:</strong> Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">F10</kbd> to Start, <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">F11</kbd> to Pause, and <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-300 font-mono">F12</kbd> for Emergency Kill.</li>
              <li><strong>Stamina Management:</strong> Enable Auto Stamina Potions to keep the exploration cycle flowing indefinitely while you sleep or work.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
          >
            Got it, Let's Farm Crypts!
          </button>
        </div>
      </div>
    </div>
  );
};
