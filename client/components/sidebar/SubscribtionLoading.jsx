


export default function SubscribtionLoading(){
    return (
        <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                  Subscriptions
                </h3>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
        </div>
    )
}