


export default function ChannelLoading(){


    return (
        <div className="animate-pulse w-full">
              <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] bg-gray-200 dark:bg-gray-800"></div>
              
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0 border-[5px] border-white dark:border-[#0f0f0f]"></div>
                  
                  <div className="flex-1 w-full space-y-4 py-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 sm:w-1/3"></div>
                    
                    <div className="flex gap-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-24"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-24"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-24"></div>
                    </div>
                    
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-full max-w-2xl"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-2/3 max-w-lg"></div>
                    
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-full w-28 mt-4"></div>
                  </div>
                </div>

                <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-6 pb-4">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-16"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-16"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-16"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-16"></div>
                </div>

                <div className="mb-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-24"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 w-full">
                      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                      <div className="flex gap-3 pr-4">
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
                        <div className="flex flex-col gap-2 w-full mt-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-[90%]"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-[60%]"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
    )
}