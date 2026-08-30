"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserChannel } from "@/app/api/services/channelServices";
import UploadVideoModal from "@/components/studio/UploadVideoModal";
import { MdVideoCall } from "react-icons/md";
import ContentTable from "@/components/studio/content/ContentTable";

export default function ContentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["my-channel"],
    queryFn: async () => {
      const res = await getUserChannel();
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const videos = data?.videos || [];



  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Channel content</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 cursor-pointer text-sm text-white rounded-full font-medium transition-colors shadow-sm"
        >
          <MdVideoCall className="w-5 h-5" />
          <span>Upload Video</span>
        </button>
      </div>

      <ContentTable
      isLoading={isLoading}
      videos={videos}
      setIsModalOpen={setIsModalOpen}
      />

      <UploadVideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}