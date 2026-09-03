"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistory, deleteHistory, deleteVideoFromHistory } from "@/app/api/services/userServices";
import ConfirmModal from "@/components/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import HorizontalVideoCard from "@/components/video/HorizontalVideoCard";
import LikedVideosLoading from "@/components/video/LikedVideosLoading";
import ErrorState from "@/components/ErrorState";
import { MdHistory, MdOutlineSearch } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [search , setSearch] = useState("")
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view your history");
      router.push("/");
    }
  }, [user, authLoading, router]);
  console.log(search);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await getHistory();
      return res.data;
    },
    enabled: !!user,
  });

  const clearHistoryMutation = useMutation({
    mutationFn: deleteHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["history"]);
    },
    onError: () => {
      toast.error("Failed to clear watch history");
    }
  });

  const deleteVideoMutation = useMutation({
    mutationFn: deleteVideoFromHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["history"]);
    },
    onError: () => {
      toast.error("Failed to remove video");
    }
  });

  if (authLoading || isLoading) {
    return <LikedVideosLoading />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load history" 
        message="We encountered an issue fetching your watch history. Please try again later." 
      />
    );
  }

  const videos = data?.videos
    ?.map((view) => view.video)
    .filter((video) => video !== null) || [];

  const filteredVideos = videos.filter((video) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      video.title?.toLowerCase().includes(lowerSearch) ||
      video.owner?.channelName?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-[1250px] mx-auto p-4 lg:p-6 flex flex-col-reverse lg:flex-row lg:gap-12">
        
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Watch history</h1>

          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MdHistory className="w-24 h-24 text-gray-200 dark:text-gray-800 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {videos.length === 0 ? "No watch history" : "No matches found"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                {videos.length === 0 ? "Videos you watch will show up here." : "Try searching for something else."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-10">
              <AnimatePresence>
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  >
                    <HorizontalVideoCard 
                      video={video} 
                      index={index} 
                      onRemove={(id) => deleteVideoMutation.mutate(id)} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[300px] flex flex-col flex-shrink-0 pt-0 lg:pt-16 mb-6 lg:mb-0">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#272727] px-4 py-2 rounded-full mb-6 text-gray-900 dark:text-gray-100 focus-within:ring-1 ring-blue-500">
             <MdOutlineSearch className="w-5 h-5 text-gray-500" />
             <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)} 
               type="text" 
               placeholder="Search watch history" 
               className="bg-transparent border-none outline-none text-sm w-full"
             />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] text-gray-900 dark:text-gray-100 transition-colors w-full text-left"
            >
              Clear all watch history
            </button>

          </div>
        </div>
        
        
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => clearHistoryMutation.mutate()}
        title="Clear watch history?"
        message="Your YouTube watch history will be cleared from all YouTube apps on all devices."
        confirmText="Clear watch history"
      />
    </div>
  );
}
