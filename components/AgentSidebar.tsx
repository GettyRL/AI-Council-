import React, { useMemo } from 'react';
import { AgentRole, AgentConfig } from '../types';
import { Icon } from './Icon';

interface AgentSidebarProps {
  currentAgent: AgentRole | null;
  status: 'idle' | 'active' | 'completed';
  agents: Record<string, AgentConfig>;
  templateName: string;
  consensusScore?: number;
}

export const AgentSidebar: React.FC<AgentSidebarProps> = ({ currentAgent, status, agents, templateName, consensusScore }) => {
  const agentList = Object.values(agents);

  return (
    <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6 p-6 border-r border-white/10 bg-[#0f0f13] overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Expert Council
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase tracking-widest border border-white/5">
            {templateName}
          </span>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Council Consensus</h3>
        
        <div className="flex items-end gap-2 mb-2">
           <span className="text-2xl font-bold text-white">
             {consensusScore ? `${consensusScore}%` : '--'}
           </span>
           <span className="text-xs text-gray-500 mb-1">alignment</span>
        </div>
        
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
               (consensusScore || 0) > 75 ? 'bg-green-500' : (consensusScore || 0) > 50 ? 'bg-amber-500' : 'bg-red-500'
            }`} 
            style={{ width: `${consensusScore || 0}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {agentList.map((agent) => {
          const isActive = currentAgent === agent.id;
          
          return (
            <div 
              key={agent.id}
              className={`
                relative overflow-hidden rounded-xl p-4 border transition-all duration-500
                ${isActive 
                  ? 'bg-white/5 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                  : 'bg-transparent border-white/5 opacity-60 hover:opacity-80'
                }
              `}
            >
              <div className="relative flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-black/40 ${agent.color}`}>
                  <Icon name={agent.iconName} size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {agent.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{agent.title}</p>
                </div>
                {isActive && (
                   <div className="ml-auto">
                     <Icon name="Loader2" className="animate-spin text-purple-400" size={16} />
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Workflow</h4>
        <div className="text-xs text-gray-400 space-y-3">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span>Strategy & Planning</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Execution & Drafts</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                <span>Critique & Risk Check</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                <span>Final Synthesis</span>
            </div>
        </div>
      </div>
    </div>
  );
};