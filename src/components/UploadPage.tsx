import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, Film, MapPin, Image as ImageIcon, Tag, CheckCircle } from 'lucide-react';
import { Photo, Photographer } from '../types';
import { CATEGORIES, POPULAR_FILM_STOCKS } from '../data/mockData';

interface UploadPageProps {
  onCancel: () => void;
  onUploadSuccess: (newPhoto: any) => void;
  currentUser: Photographer;
}


const STEPS = [
  { id: 1, title: 'Upload Foto' },
  { id: 2, title: 'Cerita Karya' },
  { id: 3, title: 'Lokasi & Tag' },
  { id: 4, title: 'Spesifikasi EXIF' }
];

export const UploadPage: React.FC<UploadPageProps> = ({
  onCancel,
  onUploadSuccess,
  currentUser,
}) => {
  const [step, setStep] = useState(1);
  const handleNext = () => setStep(s => (s < 4 ? s + 1 : s));

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Photo['category']>('Street');
  const [aspectRatio, setAspectRatio] = useState<Photo['aspectRatio']>('portrait');
  const [isPrivate, setIsPrivate] = useState(false);

  // EXIF fields
  const [camera, setCamera] = useState('Yashica Electro 35 GSN');
  const [lens, setLens] = useState('Yashinon 45mm f/1.7');
  const [filmStock, setFilmStock] = useState('Kodak Gold 200');
  const [iso, setIso] = useState('200');
  const [aperture, setAperture] = useState('f/2.8');
  const [shutterSpeed, setShutterSpeed] = useState('1/250s');
  const [location, setLocation] = useState('Yogyakarta, Indonesia');
  const [tagsInput, setTagsInput] = useState('AnalogFilm, KodakGold200, Street35mm');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      handleNext();
      return;
    }

    if (!title.trim() || !selectedFile) {
      alert("Judul dan file foto wajib diisi!");
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
      formData.append("camera", camera);
      formData.append("lens", lens);
      formData.append("filmStock", filmStock);
      formData.append("iso", iso);
      formData.append("aperture", aperture);
      formData.append("shutterSpeed", shutterSpeed);
      formData.append("location", location);
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
      alert(err.message);
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
            Halaman publikasi foto analog. Isi detail kamera, rol film, dan catatan di balik jepretan Anda.
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
              <label className="font-semibold text-sm text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#FF4C29]" />
                <span>Pilih Foto dari Perangkat Anda *</span>
              </label>

              {!imageUrl ? (
                <div
                  className="w-full h-48 sm:h-64 border-2 border-dashed border-[#334756] rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-[#082032]/50 hover:border-[#FF4C29] hover:text-white transition-colors cursor-pointer"
                  onClick={() => document.getElementById('photo-upload-input')?.click()}
                >
                  <Upload className="w-8 h-8 mb-3 opacity-70 text-[#FF4C29]" />
                  <p className="font-medium text-sm">Klik atau seret foto ke area ini</p>
                  <p className="text-xs opacity-70 mt-1">Mendukung JPG, PNG (Maks 5MB)</p>
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file); // Store the actual file for upload
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setImageUrl(ev.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-[#082032] p-3 rounded-xl flex flex-col items-center justify-center max-h-80 overflow-hidden mt-3 relative group">
                    <img
                      src={imageUrl}
                      alt="Preview Photo"
                      className="max-h-72 object-contain rounded-md shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setSelectedFile(null);
                      }}
                      className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/80 border border-[#2C394B]/20"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Basic Info (Title, Category, Caption) */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
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
                    className="w-full bg-[#2C394B]/30 rounded-lg p-2.5 text-xs text-gray-100 focus:ring-2 focus:ring-[#FF4C29] focus:outline-none"
                    required
                  />
                </div>

                {/* Pilihan Status Privasi Foto */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Status Privasi Karya Foto
                  </label>
                  <select
                    value={isPrivate ? "true" : "false"}
                    onChange={(e) => setIsPrivate(e.target.value === "true")}
                    className="w-full px-4 py-2.5 bg-[#082032]/60 border border-[#334756] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF4C29]"
                  >
                    <option value="false">🌐 Publik (Dapat dilihat semua orang di Feed)</option>
                    <option value="true">🔒 Privat (Hanya saya yang bisa melihat di Profil)</option>
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    *Foto privat tidak akan muncul di feed publik orang lain.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-xs text-white mb-1.5">
                    Kategori Genre
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#2C394B]/30 rounded-lg p-2.5 text-xs text-gray-100 focus:ring-2 focus:ring-[#FF4C29] focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-xs text-white mb-1.5">
                  Cerita & Catatan Fotografer (Caption)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan latar belakang foto, nuansa emosi, tempat pencucian film, atau momen spesial saat pengambilan gambar..."
                  className="w-full bg-[#2C394B]/30 rounded-lg p-2.5 text-xs text-gray-100 focus:ring-2 focus:ring-[#FF4C29] focus:outline-none"
                />
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

          {/* Step 4: EXIF Camera & Film Specs */}
          {step === 4 && (
            <div className="bg-[#2C394B]/30 p-4 sm:p-5 rounded-xl space-y-4 animate-fade-in">
              <h3 className="font-semibold text-xs text-white flex items-center gap-2 border-b border-[#334756]/30 pb-2">
                <Film className="w-4 h-4 text-[#FF4C29]" />
                <span>Spesifikasi EXIF Kamera & Rol Film Analog</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Kamera</label>
                  <input
                    type="text"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    className="w-full bg-[#082032] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#FF4C29]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Lensa</label>
                  <input
                    type="text"
                    value={lens}
                    onChange={(e) => setLens(e.target.value)}
                    className="w-full bg-[#082032] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#FF4C29]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Rol Film (Stock)</label>
                  <select
                    value={filmStock}
                    onChange={(e) => setFilmStock(e.target.value)}
                    className="w-full bg-[#082032] rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-[#FF4C29]"
                  >
                    {POPULAR_FILM_STOCKS.filter(s => s !== 'Semua Rol Film').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Aperture</label>
                  <input
                    type="text"
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                    className="w-full bg-[#082032] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#FF4C29]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Shutter Speed</label>
                  <input
                    type="text"
                    value={shutterSpeed}
                    onChange={(e) => setShutterSpeed(e.target.value)}
                    className="w-full bg-[#082032] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#FF4C29]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">ISO Film</label>
                  <input
                    type="text"
                    value={iso}
                    onChange={(e) => setIso(e.target.value)}
                    className="w-full bg-[#082032] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#FF4C29]"
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
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 rounded-full text-white hover:bg-[#2C394B]/50 font-medium text-xs transition-colors border border-[#334756]/30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#FF4C29]" />
                <span>Sebelumnya</span>
              </button>
            )}

            {step < 4 ? (
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
