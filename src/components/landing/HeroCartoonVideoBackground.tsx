import React, { useRef, useState } from 'react';

interface HeroCartoonVideoBackgroundProps {
  customVideoUrl?: string;
}

export const HeroCartoonVideoBackground: React.FC<HeroCartoonVideoBackgroundProps> = ({
  customVideoUrl,
}) => {
  const [videoSrc] = useState<string>(
    customVideoUrl ||
      '/bg_vd.mp4'
  );
  const [, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto select-none">
      {/* HTML5 Video Background Player */}
      <div className="absolute inset-0 z-10">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover object-right sm:object-center"
        />
      </div>

      {/* Upward Gradient Overlays for High Text Contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#082032] via-[#082032]/70 via-40% to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#082032]/90 via-[#082032]/50 to-transparent pointer-events-none"></div>
    </div>
  );
};
