"use client";

import Link from "next/link";
import Image from "next/image";
import { MdVisibility, MdThumbUp, MdPeople, MdAccessTime, MdChatBubble, MdBarChart, MdVideoLibrary } from "react-icons/md";
import AnalyticsChart from "./AnalyticsChart";
import { formatViews } from "@/helpers/video";

export default function ChannelAnalyticsView({ analytics, onSelectVideoForAnalytics }) {
  if (!analytics) return null;

  const { summary, viewsOverTime, topVideos, categoryDistribution } = analytics;

  const watchTimeHours = (summary.estimatedWatchTimeMinutes / 60).toFixed(1);

  const kpis = [
    {
      title: "Views",
      value: (summary.totalViews || 0).toLocaleString(),
      subtitle: `${summary.averageViewsPerVideo || 0} avg per video`,
      icon: <MdVisibility className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-900/50"
    },
    {
      title: "Watch Time",
      value: `${watchTimeHours} hrs`,
      subtitle: "Estimated total duration",
      icon: <MdAccessTime className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-900/50"
    },
    {
      title: "Subscribers",
      value: (summary.subscribersCount || 0).toLocaleString(),
      subtitle: "Active audience",
      icon: <MdPeople className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-900/50"
    },
    {
      title: "Likes & Engagement",
      value: (summary.totalLikes || 0).toLocaleString(),
      subtitle: `${summary.totalComments || 0} total comments`,
      icon: <MdThumbUp className="w-5 h-5 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-900/50"
    }
  ];

  const totalCatViews = categoryDistribution?.reduce((acc, c) => acc + (c.views || 0), 0) || 1;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl ${kpi.bg} border ${kpi.border}`}>
                {kpi.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {kpi.value}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {kpi.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Channel Views Growth
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daily views timeline across all published videos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30">
              Total {summary.totalViews?.toLocaleString() || 0} views
            </span>
          </div>
        </div>

        <AnalyticsChart data={viewsOverTime} metricLabel="Views" color="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Top Performing Videos
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ranked by view counts & engagement
              </p>
            </div>
            <Link
              href="/studio/content"
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </Link>
          </div>

          {topVideos && topVideos.length > 0 ? (
            <div className="space-y-3">
              {topVideos.map((video, idx) => (
                <div
                  key={video._id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#282828] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#383838]"
                >
                  <span className="w-5 text-center text-xs font-bold text-gray-400">
                    #{idx + 1}
                  </span>

                  <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-[#282828] flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MdVideoLibrary className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MdVisibility className="w-3.5 h-3.5" />
                        {formatViews(video.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdThumbUp className="w-3.5 h-3.5" />
                        {video.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdChatBubble className="w-3.5 h-3.5" />
                        {video.commentsCount || 0}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectVideoForAnalytics?.(video._id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-all cursor-pointer"
                    title="Deep Video Analytics"
                  >
                    <MdBarChart className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No videos uploaded yet. Upload a video to see top performance rankings.
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            Category Breakdown
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
            Share of views by category
          </p>

          {categoryDistribution && categoryDistribution.length > 0 ? (
            <div className="space-y-4">
              {categoryDistribution.map((cat, idx) => {
                const percentage = Math.round(((cat.views || 0) / totalCatViews) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                        {cat.category || "Uncategorized"}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {cat.views?.toLocaleString() || 0} views ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-[#282828] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>{cat.videoCount} {cat.videoCount === 1 ? 'video' : 'videos'}</span>
                      <span>{cat.likes || 0} likes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No category data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
