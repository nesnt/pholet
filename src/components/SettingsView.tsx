import React, { useState } from 'react';
import { User, Shield, Bell, Monitor, ChevronRight, LogOut, Key } from 'lucide-react';
import { Photographer } from '../types';

interface SettingsViewProps {
  currentUser: Photographer;
  onUpdateSuccess: (updatedUser: Partial<Photographer>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onUpdateSuccess }) => {
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio })
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui profil');
      }

      const data = await res.json();
      setMessage({ text: 'Profil berhasil diperbarui!', type: 'success' });
      onUpdateSuccess({ name, bio });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Terjadi kesalahan', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 w-full">
      <div className="border-b border-[#334756]/30 pb-6 mb-8">
        <h2 className="font-serif-display text-3xl font-bold text-white">Pengaturan</h2>
        <p className="text-gray-400 mt-2">Kelola preferensi akun, privasi, dan tampilan aplikasi Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Navigation / Tabs */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2C394B] text-white font-semibold border border-[#334756]/30 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#FF4C29]" />
              <span>Akun & Profil</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl text-white hover:bg-[#2C394B]/50 font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#FF4C29]" />
              <span>Privasi & Keamanan</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl text-white hover:bg-[#2C394B]/50 font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#FF4C29]" />
              <span>Notifikasi</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl text-white hover:bg-[#2C394B]/50 font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-[#FF4C29]" />
              <span>Tampilan</span>
            </div>
          </button>
        </div>

        {/* Right Side: Content Area */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Section: Edit Profile */}
          <section className="bg-[#082032] border border-[#334756]/30 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif-display text-xl font-bold text-white mb-4 border-b border-[#334756]/20 pb-2">Informasi Akun</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              {message && (
                <div className={`p-3 rounded-lg text-sm font-semibold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#2C394B]/50 border border-[#334756]/40 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF4C29]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">Username <span className="text-gray-500 font-normal">(Tidak dapat diubah)</span></label>
                <input 
                  type="text" 
                  value={currentUser.handle}
                  disabled
                  className="w-full bg-[#1C2636] border border-[#334756]/20 rounded-lg px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed opacity-70"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">Bio Singkat</label>
                <textarea 
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#2C394B]/50 border border-[#334756]/40 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF4C29]"
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-[#FF4C29] text-white text-sm font-bold rounded-xl hover:bg-[#FF4C29]/80 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </section>

          {/* Section: Email & Password */}
          <section className="bg-[#082032] border border-[#334756]/30 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif-display text-xl font-bold text-white mb-4 border-b border-[#334756]/20 pb-2">Kredensial Login</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#2C394B]/30 border border-[#334756]/30 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">Email Terdaftar</p>
                  <p className="text-xs text-gray-400">{currentUser.handle.replace('@', '')}</p>
                </div>
                <button className="text-sm text-[#FF4C29] font-semibold hover:underline">Ubah</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#2C394B]/30 border border-[#334756]/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-[#FF4C29]" />
                  <div>
                    <p className="text-sm font-semibold text-white">Kata Sandi</p>
                    <p className="text-xs text-gray-400">Terakhir diubah 3 bulan lalu</p>
                  </div>
                </div>
                <button className="text-sm text-[#FF4C29] font-semibold hover:underline">Ganti Sandi</button>
              </div>
            </div>
          </section>

          {/* Section: Danger Zone */}
          <section className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 shadow-sm mt-8">
            <h3 className="font-serif-display text-xl font-bold text-rose-500 mb-2">Zona Berbahaya</h3>
            <p className="text-xs text-rose-400 mb-4">Tindakan pada bagian ini tidak dapat dibatalkan.</p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Hapus Akun Permanen</p>
                <p className="text-xs text-gray-400 max-w-xs">Menghapus semua foto, album, pengikut, dan data terkait dari server Pholet.</p>
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
