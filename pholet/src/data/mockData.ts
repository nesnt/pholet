import { Photo, Photographer } from '../types';

export const CURRENT_USER: Photographer = {
  id: 'user-me',
  name: 'Baskara Putra',
  handle: '@baskara.film',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  bio: 'Pengagum rol film 35mm & pencari cahaya senja di sudut kota. Selalu membawa Yashica Electro 35.',
  location: 'Yogyakarta, Indonesia',
  website: 'https://baskara-analog.id',
  filmGear: ['Yashica Electro 35 GSN', 'Kodak Gold 200', 'Olympus Mju II', 'Cinestill 800T'],
  followersCount: 1420,
  followingCount: 380,
  photosCount: 28,
  bannerUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200',
  isFollowing: false,
};

export const MOCK_PHOTOGRAPHERS: Photographer[] = [
  CURRENT_USER,
  {
    id: 'photographer-1',
    name: 'Rian Nusantara',
    handle: '@rian.film',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Pencatat kenangan jalanan & arsitektur tua dengan Leica M6 & Kodak Portra 400.',
    location: 'Bandung, Indonesia',
    website: 'https://rian-nusantara.com',
    filmGear: ['Leica M6', 'Summicron 35mm f/2', 'Kodak Portra 400', 'Kodak Tri-X 400'],
    followersCount: 3850,
    followingCount: 420,
    photosCount: 64,
    bannerUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    isFollowing: true,
  },
  {
    id: 'photographer-2',
    name: 'Maya Dewanti',
    handle: '@mayadewanti',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    bio: 'Eksplorasi warna pastel & human interest melalui kamera medium format 6x6.',
    location: 'Ubud, Bali',
    website: 'https://mayadewanti.photography',
    filmGear: ['Hasselblad 500C/M', 'Carl Zeiss Planar 80mm f/2.8', 'Fuji Pro 400H'],
    followersCount: 5210,
    followingCount: 290,
    photosCount: 92,
    bannerUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200',
    isFollowing: false,
  },
  {
    id: 'photographer-3',
    name: 'Sena Pradipta',
    handle: '@senanostalgia',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Menangkap pendar lampu neon malam hari dengan Cinestill 800T & Canon AE-1.',
    location: 'Jakarta, Indonesia',
    filmGear: ['Canon AE-1 Program', 'Canon FD 50mm f/1.4', 'Cinestill 800T', 'Kodak Ultramax 400'],
    followersCount: 2190,
    followingCount: 510,
    photosCount: 41,
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
    isFollowing: true,
  },
  {
    id: 'photographer-4',
    name: 'Niko Alamsyah',
    handle: '@niko.analog',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    bio: 'Fokus pada monokrom kontras tinggi & tekstur biji film (film grain) klasik.',
    location: 'Semarang, Indonesia',
    filmGear: ['Olympus OM-1', 'Zuiko 50mm f/1.8', 'Ilford HP5 Plus', 'Kodak T-Max 100'],
    followersCount: 1840,
    followingCount: 195,
    photosCount: 38,
    bannerUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=1200',
    isFollowing: false,
  }
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'photo-1',
    title: 'Bayangan Garis Trem Sore Hari',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1000',
    caption: 'Diambil saat perjalanan pulang menembus sore yang hangat di kawasan heritage. Warna pastel khas Portra 400 memperlembut sudut-sudut arsitektur bata tua.',
    photographerId: 'photographer-1',
    photographer: MOCK_PHOTOGRAPHERS[1],
    likesCount: 148,
    isLiked: true,
    isBookmarked: false,
    aspectRatio: 'portrait',
    category: 'Street',
    tags: ['Portra400', '35mm', 'StreetPhotography', 'VintageArchitecture', 'WarmTone'],
    createdAt: '2 jam yang lalu',
    exif: {
      camera: 'Leica M6',
      lens: 'Summicron 35mm f/2 ASPH',
      filmStock: 'Kodak Portra 400',
      iso: '400',
      aperture: 'f/4.0',
      shutterSpeed: '1/250s',
      focalLength: '35mm',
      location: 'Jl. Braga, Bandung',
      dateTaken: '14 Oktober 2025'
    },
    comments: [
      {
        id: 'c1',
        userId: 'u1',
        userName: 'Maya Dewanti',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
        text: 'Warna hangat tanahnya pas sekali dengan feel Portra! Komposisi garisnya luar biasa mas.',
        createdAt: '1 jam yang lalu'
      },
      {
        id: 'c2',
        userId: 'u2',
        userName: 'Niko Alamsyah',
        userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
        text: 'Tekstur grain di area shadow terasa sangat organik. Foto yang menenangkan.',
        createdAt: '30 menit yang lalu'
      }
    ]
  },
  {
    id: 'photo-2',
    title: 'Cahaya Emas di Sudut Kedai Kopi Tua',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000',
    caption: 'Interaksi sederhana antara aroma biji kopi arabika, uap panas cangkir tanah liat, dan pendar mentari pukul lima sore.',
    photographerId: 'user-me',
    photographer: CURRENT_USER,
    likesCount: 215,
    isLiked: false,
    isBookmarked: true,
    aspectRatio: 'landscape',
    category: 'Still Life',
    tags: ['Yashica', 'KodakGold200', 'CoffeeMoment', 'StillLife', 'FilmIsNotDead'],
    createdAt: '5 jam yang lalu',
    exif: {
      camera: 'Yashica Electro 35 GSN',
      lens: 'Yashinon 45mm f/1.7',
      filmStock: 'Kodak Gold 200',
      iso: '200',
      aperture: 'f/2.8',
      shutterSpeed: '1/125s',
      focalLength: '45mm',
      location: 'Kedai Kopi Melati, Kotagede',
      dateTaken: '20 November 2025'
    },
    comments: [
      {
        id: 'c3',
        userId: 'u3',
        userName: 'Sena Pradipta',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        text: 'Kodak Gold 200 memang tidak pernah gagal kalau berhadapan dengan golden hour!',
        createdAt: '3 jam yang lalu'
      }
    ]
  },
  {
    id: 'photo-3',
    title: 'Tetesan Hujan di Kaca Kedai Malam Hari',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1000',
    caption: 'Bokey pendar neon merah & kuning bercampur titik embun hujan. Efek halation khas Cinestill 800T memberikan atmosfer sinematik seperti potongan film era 90-an.',
    photographerId: 'photographer-3',
    photographer: MOCK_PHOTOGRAPHERS[3],
    likesCount: 312,
    isLiked: true,
    isBookmarked: false,
    aspectRatio: 'tall',
    category: 'Street',
    tags: ['Cinestill800T', 'NightStreet', 'RainyVibes', 'Halation', 'CinematicFilm'],
    createdAt: '1 hari yang lalu',
    exif: {
      camera: 'Canon AE-1 Program',
      lens: 'Canon FD 50mm f/1.4 SSC',
      filmStock: 'Cinestill 800T',
      iso: '800',
      aperture: 'f/1.8',
      shutterSpeed: '1/60s',
      focalLength: '50mm',
      location: 'Kawasan Blok M, Jakarta',
      dateTaken: '05 Desember 2025'
    },
    comments: []
  },
  {
    id: 'photo-4',
    title: 'Potret Tatapan dalam Medium Format',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
    caption: 'Format square 6x6 membawa keintiman tersendiri. Transisi fokus dari Zeiss Planar 80mm terasa lembut dan membius.',
    photographerId: 'photographer-2',
    photographer: MOCK_PHOTOGRAPHERS[2],
    likesCount: 420,
    isLiked: false,
    isBookmarked: false,
    aspectRatio: 'square',
    category: 'Portrait',
    tags: ['Hasselblad500CM', 'MediumFormat', '6x6Film', 'FujiPro400H', 'NaturalLightPortrait'],
    createdAt: '2 hari yang lalu',
    exif: {
      camera: 'Hasselblad 500C/M',
      lens: 'Carl Zeiss Planar 80mm f/2.8 T*',
      filmStock: 'Fuji Pro 400H (Expired)',
      iso: '320',
      aperture: 'f/2.8',
      shutterSpeed: '1/125s',
      focalLength: '80mm',
      location: 'Studio Alami, Ubud',
      dateTaken: '18 Januari 2026'
    },
    comments: [
      {
        id: 'c4',
        userId: 'u4',
        userName: 'Rian Nusantara',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        text: 'Depth of field dari 6x6 medium format memang juara. Tone kulitnya alami banget mba Maya.',
        createdAt: '1 hari yang lalu'
      }
    ]
  },
  {
    id: 'photo-5',
    title: 'Monokrom & Siluet Deretan Pohon Tua',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1000',
    caption: 'Tanpa riak warna, Ilford HP5 Plus menelanjangi kontras dan bentuk. Batang kayu lapuk dan kabut tipis di Lereng Merapi.',
    photographerId: 'photographer-4',
    photographer: MOCK_PHOTOGRAPHERS[4],
    likesCount: 189,
    isLiked: false,
    isBookmarked: false,
    aspectRatio: 'landscape',
    category: 'Landscape',
    tags: ['BlackAndWhite', 'IlfordHP5', 'AnalogMonochrome', 'NatureFilm', 'OlympusOM1'],
    createdAt: '3 hari yang lalu',
    exif: {
      camera: 'Olympus OM-1',
      lens: 'Zuiko 50mm f/1.8',
      filmStock: 'Ilford HP5 Plus 400',
      iso: '400',
      aperture: 'f/8.0',
      shutterSpeed: '1/500s',
      focalLength: '50mm',
      location: 'Kaliurang, Yogyakarta',
      dateTaken: '02 Februari 2026'
    },
    comments: []
  },
  {
    id: 'photo-6',
    title: 'Bangunan Antik & Mobil Tua 1970-an',
    url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=1000',
    caption: 'Menemukan mobil klasik ini terparkir anggun di depan fasad arsitektur art deco. Rol film Kodak Ultramax memberikan kejenuhan warna biru & kuning yang vibrant.',
    photographerId: 'photographer-1',
    photographer: MOCK_PHOTOGRAPHERS[1],
    likesCount: 276,
    isLiked: true,
    isBookmarked: true,
    aspectRatio: 'portrait',
    category: 'Architecture',
    tags: ['VintageCar', 'ArtDeco', 'KodakUltramax400', 'StreetClassics', 'AnalogVibes'],
    createdAt: '4 hari yang lalu',
    exif: {
      camera: 'Leica M6',
      lens: 'Summicron 35mm f/2 ASPH',
      filmStock: 'Kodak Ultramax 400',
      iso: '400',
      aperture: 'f/5.6',
      shutterSpeed: '1/250s',
      focalLength: '35mm',
      location: 'Jl. Asia Afrika, Bandung',
      dateTaken: '22 Januari 2026'
    },
    comments: []
  },
  {
    id: 'photo-7',
    title: 'Jejak Kebersamaan Musim Kemarau',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000',
    caption: 'Lansekap bukit rumput menguning di bawah langit hangat. Sebuah pengingat betapa berharganya momen murni tanpa gangguan gawai.',
    photographerId: 'user-me',
    photographer: CURRENT_USER,
    likesCount: 198,
    isLiked: true,
    isBookmarked: false,
    aspectRatio: 'landscape',
    category: 'Landscape',
    tags: ['LandscapeFilm', 'KodakGold200', 'AnalogLandscape', 'GoldenHour', 'IndonesiaVisuals'],
    createdAt: '5 hari yang lalu',
    exif: {
      camera: 'Yashica Electro 35 GSN',
      lens: 'Yashinon 45mm f/1.7',
      filmStock: 'Kodak Gold 200',
      iso: '200',
      aperture: 'f/5.6',
      shutterSpeed: '1/500s',
      focalLength: '45mm',
      location: 'Sumba, Nusa Tenggara Timur',
      dateTaken: '12 Agustus 2025'
    },
    comments: []
  },
  {
    id: 'photo-8',
    title: 'Lampu Gantung & Bayangan Kayu',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1000',
    caption: 'Detail interior rumah kayu peninggalan era kolonial. Karakter grain hangat memberikan kedalaman pada setiap lekukan kayu tua.',
    photographerId: 'photographer-2',
    photographer: MOCK_PHOTOGRAPHERS[2],
    likesCount: 164,
    isLiked: false,
    isBookmarked: false,
    aspectRatio: 'square',
    category: 'Still Life',
    tags: ['InteriorDetails', 'VintageHome', 'WarmLighting', 'Hasselblad', 'Portra160'],
    createdAt: '1 minggu yang lalu',
    exif: {
      camera: 'Hasselblad 500C/M',
      lens: 'Carl Zeiss Planar 80mm f/2.8',
      filmStock: 'Kodak Portra 160',
      iso: '160',
      aperture: 'f/4.0',
      shutterSpeed: '1/60s',
      focalLength: '80mm',
      location: 'Solo, Jawa Tengah',
      dateTaken: '01 Februari 2026'
    },
    comments: []
  }
];

export const CATEGORIES = [
  'Semua',
  'Street',
  'Portrait',
  'Architecture',
  'Landscape',
  'Still Life'
] as const;

export const POPULAR_FILM_STOCKS = [
  'Semua Rol Film',
  'Kodak Portra 400',
  'Kodak Gold 200',
  'Cinestill 800T',
  'Fuji Pro 400H',
  'Ilford HP5 Plus',
  'Kodak Ultramax 400'
];
