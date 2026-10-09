import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, MapPin, Image as ImageIcon, Tag, CheckCircle, AlertTriangle, Globe, Lock, Shield } from 'lucide-react';
import { Photo, Photographer } from '../types';
import { CATEGORIES } from '../data/mockData';
import { useToast } from './Toast';
import {
  MAX_PHOTO_SIZE_MB,
  ALLOWED_PHOTO_EXTENSIONS,
  isAllowedPhotoExtension,
  isAllowedPhotoMime,
  validatePhotoSize,
} from '../utils/validation';

interface UploadPageProps {
  onCancel: () => void;
  onUploadSuccess: (newPhoto: Photo) => void;
  currentUser: Photographer;
}

const STEPS = [
  { id: 1, title: 'Upload Foto' },
  { id: 2, title: 'Cerita Karya' },
  { id: 3, title: 'Lokasi & Tag' }
];

export const UploadPage: React.FC<UploadPageProps> = ({
  onCancel,
  onUploadSuccess,
  currentUser,
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Photo['category']>('Street');
  const [aspectRatio, setAspectRatio] = useState<Photo['aspectRatio']>('portrait');
  const [isPrivate, setIsPrivate] = useState(false);

  const [location, setLocation] = useState('Yogyakarta, Indonesia');
  const [tagsInput, setTagsInput] = useState('GoldenHour, Street35mm, Monochrome');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateAndProcessFile = (file: File): boolean => {
    const isExtAllowed = isAllowedPhotoExtension(file.name);
    const isMimeAllowed = isAllowedPhotoMime(file.type, file.name);

    if (!isExtAllowed || !isMimeAllowed) {
      const errorMsg = `Berkas "${file.name}" tidak dapat diunggah! Hanya file foto/gambar (${ALLOWED_PHOTO_EXTENSIONS.map(e => e.toUpperCase().replace('.', '')).join(', ')}) yang diizinkan. Berkas dokumen (seperti PDF atau DOCX) tidak didukung.`;
      setFileWarning(errorMsg);
      showToast(
        errorMsg,
        'error',
        { title: 'Format Berkas Ditolak' }
      );
      return false;
    }

    const sizeValidation = validatePhotoSize(file.size);
    if (!sizeValidation.isValid) {
      const errorMsg = sizeValidation.error || `Ukuran foto melebihi batas maksimal ${MAX_PHOTO_SIZE_MB}MB!`;
      setFileWarning(errorMsg);
      showToast(
        errorMsg,
        'warning',
        { title: 'Peringatan Ukuran Berkas' }
      );
      return false;
    }

    setFileWarning(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    showToast(`Foto "${file.name}" berhasil dimuat!`, 'success', { title: 'Foto Terpilih' });
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedFile || !imageUrl) {
        showToast("Silakan pilih berkas foto terlebih dahulu sebelum melanjutkan!", "warning", {
          title: "Foto Belum Dipilih",
        });
        return;
      }

      const sizeValidation = validatePhotoSize(selectedFile.size);
      if (!sizeValidation.isValid) {
        const errorMsg = sizeValidation.error || `Ukuran foto melebihi batas maksimal ${MAX_PHOTO_SIZE_MB}MB!`;
        setFileWarning(errorMsg);
        showToast(errorMsg, "warning", {
          title: "Peringatan Ukuran Foto",
        });
        return;
      }
    }
    if (step === 2) {
      if (!title.trim()) {
        showToast("Judul karya foto wajib diisi!", "warning", {
          title: "Judul Kosong",
        });
        return;
      }
    }
    setStep((s: number) => (s < 3 ? s + 1 : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      handleNext();
      return;
    }

    if (!title.trim() || !selectedFile) {
      showToast("Judul dan berkas foto wajib diisi sebelum mengunggah!", "warning", {
        title: "Form Belum Lengkap",
      });
      return;
    }

    const sizeValidation = validatePhotoSize(selectedFile.size);
    if (!sizeValidation.isValid) {
      const errorMsg = sizeValidation.error || `Ukuran foto melebihi batas maksimal ${MAX_PHOTO_SIZE_MB}MB!`;
      setFileWarning(errorMsg);
      showToast(errorMsg, "warning", {
        title: "Peringatan Ukuran Foto",
      });
      return;
    }

    if (isUploading) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("category", category);
      formData.append("aspectRatio", aspectRatio);
      formData.append("location", location);
      formData.append("tags", tagsInput);
      formData.append("isPrivate", isPrivate ? "true" : "false");

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengunggah foto!");
      }

      onUploadSuccess(data.photo);
    } catch (err: any) {
      showToast(err.message || "Terjadi kendala saat mengunggah foto", "error", {
        title: "Gagal Mengunggah",
      });
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="w-full space-y-6">

      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FF4C29] text-white p-6 rounded-2xl shadow-md">
        <div className="space-y-1">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors mb-2 bg-[#334756]/40 px-3 py-1.5 rounded-full border border-[#2C394B]/20"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF4C29]" />
            <span>Kembali ke Galeri</span>
          </button>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
            <Camera className="w-7 h-7 text-[#FF4C29]" />
            <span>Upload Karya Foto Film Baru</span>
          </h1>
          <p className="text-xs text-white/80">
            Halaman publikasi foto analog. Detail kamera akan dibaca secara otomatis (jika ada).
          </p>
        </div>
      </div>

      {/* Main Upload Form Layout */}
      <div className="bg-[#082032] rounded-2xl shadow-lg p-6 space-y-8">

        {/* Progress Stepper */}
        <div className="flex items-center justify-between px-2 mb-2 relative">
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#2C394B]/50 -z-0" />
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center relative z-10 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s.id ? 'bg-[#FF4C29] text-white' : 'bg-[#082032] text-gray-400 border-2 border-[#2C394B]/80'
                }`}>
                {step > s.id ? <CheckCircle className="w-4 h-4 text-[#FF4C29]" /> : s.id}
              </div>
              <span className={`text-[10px] sm:text-xs mt-2 font-medium text-center transition-colors ${step >= s.id ? 'text-white font-semibold' : 'text-gray-400'
                }`}>
                {s.title}
              </span>
              {/* Active track filling line */}
              {idx < STEPS.length - 1 && (
                <div className="absolute top-4 left-[50%] right-[-50%] h-[2px] -z-10 overflow-hidden">
                  <div className={`h-full bg-[#FF4C29] transition-all duration-300 ${step > s.id ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1: Image Selection / Dropzone */}
          {step === 1 && (
            <div className="space-y-4 bg-[#2C394B]/20 p-4 sm:p-5 rounded-xl animate-fade-in">
              <label className="font-semibold text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF4C29]" />
                  <span>Pilih Foto dari Perangkat Anda *</span>
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  KHUSUS FILE FOTO (MAKS. {MAX_PHOTO_SIZE_MB}MB)
                </span>
              </label>

              {fileWarning && (
                <div className="flex items-start gap-3 p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-200 text-xs animate-fade-in shadow-md">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-amber-300">Peringatan Ukuran Berkas</p>
                    <p className="text-amber-200/90 leading-relaxed">{fileWarning}</p>
                  </div>
                </div>
              )}

              {!imageUrl ? (
                <div
                  className={`w-full h-56 sm:h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#FF4C29] bg-[#FF4C29]/10 text-white shadow-lg shadow-[#FF4C29]/20'
                      : 'border-[#334756] text-gray-400 hover:bg-[#082032]/50 hover:border-[#FF4C29] hover:text-white'
                  }`}
                  onClick={() => document.getElementById('photo-upload-input')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      validateAndProcessFile(file);
                    }
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-[#082032] border border-[#334756] flex items-center justify-center mb-3 text-[#FF4C29] shadow-md">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm text-white mb-1">
                    {isDragging ? 'Lepaskan foto di sini...' : 'Klik atau seret foto ke area ini'}
                  </p>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    Mendukung format gambar: <span className="text-gray-200 font-medium">JPG, JPEG, PNG, WEBP, AVIF, HEIC</span> (Maks. {MAX_PHOTO_SIZE_MB}MB)
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#082032]/80 border border-[#334756]/60 text-[10px] text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C29]" />
                    <span>File dokumen (PDF, DOCX, ZIP) tidak diperkenankan</span>
                  </div>

                  <input
                    id="photo-upload-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.avif,.heic,.heif,image/jpeg,image/png,image/webp,image/avif,image/heic"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        validateAndProcessFile(file);
                      }
                      e.target.value = '';
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-[#082032] border border-[#334756]/80 p-4 rounded-xl flex flex-col items-center justify-center max-h-96 relative group shadow-xl">
                    <img
                      src={imageUrl}
                      alt="Preview Photo"
                      className="max-h-72 object-contain rounded-lg shadow-md"
                    />

                    {/* Badge Info Berkas */}
                    {selectedFile && (
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-300 bg-[#2C394B]/60 px-3 py-1.5 rounded-lg border border-[#334756]/60">
                        <span className="font-medium text-white truncate max-w-[200px]">
                          {selectedFile.name}
                        </span>
                        <span className="text-gray-400 font-mono text-[11px]">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#FF4C29] bg-[#FF4C29]/15 px-2 py-0.5 rounded">
                          {selectedFile.name.split('.').pop() || 'IMAGE'}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setSelectedFile(null);
                        setFileWarning(null);
                      }}
                      className="absolute top-4 right-4 bg-black/70 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600/90 border border-white/15 shadow-lg flex items-center gap-1.5"
                    >
                      <span>Ganti Foto</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Basic Info (Title, Category, Caption, Privacy) */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              {/* Row 1: Judul Foto & Kategori Genre Sejajar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-xs text-white mb-1.5">
                    Judul Foto *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Senja di Pasar Antik"
                    className="w-full bg-[#082032]/60 border border-[#334756] rounded-xl px-3.5 py-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#FF4C29] focus:ring-1 focus:ring-[#FF4C29] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-xs text-white mb-1.5">
                    Kategori Genre *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#082032]/60 border border-[#334756] rounded-xl px-3.5 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-[#FF4C29] focus:ring-1 focus:ring-[#FF4C29] transition-all cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Cerita & Catatan Fotografer (Caption) */}
              <div>
                <label className="block font-semibold text-xs text-white mb-1.5">
                  Cerita & Catatan Fotografer (Caption)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan latar belakang foto, nuansa emosi, tempat pencucian film, atau momen spesial saat pengambilan gambar..."
                  className="w-full bg-[#082032]/60 border border-[#334756] rounded-xl p-3 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#FF4C29] focus:ring-1 focus:ring-[#FF4C29] transition-all leading-relaxed"
                />
              </div>

              {/* Row 3: Status Privasi Karya Foto (Radiobox Cards Interaktif) */}
              <div>
                <label className="block font-semibold text-xs text-white mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#FF4C29]" />
                    <span>Status Privasi Karya Foto *</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono tracking-wider">
                    {isPrivate ? '🔒 AKSES PRIBADI' : '🌐 DIBAGIKAN KE KOMUNITAS'}
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Opsi 1: Publik */}
                  <div
                    onClick={() => setIsPrivate(false)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3.5 group ${
                      !isPrivate
                        ? 'bg-[#FF4C29]/10 border-[#FF4C29] shadow-lg shadow-[#FF4C29]/10 ring-1 ring-[#FF4C29]/40'
                        : 'bg-[#2C394B]/20 border-[#334756]/80 hover:bg-[#2C394B]/40 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg border shrink-0 transition-all ${
                        !isPrivate
                          ? 'bg-[#FF4C29]/20 border-[#FF4C29]/50 text-[#FF4C29] scale-105'
                          : 'bg-[#082032] border-[#334756] text-gray-400 group-hover:text-gray-200'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${!isPrivate ? 'text-white' : 'text-gray-300'}`}>
                          Publik (Feed Komunitas)
                        </span>
                        {/* Custom Radio Circle */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            !isPrivate
                              ? 'border-[#FF4C29] bg-[#FF4C29]'
                              : 'border-gray-500 bg-transparent'
                          }`}
                        >
                          {!isPrivate && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        Karya dapat dilihat oleh semua orang di feed utama, diapresiasi, dan dikomentari.
                      </p>
                    </div>
                  </div>

                  {/* Opsi 2: Privat */}
                  <div
                    onClick={() => setIsPrivate(true)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3.5 group ${
                      isPrivate
                        ? 'bg-[#FF4C29]/10 border-[#FF4C29] shadow-lg shadow-[#FF4C29]/10 ring-1 ring-[#FF4C29]/40'
                        : 'bg-[#2C394B]/20 border-[#334756]/80 hover:bg-[#2C394B]/40 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg border shrink-0 transition-all ${
                        isPrivate
                          ? 'bg-[#FF4C29]/20 border-[#FF4C29]/50 text-[#FF4C29] scale-105'
                          : 'bg-[#082032] border-[#334756] text-gray-400 group-hover:text-gray-200'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${isPrivate ? 'text-white' : 'text-gray-300'}`}>
                          Privat (Koleksi Pribadi)
                        </span>
                        {/* Custom Radio Circle */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isPrivate
                              ? 'border-[#FF4C29] bg-[#FF4C29]'
                              : 'border-gray-500 bg-transparent'
                          }`}
                        >
                          {isPrivate && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        Hanya Anda yang dapat melihat foto ini. Foto tidak akan muncul di feed publik orang lain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Tags */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-semibold text-xs text-white mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF4C29]" />
                    <span>Lokasi Pemotretan</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Kotagede, Yogyakarta"
                    className="w-full bg-[#2C394B]/30 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#FF4C29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-xs text-white mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FF4C29]" />
                    <span>Tag (pisahkan dengan koma)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Contoh: Portra400, GoldenHour, Street"
                    className="w-full bg-[#2C394B]/30 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-[#FF4C29] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}


          {/* Action Buttons Bar */}
          <div className="pt-6 border-t border-[#334756]/30 flex items-center justify-between gap-3 mt-8">
            {step === 1 ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-full text-white hover:bg-[#2C394B]/50 font-medium text-xs transition-colors border border-[#334756]/30"
              >
                Batal
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s: number) => s - 1)}
                className="px-5 py-2.5 rounded-full text-white hover:bg-[#2C394B]/50 font-medium text-xs transition-colors border border-[#334756]/30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#FF4C29]" />
                <span>Sebelumnya</span>
              </button>
            )}

            {step < 3 ? (
              <button
                key="btn-next"
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-[#FF4C29] text-white font-semibold text-xs hover:bg-[#334756] shadow-md transition-all transform hover:-translate-y-0.5"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                key="btn-submit"
                type="submit"
                disabled={isUploading}
                className={`px-6 py-2.5 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all ${
                  isUploading 
                    ? "bg-[#334756] opacity-70 cursor-not-allowed" 
                    : "bg-[#FF4C29] hover:bg-[#334756] transform hover:-translate-y-0.5"
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-white" />
                    <span>Publikasikan Karya</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
};
