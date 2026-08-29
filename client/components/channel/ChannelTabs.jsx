export default function ChannelTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
      <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-3 font-semibold text-sm sm:text-base transition-colors relative ${
              activeTab === tab
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900 dark:bg-white rounded-t-md transition-all duration-300"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
