import { MdCheckCircle } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";

export default function ChannelHeader({ channelData }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
      <div className="relative group cursor-pointer">
        <img 
          src={channelData.avatar || "/default-avatar.png"} 
          alt={channelData.name} 
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-[5px] border-white dark:border-[#0f0f0f] shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none"></div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2 mb-2">
          {channelData.name}
          <MdCheckCircle className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
        </h1>
        
        <div className="flex flex-wrap items-center text-sm sm:text-base text-gray-600 dark:text-gray-400 gap-x-3 gap-y-1 mb-3 font-medium">
          <span className="text-gray-800 dark:text-gray-200">{channelData.handle}</span>
          <span className="text-[10px]">•</span>
          <span>{channelData.subscribers} subscribers</span>
          <span className="text-[10px]">•</span>
          <span>{channelData.videoCount} videos</span>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-2xl flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors group">
          {channelData.description}
          <FaChevronRight className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        </p>

        <button
          className="rounded-full w-fit px-5 py-2 mt-5 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 font-semibold text-sm sm:text-base cursor-pointer"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
