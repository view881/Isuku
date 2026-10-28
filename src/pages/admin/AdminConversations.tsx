import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Clock, ShieldCheck, Sparkles, User, RefreshCw } from 'lucide-react';
import { Conversation } from '../../types';

export const AdminConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/conversations');
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !activeConv) {
          setActiveConv(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-700" />
            AI Sales Agent Telemetry & Conversations
          </h1>
          <p className="text-xs text-slate-500">
            Audit live visitor transcripts, tool calls (lookupProducts, calculateQuote, captureLead), and conversion effectiveness.
          </p>
        </div>
        <button
          onClick={fetchConversations}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Refresh Sessions
        </button>
      </div>

      {/* Grid: Session list Left, Transcript Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List (Cols 1-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Visitor Sessions ({conversations.length})</span>
            <span className="text-[10px] text-emerald-800 font-medium">Gemini 3.8 Flash Powered</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations recorded yet.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`p-3.5 text-xs transition-colors cursor-pointer ${
                    activeConv?.id === c.id ? 'bg-emerald-50/70 border-l-4 border-emerald-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-900 truncate font-mono-nums">
                      {c.visitorId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-nums shrink-0">
                      {new Date(c.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {c.messages[c.messages.length - 1]?.content || 'Session initialized'}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono-nums">
                      {c.messages.length} msgs
                    </span>
                    {c.leadCaptured && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        Lead Captured
                      </span>
                    )}
                    {c.status === 'escalated' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        Escalated to WhatsApp
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Transcript (Cols 6-12) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          {activeConv ? (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    Transcript: {activeConv.visitorId}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono-nums">
                    Session started: {new Date(activeConv.lastActive).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono-nums">
                    Status: {activeConv.status}
                  </span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 max-h-[440px] overflow-y-auto p-2 bg-slate-50 rounded-xl text-xs">
                {activeConv.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl space-y-1 ${
                      m.role === 'user'
                        ? 'bg-emerald-800 text-white ml-6 rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 mr-6 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] font-semibold opacity-75">
                      <span>{m.role === 'user' ? 'Visitor' : 'Isuku AI Agent'}</span>
                      <span className="font-mono-nums">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="leading-relaxed whitespace-pre-wrap">{m.content}</div>

                    {m.quoteDetails && (
                      <div className="mt-2 p-2 rounded bg-emerald-50 text-slate-900 border border-emerald-200 text-[11px] font-mono-nums">
                        <div className="font-bold text-emerald-950 font-sans">Server Tool: calculateOrderQuote Execution</div>
                        <div>Quoted Total: {m.quoteDetails.finalTotal.toLocaleString()} RWF</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a conversation to review messages.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
