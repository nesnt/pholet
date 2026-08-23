import React, { useState } from 'react';
import {
  Camera, 
  Search, 
  Plus,
  Compass,
  User,
  Menu,
  X,
  Settings,
  LogOut
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
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  userAvatar,
  userName,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#082032] text-white shadow-md border-b border-[#334756]/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 relative">
            
            {/* Left: Web Identity (Logo Brand in Top-Left Corner) */}
            <div className="flex items-center gap-3 shrink-0 relative z-10">
              <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => onViewChange('feed')}
              >
                <div className="w-11 h-11 rounded-full bg-[#334756] flex items-center justify-center border-2 border-[#2C394B]/60 shadow-inner group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  <img src="/icon_pct.jpg" alt="Pholet" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-serif-display text-2xl font-bold tracking-wider text-white block leading-none">
                    PHOLET
                  </span>
                  <span className="text-[10px] tracking-widest text-gray-400 uppercase font-medium">
                    Foto Terlupakan • Abadi
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Search Bar (Primary Header Focus) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] max-w-2xl z-0">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4.5 w-4.5 text-[#FF4C29]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari foto, kamera, rol film (Kodak Portra 400), lokasi, tag..."
                  className="w-full pl-11 pr-10 py-2.5 bg-[#082032]/50 border border-[#334756]/40 rounded-full text-sm text-white placeholder-[#978F66] focus:outline-none focus:ring-2 focus:ring-[#E4D6A9] focus:border-transparent transition-all shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-gray-400 hover:text-white"
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
                className="p-2 text-white hover:bg-[#334756]/30 rounded-full"
                title="Menu"
              >
                <Menu className="w-6 h-6 text-[#FF4C29]" />
              </button>
            </div>

            {/* Right: Account Profile (Desktop) */}
            <div className="hidden md:flex items-center gap-4 shrink-0 z-10">
              <button
                onClick={() => onViewChange('profile')}
                className="flex items-center gap-2 hover:bg-[#334756]/30 p-1.5 pr-4 rounded-full transition-colors group border border-transparent hover:border-[#334756]/50"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-9 h-9 rounded-full object-cover border border-[#334756] group-hover:border-[#2C394B]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#334756] border border-[#334756] group-hover:border-[#2C394B] flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <span className="block text-sm font-semibold text-white leading-tight truncate max-w-[120px]">
                    {userName}
                  </span>
                  <span className="block text-[10px] text-gray-400">Lihat Profil</span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 rounded-full transition-all"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:inline font-medium">Keluar</span>
              </button>
            </div>

          </div>

          {/* Mobile Search Input */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#FF4C29]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari foto, kamera, rol film..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#082032]/50 border border-[#334756]/40 rounded-full text-xs text-white placeholder-[#978F66] focus:outline-none focus:ring-1 focus:ring-[#E4D6A9]"
              />
            </div>
          </div>

        </div>
      </header>

      {/* Floating Circular Action Button (FAB) at Bottom Right */}
      <button
        onClick={onOpenUpload}
        id="fab-upload-button"
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 bg-[#2C394B] text-white hover:bg-[#FF4C29] rounded-full shadow-2xl border-2 border-[#FF4C29]/30 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#334756]/40"
        title="Upload Foto Baru"
        aria-label="Upload Foto Baru"
      >
        <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300 text-[#FF4C29]" />
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
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#082032] shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[#334756]/40">
          <span className="font-serif-display text-lg font-bold tracking-wider text-white">Menu</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-white hover:bg-[#334756]/30 rounded-full"
          >
            <X className="w-5 h-5 text-[#FF4C29]" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-2 overflow-y-auto">
          <button
            onClick={() => { onViewChange('feed'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'feed' ? 'bg-[#2C394B] text-white' : 'text-white hover:bg-[#334756]/30'
            }`}
          >
            <Compass className="w-5 h-5 text-[#FF4C29]" />
            <span>Galeri</span>
          </button>



          <button
            onClick={() => { onViewChange('profile'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'profile' ? 'bg-[#2C394B] text-white' : 'text-white hover:bg-[#334756]/30'
            }`}
          >
            <User className="w-5 h-5 text-[#FF4C29]" />
            <span>Profil</span>
          </button>
        </nav>
        
        {/* Settings button at the bottom of the drawer */}
        <div className="mt-auto p-4 border-t border-[#334756]/40">
          {/* Tombol Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 rounded-full transition-all"
            title="Keluar Akun"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
          <button
            onClick={() => { onViewChange('settings'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium transition-colors ${
              currentView === 'settings' ? 'bg-[#2C394B] text-white' : 'text-white hover:bg-[#334756]/30'
            }`}
          >
            <Settings className="w-5 h-5 text-[#FF4C29]" />
            <span>Pengaturan</span>
          </button>
        </div>
      </div>
    </>
  );
};
