export const formatMessageTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};
