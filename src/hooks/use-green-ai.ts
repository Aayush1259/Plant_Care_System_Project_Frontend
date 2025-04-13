
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useToast } from "@/components/ui/use-toast";
import { handlePlantCareAdvice } from "@/api/plant-api";
import { Message } from "@/components/green-ai/types";
import { useAuth } from "@/contexts/AuthContext";

export const useGreenAI = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Green AI assistant. I can help you with plant identification, care tips, disease diagnosis, and more. What would you like to know about plants today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Save the conversation to Firestore if user is logged in
      if (currentUser) {
        await addDoc(collection(db, "conversations"), {
          userId: currentUser.uid,
          message: inputText,
          timestamp: serverTimestamp(),
          sender: 'user'
        });
      }
      
      // Use the AI assistant API
      const response = await handlePlantCareAdvice(inputText);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to get response");
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response.answer || "I'm sorry, I couldn't generate a response.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response to Firestore if user is logged in
      if (currentUser) {
        await addDoc(collection(db, "conversations"), {
          userId: currentUser.uid,
          message: aiMessage.text,
          timestamp: serverTimestamp(),
          sender: 'ai'
        });
      }
      
      // If fertilizer recommendations are available, show them
      if (response.fertilizerRecommendations && response.fertilizerRecommendations.length > 0) {
        const fertilizerText = "Here are some fertilizer recommendations based on your question:\n\n" + 
          response.fertilizerRecommendations.map(rec => `• ${rec}`).join('\n');
        
        const fertilizerMessage: Message = {
          id: Date.now().toString() + '-fertilizer',
          text: fertilizerText,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, fertilizerMessage]);
        
        // Save fertilizer message to Firestore if user is logged in
        if (currentUser) {
          await addDoc(collection(db, "conversations"), {
            userId: currentUser.uid,
            message: fertilizerText,
            timestamp: serverTimestamp(),
            sender: 'ai'
          });
        }
      }
      
    } catch (error) {
      console.error("AI response error:", error);
      
      toast({
        title: "Error",
        description: "Failed to get a response from AI. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};
