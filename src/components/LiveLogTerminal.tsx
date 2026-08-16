import React, { useState, useEffect, useRef } from 'react';
import { BotLog } from '../types';
import { Terminal, Trash2, Shield, Sparkles, Filter, CheckCircle } from 'lucide-react';

interface LiveLogTerminalProps {
  logs: BotLog[];
  onClearLogs: () => void;
}

export const LiveLogTerminal: React.FC<LiveLogTerminalProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<'all' | 'action' | 'loot' | 'warning'>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.type === filter);

  const getLogBadge = (type: BotLog['type']) => {
    switch (type) {
      case 'loot':
        return <span className="text-purple-400 font-bold font-mono">[LOOT]</span>;
      case 'action':
        return <span className="text-red-400 font-bold font-mono">[MARCH]</span>;
      case 'warning':
        return <span className="text-yellow-400 font-bold font-mono">[STAMINA]</span>;
      case 'error':
        return <span className="text-red-500 font-bold font-mono">[CRITICAL]</span>;
      default:
        return <span className="text-zinc-400 font-bold font-mono">[RADAR]</span>;
    }
  };

  return (
    <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-lg flex flex-col h-[380px]">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-zinc-900 text-red-500 border border-zinc-800">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black text-white uppercase tracking-tight">Console Logs</span>
          <span className="text-zinc-500 font-mono text-[10px]">[{logs.length} EVENTS]</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-[#0A0B0D] p-0.5 rounded border border-zinc-800 text-[10px] font-mono uppercase">
            {(['all', 'action', 'loot', 'warning'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded transition ${
                  filter === f
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-800 transition"
            title="Clear Console Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 bg-[#0A0B0D] rounded p-3 overflow-y-auto font-mono text-[11px] space-y-2 border border-zinc-800 shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-600 text-center py-12 italic uppercase text-[10px] tracking-wider">
            [14:21:00] Standing by for user input... Press ENGAGE BOT or F10.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-zinc-900/50 p-1 rounded">
              <span className="text-zinc-500 text-[10px] shrink-0">[{log.timestamp}]</span>
              <span className="shrink-0 text-[10px]">{getLogBadge(log.type)}</span>
              <span className="text-zinc-300 break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
