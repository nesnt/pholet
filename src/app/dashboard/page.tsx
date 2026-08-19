/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Photo, Photographer, ViewMode } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { PhotoGrid } from '../../components/PhotoGrid';
import { PhotoCard } from '../../components/PhotoCard';
import { PhotoDetailModal } from '../../components/PhotoDetailModal';
import { ProfilePage } from '../../components/ProfilePage';
import { UploadPage } from '../../components/UploadPage';
import { DesignSpecView } from '../../components/DesignSpecView';
import { SettingsView } from '../../components/SettingsView';
import { BottomNav } from '../../components/BottomNav';
import { useToast } from '../../components/Toast';
import { Film, Camera, BookOpen, X, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isGridLoading, setIsGridLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<Photographer | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('feed');
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedFilmStock, setSelectedFilmStock] = useState<string>('Semua Rol Film');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch Current User Session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          const userObj: Photographer = {
            id: data.user.id,
            name: data.user.name,
            handle: '@' + (data.user.username || data.user.email || 'user'),
            avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            bio: data.user.bio || 'Halo, saya penggemar fotografi analog!',
            location: data.user.location || 'Indonesia',
            website: '',
            filmGear: ['Yashica Electro 35 GSN', 'Kodak Gold 200'],
            followersCount: 0,
            followingCount: 0,
            photosCount: 0,
            bannerUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200',
            isFollowing: false,
          };
          setCurrentUser(userObj);
          setSelectedPhotographerId(userObj.id);
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  // Fetch Photos from PostgreSQL API
  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (data.photos) {
        const mappedPhotos: Photo[] = data.photos.map((p: any) => ({
          id: p.id,
          title: p.title,
          url: p.url,
          caption: p.caption || '',
          photographerId: p.userId,
          photographer: {
            id: p.user.id,
            name: p.user.name,
            handle: '@' + (p.user.username || 'photographer'),
            avatar: p.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            bio: '',
            location: '',
            filmGear: [],
            followersCount: 0,
            followingCount: 0,
            photosCount: 0,
            bannerUrl: '',
          },
          likesCount: p.likesCount || 0,
          isLiked: false,
          isBookmarked: false,
          comments: (p.comments || []).map((c: any) => ({
            id: c.id,
            userId: c.userId,
            userName: c.user?.name || 'User',
            userAvatar: c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            text: c.text,
            createdAt: new Date(c.createdAt).toLocaleTimeString(),
          })),
          exif: {
            camera: p.camera || '-',
            lens: p.lens || '-',
            filmStock: p.filmStock || '-',
            iso: p.iso || '-',
            aperture: p.aperture || '-',
            shutterSpeed: p.shutterSpeed || '-',
            focalLength: '45mm',
            location: p.location || '-',
            dateTaken: new Date(p.createdAt).toLocaleDateString(),
          },
          tags: p.tags || [],
          category: p.category || 'Street',
          aspectRatio: p.aspectRatio || 'portrait',
          createdAt: new Date(p.createdAt).toLocaleDateString(),
        }));
        setPhotos(mappedPhotos);
      }
    } catch (err) {
      console.error("Fetch photos error:", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);
  
  // Modals
  const [activePhotoDetail, setActivePhotoDetail] = useState<Photo | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  // Loading Simulation
  useEffect(() => {
    setIsGridLoading(true);
    const timer = setTimeout(() => setIsGridLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedFilmStock, searchQuery, currentView]);

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
  const handleLikeToggle = async (photoId: string) => {
    // Optimistic UI (+1 like counter tanpa batas)
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          return {
            ...p,
            likesCount: p.likesCount + 1,
            isLiked: true,
          };
        }
        return p;
      })
    );

    if (activePhotoDetail && activePhotoDetail.id === photoId) {
      setActivePhotoDetail((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1, isLiked: true } : null));
    }

    // Call PostgreSQL API for infinite like
    try {
      await fetch(`/api/photos/${photoId}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleBookmarkToggle = (photoId: string) => {
    let isNowBookmarked = false;
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          isNowBookmarked = !p.isBookmarked;
          return { ...p, isBookmarked: isNowBookmarked };
        }
        return p;
      })
    );

    if (activePhotoDetail && activePhotoDetail.id === photoId) {
      setActivePhotoDetail((prev) => (prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null));
    }

    setTimeout(() => {
      showToast(isNowBookmarked ? 'Foto disimpan ke koleksi!' : 'Foto dihapus dari koleksi', 'info');
    }, 0);
  };

  const handleAddComment = (photoId: string, commentText: string) => {
    if (!currentUser) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
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
  };

  const handleUploadSuccess = (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    setCurrentView('feed');
    showToast('Karya foto berhasil diunggah ke PostgreSQL & public/uploads!', 'success');
    fetchPhotos(); // Refresh from DB
  };

  const handleSelectPhotographer = (photographerId: string) => {
    setSelectedPhotographerId(photographerId);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (view: ViewMode) => {
    if (view === 'profile' && currentUser) {
      setSelectedPhotographerId(currentUser.id);
    }
    setCurrentView(view);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (!currentUser) {
    return (
      <div className="h-screen bg-[#082032] text-white flex items-center justify-center">
        <p className="animate-pulse text-sm text-gray-400">Memuat data pengguna & database...</p>
      </div>
    );
  }

  const activePhotographer = currentUser;

  return (
    <div className="h-screen bg-[#082032] text-gray-100 font-sans film-grain flex flex-col selection:bg-[#334756]/30 selection:text-white overflow-hidden">
      
      {/* Top Header Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setCurrentView('upload')}
        userAvatar={currentUser.avatar}
        userName={currentUser.name}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav currentView={currentView} onViewChange={handleViewChange} />

      {/* Main Body Layout with Hover-Expandable Desktop/Tablet Sidebar */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Sidebar for PC/Tablet */}
        {currentView !== 'upload' && (
          <Sidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            userAvatar={currentUser.avatar}
            userName={currentUser.name}
          />
        )}

        {/* Dynamic Center Main Content Canvas Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-[#334756] scrollbar-track-transparent">
          
          {/* Main Feed View */}
          {currentView === 'feed' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              {/* Optional Welcome Banner */}
              {showBanner && (
                <div className="relative bg-gradient-to-r from-[#2C394B] to-[#334756] p-6 rounded-2xl border border-[#334756]/40 shadow-lg text-white overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <button 
                    onClick={() => setShowBanner(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-black/20"
                    title="Tutup banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="space-y-1.5 z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C29]/20 text-[#FF4C29] text-xs font-semibold">
                      <Film className="w-3.5 h-3.5" />
                      <span>Selamat Datang, {currentUser.name}!</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                      Ruang Pameran & Komunitas Rol Film Analog
                    </h2>
                    <p className="text-xs text-gray-300">
                      Seluruh foto yang diunggah akan disimpan di folder <code className="bg-[#082032] px-1.5 py-0.5 rounded text-[#FF4C29]">public/uploads</code> dan tercatat di database PostgreSQL lokal.
                    </p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('upload')}
                    className="z-10 shrink-0 px-5 py-2.5 bg-[#FF4C29] hover:bg-[#ff3b14] text-white text-xs font-semibold rounded-full shadow-md transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload Karya Baru</span>
                  </button>
                </div>
              )}

              {/* Photo Masonry Grid Section */}
              {photos.length === 0 ? (
                <div className="text-center py-16 bg-[#2C394B]/20 border border-[#334756]/40 rounded-2xl">
                  <Camera className="w-12 h-12 text-[#FF4C29] mx-auto mb-3 opacity-60" />
                  <h3 className="text-lg font-bold text-white">Belum Ada Foto di Database PostgreSQL</h3>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Jadilah yang pertama mengunggah foto karya analogmu!</p>
                  <button
                    onClick={() => setCurrentView('upload')}
                    className="px-5 py-2.5 bg-[#FF4C29] hover:bg-[#ff3b14] text-white text-xs font-semibold rounded-full shadow-md transition-all"
                  >
                    Unggah Foto Pertamamu
                  </button>
                </div>
              ) : (
                <PhotoGrid
                  photos={filteredPhotos}
                  isLoading={isGridLoading}
                  onLikeToggle={handleLikeToggle}
                  onBookmarkToggle={handleBookmarkToggle}
                  onClickPhoto={(photo) => setActivePhotoDetail(photo)}
                  onClickPhotographer={handleSelectPhotographer}
                />
              )}
            </div>
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <ProfilePage
              photographer={activePhotographer}
              userPhotos={photos.filter((p) => p.photographerId === activePhotographer.id)}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onClickPhoto={(photo) => setActivePhotoDetail(photo)}
              onToggleFollow={handleToggleFollowPhotographer}
              isCurrentUser={true}
            />
          )}

          {/* Upload View */}
          {currentView === 'upload' && (
            <UploadPage
              onCancel={() => setCurrentView('feed')}
              onUploadSuccess={handleUploadSuccess}
              currentUser={currentUser}
            />
          )}

          {/* Design Specs View */}
          {currentView === 'my-albums' && <DesignSpecView />}

          {/* Settings View */}
          {currentView === 'settings' && <SettingsView />}

        </main>
      </div>

      {/* Photo Detail Modal Popup */}
      {activePhotoDetail && (
        <PhotoDetailModal
          photo={activePhotoDetail}
          onClose={() => setActivePhotoDetail(null)}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
          onAddComment={handleAddComment}
          onClickPhotographer={handleSelectPhotographer}
        />
      )}

    </div>
  );
}
