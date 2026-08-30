export default function StudioProfileLoading({ isOpen }) {
  return (
    <div className={`relative flex flex-col items-center border-b border-gray-200 dark:border-[#272727] mb-4 ${isOpen ? 'pb-6' : 'pb-4'} animate-pulse`}>
      <div 
        className="absolute top-0 left-0 w-full h-24 bg-gray-200 dark:bg-[#272727] transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
      />
      
      <div className={`relative z-10 rounded-full border-4 border-white dark:border-[#0f0f0f] overflow-hidden transition-all duration-300 bg-gray-300 dark:bg-[#3f3f3f] ${isOpen ? 'w-24 h-24 mt-12' : 'w-10 h-10 mt-4'}`}>
      </div>

      <div className={`flex flex-col items-center justify-center mt-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'} w-full`}>
        <div className="h-4 bg-gray-300 dark:bg-[#3f3f3f] rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-[#3f3f3f] rounded w-20"></div>
      </div>
    </div>
  );
}
