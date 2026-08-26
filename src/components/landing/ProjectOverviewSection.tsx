import React from 'react';
import { Sparkles, Camera, Compass, Layers, Zap, Film } from 'lucide-react';

export const ProjectOverviewSection: React.FC = () => {
  const highlights = [
    {
      icon: Camera,
      title: 'Pusat Fotografi Analog',
      desc: 'Platform khusus untuk membagikan, menemukan, dan mengapresiasi karya fotografi film dari berbagai kreator.',
    },
    {
      icon: Film,
      title: 'Ekstraksi EXIF Otomatis',
      desc: 'Mendeteksi dan menampilkan metadata foto secara otomatis, termasuk jenis kamera, lensa, dan film yang digunakan.',
    },
    {
      icon: Zap,
      title: 'Interaksi Sosial',
      desc: 'Terhubung dengan sesama penggemar analog melalui fitur apresiasi dan diskusi karya secara interaktif.',
    },
    {
      icon: Layers,
      title: 'Terintegrasi Cloud',
      desc: 'Penyimpanan karya yang aman dan efisien menggunakan integrasi Google Drive dan database Supabase.',
    },
  ];

  return (
    <section
      id="about-project"
      className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756]/50 relative tracking-wide overflow-hidden"
    >
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#FF4C29]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 -right-32 w-80 h-80 bg-[#2C394B]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>GALERI FOTOGRAFI ANALOG</span>
          </div>

          <h2 className="font-cartoon-title text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-[0.16em] font-bold leading-tight drop-shadow-md">
            TENTANG PROJECT <span className="text-[#FF4C29]">PHOLET</span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4 font-mono-camera">
            <strong className="text-white">Pholet</strong> adalah platform galeri dan publikasi khusus untuk pecinta fotografi analog. Menggabungkan estetika klasik film photography dengan kemudahan teknologi cloud modern untuk menyimpan, membagikan, dan mengapresiasi setiap jepretan otentik.
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-[#2C394B]/70 hover:bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#082032] border border-[#334756] group-hover:border-[#FF4C29] flex items-center justify-center text-[#FF4C29] mb-5 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-syne font-bold text-lg text-white mb-2 uppercase tracking-wide group-hover:text-[#FF4C29] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#334756]/60 flex items-center justify-between text-[10px] font-mono-camera text-[#E4D6A9]">
                  <span>PILLAR 0{idx + 1}</span>
                  <span className="text-[#FF4C29] font-bold tracking-wider">ACTIVE</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Key Info Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#2C394B]/90 via-[#082032] to-[#2C394B]/90 border border-[#334756] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FF4C29]/20 border border-[#FF4C29] flex items-center justify-center text-[#FF4C29] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cartoon-title text-base sm:text-lg text-white uppercase tracking-wider">
                Merawat Estetika Klasik
              </h4>
              <p className="text-xs text-gray-400 font-mono-camera mt-0.5">
                Menyediakan ruang khusus untuk merayakan keaslian dan karakteristik unik dari setiap lembar film analog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0 font-mono-camera text-xs uppercase tracking-widest text-[#E4D6A9]">
            <div className="text-center">
              <span className="block font-bold text-white text-lg">2024</span>
              <span className="text-[10px] text-gray-400">Tahun Rilis</span>
            </div>
            <div className="h-8 w-px bg-[#334756]" />
            <div className="text-center">
              <span className="block font-bold text-[#FF4C29] text-lg">EXIF</span>
              <span className="text-[10px] text-gray-400">Metadata</span>
            </div>
            <div className="h-8 w-px bg-[#334756]" />
            <div className="text-center">
              <span className="block font-bold text-white text-lg">Analog</span>
              <span className="text-[10px] text-gray-400">Fotografi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
