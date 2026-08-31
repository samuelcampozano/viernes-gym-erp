'use client';

import React from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { Terminal, CheckCircle2, XCircle, Clock, X, Code2 } from 'lucide-react';

interface ToolExecutionLoggerProps {
  onClose: () => void;
}

export function ToolExecutionLogger({ onClose }: ToolExecutionLoggerProps) {
  const { toolExecutionLogs } = useGymStore();

  return (
    <div className="fixed bottom-24 left-4 sm:left-6 z-50 w-[94%] max-w-xl animate-slideUp">
      <div className="stark-card rounded-2xl p-4 sm:p-5 border-stark-cyan/80 shadow-2xl bg-surface-300/95 backdrop-blur-xl">
        {/* Popover Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-stark-cyan/20 text-stark-cyan border border-stark-cyan/40">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                WebMCP Live Tool Telemetry Logger
              </h4>
              <span className="text-[10px] font-mono text-stark-cyan flex items-center gap-1">
                <Code2 className="w-3 h-3" /> document.modelContext • Standard DOM Protocol
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-100 text-gray-400 hover:text-white hover:bg-surface-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logs Feed */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {toolExecutionLogs.length > 0 ? (
            toolExecutionLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-surface-100/90 border border-border-subtle text-xs font-mono transition-all hover:border-stark-cyan/40"
              >
                {/* Tool Meta Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {log.status === 'success' ? (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-stark-emerald/15 text-stark-emerald border border-stark-emerald/30 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> 200 OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-stark-red/15 text-stark-red border border-stark-red/30 font-bold text-[10px]">
                        <XCircle className="w-3 h-3" /> ERROR
                      </span>
                    )}
                    <span className="font-bold text-stark-orange text-xs">{log.toolName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1 text-stark-cyan bg-stark-cyan/10 px-1.5 py-0.5 rounded border border-stark-cyan/20">
                      <Clock className="w-3 h-3" /> {log.latencyMs}ms
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                {/* Parameters block */}
                <div className="bg-surface-200/90 p-2 rounded-lg text-[10px] text-gray-300 overflow-x-auto border border-border-subtle/50 mb-1.5">
                  <span className="text-gray-500 font-bold block mb-1">// Input Parameters</span>
                  <pre className="text-stark-cyan/90 font-mono">
                    {JSON.stringify(log.parameters, null, 2)}
                  </pre>
                </div>

                {/* Result payload block */}
                <div className="bg-surface-200/90 p-2 rounded-lg text-[10px] text-gray-300 overflow-x-auto border border-border-subtle/50">
                  <span className="text-gray-500 font-bold block mb-1">// Return Payload</span>
                  <pre className="text-gray-300 font-mono">
                    {JSON.stringify(log.result, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-surface-100/50 rounded-xl border border-dashed border-border-subtle">
              No WebMCP tools executed yet.
              <br />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Trigger a scenario preset or type a tactical command in the Viernes HUD!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
