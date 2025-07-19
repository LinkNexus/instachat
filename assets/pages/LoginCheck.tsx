import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {MessageSquare} from "lucide-react";
import {useSearchParams} from "wouter";
import {Button} from "@/components/ui/button";

export function LoginCheck() {
  const [params] = useSearchParams();

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
            <form action="/api/auth/login_check" method="POST">
              {Array.from(params.entries()).map(([key, val]) => (
                <input key={key} value={val} name={key} type="hidden" />
              ))}
              <Button type="submit" className="w-full">
               Continue to InstaChat
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
