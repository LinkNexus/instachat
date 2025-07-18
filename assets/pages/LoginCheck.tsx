import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {apiFetch} from "@/lib/fetch";
import {type User} from "@/types";
import {MessageSquare} from "lucide-react";
import {toast} from "sonner";
import {Link, useSearchParams} from "wouter";
import {useAppStore} from "@/lib/store.ts";

export function LoginCheck() {
  const [params] = useSearchParams();
  const setUser = useAppStore(state => state.setUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">InstaChat</span>
          </div>
        </div>

        {/* Main Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Just one more step!</CardTitle>
            <CardDescription>
              Click on the following button to complete your sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                const formData = new FormData();

                Array.from(params.entries()).forEach(([key, value]) => {
                  formData.append(key, value);
                });

                apiFetch<User>("/api/auth/login_check", {
                  method: "POST",
                  data: formData
                }).then(setUser)
                  .catch(() => {
                    toast.error(
                      <>
                        An error occured during login, try again <Link href="/login">here</Link>
                      </>
                    );
                  });
              }}
              className="w-full"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
