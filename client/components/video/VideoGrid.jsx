import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { videos as mockVideos } from "../../data/mockData";
import VideoCard from "./VideoCard";
import VideoSkeleton from "./VideoSkeleton";
import { getVideos } from "@/app/api/services/videoServices";

export default function VideoGrid({ category = "All", onResetCategory }) {
  const { ref, inView } = useInView();

  const { 
    data, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["videos", category],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getVideos({ pageParam, category });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if(error){
    return <div className="p-6 text-center text-red-500">{error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 p-4">
        {[...Array(9)].map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  const allVideos = data?.pages.flatMap(page => page.videos) || [];

  if (allVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#272727] flex items-center justify-center mb-4">
          <MdOutlineVideoLibrary className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          No videos found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {category && category.toLowerCase() !== "all"
            ? `There are no published videos in the "${category}" category yet.`
            : "No videos have been uploaded yet."}
        </p>
        {category && category.toLowerCase() !== "all" && onResetCategory && (
          <button
            onClick={onResetCategory}
            className="px-5 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            Show All Videos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-y-8 p-4">
        {allVideos.map((video) => (
          <VideoCard key={video._id || video.id} video={video} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 p-4 mt-2">
          {[...Array(3)].map((_, i) => (
            <VideoSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}

      <div ref={ref} className="h-10 w-full" />
    </div>
  );
}
