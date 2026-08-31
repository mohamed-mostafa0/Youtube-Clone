export default function CommentEditForm({
  editContent,
  setEditContent,
  setIsEditing,
  handleEditSubmit,
  isPending,
  originalContent
}) {
  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <input
        type="text"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        placeholder="Update your comment..."
        className="w-full bg-transparent border-b border-gray-400 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 outline-none pb-1 text-sm text-gray-900 dark:text-gray-100"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setIsEditing(false);
            setEditContent(originalContent);
          }}
          className="px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-gray-800 dark:text-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSubmit}
          disabled={isPending || !editContent.trim()}
          className="px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
