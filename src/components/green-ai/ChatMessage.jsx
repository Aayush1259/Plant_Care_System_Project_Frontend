
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ChatMessage = ({ message }) => {
  return (
    <div 
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
  );
};

export default ChatMessage;
