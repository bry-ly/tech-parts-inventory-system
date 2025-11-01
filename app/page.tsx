import { auth } from "@/lib/auth/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth.api
    .getSession({
      headers: await headers(),
    })
    .then((res) => res?.user || null);
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center dark:bg-accent relative"
      style={{
        backgroundImage: "url(/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-accent mb-6">
            Inventory Management
          </h1>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            Streamline your inventory tracking with our powerful, easy-to-use
            management system. Track products, monitor stock levels, and gain
            valuable insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-in"
              className="bg-primary text-accent px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="#"
              className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
