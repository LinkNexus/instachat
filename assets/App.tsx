import {Redirect, Route, Switch} from "wouter";
import {Home} from "@/pages/Home.tsx";
import {Login} from "@/pages/Auth/Login.tsx";
import {Toaster} from "sonner";
import {Register} from "@/pages/Auth/Register.tsx";
import {useFlashMessages} from "@/lib/flash-messages.ts";
import {useAppStore} from "@/lib/store.ts";
import {useEffect} from "react";
import {Navigation} from "@/components/Navigation.tsx";
import {EmailVerificationBanner} from "@/components/EmailVerificationBanner.tsx";
import {Chat} from "@/pages/Chat.tsx";
import {Friends} from "@/pages/Friends.tsx";
import {Settings} from "@/pages/Settings.tsx";
import {MessageSquare} from "lucide-react";
import {ForgotPassword} from "@/pages/Auth/ForgotPassword.tsx";
import {ResetPassword} from "@/pages/Auth/ResetPassword.tsx";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Route path="/" component={Home}/>

      {user ? (
        <>
          <Navigation user={user}/>
          {!user.isVerified && (
            <EmailVerificationBanner user={user}/>
          )}
          <Switch>
            <Route path="/chat" component={Chat}/>
            <Route path="/friends" component={Friends}/>
            <Route path="/settings" component={Settings}/>
            <Route component={() => <Redirect to="/chat"/>}/>
          </Switch>
        </>
      ) : (
        <div
          className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary-foreground"/>
                </div>
                <span className="text-2xl font-bold">InstaChat</span>
              </div>
            </div>
            <Switch>
              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route component={() => <Redirect to="/login"/>}/>
            </Switch>
          </div>
        </div>
      )}

      <Toaster/>
    </div>
  );
}
