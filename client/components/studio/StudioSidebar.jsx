import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdEditSquare, MdVideoLibrary } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import StudioProfileLoading from "./StudioProfileLoading";



export default function StudioSidebar({ isOpen }) {
  const { user, isLoading } = useAuth();


  const links = [
    {
      name: "Content",
      path: "/studio/content",
      icon: <MdVideoLibrary className="w-6 h-6" />
    },
    {
      name: "Customization",
      path: "/studio/customize",
      icon: <MdEditSquare className="w-6 h-6" />
    }
  ];
  const pathname = usePathname()

  return (
    <aside
      className={`${
        isOpen ? "w-60" : "w-20"
      } bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-[#272727] h-full transition-[width] duration-300 ease-in-out flex-shrink-0 flex flex-col overflow-hidden`}
    >
      {isLoading ? (
        <StudioProfileLoading isOpen={isOpen} />
      ) : (
        <div className={`relative flex flex-col items-center border-b border-gray-200 dark:border-[#272727] mb-4 ${isOpen ? 'pb-6' : 'pb-4'}`}>
          <div 
            className="absolute top-0 left-0 w-full h-24 bg-gray-200 dark:bg-gray-800 bg-cover bg-center transition-opacity duration-300"
            style={{ backgroundImage: `url(${user?.channelCover || ''})`, opacity: isOpen ? 1 : 0 }}
          />
          
          <div className={`relative z-10 rounded-full border-4 border-white dark:border-[#0f0f0f] overflow-hidden transition-all duration-300 ${isOpen ? 'w-24 h-24 mt-12' : 'w-10 h-10 mt-4'}`}>
            <img 
              src={user?.logoUrl || "https://ui-avatars.com/api/?name=Channel&background=random"} 
              alt="Channel Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className={`flex flex-col items-center text-center mt-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 line-clamp-1 px-2">{user?.channelName || "Your Channel"}</h3>
            <p className="text-xs text-gray-500">@{user?.uniqueChannelName || "channel"}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 px-3">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-4 px-3 py-3 text-sm rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-gray-100 dark:bg-[#272727] font-semibold text-red-600 dark:text-red-500"
                  : "hover:bg-gray-100 dark:hover:bg-[#272727] text-gray-800 dark:text-gray-200"
              }`}
            >
              <div className={`${isActive ? "text-red-600 dark:text-red-500 flex-shrink-0" : "flex-shrink-0"}`}>
                {link.icon}
              </div>
              
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}