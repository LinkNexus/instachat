import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {Loader2, UserPlus} from "lucide-react";
import {useForm} from "react-hook-form";
import {Link} from "wouter";
import z from "zod";
import {useApiFetch} from "@/lib/fetch.ts";
import type {User} from "@/types.ts";
import type {FormErrors} from "@/lib/forms.ts";
import {useAppStore} from "@/lib/store.ts";
import {toast} from "sonner";

export function Register() {
  const setUser = useAppStore(state => state.setUser);
  const registrationSchema = z.object({
    name: z.string()
      .min(3, "The name must be at least 3 characters long")
      .max(255, "The name must be at most 255 characters long")
      .regex(
        /^[a-zA-Z0-9_ ]+$/,
        "Name must only contain alphanumeric characters, spaces and underscores"
      ),
    username: z.string().min(3, "The username must be at least 3 characters long")
      .max(255, "The username must be at most 255 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username must only contain alphanumeric characters and underscores"
      ),
    email: z.string().email({error: (iss) => `The email ${iss.input} is not a valid email address.`}),
    password: z.string()
  });

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const {
    loading,
    callback: register,
  } = useApiFetch<User, FormErrors>("/api/auth/register", {
    method: "POST",
    onError: (err) => {
      err.data.violations.forEach(v => {
        form.setError(v.propertyPath as keyof z.infer<typeof registrationSchema>, {
          type: "manual",
          message: v.title
        });
      })
    },
    onSuccess: (user) => {
      toast.success("A verification email has been sent to your inbox. Please check your email to verify your account.", {
        closeButton: true,
      });

      setUser(user);
    }
  });

  return (
    <>
      {/* Main Register Card */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Join thousands of users connecting securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(register)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="john_doe" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@doe.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2"/>
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <Separator/>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login">
                  <Button variant="link" className="p-0 h-auto font-medium">
                    Sign in
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
