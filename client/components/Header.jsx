import { useState, useRef, useEffect } from "react";
import {
  MdMenu,
  MdSearch,
  MdMic,
  MdVideoCall,
  MdNotificationsNone
} from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import ChannelAvatar from "./ChannelAvatar";
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";


export default function Header({ onMenuClick }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);





  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-[56px] bg-white dark:bg-[#0f0f0f] w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
        >
          <MdMenu className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="bg-red-600 text-white p-1 rounded-lg">
            <FaPlay className="w-4 h-4" />
          </div>
          <Link href="/" className="text-xl font-semibold tracking-tighter text-gray-900 dark:text-white">
            StreamTube
          </Link>
        </div>
      </div>

      <div className="hidden sm:flex items-center flex-1 max-w-[720px] ml-10 mr-4">
        <div className="flex items-center w-full">
          <div className="flex w-full items-center border border-gray-300 dark:border-gray-700 rounded-l-full px-4 py-0.5 bg-white dark:bg-[#121212] focus-within:border-blue-500 focus-within:ml-[-1px] focus-within:pl-[17px]">
            <MdSearch className="w-5 h-5 text-gray-400 hidden group-focus-within:block mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none h-9 text-gray-900 dark:text-white font-normal"
            />
          </div>
          <button className="px-5 bg-gray-100 dark:bg-[#222222] border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-full h-[40px] hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors">
            <MdSearch className="w-6 h-6 text-gray-900 dark:text-gray-100" />
          </button>
        </div>
        <button className="ml-4 p-2.5 rounded-full bg-gray-100 dark:bg-[#181818] hover:bg-gray-200 dark:hover:bg-[#272727] transition-colors flex-shrink-0">
          <MdMic className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors">
          <MdSearch className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors hidden sm:block">
          <MdVideoCall className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors hidden sm:block">
          <MdNotificationsNone className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>

        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <ChannelAvatar url={user.logoUrl} name={user.channelName} size="md" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-[300px] bg-white dark:bg-[#282828] rounded-xl shadow-lg border border-gray-200 dark:border-[#3f3f3f] py-2 z-50">
                <div className="flex items-start gap-4 px-4 py-3 border-b border-gray-200 dark:border-[#3f3f3f]">
                  <ChannelAvatar url={user.logoUrl} name={user.channelName} size="lg" />
                  <div className="flex flex-col">
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {user.channelName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      @{user.uniqueChannelName || user.channelName.toLowerCase().replace(/\s+/g, '')}
                    </span>
                    <Link href="/channel" className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 text-left">
                      View your channel
                    </Link>
                  </div>
                </div>

                <div className="py-2">
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <GoogleLoginButton />
        )}
      </div>
    </header>
  );
}
