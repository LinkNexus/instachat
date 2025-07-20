import {apiFetch} from "@/lib/fetch";
import {useEffect, useRef} from "react";
import {toast} from "sonner";

export function useFlashMessages() {
  const hasBeenDisplayed = useRef(false);

  useEffect(() => {
    if (!hasBeenDisplayed.current) {
      displayFlashMessages();
      hasBeenDisplayed.current = true;
    }
  }, []);
}

type FlashMessages = {
  success: string[];
  error: string[];
  info: string[];
};

export function displayFlashMessages() {
  apiFetch<FlashMessages>("/api/flash-messages", {
    "method": "GET",
  })
    .then(flashMessages => {
      Object.entries(flashMessages).forEach(([type, messages]) => {
        (messages as string[]).forEach(message => {
          if (type === "success") {
            toast.success(message, { closeButton: true });
          } else if (type === "error") {
            toast.error(message, { closeButton: true });
          } else if (type === "info") {
            toast.info(message, { closeButton: true });
          }
        });
      })
    });
}
