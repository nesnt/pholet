// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, KeyRound, Mail, UserCheck } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registrasi gagal!");
            }

            alert("Registrasi berhasil! Silakan login.");
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#082032] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF4C29]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-full max-w-md z-10">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#334756] border-2 border-[#FF4C29] shadow-xl mb-4">
                        <Camera className="w-8 h-8 text-[#FF4C29]" />
                    </div>
                    <h1 className="font-serif-display text-4xl font-bold tracking-wider text-white">
                        PHOLET
                    </h1>
                    <p className="text-xs tracking-widest text-gray-400 uppercase mt-1">
                        Buat Akun Baru
                    </p>
                </div>

                <div className="bg-[#2C394B]/40 border border-[#334756]/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-xs text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama lengkap kamu"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#082032]/60 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Alamat email kamu"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#082032]/60 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#082032]/60 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29]"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-2 bg-[#FF4C29] hover:bg-[#ff3b14] text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-red-500/20 disabled:opacity-50"
                        >
                            {loading ? "Memproses..." : "Daftar Akun"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-[#FF4C29] hover:underline font-semibold">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}