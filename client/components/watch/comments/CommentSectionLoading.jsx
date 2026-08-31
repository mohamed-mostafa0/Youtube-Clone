export default function CommentSectionLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse mt-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 w-full">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3f3f3f] flex-shrink-0 mt-1"></div>
          
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-24 h-3 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>
              <div className="w-16 h-2 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="w-full h-3 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>
              <div className="w-4/5 h-3 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>
              {i % 2 === 0 && <div className="w-2/5 h-3 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>}
            </div>

            <div className="flex items-center gap-4 mt-1">
              <div className="w-12 h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>
              <div className="w-8 h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>
              <div className="w-10 h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
