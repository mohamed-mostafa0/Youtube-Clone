import { MdLock, MdVisibility, MdVisibilityOff, MdVideoCall, MdFormatListBulleted, MdDelete } from "react-icons/md";
import ContentTableLoading from "../upload/ContentTableLoading";
import { formatDistanceToNow } from "date-fns";

export default function ContentTable({
    setIsModalOpen,
    isLoading,
    videos,
    onDeleteClick
}){

  const getVisibilityPill = (visibility) => {
    switch(visibility) {
      case "public": 
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-xs font-semibold">
            <MdVisibility className="w-3.5 h-3.5" />
            <span>Public</span>
          </div>
        );
      case "unlisted": 
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20 text-xs font-semibold">
            <MdVisibilityOff className="w-3.5 h-3.5" />
            <span>Unlisted</span>
          </div>
        );
      case "private": 
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs font-semibold">
            <MdLock className="w-3.5 h-3.5" />
            <span>Private</span>
          </div>
        );
      default: 
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20 text-xs font-semibold">
            <MdVisibility className="w-3.5 h-3.5" />
            <span className="capitalize">{visibility}</span>
          </div>
        );
    }
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <ContentTableLoading/>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#272727] shadow-sm text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-[#272727] rounded-full flex items-center justify-center mb-6">
            <MdVideoCall className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No content available</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
            Get started by uploading your first video to share with your audience.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-sm"
          >
            Upload video
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-8">
          <table className="w-full text-left text-sm whitespace-nowrap border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider">
                <th className="px-6 py-2 font-semibold">Video</th>
                <th className="px-6 py-2 font-semibold">Visibility</th>
                <th className="px-6 py-2 font-semibold">Date</th>
                <th className="px-6 py-2 font-semibold text-right">Views</th>
                <th className="px-6 py-2 font-semibold text-right">Likes</th>
                <th className="px-6 py-2 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr 
                  key={video._id} 
                  className="bg-white dark:bg-[#1a1a1a] group hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/50 transition-all duration-300 rounded-xl"
                >
                  <td className="px-6 py-4 rounded-l-xl border-t border-b border-l border-transparent group-hover:border-gray-100 dark:group-hover:border-[#2a2a2a]">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-36 aspect-video bg-gray-100 dark:bg-[#272727] rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-300">
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MdFormatListBulleted className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                          </div>
                        )}
                        {video.duration && (
                          <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-medium tracking-wide">
                            {Math.floor(video.duration / 60)}:{(Math.floor(video.duration % 60)).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col max-w-[150px] sm:max-w-xs xl:max-w-md overflow-hidden">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {video.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 whitespace-normal leading-relaxed">
                          {video.description || "No description provided."}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 border-t border-b border-transparent group-hover:border-gray-100 dark:group-hover:border-[#2a2a2a]">
                    {getVisibilityPill(video.visibility)}
                  </td>
                  
                  <td className="px-6 py-4 border-t border-b border-transparent group-hover:border-gray-100 dark:group-hover:border-[#2a2a2a]">
                    <div className="flex flex-col">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right border-t border-b border-transparent group-hover:border-gray-100 dark:group-hover:border-[#2a2a2a]">
                    <span className="text-gray-900 dark:text-gray-100 font-bold bg-gray-50 dark:bg-[#272727] px-3 py-1.5 rounded-lg">
                      {video.views?.toLocaleString() || 0}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 border-t border-b border-transparent group-hover:border-gray-100 dark:group-hover:border-[#2a2a2a] text-right">
                    <span className="text-gray-900 dark:text-gray-100 font-bold bg-gray-50 dark:bg-[#272727] px-3 py-1.5 rounded-lg">
                      {video.likes?.toLocaleString() || 0}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 rounded-r-xl border-t border-b border-r border-transparent group-hover:border-gray-100 dark:group-hover:border-[#2a2a2a] text-right">
                    <button 
                      onClick={() => onDeleteClick?.(video._id)}
                      className="p-2  cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                      title="Delete video"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}