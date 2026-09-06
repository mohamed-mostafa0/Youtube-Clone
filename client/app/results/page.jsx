"use client";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getVideos } from "../api/services/videoServices";
import HorizontalVideoCard from "../../components/video/HorizontalVideoCard";
import VideoSkeleton from "../../components/video/VideoSkeleton";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LikedVideosLoading from "@/components/video/LikedVideosLoading";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search_query") || "";

  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["searchVideos", searchQuery],
    queryFn: ({ pageParam = 1 }) => getVideos({ pageParam, search: searchQuery }),
    getNextPageParam: (lastPage) => lastPage.data.nextPage ?? undefined,
    enabled: !!searchQuery,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="w-full max-w-[1096px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        <LikedVideosLoading />

      </div>
    );
  }

  if (status === "error") {
    return <div className="text-center mt-10">Error loading search results</div>;
  }

  const allVideos = data?.pages.flatMap((page) => page.data.videos) || [];

  return (
    <div className="w-full max-w-[1096px] mx-auto p-4 sm:p-6 lg:p-8">
      {allVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">No results found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Try different keywords or remove search filters</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {allVideos.map((video) => (
            <HorizontalVideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      <div ref={ref} className="h-10 mt-8 flex justify-center items-center">
        {isFetchingNextPage && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        )}
      </div>
    </div>
  );
}
