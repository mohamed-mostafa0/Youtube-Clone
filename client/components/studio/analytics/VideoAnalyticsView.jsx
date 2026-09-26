"use client";

import Link from "next/link";
import { MdVisibility, MdThumbUp, MdThumbDown, MdChatBubble, MdAccessTime, MdArrowBack, MdPlayCircleOutline } from "react-icons/md";
import AnalyticsChart from "./AnalyticsChart";
import { formatViews } from "@/helpers/video";
import { formatDistanceToNow } from "date-fns";

export default function VideoAnalyticsView({ analytics, onBackToChannel }) {
  if (!analytics) return null;

  const { video, metrics, viewsOverTime } = analytics;

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const watchTimeHours = (metrics.estimatedWatchTimeMinutes / 60).toFixed(1);

  const kpis = [
    {
      title: "Views",
      value: (metrics.views || 0).toLocaleString(),
      subtitle: "Lifetime views",
      icon: <MdVisibility className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-900/50"
    },
    {
      title: "Watch Time",
      value: `${watchTimeHours} hrs`,
      subtitle: `${metrics.estimatedWatchTimeMinutes || 0} total minutes`,
      icon: <MdAccessTime className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-900/50"
    },
    {
      title: "Like Ratio",
      value: `${metrics.likeRatio}%`,
      subtitle: `${metrics.likes || 0} likes vs ${metrics.dislikes || 0} dislikes`,
      icon: <MdThumbUp className="w-5 h-5 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-900/50"
    },
    {
      title: "Comments",
      value: (metrics.commentsCount || 0).toLocaleString(),
      subtitle: "Audience comments",
      icon: <MdChatBubble className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-900/50"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="relative w-36 aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-[#282828] flex-shrink-0 group">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : null}
            {video.duration && (
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                {formatDuration(video.duration)}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 capitalize">
                {video.category || "General"}
              </span>
              <span className="text-xs text-gray-400">
                {video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : ""}
              </span>
            </div>

            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
              {video.title}
            </h2>

            <div className="flex items-center gap-3 mt-3">
              <Link
                href={`/watch/${video._id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <MdPlayCircleOutline className="w-4 h-4" />
                Watch on YouTube
              </Link>
            </div>
          </div>
        </div>

        {onBackToChannel && (
          <button
            onClick={onBackToChannel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2a2a] dark:hover:bg-[#383838] text-gray-700 dark:text-gray-200 text-sm font-medium rounded-full transition-colors cursor-pointer self-start md:self-center"
          >
            <MdArrowBack className="w-4 h-4" />
            Channel Analytics
          </button>
        )}
      </div>

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
              Video Performance Over Time
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daily views logged for this specific video
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
            {metrics.views || 0} total views
          </span>
        </div>

        <AnalyticsChart data={viewsOverTime} metricLabel="Video Views" color="#10b981" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            Audience Sentiment
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Likes vs Dislikes distribution
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <MdThumbUp className="w-4 h-4" />
                {metrics.likes || 0} Likes ({metrics.likeRatio}%)
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <MdThumbDown className="w-4 h-4" />
                {metrics.dislikes || 0} Dislikes
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-[#282828] overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${metrics.likeRatio}%` }}
              ></div>
              <div
                className="bg-red-400 dark:bg-red-500/80 h-full transition-all duration-500"
                style={{ width: `${100 - metrics.likeRatio}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
              {metrics.likeRatio >= 90
                ? "Excellent viewer response! This video is performing higher than average."
                : "Average sentiment rating from viewers."}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2f2f2f] shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            Retention & Duration
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Average time viewers spend watching this video
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100">
              <span>Avg. View Duration</span>
              <span className="text-blue-600 dark:text-blue-400">
                {formatDuration(metrics.averageViewDurationSeconds)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100">
              <span>Total Video Length</span>
              <span className="text-gray-500 dark:text-gray-400">
                {formatDuration(video.duration)}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-[#282828] overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    video.duration > 0
                      ? Math.round((metrics.averageViewDurationSeconds / video.duration) * 100)
                      : 60,
                    100
                  )}%`
                }}
              ></div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
              Typical audience retention for this format is approx. 50-60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
