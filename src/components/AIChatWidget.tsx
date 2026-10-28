import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  PhoneCall, 
  ShoppingBag, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface AIChatWidgetProps {
  onSelectProduct: (product: Product | any) => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ 
  onSelectProduct, 
  externalPrompt, 
  onClearExternalPrompt 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorId] = useState(() => {
    let id = localStorage.getItem('isuku_visitor_id');
    if (!id) {
      id = `vis-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('isuku_visitor_id', id);
    }
    return id;
  });

  const { addToCart } = useCart();
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load existing conversation or set initial welcome
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/ai/conversation/${visitorId}`);
        const data = await res.json();
        if (data.conversation && data.conversation.messages.length > 0) {
          setMessages(data.conversation.messages);
        } else {
          setMessages([
            {
              id: 'msg-init',
              role: 'assistant',
              content: 'Hello! 👋 Welcome to Isuku Pure. I am your AI sales assistant. I can help you find the right cleaning product, compare prices, calculate bulk orders, and place an order. What would you like to clean today?',
              timestamp: new Date().toISOString(),
              suggestedActions: [
                'Recommend dishwashing soap',
                'Calculate 20L restaurant order',
                'Do you deliver to Kigali?',
                'Wholesale pricing for hotels'
              ]
            }
          ]);
        }
      } catch {
        setMessages([
          {
            id: 'msg-init-fallback',
            role: 'assistant',
            content: 'Hello! 👋 Welcome to Isuku Pure. I am your AI sales assistant. How can I help you with our Rwandan-manufactured liquid soap solutions today?',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    };

    fetchConversation();
  }, [visitorId]);

  // Handle external prompt trigger (e.g. "Ask AI About This Product")
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      sendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          message: text,
          language
        })
      });

      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, data.reply]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I am having trouble connecting to our live server right now. You can chat directly with our human sales team on WhatsApp at +250 788 123 456.',
          timestamp: new Date().toISOString(),
          isEscalated: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    sendMessage(q);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full p-3.5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 group cursor-pointer border border-emerald-600/40"
          aria-label="Open AI Sales Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
          </div>
          <span className="font-semibold text-xs pr-1 hidden sm:inline-block">
            Ask AI Sales Agent
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading">Isuku AI Sales Assistant</h3>
                <p className="text-[11px] text-emerald-200/90 flex items-center gap-1.5">
                  <span>Factory Direct · Kigali</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([
                  {
                    id: 'msg-reset',
                    role: 'assistant',
                    content: 'Chat refreshed. How can I assist you with our liquid soaps, sizes, or wholesale discounts today?',
                    timestamp: new Date().toISOString(),
                    suggestedActions: [
                      'Recommend dishwashing soap',
                      'Calculate 20L restaurant order',
                      'Do you deliver to Kigali?'
                    ]
                  }
                ])}
                title="Restart chat"
                className="p-1.5 text-emerald-300 hover:text-white rounded-md hover:bg-emerald-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-300 hover:text-white rounded-md hover:bg-emerald-800 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.role === 'user' 
                      ? 'bg-emerald-800 text-white rounded-br-xs' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Embedded Recommended Product Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                        Matching Solutions:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.recommendedProducts.map((p) => (
                          <div 
                            key={p.id}
                            className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-md bg-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-slate-900 truncate text-[11px]">
                                {p.name}
                              </h5>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-mono-nums font-bold text-emerald-800 text-xs">
                                  {p.priceRwf.toLocaleString()} RWF ({p.size})
                                </span>
                                <button
                                  onClick={() => addToCart({
                                    productId: p.id,
                                    productSlug: p.slug,
                                    name: p.name,
                                    category: 'liquid-soap',
                                    size: p.size,
                                    sku: `${p.id}-${p.size}`,
                                    unitPriceRwf: p.priceRwf,
                                    image: p.image
                                  })}
                                  className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  <ShoppingBag className="w-2.5 h-2.5" /> +Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Embedded Live Quote Breakdown */}
                  {msg.quoteDetails && (
                    <div className="mt-3 pt-2 border-t border-slate-100 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 text-[11px]">
                      <div className="font-bold text-emerald-950 mb-1">
                        Quotation Summary (Live Factory Rates):
                      </div>
                      <div className="space-y-1 text-slate-600">
                        {msg.quoteDetails.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="truncate pr-2">{it.name} ({it.size}) x{it.qty}</span>
                            <span className="font-mono-nums font-semibold shrink-0">{it.total.toLocaleString()} RWF</span>
                          </div>
                        ))}
                        {msg.quoteDetails.savings > 0 && (
                          <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-emerald-200">
                            <span>Bulk Savings:</span>
                            <span className="font-mono-nums">-{msg.quoteDetails.savings.toLocaleString()} RWF</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-emerald-200">
                          <span>Quoted Total:</span>
                          <span className="font-mono-nums text-emerald-900">{msg.quoteDetails.finalTotal.toLocaleString()} RWF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Human Escalation Link */}
                  {msg.isEscalated && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <a
                        href="https://wa.me/250788123456?text=Hello%20Isuku%20Pure%20Sales%20Team%2C%20I%20would%20like%20to%20connect%20regarding%20an%20order"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-800 text-white font-semibold text-[11px] hover:bg-emerald-900 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Chat with Human Sales on WhatsApp
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}

                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Quick Action Chips from latest message */}
            {messages.length > 0 && messages[messages.length - 1]?.suggestedActions && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {messages[messages.length - 1].suggestedActions!.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(action)}
                    className="text-[11px] font-medium text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[11px] text-slate-500">Isuku Agent is checking inventory...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about products, sizes, prices..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-700"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-slate-400 text-center mt-1.5">
              Available in English, Kinyarwanda & French · Real-time factory pricing
            </div>
          </div>

        </div>
      )}
    </>
  );
};
