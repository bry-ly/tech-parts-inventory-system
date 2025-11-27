import { Zap, Package, BarChart3, Bell, Shield, Workflow } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant synchronization across all devices and locations.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into stock levels and trends.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Automated notifications for low stock and reorder points.",
  },
  {
    icon: Package,
    title: "Multi-location",
    description: "Manage inventory across multiple warehouses seamlessly.",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with full audit trails.",
  },
  {
    icon: Workflow,
    title: "Easy Integration",
    description: "Connect with your existing tools and workflows.",
  },
];

export default function Features() {
  return (
    <section className="relative py-16 md:py-32 overflow-hidden" id="features">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950"
      >
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative z-10 mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-medium tracking-tight md:text-5xl">
            Everything you need to manage inventory efficiently
          </h2>
          <p className="text-muted-foreground text-lg">
            Our comprehensive platform provides all the tools your business
            needs to track, manage, and optimize inventory operations in
            real-time.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-zinc-300 dark:border-zinc-800 p-8 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
            >
              <feature.icon
                className="mb-4 size-8 text-zinc-900 dark:text-zinc-50"
                strokeWidth={1.5}
              />
              <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
