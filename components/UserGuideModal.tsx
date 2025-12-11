import React from 'react';
import { Icon } from './Icon';
import { GuideContent } from './GuideContent';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121215] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#121215]/95 border-b border-white/5 backdrop-blur">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon name="Compass" className="text-purple-400" />
            The AI Council: Boost Your Autonomy Ratio from 1:1 to 1:10+
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-10">
          <GuideContent />
        </div>
      </div>
    </div>
  );
};