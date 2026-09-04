 import { useState, useRef, useEffect } from "react";
import { MdNotificationsNone, MdNotifications } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "../app/api/services/userServices";
import ChannelAvatar from "./ChannelAvatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSocket } from "../context/SocketProvider";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { socket } = useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications().then(res => res.data),
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  useEffect(() => {
    if (!socket) return;
    
    const handleNewNotification = (newNotif) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("notification", handleNewNotification);
    
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket, queryClient]);

  const markAsReadMutation = useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          unreadCount: Math.max(0, oldData.unreadCount - 1),
          notifications: oldData.notifications.map(n => 
            n._id === id ? { ...n, isRead: true } : n
          )
        };
      });
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
    setIsOpen(false);
    
    if (notification.video) {
      router.push(`/watch/${notification.video._id}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors hidden sm:block relative cursor-pointer"
      >
        {isOpen ? (
          <MdNotifications className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        ) : (
          <MdNotificationsNone className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        )}
        
        {unreadCount > 0 && (
          <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white dark:border-[#0f0f0f]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-[360px] bg-white dark:bg-[#282828] rounded-xl shadow-lg border border-gray-200 dark:border-[#3f3f3f] py-2 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#3f3f3f]">
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center text-gray-500 dark:text-gray-400">
                <MdNotificationsNone className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-medium text-sm">Your notifications live here</p>
                <p className="text-xs mt-1">Subscribe to your favorite channels to receive notifications about their latest videos.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#3f3f3f] ${!notification.isRead ? 'bg-blue-50/50 dark:bg-[#303030]/50' : ''}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <ChannelAvatar 
                      url={notification.sender?.logoUrl} 
                      name={notification.sender?.channelName} 
                      size="md" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug">
                      <span className="font-medium mr-1">{notification.sender?.channelName}</span>
                      {notification.type === 'like' && 'liked your video'}
                      {notification.type === 'comment' && 'commented on your video'}
                      {notification.type === 'subscribe' && 'subscribed to your channel'}
                      {notification.type === 'upload' && 'uploaded a new video'}
                    </p>
                    {notification.video && (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mt-0.5">
                        {notification.video.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {notification.video && notification.video.thumbnailUrl && (
                    <div className="flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden ml-2">
                      <img 
                        src={notification.video.thumbnailUrl} 
                        alt="video thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full flex-shrink-0 mt-5 ml-2"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
