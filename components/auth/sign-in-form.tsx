"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { IconEye, IconEyeOff, IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "sonner";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Google sign in failed.";
      toast.error("Sign in failed", {
        description: errorMessage,
      });
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        setError(error.message || "Sign in failed.");
        toast.error("Sign in failed", {
          description:
            error.message || "Please check your credentials and try again.",
        });
      } else {
        form.reset();
        toast.success("Welcome back!", {
          description: "You have successfully signed in.",
        });
        // Force a full page reload to trigger server-side session check
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign in failed.";
      setError(errorMessage);
      toast.error("Sign in failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
            >
              <IconBrandGoogle className="mr-2 h-4 w-4" />
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="techparts@gmail.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 mr-1 flex h-full w-8 items-center justify-center px-0"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <IconEye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                {error && (
                  <FieldDescription className="text-red-600 text-center">
                    {error}
                  </FieldDescription>
                )}
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking sign in, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
