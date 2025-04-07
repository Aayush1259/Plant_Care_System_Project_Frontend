
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditProfile = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile?.name || "",
      bio: userProfile?.bio || "",
    },
  });
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateUserProfile({
        name: data.name,
        bio: data.bio,
      }, imageFile || undefined);
      
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };
  
  return (
    <div className="page-container pb-6 animate-fade-in">
      <Header title="Edit Profile" showBack />
      
      <div className="max-w-md mx-auto mt-6">
        <div className="flex justify-center mb-6">
          <div className="relative" onClick={handleImageClick}>
            <Avatar className="h-24 w-24 cursor-pointer">
              <AvatarImage 
                src={selectedImage || userProfile?.photoURL} 
                alt={userProfile?.name} 
              />
              <AvatarFallback className="text-xl bg-plant-green text-white">
                {userProfile?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-plant-green rounded-full p-1">
              <Camera size={16} className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself" 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-plant-green"
                disabled={form.formState.isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
