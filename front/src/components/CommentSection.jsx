import { useState } from 'react';
import { FiMessageSquare, FiCornerDownRight, FiSend, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';

function CommentSection({ blogId, comments }) {
  const { isAuthenticated, user } = useAuth();
  const { addComment, addReply, loading } = useBlog();
  const [commentText, setCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await addComment(blogId, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Comment submission error:', error);
    }
  };
  
  const handleReplySubmit = async (commentId, e) => {
    e.preventDefault();
    if (!replyTexts[commentId]?.trim()) return;
    
    try {
      await addReply(blogId, commentId, replyTexts[commentId]);
      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
      setReplyingTo(null);
    } catch (error) {
      console.error('Reply submission error:', error);
    }
  };
  
  const toggleReplyForm = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setActiveComment(activeComment === commentId ? null : commentId);
    if (!replyTexts[commentId]) {
      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleReplyTextChange = (commentId, value) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: value }));
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-8 flex items-center text-gray-800">
        <FiMessageSquare className="mr-3 text-blue-600" />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discussion ({comments?.length || 0})
        </span>
      </h3>
      
      {isAuthenticated && (
        <form onSubmit={handleCommentSubmit} className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-start space-x-4">
            {user?.profileImage ? (
              <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                <img 
                  src={`${import.meta.env.VITE_BACKEND_PATH}${user.profileImage}`} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <span class="text-xl font-semibold text-blue-600">
                          ${user.name?.charAt(0)?.toUpperCase() || ''}
                        </span>
                      </div>
                    `;
                  }}
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md">
                <FiUser className="h-6 w-6 text-blue-600" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 min-h-[120px]"
                  required
                />
                <button 
                  type="submit" 
                  className={`absolute right-3 bottom-3 p-2 rounded-full ${
                    commentText.trim() 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition-all duration-200 shadow-md`}
                  disabled={loading || !commentText.trim()}
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
              <div className="text-right mt-1 text-xs text-gray-500">
                {commentText.length}/500
              </div>
            </div>
          </div>
        </form>
      )}
      
      {/* Comments list */}
      <div className="space-y-6">
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <div 
              key={comment._id} 
              className={`bg-white p-5 rounded-xl shadow-sm transition-all duration-200 ${
                activeComment === comment._id ? 'ring-2 ring-blue-200' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                {comment.user?.profileImage ? (
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                    <img 
                      src={`${import.meta.env.VITE_BACKEND_PATH}${comment.user.profileImage}`} 
                      alt={comment.user.name} 
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                            <span class="text-xl font-semibold text-blue-600">
                              ${comment.user.name?.charAt(0)?.toUpperCase() || ''}
                            </span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                    <span className="text-blue-600 font-semibold">
                      {comment.user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-gray-800">{comment.user?.name}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  
                  {isAuthenticated && (
                    <button 
                      className={`text-sm mt-3 flex items-center px-3 py-1 rounded-full transition-all duration-200 ${
                        replyingTo === comment._id 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => toggleReplyForm(comment._id)}
                    >
                      <FiCornerDownRight className="mr-2" />
                      {replyingTo === comment._id ? 'Cancel' : 'Reply'}
                    </button>
                  )}
                  
                  {/* Reply form */}
                  {isAuthenticated && replyingTo === comment._id && (
                    <form 
                      onSubmit={(e) => handleReplySubmit(comment._id, e)} 
                      className="mt-4 ml-3 pl-4 border-l-2 border-blue-200"
                    >
                      <div className="flex items-start space-x-3">
                        {user?.profileImage ? (
                          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                            <img 
                              src={`${import.meta.env.VITE_BACKEND_PATH}${user.profileImage}`} 
                              alt={user.name} 
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                  <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                    <span class="text-xl font-semibold text-blue-600">
                                      ${user.name?.charAt(0)?.toUpperCase() || ''}
                                    </span>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                            <span className="text-blue-600 text-xs font-semibold">
                              {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="relative">
                            <textarea
                              value={replyTexts[comment._id] || ''}
                              onChange={(e) => handleReplyTextChange(comment._id, e.target.value)}
                              placeholder="Write your reply..."
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 min-h-[80px]"
                              required
                            />
                            <button 
                              type="submit" 
                              className={`absolute right-2 bottom-2 p-1.5 rounded-full ${
                                replyTexts[comment._id]?.trim()
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              } transition-all duration-200 shadow-sm`}
                              disabled={loading || !replyTexts[comment._id]?.trim()}
                            >
                              <FiSend className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                  
                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="mt-5 space-y-4 ml-6 pl-4 border-l-2 border-blue-100">
                      {comment.replies.map((reply) => (
                        <div 
                          key={reply._id} 
                          className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-150"
                        >
                          {reply.user?.profileImage ? (
                            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                              <img 
                                src={`${import.meta.env.VITE_BACKEND_PATH}${reply.user.profileImage}`} 
                                alt={reply.user.name} 
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                      <span class="text-xl font-semibold text-blue-600">
                                        ${reply.user.name?.charAt(0)?.toUpperCase() || ''}
                                      </span>
                                    </div>
                                  `;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                              <span className="text-blue-600 text-xs font-semibold">
                                {reply.user?.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h5 className="font-semibold text-gray-800 text-sm">{reply.user?.name}</h5>
                              <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <FiMessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">No comments yet</h4>
            <p className="text-gray-600 max-w-md mx-auto">
              Be the first to share what you think about this post!
            </p>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-3">
                Sign in to leave a comment
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;