import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadVideo } from "@/app/api/services/videoServices";
import { useFormik } from "formik";

import InitialUploadStep from "./upload/InitialUploadStep";
import UploadStepper from "./upload/UploadStepper";
import VideoPreviewSidebar from "./upload/VideoPreviewSidebar";
import StepDetails from "./upload/StepDetails";
import StepVisibility from "./upload/StepVisibility";

export default function UploadVideoModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const thumbnailInputRef = useRef(null);
  const [serverError, setServerError] = useState(null);
  
  const [isInitialStep, setIsInitialStep] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const mutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-channel"]);
      handleClose();
    },
    onError: (err) => {
      setServerError(err.response?.data?.message || "An error occurred while uploading.");
    }
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "gaming",
      visibility: "public",
      video: null,
      thumbnail: null
    },
    validate: (values) => {
      const errors = {};
      if (!values.title?.trim()) {
        errors.title = "Title is required";
      }
      if (!values.description?.trim()) {
        errors.description = "Description is required";
      }
      
      if (!values.video) {
        errors.video = "Video file is required";
      } else {
        const isVideoMime = values.video.type && values.video.type.startsWith("video/");
        const videoExtensions = [".mp4", ".mkv", ".webm", ".avi", ".mov", ".flv", ".wmv", ".m4v"];
        const hasVideoExt = values.video.name && videoExtensions.some(ext => values.video.name.toLowerCase().endsWith(ext));
        if (!isVideoMime && !hasVideoExt) {
          errors.video = "Invalid file type. Please upload a video file.";
        }
      }

      if (!values.thumbnail) {
        errors.thumbnail = "Thumbnail is required";
      } else {
        const isImageMime = values.thumbnail.type && values.thumbnail.type.startsWith("image/");
        const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
        const hasImageExt = values.thumbnail.name && imageExtensions.some(ext => values.thumbnail.name.toLowerCase().endsWith(ext));
        if (!isImageMime && !hasImageExt) {
          errors.thumbnail = "Invalid file type. Please upload an image file.";
        }
      }
      return errors;
    },
    onSubmit: (values) => {
      setServerError(null);
      const data = new FormData();
      data.append("title", values.title);
      data.append("description", values.description);
      data.append("category", values.category);
      data.append("visibility", values.visibility);
      data.append("video", values.video);
      data.append("thumbnail", values.thumbnail);

      mutation.mutate(data);
    }
  });
  // console.log(formik.values);
  

  const handleVideoSelect = (file) => {
    formik.setFieldValue("video", file);
    const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
    formik.setFieldValue("title", nameWithoutExt);
    setTimeout(() => {
      formik.setFieldTouched("video", true);
    }, 0);
    setIsInitialStep(false);
  };

  const handleThumbnailSelect = (e) => {    
    if (e.target.files && e.target.files[0]) {
      formik.setFieldValue("thumbnail", e.target.files[0]);
    }
  };

  const handleNext = async () => {
    const errors = await formik.validateForm();
    formik.setTouched({
      title: true,
      thumbnail: true,
      video: true
    });

    if (!errors.title && !errors.thumbnail && !errors.video) {
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const handleClose = () => {
    formik.resetForm();
    setServerError(null);
    setIsInitialStep(true);
    setCurrentStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[960px] bg-white dark:bg-[#282828] rounded-xl shadow-2xl z-50 overflow-hidden h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#3f3f3f]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate pr-4">
                {isInitialStep ? "Upload video" : formik.values.title || "Upload video"}
              </h2>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {isInitialStep ? (
              <InitialUploadStep onFileSelect={handleVideoSelect} />
            ) : (
              <>
                <UploadStepper currentStep={currentStep} />
                
                {(serverError || (formik.touched.video && formik.errors.video)) && (
                  <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border-b border-red-100 dark:border-red-900/30">
                    {serverError || formik.errors.video}
                  </div>
                )}

                <div className="flex-1 flex overflow-hidden">
                  {currentStep === 0 && (
                    <StepDetails 
                      formik={formik} 
                      thumbnailInputRef={thumbnailInputRef} 
                      handleThumbnailSelect={handleThumbnailSelect} 
                    />
                  )}
                  {currentStep === 1 && (
                    <StepVisibility formik={formik} />
                  )}
                  <VideoPreviewSidebar videoFile={formik.values.video} />
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-[#3f3f3f] flex items-center justify-between bg-white dark:bg-[#282828]">
                  <div className="text-sm text-gray-500">
                  </div>
                  <div className="flex items-center gap-3">
                    {currentStep > 0 && (
                      <button 
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-2 font-medium text-gray-600 rounded-xl dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] text-sm transition-colors "
                      >
                        Back
                      </button>
                    )}
                    
                    {currentStep === 0 ? (
                      <button 
                        type="button"
                        onClick={handleNext}
                        className="px-5 py-2 font-medium text-white bg-black cursor-pointer text-sm hover:bg-gray-800 rounded-lg transition-colors "
                      >
                        Next
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={formik.handleSubmit}
                        disabled={mutation.isPending}
                        className={`px-5 py-2 font-medium text-white rounded text-sm transition-colors flex items-center gap-2  ${
                          mutation.isPending 
                            ? "bg-black cursor-not-allowed" 
                            : "bg-black hover:bg-gray-800 cursor-pointer  rounded-lg"
                        }`}
                      >
                        {mutation.isPending ? "Saving..." : "Save"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
