import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AgentRole, AgentConfig } from '../types';
import { Icon } from './Icon';

interface ChatAreaProps {
  messages: Message[];
  status: 'idle' | 'active' | 'completed';
  agents: Record<string, AgentConfig>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, status, agents }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleExport = (platform: string) => {
    alert(`Initiating export to ${platform}... (Integration Mock)`);
  };

  if (messages.length === 0 && status === 'idle') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <div className="w-24 h-24 mb-6 rounded-full bg-purple-500/10 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping opacity-20"></div>
            <Icon name="Sparkles" className="text-purple-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ready to Deliberate</h2>
        <p className="max-w-md text-gray-400">
          The expert council is assembled. State your objective to begin the multi-agent workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {messages.map((msg) => {
        const isUser = msg.role === AgentRole.USER;
        const agent = !isUser ? agents[msg.role as Exclude<AgentRole, AgentRole.USER>] : null;

        // Determine confidence color
        const conf = msg.metadata?.confidence || 0;
        const confColor = conf >= 80 ? 'text-green-400' : conf >= 50 ? 'text-amber-400' : 'text-red-400';

        return (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-4xl mx-auto`}
          >
            {/* Avatar */}
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border
              ${isUser 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-black/60 border-white/10'
              }
            `}>
              {isUser ? (
                <span className="font-bold text-xs">YOU</span>
              ) : (
                <Icon name={agent!.iconName} className={agent!.color} size={20} />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`
              flex-1 rounded-2xl p-5 border relative group
              ${isUser 
                ? 'bg-purple-600/20 border-purple-500/30 text-white rounded-tr-sm' 
                : 'glass-panel text-gray-200 rounded-tl-sm'
              }
              ${msg.isThinking ? 'animate-pulse' : ''}
            `}>
              {!isUser && (
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${agent!.color}`}>{agent!.name}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{agent!.title}</span>
                  </div>
                  {!msg.isThinking && msg.metadata?.confidence && (
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                        <Icon name="AlertTriangle" size={10} className={confColor} />
                        <span className={`text-[10px] font-mono ${confColor}`}>{conf}% CONFIDENCE</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="prose prose-invert prose-sm max-w-none">
                 {msg.isThinking ? (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Icon name="Loader2" className="animate-spin" size={16} />
                        <span>Generating analysis...</span>
                    </div>
                 ) : (
                    <>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        
                        {/* Manager Integration Bridge */}
                        {msg.role === AgentRole.MANAGER && (
                            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                                <button onClick={() => handleExport('Docs')} className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-colors text-xs text-blue-200">
                                    <Icon name="FileText" size={14} /> Export to Docs
                                </button>
                                <button onClick={() => handleExport('Jira')} className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-colors text-xs text-blue-200">
                                    <Icon name="Trello" size={14} /> Send to Jira
                                </button>
                                <button onClick={() => handleExport('Github')} className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600 transition-colors text-xs text-gray-300">
                                    <Icon name="Github" size={14} /> Create Issue
                                </button>
                            </div>
                        )}
                    </>
                 )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};