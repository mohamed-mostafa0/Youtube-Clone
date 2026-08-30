import { MdOndemandVideo, MdContentCopy } from "react-icons/md";
import { useState, useEffect } from "react";

export default function VideoPreviewSidebar({ videoFile }) {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);      
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  return (
    <div className="w-[300px] flex-shrink-0 bg-gray-50 dark:bg-[#202020] border-l border-gray-200 dark:border-[#3f3f3f] flex flex-col hidden lg:flex">
      <div className="p-4 flex-1">
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center mb-4">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          ) : (
            <MdOndemandVideo className="w-12 h-12 text-gray-500" />
          )}
        </div>
        
        <div className="space-y-4">
         <div>
            <p className="text-xs text-gray-500 mb-1">File name</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
              {videoFile?.name || "uploading_video.mp4"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
