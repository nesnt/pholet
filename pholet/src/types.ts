export interface Photographer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  website?: string;
  filmGear: string[];
  followersCount: number;
  followingCount: number;
  photosCount: number;
  bannerUrl: string;
  isFollowing?: boolean;
}

export interface EXIFInfo {
  camera: string;
  lens: string;
  filmStock: string;
  iso: string;
  aperture: string;
  shutterSpeed: string;
  focalLength: string;
  location: string;
  dateTaken: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  title: string;
  url: string;
  caption: string;
  photographerId: string;
  photographer: Photographer;
  likesCount: number;
  isLiked: boolean;
  isBookmarked?: boolean;
  comments: Comment[];
  exif: EXIFInfo;
  tags: string[];
  category: 'Street' | 'Portrait' | 'Architecture' | 'Landscape' | 'Abstract' | 'Still Life';
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'tall';
  createdAt: string;
}

export type ViewMode = 'feed' | 'profile' | 'design-spec' | 'explore' | 'upload';
export type LayoutMode = 'masonry' | 'grid' | 'editorial';
