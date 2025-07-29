import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input";
import {useApiFetch} from "@/lib/fetch.ts";
import type {FormErrors} from "@/lib/forms.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {useLocation} from "wouter";
import z from "zod";

export function ResetPassword() {
  const [_, redirect] = useLocation();
  const resetPasswordSchema = z.object({
    password: z.string(),
    confirmPassword: z.string(),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    loading: pending,
    callback: resetPassword
  } = useApiFetch<null, { error: string } | FormErrors>("/api/auth/reset-password/reset", {
    method: "POST",
    onSuccess: () => {
      toast.success("Password has been reset successfully", {
        closeButton: true,
      });
      redirect("/login");
    },
    onError: (err) => {
      if ("violations" in err.data && Array.isArray((err.data as FormErrors).violations)) {
        (err.data as FormErrors).violations.forEach(v => {
          form.setError(v.propertyPath as keyof z.infer<typeof resetPasswordSchema>, {
            type: "manual",
            message: v.title
          });
        });
        return;
      } else if ("error" in err.data) {
        toast.error(err.data.error, {
          closeButton: true,
        })
      }
    }
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password to reset it. Make sure it's strong and secure.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(async (values) => {
            await resetPassword({ data: values });
          })} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm new password" {...field} />
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
              Reset Password
            </Button>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
