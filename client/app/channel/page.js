"use client";

import { useState } from "react";
import VideoCard from "../../components/video/VideoCard";
import { videos } from "../../data/mockData";
import { MdCheckCircle } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getUserChannel } from "../api/services/channelServices";

export default function ChannelPage() {
  const [activeTab, setActiveTab] = useState("Videos");

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-channel"],
    queryFn: async () => {
      const res = await getUserChannel()
      console.log(res.data)
      return res.data
    },
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  const userChannelData = data?.channel
  const userChannelVideos = data?.videos


  const channelData = {
    name: userChannelData?.channelName,
    handle: userChannelData?.uniqueChannelName,
    avatar: userChannelData?.logoUrl,
    banner: userChannelData?.channelCover,
    subscribers: userChannelData?.subscribers,
    videoCount: userChannelVideos?.length,
    description: userChannelData?.description || "No description",
    links: [
      { label: "codecraft.dev", url: "#" },
      { label: "Twitter", url: "#" }
    ]
  };

  const channelVideos = videos.filter((v) => v.channelName === "CodeCraft");

  const tabs = ["Videos", "Shorts", "Live", "Playlists", "Community"];

  return (
    <>
      {channelData?.banner &&
        <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] relative overflow-hidden group">
          <img
            src={channelData.banner}
            alt="Channel Banner"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
        </div>
      }


      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
          <div className="relative group cursor-pointer">
            <img
              src={channelData.avatar}
              alt={channelData.name}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-[5px] border-white dark:border-[#0f0f0f] shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none"></div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2 mb-2">
              {channelData.name}
              <MdCheckCircle className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
            </h1>

            <div className="flex flex-wrap items-center text-sm sm:text-base text-gray-600 dark:text-gray-400 gap-x-3 gap-y-1 mb-3 font-medium">
              <span className="text-gray-800 dark:text-gray-200">{channelData.handle}</span>
              <span className="text-[10px]">•</span>
              <span>{channelData.subscribers} subscribers</span>
              <span className="text-[10px]">•</span>
              <span>{channelData.videoCount} videos</span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-2xl flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors group">
              {channelData.description}
              <FaChevronRight className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>


            <a
              href={`/studio/customize`}
              className="rounded-full w-fit px-4 py-2 mt-5 bg-gray-100 text-gray-800 dark:bg-[#272727] dark:text-gray-200 dark:hover:bg-[#3f3f3f] transition-all duration-300 hover:bg-gray-200 font-semibold text-sm sm:text-base cursor-pointer">Customize Channel</a>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-3 font-semibold text-sm sm:text-base transition-colors relative ${activeTab === tab
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900 dark:bg-white rounded-t-md transition-all duration-300"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-2 animate-in fade-in duration-500 slide-in-from-bottom-2">
          {/* {activeTab === "Videos" && (
                <div className="space-y-12">
                  {channelVideos.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-6 mb-8 pb-10 border-b border-gray-200 dark:border-gray-800">
                      <div className="w-full lg:w-[60%] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-lg group relative cursor-pointer">
                        <img 
                          src={channelVideos[0].thumbnail} 
                          alt="Featured" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 duration-300 shadow-xl backdrop-blur-sm">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-start py-2">
                        <h2 className="text-xl sm:text-2xl font-bold mb-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                          {channelVideos[0].title}
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-1 font-medium">
                          <span>{channelVideos[0].views} views</span>
                          <span className="text-[10px]">•</span>
                          <span>{channelVideos[0].uploadTime}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
                          In this featured video, we explore the latest tools and techniques to enhance your skills. 
                          Whether you're a beginner or an advanced developer, there's always something new to learn.
                          Don't forget to like, subscribe, and hit the notification bell to stay updated with our newest content!
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold mb-6">For You</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10">
                      {userChannelVideos?.map((video) => (
                        <VideoCard key={video._id} video={video} logo={channelData.avatar} channelName={channelData.name} />
                      ))}
                    </div>
                  </div>
                </div>
              )} */}

          {activeTab === "Videos" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Latest</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10">
                {userChannelVideos?.map((video) => (
                  // <VideoCard key={video.id} video={video} />
                  <VideoCard key={video._id} video={video} logo={channelData.avatar} channelName={channelData.name} />

                ))}
              </div>
            </div>
          )}

          {activeTab !== "Home" && activeTab !== "Videos" && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 mb-6 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center shadow-inner">
                <MdCheckCircle className="text-5xl text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Nothing to see here yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
                This channel hasn't posted any {activeTab.toLowerCase()} content recently. Check back later for new updates and releases.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
