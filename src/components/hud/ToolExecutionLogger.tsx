'use client';

import React from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { Terminal, CheckCircle2, XCircle, Clock, Code, X } from 'lucide-react';

interface ToolExecutionLoggerProps {
  onClose: () => void;
}

export function ToolExecutionLogger({ onClose }: ToolExecutionLoggerProps) {
  const { toolExecutionLogs } = useGymStore();

  return (
    <div className="fixed bottom-24 left-6 z-50 w-full max-w-lg animate-slideUp">
      <div className="stark-card rounded-2xl p-5 border-stark-cyan shadow-2xl bg-surface-300/95 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-stark-cyan/20 text-stark-cyan">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase">
                WebMCP Live Tool Execution Telemetry
              </h4>
              <span className="text-[10px] font-mono text-stark-cyan">
                DOM protocol logs • document.modelContext
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logs List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {toolExecutionLogs.length > 0 ? (
            toolExecutionLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-surface-100/90 border border-border-subtle text-xs font-mono"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-stark-emerald" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-stark-red" />
                    )}
                    <span className="font-bold text-stark-orange">{log.toolName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.latencyMs}ms
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div className="bg-surface-200/90 p-2 rounded-lg text-[10px] text-gray-300 overflow-x-auto border border-border-subtle/50">
                  <span className="text-gray-500 font-bold block mb-0.5">// Parameters</span>
                  <pre>{JSON.stringify(log.parameters, null, 2)}</pre>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs font-mono text-gray-400">
              No WebMCP tools invoked yet. Try a scenario preset or prompt the agent!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
