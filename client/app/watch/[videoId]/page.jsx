"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getVideoById, reactToVideo, addView } from "@/app/api/services/videoServices";
import { formatViews } from "@/helpers/video";
import Image from "next/image";
import { MdThumbUp, MdThumbDown, MdShare, MdDownload, MdMoreHoriz, MdCheckCircle } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import WatchPageLoading from "@/components/watch/WatchPageLoading";
import FetchingVideoError from "@/components/watch/FetchingVideoError";
import CommentsSection from "@/components/watch/comments/CommentsSection";
import dynamic from "next/dynamic";
const VideoPlayer = dynamic(() => import("@/components/watch/VideoPlayer"), { ssr: false });
import { toggleSubscribe } from "@/app/api/services/channelServices";
import Link from "next/link";

export default function WatchPage() {
  const { videoId } = useParams();
  const [copied, setCopied] = useState(false);
  const viewCounted = useRef(false);

  const handleViewThreshold = () => {
    if (videoId && !viewCounted.current) {
      viewCounted.current = true;
      addView(videoId).catch(console.error);
    }
  };

  const queryClient = useQueryClient();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const { data: videoData, isLoading, error } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const res = await getVideoById(videoId);
      console.log(res);
      return res.data;
    },
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus:false
  });

  const { user } = useAuth();

  const reactionToVideoMutation = useMutation({
    mutationFn:reactToVideo,
    onSuccess:()=>{
      queryClient.invalidateQueries(["video", videoId])
    }
  })

  const toggleSubscribeMutation = useMutation({
    mutationFn:toggleSubscribe,
    onSuccess:()=>{
      queryClient.invalidateQueries(["video", videoId])
    }
  })

  const handleSubscribe = ()=>{
    if(!user){
      toast.error("You must be logged in to subscribe to the channel!");
      return;
    }
    toggleSubscribeMutation.mutate({channelId:videoData.video.owner._id})
  }

  const handleReactToVideo = (type)=>{
    if (!user) {
      toast.error("You must be logged in to like or dislike the video!");
      return;
    }
    reactionToVideoMutation.mutate({videoId , type})
  }

  if (isLoading) {
    return (
          <WatchPageLoading/>
    );
  }

  if (error || !videoData?.video) {
    return <FetchingVideoError />;
  }

  const video = videoData.video;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 p-4 lg:p-6">
      
        <div className="flex-1 xl:w-[70%] xl:max-w-5xl">
          
          <div className="w-full aspect-video  bg-black rounded-xl overflow-hidden mb-4 shadow-sm relative">
            <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl} onViewThreshold={handleViewThreshold} />
          </div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
            {video.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            
            <div className="flex items-center gap-4">
              <Link href={`/${video.owner?.uniqueChannelName}`} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative flex-shrink-0 cursor-pointer">
                {video.owner?.logoUrl && (
                  <Image src={video.owner.logoUrl} alt="Channel" fill className="object-cover" />
                )}
              </Link>
              <Link href={`/${video.owner?.uniqueChannelName}`} className="flex flex-col cursor-pointer pr-4">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{video.owner?.channelName || "Unknown Channel"}</span>
                  <MdCheckCircle className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <span className="text-xs text-gray-500">{video.owner.subscribers || 0} Subscribers</span>
              </Link>
              
              <button onClick={() => handleSubscribe()} className={`cursor-pointer px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 active:scale-95
                 ${video.isSubscribed ? 'bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333333]' : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 hover:scale-105 hover:shadow-lg'}`}>
                {video.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar shrink-0">
              <div className="flex bg-gray-100 dark:bg-[#272727] rounded-full overflow-hidden">
                <button
                onClick={()=>handleReactToVideo('like')}
                disabled={reactionToVideoMutation.isPending}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors border-r border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}>
                  <MdThumbUp className={`w-5 h-5 ${video.userReaction === 'like' ? 'text-blue-600 dark:text-[#3ea6ff]' : 'text-gray-800 dark:text-gray-200'}`} />
                  <span className={`text-sm font-medium ${video.userReaction === 'like' ? 'text-blue-600 dark:text-[#3ea6ff]' : 'text-gray-800 dark:text-gray-200'}`}>{video.likes || 0}</span>
                </button>
                <button
                onClick={()=>handleReactToVideo('dislike')}
                disabled={reactionToVideoMutation.isPending}
                className={`px-4 cursor-pointer py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                  <MdThumbDown className={`w-5 h-5 ${video.userReaction === 'dislike' ? 'text-blue-600 dark:text-[#3ea6ff]' : 'text-gray-800 dark:text-gray-200'}`} />
                </button>
              </div>

              <button 
                onClick={handleShare}
                className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
              >
                {copied ? <MdCheckCircle className="w-5 h-5 text-blue-600 dark:text-[#3ea6ff]" /> : <MdShare className="w-5 h-5 text-gray-800 dark:text-gray-200" />}
                <span className={`text-sm font-medium hidden sm:block ${copied ? 'text-blue-600 dark:text-[#3ea6ff]' : 'text-gray-800 dark:text-gray-200'}`}>
                  {copied ? "Copied!" : "Share"}
                </span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors hidden sm:flex">
                <MdDownload className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Download</span>
              </button>

              <button className="p-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors">
                <MdMoreHoriz className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-[#272727] rounded-xl p-3 sm:p-4 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors mb-6">
            <div className="flex gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : "Unknown date"}</span>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {video.description}
            </p>
          </div>

          <CommentsSection videoId={video._id} commentsAllow={video.commentsAllow} />
          
        </div>

        <div className="w-full xl:w-[350px] flex-shrink-0 flex flex-col gap-3">
           <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Recommended</h3>
           
           <div className="p-6 text-center text-sm text-gray-500 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#272727] rounded-xl">
             <p>Recommended videos will appear here.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
