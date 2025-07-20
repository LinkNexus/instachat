import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useApiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoaderIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {Link} from "wouter";
import z from "zod";
import type {User} from "@/types.ts";

export function Login() {
  const setUser = useAppStore(state => state.setUser);
  const {
    loading: pending,
    callback: login
  } = useApiFetch<User, { message: string }>("/api/auth/login", {
    method: "POST",
    onError: (err) => {
      toast.error(err.data.message, {
        closeButton: true,
      });
    },
    onSuccess: setUser
  });

  const loginSchema = z.object({
    identifier: z.string(),
    password: z.string(),
    _remember_me: z.boolean().optional()
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      _remember_me: false
    }
  });

  return (
    <>
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
            <form onSubmit={form.handleSubmit(login)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email Address or Username</FormLabel>
                    <FormControl>
                      <Input disabled={pending} placeholder="test@example.com" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Password
                      <Link href="/forgot-password"
                            className="hover:text-primary hover:underline hover:underline-offset-2 text-xs">Forgot
                        password?</Link>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={pending}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="_remember_me"
                render={({field}) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={pending}
                      />
                    </FormControl>
                    <FormLabel>Remember Me</FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={pending}
              >
                {pending && <LoaderIcon className="animate-spin"/>}
                {pending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <Separator/>
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
    </>
  );
}
