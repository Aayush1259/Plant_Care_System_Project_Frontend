
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, Heart, Share2, Plus, Send, X, Loader2, 
  Camera, ImagePlus
} from "lucide-react";
import { 
  collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp,
  query, orderBy, Timestamp, onSnapshot, increment
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/config";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userAvatar: string;
  userName: string;
  content: string;
  timestamp: Timestamp;
}

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: Timestamp;
  liked: boolean;
}

const Community = () => {
  const { currentUser, userProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const postData: Post[] = [];
          
          for (const doc of snapshot.docs) {
            const post = doc.data() as Omit<Post, 'id' | 'comments' | 'liked'>;
            
            // Check if the current user has liked this post
            let isLiked = false;
            if (currentUser) {
              const likesRef = collection(db, `posts/${doc.id}/likes`);
              const userLikeQuery = query(likesRef);
              const userLikes = await getDocs(userLikeQuery);
              isLiked = userLikes.docs.some(doc => doc.id === currentUser.uid);
            }
            
            postData.push({
              id: doc.id,
              ...post,
              comments: [],
              timestamp: post.timestamp as Timestamp,
              liked: isLiked,
            });
          }
          
          setPosts(postData);
          setIsLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
        toast.error("Failed to load posts");
      }
    };
    
    fetchPosts();
  }, [currentUser]);
  
  // Create a new post
  const handleCreatePost = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    if (!newPostContent.trim() && !postImage) {
      toast.error("Please add some content or an image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = "";
      
      // Upload image if exists
      if (postImage) {
        const storageRef = ref(storage, `post_images/${Date.now()}_${postImage.name}`);
        await uploadBytes(storageRef, postImage);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // Add post to Firestore
      await addDoc(collection(db, "posts"), {
        userId: currentUser.uid,
        username: userProfile?.name || "Anonymous",
        userAvatar: userProfile?.photoURL || "",
        content: newPostContent,
        image: imageUrl,
        likes: 0,
        timestamp: serverTimestamp(),
      });
      
      // If user has a profile in Firestore, increment postsCount
      if (userProfile) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          postsCount: increment(1)
        });
      }
      
      setNewPostContent("");
      setPostImage(null);
      setImagePreview(null);
      setCreateDialogOpen(false);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle like on a post
  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const postRef = doc(db, "posts", postId);
      const likeRef = doc(db, `posts/${postId}/likes`, currentUser.uid);
      
      if (isLiked) {
        // Unlike post
        await deleteDoc(likeRef);
        await updateDoc(postRef, {
          likes: increment(-1)
        });
      } else {
        // Like post
        await setDoc(likeRef, {
          userId: currentUser.uid,
          timestamp: serverTimestamp()
        });
        await updateDoc(postRef, {
          likes: increment(1)
        });
      }
      
      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            liked: !isLiked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };
  
  // Open comment dialog and load comments
  const openCommentDialog = async (postId: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    setSelectedPostId(postId);
    setCommentDialogOpen(true);
    setCommentsLoading(true);
    
    try {
      const q = query(
        collection(db, `posts/${postId}/comments`), 
        orderBy("timestamp", "asc")
      );
      
      const snapshot = await getDocs(q);
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      // Update posts with comments
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: commentsData
          };
        }
        return post;
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };
  
  // Add a new comment
  const handleAddComment = async () => {
    if (!currentUser || !selectedPostId || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Add comment to Firestore
      const commentRef = await addDoc(collection(db, `posts/${selectedPostId}/comments`), {
        postId: selectedPostId,
        userId: currentUser.uid,
        userName: userProfile?.name || "Anonymous",
        userAvatar: userProfile?.photoURL || "",
        content: newComment,
        timestamp: serverTimestamp(),
      });
      
      // Get the comment with ID
      const newCommentObj: Comment = {
        id: commentRef.id,
        postId: selectedPostId,
        userId: currentUser.uid,
        userName: userProfile?.name || "Anonymous",
        userAvatar: userProfile?.photoURL || "",
        content: newComment,
        timestamp: Timestamp.now(),
      };
      
      // Update posts with the new comment
      setPosts(posts.map(post => {
        if (post.id === selectedPostId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj]
          };
        }
        return post;
      }));
      
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Share post
  const handleSharePost = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this plant post!',
          text: post.content,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(
          `${post.username} shared: ${post.content} - Check it out at ${window.location.href}`
        );
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share post");
    }
  };
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // Format timestamp
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const date = timestamp.toDate();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHrs = Math.round(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    
    const diffDays = Math.round(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Green Community" />
      
      {/* Create Post Button */}
      <div className="my-4">
        <Button 
          className="w-full bg-plant-green flex items-center justify-center gap-2"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus size={18} />
          Create New Post
        </Button>
      </div>
      
      {/* Posts List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-plant-green animate-spin" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6 mt-4">
          {posts.map(post => (
            <div key={post.id} className="border border-grey-200 rounded-lg overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center p-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.userAvatar} alt={post.username} />
                  <AvatarFallback>{post.username[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <p className="text-sm font-medium">{post.username}</p>
                  <p className="text-xs text-grey-500">
                    {formatDate(post.timestamp)}
                  </p>
                </div>
              </div>
              
              {/* Post Content */}
              <div className="p-3 pt-0">
                <p className="text-sm">{post.content}</p>
              </div>
              
              {/* Post Image (if exists) */}
              {post.image && (
                <div className="w-full aspect-square">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Post Actions */}
              <div className="flex items-center p-3 border-t border-grey-200">
                <button 
                  className={`flex items-center mr-4 ${post.liked ? 'text-red-500' : 'text-grey-500'}`}
                  onClick={() => toggleLike(post.id, post.liked)}
                >
                  <Heart size={18} className={`${post.liked ? 'fill-red-500' : ''}`} />
                  <span className="text-xs ml-1">{post.likes}</span>
                </button>
                <button 
                  className="flex items-center mr-4 text-grey-500"
                  onClick={() => openCommentDialog(post.id)}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs ml-1">{post.comments.length}</span>
                </button>
                <button 
                  className="flex items-center text-grey-500"
                  onClick={() => handleSharePost(post)}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No posts yet. Be the first to share!</p>
        </div>
      )}
      
      {/* Create Post Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Create Post</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCreateDialogOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <Textarea 
              placeholder="What's on your mind about plants today?" 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-32 resize-none"
            />
            
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => {
                    setImagePreview(null);
                    setPostImage(null);
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <div className="flex items-center gap-1 text-plant-green">
                  <ImagePlus size={18} />
                  <span className="text-sm">Add Image</span>
                </div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            <Button 
              className="w-full bg-plant-green" 
              onClick={handleCreatePost}
              disabled={isSubmitting || (!newPostContent.trim() && !postImage)}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting</>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Comments Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Comments</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCommentDialogOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
          
          {commentsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-plant-green" />
            </div>
          ) : selectedPostId && (
            <>
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {posts.find(p => p.id === selectedPostId)?.comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">No comments yet. Be the first to comment!</p>
                ) : (
                  posts.find(p => p.id === selectedPostId)?.comments.map(comment => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                        <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-100 p-2 rounded-lg">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{comment.userName}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.photoURL} alt={userProfile?.name} />
                    <AvatarFallback>{userProfile?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input 
                      placeholder="Add a comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                    />
                    <Button 
                      size="icon" 
                      className="bg-plant-green"
                      disabled={isSubmitting || !newComment.trim()}
                      onClick={handleAddComment}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <BottomNavbar />
    </div>
  );
};

export default Community;
