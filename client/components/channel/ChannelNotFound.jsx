import { MdErrorOutline } from "react-icons/md";
import Link from "next/link";

export default function ChannelNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4 animate-in fade-in duration-500">
      <div className="w-24 h-24 mb-6 bg-gray-50 dark:bg-gray-900/10 text-gray-500 rounded-full flex items-center justify-center shadow-inner">
        <MdErrorOutline className="text-5xl" />
      </div>
      <h2 className="text-3xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight">
        Channel Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg mb-8 leading-relaxed">
        This page isn't available. Sorry about that. The channel might have been removed or the URL is incorrect.
      </p>
      <Link 
        href="/"
        className="px-8 py-2.5 bg-[#065fd4] hover:bg-[#0056b3] text-white font-medium rounded-full transition-colors duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
}
