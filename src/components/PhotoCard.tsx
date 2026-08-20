import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Camera, Film, MapPin, Share2, User } from 'lucide-react';
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
      className="group relative bg-[#082032] rounded-2xl border border-[#334756]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
      onClick={() => onClickPhoto(photo)}
    >
      {/* Main Image Area */}
      <div className={`relative w-full ${getAspectClass()} overflow-hidden select-none`}>
      {/* Badge Status Privat (Hanya muncul jika foto bersifat Privat) */}
        {photo.isPrivate && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-md border border-[#FF4C29]/40 text-[11px] font-semibold text-amber-300 rounded-full flex items-center gap-1 shadow-md">
            🔒 Privat
          </div>
        )}
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
      </div>

      {/* Hover Overlay Container */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
        
        {/* Top Header: Photographer info & Film */}
        <div className="flex items-start justify-between pointer-events-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClickPhotographer(photo.photographer.id);
            }}
            className="flex items-center gap-2.5 text-left group/user hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full border border-white/30 group-hover/user:border-[#FF4C29] transition-colors bg-[#2C394B]/80 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-sm">
              <User className="w-4 h-4 text-gray-300" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover/user:underline drop-shadow-md">
                {photo.photographer.name}
              </h4>
              <span className="text-[10px] text-gray-200 block drop-shadow-md">
                {photo.photographer.handle}
              </span>
            </div>
          </button>

          <span className="bg-[#082032]/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-mono tracking-wider flex items-center gap-1 shadow-md border border-white/20">
            <Film className="w-3 h-3 text-[#FF4C29]" />
            {photo.exif.filmStock}
          </span>
        </div>

        {/* Bottom Section: Info & Actions */}
        <div className="pointer-events-auto flex flex-col gap-3">
          {/* Title & Location */}
          <div>
            <h3 className="font-serif-display text-sm font-semibold text-white leading-tight line-clamp-1 drop-shadow-md">
              {photo.title}
            </h3>
            {photo.exif.location && (
              <span className="text-[10px] text-white/90 flex items-center gap-1 mt-0.5 font-light drop-shadow-md">
                <MapPin className="w-2.5 h-2.5 text-[#FF4C29]" />
                {photo.exif.location}
              </span>
            )}
          </div>

          {/* EXIF Mini Info Bar */}
          <div className="flex items-center justify-between text-[11px] text-white/90 font-mono bg-[#2C394B]/70 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-white/20">
            <span className="flex items-center gap-1.5 truncate">
              <Camera className="w-3 h-3 text-[#FF4C29]" />
              <span className="truncate">{photo.exif.camera}</span>
            </span>
            <span className="text-white font-semibold text-[10px]">
              {photo.exif.aperture} • {photo.exif.shutterSpeed}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLikeClick}
                className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                  photo.isLiked
                    ? 'text-rose-700 bg-rose-100/90 hover:bg-rose-200'
                    : 'text-white hover:bg-white/20'
                }`}
                title={photo.isLiked ? 'Batal Suka' : 'Suka Foto'}
                aria-label={photo.isLiked ? 'Batal Suka' : 'Suka Foto'}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    photo.isLiked ? 'fill-rose-600 text-[#FF4C29]' : ''
                  } ${isLikingAnimation ? 'animate-heart-burst' : ''}`}
                />
                <span className="text-xs font-semibold drop-shadow-md">
                  {photo.likesCount}
                </span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); onClickPhoto(photo); }}
                className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors flex items-center gap-1"
                title="Komentar"
                aria-label="Komentar"
              >
                <MessageCircle className="w-4 h-4 text-[#FF4C29]" />
                <span className="text-xs font-medium drop-shadow-md">
                  {photo.comments.length}
                </span>
              </button>
            </div>

            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full transition-colors ${
                photo.isBookmarked
                  ? 'text-white bg-white/20'
                  : 'text-white hover:bg-white/20'
              }`}
              title={photo.isBookmarked ? 'Tersimpan' : 'Simpan Foto'}
              aria-label={photo.isBookmarked ? 'Tersimpan' : 'Simpan Foto'}
            >
              <Bookmark className={`w-4 h-4 ${photo.isBookmarked ? 'fill-[#995F2F]' : ''} text-[#FF4C29]`} />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
