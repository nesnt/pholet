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
      <div className="bg-[#E4D6A9]/40 border border-[#978F66]/30 p-3 sm:p-4 rounded-2xl shadow-sm space-y-3">
        
        {/* Top Row: Filter Categories */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#622B14] text-[#E4D6A9] shadow-sm'
                    : 'bg-[#F8F4E8] text-[#622B14] hover:bg-[#995F2F] hover:text-[#E4D6A9] border border-[#978F66]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Layout Mode Toggles */}
          <div className="flex items-center gap-1 bg-[#F8F4E8] p-1 rounded-xl border border-[#978F66]/30">
            <button
              onClick={() => setLayoutMode('masonry')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                layoutMode === 'masonry'
                  ? 'bg-[#995F2F] text-[#E4D6A9]'
                  : 'text-[#622B14] hover:bg-[#E4D6A9]/50'
              }`}
              title="Masonry Layout"
            >
              <Columns3 className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-medium">Masonry</span>
            </button>

            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-[#995F2F] text-[#E4D6A9]'
                  : 'text-[#622B14] hover:bg-[#E4D6A9]/50'
              }`}
              title="Uniform Grid"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-medium">Grid</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Film Stock Dropdown & Count Status */}
        <div className="flex items-center justify-between pt-2 border-t border-[#978F66]/20 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#995F2F]" />
            <span className="font-medium text-[#622B14]">Filter Rol Film:</span>
            <select
              value={selectedFilmStock}
              onChange={(e) => onFilmStockSelect(e.target.value)}
              className="bg-[#F8F4E8] border border-[#978F66]/40 rounded-lg px-2.5 py-1 text-xs text-[#622B14] font-mono focus:outline-none focus:ring-1 focus:ring-[#622B14]"
            >
              {POPULAR_FILM_STOCKS.map((stock) => (
                <option key={stock} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[#978F66] font-medium">
            Menampilkan <span className="font-semibold text-[#622B14]">{photos.length}</span> karya foto
          </div>
        </div>

      </div>

      {/* Empty State */}
      {photos.length === 0 ? (
        <div className="bg-[#F8F4E8] border-2 border-dashed border-[#978F66]/40 rounded-2xl p-12 text-center space-y-3 my-8">
          <div className="w-12 h-12 rounded-full bg-[#E4D6A9] text-[#622B14] flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-serif-display text-lg font-bold text-[#622B14]">
            Tidak Ada Foto Yang Sesuai Filter
          </h3>
          <p className="text-xs text-[#978F66] max-w-md mx-auto">
            Coba ubah kata kunci pencarian, atau pilih kategori dan rol film yang berbeda untuk menemukan karya foto legendaris lainnya.
          </p>
          <button
            onClick={() => {
              onCategorySelect('Semua');
              onFilmStockSelect('Semua Rol Film');
            }}
            className="px-4 py-2 bg-[#622B14] text-[#E4D6A9] text-xs font-semibold rounded-full hover:bg-[#995F2F] transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : layoutMode === 'masonry' ? (
        /* Masonry Columns View (Pinterest style) */
        <div className="columns-[280px] sm:columns-[320px] lg:columns-[340px] gap-4 sm:gap-6 [column-fill:_balance]">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 sm:gap-6">
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
