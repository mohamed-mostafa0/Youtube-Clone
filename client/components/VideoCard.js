import Image from "next/image";
import { MdCheckCircle, MdMoreVert } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

export default function VideoCard({ video , logo , channelName }) {

  return (
    <div className="flex flex-col gap-3 group cursor-pointer w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      <div className="flex gap-3 pr-4 relative">
        
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
            {video.title}
          </h3>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
            <span className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {video.channelName}
            </span>
            {video.verified && (
              <MdCheckCircle className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <span>{video.views} views</span>
            <span className="mx-1 text-[10px]">•</span>
            {video.createdAt &&
            
             <span>{formatDistanceToNow(new Date(video.createdAt),{addSuffix:true})}</span>
            }
          </div>
        </div>

        <button className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-gray-100 dark:hover:bg-[#272727]">
          <MdMoreVert className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </button>
      </div>
    </div>
  );
}
