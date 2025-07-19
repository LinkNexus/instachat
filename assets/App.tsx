import {Redirect, Route, Switch} from "wouter";
import {Home} from "@/pages/Home.tsx";
import {Login} from "@/pages/Login.tsx";
import {Toaster} from "sonner";
import {Register} from "@/pages/Register.tsx";
import {useFlashMessages} from "@/lib/flash-messages.ts";
import {useAppStore} from "@/lib/store.ts";
import {useEffect} from "react";
import {Navigation} from "@/components/Navigation.tsx";
import {EmailVerificationBanner} from "@/components/EmailVerificationBanner.tsx";

export default function App() {
  useFlashMessages();

  const {user, theme} = useAppStore(state => state);

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return;
    }

    root.classList.add(theme)
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col space-y-4">
      <Switch>
        <Route path="/" component={Home}/>
        {user ? (
          <>
            <Navigation />
            <EmailVerificationBanner user={user} />
            <Route component={() => <Redirect to="/chat" />}/>
          </>
        ) : (
          <>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route component={() => <Redirect to="/login" />}/>
          </>
        )}
      </Switch>

      <Toaster/>
    </div>
  );
}
