import React, { useState } from 'react';
import { X, Heart, Camera, Sliders, Share2, Download, Check, Sparkles, MapPin, Calendar, Film, Layers } from 'lucide-react';
import { PhotoItem } from '../../types';
import { playDialTick, playShutterSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface PhotoLightboxProps {
  photo: PhotoItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBookStyle: (photo: PhotoItem) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  onClose,
  isFavorite,
  onToggleFavorite,
  onBookStyle,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'tones' | 'story'>('specs');

  if (!photo) return null;

  const handleShare = () => {
    playDialTick();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    playDialTick();
    onToggleFavorite(photo.id);
    if (!isFavorite) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF4C29', '#E4D6A9', '#978F66'],
      });
    }
  };

  return (
    <div
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#082032]/95 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#2C394B] border-2 border-[#334756] rounded-2xl overflow-hidden pholet-shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#082032] border-b border-[#334756]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#FF4C29] text-white text-xs font-mono-camera font-bold uppercase">
              {photo.categoryLabel}
            </span>
            <span className="font-mono-camera text-xs text-[#E4D6A9] hidden sm:inline">
              ARCHIVE REF: #{photo.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#E4D6A9] text-gray-300 hover:text-white transition-all focus-pholet text-xs flex items-center gap-1.5"
              title="Share Frame"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'COPIED' : 'SHARE'}</span>
            </button>

            <button
              onClick={() => {
                playDialTick();
                onClose();
              }}
              className="p-2 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-gray-300 hover:text-white transition-all focus-pholet"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Grid: Large Visual Left, Metadata Specs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Image Canvas with Viewfinder Accents */}
          <div className="lg:col-span-7 bg-black flex items-center justify-center relative p-4 group">
            <div className="relative max-h-[60vh] sm:max-h-[70vh] overflow-hidden rounded-lg">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-contain max-h-[65vh]"
              />

              {/* Viewfinder corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF4C29]"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF4C29]"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FF4C29]"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FF4C29]"></div>
            </div>
          </div>

          {/* Right Panel: Editorial Context & Camera Telemetry */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-6 bg-[#2C394B]">
            <div className="space-y-4">
              <div>
                <h2 className="font-syne text-2xl font-bold text-white tracking-tight uppercase">
                  {photo.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono-camera text-[#E4D6A9] mt-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF4C29]" />
                    {photo.location}
                  </span>
                  <span className="text-[#978F66]">/</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#978F66]" />
                    {photo.year}
                  </span>
                  <span className="text-[#978F66]">/</span>
                  <span>BY {photo.photographer}</span>
                </div>
              </div>

              {/* Tabs for Metadata Specs */}
              <div className="flex items-center gap-2 border-b border-[#334756] pb-2">
                <button
                  onClick={() => {
                    playDialTick();
                    setActiveTab('specs');
                  }}
                  className={`text-xs font-mono-camera font-bold px-3 py-1.5 rounded transition-all ${
                    activeTab === 'specs'
                      ? 'bg-[#FF4C29] text-white'
                      : 'text-gray-300 hover:text-white bg-[#082032]'
                  }`}
                >
                  CAMERA EXIF
                </button>
                <button
                  onClick={() => {
                    playDialTick();
                    setActiveTab('tones');
                  }}
                  className={`text-xs font-mono-camera font-bold px-3 py-1.5 rounded transition-all ${
                    activeTab === 'tones'
                      ? 'bg-[#FF4C29] text-white'
                      : 'text-gray-300 hover:text-white bg-[#082032]'
                  }`}
                >
                  COLOR PALETTE
                </button>
                <button
                  onClick={() => {
                    playDialTick();
                    setActiveTab('story');
                  }}
                  className={`text-xs font-mono-camera font-bold px-3 py-1.5 rounded transition-all ${
                    activeTab === 'story'
                      ? 'bg-[#FF4C29] text-white'
                      : 'text-gray-300 hover:text-white bg-[#082032]'
                  }`}
                >
                  CURATOR NOTES
                </button>
              </div>

              {/* Tab 1: Camera EXIF Specs */}
              {activeTab === 'specs' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono-camera">
                    <div className="bg-[#082032] border border-[#334756] p-2.5 rounded-lg">
                      <div className="text-[#978F66] text-[10px]">CAMERA BODY</div>
                      <div className="text-white font-bold mt-0.5 truncate">{photo.cameraModel}</div>
                    </div>
                    <div className="bg-[#082032] border border-[#334756] p-2.5 rounded-lg">
                      <div className="text-[#978F66] text-[10px]">OPTICS / LENS</div>
                      <div className="text-white font-bold mt-0.5 truncate">{photo.lens}</div>
                    </div>
                    <div className="bg-[#082032] border border-[#334756] p-2.5 rounded-lg">
                      <div className="text-[#978F66] text-[10px]">SHUTTER SPEED</div>
                      <div className="text-[#E4D6A9] font-bold mt-0.5">{photo.shutterSpeed}</div>
                    </div>
                    <div className="bg-[#082032] border border-[#334756] p-2.5 rounded-lg">
                      <div className="text-[#978F66] text-[10px]">APERTURE</div>
                      <div className="text-[#E4D6A9] font-bold mt-0.5">{photo.aperture}</div>
                    </div>
                    <div className="bg-[#082032] border border-[#334756] p-2.5 rounded-lg">
                      <div className="text-[#978F66] text-[10px]">ISO RATING</div>
                      <div className="text-[#FF4C29] font-bold mt-0.5">{photo.iso}</div>
                    </div>
                    <div className="bg-[#082032] border border-[#334756] p-2.5 rounded-lg">
                      <div className="text-[#978F66] text-[10px]">FILM / SENSOR</div>
                      <div className="text-white font-bold mt-0.5 truncate">
                        {photo.filmStock || 'Digital Sensor'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Color Palette Swatches */}
              {activeTab === 'tones' && (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-gray-300">
                    Extracted tonal spectrum from this capture. Matches Pholet dark navy & orange dynamic curve.
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {photo.colorPalette.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div
                          className="w-full h-12 rounded-lg border border-[#334756] shadow-sm"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="font-mono-camera text-[10px] text-gray-300">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Curator Notes */}
              {activeTab === 'story' && (
                <div className="space-y-2 pt-1">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {photo.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {photo.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#082032] border border-[#334756] text-[11px] font-mono-camera text-[#978F66]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-[#334756]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-mono-camera font-bold transition-all focus-pholet ${
                    isFavorite
                      ? 'bg-[#FF4C29] border-[#FF4C29] text-white pholet-shadow-sm'
                      : 'bg-[#082032] border-[#334756] text-gray-300 hover:border-[#FF4C29] hover:text-[#FF4C29]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'SAVED TO ARCHIVE' : `LIKE FRAME (${photo.likes + (isFavorite ? 1 : 0)})`}</span>
                </button>

                <button
                  onClick={() => {
                    playShutterSound();
                    onClose();
                    onBookStyle(photo);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF4C29] hover:bg-[#ff360f] text-white rounded-xl text-xs font-bold uppercase tracking-wider pholet-shadow-md focus-pholet transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Commission Style</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
