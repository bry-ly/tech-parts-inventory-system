import {
  Zap,
  Package,
  BarChart3,
  Bell,
  Shield,
  Workflow,
} from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 md:py-25 " id="features">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Everything you need to manage inventory efficiently
          </h2>
          <p>
            Our comprehensive platform provides all the tools your business
            needs to track, manage, and optimize inventory operations in
            real-time.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <h3 className="text-sm font-medium">Real-time Updates</h3>
            </div>
            <p className="text-sm">
              Instant synchronization across all devices and locations.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              <h3 className="text-sm font-medium">Analytics Dashboard</h3>
            </div>
            <p className="text-sm">
              Comprehensive insights into stock levels and trends.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="size-4" />
              <h3 className="text-sm font-medium">Smart Alerts</h3>
            </div>
            <p className="text-sm">
              Automated notifications for low stock and reorder points.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="size-4" />
              <h3 className="text-sm font-medium">Multi-location</h3>
            </div>
            <p className="text-sm">
              Manage inventory across multiple warehouses seamlessly.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="size-4" />
              <h3 className="text-sm font-medium">Secure & Compliant</h3>
            </div>
            <p className="text-sm">
              Enterprise-grade security with full audit trails.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Workflow className="size-4" />
              <h3 className="text-sm font-medium">Easy Integration</h3>
            </div>
            <p className="text-sm">
              Connect with your existing tools and workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
