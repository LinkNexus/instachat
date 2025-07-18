import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {useApiFetch} from "@/lib/fetch";
import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowLeft, CheckCircle, Loader2, Mail, MessageSquare} from "lucide-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {Link} from "wouter";
import z from "zod";

export function Login() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  console.log(window.user);

  const {
    loading: pending,
    callback: login
  } = useApiFetch("/api/auth/login", {
    method: "POST",
    onError: () => {
      toast.error("Failed to send magic link. Please try again.", {
        closeButton: true,
        action: {
          label: "Retry",
          onClick: async () => await login({ email })
        }
      });
    },
    onSuccess: () => setEmailSent(true)
  });

  const loginSchema = z.object({
    email: z.string().email("Invalid email address")
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: ""
    }
  });

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a magic link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Click the link in your email to sign in. The link will expire in 10 minutes.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder.
              </p>

              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={() => login({ email })} disabled={pending}>
                  Send Another Link
                </Button>
                <Button onClick={() => setEmailSent(false)} variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account with just your email
            </CardDescription>
          </CardHeader>
          <CardContent>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(async (values) => {
                setEmail(values.email);
                await login(values);
              })} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input disabled={pending} placeholder="test@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending}
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Magic Link...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <Separator />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register">
                    <Button variant="link" className="p-0 h-auto font-medium">
                      Sign up
                    </Button>
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
