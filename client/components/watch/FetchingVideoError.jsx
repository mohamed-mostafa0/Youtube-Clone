import Link from "next/link";
import { MdVideocamOff } from "react-icons/md";

export default function FetchingVideoError() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[50vh] bg-white dark:bg-[#0f0f0f]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-2">
          <MdVideocamOff className="w-12 h-12 text-gray-500 dark:text-gray-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Video unavailable
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          This video isn't available anymore, or the link you followed may be broken. 
          Please check the URL and try again.
        </p>

        <Link 
          href="/"
          className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
