import React, { useState } from 'react';
import { Icon } from './Icon';

interface QuickStartProps {
  onStart: (industry: string, role: string, goal: string) => void;
}

const INDUSTRIES = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Media', 'Manufacturing', 'Real Estate'
];

const ROLES = [
  'Executive (CEO/CTO)', 'Product Manager', 'Marketing Lead', 'Software Engineer', 'Content Creator', 'Data Analyst', 'HR Manager', 'Sales Director'
];

export const QuickStart: React.FC<QuickStartProps> = ({ onStart }) => {
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [customIndustry, setCustomIndustry] = useState('');
  const [isCustomIndustry, setIsCustomIndustry] = useState(false);

  const [role, setRole] = useState(ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);

  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalIndustry = isCustomIndustry ? customIndustry : industry;
    const finalRole = isCustomRole ? customRole : role;

    if (goal.trim() && finalIndustry.trim() && finalRole.trim()) {
      onStart(finalIndustry, finalRole, goal);
    }
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === 'OTHER_CUSTOM') {
          setIsCustomIndustry(true);
          setCustomIndustry('');
      } else {
          setIsCustomIndustry(false);
          setIndustry(val);
      }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === 'OTHER_CUSTOM') {
          setIsCustomRole(true);
          setCustomRole('');
      } else {
          setIsCustomRole(false);
          setRole(val);
      }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>

      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
         <div className="p-1.5 rounded bg-purple-500/20 text-purple-400">
             <Icon name="Rocket" size={18} />
         </div>
         Quick Start Council
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                     <Icon name="Building2" size={12} /> Industry
                 </label>
                 {isCustomIndustry ? (
                     <div className="relative">
                        <input
                            type="text"
                            value={customIndustry}
                            onChange={(e) => setCustomIndustry(e.target.value)}
                            placeholder="Type your industry..."
                            className="w-full bg-[#18181b] text-gray-200 text-sm rounded-lg border border-purple-500/50 px-3 py-2.5 focus:outline-none focus:border-purple-500"
                            autoFocus
                        />
                        <button 
                            type="button"
                            onClick={() => setIsCustomIndustry(false)}
                            className="absolute right-2 top-2.5 text-gray-500 hover:text-white"
                        >
                            <Icon name="X" size={14} />
                        </button>
                     </div>
                 ) : (
                    <div className="relative">
                        <select 
                            value={industry}
                            onChange={handleIndustryChange}
                            className="w-full bg-[#18181b] text-gray-200 text-sm rounded-lg border border-white/10 px-3 py-2.5 appearance-none focus:outline-none focus:border-purple-500/50 hover:border-white/20 transition-colors"
                        >
                            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                            <option value="OTHER_CUSTOM" className="text-purple-300 font-semibold">+ Enter Custom Industry</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                            <Icon name="ChevronRight" size={14} className="rotate-90" />
                        </div>
                    </div>
                 )}
             </div>

             <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                     <Icon name="User" size={12} /> Your Role
                 </label>
                 {isCustomRole ? (
                     <div className="relative">
                        <input
                            type="text"
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value)}
                            placeholder="Type your role..."
                            className="w-full bg-[#18181b] text-gray-200 text-sm rounded-lg border border-purple-500/50 px-3 py-2.5 focus:outline-none focus:border-purple-500"
                            autoFocus
                        />
                         <button 
                            type="button"
                            onClick={() => setIsCustomRole(false)}
                            className="absolute right-2 top-2.5 text-gray-500 hover:text-white"
                        >
                            <Icon name="X" size={14} />
                        </button>
                     </div>
                 ) : (
                    <div className="relative">
                        <select 
                            value={role}
                            onChange={handleRoleChange}
                            className="w-full bg-[#18181b] text-gray-200 text-sm rounded-lg border border-white/10 px-3 py-2.5 appearance-none focus:outline-none focus:border-purple-500/50 hover:border-white/20 transition-colors"
                        >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            <option value="OTHER_CUSTOM" className="text-purple-300 font-semibold">+ Enter Custom Role</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                            <Icon name="ChevronRight" size={14} className="rotate-90" />
                        </div>
                    </div>
                 )}
             </div>
         </div>

         <div className="space-y-1.5">
             <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                 <Icon name="Zap" size={12} /> Objective
             </label>
             <input 
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Develop a Q3 growth strategy"
                className="w-full bg-[#18181b] text-gray-200 text-sm rounded-lg border border-white/10 px-3 py-2.5 focus:outline-none focus:border-purple-500/50 placeholder-gray-600"
             />
         </div>

         <button 
            type="submit"
            disabled={!goal.trim() || (isCustomIndustry && !customIndustry.trim()) || (isCustomRole && !customRole.trim())}
            className={`
                w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all
                ${(!goal.trim() || (isCustomIndustry && !customIndustry.trim()) || (isCustomRole && !customRole.trim()))
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20'
                }
            `}
         >
             <Icon name="Sparkles" size={16} />
             Initialize Session
         </button>
      </form>
    </div>
  );
};