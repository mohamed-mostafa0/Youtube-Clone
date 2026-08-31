


export default function WatchPageLoading(){

    
    return (
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 p-4 lg:p-6">
          
          <div className="flex-1 xl:w-[70%] xl:max-w-5xl">
            <div className="w-full aspect-video bg-gray-200 dark:bg-[#272727] rounded-xl mb-4 animate-pulse"></div>

            <div className="h-6 bg-gray-200 dark:bg-[#272727] rounded w-3/4 mb-3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-[#272727] rounded w-1/2 mb-6 animate-pulse"></div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#272727] animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-24 h-9 bg-gray-200 dark:bg-[#272727] rounded-full ml-2 animate-pulse"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-32 h-9 bg-gray-200 dark:bg-[#272727] rounded-full animate-pulse"></div>
                <div className="w-24 h-9 bg-gray-200 dark:bg-[#272727] rounded-full hidden sm:block animate-pulse"></div>
                <div className="w-24 h-9 bg-gray-200 dark:bg-[#272727] rounded-full hidden sm:block animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 dark:bg-[#272727] rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="bg-gray-200 dark:bg-[#272727] rounded-xl h-24 w-full animate-pulse mt-4"></div>
          </div>

          <div className="w-full xl:w-[350px] flex-shrink-0 flex flex-col gap-3 mt-6 xl:mt-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <div className="w-[168px] h-[94px] bg-gray-200 dark:bg-[#272727] rounded-xl flex-shrink-0 animate-pulse"></div>
                <div className="flex flex-col gap-2 w-full pt-1">
                  <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-1/2 mt-2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    )
}