import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  Camera, 
  Film, 
  MapPin, 
  Calendar, 
  Share2, 
  Maximize2, 
  Aperture, 
  Info,
  Check,
  Edit3,
  Trash2
} from 'lucide-react';
import { Photo, Photographer } from '../types';
import { EditPhotoModal } from './EditPhotoModal';

interface PhotoDetailModalProps {
  photo: Photo | null;
  onClose: () => void;
  onLikeToggle: (photoId: string) => void;
  onBookmarkToggle?: (photoId: string) => void;
  onAddComment?: (photoId: string, commentText: string) => void;
  onToggleFollowPhotographer?: (photographerId: string) => void;
  onSelectPhotographer: (photographerId: string) => void;
  onEditSuccess?: (updatedPhoto: Photo) => void;
  onDeleteSuccess?: (photoId: string) => void;
  showEditButton?: boolean;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  onClose,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onToggleFollowPhotographer,
  onSelectPhotographer,
  onEditSuccess,
  onDeleteSuccess,
  showEditButton = false,
}) => {
  const [isLikingAnimation, setIsLikingAnimation] = useState(false);
  const [isLightbox, setIsLightbox] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!photo) return null;

  const handleLikeClick = () => {
    setIsLikingAnimation(true);
    onLikeToggle(photo.id);
    setTimeout(() => {
      setIsLikingAnimation(false);
    }, 450);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDeleteClick = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karya foto ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal menghapus foto');
      }
      
      alert('Foto berhasil dihapus!');
      if (onDeleteSuccess) {
        onDeleteSuccess(photo.id);
      }
      onClose();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menghapus foto');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#082032]/85 backdrop-blur-md overflow-y-auto">
      
      {/* Lightbox Mode Overlay if Toggled */}
      <AnimatePresence>
      {isLightbox && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsLightbox(false)}
          className="fixed inset-0 z-50 bg-[#082032] flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-[92vh] object-contain rounded-sm shadow-2xl"
          />
          <p className="text-white text-xs font-serif-display mt-2">
            {photo.title} — {photo.photographer.name} ({photo.exif.camera}) • Klik di mana saja untuk kembali
          </p>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Main Modal Wrapper */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl"
      >
        
        {/* Close Button Outside Modal */}
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 md:-right-14 md:top-0 z-50 p-2.5 rounded-full bg-[#2C394B]/90 text-white hover:bg-[#FF4C29] transition-all shadow-xl backdrop-blur-md border border-[#334756] hover:scale-110"
          title="Tutup Modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Modal Card Content */}
        <div className="w-full bg-[#082032] rounded-2xl border border-[#334756]/40 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

        {/* Left Column: Photo Presentation Area */}
        <div className="md:w-3/5 bg-[#082032] flex flex-col items-center justify-center relative p-2 min-h-[300px] md:min-h-[500px]">
          
          <img
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-[70vh] md:max-h-[82vh] object-contain rounded-md shadow-lg"
          />

          {/* Lightbox Toggle Button */}
          <button
            onClick={() => setIsLightbox(true)}
            className="absolute bottom-4 right-4 bg-[#FF4C29]/80 hover:bg-[#FF4C29] text-white p-2 rounded-full border border-[#334756]/40 transition-colors shadow-md"
            title="Tampilkan Layar Penuh"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>

          {/* Film Stock Tag Badge */}
          <div className="absolute top-4 left-4 bg-[#FF4C29]/90 text-white text-xs px-3 py-1 rounded-full font-mono flex items-center gap-1.5 border border-[#334756]/40 shadow-md">
            <Film className="w-3.5 h-3.5 text-white" />
            <span>{photo.exif.filmStock}</span>
          </div>
        </div>

        {/* Right Column: Photo Details, EXIF & Comments */}
        <div className="md:w-2/5 flex flex-col p-5 overflow-y-auto bg-[#082032] border-l border-[#334756]/30 relative">
          
          <div className="space-y-4 flex-1">
            
            {/* Photographer Profile Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#334756]/20">
              <button
                onClick={() => {
                  onSelectPhotographer(photo.photographer.id);
                  onClose();
                }}
                className="flex items-center gap-3 text-left group"
              >
                <img
                  src={photo.photographer.avatar || undefined}
                  alt={photo.photographer.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#FF4C29] group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="font-serif-display font-semibold text-sm text-white group-hover:underline">
                    {photo.photographer.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {photo.photographer.handle}
                  </p>
                </div>
              </button>
            </div>

            {/* Photo Title & Caption */}
            <div>
              <h2 className="font-serif-display text-xl font-bold text-white leading-tight mb-2">
                {photo.title}
              </h2>
              <p className="text-xs text-gray-100/90 leading-relaxed font-sans">
                {photo.caption}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-white bg-[#2C394B]/60 border border-[#334756]/30 px-2 py-0.5 rounded-full font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed EXIF Info Section */}
            <div className="bg-[#2C394B]/40 border border-[#334756]/30 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-[#334756]/20 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Aperture className="w-4 h-4 text-[#FF4C29]" />
                  <span>Spesifikasi Foto & EXIF</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {photo.exif.dateTaken}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-100">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#FF4C29] shrink-0" />
                  <span className="font-medium text-[11px] truncate">{photo.exif.camera}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#FF4C29] shrink-0" />
                  <span className="font-medium text-[11px] truncate">{photo.exif.filmStock}</span>
                </div>
                <div className="text-[11px] text-white">
                  <span className="text-gray-400">Lensa: </span>{photo.exif.lens}
                </div>
                <div className="text-[11px] text-white">
                  <span className="text-gray-400">Aperture: </span>{photo.exif.aperture}
                </div>
                <div className="text-[11px] text-white">
                  <span className="text-gray-400">Shutter: </span>{photo.exif.shutterSpeed}
                </div>
                <div className="text-[11px] text-white">
                  <span className="text-gray-400">ISO: </span>{photo.exif.iso}
                </div>
              </div>

              {photo.exif.location && (
                <div className="pt-1 flex items-center gap-1 text-[11px] text-white">
                  <MapPin className="w-3 h-3 text-[#FF4C29]" />
                  <span>{photo.exif.location}</span>
                </div>
              )}
            </div>

            {/* Like & Action Bar */}
            <div className="flex items-center justify-between py-2 border-y border-[#334756]/20">
              <div className="flex items-center gap-3">
                {/* Heart Button */}
                <button
                  onClick={handleLikeClick}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                    photo.isLiked
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-[#2C394B]/60 text-white hover:bg-[#334756] hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      photo.isLiked ? 'fill-rose-600 text-[#FF4C29]' : ''
                    } ${isLikingAnimation ? 'animate-heart-burst' : ''}`}
                  />
                  <span>{photo.likesCount} Suka</span>
                </button>
              </div>

              {/* Actions & Share */}
              <div className="flex items-center gap-2">
                {showEditButton && (
                  <>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-3 py-1.5 text-xs bg-[#FF4C29]/20 hover:bg-[#FF4C29]/40 text-[#FF4C29] border border-[#FF4C29]/40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/30 text-red-500 border border-red-500/30 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isDeleting ? '...' : 'Hapus'}</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-full text-xs text-white bg-[#2C394B]/60 border border-[#334756]/30 hover:bg-[#2C394B] flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold hidden sm:inline">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-gray-300" />
                      <span className="hidden sm:inline">Bagikan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
        </div>

      </motion.div>

      {/* Render Edit Photo Modal */}
      <EditPhotoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        photo={photo}
        onEditSuccess={(updatedPhoto) => {
          setIsEditModalOpen(false);
          if (onEditSuccess) onEditSuccess(updatedPhoto);
        }}
      />
    </div>
  );
};
