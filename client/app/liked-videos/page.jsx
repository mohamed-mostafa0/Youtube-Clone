"use client";

import { useQuery } from "@tanstack/react-query";
import { getLikedVideos } from "@/app/api/services/userServices";
import HorizontalVideoCard from "@/components/video/HorizontalVideoCard";
import LikedVideosLoading from "@/components/video/LikedVideosLoading";
import ErrorState from "@/components/ErrorState";
import { MdThumbUp, MdPlayArrow, MdShuffle } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function LikedVideosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view liked videos");
      router.push("/");
    }
  }, [user, authLoading, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["liked-videos"],
    queryFn: async () => {
      const res = await getLikedVideos();
      return res.data;
    },
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return <LikedVideosLoading />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load liked videos" 
        message="We encountered an issue fetching your liked videos. Please try again later." 
      />
    );
  }

  const videos = data?.videos
    ?.map((reaction) => reaction.video)
    .filter((video) => video !== null) || [];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 lg:flex lg:gap-8">
        


        <div className="flex-1 flex flex-col lg:pl-2">
          
          <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar sticky top-16 lg:top-0 bg-white dark:bg-[#0f0f0f] z-10 py-2">
            <button className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap">All</button>
            <button className="bg-gray-100 dark:bg-[#272727] text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">Videos</button>
            <button className="bg-gray-100 dark:bg-[#272727] text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">Shorts</button>
          </div>

          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MdThumbUp className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No liked videos yet</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                Videos that you have liked will show up here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pb-10">
              {videos.map((video, index) => (
                <HorizontalVideoCard key={video._id} video={video} index={index} />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
