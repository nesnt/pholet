import React, { useState } from 'react';
import { Camera, Aperture, ArrowUp, Send, Check } from 'lucide-react';
import { playDialTick, playShutterSound } from '../../utils/audio';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playShutterSound();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const scrollToTop = () => {
    playDialTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#082032] border-t border-[#334756] pt-16 pb-12 relative overflow-hidden">
      {/* Viewfinder background subtle pattern */}
      <div className="absolute inset-0 viewfinder-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Top Content: Newsletter & Brand */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto gap-8">
          {/* Brand & Manifesto */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-9 h-9 rounded-lg bg-[#2C394B] border border-[#FF4C29] flex items-center justify-center">
                <Aperture className="w-5 h-5 text-[#FF4C29]" />
              </div>
              <span className="font-syne font-extrabold text-2xl tracking-widest text-white uppercase">
                pholet
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Platform galeri dan publikasi khusus pecinta fotografi analog. Menggabungkan estetika klasik film photography dengan kemudahan penyimpanan cloud modern.
            </p>
          </div>

          {/* Newsletter Dispatch */}
          <div className="pt-2 w-full max-w-sm mx-auto">
            <div className="text-xs font-mono-camera text-[#E4D6A9] uppercase mb-2 font-bold text-center">
              BERGABUNG DENGAN NEWSLETTER KAMI
            </div>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#2C394B] border border-[#FF4C29] text-xs font-mono-camera text-[#FF4C29]">
                <Check className="w-4 h-4" />
                <span>ANDA TELAH BERLANGGANAN.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="flex-1 bg-[#2C394B] border border-[#334756] focus:border-[#FF4C29] rounded-xl px-4 py-2.5 text-xs text-white focus-pholet font-mono-camera text-left"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FF4C29] hover:bg-[#ff360f] text-white text-xs font-mono-camera font-bold uppercase rounded-xl transition-all pholet-shadow-sm focus-pholet"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Massive Bold Pholet Typography Banner */}
        <div className="border-t border-[#334756] pt-12 pb-4 text-center select-none">
          <div className="font-syne font-black text-6xl sm:text-8xl md:text-9xl lg:text-[140px] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#2C394B] to-[#082032] uppercase leading-none">
            PHOLET
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back To Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#334756]/60 text-xs font-mono-camera text-gray-400">
          <div>
            © {new Date().getFullYear()} PHOLET 2026.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#978F66]">ISO 400 • 35MM SILVER ARCHIVE</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-gray-300 hover:text-[#FF4C29] transition-colors"
            >
              <span>BACK TO APERTURE</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
