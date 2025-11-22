import { Logo } from "@/components/landing/logo";
import Link from "next/link";

const links = [
  {
    title: "About",
    href: "#",
  },
  {
    title: "Features",
    href: "#features",
  },
  {
    title:"Team",
    href:"#team",
  },
  {
    title: "Demo",
    href: "/demo",
  },
];

export default function FooterSection() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Logo />
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
        <span className="text-muted-foreground block text-center text-sm">
          {" "}
          © {new Date().getFullYear()} Velos Inventory  . All rights reserved
        </span>
      </div>
    </footer>
  );
}
