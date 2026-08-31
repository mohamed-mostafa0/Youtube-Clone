import { motion } from "framer-motion";

export default function DeleteCommentModal({
    deleteMutation,
    comment,
    setShowDeleteModal
}){
    return(
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white dark:bg-[#282828] w-full max-w-sm rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Delete your comment?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-[#202020] border-t border-gray-200 dark:border-[#3f3f3f] flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 cursor-pointer rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors text-gray-800 dark:text-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteMutation.mutate(comment._id);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 cursor-pointer rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
    )
}