import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section className="py-16 md:py-32 " id="pricing">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Pricing that Scales with You
          </h1>
          <p>
            Choose the perfect plan for your inventory management needs. From
            small businesses to enterprise operations, we have a solution that
            grows with you.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Starter</CardTitle>
              <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
              <CardDescription className="text-sm">
                Perfect for getting started
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Up to 100 Products",
                  "Basic Inventory Tracking",
                  "1 Warehouse Location",
                  "Email Support",
                  "Mobile App Access",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative">
            <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
              Popular
            </span>

            <div className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Professional</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  $49 / mo
                </span>
                <CardDescription className="text-sm">
                  For growing businesses
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Everything in Starter Plan",
                    "Unlimited Products",
                    "Up to 5 Warehouse Locations",
                    "Advanced Analytics Dashboard",
                    "Low Stock Alerts & Notifications",
                    "Barcode Scanning Support",
                    "Priority Email & Chat Support",
                    "Custom Reports",
                    "Multi-User Access (Up to 5)",
                    "API Access",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Enterprise</CardTitle>
              <span className="my-3 block text-2xl font-semibold">
                $149 / mo
              </span>
              <CardDescription className="text-sm">
                For large operations
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Professional Plan",
                  "Unlimited Warehouse Locations",
                  "Dedicated Account Manager",
                  "24/7 Phone & Email Support",
                  "Advanced Security Features",
                  "Custom Integrations",
                  "Unlimited Users",
                  "White-Label Options",
                  "SLA Guarantee",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
