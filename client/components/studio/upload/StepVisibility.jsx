export default function StepVisibility({ formik }) {
  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl space-y-8">
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Visibility</h3>
          <p className="text-sm text-gray-500 mt-1">Choose when to publish and who can see your video</p>
        </div>

        <div className="border border-gray-300 dark:border-[#3f3f3f] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-[#3f3f3f] bg-gray-50 dark:bg-[#202020]">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Save or publish</h4>
            <p className="text-xs text-gray-500">Make your video public, unlisted, or private</p>
          </div>

          <div className="p-4 space-y-4">
            
            <label className={`flex items-start gap-4 p-3 rounded cursor-pointer transition-colors ${formik.values.visibility === 'private' ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-[#3f3f3f]/50'}`}>
              <div className="pt-1">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="private"
                  checked={formik.values.visibility === "private"}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">Private</span>
                <span className="block text-xs text-gray-500 mt-1">Only you and people you choose can watch your video</span>
              </div>
            </label>

            <label className={`flex items-start gap-4 p-3 rounded cursor-pointer transition-colors ${formik.values.visibility === 'public' ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-[#3f3f3f]/50'}`}>
              <div className="pt-1">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="public"
                  checked={formik.values.visibility === "public"}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">Public</span>
                <span className="block text-xs text-gray-500 mt-1">Everyone can watch your video</span>
              </div>
            </label>

          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#202020] p-4 rounded-md">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">Before you publish, check the following:</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            <strong>Do kids appear in this video?</strong> Make sure you follow our policies to protect minors from harm.
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Looking for overall content guidance?</strong> Our Community Guidelines can help you avoid trouble and ensure that StreamTube remains a safe and vibrant community.
          </p>
        </div>

      </div>
    </div>
  );
}
