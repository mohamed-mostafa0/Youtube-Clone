import React from 'react';

export default function BannerUpload({ preview, inputRef, onFileChange, onRemove }) {
  return (
    <div>
      <h2 className="text-[15px] font-semibold mb-1">Banner image</h2>
      <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">
        This image will appear across the top of your channel.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-[280px] h-[160px] bg-[#f9f9f9] dark:bg-[#1f1f1f] rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
           {preview ? (
               <img src={preview} alt="Banner Preview" className="object-cover w-full h-full" />
           ) : (
               <div className="relative flex items-end justify-center w-full h-full pb-6">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-20 bg-[#ff0033] border-2 border-black rounded-t-sm flex flex-col justify-center">
                      <div className="w-full h-8 bg-white border-y-2 border-black mt-2"></div>
                    </div>
                    <div className="w-40 h-3 bg-black rounded-t-sm -mt-0.5 relative z-20">
                       <div className="w-full h-1.5 bg-gray-700 absolute bottom-0 rounded-b-sm"></div>
                    </div>
                  </div>
                  <div className="absolute z-30 bottom-6 ml-24 w-7 h-12 bg-white border-2 border-black rounded-sm"></div>
               </div>
           )}
        </div>
        <div className="flex-1 mt-2">
          <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-4 leading-relaxed max-w-sm">
            For the best results on all devices, use an image that's at least 2048 x 1152 pixels and 6MB or less.
          </p>
          <input 
             type="file" 
             accept="image/*" 
             className="hidden" 
             ref={inputRef} 
             onChange={(e) => onFileChange(e, 'banner')} 
          />
          <button 
              type="button"
              onClick={() => inputRef.current.click()}
              className="text-[14px] font-medium text-[#065fd4] dark:text-[#3ea6ff] hover:bg-[#def1ff] dark:hover:bg-[#263850] px-4 py-2 rounded-full transition-colors"
          >
            {preview ? "Change" : "Upload"}
          </button>
          {preview && (
              <button 
                  type="button"
                  onClick={() => onRemove('banner')}
                  className="text-[14px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] px-4 py-2 rounded-full transition-colors ml-2"
              >
                  Remove
              </button>
          )}
        </div>
      </div>
    </div>
  );
}
