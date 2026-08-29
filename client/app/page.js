"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryBar from "../components/CategoryBar";
import VideoGrid from "../components/VideoGrid";
import API from "./api/axios";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 font-sans">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <CategoryBar />
          <VideoGrid />
        </main>
      </div>
    </div>
  );
}
