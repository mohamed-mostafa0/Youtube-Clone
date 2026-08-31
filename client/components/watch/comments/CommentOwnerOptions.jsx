import { MdDelete, MdEdit, MdMoreVert } from "react-icons/md";



export default function CommentOwnerOptions({
    setIsEditing,
    setShowOptions,
    setShowDeleteModal,
    showOptions
}){
    
    return (
        <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3f3f3f] text-gray-600 dark:text-gray-400"
            >
            <MdMoreVert className="w-5 h-5" />
            </button>
            
            {showOptions && (
            <>
                <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowOptions(false)}
                ></div>
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3f3f3f] rounded-lg shadow-xl py-1 z-50 overflow-hidden">
                <button 
                    onClick={() => {
                    setIsEditing(true);
                    setShowOptions(false);
                    }}
                    className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left"
                >
                    <MdEdit className="w-4 h-4" />
                    Edit
                </button>
                <button 
                    onClick={() => {
                    setShowDeleteModal(true);
                    setShowOptions(false);
                    }}
                    className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left"
                >
                    <MdDelete className="w-4 h-4" />
                    Delete
                </button>
                </div>
            </>
            )}
        </div>
    )
    

}