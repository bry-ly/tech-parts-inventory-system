import { auth } from "@/lib/auth/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, BarChart3, Bell, Shield, Zap, Users } from "lucide-react";

export default async function Home() {
  const user = await auth.api
    .getSession({
      headers: await headers(),
    })
    .then((res) => res?.user || null);
  if (user) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: Package,
      title: "Product Management",
      description:
        "Easily track and manage your entire product catalog with powerful search and filtering capabilities.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Gain valuable insights with comprehensive analytics and customizable reporting tools.",
    },
    {
      icon: Bell,
      title: "Low Stock Alerts",
      description:
        "Never run out of stock with automated alerts and notifications for low inventory levels.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with role-based access control and data encryption.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Stay synchronized with instant updates across all devices and team members.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work seamlessly with your team with multi-user support and activity tracking.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url(/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/50 text-primary-foreground border-primary">
              Inventory Management - Tech Parts Inc.
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Manage Your Inventory
              <span className="block text-primary mt-2">With Confidence</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Streamline your inventory tracking with our powerful, easy-to-use
              management system. Track products, monitor stock levels, and gain
              valuable insights in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/sign-in">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to manage your inventory efficiently and
              effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">99.9%</div>
              <div className="text-lg opacity-90">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10k+</div>
              <div className="text-lg opacity-90">Products Tracked</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl mb-4">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of businesses that trust our inventory management
                system
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button asChild size="lg" className="text-lg">
                <Link href="/sign-in">Sign In Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Inventory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
