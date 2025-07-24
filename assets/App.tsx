import {Redirect, Route, Switch} from "wouter";
import {Home} from "@/pages/Home.tsx";
import {Login} from "@/pages/Auth/Login.tsx";
import {Toaster} from "sonner";
import {Register} from "@/pages/Auth/Register.tsx";
import {useFlashMessages} from "@/lib/flash-messages.ts";
import {useAppStore} from "@/lib/store.ts";
import {Navigation} from "@/components/Navigation.tsx";
import {EmailVerificationBanner} from "@/components/EmailVerificationBanner.tsx";
import {Friends} from "@/pages/Friends.tsx";
import {Settings} from "@/pages/Settings.tsx";
import {MessageSquare} from "lucide-react";
import {ForgotPassword} from "@/pages/Auth/ForgotPassword.tsx";
import {ResetPassword} from "@/pages/Auth/ResetPassword.tsx";
import {Contacts} from "@/pages/Contacts.tsx";
import {ChatLayout} from "@/pages/Chat/Layout.tsx";
import {Chats} from "@/pages/Chat/Chats.tsx";
import {Discussion} from "@/pages/Chat/Discussion.tsx";
import {useTheme} from "@/lib/theme.ts";
import {useMessages} from "@/lib/messages.ts";

export default function App() {
  useFlashMessages();
  useTheme();
  useMessages();

  const {user} = useAppStore(state => state);

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
            <Route path="/chat" nest>
              <ChatLayout>
                <Route path="/" component={Chats}/>
                <Route path="/friends/:id" component={Discussion}/>
              </ChatLayout>
            </Route>
            <Route path="/friends" component={Friends}/>
            <Route path="/settings" component={Settings}/>
            <Route path="/contacts" component={Contacts}/>
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
              <Route path="/forgot-password" component={ForgotPassword}/>
              <Route path="/reset-password" component={ResetPassword}/>
              <Route component={() => <Redirect to="/login"/>}/>
            </Switch>
          </div>
        </div>
      )}

      <Toaster/>
    </div>
  );
}
