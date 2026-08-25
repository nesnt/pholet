// src/components/EditPhotoModal.tsx
"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Edit3, Film } from "lucide-react";
import { Photo } from "../types";

interface EditPhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: (updatedPhoto: Photo) => void;
}

export const EditPhotoModal: React.FC<EditPhotoModalProps> = ({
  photo,
  isOpen,
  onClose,
  onEditSuccess,
}) => {
  if (!isOpen || !photo) return null;

  const [title, setTitle] = useState(photo.title);
  const [caption, setCaption] = useState(photo.caption || "");
  const [category, setCategory] = useState(photo.category || "Street");
  const [isPrivate, setIsPrivate] = useState(photo.isPrivate || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, caption, category, isPrivate }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengedit foto!");
      }

      onEditSuccess({
        ...photo,
        title,
        caption,
        category,
        isPrivate,
      });
      onClose();
      alert("Detail foto berhasil diperbarui!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-[#082032]/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl"
      >
        {/* Close Button Outside Modal */}
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 md:-right-14 md:top-0 z-50 p-2.5 rounded-full bg-[#2C394B]/90 text-white hover:bg-[#FF4C29] transition-all shadow-xl backdrop-blur-md border border-[#334756] hover:scale-110"
          title="Batal Edit"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Modal Card Content */}
        <div className="w-full bg-[#082032] rounded-2xl border border-[#334756]/40 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          {/* Left Column: Photo Presentation Area */}
          <div className="md:w-3/5 bg-[#082032] flex flex-col items-center justify-center relative p-2 min-h-[300px] md:min-h-[500px]">
            <img
              src={photo.url}
              alt={photo.title}
              className="max-w-full max-h-[70vh] md:max-h-[82vh] object-contain rounded-md shadow-lg"
            />

            {/* Film Stock Tag Badge */}
            <div className="absolute top-4 left-4 bg-[#FF4C29]/90 text-white text-xs px-3 py-1 rounded-full font-mono flex items-center gap-1.5 border border-[#334756]/40 shadow-md">
              <Film className="w-3.5 h-3.5 text-white" />
              <span>{photo.exif.filmStock}</span>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:w-2/5 flex flex-col p-5 overflow-y-auto bg-[#082032] border-l border-[#334756]/30 relative text-white">
            <div className="flex items-center gap-2 pb-4 border-b border-[#334756]/40 mb-4">
              <Edit3 className="w-5 h-5 text-[#FF4C29]" />
              <h3 className="font-semibold text-lg font-serif-display">
                Edit Detail Karya Foto
              </h3>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Judul Foto
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2C394B]/50 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Cerita / Deskripsi
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2C394B]/50 border border-[#334756] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4C29] resize-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as "Street" | "Portrait" | "Architecture" | "Landscape" | "Abstract" | "Still Life")}
                  className="w-full px-4 py-2.5 bg-[#2C394B]/50 border border-[#334756] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF4C29]"
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Street">Street</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Abstract">Abstract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Status Privasi
                </label>
                <select
                  value={isPrivate ? "true" : "false"}
                  onChange={(e) => setIsPrivate(e.target.value === "true")}
                  className="w-full px-4 py-2.5 bg-[#2C394B]/50 border border-[#334756] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF4C29]"
                >
                  <option value="false">
                    🌐 Publik (Dapat dilihat semua pengguna di Feed)
                  </option>
                  <option value="true">
                    🔒 Privat (Hanya saya yang bisa melihat di Profil)
                  </option>
                </select>
              </div>

              <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 py-2.5 border border-[#334756] rounded-xl text-sm text-gray-300 hover:bg-[#334756]/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-2.5 bg-[#FF4C29] hover:bg-[#ff3b14] text-white font-semibold rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};