import { MdCheckCircle } from "react-icons/md";

export default function ChannelEmptyState({ activeTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 mb-6 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center shadow-inner">
          <MdCheckCircle className="text-5xl text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">Nothing to see here yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
          This channel hasn't posted any {activeTab.toLowerCase()} content recently. Check back later for new updates and releases.
        </p>
    </div>
  );
}
