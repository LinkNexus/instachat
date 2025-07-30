import {useRef} from "react";

export const formatMessageTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatLastSeen = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) { // Less than 24 hours
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else if (diff < 604800000) { // Less than 7 days
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export function useThrottle<T extends Function>(callback: T, delay: number) {
  const lastExecuted = useRef(Date.now());
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastExecuted.current >= delay) {
      callback(...args);
      lastExecuted.current = now;
    }
  }) as unknown as T;
}
