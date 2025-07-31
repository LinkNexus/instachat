export function notify({title, body, events = {}}: {
  title: string;
  body: string;
  events?: {
    onClick?: (e: Event) => void;
    onClose?: (e: Event) => void;
  }
}) {
  let notification: Notification | null = null;

  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      notification = new Notification(title, {
        body,
        icon: "/favicon/favicon.svg"
      })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          notification = new Notification(title, {
            body,
            icon: "/favicon/favicon.svg"
          });
        }
      });
    }
  }

  if (notification) {
    notification.addEventListener("click", (e) => {
      if (events.onClick) {
        events.onClick(e);
      }
    });
    notification.addEventListener("close", (e) => {
      if (events.onClose) {
        events.onClose(e);
      }
    });
  }
}
