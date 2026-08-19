// src/app/page.tsx
import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="min-h-screen bg-[#082032] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2">PHOLET</h1>
      <p className="text-gray-400 mb-6">Galeri Komunitas Fotografi Analog</p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2.5 bg-[#FF4C29] hover:bg-[#ff3b14] rounded-xl font-semibold text-sm transition-all"
        >
          Masuk Akun
        </Link>
        <Link
          href="/register"
          className="px-6 py-2.5 bg-[#334756] hover:bg-[#2C394B] border border-[#334756] rounded-xl font-semibold text-sm transition-all"
        >
          Daftar Baru
        </Link>
      </div>
    </div>
  );
}