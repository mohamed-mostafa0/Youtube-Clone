"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import ChannelBanner from "@/components/channel/ChannelBanner";
import ChannelHeader from "@/components/channel/ChannelHeader";
import ChannelTabs from "@/components/channel/ChannelTabs";
import ChannelVideos from "@/components/channel/ChannelVideos";
import ChannelEmptyState from "@/components/channel/ChannelEmptyState";
import { useQuery } from "@tanstack/react-query";
import { getChannelByName } from "../api/services/channelServices";
import ChannelLoading from "@/components/channel/ChannelLoading";
import ChannelNotFound from "@/components/channel/ChannelNotFound";
import { useAuth } from "@/context/AuthContext";

export default function PublicChannelPage() {
  const params = useParams();
  const {user} = useAuth();
  const router = useRouter();
  const channelName = params?.channelName;

  const [activeTab, setActiveTab] = useState("Videos");
  
  useEffect(() => {
    if(channelName && user && channelName === user?.uniqueChannelName) {
      router.replace("/channel");
    }
  }, [channelName, user, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["channel", channelName],
    queryFn: async () => {
      const res = await getChannelByName(channelName);
      console.log(res);
      
      return res.data;
    },
    enabled: !!channelName && channelName !== user?.uniqueChannelName,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (channelName === user?.uniqueChannelName) {
    return null; 
  }

  const userChannelData = data?.channel;
  const userChannelVideos = data?.videos || [];

  const channelData = {
    name: userChannelData?.channelName,
    handle: userChannelData?.uniqueChannelName,
    avatar: userChannelData?.logoUrl,
    banner: userChannelData?.channelCover,
    subscribers: userChannelData?.subscribers?.length || 0,
    videoCount: userChannelVideos?.length || 0,
    description: userChannelData?.description || "No description",
  };

  const tabs = ["Videos", "Shorts", "Live", "Playlists", "Community"];

  return (
    <>
          {isLoading ? (
            <ChannelLoading/>
          ) : error ? (
            <ChannelNotFound />
          ) : (
            <>
              <ChannelBanner banner={channelData?.banner} />

              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <ChannelHeader channelData={channelData} />

                <ChannelTabs 
                  tabs={tabs} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                />

                <div className="py-2 animate-in fade-in duration-500 slide-in-from-bottom-2">
                  {activeTab === "Videos" && (
                    <ChannelVideos videos={userChannelVideos} channelData={channelData} />
                  )}

                  {activeTab !== "Home" && activeTab !== "Videos" && (
                    <ChannelEmptyState activeTab={activeTab} />
                  )}
                </div>
              </div>
            </>
          )}
    </>
  );
}
