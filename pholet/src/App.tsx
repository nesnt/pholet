/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Photo, Photographer, ViewMode } from './types';
import { INITIAL_PHOTOS, MOCK_PHOTOGRAPHERS, CURRENT_USER } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PhotoGrid } from './components/PhotoGrid';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { ProfilePage } from './components/ProfilePage';
import { UploadPage } from './components/UploadPage';
import { DesignSpecView } from './components/DesignSpecView';
import { Film, Camera, Sparkles, BookOpen, Compass, Heart, ArrowRight } from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [photographers, setPhotographers] = useState<Photographer[]>(MOCK_PHOTOGRAPHERS);
  const [currentView, setCurrentView] = useState<ViewMode>('feed');
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('user-me');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedFilmStock, setSelectedFilmStock] = useState<string>('Semua Rol Film');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [activePhotoDetail, setActivePhotoDetail] = useState<Photo | null>(null);

  // Filtered Photos List
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Category match
      if (selectedCategory !== 'Semua' && photo.category !== selectedCategory) {
        return false;
      }
      // Film stock match
      if (selectedFilmStock !== 'Semua Rol Film' && photo.exif.filmStock !== selectedFilmStock) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = photo.title.toLowerCase().includes(query);
        const matchesCaption = photo.caption.toLowerCase().includes(query);
        const matchesPhotographer = photo.photographer.name.toLowerCase().includes(query);
        const matchesCamera = photo.exif.camera.toLowerCase().includes(query);
        const matchesFilm = photo.exif.filmStock.toLowerCase().includes(query);
        const matchesLocation = photo.exif.location.toLowerCase().includes(query);
        const matchesTag = photo.tags.some(t => t.toLowerCase().includes(query));

        return (
          matchesTitle ||
          matchesCaption ||
          matchesPhotographer ||
          matchesCamera ||
          matchesFilm ||
          matchesLocation ||
          matchesTag
        );
      }
      return true;
    });
  }, [photos, selectedCategory, selectedFilmStock, searchQuery]);

  // Actions
  const handleLikeToggle = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    // Keep active detail photo state synced
    if (activePhotoDetail && activePhotoDetail.id === photoId) {
      setActivePhotoDetail((prev) => {
        if (!prev) return null;
        const nextLiked = !prev.isLiked;
        return {
          ...prev,
          isLiked: nextLiked,
          likesCount: nextLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
        };
      });
    }
  };

  const handleBookmarkToggle = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );

    if (activePhotoDetail && activePhotoDetail.id === photoId) {
      setActivePhotoDetail((prev) => (prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null));
    }
  };

  const handleAddComment = (photoId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      userAvatar: CURRENT_USER.avatar,
      text: commentText,
      createdAt: 'Baru saja',
    };

    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          return {
            ...p,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );

    if (activePhotoDetail && activePhotoDetail.id === photoId) {
      setActivePhotoDetail((prev) =>
        prev ? { ...prev, comments: [newComment, ...prev.comments] } : null
      );
    }
  };

  const handleToggleFollowPhotographer = (photographerId: string) => {
    setPhotographers((prev) =>
      prev.map((p) => {
        if (p.id === photographerId) {
          const nextFollowing = !p.isFollowing;
          return {
            ...p,
            isFollowing: nextFollowing,
            followersCount: nextFollowing ? p.followersCount + 1 : Math.max(0, p.followersCount - 1),
          };
        }
        return p;
      })
    );

    // Sync in photos array
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo.photographer.id === photographerId) {
          const nextFollowing = !photo.photographer.isFollowing;
          return {
            ...photo,
            photographer: {
              ...photo.photographer,
              isFollowing: nextFollowing,
              followersCount: nextFollowing
                ? photo.photographer.followersCount + 1
                : Math.max(0, photo.photographer.followersCount - 1),
            },
          };
        }
        return photo;
      })
    );
  };

  const handleUploadSuccess = (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    setCurrentView('feed');
  };

  const handleSelectPhotographer = (photographerId: string) => {
    setSelectedPhotographerId(photographerId);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Currently viewed photographer object
  const activePhotographer =
    photographers.find((p) => p.id === selectedPhotographerId) || CURRENT_USER;

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#21120B] font-sans film-grain flex flex-col selection:bg-[#995F2F]/30 selection:text-[#622B14] overflow-x-hidden">
      
      {/* Top Header Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setCurrentView('upload')}
        userAvatar={CURRENT_USER.avatar}
        userName={CURRENT_USER.name}
      />

      {/* Main Body Layout with Hover-Expandable Desktop/Tablet Sidebar */}
      <div className="flex flex-1 w-full">
        {/* Left Sidebar for PC/Tablet (Thin by default, expands on hover) */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          userAvatar={CURRENT_USER.avatar}
          userName={CURRENT_USER.name}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        
        {/* Feed View */}
        {currentView === 'feed' && (
          <div className="space-y-6">
            
            {/* Hero Section Banner */}
            <div className="bg-[#622B14] text-[#E4D6A9] rounded-2xl p-6 sm:p-8 border border-[#995F2F]/40 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-[10px] text-[#E4D6A9] font-mono tracking-widest uppercase font-semibold">
                  <Film className="w-3.5 h-3.5" />
                  <span>Komunitas Galeri Foto Analog & Film</span>
                </div>
                <h1 className="font-serif-display text-2xl sm:text-3xl font-bold leading-tight">
                  "Pholet" — Mengabadikan Foto Yang Pernah Terlupakan
                </h1>
                <p className="text-xs sm:text-sm text-[#E4D6A9]/90 leading-relaxed font-sans">
                  Saling memamerkan karya foto analog, berbagi catatan rol film (Portra, Gold, Cinestill), spesifikasi EXIF kamera, dan apresiasi antar fotografer.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setCurrentView('upload')}
                  className="px-5 py-2.5 bg-[#E4D6A9] text-[#622B14] font-semibold text-xs rounded-full hover:bg-[#f3e8c9] transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Foto</span>
                </button>

                <button
                  onClick={() => setCurrentView('design-spec')}
                  className="px-4 py-2.5 bg-[#995F2F]/40 border border-[#E4D6A9]/30 text-[#E4D6A9] font-medium text-xs rounded-full hover:bg-[#995F2F] transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lihat Panduan UI/UX</span>
                </button>
              </div>
            </div>

            {/* Masonry Photo Grid */}
            <PhotoGrid
              photos={filteredPhotos}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              selectedFilmStock={selectedFilmStock}
              onFilmStockSelect={setSelectedFilmStock}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onClickPhoto={(photo) => setActivePhotoDetail(photo)}
              onClickPhotographer={handleSelectPhotographer}
            />

          </div>
        )}

        {/* Profile View */}
        {currentView === 'profile' && (
          <ProfilePage
            photographer={activePhotographer}
            photos={photos}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onClickPhoto={(photo) => setActivePhotoDetail(photo)}
            onClickPhotographer={handleSelectPhotographer}
            onToggleFollow={handleToggleFollowPhotographer}
            isCurrentUser={activePhotographer.id === CURRENT_USER.id}
          />
        )}

        {/* UI/UX Design System Specification View */}
        {currentView === 'design-spec' && (
          <DesignSpecView />
        )}

        {/* Upload Page View */}
        {currentView === 'upload' && (
          <UploadPage
            onCancel={() => setCurrentView('feed')}
            onUploadSuccess={handleUploadSuccess}
            currentUser={CURRENT_USER}
          />
        )}

      </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#622B14] text-[#E4D6A9] border-t border-[#995F2F]/30 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#995F2F] flex items-center justify-center border border-[#E4D6A9]">
              <Camera className="w-4 h-4 text-[#E4D6A9]" />
            </div>
            <div>
              <span className="font-serif-display font-bold text-sm tracking-wider block">
                PHOLET
              </span>
              <span className="text-[10px] text-[#978F66]">
                Platform Komunitas Foto Analog & Terlupakan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#978F66]">
            <button onClick={() => setCurrentView('feed')} className="hover:text-[#E4D6A9]">Galeri Feed</button>
            <span>•</span>
            <button onClick={() => handleSelectPhotographer('user-me')} className="hover:text-[#E4D6A9]">Portofolio Saya</button>
            <span>•</span>
            <button onClick={() => setCurrentView('design-spec')} className="hover:text-[#E4D6A9]">Desain & Spec UI/UX</button>
          </div>

          <p className="text-[10px] text-[#978F66]">
            © {new Date().getFullYear()} Pholet. Warm, Earthy & Artisanal Film Photography Gallery.
          </p>
        </div>
      </footer>

      {/* Photo Detail Modal */}
      {activePhotoDetail && (
        <PhotoDetailModal
          photo={activePhotoDetail}
          onClose={() => setActivePhotoDetail(null)}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
          onAddComment={handleAddComment}
          onToggleFollowPhotographer={handleToggleFollowPhotographer}
          onSelectPhotographer={handleSelectPhotographer}
        />
      )}

    </div>
  );
}
