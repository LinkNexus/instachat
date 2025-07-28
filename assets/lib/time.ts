import {useRef} from "react";

export const formatMessageTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

export const useThrottle = (callback: (...args: any[]) => void, delay: number) => {
  const lastExecuted = useRef(Date.now());
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastExecuted.current >= delay) {
      callback(...args);
      lastExecuted.current = now;
    }
  }
}
