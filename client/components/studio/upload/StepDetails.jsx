import { useState, useRef, useEffect } from "react";
import { MdImage, MdKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function StepDetails({ formik, thumbnailInputRef, handleThumbnailSelect }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const categories = [
    { value: "gaming", label: "gaming" },
    { value: "music", label: "music" },
    { value: "education", label: "education" },
    { value: "vlogs", label: "vlogs" },
    { value: "tech", label: "tech" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl space-y-8 pb-32">
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Details</h3>

        <div>
          <div className={`relative border rounded-md transition-colors ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-300 dark:border-[#3f3f3f] focus-within:border-blue-500 dark:focus-within:border-blue-500'}`}>
            <label className="absolute -top-2 left-3 bg-white dark:bg-[#282828] px-1 text-xs text-gray-500">
              Title
            </label>
            <input 
              type="text" 
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Add a title that describes your video"
              className="w-full px-4 py-3 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          {formik.touched.title && formik.errors.title && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">{formik.errors.title}</p>
          )}
        </div>

        <div>
          <div className={`relative border rounded-md transition-colors ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300 dark:border-[#3f3f3f] focus-within:border-blue-500 dark:focus-within:border-blue-500'}`}>
            <label className="absolute -top-2 left-3 bg-white dark:bg-[#282828] px-1 text-xs text-gray-500">
              Description
            </label>
            <textarea 
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Tell viewers about your video"
              className="w-full h-32 px-4 py-3 bg-transparent outline-none text-sm resize-none text-gray-900 dark:text-gray-100"
            />
          </div>
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">{formik.errors.description}</p>
          )}

        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Thumbnail</h4>
          <p className="text-xs text-gray-500 mb-3">
            Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention.
          </p>
          
          <div className="flex gap-4">
            <div 
              onClick={() => thumbnailInputRef.current?.click()}
              className={`w-[400px] aspect-video border border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${formik.touched.thumbnail && formik.errors.thumbnail ? 'border-red-500' : 'border-gray-400 dark:border-[#5a5a5a] hover:bg-gray-50 dark:hover:bg-[#3f3f3f]'}`}
            >
              {formik.values.thumbnail ? (
                <img 
                  src={URL.createObjectURL(formik.values.thumbnail)} 
                  alt="Custom Thumbnail" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <MdImage className="w-6 h-6 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-500">Upload thumbnail</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                ref={thumbnailInputRef} 
                onChange={handleThumbnailSelect} 
                className="hidden" 
              />
            </div>

          </div>
          {formik.touched.thumbnail && formik.errors.thumbnail && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.thumbnail}</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Category</h4>
          <p className="text-xs text-gray-500 mb-3">Add your video to a category so viewers can find it more easily.</p>
          
          <div className="relative w-full max-w-sm" ref={categoryRef}>
            <div 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-[#282828] border rounded-md cursor-pointer transition-all ${
                isCategoryOpen 
                  ? 'border-blue-500 ring-1 ring-blue-500' 
                  : 'border-gray-300 dark:border-[#3f3f3f] hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {categories.find(c => c.value.toLowerCase() === formik.values.category?.toLowerCase())?.label || "Select Category"}
              </span>
              <motion.div animate={{ rotate: isCategoryOpen ? 180 : 0 }}>
                <MdKeyboardArrowDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </div>

            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute z-50 w-full mt-2 bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3f3f3f] rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                    {categories.map((category) => (
                      <div
                        key={category.value}
                        onClick={() => {
                          formik.setFieldValue("category", category.value);
                          setIsCategoryOpen(false);
                        }}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                          formik.values.category?.toLowerCase() === category.value.toLowerCase()
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3f3f3f]'
                        }`}
                      >
                        {category.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Comments</h4>
          <p className="text-xs text-gray-500 mb-3">Choose whether viewers can leave comments on this video.</p>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                name="commentsAllow"
                checked={formik.values.commentsAllow}
                onChange={formik.handleChange}
                className="sr-only"
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${formik.values.commentsAllow ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formik.values.commentsAllow ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {formik.values.commentsAllow ? 'Allow comments' : 'Disable comments'}
            </span>
          </label>
        </div>

      </div>
    </div>
  );
}
