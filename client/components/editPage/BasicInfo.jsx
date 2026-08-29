import React from 'react';
import { MdAdd } from "react-icons/md";

export default function BasicInfo({ formik }) {
  return (
    <>
      <div>
        <h2 className="text-[15px] font-semibold mb-1">Name</h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
          Choose a channel name that represents you and your content. Changes made to your name and picture are visible only on YouTube and not other Google services. You can change your name twice in 14 days.
        </p>
        <input
          type="text"
          {...formik.getFieldProps("name")}
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
          {...formik.getFieldProps("handle")}
          className="w-full max-w-3xl px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:ring-1 focus:ring-[#065fd4] focus:border-[#065fd4] outline-none text-[15px]"
        />
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-2">
          https://www.youtube.com/{formik.values.handle}
        </p>
      </div>

      <div>
        <h2 className="text-[15px] font-semibold mb-1">Description</h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3 max-w-3xl">
          Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places.
        </p>
        <textarea
          rows={5}
          {...formik.getFieldProps("description")}
          className="w-full max-w-3xl px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:ring-1 focus:ring-[#065fd4] focus:border-[#065fd4] outline-none resize-y text-[15px]"
        />
      </div>

      <div>
        <button type="button" className="flex items-center gap-2 text-[14px] font-medium text-[#065fd4] dark:text-[#3ea6ff] hover:bg-[#def1ff] dark:hover:bg-[#263850] px-4 py-2 rounded-full transition-colors -ml-4">
          <MdAdd className="w-5 h-5" />
          Add language
        </button>
      </div>
    </>
  );
}
