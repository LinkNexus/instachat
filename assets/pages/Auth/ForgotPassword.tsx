import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Loader2, Mail} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useApiFetch} from "@/lib/fetch.ts";
import {toast} from "sonner";

export function ForgotPassword() {
  const forgotPasswordSchema = z.object({
    identifier: z.string(),
  })

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
    }
  });

  const {
    loading: pending,
    callback: sendResetLink
  } = useApiFetch<{ resetToken: any }, { error: string }>("/api/auth/reset-password", {
    method: "POST",
    onSuccess: () => {
      toast.success("The reset link has been sent to the email address corresponding the provided identifier")
    },
    onError: (err) => {
      toast.error(err.data.error, {
        closeButton: true,
      })
    }
  })

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter you email address to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(async (values) => {
              await sendResetLink({ data: values });
            })} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email Address or Username</FormLabel>
                    <FormControl>
                      <Input placeholder="john_doe" {...field} />
                    </FormControl>
                    <FormMessage/>
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
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2"/>
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
