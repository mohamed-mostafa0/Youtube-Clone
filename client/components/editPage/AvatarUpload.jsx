import React from 'react';

export default function AvatarUpload({ preview, inputRef, onFileChange, onRemove, fallbackName }) {
  return (
    <div>
      <h2 className="text-[15px] font-semibold mb-1">Picture</h2>
      <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">
        Your profile picture will appear where your channel is presented on YouTube, like next to your videos and comments.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-[280px] h-[160px] bg-[#f9f9f9] dark:bg-[#1f1f1f] rounded flex items-center justify-center flex-shrink-0">
          <div className="w-[104px] h-[104px] rounded-full bg-[#e8710a] text-white flex items-center justify-center text-[56px] pb-2 font-normal overflow-hidden relative">
            {preview ? (
                <img src={preview} alt="Avatar Preview" className="object-cover w-full h-full" />
            ) : (
                fallbackName?.charAt(0).toUpperCase() || "M"
            )}
          </div>
        </div>
        <div className="flex-1 mt-2">
          <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-4 leading-relaxed max-w-sm">
            It's recommended to use a picture that's at least 98 x 98 pixels and 4MB or less. Use a PNG or GIF (no animations) file. Make sure your picture follows the YouTube Community Guidelines.
          </p>
          <div className="flex gap-2">
            <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={inputRef} 
               onChange={(e) => onFileChange(e, 'avatar')} 
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
                  onClick={() => onRemove('avatar')}
                  className="text-[14px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] px-4 py-2 rounded-full transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
