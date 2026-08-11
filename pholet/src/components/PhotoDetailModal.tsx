import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Camera, 
  Film, 
  MapPin, 
  Calendar, 
  Share2, 
  Maximize2, 
  Send, 
  Aperture, 
  Info,
  Check
} from 'lucide-react';
import { Photo, Photographer } from '../types';

interface PhotoDetailModalProps {
  photo: Photo | null;
  onClose: () => void;
  onLikeToggle: (photoId: string) => void;
  onBookmarkToggle: (photoId: string) => void;
  onAddComment: (photoId: string, commentText: string) => void;
  onToggleFollowPhotographer: (photographerId: string) => void;
  onSelectPhotographer: (photographerId: string) => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  onClose,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onToggleFollowPhotographer,
  onSelectPhotographer,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isLikingAnimation, setIsLikingAnimation] = useState(false);
  const [isLightbox, setIsLightbox] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!photo) return null;

  const handleLikeClick = () => {
    setIsLikingAnimation(true);
    onLikeToggle(photo.id);
    setTimeout(() => {
      setIsLikingAnimation(false);
    }, 450);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(photo.id, commentText.trim());
    setCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#21120B]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      
      {/* Lightbox Mode Overlay if Toggled */}
      {isLightbox && (
        <div 
          onClick={() => setIsLightbox(false)}
          className="fixed inset-0 z-50 bg-[#21120B] flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-[92vh] object-contain rounded-sm shadow-2xl"
          />
          <p className="text-[#E4D6A9] text-xs font-serif-display mt-2">
            {photo.title} — {photo.photographer.name} ({photo.exif.camera}) • Klik di mana saja untuk kembali
          </p>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="relative w-full max-w-5xl bg-[#F8F4E8] rounded-2xl border border-[#978F66]/40 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#622B14]/80 text-[#E4D6A9] hover:bg-[#622B14] transition-colors shadow-md"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Photo Presentation Area */}
        <div className="md:w-3/5 bg-[#21120B] flex flex-col items-center justify-center relative p-2 min-h-[300px] md:min-h-[500px]">
          
          <img
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-[70vh] md:max-h-[82vh] object-contain rounded-md shadow-lg"
          />

          {/* Lightbox Toggle Button */}
          <button
            onClick={() => setIsLightbox(true)}
            className="absolute bottom-4 right-4 bg-[#622B14]/80 hover:bg-[#622B14] text-[#E4D6A9] p-2 rounded-full border border-[#978F66]/40 transition-colors shadow-md"
            title="Tampilkan Layar Penuh"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Film Stock Tag Badge */}
          <div className="absolute top-4 left-4 bg-[#622B14]/90 text-[#E4D6A9] text-xs px-3 py-1 rounded-full font-mono flex items-center gap-1.5 border border-[#978F66]/40 shadow-md">
            <Film className="w-3.5 h-3.5 text-[#E4D6A9]" />
            <span>{photo.exif.filmStock}</span>
          </div>
        </div>

        {/* Right Column: Photo Details, EXIF & Comments */}
        <div className="md:w-2/5 flex flex-col justify-between p-5 overflow-y-auto bg-[#F8F4E8] border-l border-[#978F66]/30">
          
          <div className="space-y-4">
            
            {/* Photographer Profile Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#978F66]/20">
              <button
                onClick={() => {
                  onSelectPhotographer(photo.photographer.id);
                  onClose();
                }}
                className="flex items-center gap-3 text-left group"
              >
                <img
                  src={photo.photographer.avatar}
                  alt={photo.photographer.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#622B14] group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="font-serif-display font-semibold text-sm text-[#622B14] group-hover:underline">
                    {photo.photographer.name}
                  </h3>
                  <p className="text-xs text-[#978F66]">
                    {photo.photographer.handle}
                  </p>
                </div>
              </button>

              <button
                onClick={() => onToggleFollowPhotographer(photo.photographer.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  photo.photographer.isFollowing
                    ? 'bg-[#E4D6A9] text-[#622B14] border border-[#978F66]/40 hover:bg-rose-100 hover:text-rose-700'
                    : 'bg-[#622B14] text-[#E4D6A9] hover:bg-[#995F2F]'
                }`}
              >
                {photo.photographer.isFollowing ? 'Mengikuti' : '+ Ikuti'}
              </button>
            </div>

            {/* Photo Title & Caption */}
            <div>
              <h2 className="font-serif-display text-xl font-bold text-[#622B14] leading-tight mb-2">
                {photo.title}
              </h2>
              <p className="text-xs text-[#21120B]/90 leading-relaxed font-sans">
                {photo.caption}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-[#995F2F] bg-[#E4D6A9]/60 border border-[#978F66]/30 px-2 py-0.5 rounded-full font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed EXIF Info Section */}
            <div className="bg-[#E4D6A9]/40 border border-[#978F66]/30 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#622B14] border-b border-[#978F66]/20 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Aperture className="w-4 h-4 text-[#995F2F]" />
                  <span>Spesifikasi Foto & EXIF</span>
                </span>
                <span className="text-[10px] text-[#978F66] font-mono">
                  {photo.exif.dateTaken}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#21120B]">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#995F2F] shrink-0" />
                  <span className="font-medium text-[11px] truncate">{photo.exif.camera}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#995F2F] shrink-0" />
                  <span className="font-medium text-[11px] truncate">{photo.exif.filmStock}</span>
                </div>
                <div className="text-[11px] text-[#622B14]">
                  <span className="text-[#978F66]">Lensa: </span>{photo.exif.lens}
                </div>
                <div className="text-[11px] text-[#622B14]">
                  <span className="text-[#978F66]">Aperture: </span>{photo.exif.aperture}
                </div>
                <div className="text-[11px] text-[#622B14]">
                  <span className="text-[#978F66]">Shutter: </span>{photo.exif.shutterSpeed}
                </div>
                <div className="text-[11px] text-[#622B14]">
                  <span className="text-[#978F66]">ISO: </span>{photo.exif.iso}
                </div>
              </div>

              {photo.exif.location && (
                <div className="pt-1 flex items-center gap-1 text-[11px] text-[#622B14]">
                  <MapPin className="w-3 h-3 text-[#995F2F]" />
                  <span>{photo.exif.location}</span>
                </div>
              )}
            </div>

            {/* Like & Action Bar */}
            <div className="flex items-center justify-between py-2 border-y border-[#978F66]/20">
              <div className="flex items-center gap-3">
                {/* Heart Button */}
                <button
                  onClick={handleLikeClick}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                    photo.isLiked
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-[#E4D6A9]/60 text-[#622B14] hover:bg-[#995F2F] hover:text-[#E4D6A9]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      photo.isLiked ? 'fill-rose-600 text-rose-600' : ''
                    } ${isLikingAnimation ? 'animate-heart-burst' : ''}`}
                  />
                  <span>{photo.likesCount} Suka</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => onBookmarkToggle(photo.id)}
                  className={`p-2 rounded-full border transition-colors ${
                    photo.isBookmarked
                      ? 'bg-[#995F2F] text-[#E4D6A9] border-[#995F2F]'
                      : 'border-[#978F66]/40 text-[#622B14] hover:bg-[#E4D6A9]/50'
                  }`}
                  title={photo.isBookmarked ? 'Tersimpan' : 'Simpan Foto'}
                >
                  <Bookmark className={`w-4 h-4 ${photo.isBookmarked ? 'fill-[#E4D6A9]' : ''}`} />
                </button>
              </div>

              {/* Share Link Button */}
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-full text-xs text-[#622B14] bg-[#E4D6A9]/60 border border-[#978F66]/30 hover:bg-[#E4D6A9] flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan</span>
                  </>
                )}
              </button>
            </div>

            {/* Comments List Section */}
            <div className="space-y-3">
              <h4 className="font-serif-display text-sm font-semibold text-[#622B14] flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#995F2F]" />
                <span>Komentar Komunitas ({photo.comments.length})</span>
              </h4>

              <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                {photo.comments.length === 0 ? (
                  <p className="text-xs text-[#978F66] italic bg-[#E4D6A9]/20 p-3 rounded-lg text-center">
                    Belum ada komentar. Jadilah fotografer pertama yang meninggalkan apresiasi!
                  </p>
                ) : (
                  photo.comments.map((comment) => (
                    <div key={comment.id} className="bg-[#E4D6A9]/30 border border-[#978F66]/20 p-2.5 rounded-lg text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#622B14] flex items-center gap-1.5">
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-5 h-5 rounded-full object-cover border border-[#978F66]"
                          />
                          {comment.userName}
                        </span>
                        <span className="text-[10px] text-[#978F66]">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-[#21120B] text-xs pl-6">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="mt-4 pt-3 border-t border-[#978F66]/30 flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tuliskan apresiasi atau pertanyaan..."
              className="flex-1 bg-[#21120B]/5 border border-[#978F66]/40 rounded-full px-3.5 py-2 text-xs text-[#21120B] placeholder-[#978F66] focus:outline-none focus:ring-1 focus:ring-[#622B14]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 rounded-full bg-[#622B14] text-[#E4D6A9] hover:bg-[#995F2F] disabled:opacity-50 disabled:hover:bg-[#622B14] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
