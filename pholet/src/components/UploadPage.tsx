import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, Film, MapPin, Sparkles, Image as ImageIcon, Tag, CheckCircle } from 'lucide-react';
import { Photo, Photographer } from '../types';
import { CATEGORIES, POPULAR_FILM_STOCKS } from '../data/mockData';

interface UploadPageProps {
  onCancel: () => void;
  onUploadSuccess: (newPhoto: Photo) => void;
  currentUser: Photographer;
}

const PRESET_SAMPLE_IMAGES = [
  {
    title: 'Sudut Kota Berdebu',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
    category: 'Street' as const,
    aspectRatio: 'landscape' as const,
    stock: 'Kodak Portra 400',
  },
  {
    title: 'Deretan Sepeda Tua di Pagi Hari',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1000',
    category: 'Still Life' as const,
    aspectRatio: 'portrait' as const,
    stock: 'Kodak Gold 200',
  },
  {
    title: 'Pijar Neon Kedai Makan 24 Jam',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1000',
    category: 'Street' as const,
    aspectRatio: 'tall' as const,
    stock: 'Cinestill 800T',
  },
  {
    title: 'Bayangan Daun di Dinding Kapur',
    url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=1000',
    category: 'Architecture' as const,
    aspectRatio: 'square' as const,
    stock: 'Ilford HP5 Plus',
  }
];

