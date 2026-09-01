import { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHls = src && (src.includes('.m3u8') || src.includes('.ts'));

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 30, 
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const availableQualities = hls.levels.map((l) => l.height);
        availableQualities.sort((a, b) => b - a);
        availableQualities.unshift(0); 

        const defaultOptions = {
          autoplay: true,
          quality: {
            default: 0, 
            options: availableQualities,
            forced: true, 
            onChange: (e) => updateQuality(e),
          },
          i18n: {
            qualityLabel: {
              0: 'Auto',
            },
          },
        };

        playerRef.current = new Plyr(video, defaultOptions);
      });

      function updateQuality(newQuality) {
        if (newQuality === 0) {
          hls.currentLevel = -1; 
        } else {
          hls.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hls.currentLevel = levelIndex;
            }
          });
        }
      }

      return () => {
        hls.destroy();
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    } else {
      playerRef.current = new Plyr(video, {
        autoplay: true,
      });
      video.src = src;

      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }
  }, [src]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black [&_.plyr]:h-full [&_video]:object-contain">
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full"
        controls
        crossOrigin="anonymous"
        autoPlay
      />
    </div>
  );
}
