
import { useState } from "react";
import { MessageSquare, Heart, Share2, Plus } from "lucide-react";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      username: "PlantLover",
      userAvatar: "",
      content: "Just repotted my Monstera and it's thriving! Any tips for helping it grow even better?",
      image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
      likes: 24,
      comments: 5,
      time: "2h ago",
      liked: false
    },
    {
      id: "2",
      username: "GreenThumb",
      userAvatar: "",
      content: "Does anyone know what's causing these yellow spots on my fiddle leaf fig?",
      image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
      likes: 8,
      comments: 12,
      time: "4h ago",
      liked: true
    },
    {
      id: "3",
      username: "BotanyExpert",
      userAvatar: "",
      content: "Just started my indoor herb garden! Can anyone suggest good companion plants?",
      likes: 15,
      comments: 7,
      time: "6h ago",
      liked: false
    }
  ]);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Green Community" />
      
      {/* Create Post Button */}
      <div className="my-4">
        <Button className="w-full bg-plant-green flex items-center justify-center gap-2">
          <Plus size={18} />
          Create New Post
        </Button>
      </div>
      
      {/* Posts List */}
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
                <p className="text-xs text-grey-500">{post.time}</p>
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
                />
              </div>
            )}
            
            {/* Post Actions */}
            <div className="flex items-center p-3 border-t border-grey-200">
              <button 
                className={`flex items-center mr-4 ${post.liked ? 'text-red-500' : 'text-grey-500'}`}
                onClick={() => toggleLike(post.id)}
              >
                <Heart size={18} className={`${post.liked ? 'fill-red-500' : ''}`} />
                <span className="text-xs ml-1">{post.likes}</span>
              </button>
              <button className="flex items-center mr-4 text-grey-500">
                <MessageSquare size={18} />
                <span className="text-xs ml-1">{post.comments}</span>
              </button>
              <button className="flex items-center text-grey-500">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Community;
