import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import ContentTableLoading from "../upload/ContentTableLoading";




export default function ContentTable({
    setIsModalOpen,
    isLoading,
    videos
}){

const getVisibilityIcon = (visibility) => {
    switch(visibility) {
      case "public": return <MdVisibility className="text-green-500" />;
      case "unlisted": return <MdVisibilityOff className="text-yellow-500" />;
      case "private": return <MdLock className="text-red-500" />;
      default: return <MdVisibility className="text-gray-500" />;
    }
  }

    return <>
          <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#272727] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-[#272727] text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-[#272727]">
              <tr>
                <th className="px-6 py-4">Video</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Views</th>
                <th className="px-6 py-4 text-right">Likes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#272727]">
              {isLoading ? (
                <ContentTableLoading/>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <p className="mb-2">No videos uploaded yet.</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-blue-600 cursor-pointer dark:text-blue-400 font-medium hover:underline"
                    >
                      Upload your first video
                    </button>
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50 dark:hover:bg-[#272727]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <div className="relative w-32 aspect-video bg-gray-200 dark:bg-[#272727] rounded overflow-hidden flex-shrink-0">
                          {video.thumbnailUrl && (
                            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                          )}
                          {video.duration && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">
                              {Math.floor(video.duration / 60)}:{(Math.floor(video.duration % 60)).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col max-w-[200px] sm:max-w-xs overflow-hidden">
                          <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{video.title}</span>
                          <span className="text-xs text-gray-500 truncate line-clamp-2 whitespace-normal">{video.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 capitalize">
                        {getVisibilityIcon(video.visibility)}
                        <span className="text-gray-700 dark:text-gray-300">{video.visibility}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">{video.views || 0}</td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">{video.likes || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    
    </>
}