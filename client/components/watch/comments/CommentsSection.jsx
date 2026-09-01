import { useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getCommentsByVideo, addComment } from "@/app/api/services/commentServices";
import { useAuth } from "@/context/AuthContext";
import Comment from "./Comment";
import CommentSectionLoading from "./CommentSectionLoading";

export default function CommentsSection({ videoId, commentsAllow }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState("");

  const { ref, inView } = useInView();

  const { 
    data: commentsResponse, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["comments", videoId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getCommentsByVideo(videoId, pageParam);      
      return res.data;
    },
    getNextPageParam: (lastPage , allPages) =>{
      // console.log("lastPage",lastPage)
      // console.log("nextPage",lastPage.nextPage)
      // console.log("allPages",allPages)  
      return lastPage.nextPage
    } ,
    maxPages:50,
    enabled: !!videoId && commentsAllow !== false,
  });
  // console.log("commentsResponse",commentsResponse?.pages);
  console.log("commentsResponse",commentsResponse);
  

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      setCommentContent("");
    }
  });

  const handleCommentSubmit = () => {
    if (!commentContent.trim()) return;
    addMutation.mutate({
      videoId,
      content: commentContent,
    });
  };

  if (commentsAllow === false) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#3f3f3f] text-center">
        <p className="text-gray-500 dark:text-gray-400">Comments are turned off.</p>
      </div>
    );
  }

  const comments = commentsResponse?.pages.flatMap((page) => page.comments) || [];
  // console.log(comments);
  
  const totalCommentsCount = commentsResponse?.pages[0]?.commentsCount || 0;

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#3f3f3f]">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {totalCommentsCount} Comments
      </h3>

      {user ? (
        <div className="flex gap-4 mb-8 items-start">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative flex-shrink-0 mt-1">
            {user.logoUrl && <Image src={user.logoUrl} alt="My Avatar" fill className="object-cover" />}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-gray-400 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-100 outline-none pb-1 text-sm text-gray-900 dark:text-gray-100 transition-colors"
            />
            {commentContent.trim() && (
              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={() => setCommentContent("")}
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-gray-800 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  disabled={addMutation.isPending}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addMutation.isPending ? "Commenting..." : "Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-[#202020] rounded-xl border border-gray-200 dark:border-[#3f3f3f] text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Please log in to add a comment.</p>
        </div>
      )}

      {isLoading ? (
        <CommentSectionLoading />
      ) : error ? (
        <div className="text-center py-4 text-red-500 text-sm">
          Failed to load comments.
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} videoId={videoId} />
          ))}

          <div ref={ref} className="w-full flex justify-center py-4">
            {isFetchingNextPage ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
            ) : hasNextPage ? (
              <span className="text-sm text-gray-500">Scroll for more</span>
            ) : (
              <span className="text-sm text-gray-500">No more comments</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
