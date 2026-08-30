import { useRef } from "react";
import { MdCloudUpload } from "react-icons/md";

export default function InitialUploadStep({ onFileSelect }) {
  const fileInputRef = useRef(null);
  

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center p-12 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-32 h-32 bg-gray-100 dark:bg-[#3f3f3f] rounded-full flex items-center justify-center mb-6 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#4f4f4f] transition-colors"
      >
        <MdCloudUpload className="w-16 h-16 text-gray-500 dark:text-gray-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Drag and drop video files to upload</h3>
      <p className="text-sm text-gray-500 mb-8">Your videos will be private until you publish them.</p>
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="px-6 py-2 bg-black hover:gray-800 rounded-xl text-sm cursor-pointer text-white font-medium  transition-colors"
      >
        Select Files
      </button>
      
      <input 
        type="file" 
        accept="video/*" 
        ref={fileInputRef} 
        onChange={handleChange} 
        className="hidden" 
      />
    </div>
  );
}
