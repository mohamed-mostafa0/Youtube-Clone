"use client";
import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { getUserChannel, updateChannel } from "../../app/api/services/channelServices";
import EditPageLoading from "./EditPageLoading";
import BannerUpload from "./BannerUpload";
import AvatarUpload from "./AvatarUpload";
import BasicInfo from "./BasicInfo";
import ChannelUrl from "./ChannelUrl";

export default function ChannelCustomization() {
  const queryClient = useQueryClient();
  
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [files, setFiles] = useState({
    banner: null,
    avatar: null,
  });

  const [previews, setPreviews] = useState({
    banner: "",
    avatar: "",
  });

  const { data: channelData, isLoading } = useQuery({
    queryKey: ["my-channel"],
    queryFn: getUserChannel,
  });

  const updateMutation = useMutation({
    mutationFn: updateChannel,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-channel"]);
      alert("Channel updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update channel", error);
      alert("Error updating channel.");
    }
  });

  const formik = useFormik({
    initialValues: {
      name: channelData?.data?.channel?.channelName || "",
      handle: channelData?.data?.channel?.uniqueChannelName || "",
      description: channelData?.data?.channel?.description || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const submitData = new FormData();
      submitData.append("channelName", values.name);
      submitData.append("uniqueChannelName", values.handle);
      submitData.append("description", values.description);
      
      if (files.avatar) submitData.append("logoUrl", files.avatar);
      if (files.banner) submitData.append("channelCover", files.banner);
      
      updateMutation.mutate(submitData);
    },
  });

  useEffect(() => {
    if (channelData?.data?.channel) {
      const channel = channelData.data.channel;
      setPreviews({
        banner: channel.channelCover || "",
        avatar: channel.logoUrl || "",
      });
    }
  }, [channelData]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleRemove = (type) => {
    setPreviews(p => ({...p, [type]: ""})); 
    setFiles(f => ({...f, [type]: null}));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-[24px] sm:text-[28px] font-semibold">Channel customization</h1>
          <button 
            type="button"
            onClick={formik.handleSubmit}
            disabled={updateMutation.isPending || updateMutation.isLoading || isLoading}
            className="bg-[#065fd4] cursor-pointer text-white px-5 py-2 rounded-full font-medium hover:bg-[#0056b3] transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending || updateMutation.isLoading ? "Publishing..." : "Publish"}
          </button>
      </div>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
        <button className="px-1 py-3 text-sm font-medium border-b-2 border-black dark:border-white text-black dark:text-white mr-8 whitespace-nowrap">
          Profile
        </button>
        <button className="px-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap">
          Home page
        </button>
      </div>

      {isLoading ? <EditPageLoading /> : (
        <form onSubmit={formik.handleSubmit} className="space-y-10 max-w-4xl">
          <BannerUpload 
            preview={previews.banner} 
            inputRef={bannerInputRef} 
            onFileChange={handleFileChange} 
            onRemove={handleRemove} 
          />
          <AvatarUpload 
            preview={previews.avatar} 
            inputRef={avatarInputRef} 
            onFileChange={handleFileChange} 
            onRemove={handleRemove} 
            fallbackName={formik.values.name}
          />
          <BasicInfo 
            formik={formik} 
          />
          <ChannelUrl 
            channelId={channelData?.data?.channel?._id} 
          />
        </form>
      )}
    </div>
  );
}
