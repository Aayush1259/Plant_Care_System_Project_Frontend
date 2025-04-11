import { useState, useEffect, useRef } from "react";
import { Send, RefreshCw, User } from "lucide-react";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { GEMINI_API_KEY, GEMINI_API_URL } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const GreenAI = () => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Green AI assistant. I can help you with plant identification, care tips, disease diagnosis, and more. What would you like to know about plants today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
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
      
      // Call the Gemini API
      const response = await fetch(`${GEMINI_API_URL}/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Green AI, a helpful assistant focused on plants, gardening, and plant care. 
                  Provide clear, accurate, and helpful information about plants, their care, growth habits, 
                  common problems, and gardening techniques. Be friendly and supportive.
                  
                  User query: ${inputText}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check for API errors
      if (data.error) {
        console.error("Gemini API error:", data.error);
        throw new Error(data.error.message || "Unknown API error");
      }
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        throw new Error("No text in response from Gemini API");
      }
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response to Firestore if user is logged in
      if (currentUser) {
        await addDoc(collection(db, "conversations"), {
          userId: currentUser.uid,
          message: aiResponse,
          timestamp: serverTimestamp(),
          sender: 'ai'
        });
      }
      
    } catch (error) {
      console.error("Gemini API error:", error);
      
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
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Green AI" />
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mt-4 mb-16 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-plant-green text-white rounded-tr-none' 
                  : 'bg-grey-100 text-grey-800 rounded-tl-none'
              }`}
            >
              {message.sender === 'user' ? (
                <div className="flex items-center mb-1 justify-end">
                  <span className="text-xs font-semibold">You</span>
                </div>
              ) : (
                <div className="flex items-center mb-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="bg-plant-green text-white text-xs">AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold">Green AI</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-grey-100 text-grey-800 rounded-lg rounded-tl-none max-w-[80%] p-3">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="bg-plant-green text-white text-xs">AI</AvatarFallback>
                </Avatar>
                <RefreshCw size={16} className="animate-spin" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 bg-white p-4 border-t border-grey-200">
        <div className="flex items-end space-x-2 max-w-md mx-auto">
          <Textarea
            placeholder="Ask about plant care, identification..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="resize-none min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            className="h-10 w-10 p-2 rounded-full bg-plant-green"
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default GreenAI;
