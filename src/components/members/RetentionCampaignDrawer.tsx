'use client';

import React, { useState, useEffect } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { Sparkles, Send, X, Gift, CheckCircle2, MessageSquare, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function RetentionCampaignDrawer() {
  const { campaignQueue, dismissCampaignQueue } = useGymStore();
  const [isDispatched, setIsDispatched] = useState(false);
  const [editableMessage, setEditableMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (campaignQueue) {
      setEditableMessage(campaignQueue.generatedMessage);
      setIsEditing(false);
    }
  }, [campaignQueue]);

  if (!campaignQueue) return null;

  const handleDispatch = () => {
    setIsDispatched(true);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FF5500', '#FFAA00', '#00E5FF', '#00E676'],
    });

    setTimeout(() => {
      setIsDispatched(false);
      dismissCampaignQueue();
    }, 2500);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92%] sm:w-full max-w-md animate-slideUp">
      <div className="stark-card rounded-2xl p-4 sm:p-5 border-stark-orange shadow-2xl bg-surface-300/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-stark-orange/20 text-stark-orange shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <span>AI Retention Campaign Queue</span>
                <Sparkles className="w-3 h-3 text-stark-orange" />
              </h4>
              <span className="text-[10px] font-mono text-stark-orange">
                Generated via WebMCP • {campaignQueue.targetMemberIds.length} Target Recipient(s)
              </span>
            </div>
          </div>
          <button
            onClick={dismissCampaignQueue}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Members Chips */}
        <div className="mb-3">
          <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
            Recipients ({campaignQueue.targetMemberNames.length}):
          </span>
          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
            {campaignQueue.targetMemberNames.map((name) => (
              <span
                key={name}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-100 text-gray-200 border border-border-subtle"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Message Preview & Live Editor */}
        <div className="p-3 rounded-xl bg-surface-100 border border-border-subtle mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1.5">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-stark-cyan" />
              <span className="text-stark-cyan font-bold">AI GENERATED SMS COPY:</span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[10px] font-mono text-stark-orange hover:underline flex items-center gap-0.5"
            >
              <Edit3 className="w-2.5 h-2.5" />
              {isEditing ? 'Done' : 'Edit Copy'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={editableMessage}
              onChange={(e) => setEditableMessage(e.target.value)}
              rows={3}
              className="w-full bg-surface-200 border border-stark-orange/50 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
            />
          ) : (
            <p className="text-xs font-mono text-gray-200 leading-relaxed italic">
              "{editableMessage}"
            </p>
          )}
        </div>

        {/* Dispatch Action Button */}
        <button
          onClick={handleDispatch}
          disabled={isDispatched}
          className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            isDispatched
              ? 'bg-stark-emerald text-black shadow-hud-emerald'
              : 'bg-stark-orange hover:bg-stark-orange/90 text-black shadow-stark-glow-sm hover:scale-[1.02]'
          }`}
        >
          {isDispatched ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Campaign Dispatched ({campaignQueue.targetMemberIds.length} Blasts Sent!)
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Dispatch Campaign ({campaignQueue.targetMemberIds.length} SMS Blasts)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
