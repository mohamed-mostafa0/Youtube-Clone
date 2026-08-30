import React from 'react';
import { MdContentCopy } from "react-icons/md";

export default function ChannelUrl({ channelId }) {
  return (
    <>
      <div>
        <h2 className="text-[15px] font-semibold mb-1 flex items-center gap-2">
          Channel URL
          <span className="text-gray-500 dark:text-gray-400 text-[10px] w-[14px] h-[14px] border border-gray-500 dark:border-gray-400 rounded-full flex items-center justify-center cursor-help">?</span>
        </h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
          This is the standard web address for your channel. It includes your unique channel ID, which is the numbers and letters at the end of the URL.
        </p>
        <div className="flex max-w-3xl">
          <input
            type="text"
            readOnly
            value={`https://www.youtube.com/channel/${channelId || "your-id"}`}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l bg-gray-50 dark:bg-[#1f1f1f] text-gray-700 dark:text-gray-300 outline-none text-[14px]"
          />
          <button type="button" className="bg-gray-50 dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-700 border-l-0 px-4 flex items-center justify-center rounded-r hover:bg-gray-200 dark:hover:bg-[#272727] transition-colors group relative">
            <MdContentCopy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
              Copy
            </span>
          </button>
        </div>
      </div>

      <div className="pb-20">
        <h2 className="text-[15px] font-semibold mb-1">Links</h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
          Share external links with your viewers that they can find on the About page of your channel and your profile.
        </p>
      </div>
    </>
  );
}
