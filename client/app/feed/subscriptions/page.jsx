"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscribedVideos } from "@/app/api/services/userServices";
import VideoCard from "@/components/video/VideoCard";
import VideoSkeleton from "@/components/video/VideoSkeleton";
import ErrorState from "@/components/ErrorState";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function SubscriptionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view subscriptions");
      router.push("/");
    }
  }, [user, authLoading, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscribed-videos"],
    queryFn: async () => {
      const res = await getSubscribedVideos();
      return res.data;
    },
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
            {[...Array(9)].map((_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load subscriptions" 
        message="We encountered an issue fetching videos from your subscribed channels." 
      />
    );
  }

  const videos = data?.videos || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]"
    >
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest</h1>
        
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No videos found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              The channels you are subscribed to haven't uploaded any videos yet, or you haven't subscribed to anyone.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
