"use client";
import React, { useState } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import ChannelCustomization from "@/components/editPage/ChannelCustomization";

export default function EditChannelPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 font-sans">
      <Header onMenuClick={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`flex-1 overflow-y-auto w-full transition-all duration-200 ease-in-out bg-white dark:bg-[#0f0f0f]`}>
          <ChannelCustomization />
        </main>
      </div>
    </div>
  );
}
