import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Camera, Film, MapPin, Share2 } from 'lucide-react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onLikeToggle: (photoId: string) => void;
  onBookmarkToggle?: (photoId: string) => void;
  onClickPhoto: (photo: Photo) => void;
  onClickPhotographer: (photographerId: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onLikeToggle,
  onBookmarkToggle,
  onClickPhoto,
  onClickPhotographer,
}) => {
  const [isLikingAnimation, setIsLikingAnimation] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLikingAnimation(true);
    onLikeToggle(photo.id);
    setTimeout(() => {
      setIsLikingAnimation(false);
    }, 450);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmarkToggle) {
      onBookmarkToggle(photo.id);
    }
  };

  // Determine aspect ratio class
  const getAspectClass = () => {
    switch (photo.aspectRatio) {
      case 'portrait':
        return 'aspect-[3/4]';
      case 'tall':
        return 'aspect-[9/16]';
      case 'landscape':
        return 'aspect-[4/3]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  return (
    <article 
      className="group relative bg-[#F8F4E8] rounded-xl border border-[#978F66]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
    >
      {/* Top Header: Photographer info */}
      <div className="p-3 bg-[#E4D6A9]/30 border-b border-[#978F66]/20 flex items-center justify-between">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClickPhotographer(photo.photographer.id);
          }}
          className="flex items-center gap-2.5 text-left group/user hover:opacity-90 transition-opacity"
        >
          <img
            src={photo.photographer.avatar}
            alt={photo.photographer.name}
            className="w-8 h-8 rounded-full object-cover border border-[#995F2F]/60 group-hover/user:border-[#622B14] transition-colors"
          />
          <div>
            <h4 className="text-xs font-semibold text-[#622B14] line-clamp-1 group-hover/user:underline">
              {photo.photographer.name}
            </h4>
            <span className="text-[10px] text-[#978F66] block">
              {photo.photographer.handle}
            </span>
          </div>
        </button>

        <span className="text-[10px] text-[#978F66] font-medium bg-[#E4D6A9]/60 px-2 py-0.5 rounded-full border border-[#978F66]/30">
          {photo.category}
        </span>
      </div>

      {/* Main Image Area with Film Border Styling */}
      <div 
        onClick={() => onClickPhoto(photo)}
        className={`relative w-full ${getAspectClass()} overflow-hidden bg-[#21120B]/10 cursor-pointer select-none`}
      >
        {/* Placeholder Loading shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#E4D6A9]/20 via-[#978F66]/20 to-[#E4D6A9]/20 animate-pulse" />
        )}

        <img
          src={photo.url}
          alt={photo.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Film Stamp Badge (Camera / Stock overlay top right) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end pointer-events-none">
          <span className="bg-[#21120B]/80 backdrop-blur-md text-[#E4D6A9] text-[10px] px-2 py-0.5 rounded-md font-mono tracking-wider flex items-center gap-1 shadow-md border border-[#978F66]/40">
            <Film className="w-3 h-3 text-[#E4D6A9]" />
            {photo.exif.filmStock}
          </span>
        </div>

        {/* Bottom Image Gradient Overlay for Title & Location */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#21120B]/90 via-[#21120B]/40 to-transparent p-3 pt-8 text-[#E4D6A9] opacity-95 group-hover:opacity-100 transition-opacity">
          <h3 className="font-serif-display text-sm font-semibold leading-tight line-clamp-1 drop-shadow-sm">
            {photo.title}
          </h3>
          {photo.exif.location && (
            <span className="text-[10px] text-[#E4D6A9]/80 flex items-center gap-1 mt-0.5 font-light">
              <MapPin className="w-2.5 h-2.5 text-[#E4D6A9]/70" />
              {photo.exif.location}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions & EXIF Snippet */}
      <div className="p-3 bg-[#F8F4E8] flex flex-col gap-2 mt-auto">
        
        {/* EXIF Mini Info Bar */}
        <div className="flex items-center justify-between text-[11px] text-[#622B14]/80 font-mono bg-[#E4D6A9]/40 px-2.5 py-1 rounded-md border border-[#978F66]/20">
          <span className="flex items-center gap-1 truncate">
            <Camera className="w-3 h-3 text-[#995F2F]" />
            <span className="truncate">{photo.exif.camera}</span>
          </span>
          <span className="text-[#995F2F] font-semibold text-[10px]">
            {photo.exif.aperture} • {photo.exif.shutterSpeed}
          </span>
        </div>

        {/* Action Buttons & Likes Count */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {/* Heart Like Button */}
            <button
              onClick={handleLikeClick}
              className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                photo.isLiked
                  ? 'text-rose-700 bg-rose-100/80 hover:bg-rose-200'
                  : 'text-[#622B14] hover:bg-[#E4D6A9]/60 hover:text-[#995F2F]'
              }`}
              title={photo.isLiked ? 'Batal Suka' : 'Suka Foto'}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  photo.isLiked ? 'fill-rose-600 text-rose-600' : ''
                } ${isLikingAnimation ? 'animate-heart-burst' : ''}`}
              />
              <span className="text-xs font-semibold">
                {photo.likesCount}
              </span>
            </button>

            {/* Comment Count Button */}
            <button
              onClick={() => onClickPhoto(photo)}
              className="p-1.5 rounded-full text-[#622B14]/80 hover:bg-[#E4D6A9]/60 hover:text-[#995F2F] transition-colors flex items-center gap-1"
              title="Komentar"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">
                {photo.comments.length}
              </span>
            </button>
          </div>

          {/* Bookmark & Detail Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full transition-colors ${
                photo.isBookmarked
                  ? 'text-[#995F2F] bg-[#E4D6A9]'
                  : 'text-[#978F66] hover:text-[#622B14] hover:bg-[#E4D6A9]/50'
              }`}
              title={photo.isBookmarked ? 'Tersimpan' : 'Simpan Foto'}
            >
              <Bookmark className={`w-4 h-4 ${photo.isBookmarked ? 'fill-[#995F2F]' : ''}`} />
            </button>

            <button
              onClick={() => onClickPhoto(photo)}
              className="px-2.5 py-1 text-[11px] font-medium text-[#622B14] bg-[#E4D6A9]/60 hover:bg-[#995F2F] hover:text-[#E4D6A9] rounded-md transition-colors"
            >
              Detail
            </button>
          </div>

        </div>

      </div>
    </article>
  );
};
