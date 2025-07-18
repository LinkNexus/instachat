import {Route} from "wouter";
import {Home} from "@/pages/Home.tsx";
import {Login} from "@/pages/Login.tsx";
import {Toaster} from "sonner";
import {Register} from "@/pages/Register.tsx";
import {LoginCheck} from "@/pages/LoginCheck.tsx";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col spacey-4">
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login-check" component={LoginCheck} />

      <Toaster />
    </div>
  );
}
