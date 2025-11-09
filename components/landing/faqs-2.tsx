"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQsTwo() {
  const faqItems = [
    {
      id: "item-1",
      question: "How does the inventory tracking system work?",
      answer:
        "Our system provides real-time inventory tracking across all your warehouse locations. Simply add products, set stock levels, and our platform automatically updates as items move in and out. You'll receive instant notifications when stock levels fall below your specified thresholds.",
    },
    {
      id: "item-2",
      question: "Can I manage multiple warehouse locations?",
      answer:
        "Yes! Depending on your plan, you can manage multiple warehouse locations. The Starter plan includes 1 location, Professional supports up to 5 locations, and Enterprise offers unlimited warehouse locations with advanced multi-location management features.",
    },
    {
      id: "item-3",
      question: "Does the system support barcode scanning?",
      answer:
        "Absolutely! Our Professional and Enterprise plans include full barcode scanning support. You can scan products for quick check-in/check-out, conduct inventory counts, and streamline your warehouse operations using any standard barcode scanner or our mobile app.",
    },
    {
      id: "item-4",
      question: "What kind of reports and analytics are available?",
      answer:
        "We offer comprehensive analytics including inventory turnover rates, stock level trends, low stock alerts, order history, and custom reports. Professional and Enterprise plans get access to advanced analytics with customizable dashboards and automated report generation.",
    },
    {
      id: "item-5",
      question: "Can I integrate with my existing systems?",
      answer:
        "Yes! Our Professional plan includes API access for basic integrations, while our Enterprise plan offers custom integrations with your existing ERP, accounting, or e-commerce platforms. Our team can help set up seamless data flow between systems.",
    },
    {
      id: "item-6",
      question: "How secure is my inventory data?",
      answer:
        "Security is our top priority. All data is encrypted in transit and at rest using industry-standard encryption. We perform regular security audits, maintain SOC 2 compliance, and offer enterprise-grade security features including role-based access control and audit logs.",
    },
  ];

  return (
    <section className="py-16 md:py-24" id="faq">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Everything you need to know about our inventory management system.
            Quick answers to common questions about features, pricing, and
            implementation.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            Can&apos;t find what you&apos;re looking for? Contact our{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
