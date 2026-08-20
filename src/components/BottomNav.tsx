import React from 'react';
import { Compass, Image as ImageIcon, User } from 'lucide-react';
import { ViewMode } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems: Array<{ id: ViewMode; label: string; icon: React.ElementType; isAction?: boolean }> = [
    { id: 'feed', label: 'Galeri', icon: Compass },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#082032] border-t border-[#334756]/40 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className="relative -top-5 flex flex-col items-center justify-center bg-[#2C394B] text-white w-12 h-12 rounded-full shadow-lg border-4 border-[#FF4C29] transform transition-transform active:scale-95"
                aria-label={item.label}
              >
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white/80'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
