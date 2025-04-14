
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
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
              handleSend();
            }
          }}
        />
        <Button 
          className="h-10 w-10 p-2 rounded-full bg-plant-green"
          onClick={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
