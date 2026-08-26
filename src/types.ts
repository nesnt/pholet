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
  isPrivate?: boolean;
  comments: Comment[];
  exif: EXIFInfo;
  tags: string[];
  category: 'Street' | 'Portrait' | 'Architecture' | 'Landscape' | 'Abstract' | 'Still Life';
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'tall';
  createdAt: string;
}

export type ViewMode = 'feed' | 'profile' | 'explore' | 'upload' | 'my-albums' | 'my-photos' | 'settings';
export type LayoutMode = 'masonry' | 'grid' | 'editorial';
export interface PhotoItem {
  id: string;
  title: string;
  category: 'athletic' | 'editorial' | 'analog' | 'street' | 'portrait' | 'architecture';
  categoryLabel: string;
  photographer: string;
  location: string;
  year: string;
  image: string;
  aspect: 'portrait' | 'landscape' | 'square';
  cameraModel: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  focalLength: string;
  filmStock?: string;
  description: string;
  likes: number;
  tags: string[];
  colorPalette: string[];
  featured?: boolean;
}

export interface PhotoStory {
  id: string;
  title: string;
  subtitle: string;
  volume: string;
  date: string;
  location: string;
  photographer: string;
  coverImage: string;
  images: string[];
  synopsis: string;
  discipline: string;
  readTime: string;
}

export interface PresetLUT {
  id: string;
  name: string;
  code: string;
  category: string;
  vibe: string;
  beforeImage: string;
  afterImage: string;
  highlights: string;
  shadows: string;
  grainLevel: string;
  description: string;
  price: string;
  downloads: number;
}

export interface StudioService {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  price: string;
  duration: string;
  turnaround: string;
  features: string[];
  badge?: string;
  image: string;
  popular?: boolean;
}

export interface ClubPass {
  id: string;
  name: string;
  tier: string;
  price: string;
  period: string;
  description: string;
  perks: string[];
  badge: string;
  highlighted?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  client: string;
  avatar: string;
  sessionType: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  locationPreference: string;
  filmAddon: boolean;
  droneAddon: boolean;
  rushDelivery: boolean;
  notes: string;
}

