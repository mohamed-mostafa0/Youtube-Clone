"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserChannel } from "@/app/api/services/channelServices";
import { deleteVideo } from "@/app/api/services/videoServices";
import UploadVideoModal from "@/components/studio/UploadVideoModal";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { MdVideoCall } from "react-icons/md";
import ContentTable from "@/components/studio/content/ContentTable";

export default function ContentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-channel"],
    queryFn: async () => {
      const res = await getUserChannel();
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const videos = data?.videos || [];

  const deleteVideoMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-channel"]);
      toast.success("Video deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete video");
    },
    onSettled: () => {
      setVideoToDelete(null);
    }
  });
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
        onDeleteClick={(id) => setVideoToDelete(id)}
      />

      <UploadVideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <ConfirmModal
        isOpen={!!videoToDelete}
        onClose={() => setVideoToDelete(null)}
        onConfirm={() => deleteVideoMutation.mutate(videoToDelete)}
        title="Delete video forever?"
        message="I understand that deleting is permanent, and can't be undone."
        confirmText="Delete forever"
      />
    </div>
  );
}