import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { MdThumbUp, MdThumbDown, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { addComment, deleteComment, updateComment } from "@/app/api/services/commentServices";
import { useAuth } from "@/context/AuthContext";
import DeleteCommentModal from "./DeleteCommentModal";
import CommentEditForm from "./CommentEditForm";
import CommentReplyForm from "./CommentReplyForm";
import CommentOwnerOptions from "./CommentOwnerOptions";

export default function Comment({ comment, videoId }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = user && user._id === comment.owner?._id;

  const replyMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      setIsReplying(false);
      setReplyContent("");
    }
  });

  const editMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
    }
  });

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    replyMutation.mutate({
      videoId,
      content: replyContent,
      parentCommentId: comment._id
    });
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    editMutation.mutate({
      commentId: comment._id,
      content: editContent
    });
  };

  return (
    <div className="flex gap-4 w-full group">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative flex-shrink-0 mt-1">
        {comment.owner?.logoUrl && (
          <a href={`/${comment.owner.uniqueChannelName}`} className="block w-full h-full">
            <Image src={comment.owner.logoUrl} alt="Channel" fill className="object-cover" />
          </a>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a href={`/${comment.owner.uniqueChannelName}`}>
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              {comment.owner?.uniqueChannelName || comment.owner?.channelName || "User"}
            </span>
          </a>
          <span className="text-xs text-gray-500">
            {comment.createdAt ? 
              formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                .replace("about ", "")
                .replace("less than a minute", "a minute")
                .replace("almost ", "")
                .replace("over ", "") 
              : ""}
          </span>
        </div>

        {isEditing ? (
          <CommentEditForm
            editContent={editContent}
            setEditContent={setEditContent}
            setIsEditing={setIsEditing}
            handleEditSubmit={handleEditSubmit}
            isPending={editMutation.isPending}
            originalContent={comment.content}
          />
        ) : (
          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {!isEditing && (
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center cursor-pointer gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <MdThumbUp className="w-4 h-4" />
              <span className="text-xs font-medium">{comment.likes || 0}</span>
            </button>
            <button className="flex items-center cursor-pointer gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <MdThumbDown className="w-4 h-4" />
            </button>
            {user && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs font-medium cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#3f3f3f]"
              >
                Reply
              </button>
            )}
          </div>
        )}

        {isReplying && (
          <CommentReplyForm
            user={user}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            setIsReplying={setIsReplying}
            handleReplySubmit={handleReplySubmit}
            isPending={replyMutation.isPending}
          />
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1">
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center cursor-pointer gap-1.5 text-sm font-semibold text-blue-600 dark:text-[#3ea6ff] hover:bg-blue-50 dark:hover:bg-[#263850] px-3 py-1.5 rounded-full transition-colors"
            >
              {showReplies ? <MdKeyboardArrowUp className="w-5 h-5" /> : <MdKeyboardArrowDown className="w-5 h-5" />}
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          </div>
        )}

        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 flex flex-col gap-2 relative">
            {comment.replies.map((reply, index) => {
              const isLast = index === comment.replies.length - 1;
              return (
                <div key={reply._id} className="relative pt-2">
                  <div className="absolute top-[-4rem] -left-[2.25rem] w-[2rem] h-[6rem] border-l-1 border-b-1 border-gray-300 dark:border-[#404040] rounded-bl-xl pointer-events-none"></div>
                  
                  {!isLast && (
                    <div className="absolute top-[1.5rem] bottom-[-0.5rem] -left-[2.25rem] border-l-1 border-gray-300 dark:border-[#404040] pointer-events-none z-0"></div>
                  )}
                  
                  <div className="relative z-10">
                    <Comment comment={reply} videoId={videoId} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isOwner && !isEditing && (
        <CommentOwnerOptions
          setIsEditing={setIsEditing}
          setShowOptions={setShowOptions}
          setShowDeleteModal={setShowDeleteModal}
          showOptions={showOptions}
        />
      )}

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteCommentModal
            deleteMutation={deleteMutation}
            comment={comment}
            setShowDeleteModal={setShowDeleteModal}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