export const UploadPage: React.FC<UploadPageProps> = ({
  onCancel,
  onUploadSuccess,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_IMAGES[0].url);
  const [category, setCategory] = useState<Photo['category']>('Street');
  const [aspectRatio, setAspectRatio] = useState<Photo['aspectRatio']>('portrait');
  
  // EXIF fields
  const [camera, setCamera] = useState('Yashica Electro 35 GSN');
  const [lens, setLens] = useState('Yashinon 45mm f/1.7');
  const [filmStock, setFilmStock] = useState('Kodak Gold 200');
  const [iso, setIso] = useState('200');
  const [aperture, setAperture] = useState('f/2.8');
  const [shutterSpeed, setShutterSpeed] = useState('1/250s');
  const [location, setLocation] = useState('Yogyakarta, Indonesia');
  const [tagsInput, setTagsInput] = useState('AnalogFilm, KodakGold200, Street35mm');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      title: title.trim(),
      url: imageUrl.trim(),
      caption: caption.trim() || 'Sebuah karya foto berharga dari koleksi rol film pribadi.',
      photographerId: currentUser.id,
      photographer: currentUser,
      likesCount: 1,
      isLiked: true,
      isBookmarked: false,
      aspectRatio,
      category,
      tags: tagsArr.length > 0 ? tagsArr : ['35mm', 'PholetAnalog'],
      createdAt: 'Baru saja',
      exif: {
        camera,
        lens,
        filmStock,
        iso,
        aperture,
        shutterSpeed,
        focalLength: '45mm',
        location,
        dateTaken: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      },
      comments: []
    };

    onUploadSuccess(newPhoto);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#622B14] text-[#E4D6A9] p-6 rounded-2xl border border-[#995F2F]/40 shadow-md">
        <div className="space-y-1">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#E4D6A9]/80 hover:text-[#E4D6A9] transition-colors mb-2 bg-[#995F2F]/40 px-3 py-1.5 rounded-full border border-[#E4D6A9]/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Galeri</span>
          </button>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
            <Camera className="w-7 h-7 text-[#E4D6A9]" />
            <span>Upload Karya Foto Film Baru</span>
          </h1>
          <p className="text-xs text-[#E4D6A9]/80">
            Halaman publikasi foto analog. Isi detail kamera, rol film, dan catatan di balik jepretan Anda.
          </p>
        </div>
      </div>

      {/* Main Upload Form Layout */}
      <form onSubmit={handleSubmit} className="bg-[#F8F4E8] border border-[#978F66]/40 rounded-2xl shadow-lg p-6 space-y-6">
        
        {/* Step 1: Image Selection / Preset Chooser */}
        <div className="space-y-3 bg-[#E4D6A9]/20 p-4 sm:p-5 rounded-xl border border-[#978F66]/30">
          <label className="font-semibold text-sm text-[#622B14] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#995F2F]" />
            <span>Pilih Sampel Foto atau Masukkan URL Gambar *</span>
          </label>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setImageUrl(preset.url);
                  setCategory(preset.category);
                  setAspectRatio(preset.aspectRatio);
                  setFilmStock(preset.stock);
                  if (!title) setTitle(preset.title);
                }}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  imageUrl === preset.url
                    ? 'border-[#622B14] ring-2 ring-[#995F2F] scale-[1.02]'
                    : 'border-[#978F66]/30 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-[#21120B]/80 text-[#E4D6A9] text-[10px] p-1 truncate block font-sans">
                  {preset.title}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Atau tempelkan URL gambar langsung (https://...)"
              className="w-full bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-[#622B14] focus:outline-none"
              required
            />
          </div>

          {/* Live Preview Box */}
          {imageUrl && (
            <div className="bg-[#21120B] p-3 rounded-xl flex items-center justify-center max-h-72 overflow-hidden border border-[#978F66]/40 mt-3">
              <img
                src={imageUrl}
                alt="Preview Photo"
                className="max-h-64 object-contain rounded-md shadow-md"
              />
            </div>
          )}
        </div>

        {/* Step 2: Basic Info (Title & Category) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-xs text-[#622B14] mb-1.5">
              Judul Foto *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Senja di Pasar Antik"
              className="w-full bg-[#E4D6A9]/30 border border-[#978F66]/40 rounded-lg p-2.5 text-xs text-[#21120B] focus:ring-2 focus:ring-[#622B14] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-xs text-[#622B14] mb-1.5">
              Kategori Genre
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#E4D6A9]/30 border border-[#978F66]/40 rounded-lg p-2.5 text-xs text-[#21120B] focus:ring-2 focus:ring-[#622B14] focus:outline-none"
            >
              {CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 3: Story / Caption */}
        <div>
          <label className="block font-semibold text-xs text-[#622B14] mb-1.5">
            Cerita & Catatan Fotografer (Caption)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Tuliskan latar belakang foto, nuansa emosi, tempat pencucian film, atau momen spesial saat pengambilan gambar..."
            className="w-full bg-[#E4D6A9]/30 border border-[#978F66]/40 rounded-lg p-2.5 text-xs text-[#21120B] focus:ring-2 focus:ring-[#622B14] focus:outline-none"
          />
        </div>

        {/* Step 4: EXIF Camera & Film Specs */}
        <div className="bg-[#E4D6A9]/30 border border-[#978F66]/30 p-4 sm:p-5 rounded-xl space-y-3">
          <h3 className="font-semibold text-xs text-[#622B14] flex items-center gap-2 border-b border-[#978F66]/30 pb-2">
            <Film className="w-4 h-4 text-[#995F2F]" />
            <span>Spesifikasi EXIF Kamera & Rol Film Analog</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-[#978F66] font-semibold block mb-1">Kamera</label>
              <input
                type="text"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#622B14]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#978F66] font-semibold block mb-1">Lensa</label>
              <input
                type="text"
                value={lens}
                onChange={(e) => setLens(e.target.value)}
                className="w-full bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#622B14]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#978F66] font-semibold block mb-1">Rol Film (Stock)</label>
              <select
                value={filmStock}
                onChange={(e) => setFilmStock(e.target.value)}
                className="w-full bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-[#622B14]"
              >
                {POPULAR_FILM_STOCKS.filter(s => s !== 'Semua Rol Film').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#978F66] font-semibold block mb-1">Aperture</label>
              <input
                type="text"
                value={aperture}
                onChange={(e) => setAperture(e.target.value)}
                className="w-full bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#622B14]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#978F66] font-semibold block mb-1">Shutter Speed</label>
              <input
                type="text"
                value={shutterSpeed}
                onChange={(e) => setShutterSpeed(e.target.value)}
                className="w-full bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#622B14]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#978F66] font-semibold block mb-1">ISO Film</label>
              <input
                type="text"
                value={iso}
                onChange={(e) => setIso(e.target.value)}
                className="w-full bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#622B14]"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Location & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-xs text-[#622B14] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#995F2F]" />
              <span>Lokasi Pemotretan</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Kotagede, Yogyakarta"
              className="w-full bg-[#E4D6A9]/30 border border-[#978F66]/40 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#622B14] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-xs text-[#622B14] mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#995F2F]" />
              <span>Tag (pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Contoh: Portra400, GoldenHour, Street"
              className="w-full bg-[#E4D6A9]/30 border border-[#978F66]/40 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-[#622B14] focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="pt-4 border-t border-[#978F66]/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border border-[#978F66]/50 text-[#622B14] hover:bg-[#E4D6A9]/50 font-medium text-xs transition-colors"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-7 py-2.5 rounded-full bg-[#622B14] text-[#E4D6A9] font-semibold text-xs hover:bg-[#995F2F] shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Upload className="w-4 h-4" />
            <span>Publikasikan Karya Foto</span>
          </button>
        </div>

      </form>

    </div>
  );
};
