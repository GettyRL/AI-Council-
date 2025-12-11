import React from 'react';
import { Icon } from './Icon';

export const GuideContent: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Infographic Section */}
      <div className="grid md:grid-cols-12 gap-8 items-stretch">
        
        {/* PROBLEM SIDE */}
        <div className="md:col-span-5 bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 rounded-xl p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon name="AlertTriangle" size={100} />
          </div>
          <h3 className="text-lg font-bold text-red-200 mb-2 uppercase tracking-wider">1: 10+ Productivity</h3>
          <div className="flex flex-col items-center my-8 gap-4 flex-1 justify-center">
             <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-500">
                <span className="text-2xl">👤</span>
             </div>
             <div className="h-8 w-0.5 bg-gray-700"></div>
             <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center border-2 border-blue-500/50">
                <Icon name="Sparkles" className="text-blue-400" />
             </div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20 mt-auto">
            <div className="text-xl font-bold text-white mb-1">1 Human + AI = 10x productivity gain</div>
            <p className="text-sm text-gray-400">Traditional AI offers a 1:1 ratio. One human commands one AI, limiting output and scale.</p>
          </div>
        </div>

        {/* ARROW */}
        <div className="md:col-span-1 flex items-center justify-center text-gray-600">
           <Icon name="ChevronRight" size={48} className="hidden md:block" />
           <Icon name="ChevronRight" size={24} className="md:hidden rotate-90" />
        </div>

        {/* SOLUTION SIDE */}
        <div className="md:col-span-6 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl p-6 relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon name="Crown" size={100} />
          </div>
          <h3 className="text-lg font-bold text-purple-200 mb-2 uppercase tracking-wider">The Multi-Agent Council</h3>
          <p className="text-gray-400 text-sm mb-6">Mimics an expert human team at machine speed. Agents debate, critique, and refine until consensus is reached.</p>
          
          <div className="grid grid-cols-2 gap-3 flex-1">
             <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                    <Icon name="Compass" size={16} className="text-blue-400" />
                    <span className="text-xs font-bold text-blue-200">THE PLANNER</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">Breaks down goals into executable strategic steps.</p>
             </div>
             <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                    <Icon name="Zap" size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-200">THE EXECUTOR</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">Performs the actual work (drafting, coding, calculating).</p>
             </div>
             <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                    <Icon name="ScanEye" size={16} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-200">THE CRITIC</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">Reviews for errors, logical gaps, and risks.</p>
             </div>
             <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                    <Icon name="Crown" size={16} className="text-purple-400" />
                    <span className="text-xs font-bold text-purple-200">THE MANAGER</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">Integrates feedback and delivers the final optimized result.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Value Prop Footer */}
      <div className="bg-white/5 rounded-xl p-6 text-center border border-white/5">
         <h4 className="text-xl font-bold text-white mb-2">Boost Your Autonomy Ratio</h4>
         <p className="text-gray-400 max-w-2xl mx-auto">
            Shift from being a "Doer" to a "Commander". By delegating to a council, you move from 1:1 interaction to managing a team of intelligence agents, increasing to 10x productivity and revenue gain.
         </p>
      </div>

      {/* Developer Contact */}
      <div className="flex flex-col items-center justify-center pt-8 border-t border-white/10">
          <span className="text-xs text-gray-500 uppercase tracking-widest mb-3">Developed by</span>
          <a 
            href="https://www.linkedin.com/in/gettyrl/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/30 rounded-lg transition-all duration-300 hover:scale-105"
          >
              <Icon name="Linkedin" size={20} />
              <span className="font-semibold">Getty (gettyrl)</span>
              <Icon name="ExternalLink" size={14} className="opacity-50" />
          </a>
      </div>
    </div>
  );
};