import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth.api.getSession({
    headers: await headers(),
  }).then(res => res?.user || null);
  if (user) {
    redirect("/dashboard");  
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-purple-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-accent-foreground mb-6">
            Inventory Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your inventory tracking with our powerful, easy-to-use
            management system. Track products, monitor stock levels, and gain
            valuable insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-in"
              className="bg-primary text-accent px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="#"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}