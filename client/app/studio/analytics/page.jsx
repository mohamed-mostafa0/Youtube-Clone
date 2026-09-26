"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MdBarChart, MdVideoLibrary, MdKeyboardArrowDown } from "react-icons/md";
import { getChannelAnalytics, getVideoAnalytics } from "@/app/api/services/videoServices";
import { getUserChannel } from "@/app/api/services/channelServices";
import ChannelAnalyticsView from "@/components/studio/analytics/ChannelAnalyticsView";
import VideoAnalyticsView from "@/components/studio/analytics/VideoAnalyticsView";

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramVideoId = searchParams.get("videoId");
  const [activeTab, setActiveTab] = useState(paramVideoId ? "video" : "channel");
  const [selectedVideoId, setSelectedVideoId] = useState(paramVideoId || "");

  useEffect(() => {
    if (paramVideoId) {
      setSelectedVideoId(paramVideoId);
      setActiveTab("video");
    }
  }, [paramVideoId]);

  const {
    data: channelData,
    isLoading: isChannelLoading,
    error: channelError
  } = useQuery({
    queryKey: ["channel-analytics"],
    queryFn: async () => {
      const res = await getChannelAnalytics();
      return res.data.analytics;
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000
  });

  const { data: userChannelData } = useQuery({
    queryKey: ["my-channel-videos"],
    queryFn: async () => {
      const res = await getUserChannel();
      return res.data.videos || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000
  });

  const videosList = userChannelData || [];

  useEffect(() => {
    if (activeTab === "video" && !selectedVideoId && videosList.length > 0) {
      setSelectedVideoId(videosList[0]._id);
      router.replace(`/studio/analytics?videoId=${videosList[0]._id}`, { scroll: false });
    }
  }, [activeTab, selectedVideoId, videosList, router]);

  const {
    data: videoData,
    isLoading: isVideoLoading,
    error: videoError
  } = useQuery({
    queryKey: ["video-analytics", selectedVideoId],
    queryFn: async () => {
      if (!selectedVideoId) return null;
      const res = await getVideoAnalytics(selectedVideoId);
      return res.data.analytics;
    },
    enabled: !!selectedVideoId && activeTab === "video",
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "channel") {
      router.replace("/studio/analytics", { scroll: false });
    } else if (tab === "video") {
      const targetId = selectedVideoId || (videosList.length > 0 ? videosList[0]._id : "");
      if (targetId) {
        setSelectedVideoId(targetId);
        router.replace(`/studio/analytics?videoId=${targetId}`, { scroll: false });
      }
    }
  };

  const handleVideoSelect = (videoId) => {
    setSelectedVideoId(videoId);
    setActiveTab("video");
    router.replace(`/studio/analytics?videoId=${videoId}`, { scroll: false });
  };

  const handleBackToChannel = () => {
    handleTabChange("channel");
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#272727] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Channel & Video Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your views, audience reach, watch time, and engagement metrics
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-[#2f2f2f] self-start sm:self-auto">
          <button
            onClick={() => handleTabChange("channel")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer select-none ${
              activeTab === "channel"
                ? "bg-white dark:bg-[#2e2e2e] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <MdBarChart className="w-4 h-4 text-blue-500" />
            Channel Overview
          </button>
          <button
            onClick={() => handleTabChange("video")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer select-none ${
              activeTab === "video"
                ? "bg-white dark:bg-[#2e2e2e] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <MdVideoLibrary className="w-4 h-4 text-emerald-500" />
            Video Analytics
          </button>
        </div>
      </div>

      {activeTab === "video" && videosList.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
            Select Video:
          </label>
          <div className="relative inline-block w-full max-w-md">
            <select
              value={selectedVideoId}
              onChange={(e) => handleVideoSelect(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] text-gray-900 dark:text-gray-100 text-sm font-medium rounded-xl py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              {videosList.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.title} ({v.views || 0} views)
                </option>
              ))}
            </select>
            <MdKeyboardArrowDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {activeTab === "channel" ? (
        isChannelLoading ? (
          <AnalyticsLoadingSkeleton />
        ) : channelError ? (
          <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30">
            {channelError.response?.data?.message || "Failed to load channel analytics."}
          </div>
        ) : (
          <ChannelAnalyticsView
            analytics={channelData}
            onSelectVideoForAnalytics={handleVideoSelect}
          />
        )
      ) : (
        isVideoLoading ? (
          <AnalyticsLoadingSkeleton />
        ) : videoError ? (
          <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30">
            {videoError.response?.data?.message || "Failed to load video analytics."}
          </div>
        ) : videosList.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#1f1f1f] rounded-2xl border border-gray-200 dark:border-[#2f2f2f]">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No videos found for this channel.</p>
            <p className="text-xs text-gray-400">Upload a video in the Content tab to view its analytics.</p>
          </div>
        ) : (
          <VideoAnalyticsView
            analytics={videoData}
            onBackToChannel={handleBackToChannel}
          />
        )
      )}
    </div>
  );
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-200 dark:bg-[#1f1f1f]"></div>
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-gray-200 dark:bg-[#1f1f1f]"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-gray-200 dark:bg-[#1f1f1f]"></div>
        <div className="h-72 rounded-2xl bg-gray-200 dark:bg-[#1f1f1f]"></div>
      </div>
    </div>
  );
}

export default function StudioAnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoadingSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  );
}
