
import { useState } from "react";
import { Send, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const GreenAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Green AI assistant. I can help you with plant identification, care tips, disease diagnosis, and more. What would you like to know about plants today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = () => {
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
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your description, that sounds like a Monstera Deliciosa. They prefer bright, indirect light and moderate watering.",
        "To keep your plants healthy during winter, reduce watering frequency and ensure they get enough light. Consider using a humidifier if your home is dry.",
        "For organic pest control, try a mixture of neem oil, water, and a drop of dish soap. Spray on affected areas weekly.",
        "The yellow leaves might indicate overwatering. Let the soil dry out between waterings and ensure good drainage."
      ];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
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
              {message.sender === 'ai' && (
                <div className="flex items-center mb-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="/ai-avatar.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold">Green AI</span>
                </div>
              )}
              <p className="text-sm">{message.text}</p>
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
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <RefreshCw size={16} className="animate-spin" />
              </div>
            </div>
          </div>
        )}
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
