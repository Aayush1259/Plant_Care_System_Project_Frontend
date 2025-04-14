
// Message interface for Green AI
export const createMessage = (id, text, sender, timestamp) => ({
  id,
  text,
  sender,
  timestamp: timestamp || new Date(),
});
