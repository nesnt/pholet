// src/components/AuthModal.tsx
"use client";

import React, { useState } from "react";
import { X, Lock, User, KeyRound, UserCheck } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    onAuthSuccess,
}) => {
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isLoginTab ? "/api/auth/login" : "/api/auth/register";
        const payload = isLoginTab
            ? { username, password }
            : { username, password, name };

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

            if (isLoginTab) {
                // Jika login berhasil
                onAuthSuccess(data.user);
                onClose();
            } else {
                // Jika register berhasil, otomatis pindah ke tab login
                alert("Registrasi berhasil! Silakan login dengan akun baru Anda.");
                setIsLoginTab(true);
                setPassword("");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-md bg-[#082032] border border-[#334756]/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">

                {/* Tombol Tutup Modal */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#334756]/40 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Tab Switcher */}
                <div className="flex border-b border-[#334756]/40 mb-6">
                    <button
                        onClick={() => {
                            setIsLoginTab(true);
                            setError("");
                        }}
                        className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${isLoginTab ? "text-[#FF4C29]" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Masuk Akun
                        {isLoginTab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4C29]" />
                        )}
                    </button>

                    <button
                        onClick={() => {
                            setIsLoginTab(false);
                            setError("");
                        }}
                        className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${!isLoginTab ? "text-[#FF4C29]" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Daftar Baru
                        {!isLoginTab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4C29]" />
                        )}
                    </button>
                </div>

                {/* Pesan Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-xs text-red-300">
                        {error}
                    </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginTab && (
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
                                    placeholder="Contoh: Baskara Putra"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#2C394B]/50 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29]"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="baskara.film"
                                className="w-full pl-10 pr-4 py-2.5 bg-[#2C394B]/50 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29]"
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
                                className="w-full pl-10 pr-4 py-2.5 bg-[#2C394B]/50 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-2 bg-[#FF4C29] hover:bg-[#ff3b14] text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-red-500/20 disabled:opacity-50"
                    >
                        {loading
                            ? "Memproses..."
                            : isLoginTab
                                ? "Masuk Ke Akun"
                                : "Buat Akun Baru"}
                    </button>
                </form>
            </div>
        </div>
    );
};