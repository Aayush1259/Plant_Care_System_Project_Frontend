
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useGreenAI() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message to the chat
    const userMessage = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulated AI response - in a real app, this would call an API
      setTimeout(() => {
        const aiResponse = {
          id: uuidv4(),
          text: getAIResponse(text),
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
}

// Simple function to generate responses based on keywords
// In a real app, this would be replaced with an actual API call
function getAIResponse(userMessage) {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (lowerCaseMessage.includes('water') || lowerCaseMessage.includes('watering')) {
    return "Most houseplants should be watered when the top inch of soil feels dry to the touch. Succulents and cacti need less frequent watering, while tropical plants typically need more consistent moisture. Always check the specific needs of your plant species.";
  }
  
  if (lowerCaseMessage.includes('light') || lowerCaseMessage.includes('sunlight')) {
    return "Light requirements vary by plant. Most houseplants prefer bright, indirect light. Direct sunlight can burn many indoor plants, while insufficient light can lead to leggy growth and poor health. South and west-facing windows typically provide the most light.";
  }
  
  if (lowerCaseMessage.includes('fertilize') || lowerCaseMessage.includes('feed')) {
    return "Most houseplants benefit from fertilization during the growing season (spring and summer). Use a balanced, water-soluble fertilizer at half the recommended strength every 4-6 weeks. Reduce or eliminate fertilization during fall and winter when plant growth naturally slows.";
  }
  
  if (lowerCaseMessage.includes('identify') || lowerCaseMessage.includes('what plant')) {
    return "To identify a plant, I'd need to see an image. You can use the Plant ID feature in the app to upload a photo of your plant for identification. Look for characteristics like leaf shape, growth pattern, and any flowers or fruits to help with identification.";
  }
  
  if (lowerCaseMessage.includes('yellow') || lowerCaseMessage.includes('yellowing')) {
    return "Yellowing leaves can indicate several issues: overwatering, underwatering, nutrient deficiencies, or natural aging. Check if the soil is too wet or too dry, and ensure your plant is getting proper light. If only lower leaves are yellowing, it might be normal leaf senescence.";
  }
  
  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    return "Hello! I'm Green AI, your plant care assistant. I can help with plant identification, care tips, troubleshooting problems, and general gardening advice. What would you like to know about your plants today?";
  }
  
  // Default response
  return "That's an interesting question about plants. For specific plant identification, try the Plant ID feature. For disease diagnosis, use the Plant Disease feature. I can also provide general care tips for common houseplants if you tell me which ones you have!";
}
