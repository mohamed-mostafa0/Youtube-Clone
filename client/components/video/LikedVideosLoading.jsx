export default function LikedVideosLoading() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 lg:flex lg:gap-8">
        

        <div className="flex-1 flex flex-col lg:pl-2">
          
          <div className="flex gap-3 mb-6 overflow-hidden">
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          <div className="flex flex-col gap-4 pb-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-2 sm:gap-4 p-2">
                <div className="w-36 sm:w-48 aspect-video rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0"></div>
                <div className="flex-1 flex flex-col gap-2 mt-1">
                  <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-800 rounded w-full max-w-md animate-pulse"></div>
                  <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 max-w-sm animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mt-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
