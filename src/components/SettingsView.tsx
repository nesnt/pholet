import React from 'react';
import { User, Shield, Bell, Monitor, ChevronRight, LogOut, Key } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 w-full">
      <div className="border-b border-[#978F66]/30 pb-6 mb-8">
        <h2 className="font-serif-display text-3xl font-bold text-[#622B14]">Pengaturan</h2>
        <p className="text-[#978F66] mt-2">Kelola preferensi akun, privasi, dan tampilan aplikasi Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Navigation / Tabs */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#E4D6A9] text-[#622B14] font-semibold border border-[#995F2F]/30 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <span>Akun & Profil</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl text-[#622B14] hover:bg-[#E4D6A9]/50 font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" />
              <span>Privasi & Keamanan</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl text-[#622B14] hover:bg-[#E4D6A9]/50 font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <span>Notifikasi</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl text-[#622B14] hover:bg-[#E4D6A9]/50 font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5" />
              <span>Tampilan</span>
            </div>
          </button>
        </div>

        {/* Right Side: Content Area */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Section: Edit Profile */}
          <section className="bg-[#F8F4E8] border border-[#978F66]/30 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif-display text-xl font-bold text-[#622B14] mb-4 border-b border-[#978F66]/20 pb-2">Informasi Akun</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#E4D6A9] border border-[#978F66]/40 overflow-hidden flex items-center justify-center">
                  <User className="w-8 h-8 text-[#995F2F]" />
                </div>
                <button className="px-4 py-2 bg-[#622B14] text-[#E4D6A9] text-sm font-semibold rounded-full hover:bg-[#995F2F] transition-colors">
                  Ubah Foto Profil
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#622B14] mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  defaultValue="Budi Santoso"
                  className="w-full bg-white border border-[#978F66]/40 rounded-lg px-4 py-2.5 text-sm text-[#21120B] focus:outline-none focus:ring-2 focus:ring-[#995F2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#622B14] mb-1.5">Username</label>
                <input 
                  type="text" 
                  defaultValue="@budisfilm"
                  className="w-full bg-white border border-[#978F66]/40 rounded-lg px-4 py-2.5 text-sm text-[#21120B] focus:outline-none focus:ring-2 focus:ring-[#995F2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#622B14] mb-1.5">Bio Singkat</label>
                <textarea 
                  rows={3}
                  defaultValue="Fotografer amatir yang mencoba menangkap cerita di balik setiap framing."
                  className="w-full bg-white border border-[#978F66]/40 rounded-lg px-4 py-2.5 text-sm text-[#21120B] focus:outline-none focus:ring-2 focus:ring-[#995F2F]"
                />
              </div>
              
              <div className="pt-2">
                <button className="px-6 py-2.5 bg-[#E4D6A9] text-[#622B14] text-sm font-bold rounded-xl hover:bg-[#d8c58f] transition-colors shadow-sm">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </section>

          {/* Section: Email & Password */}
          <section className="bg-[#F8F4E8] border border-[#978F66]/30 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif-display text-xl font-bold text-[#622B14] mb-4 border-b border-[#978F66]/20 pb-2">Kredensial Login</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-[#978F66]/20 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#622B14]">Email Terdaftar</p>
                  <p className="text-xs text-[#978F66]">budi.santoso@example.com</p>
                </div>
                <button className="text-sm text-[#995F2F] font-semibold hover:underline">Ubah</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-[#978F66]/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-[#978F66]" />
                  <div>
                    <p className="text-sm font-semibold text-[#622B14]">Kata Sandi</p>
                    <p className="text-xs text-[#978F66]">Terakhir diubah 3 bulan lalu</p>
                  </div>
                </div>
                <button className="text-sm text-[#995F2F] font-semibold hover:underline">Ganti Sandi</button>
              </div>
            </div>
          </section>

          {/* Section: Danger Zone */}
          <section className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm mt-8">
            <h3 className="font-serif-display text-xl font-bold text-rose-800 mb-2">Zona Berbahaya</h3>
            <p className="text-xs text-rose-600 mb-4">Tindakan pada bagian ini tidak dapat dibatalkan.</p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-900">Hapus Akun Permanen</p>
                <p className="text-xs text-rose-700 max-w-xs">Menghapus semua foto, album, pengikut, dan data terkait dari server Pholet.</p>
              </div>
              <button className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 transition-colors">
                Hapus Akun
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
