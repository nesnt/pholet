import React, { useState } from 'react';
import { Photographer, Photo } from '../types';
import { PhotoCard } from './PhotoCard';
import { MapPin, Globe, Camera, Film, Heart, Grid, Bookmark, UserCheck, UserPlus, Edit3, User } from 'lucide-react';

interface ProfilePageProps {
  photographer: Photographer;
  photos: Photo[];
  onLikeToggle: (photoId: string) => void;
  onBookmarkToggle: (photoId: string) => void;
  onClickPhoto: (photo: Photo) => void;
  onClickPhotographer: (photographerId: string) => void;
  onToggleFollow: (photographerId: string) => void;
  isCurrentUser?: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  photographer,
  photos,
  onLikeToggle,
  onBookmarkToggle,
  onClickPhoto,
  onClickPhotographer,
  onToggleFollow,
  isCurrentUser = false,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'liked' | 'bookmarked'>('photos');

  // Filter photos uploaded by this photographer
  const myPhotos = photos.filter((p) => p.photographerId === photographer.id);
  const likedPhotos = photos.filter((p) => p.isLiked);
  const bookmarkedPhotos = photos.filter((p) => p.isBookmarked);

  const displayedPhotos = 
    activeTab === 'photos' ? myPhotos :
    activeTab === 'liked' ? likedPhotos : bookmarkedPhotos;

  return (
    <div className="space-y-6">
      
      {/* Profile Header Container - Full Screen Width */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#082032] border-y border-[#334756]/30 shadow-sm -mt-6 mb-8">
        
        {/* Banner Cover with Smooth Gradient to background color */}
        <div className="h-48 sm:h-64 lg:h-72 w-full relative bg-[#082032]">
          {photographer.bannerUrl && (
            <img
              src={photographer.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover opacity-90"
            />
          )}
          {/* Top subtle dark vignette for contrast + Bottom smooth transition to background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#082032]" />
        </div>

        {/* Profile Details Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            
            {/* Avatar & Main Info */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#082032] shadow-lg bg-[#2C394B] flex items-center justify-center shrink-0">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
              </div>
              <div className="mb-1">
                <h1 className="font-serif-display text-xl sm:text-2xl font-bold text-white">
                  {photographer.name}
                </h1>
                <p className="text-xs text-white font-medium">
                  {photographer.handle}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                  {photographer.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF4C29]" />
                      {photographer.location}
                    </span>
                  )}
                  {photographer.website && (
                    <a
                      href={photographer.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-white hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#FF4C29]" />
                      <span>{photographer.website.replace('https://', '')}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Follow / Action Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {!isCurrentUser ? (
                <button
                  onClick={() => onToggleFollow(photographer.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
                    photographer.isFollowing
                      ? 'bg-[#2C394B] text-white border border-[#334756]/40 hover:bg-rose-100 hover:text-rose-700'
                      : 'bg-[#FF4C29] text-white hover:bg-[#334756]'
                  }`}
                >
                  {photographer.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-[#FF4C29]" />
                      <span>Mengikuti</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-[#FF4C29]" />
                      <span>Ikuti Fotografer</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-[#2C394B]/80 border border-[#334756]/40 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#2C394B]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FF4C29]" />
                  <span>Edit Portofolio</span>
                </button>
              )}
            </div>

          </div>

          {/* Bio text */}
          <p className="text-xs sm:text-sm text-gray-100/90 max-w-2xl leading-relaxed mb-5">
            {photographer.bio}
          </p>

          {/* Statistics Strip */}
          <div className="flex items-center gap-6 py-3 px-4 bg-[#2C394B]/40 border border-[#334756]/30 rounded-xl mb-5 text-xs text-white flex-wrap">
            <div>
              <span className="font-bold text-sm block">{myPhotos.length}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Karya Foto
              </span>
            </div>
            <div className="w-px h-8 bg-[#978F66]/30" />
            <div>
              <span className="font-bold text-sm block">
                {myPhotos.reduce((acc, p) => acc + p.likesCount, 0)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Total Suka
              </span>
            </div>
          </div>

          {/* Film Gear List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#FF4C29]" />
              <span>Perlengkapan Kamera & Rol Film Favorit:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {photographer.filmGear.map((gear) => (
                <span
                  key={gear}
                  className="bg-[#082032] text-white border border-[#334756]/40 text-[11px] font-mono px-3 py-1 rounded-md flex items-center gap-1 shadow-2xs"
                >
                  <Film className="w-3 h-3 text-[#FF4C29]" />
                  {gear}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Filter (Photos vs Liked vs Bookmarked) */}
      <div className="flex items-center gap-2 border-b border-[#334756]/30 pb-2">
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'photos'
              ? 'bg-[#FF4C29] text-white'
              : 'text-white hover:bg-[#2C394B]/50'
          }`}
        >
          <Grid className="w-4 h-4 text-[#FF4C29]" />
          <span>Portofolio ({myPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'liked'
              ? 'bg-[#FF4C29] text-white'
              : 'text-white hover:bg-[#2C394B]/50'
          }`}
        >
          <Heart className="w-4 h-4 text-[#FF4C29]" />
          <span>Foto Disukai ({likedPhotos.length})</span>
        </button>

        {isCurrentUser && (
          <button
            onClick={() => setActiveTab('bookmarked')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'bookmarked'
                ? 'bg-[#FF4C29] text-white'
                : 'text-white hover:bg-[#2C394B]/50'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#FF4C29]" />
            <span>Tersimpan ({bookmarkedPhotos.length})</span>
          </button>
        )}
      </div>

      {/* Photos Grid for Profile */}
      {displayedPhotos.length === 0 ? (
        <div className="bg-[#082032] border border-[#334756]/30 rounded-2xl p-10 text-center text-xs text-gray-400">
          Belum ada foto dalam kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedPhotos.map((photo) => (
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

    </div>
  );
};
