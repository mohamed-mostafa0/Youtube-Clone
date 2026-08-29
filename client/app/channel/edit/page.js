"use client";
import React, { useState } from "react";
import { MdContentCopy, MdAdd } from "react-icons/md";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";

export default function EditChannelPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "mohamed mostafa",
    handle: "@mohamedmostafa6201",
    description: "",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 font-sans">
      <Header onMenuClick={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`flex-1 overflow-y-auto w-full transition-all duration-200 ease-in-out bg-white dark:bg-[#0f0f0f]`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="text-[24px] sm:text-[28px] font-semibold mb-6">Channel customization</h1>
            
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
              <button className="px-1 py-3 text-sm font-medium border-b-2 border-black dark:border-white text-black dark:text-white mr-8 whitespace-nowrap">
                Profile
              </button>
              <button className="px-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap">
                Home page
              </button>
            </div>

            <div className="space-y-10 max-w-4xl">
              
              <div>
                <h2 className="text-[15px] font-semibold mb-1">Banner image</h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">
                  This image will appear across the top of your channel.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-[280px] h-[160px] bg-[#f9f9f9] dark:bg-[#1f1f1f] rounded flex items-center justify-center flex-shrink-0">
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
                  </div>
                  <div className="flex-1 mt-2">
                    <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-4 leading-relaxed max-w-sm">
                      For the best results on all devices, use an image that's at least 2048 x 1152 pixels and 6MB or less.
                    </p>
                    <button className="text-[14px] font-medium text-[#065fd4] dark:text-[#3ea6ff] hover:bg-[#def1ff] dark:hover:bg-[#263850] px-4 py-2 rounded-full transition-colors">
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[15px] font-semibold mb-1">Picture</h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">
                  Your profile picture will appear where your channel is presented on YouTube, like next to your videos and comments.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-[280px] h-[160px] bg-[#f9f9f9] dark:bg-[#1f1f1f] rounded flex items-center justify-center flex-shrink-0">
                    <div className="w-[104px] h-[104px] rounded-full bg-[#e8710a] text-white flex items-center justify-center text-[56px] pb-2 font-normal">
                      m
                    </div>
                  </div>
                  <div className="flex-1 mt-2">
                    <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-4 leading-relaxed max-w-sm">
                      It's recommended to use a picture that's at least 98 x 98 pixels and 4MB or less. Use a PNG or GIF (no animations) file. Make sure your picture follows the YouTube Community Guidelines.
                    </p>
                    <div className="flex gap-2">
                      <button className="text-[14px] font-medium text-[#065fd4] dark:text-[#3ea6ff] hover:bg-[#def1ff] dark:hover:bg-[#263850] px-4 py-2 rounded-full transition-colors">
                        Change
                      </button>
                      <button className="text-[14px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] px-4 py-2 rounded-full transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[15px] font-semibold mb-1">Name</h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
                  Choose a channel name that represents you and your content. Changes made to your name and picture are visible only on YouTube and not other Google services. You can change your name twice in 14 days.
                </p>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full max-w-3xl px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:ring-1 focus:ring-[#065fd4] focus:border-[#065fd4] outline-none text-[15px]"
                />
              </div>

              <div>
                <h2 className="text-[15px] font-semibold mb-1">Handle</h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
                  Choose your unique handle by adding letters and numbers. You can change your handle back within 14 days.
                </p>
                <input
                  type="text"
                  name="handle"
                  value={formData.handle}
                  onChange={handleChange}
                  className="w-full max-w-3xl px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:ring-1 focus:ring-[#065fd4] focus:border-[#065fd4] outline-none text-[15px]"
                />
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-2">
                  https://www.youtube.com/{formData.handle}
                </p>
              </div>

              <div>
                <h2 className="text-[15px] font-semibold mb-1">Description</h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
                  Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places.
                </p>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full max-w-3xl px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:ring-1 focus:ring-[#065fd4] focus:border-[#065fd4] outline-none resize-y text-[15px]"
                />
              </div>

              <div>
                <button className="flex items-center gap-2 text-[14px] font-medium text-[#065fd4] dark:text-[#3ea6ff] hover:bg-[#def1ff] dark:hover:bg-[#263850] px-4 py-2 rounded-full transition-colors -ml-4">
                  <MdAdd className="w-5 h-5" />
                  Add language
                </button>
              </div>

              <div>
                <h2 className="text-[15px] font-semibold mb-1 flex items-center gap-2">
                  Channel URL
                  <span className="text-gray-500 dark:text-gray-400 text-[10px] w-[14px] h-[14px] border border-gray-500 dark:border-gray-400 rounded-full flex items-center justify-center cursor-help">?</span>
                </h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
                  This is the standard web address for your channel. It includes your unique channel ID, which is the numbers and letters at the end of the URL.
                </p>
                <div className="flex max-w-3xl">
                  <input
                    type="text"
                    readOnly
                    value="https://www.youtube.com/channel/UCsDsnj5KhXuyWfAD1d8Puvg"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l bg-gray-50 dark:bg-[#1f1f1f] text-gray-700 dark:text-gray-300 outline-none text-[14px]"
                  />
                  <button className="bg-gray-50 dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-700 border-l-0 px-4 flex items-center justify-center rounded-r hover:bg-gray-200 dark:hover:bg-[#272727] transition-colors group relative">
                    <MdContentCopy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                      Copy
                    </span>
                  </button>
                </div>
              </div>

              <div className="pb-20">
                <h2 className="text-[15px] font-semibold mb-1">Links</h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
                  Share external links with your viewers that they can find on the About page of your channel and your profile.
                </p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
