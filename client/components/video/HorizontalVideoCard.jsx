import Image from "next/image";
import Link from "next/link";
import { MdCheckCircle, MdMoreVert } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

export default function HorizontalVideoCard({ video, index }) {
  const formatDuration = (duration) => {
    if (!duration) return "10:00";
    const num = Number(duration);
    if (!isNaN(num)) {
      return num.toFixed(2).replace('.', ':');
    }
    return duration;
  };

  return (
    <div className="flex items-start gap-2 sm:gap-4 group cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-[#272727] p-2 rounded-xl transition-colors">
      
      {index !== undefined && (
        <div className="flex items-center justify-center w-4 sm:w-6 text-sm font-medium text-gray-500 dark:text-gray-400 mt-6 hidden sm:flex">
          {index + 1}
        </div>
      )}

      <Link href={`/watch/${video._id}`} className="relative w-36 sm:w-48 aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 144px, 192px"
          />
        ) : null}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] sm:text-xs font-medium px-1 sm:px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
      </Link>

      <div className="flex flex-1 gap-2 pr-6 relative mt-1">
        <div className="flex flex-col overflow-hidden">
          <Link href={`/watch/${video._id}`}>
            <h3 className="text-sm sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {video.title}
            </h3>
          </Link>
          
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap items-center gap-x-1">
            <Link href={`/${video.owner?.uniqueChannelName}`} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {video.channelName || video.owner?.channelName || "Channel Name"}
            </Link>
            {video.verified && (
              <MdCheckCircle className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex flex-wrap items-center gap-x-1">
            <span className="">{video.views || 0} views</span>
            <span className="mx-1 text-[10px]">•</span>
            {video.createdAt && (
             <span>{formatDistanceToNow(new Date(video.createdAt), {addSuffix: true})}</span>
            )}
          </div>

        </div>

        <button className="absolute right-0 top-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-gray-200 dark:hover:bg-[#3f3f3f]">
          <MdMoreVert className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </button>
      </div>
    </div>
  );
}
