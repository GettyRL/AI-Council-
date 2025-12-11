import React, { useState, KeyboardEvent } from 'react';
import { Icon } from './Icon';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 md:p-6 border-t border-white/10 bg-[#0f0f13]">
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative flex items-end gap-2 bg-[#18181b] rounded-lg p-2 border border-white/10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Council is deliberating..." : "Describe your task for the council..."}
            disabled={disabled}
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 text-sm p-3 focus:outline-none resize-none min-h-[50px] max-h-[150px]"
            rows={1}
            style={{ minHeight: '50px' }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className={`
              p-3 rounded-md transition-all duration-300
              ${disabled || !input.trim() 
                ? 'text-gray-600 bg-white/5 cursor-not-allowed' 
                : 'text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20'
              }
            `}
          >
            {disabled ? <Icon name="Loader2" className="animate-spin" size={18} /> : <Icon name="Send" size={18} />}
          </button>
        </div>
        <div className="text-right mt-2">
            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">
                {disabled ? 'System Active' : 'System Ready'}
            </span>
        </div>
      </div>
    </div>
  );
};