import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading this page. Please try again later.", 
  showHomeButton = true 
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[50vh] w-full bg-white dark:bg-[#0f0f0f]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
          <MdErrorOutline className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>

        {showHomeButton && (
          <Link 
            href="/"
            className="mt-6 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full transition-opacity hover:opacity-90"
          >
            Go to Home
          </Link>
        )}
      </div>
    </div>
  );
}
