import { 
  MdHomeFilled, 
  MdOutlineExplore, 
  MdOutlineSubscriptions, 
  MdOutlineVideoLibrary, 
  MdHistory, 
  MdOutlineOndemandVideo, 
  MdOutlineWatchLater, 
  MdThumbUpOffAlt 
} from "react-icons/md";
import ChannelAvatar from "./ChannelAvatar";
import { useQuery } from "@tanstack/react-query";
import { getSubscribedChannels } from "@/app/api/services/channelServices";
import SubscribtionLoading from "./sidebar/SubscribtionLoading";

export default function Sidebar({ isOpen }) {
  const mainLinks = [
    { icon: <MdHomeFilled className="w-6 h-6" />, label: "Home" },
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Shorts" },
    { icon: <MdOutlineSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
  ];

  const secondaryLinks = [
    { icon: <MdOutlineVideoLibrary className="w-6 h-6" />, label: "Library" },
    { icon: <MdHistory className="w-6 h-6" />, label: "History" },
    { icon: <MdOutlineOndemandVideo className="w-6 h-6" />, label: "Your videos" },
    { icon: <MdOutlineWatchLater className="w-6 h-6" />, label: "Watch later" },
    { icon: <MdThumbUpOffAlt className="w-6 h-6" />, label: "Liked videos" },
  ];

  const exploreLinks = [
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Trending" },
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Music" },
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Movies" },
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Live" },
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Gaming" },
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "News" },
    { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Sports" },
  ];

  const {data:subscribedChannels , isLoading} = useQuery({
    queryKey:['subscribed-channels'],
    queryFn:async()=>{
      const res = await getSubscribedChannels()
      console.log(res.data.channels);
      return res.data.channels
    }
  })
  
  return (
    <aside
      className={`fixed md:sticky top-[20px] left-0 h-[calc(100vh-56px)] bg-white dark:bg-[#0f0f0f] overflow-y-auto hover:scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#717171] z-40 transition-transform md:transition-none duration-200 ease-in-out ${
        isOpen ? "translate-x-0 w-[240px]" : "-translate-x-full md:translate-x-0 md:w-[72px]"
      }`}
    >
      <div className="flex flex-col py-3">
        <div className="px-3 pb-3 border-b border-gray-200 dark:border-gray-800">
          {mainLinks.map((link, idx) => (
            <div
              key={idx}
              className={`flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#272727] ${
                isOpen ? "flex-row gap-5" : "flex-col gap-1 py-4 px-1 justify-center"
              } ${idx === 0 ? "bg-gray-100 dark:bg-[#272727]" : ""}`}
            >
              <div className="flex-shrink-0 text-gray-900 dark:text-gray-100">
                {link.icon}
              </div>
              <span
                className={`${
                  isOpen ? "text-sm font-medium" : "text-[10px] leading-3 truncate"
                } text-gray-900 dark:text-gray-100`}
              >
                {link.label}
              </span>
            </div>
          ))}
        </div>

        {isOpen && (
          <>
            <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
              {secondaryLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#272727]"
                >
                  <div className="flex-shrink-0 text-gray-900 dark:text-gray-100">
                    {link.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {link.label}
                  </span>
                </div>
              ))}
            </div>


            {isLoading ? (

              <SubscribtionLoading/>
            ) : subscribedChannels?.length > 0 && (
              <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                  Subscriptions
                </h3>
                {subscribedChannels.map((sub) => (
                  <div
                    key={sub.channel._id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#272727]"
                  >
                    <ChannelAvatar url={sub.channel.logoUrl} name={sub.channel.channelName} size="sm" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {sub.channel.channelName}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                Explore
              </h3>
              {exploreLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#272727]"
                >
                  <div className="flex-shrink-0 text-gray-900 dark:text-gray-100">
                    {link.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {link.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
