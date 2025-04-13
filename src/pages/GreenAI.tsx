
import PageLayout from "@/components/PageLayout";
import ChatMessageList from "@/components/green-ai/ChatMessageList";
import MessageInput from "@/components/green-ai/MessageInput";
import { useGreenAI } from "@/hooks/use-green-ai";

const GreenAI = () => {
  const { messages, isLoading, sendMessage } = useGreenAI();
  
  return (
    <PageLayout title="Green AI">
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
    </PageLayout>
  );
};

export default GreenAI;
