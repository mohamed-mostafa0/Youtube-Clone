import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="bg-white dark:bg-[#212121] rounded-2xl p-6 w-full max-w-sm shadow-xl"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 cursor-pointer text-sm font-medium text-blue-600 dark:text-[#3ea6ff] hover:bg-blue-50 dark:hover:bg-[#263850] rounded-full transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
