import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/chatService';
import { sound } from '../utils/audio';

interface NexoraChatbotProps {
  onBookClick: () => void;
}

export const NexoraChatbot: React.FC<NexoraChatbotProps> = ({ onBookClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hey there! 🚀 I am SO thrilled to welcome you to Nexora! What we build here is truly a game-changer for ambitious businesses—from custom, ultra-fast websites that load in under 0.8 seconds and convert at triple the industry average (+310% engagement!), to official Meta Cloud API WhatsApp sales bots that capture leads 24/7!\n\nTell me a little about your business or dream project—I would be overjoyed to show you the exact architecture Nexora can engineer to scale your brand!',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const reply = await sendChatMessage(history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      sound.playSuccess();
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content:
          'I am here to explain Nexora Agency. Please let me know how I can assist with our web design, WhatsApp bots, or private business AI solutions.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '🚀 Tell me all about Nexora!',
    '⚡ Why is a Nexora website a game-changer?',
    '🤖 How does your WhatsApp bot automate sales?',
    '📅 How fast can we launch my project?',
  ];

  const renderLineWithBold = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-neutral-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n\n').map((paragraph, pIdx) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h4 key={pIdx} className="font-bold text-neutral-900 text-xs mt-2.5 mb-1 pb-0.5 border-b border-white/60">
            {paragraph.replace('### ', '')}
          </h4>
        );
      }
      return (
        <div key={pIdx} className="mb-2 leading-relaxed last:mb-0">
          {paragraph.split('\n').map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {renderLineWithBold(line)}
            </React.Fragment>
          ))}
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Glassmorphic Shimmering Button) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              sound.playClick();
              setIsOpen(true);
            }}
            className="px-5 py-3.5 glass-btn-fab flex items-center gap-2.5 cursor-pointer text-xs font-bold uppercase tracking-wider text-neutral-900 group"
            aria-label="Open Nexora AI Chatbot"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span>Ask About Nexora 🚀</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}
      </div>

      {/* Floating Glassmorphic Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[470px] h-[650px] max-h-[88vh] glass-chat-window flex flex-col overflow-hidden animate-fadeIn">
          {/* Glass Header */}
          <div className="px-5 py-4 border-b border-white/80 bg-white/50 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm border border-white/30">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-neutral-900">Nexora Strategist</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-neutral-500 font-medium">Digital Systems & Growth Architect</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsOpen(false);
                }}
                className="p-1.5 glass-btn-neutral rounded-lg text-neutral-600 hover:text-neutral-900 cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-left text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg glass-chip flex items-center justify-center text-amber-800 shrink-0 mt-0.5 border border-white/90">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[86%] p-4 leading-relaxed rounded-2xl ${
                    msg.role === 'user'
                      ? 'glass-bubble-user text-white'
                      : 'glass-bubble-bot text-neutral-800'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div>{renderFormattedContent(msg.content)}</div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 shrink-0 mt-0.5 border border-orange-200 shadow-2xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg glass-chip flex items-center justify-center text-amber-800 shrink-0 border border-white/90">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3.5 glass-bubble-bot rounded-2xl text-neutral-600 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Preparing in-depth architectural breakdown...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Topic Chips (Glassmorphic Pills) */}
          <div className="px-4 py-2 border-t border-white/70 bg-white/40 backdrop-blur-md flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1.5 glass-chip text-[11px] font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-white/90 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar (Glassmorphic Frosted Glass Base + Glassmorphic Send Button) */}
          <div className="p-3.5 border-t border-white/80 bg-white/60 backdrop-blur-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for an architectural breakdown or how Nexora helps..."
                  className="w-full px-4 py-2.5 glass-input-container rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 glass-btn-yellow text-neutral-900 disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 px-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-neutral-400" />
                <span>Specialized in Business Growth & Web Architecture</span>
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsOpen(false);
                  onBookClick();
                }}
                className="text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Book Call</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
