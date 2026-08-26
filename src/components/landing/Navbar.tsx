import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { playShutterSound } from '../../utils/audio';

interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#082032]/85 backdrop-blur-md border-b border-[#334756]/60 py-3 shadow-lg'
          : 'bg-transparent -mb-[73px] border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <a
          href="#"
          id="brand-logo"
          onClick={() => playShutterSound()}
          className="flex items-center group focus-pholet rounded-md"
        >
          <div className="flex flex-col">
            <span className="font-syne font-extrabold text-2xl tracking-widest text-white uppercase group-hover:text-[#FF4C29] transition-colors leading-none drop-shadow-sm">
              pholet
            </span>
            <span className="font-mono-camera text-[10px] tracking-[0.25em] text-[#E4D6A9] uppercase drop-shadow-sm">
              ATHLETIC CLUB OF PHOTO
            </span>
          </div>
        </a>

        {/* Action Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-login-btn"
            type="button"
            onClick={() => {
              playShutterSound();
              onOpenAuth?.('login');
            }}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#2C394B]/80 hover:bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-white text-xs font-mono-camera uppercase tracking-widest font-bold transition-all shadow-sm cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FF4C29]" />
            <span>Login</span>
          </button>

          <button
            id="nav-register-btn"
            type="button"
            onClick={() => {
              playShutterSound();
              onOpenAuth?.('register');
            }}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#FF4C29] hover:bg-[#ff5d3c] text-white text-xs font-mono-camera uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-[#FF4C29]/30 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span>Register</span>
          </button>
        </div>
      </div>
    </header>
  );
};

