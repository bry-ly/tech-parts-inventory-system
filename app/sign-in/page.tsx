import { Cpu } from "lucide-react";

import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Cpu className="size-4" />
          </div>
          Tech Parts Inc.
        </Link>
        <SignInForm />
      </div>
    </div>
  );
}
