import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { playShutterSound } from '../../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Sync mode with prop change when modal opens
  React.useEffect(() => {
    setMode(initialMode);
    setIsSuccess(false);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playShutterSound();
    setError("");
    setLoading(true);

    const endpoint = mode === 'login' ? "/api/auth/login" : "/api/auth/register";
    const payload = mode === 'login'
        ? { email, password }
        : { email, password, name };

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Terjadi kesalahan!");
        }

        if (mode === 'login') {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                router.push("/dashboard");
            }, 1000);
        } else {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setMode('login');
                setPassword('');
            }, 1500);
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        className="relative w-full max-w-md bg-[#082032] border-2 border-[#334756] rounded-2xl overflow-hidden shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334756] bg-[#2C394B]/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4C29] animate-pulse"></span>
            <span className="font-mono-camera text-xs uppercase tracking-widest text-[#E4D6A9]">
              Pholet Membership Portal
            </span>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#334756]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-[#334756] bg-[#082032]">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => {
              setMode('login');
              playShutterSound();
            }}
            className={`py-3 text-xs font-mono-camera uppercase tracking-widest font-bold transition-colors ${
              mode === 'login'
                ? 'text-[#FF4C29] border-b-2 border-[#FF4C29] bg-[#2C394B]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Masuk / Login
          </button>
          <button
            id="tab-register-btn"
            type="button"
            onClick={() => {
              setMode('register');
              playShutterSound();
            }}
            className={`py-3 text-xs font-mono-camera uppercase tracking-widest font-bold transition-colors ${
              mode === 'register'
                ? 'text-[#FF4C29] border-b-2 border-[#FF4C29] bg-[#2C394B]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Daftar / Register
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#FF4C29]/20 border border-[#FF4C29] flex items-center justify-center text-[#FF4C29]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-cartoon-title text-xl text-white uppercase tracking-wider">
                {mode === 'login' ? 'Login Berhasil!' : 'Pendaftaran Berhasil!'}
              </h3>
              <p className="text-sm text-[#E4D6A9] font-mono-camera">
                Selamat datang di Pholet Athletic Club of Photo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-xs text-red-300">
                  {error}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="font-cartoon-title text-2xl text-white tracking-wider uppercase">
                  {mode === 'login' ? 'Selamat Datang Kembali' : 'Gabung Bersama Pholet'}
                </h3>
                <p className="text-xs text-gray-400 font-mono-camera mt-1">
                  {mode === 'login'
                    ? 'Akses arsip foto dan jadwal sesi photoshoot Anda.'
                    : 'Dapatkan diskon eksklusif dan akses private darkroom lab.'}
                </p>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-mono-camera text-gray-300 uppercase tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Pratama"
                      className="w-full bg-[#2C394B]/60 border border-[#334756] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono-camera text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#2C394B]/60 border border-[#334756] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-camera text-gray-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#2C394B]/60 border border-[#334756] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29] transition-colors"
                  />
                </div>
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[11px] font-mono-camera text-[#FF4C29] hover:underline"
                  >
                    Lupa Password?
                  </a>
                </div>
              )}

              <button
                id="submit-auth-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 px-4 rounded-xl bg-[#FF4C29] hover:bg-[#ff5d3c] text-white font-mono-camera text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-[#FF4C29]/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Memproses...' : (mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru')}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-400 font-mono-camera">
                  {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      playShutterSound();
                    }}
                    className="text-[#FF4C29] font-bold hover:underline cursor-pointer ml-1"
                  >
                    {mode === 'login' ? 'Daftar disini' : 'Masuk disini'}
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
