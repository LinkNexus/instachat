import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {useApiFetch} from "@/lib/fetch";
import {AlertCircle, X} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import type {User} from "@/types.ts";

export function EmailVerificationBanner({ user }: { user: User }) {
  const [isDismissed, setIsDismissed] = useState(false);

  const {
    loading: isResending,
    callback: resendVerification
  } = useApiFetch("/api/auth/resend-verification", {
    method: "POST",
    onSuccess: () => toast.success("Verification email sent! Check your inbox."),
    data: { email: user.email }
  });

  if (isDismissed) {
    return null;
  }

  return (
    <div className="px-3 w-full">
      <Alert className={`border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 flex items-center my-4`}>
        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex-1 mr-4">
            <p className="text-orange-800 dark:text-orange-200">
              <strong>Email verification required!</strong> Your account is not fully active yet.
              Click the following button to resend the link to verify your email address
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resendVerification()}
              disabled={isResending}
              className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900"
            >
              {isResending ? "Sending..." : "Resend"}
            </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDismissed(true)}
                className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-100 dark:text-orange-400 dark:hover:bg-orange-900"
              >
                <X className="h-4 w-4" />
              </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
