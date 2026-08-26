import React from 'react';
import { X, Heart, Trash2, Camera, ArrowRight, ExternalLink } from 'lucide-react';
import { PhotoItem } from '../../types';
import { PHOLET_GALLERY } from '../../data/landing/photographyData';
import { playDialTick, playShutterSound } from '../../utils/audio';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenBooking: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onOpenBooking,
}) => {
  if (!isOpen) return null;

  const favoritePhotos = PHOLET_GALLERY.filter((p) => favorites.includes(p.id));

  return (
    <div
      id="favorites-drawer-overlay"
      className="fixed inset-0 z-50 bg-[#082032]/80 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#2C394B] border-l-2 border-[#334756] h-full flex flex-col justify-between overflow-hidden pholet-shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#082032] border-b border-[#334756] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#FF4C29] fill-current" />
            <h3 className="font-syne font-bold text-lg text-white">
              SAVED ARCHIVES ({favoritePhotos.length})
            </h3>
          </div>

          <button
            onClick={() => {
              playDialTick();
              onClose();
            }}
            className="p-2 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-gray-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {favoritePhotos.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#082032] border border-[#334756] flex items-center justify-center mx-auto text-[#978F66]">
                <Heart className="w-5 h-5" />
              </div>
              <p className="font-mono-camera text-xs text-gray-400">
                No frames saved yet. Browse the archives and tap the heart icon to curate your personal visual moodboard.
              </p>
            </div>
          ) : (
            favoritePhotos.map((photo) => (
              <div
                key={photo.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#082032] border border-[#334756] group hover:border-[#FF4C29] transition-all"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#334756]"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono-camera text-[#978F66] uppercase">
                    {photo.categoryLabel}
                  </span>
                  <h4 className="font-syne font-bold text-sm text-white truncate">
                    {photo.title}
                  </h4>
                  <div className="text-xs font-mono-camera text-[#E4D6A9]">
                    {photo.shutterSpeed} • {photo.cameraModel}
                  </div>
                </div>

                <button
                  onClick={() => {
                    playDialTick();
                    onToggleFavorite(photo.id);
                  }}
                  className="p-2 text-gray-400 hover:text-[#FF4C29] transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favoritePhotos.length > 0 && (
          <div className="p-6 bg-[#082032] border-t border-[#334756] space-y-3">
            <button
              onClick={() => {
                playShutterSound();
                onClose();
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF4C29] hover:bg-[#ff360f] text-white text-xs font-bold uppercase tracking-wider rounded-xl pholet-shadow-md focus-pholet transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Commission Shoot with These Styles</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
