import React, { useState } from 'react';
import { Compass, BookOpen, Plus, Film, Image as ImageIcon, Library, Settings } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  userAvatar: string;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  userAvatar,
  userName,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const menuItems = [
    {
      id: 'feed' as ViewMode,
      label: 'Galeri Feed',
      icon: Compass,
      description: 'Jelajahi foto analog',
    },
    {
      id: 'my-photos' as ViewMode,
      label: 'Foto Saya',
      icon: ImageIcon,
      description: 'Koleksi foto pribadi',
    },
    {
      id: 'my-albums' as ViewMode,
      label: 'Album Saya',
      icon: Library,
      description: 'Kumpulan album roll film',
    },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex flex-col shrink-0 bg-[#622B14] text-[#E4D6A9] border-r border-[#995F2F]/30 transition-all duration-300 ease-in-out min-h-[calc(100vh-5rem)] sticky top-20 z-30 overflow-hidden shadow-xl ${
        isHovered ? 'w-64 p-4 space-y-6' : 'w-20 px-2.5 py-6 space-y-6'
      }`}
    >
      {/* Quick Action Upload Button */}
      {isHovered ? (
        <div className="px-1">
          <button
            onClick={() => onViewChange('upload')}
            className={`w-full py-3 px-4 rounded-xl bg-[#E4D6A9] text-[#622B14] font-semibold text-xs flex items-center justify-center gap-2.5 shadow-md hover:bg-[#f3e8c9] transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap ${
              currentView === 'upload' ? 'ring-2 ring-offset-2 ring-offset-[#622B14] ring-[#E4D6A9]' : ''
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3] shrink-0" />
            <span>Upload Foto Baru</span>
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={() => onViewChange('upload')}
            className="w-11 h-11 rounded-full bg-[#E4D6A9] text-[#622B14] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            title="Upload Foto Baru"
            aria-label="Upload Foto Baru"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Main Navigation Menu */}
      <div className="space-y-2">
        {isHovered && (
          <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#978F66] font-semibold mb-2 whitespace-nowrap animate-fadeIn">
            Menu Navigasi
          </p>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={!isHovered ? item.label : undefined}
              className={`w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-200 text-left font-medium ${
                isHovered ? 'px-3.5' : 'justify-center px-2'
              } ${
                isActive
                  ? 'bg-[#995F2F] text-[#E4D6A9] shadow-sm font-semibold border-l-4 border-[#E4D6A9]'
                  : 'text-[#E4D6A9]/80 hover:bg-[#995F2F]/30 hover:text-[#E4D6A9]'
              }`}
            >
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={userName}
                  className={`w-6 h-6 rounded-full object-cover shrink-0 border ${
                    isActive ? 'border-[#E4D6A9]' : 'border-[#978F66]'
                  }`}
                />
              ) : (
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#E4D6A9]' : 'text-[#978F66]'}`} />
              )}

              {isHovered && (
                <div className="flex-1 min-w-0 flex items-center justify-between animate-fadeIn">
                  <div className="truncate">
                    <span className="block truncate text-xs sm:text-sm">{item.label}</span>
                    <span className="block text-[10px] text-[#978F66] font-normal truncate">
                      {item.description}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#978F66] text-[#21120B] text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Settings & Analog Photography Brand Footer Widget */}
      <div className="mt-auto px-1 flex flex-col gap-2">
        {/* Settings Button */}
        <button
          onClick={() => onViewChange('settings')}
          className={`flex items-center gap-3 p-3 w-full rounded-2xl transition-all duration-300 group border border-transparent ${
            currentView === 'settings'
              ? 'bg-[#E4D6A9] text-[#622B14] shadow-md border-[#995F2F]/30'
              : 'text-[#E4D6A9] hover:bg-[#995F2F]/30 hover:border-[#995F2F]/50'
          }`}
          title={!isHovered ? 'Pengaturan' : undefined}
        >
          <div className="shrink-0 flex items-center justify-center relative">
            <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            {currentView === 'settings' && (
              <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-[#622B14] shadow-[0_0_0_2px_#E4D6A9]" />
            )}
          </div>
          {isHovered && (
            <div className="flex flex-col items-start truncate animate-fadeIn">
              <span className="font-semibold text-sm truncate w-full text-left">Pengaturan</span>
              <span className="text-[10px] font-medium opacity-70 truncate w-full text-left">
                Preferensi akun & privasi
              </span>
            </div>
          )}
        </button>

        {isHovered && (
          <div className="pt-2 border-t border-[#995F2F]/30 animate-fadeIn">
            <div className="bg-[#21120B]/60 p-3 rounded-xl border border-[#978F66]/30 text-[11px] text-[#E4D6A9] space-y-1">
              <div className="flex items-center gap-1.5 font-serif-display font-bold text-[#E4D6A9]">
                <Film className="w-3.5 h-3.5 text-[#995F2F] shrink-0" />
                <span>Pholet Studio</span>
              </div>
              <p className="text-[10px] text-[#978F66] leading-tight">
                Pameran karya roll film 35mm & analog photography.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
