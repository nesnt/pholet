import React, { useState } from 'react';
import { Heart, Maximize2, Aperture, SlidersHorizontal, Grid, LayoutGrid, Sparkles, Filter } from 'lucide-react';
import { PhotoItem } from '../../types';
import { PHOLET_GALLERY } from '../../data/landing/photographyData';
import { PhotoLightbox } from './PhotoLightbox';
import { playDialTick, playShutterSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface GalleryArchiveProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onBookStyle: (photo: PhotoItem) => void;
}

export const GalleryArchive: React.FC<GalleryArchiveProps> = ({
  favorites,
  onToggleFavorite,
  onBookStyle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [layoutMode, setLayoutMode] = useState<'bento' | 'grid'>('bento');

  const categories = [
    { id: 'all', label: 'All Frames (09)' },
    { id: 'athletic', label: 'Athletic Motion' },
    { id: 'editorial', label: 'Editorial & Fashion' },
    { id: 'analog', label: 'Analog 35mm & 120' },
    { id: 'street', label: 'Street & Architecture' },
    { id: 'portrait', label: 'Studio Portraits' },
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? PHOLET_GALLERY
    : PHOLET_GALLERY.filter((p) => p.category === selectedCategory);

  const handleLikeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playDialTick();
    const willBeFavorite = !favorites.includes(id);
    onToggleFavorite(id);
    if (willBeFavorite) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FF4C29', '#E4D6A9', '#978F66'],
      });
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase mb-3">
              <Aperture className="w-3.5 h-3.5" />
              <span>THE PHOTOGRAPHIC ARCHIVES</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
              CURATED <span className="text-[#FF4C29]">EDITIONS</span> & SHOTS
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mt-2">
              Explore frames captured across high-velocity athletics, underground fight gyms, brutalist architecture, and analog darkrooms.
            </p>
          </div>

          {/* Layout Mode Switcher */}
          <div className="flex items-center gap-2 bg-[#2C394B] border border-[#334756] p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => {
                playDialTick();
                setLayoutMode('bento');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-camera font-bold transition-all ${
                layoutMode === 'bento'
                  ? 'bg-[#FF4C29] text-white pholet-shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>EDITORIAL</span>
            </button>
            <button
              onClick={() => {
                playDialTick();
                setLayoutMode('grid');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-camera font-bold transition-all ${
                layoutMode === 'grid'
                  ? 'bg-[#FF4C29] text-white pholet-shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>GRID (3x3)</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playDialTick();
                setSelectedCategory(cat.id);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-mono-camera font-bold tracking-wide transition-all border focus-pholet ${
                selectedCategory === cat.id
                  ? 'bg-[#FF4C29] border-[#FF4C29] text-white pholet-shadow-sm'
                  : 'bg-[#2C394B] border-[#334756] text-gray-300 hover:border-[#FF4C29] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Layout */}
        <div
          className={
            layoutMode === 'bento'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          {filteredPhotos.map((photo, index) => {
            const isFav = favorites.includes(photo.id);
            const isSpan2 = layoutMode === 'bento' && (index === 0 || index === 4);

            return (
              <div
                key={photo.id}
                onClick={() => {
                  playShutterSound();
                  setSelectedPhoto(photo);
                }}
                className={`group relative bg-[#2C394B] border-2 border-[#334756] hover:border-[#FF4C29] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 pholet-shadow-md hover:pholet-shadow-orange ${
                  isSpan2 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Photo Image Canvas */}
                <div className={`relative w-full overflow-hidden ${isSpan2 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Black/60 Overlay on Hover (Per Prompt Specification) */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6">
                    {/* Top Overlay Bar */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[#FF4C29] text-white text-[11px] font-mono-camera font-bold uppercase">
                        {photo.categoryLabel}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLikeClick(e, photo.id)}
                          className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                            isFav
                              ? 'bg-[#FF4C29] text-white'
                              : 'bg-[#082032]/80 text-[#FF4C29] hover:bg-[#FF4C29] hover:text-white'
                          }`}
                          title={isFav ? 'Liked' : 'Like this photo'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>

                        <span className="p-2 rounded-lg bg-[#082032]/80 text-[#E4D6A9]">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Center Viewfinder Reticle Accent */}
                    <div className="self-center pointer-events-none opacity-80">
                      <div className="w-12 h-12 border border-[#FF4C29]/70 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#FF4C29] rounded-full"></div>
                      </div>
                    </div>

                    {/* Bottom EXIF Telemetry on Hover */}
                    <div className="space-y-2 bg-[#082032]/90 border border-[#334756] rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs font-mono-camera text-gray-300">
                        <span className="text-[#E4D6A9] font-bold">{photo.shutterSpeed}</span>
                        <span className="text-[#978F66]">{photo.aperture}</span>
                        <span className="text-[#FF4C29] font-bold">{photo.iso}</span>
                        <span className="text-white">{photo.focalLength}</span>
                      </div>
                      <div className="text-xs text-gray-200 font-mono-camera truncate">
                        {photo.cameraModel} • {photo.lens}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permanent Card Meta Strip */}
                <div className="p-4 bg-[#2C394B] border-t border-[#334756] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h3 className="font-syne font-bold text-base text-white truncate group-hover:text-[#FF4C29] transition-colors">
                      {photo.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono-camera text-[#978F66] mt-0.5">
                      <span className="truncate">{photo.photographer}</span>
                      <span>•</span>
                      <span className="text-gray-300 truncate">{photo.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono-camera text-[#E4D6A9]">
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-[#FF4C29] fill-current' : 'text-[#FF4C29]'}`} />
                    <span>{photo.likes + (isFav ? 1 : 0)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        isFavorite={selectedPhoto ? favorites.includes(selectedPhoto.id) : false}
        onToggleFavorite={onToggleFavorite}
        onBookStyle={onBookStyle}
      />
    </section>
  );
};
