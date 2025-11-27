import Image from "next/image";

export default function ContentSection() {
  return (
    <section className="relative py-16 md:py-32 overflow-hidden" id="content">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950"
      >
        <div className="absolute h-full w-full bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]" />
      </div>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          Complete visibility and control over your entire inventory.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/preview/inve-dark.png"
                className="hidden rounded-[15px] dark:block"
                alt="inventory dashboard dark"
                width={1207}
                height={929}
              />
              <Image
                src="/preview/inve-light.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="inventory dashboard light"
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              Velos Inventory is more than just inventory software.{" "}
              <span className="text-accent-foreground font-bold">
                It&apos;s a complete ecosystem
              </span>{" "}
              — from real-time tracking to automated alerts and analytics.
            </p>
            <p className="text-muted-foreground">
              Our platform supports your entire operation — from warehouse
              management to the APIs and integrations helping businesses scale
              and innovate.
            </p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>
                  Using Inventory System has transformed how we manage
                  inventory. The real-time tracking and low-stock alerts have
                  eliminated stockouts and saved us countless hours. It&apos;s
                  the perfect balance of power and simplicity.
                </p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">Bryan Palay, Leader</cite>
                  <div className="text-sm text-muted-foreground">
                    Inventory System
                  </div>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
