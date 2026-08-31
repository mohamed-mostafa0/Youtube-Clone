import Image from "next/image";

export default function CommentReplyForm({
  user,
  replyContent,
  setReplyContent,
  setIsReplying,
  handleReplySubmit,
  isPending
}) {
  return (
    <div className="flex gap-4 w-full mt-4 items-start">
      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative flex-shrink-0 mt-1">
        {user?.logoUrl && <Image src={user.logoUrl} alt="My Avatar" fill className="object-cover" />}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Add a reply..."
          className="w-full bg-transparent border-b border-gray-400 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 outline-none pb-1 text-sm text-gray-900 dark:text-gray-100"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setIsReplying(false);
              setReplyContent("");
            }}
            className="px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-gray-800 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleReplySubmit}
            disabled={isPending || !replyContent.trim()}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Replying..." : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
