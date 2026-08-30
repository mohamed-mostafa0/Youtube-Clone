import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { videos as mockVideos } from "../../data/mockData";
import VideoCard from "./VideoCard";
import VideoSkeleton from "./VideoSkeleton";
import { getVideos } from "@/app/api/services/videoServices";

export default function VideoGrid() {
  const { ref, inView } = useInView();

  const { 
    data, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["videos"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getVideos({ pageParam });
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
    return error.message
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

  // Flatten the pages array into a single array of videos
  const allVideos = data?.pages.flatMap(page => page.videos) || [];

  return (
    <div className="flex flex-col mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 p-4">
        {allVideos.map((video) => (
          <VideoCard key={video._id || video.id} video={video} />
        ))}
      </div>

      {/* Loading Skeletons at the bottom while fetching next page */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 p-4 mt-2">
          {[...Array(3)].map((_, i) => (
            <VideoSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}

      {/* Intersection Observer target */}
      <div ref={ref} className="h-10 w-full" />
    </div>
  );
}
