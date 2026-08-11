import React, { useState } from 'react';
import {
  Camera, 
  Search, 
  Plus,
  Compass,
  User,
  Image as ImageIcon,
  Library,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenUpload: () => void;
  userAvatar: string;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  userAvatar,
  userName,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#622B14] text-[#E4D6A9] shadow-md border-b border-[#995F2F]/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 relative">
            
            {/* Left: Web Identity (Logo Brand in Top-Left Corner) */}
            <div className="flex items-center gap-3 shrink-0 relative z-10">
              <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => onViewChange('feed')}
              >
                <div className="w-11 h-11 rounded-full bg-[#995F2F] flex items-center justify-center border-2 border-[#E4D6A9]/60 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <Camera className="w-6 h-6 text-[#E4D6A9]" />
                </div>
                <div>
                  <span className="font-serif-display text-2xl font-bold tracking-wider text-[#E4D6A9] block leading-none">
                    PHOLET
                  </span>
                  <span className="text-[10px] tracking-widest text-[#978F66] uppercase font-medium">
                    Foto Terlupakan • Abadi
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Search Bar (Primary Header Focus) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] max-w-2xl z-0">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4.5 w-4.5 text-[#978F66]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari foto, kamera, rol film (Kodak Portra 400), lokasi, tag..."
                  className="w-full pl-11 pr-10 py-2.5 bg-[#21120B]/50 border border-[#978F66]/40 rounded-full text-sm text-[#E4D6A9] placeholder-[#978F66] focus:outline-none focus:ring-2 focus:ring-[#E4D6A9] focus:border-transparent transition-all shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-[#978F66] hover:text-[#E4D6A9]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Header Quick Actions */}
            <div className="flex md:hidden items-center gap-2 relative z-20">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#E4D6A9] hover:bg-[#995F2F]/30 rounded-full"
                title="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Right: Account Profile (Desktop) */}
            <div className="hidden md:flex items-center shrink-0 z-10">
              <button
                onClick={() => onViewChange('profile')}
                className="flex items-center gap-2 hover:bg-[#995F2F]/30 p-1.5 pr-4 rounded-full transition-colors group border border-transparent hover:border-[#995F2F]/50"
              >
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover border border-[#978F66] group-hover:border-[#E4D6A9]"
                />
                <div className="text-left hidden lg:block">
                  <span className="block text-sm font-semibold text-[#E4D6A9] leading-tight truncate max-w-[120px]">
                    {userName}
                  </span>
                  <span className="block text-[10px] text-[#978F66]">Lihat Profil</span>
                </div>
              </button>
            </div>

          </div>

          {/* Mobile Search Input */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#978F66]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari foto, kamera, rol film..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#21120B]/50 border border-[#978F66]/40 rounded-full text-xs text-[#E4D6A9] placeholder-[#978F66] focus:outline-none focus:ring-1 focus:ring-[#E4D6A9]"
              />
            </div>
          </div>

        </div>
      </header>

      {/* Floating Circular Action Button (FAB) at Bottom Right */}
      <button
        onClick={onOpenUpload}
        id="fab-upload-button"
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 bg-[#E4D6A9] text-[#622B14] hover:bg-[#f3e8c9] rounded-full shadow-2xl border-2 border-[#622B14]/30 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#995F2F]/40"
        title="Upload Foto Baru"
        aria-label="Upload Foto Baru"
      >
        <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Mobile Right Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Right Sidebar */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#622B14] shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[#995F2F]/40">
          <span className="font-serif-display text-lg font-bold tracking-wider text-[#E4D6A9]">Menu</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-[#E4D6A9] hover:bg-[#995F2F]/30 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-2 overflow-y-auto">
          <button
            onClick={() => { onViewChange('feed'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'feed' ? 'bg-[#E4D6A9] text-[#622B14]' : 'text-[#E4D6A9] hover:bg-[#995F2F]/30'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Galeri</span>
          </button>

          <button
            onClick={() => { onViewChange('my-photos'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'my-photos' ? 'bg-[#E4D6A9] text-[#622B14]' : 'text-[#E4D6A9] hover:bg-[#995F2F]/30'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Foto Saya</span>
          </button>

          <button
            onClick={() => { onViewChange('my-albums'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'my-albums' ? 'bg-[#E4D6A9] text-[#622B14]' : 'text-[#E4D6A9] hover:bg-[#995F2F]/30'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Album</span>
          </button>

          <button
            onClick={() => { onViewChange('profile'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'profile' ? 'bg-[#E4D6A9] text-[#622B14]' : 'text-[#E4D6A9] hover:bg-[#995F2F]/30'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profil</span>
          </button>
        </nav>
        
        {/* Settings button at the bottom of the drawer */}
        <div className="mt-auto p-4 border-t border-[#995F2F]/40">
          <button
            onClick={() => { onViewChange('settings'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium transition-colors ${
              currentView === 'settings' ? 'bg-[#E4D6A9] text-[#622B14]' : 'text-[#E4D6A9] hover:bg-[#995F2F]/30'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
        </div>
      </div>
    </>
  );
};
