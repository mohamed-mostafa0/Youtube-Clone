"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import StudioSidebar from "./studio/StudioSidebar";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 font-sans">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {
          isStudio?<StudioSidebar isOpen={isSidebarOpen}/> : <Sidebar isOpen={isSidebarOpen} />
        }
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
