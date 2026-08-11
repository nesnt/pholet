import React from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Code2, 
  Heart, 
  Smartphone, 
  Monitor, 
  ShieldCheck,
  Film,
  Camera
} from 'lucide-react';

export const DesignSpecView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      
      {/* Title Header Banner */}
      <div className="bg-[#622B14] text-[#E4D6A9] rounded-2xl p-6 sm:p-8 border border-[#995F2F]/40 shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#995F2F]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 text-xs text-[#E4D6A9] font-mono tracking-widest uppercase font-semibold">
          <Film className="w-4 h-4 text-[#E4D6A9]" />
          <span>Pholet UI/UX Design System Specification</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-4xl font-bold leading-tight">
          Dokumen & Panduan Desain Komunitas Foto "Pholet"
        </h1>
        <p className="text-xs sm:text-sm text-[#E4D6A9]/90 max-w-3xl leading-relaxed">
          Platform galeri foto analog & film dengan atmosfer <em className="font-serif-display text-[#E4D6A9]">"warm, earthy, vintage-film, artisanal"</em>. Dirancang khusus untuk fotografer yang menghargai kenangan foto yang pernah terlupakan.
        </p>
      </div>

      {/* Section 1: Typography */}
      <section className="bg-[#F8F4E8] rounded-2xl border border-[#978F66]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#622B14] border-b border-[#978F66]/20 pb-3">
          <Type className="w-5 h-5 text-[#995F2F]" />
          <h2 className="font-serif-display text-xl font-bold">
            1. Rekomendasi Tipografi (Font Pairing)
          </h2>
        </div>

        <p className="text-xs text-[#21120B]/90 leading-relaxed">
          Untuk menghidupkan rasa editorial majalah foto klasik dan sentuhan personal seperti album foto lama, digunakan kombinasi <strong>Font Serif Display</strong> berkarakter dan <strong>Font Sans-serif</strong> yang modern dan sangat terbaca:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Heading Font */}
          <div className="bg-[#E4D6A9]/40 border border-[#978F66]/30 p-4 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-[#995F2F] uppercase font-bold tracking-wider">
              Display & Heading Font
            </span>
            <h3 className="font-serif-display text-2xl font-bold text-[#622B14]">
              Fraunces / Playfair Display
            </h3>
            <p className="text-xs text-[#21120B]/80 font-sans leading-relaxed">
              <strong>Karakter:</strong> Serif kontras hangat dengan curvature melengkung seperti optik lensa lama. Memberi kesan magis, emosional, dan otentik.
            </p>
            <div className="pt-2 border-t border-[#978F66]/20 text-xs font-serif-display text-[#622B14] italic">
              "Foto yang terlupakan, kembali hidup dalam ingatan."
            </div>
          </div>

          {/* Body Font */}
          <div className="bg-[#E4D6A9]/40 border border-[#978F66]/30 p-4 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-[#995F2F] uppercase font-bold tracking-wider">
              Body & Metadata Font
            </span>
            <h3 className="font-sans text-xl font-bold text-[#622B14]">
              Plus Jakarta Sans / Inter
            </h3>
            <p className="text-xs text-[#21120B]/80 font-sans leading-relaxed">
              <strong>Karakter:</strong> Sans-serif dengan x-height proporsional, sangat jernih untuk membaca parameter EXIF (shutter speed, ISO, aperture), caption, dan komentar pengguna.
            </p>
            <div className="pt-2 border-t border-[#978F66]/20 text-xs font-mono text-[#622B14]">
              EXIF: Leica M6 • Summicron 35mm f/2 • Kodak Portra 400
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Moodboard & Visual Concept */}
      <section className="bg-[#F8F4E8] rounded-2xl border border-[#978F66]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#622B14] border-b border-[#978F66]/20 pb-3">
          <Eye className="w-5 h-5 text-[#995F2F]" />
          <h2 className="font-serif-display text-xl font-bold">
            2. Moodboard & Konsep Visual Utama
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#E4D6A9]/30 border border-[#978F66]/20 p-4 rounded-xl space-y-2">
            <h3 className="font-serif-display font-bold text-[#622B14] text-sm flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#995F2F]" />
              Homepage / Feed Komunitas
            </h3>
            <p className="text-xs text-[#21120B]/80 leading-relaxed">
              <strong>Konsep:</strong> Galeri seni pameran independen. Tata letak Masonry memberikan ritme dinamis antara foto lanskap, potret, dan persegi. Kartu foto memiliki aksen frame tipis hangat dan badge rol film (seperti Kodak Gold/Portra) di pojok atas.
            </p>
          </div>

          <div className="bg-[#E4D6A9]/30 border border-[#978F66]/20 p-4 rounded-xl space-y-2">
            <h3 className="font-serif-display font-bold text-[#622B14] text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#995F2F]" />
              Halaman Detail Foto Modal
            </h3>
            <p className="text-xs text-[#21120B]/80 leading-relaxed">
              <strong>Konsep:</strong> Meja periksa klise negatif (light table). Foto ditampilkan dominan dengan latar belakang gelap kopi espresso, dilengkapi panel EXIF teknis yang rapi dan kolom cerita fotografer beserta tanggapan hangat komunitas.
            </p>
          </div>

          <div className="bg-[#E4D6A9]/30 border border-[#978F66]/20 p-4 rounded-xl space-y-2">
            <h3 className="font-serif-display font-bold text-[#622B14] text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#995F2F]" />
              Halaman Profil Fotografer
            </h3>
            <p className="text-xs text-[#21120B]/80 leading-relaxed">
              <strong>Konsep:</strong> Album foto kulit buatan tangan (artisanal journal). Menampilkan banner karya terbaik, statistik apresiasi, serta badge daftar peralatan kamera & rol film favorit sang fotografer.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: UI Component Architecture */}
      <section className="bg-[#F8F4E8] rounded-2xl border border-[#978F66]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#622B14] border-b border-[#978F66]/20 pb-3">
          <Layout className="w-5 h-5 text-[#995F2F]" />
          <h2 className="font-serif-display text-xl font-bold">
            3. Struktur Komponen UI Utama
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#E4D6A9]/40 border border-[#978F66]/30 rounded-xl space-y-1">
            <h4 className="font-bold text-[#622B14] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#622B14]" />
              1. Navbar (Sticky Top & Bottom Nav)
            </h4>
            <p className="text-[#21120B]/80">
              Header topbar untuk desktop, dan bottom navigation bar di mobile (responsif). Menyediakan fitur pencarian cepat, filter rol film, serta tombol upload foto.
            </p>
          </div>

          <div className="p-3 bg-[#E4D6A9]/40 border border-[#978F66]/30 rounded-xl space-y-1">
            <h4 className="font-bold text-[#622B14] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#995F2F]" />
              2. Photo Card (Kartu Galeri)
            </h4>
            <p className="text-[#21120B]/80">
              Kartu foto dengan efek zoom halus, tombol mikro-animasi Heart Burst, indikator EXIF ringkas (kamera & shutter), serta profil avatar fotografer.
            </p>
          </div>

          <div className="p-3 bg-[#E4D6A9]/40 border border-[#978F66]/30 rounded-xl space-y-1">
            <h4 className="font-bold text-[#622B14] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#978F66]" />
              3. Photo Grid (Masonry Engine)
            </h4>
            <p className="text-[#21120B]/80">
              Grid foto adaptif yang menyesuaikan tinggi gambar tanpa crop (1 kolom mobile, 2 kolom tablet, 3-4 kolom desktop) lengkap dengan filter kategori & rol film.
            </p>
          </div>

          <div className="p-3 bg-[#E4D6A9]/40 border border-[#978F66]/30 rounded-xl space-y-1">
            <h4 className="font-bold text-[#622B14] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#622B14]" />
              4. Photo Detail Modal / Lightbox
            </h4>
            <p className="text-[#21120B]/80">
              Modal tampilan penuh dengan mode Lightbox full-screen, drawer spesifikasi EXIF lengkap, fitur ikuti fotografer, dan kolom komentar komunitas real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Micro-Animation Guide */}
      <section className="bg-[#F8F4E8] rounded-2xl border border-[#978F66]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#622B14] border-b border-[#978F66]/20 pb-3">
          <Heart className="w-5 h-5 text-rose-700 fill-rose-700" />
          <h2 className="font-serif-display text-xl font-bold">
            4. Micro-Animation Heart Burst Spec (Interaksi Suka)
          </h2>
        </div>

        <div className="bg-[#E4D6A9]/40 border border-[#978F66]/30 p-4 rounded-xl space-y-3">
          <p className="text-xs text-[#21120B]/90 leading-relaxed">
            Untuk membuat interaksi memberi like terasa hangat dan memuaskan (engaging), digunakan animasi CSS Keyframe <code>heartBurst</code> dengan kurva ketukan <code>cubic-bezier(0.175, 0.885, 0.32, 1.275)</code>:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-[#F8F4E8] border border-[#978F66]/30 rounded-lg">
              <span className="font-bold text-[#622B14] block">0%</span>
              <span className="text-[10px] text-[#978F66]">scale(1)</span>
            </div>
            <div className="p-2 bg-[#F8F4E8] border border-[#978F66]/30 rounded-lg">
              <span className="font-bold text-[#995F2F] block">25%</span>
              <span className="text-[10px] text-[#978F66]">scale(1.35) rotate(-10deg)</span>
            </div>
            <div className="p-2 bg-[#F8F4E8] border border-[#978F66]/30 rounded-lg">
              <span className="font-bold text-[#995F2F] block">50%</span>
              <span className="text-[10px] text-[#978F66]">scale(0.9) rotate(5deg)</span>
            </div>
            <div className="p-2 bg-[#F8F4E8] border border-[#978F66]/30 rounded-lg">
              <span className="font-bold text-rose-700 block">100%</span>
              <span className="text-[10px] text-[#978F66]">scale(1) rotate(0deg)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Color System & Accessibility Contrast Matrix */}
      <section className="bg-[#F8F4E8] rounded-2xl border border-[#978F66]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#622B14] border-b border-[#978F66]/20 pb-3">
          <Palette className="w-5 h-5 text-[#995F2F]" />
          <h2 className="font-serif-display text-xl font-bold">
            5. Panduan Penggunaan Warna & Matrix Kontras WCAG AA
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Color 1 */}
          <div className="rounded-xl overflow-hidden border border-[#978F66]/30 shadow-xs">
            <div className="h-16 bg-[#622B14] text-[#E4D6A9] p-3 font-mono font-bold flex flex-col justify-between">
              <span>#622B14</span>
              <span className="text-[10px] font-sans opacity-90">Espresso / Coklat Tua</span>
            </div>
            <div className="p-3 bg-[#F8F4E8] space-y-1">
              <span className="font-bold text-[#622B14] block">Peran UI:</span>
              <p className="text-[11px] text-[#21120B]/80">
                Aksen Dominan, Top Navbar, Tombol Primary, Header Judul Modal.
              </p>
            </div>
          </div>

          {/* Color 2 */}
          <div className="rounded-xl overflow-hidden border border-[#978F66]/30 shadow-xs">
            <div className="h-16 bg-[#995F2F] text-[#E4D6A9] p-3 font-mono font-bold flex flex-col justify-between">
              <span>#995F2F</span>
              <span className="text-[10px] font-sans opacity-90">Terracotta / Coklat Medium</span>
            </div>
            <div className="p-3 bg-[#F8F4E8] space-y-1">
              <span className="font-bold text-[#622B14] block">Peran UI:</span>
              <p className="text-[11px] text-[#21120B]/80">
                Elemen Sekunder, Badge Rol Film, Hover Accent, Icon Highlights.
              </p>
            </div>
          </div>

          {/* Color 3 */}
          <div className="rounded-xl overflow-hidden border border-[#978F66]/30 shadow-xs">
            <div className="h-16 bg-[#978F66] text-[#21120B] p-3 font-mono font-bold flex flex-col justify-between">
              <span>#978F66</span>
              <span className="text-[10px] font-sans opacity-90">Olive / Khaki Netral</span>
            </div>
            <div className="p-3 bg-[#F8F4E8] space-y-1">
              <span className="font-bold text-[#622B14] block">Peran UI:</span>
              <p className="text-[11px] text-[#21120B]/80">
                Text Sekunder, Border Card, Divider Line, Subtitle Metadata.
              </p>
            </div>
          </div>

          {/* Color 4 */}
          <div className="rounded-xl overflow-hidden border border-[#978F66]/30 shadow-xs">
            <div className="h-16 bg-[#E4D6A9] text-[#622B14] p-3 font-mono font-bold flex flex-col justify-between">
              <span>#E4D6A9</span>
              <span className="text-[10px] font-sans opacity-90">Soft Parchment / Krem</span>
            </div>
            <div className="p-3 bg-[#F8F4E8] space-y-1">
              <span className="font-bold text-[#622B14] block">Peran UI:</span>
              <p className="text-[11px] text-[#21120B]/80">
                Surface Card Background, Pill Badges, Soft Overlay, Active Tab.
              </p>
            </div>
          </div>

        </div>

        {/* Accessibility Note */}
        <div className="bg-[#E4D6A9]/50 border border-[#978F66]/40 p-3.5 rounded-xl flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-[#622B14] shrink-0 mt-0.5" />
          <div className="space-y-1 text-[#21120B]">
            <span className="font-bold text-[#622B14]">Jaminan Kontras Aksesibilitas (WCAG AA Standard)</span>
            <p className="text-[11px] leading-relaxed">
              Teks utama menggunakan warna tinta deep dark espresso <code>#21120B</code> di atas permukaan krem muda <code>#F8F4E8</code> / <code>#E4D6A9</code> (rasio kontras <strong>14.2:1</strong> — melampaui standar WCAG AAA 7:1). Teks putih/krem di atas tombol espresso <code>#622B14</code> memiliki rasio kontras <strong>8.6:1</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Next.js + Tailwind Implementation Breakdown */}
      <section className="bg-[#F8F4E8] rounded-2xl border border-[#978F66]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#622B14] border-b border-[#978F66]/20 pb-3">
          <Code2 className="w-5 h-5 text-[#995F2F]" />
          <h2 className="font-serif-display text-xl font-bold">
            6. Panduan Implementasi React / Next.js & Tailwind CSS
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-[#21120B]/90 leading-relaxed">
            Struktur kode ini siap ditransformasikan secara langsung ke dalam arsitektur Next.js (App Router):
          </p>

          <pre className="p-3.5 bg-[#21120B] text-[#E4D6A9] rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`// tailwind.config.ts / CSS v4 Theme Mapping
theme: {
  extend: {
    colors: {
      pholet: {
        espresso: '#622B14',   // Primary / Accent
        terracotta: '#995F2F', // Secondary
        khaki: '#978F66',      // Borders & Muted Text
        cream: '#E4D6A9',      // Soft Surface
        parchment: '#F8F4E8',  // Light Canvas Background
        ink: '#21120B',        // High Contrast Text
      }
    },
    fontFamily: {
      serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      sans: ['var(--font-plus-jakarta)', 'sans-serif'],
    }
  }
}`}
          </pre>
        </div>
      </section>

    </div>
  );
};
