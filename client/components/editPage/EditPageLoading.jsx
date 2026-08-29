



export default function EditPageLoading(){
    return (
    <div className="animate-pulse space-y-10 max-w-4xl">
      <div>
        <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-64 mb-4"></div>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-[280px] h-[160px] bg-gray-200 dark:bg-[#1f1f1f] rounded flex-shrink-0"></div>
          <div className="flex-1 mt-2 w-full">
             <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-full max-w-xs mb-2"></div>
             <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-48 mb-4"></div>
             <div className="w-24 h-9 bg-gray-200 dark:bg-[#272727] rounded-full"></div>
          </div>
        </div>
      </div>

      <div>
        <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-64 mb-4"></div>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-[280px] h-[160px] bg-gray-100 dark:bg-[#1f1f1f] rounded flex items-center justify-center flex-shrink-0">
             <div className="w-[104px] h-[104px] rounded-full bg-gray-200 dark:bg-[#272727]"></div>
          </div>
          <div className="flex-1 mt-2 w-full">
             <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-full max-w-xs mb-2"></div>
             <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-48 mb-4"></div>
             <div className="flex gap-2">
                <div className="w-24 h-9 bg-gray-200 dark:bg-[#272727] rounded-full"></div>
                <div className="w-24 h-9 bg-gray-200 dark:bg-[#272727] rounded-full"></div>
             </div>
          </div>
        </div>
      </div>

      {[1, 2, 3].map(i => (
        <div key={i}>
          <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-full max-w-md mb-3"></div>
          <div className={`w-full max-w-3xl ${i === 3 ? 'h-32' : 'h-10'} bg-gray-200 dark:bg-[#1f1f1f] rounded border border-gray-300 dark:border-gray-700`}></div>
        </div>
      ))}
    </div>
    )
}