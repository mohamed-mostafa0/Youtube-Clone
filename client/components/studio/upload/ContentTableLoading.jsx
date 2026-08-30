
export default function ContentTableLoading() {
    return (
        
        Array.from({ length: 4 }).map((_, index) => (
            <tr key={index} className="animate-pulse border-b border-gray-200 dark:border-[#272727] last:border-0">
            <td className="px-6 py-4">
                <div className="flex gap-4 items-center">
                <div className="w-32 aspect-video bg-gray-200 dark:bg-[#3f3f3f] rounded flex-shrink-0"></div>
                <div className="flex flex-col gap-2 w-full max-w-[200px] sm:max-w-xs">
                    <div className="h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-[#3f3f3f] rounded w-full mt-1"></div>
                </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded w-16"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded w-20"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded w-10 ml-auto"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 dark:bg-[#3f3f3f] rounded w-10 ml-auto"></div>
            </td>
            </tr>
        ))
        
    );
}