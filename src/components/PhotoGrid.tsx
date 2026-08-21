import React, { useState } from 'react';
import { Photo, LayoutMode } from '../types';
import { PhotoCard } from './PhotoCard';
import { CATEGORIES, POPULAR_FILM_STOCKS } from '../data/mockData';
import { LayoutGrid, Grid3X3, Columns3, Filter, Film, Sparkles } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  selectedFilmStock: string;
  onFilmStockSelect: (stock: string) => void;
  onLikeToggle: (photoId: string) => void;
  onBookmarkToggle: (photoId: string) => void;
  onClickPhoto: (photo: Photo) => void;
  onClickPhotographer: (photographerId: string) => void;
  isLoading?: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  selectedCategory,
  onCategorySelect,
  selectedFilmStock,
  onFilmStockSelect,
  onLikeToggle,
  onBookmarkToggle,
  onClickPhoto,
  onClickPhotographer,
  isLoading = false,
}) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('masonry');

  // Distribute photos into columns for Masonry layout
  const getMasonryColumns = (colCount: number) => {
    const columns: Photo[][] = Array.from({ length: colCount }, () => []);
    photos.forEach((photo, idx) => {
      columns[idx % colCount].push(photo);
    });
    return columns;
  };

  return (
    <section className="space-y-6">
      
      {/* Category Pills & Controls Header */}
      <div className="bg-[#2C394B]/40 border border-[#334756]/30 p-3 sm:p-4 rounded-2xl shadow-sm space-y-3">
        
        {/* Top Row: Filter Categories */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full max-w-[calc(100%-80px)] sm:max-w-md lg:max-w-xl">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pr-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#FF4C29] text-white shadow-sm'
                      : 'bg-[#082032] text-white hover:bg-[#334756] hover:text-white border border-[#334756]/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Horizontal Scroll Fade Indicator */}
            <div className="absolute top-0 right-0 bottom-1 w-12 bg-gradient-to-l from-[#162A3C] to-[#162A3C]/0 pointer-events-none rounded-r-2xl" />
          </div>

          {/* Layout Mode Toggles */}
          <div className="flex items-center gap-1 bg-[#082032] p-1 rounded-xl border border-[#334756]/30 shrink-0">
            <button
              onClick={() => setLayoutMode('masonry')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                layoutMode === 'masonry'
                  ? 'bg-[#334756] text-white'
                  : 'text-white hover:bg-[#2C394B]/50'
              }`}
              title="Masonry Layout"
              aria-label="Tampilan Masonry"
            >
              <Columns3 className="w-4 h-4 text-[#FF4C29]" />
              <span className="hidden sm:inline text-[11px] font-medium">Masonry</span>
            </button>

            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-[#334756] text-white'
                  : 'text-white hover:bg-[#2C394B]/50'
              }`}
              title="Uniform Grid"
              aria-label="Tampilan Grid Seragam"
            >
              <Grid3X3 className="w-4 h-4 text-[#FF4C29]" />
              <span className="hidden sm:inline text-[11px] font-medium">Grid</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Film Stock Dropdown & Count Status */}
        <div className="flex items-center justify-between pt-2 border-t border-[#334756]/20 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#FF4C29]" />
            <span className="font-medium text-white">Filter Rol Film:</span>
            <select
              value={selectedFilmStock}
              onChange={(e) => onFilmStockSelect(e.target.value)}
              className="bg-[#082032] border border-[#334756]/40 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#FF4C29]"
            >
              {POPULAR_FILM_STOCKS.map((stock) => (
                <option key={stock} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
          </div>

          <div className="text-gray-400 font-medium">
            Menampilkan <span className="font-semibold text-white">{photos.length}</span> karya foto
          </div>
        </div>

      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div style={layoutMode === 'masonry' ? { columnWidth: '200px', columnGap: '1.5rem' } : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }} className={layoutMode === 'masonry' ? "[column-fill:_balance]" : ""}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`mb-4 sm:mb-6 break-inside-avoid bg-[#082032] rounded-2xl border border-[#334756]/30 overflow-hidden ${layoutMode === 'grid' ? 'aspect-square' : 'min-h-[300px]'}`}>
              <div className="p-3 bg-[#2C394B]/30 border-b border-[#334756]/20 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2C394B]/50 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-[#2C394B]/50 rounded animate-pulse w-24" />
                  <div className="h-2 bg-[#2C394B]/50 rounded animate-pulse w-16" />
                </div>
              </div>
              <div className="w-full h-48 sm:h-64 bg-[#2C394B]/20 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[#2C394B]/50 rounded animate-pulse w-32" />
                <div className="h-3 bg-[#2C394B]/50 rounded animate-pulse w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-[#082032] border-2 border-dashed border-[#334756]/40 rounded-2xl p-12 text-center space-y-3 my-8">
          <div className="w-12 h-12 rounded-full bg-[#2C394B] text-white flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6 text-[#FF4C29]" />
          </div>
          <h3 className="font-serif-display text-lg font-bold text-white">
            Tidak Ada Foto Yang Sesuai Filter
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Coba ubah kata kunci pencarian, atau pilih kategori dan rol film yang berbeda untuk menemukan karya foto legendaris lainnya.
          </p>
          <button
            onClick={() => {
              onCategorySelect('Semua');
              onFilmStockSelect('Semua Rol Film');
            }}
            className="px-4 py-2 bg-[#FF4C29] text-white text-xs font-semibold rounded-full hover:bg-[#334756] transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : layoutMode === 'masonry' ? (
        /* Masonry Columns View (Pinterest style) */
        <div style={{ columnWidth: '200px', columnGap: '1.5rem' }} className="[column-fill:_balance]">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid mb-4 sm:mb-6">
              <PhotoCard
                photo={photo}
                onLikeToggle={onLikeToggle}
                onBookmarkToggle={onBookmarkToggle}
                onClickPhoto={onClickPhoto}
                onClickPhotographer={onClickPhotographer}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Uniform Grid View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onLikeToggle={onLikeToggle}
              onBookmarkToggle={onBookmarkToggle}
              onClickPhoto={onClickPhoto}
              onClickPhotographer={onClickPhotographer}
            />
          ))}
        </div>
      )}

    </section>
  );
};
