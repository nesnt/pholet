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
import { motion, AnimatePresence } from 'motion/react';

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

  // Fetch Current User
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
            handle: '@' + data.user.email, // using email as handle for now
            avatar: data.user.avatar || '',
            bio: data.user.bio || '',
            location: data.user.location || '',
            website: '',
            filmGear: [],
            followersCount: 0,
            followingCount: 0,
            photosCount: 0,
            bannerUrl: '',
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
  
  // Modals
  const [activePhotoDetail, setActivePhotoDetail] = useState<Photo | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  // Loading Simulation
  useEffect(() => {
    setIsGridLoading(true);
    const timer = setTimeout(() => setIsGridLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedFilmStock, searchQuery, currentView]);

    // Ambil user yang sedang login & daftar foto dari PostgreSQL saat halaman dimuat
  useEffect(() => {
    async function loadData() {
      try {
        setIsGridLoading(true);
        
        // 1. Cek User Session
        const resMe = await fetch('/api/auth/me');
        if (!resMe.ok) {
          window.location.href = '/login';
          return;
        }

        // 2. Fetch Photos dari Database PostgreSQL
        const resPhotos = await fetch('/api/photos');
        if (resPhotos.ok) {
          const data = await resPhotos.json();
          // Format data foto dari API
          const formattedPhotos = data.photos.map((p: any) => ({
            id: p.id,
            title: p.title,
            caption: p.caption,
            url: p.url,
            isPrivate: p.isPrivate || false,
            likesCount: p.likesCount,
            category: p.category,
            aspectRatio: p.aspectRatio,
            createdAt: new Date(p.createdAt).toLocaleDateString('id-ID'),
            photographerId: p.user.id,
            photographer: {
              id: p.user.id,
              name: p.user.name,
              handle: `@${p.user.username || (p.user.email ? p.user.email.split('@')[0] : 'user')}`,
              avatar: p.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user.name || 'User')}&background=2C394B&color=fff&rounded=true`,
              bio: 'Pengguna Pholet',
              location: 'Indonesia',
              filmGear: [],
              followersCount: 0,
              followingCount: 0,
              photosCount: 1,
              bannerUrl: '',
            },
            exif: {
              camera: p.camera || '-',
              lens: p.lens || '-',
              filmStock: p.filmStock || '-',
              iso: p.iso || '-',
              aperture: p.aperture || '-',
              shutterSpeed: p.shutterSpeed || '-',
              focalLength: p.focalLength || '-',
              location: p.location || '-',
              dateTaken: new Date(p.createdAt).toLocaleDateString('id-ID'),
            },
            comments: p.comments || [],
            tags: p.tags || [],
          }));
          setPhotos(formattedPhotos);
        }
      } catch (err) {
        console.error("Load Dashboard Error:", err);
      } finally {
        setIsGridLoading(false);
      }
    }

    loadData();
  }, []);

  // Update fungsi handleLikeToggle untuk mengirim ke API PostgreSQL
  const handleLikeToggle = async (photoId: string) => {
    // Optimistic UI Update & API Call
    try {
      const res = await fetch(`/api/photos/${photoId}/like`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) =>
          prev.map((p) => {
            if (p.id === photoId) {
              return {
                ...p,
                isLiked: true,
                likesCount: data.likesCount !== undefined ? data.likesCount : p.likesCount + 1,
              };
            }
            return p;
          })
        );

        // Keep active detail photo state synced
        if (activePhotoDetail && activePhotoDetail.id === photoId) {
          setActivePhotoDetail((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              isLiked: true,
              likesCount: data.likesCount !== undefined ? data.likesCount : prev.likesCount + 1,
            };
          });
        }
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

    // Fungsi Logout Akun
  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun ini?")) {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        // Redirect ke halaman login setelah logout
        window.location.href = "/login";
      } catch (err) {
        console.error("Logout Error:", err);
      }
    }
  };

  // Filtered Photos List
  // Filtered Photos List
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // 1. Jika di tampilan Feed Utama, SEMBUNYIKAN semua foto privat!
      if (currentView === 'feed' && photo.isPrivate) {
        return false;
      }

      // 2. Filter Kategori
      if (selectedCategory !== 'Semua' && photo.category !== selectedCategory) {
        return false;
      }

      // 3. Filter Rol Film
      if (selectedFilmStock !== 'Semua Rol Film' && photo.exif.filmStock !== selectedFilmStock) {
        return false;
      }

      // 4. Filter Pencarian Search Query
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
  }, [photos, selectedCategory, selectedFilmStock, searchQuery, currentView]);

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

    // Trigger Toast AFTER state update, reading the computed value
    // Since state is asynchronous, we compute it locally above
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

  const handleUploadSuccess = (rawPhoto: any) => {
    const formattedPhoto: Photo = {
      id: rawPhoto.id,
      title: rawPhoto.title,
      caption: rawPhoto.caption,
      url: rawPhoto.url,
      isPrivate: rawPhoto.isPrivate || false,
      likesCount: rawPhoto.likesCount || 0,
      category: rawPhoto.category,
      aspectRatio: rawPhoto.aspectRatio,
      createdAt: new Date(rawPhoto.createdAt).toLocaleDateString('id-ID'),
      photographerId: rawPhoto.user.id,
      photographer: {
        id: rawPhoto.user.id,
        name: rawPhoto.user.name,
        handle: `@${rawPhoto.user.email ? rawPhoto.user.email.split('@')[0] : 'user'}`,
        avatar: rawPhoto.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawPhoto.user.name || 'User')}&background=2C394B&color=fff&rounded=true`,
        bio: 'Pengguna Pholet',
        location: 'Indonesia',
        filmGear: [],
        followersCount: 0,
        followingCount: 0,
        photosCount: 1,
        bannerUrl: '',
        isFollowing: false,
      },
      exif: {
        camera: rawPhoto.camera || '-',
        lens: rawPhoto.lens || '-',
        filmStock: rawPhoto.filmStock || '-',
        iso: rawPhoto.iso || '-',
        aperture: rawPhoto.aperture || '-',
        shutterSpeed: rawPhoto.shutterSpeed || '-',
        focalLength: rawPhoto.focalLength || '-',
        location: rawPhoto.location || '-',
        dateTaken: new Date(rawPhoto.createdAt).toLocaleDateString('id-ID'),
      },
      comments: rawPhoto.comments || [],
      tags: rawPhoto.tags || [],
      isLiked: false,
      isBookmarked: false,
    };

    setPhotos((prev) => [formattedPhoto, ...prev]);
    setCurrentView('feed');
    showToast('Karya foto berhasil diunggah!', 'success');
  };

  const handleEditSuccess = (updatedPhoto: Photo) => {
    // Update active photo detail
    if (activePhotoDetail?.id === updatedPhoto.id) {
      setActivePhotoDetail(updatedPhoto);
    }
    // Update photos list
    setPhotos((prev) => 
      prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p)
    );
  };

  const handleDeleteSuccess = (photoId: string) => {
    // Close modal
    setActivePhotoDetail(null);
    // Remove from state
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    showToast('Karya foto berhasil dihapus', 'success');
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

  // Currently viewed photographer object
  const activePhotographer =
    photographers.find((p) => p.id === selectedPhotographerId) || currentUser;

  if (!currentUser || !activePhotographer) {
    return (
      <div className="h-screen bg-[#082032] flex items-center justify-center text-white font-serif-display text-2xl">
        Memuat...
      </div>
    );
  }

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
        onLogout={handleLogout}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav currentView={currentView} onViewChange={handleViewChange} />

      {/* Main Body Layout with Hover-Expandable Desktop/Tablet Sidebar */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Sidebar for PC/Tablet (Thin by default, expands on hover) */}
        {currentView !== 'upload' && (
          <Sidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            userAvatar={currentUser.avatar}
            userName={currentUser.name}
          />
        )}

        {/* Scrollable Main Content Area */}
        <div className="flex-1 min-w-0 w-full overflow-y-auto flex flex-col">
          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-6 pb-24 md:pb-12">
        
        {/* Feed View */}
        {currentView === 'feed' && (
          <div className="space-y-6">
            
            {/* Hero Section Banner Notification */}
            <AnimatePresence>
            {showBanner && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="-mx-4 sm:-mx-8 lg:-mx-12 -mt-6 mb-6"
              >
                <div className="bg-[#FF4C29] text-white p-6 sm:p-8 sm:px-12 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button 
                  onClick={() => setShowBanner(false)}
                  className="absolute top-4 right-4 p-1 text-white/70 hover:text-white transition-colors"
                  aria-label="Tutup notifikasi"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-[10px] text-white font-mono tracking-widest uppercase font-semibold">
                    <Film className="w-3.5 h-3.5 text-white" />
                    <span>Komunitas Galeri Foto Analog & Film</span>
                  </div>
                  <h1 className="font-serif-display text-xl sm:text-2xl font-bold leading-tight pr-8">
                    "Pholet" — Mengabadikan Foto Yang Pernah Terlupakan
                  </h1>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                    Saling memamerkan karya foto analog, berbagi catatan rol film (Portra, Gold, Cinestill), spesifikasi EXIF kamera, dan apresiasi antar fotografer.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                  <button
                    onClick={() => setCurrentView('upload')}
                    className="px-5 py-2.5 bg-[#2C394B] text-white font-semibold text-xs rounded-full hover:bg-[#334756] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <span>Upload Foto</span>
                  </button>
                </div>
              </div>
              </motion.div>
            )}
            </AnimatePresence>

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
              isLoading={isGridLoading}
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
            isCurrentUser={activePhotographer.id === currentUser.id}
          />
        )}





        {/* Upload Page View */}
        {currentView === 'upload' && (
          <UploadPage
            onCancel={() => setCurrentView('feed')}
            onUploadSuccess={handleUploadSuccess}
            currentUser={currentUser}
          />
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
          <SettingsView 
            currentUser={currentUser} 
            onUpdateSuccess={(updatedUser) => {
              setCurrentUser((prev) => prev ? { ...prev, ...updatedUser } : prev);
              
              // Also update photographers array if the current user is in it
              setPhotographers((prev) => 
                prev.map((p) => p.id === currentUser.id ? { ...p, ...updatedUser } : p)
              );
            }} 
          />
        )}

          </main>

          {/* Footer inside scrollable area */}
          <footer className="bg-[#082032] text-white border-t border-[#334756]/30 py-8 px-4 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#334756] flex items-center justify-center border border-[#2C394B]">
                  <Camera className="w-4 h-4 text-[#FF4C29]" />
                </div>
                <div>
                  <span className="font-serif-display font-bold text-sm tracking-wider block">
                    PHOLET
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Platform Komunitas Foto Analog & Terlupakan
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-400">
                <button onClick={() => setCurrentView('feed')} className="hover:text-white">Galeri Feed</button>
                <span>•</span>
                <button onClick={() => handleSelectPhotographer('user-me')} className="hover:text-white">Portofolio Saya</button>
              </div>

              <p className="text-[10px] text-gray-400">
                © {new Date().getFullYear()} Pholet. Warm, Earthy & Artisanal Film Photography Gallery.
              </p>
            </div>
          </footer>
        </div>
      </div>

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
          onEditSuccess={handleEditSuccess}
          onDeleteSuccess={handleDeleteSuccess}
          showEditButton={currentView === 'profile' && activePhotoDetail.photographerId === currentUser.id}
        />
      )}

    </div>
  );
}

