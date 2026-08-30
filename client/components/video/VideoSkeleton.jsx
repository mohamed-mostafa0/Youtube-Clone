export default function VideoSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      <div className="w-full aspect-video rounded-xl bg-gray-200 dark:bg-gray-800"></div>

      <div className="flex gap-3 pr-4">
        <div className="flex flex-col gap-2 w-full mt-1">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          
          <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-800 rounded mt-1"></div>
        </div>
      </div>
    </div>
  );
}
