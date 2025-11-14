import { Logo } from "@/components/landing/logo";
import Link from "next/link";

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Sign In",
    href: "/sign-in",
  },
  {
    title: "Sign Up",
    href: "/sign-up",
  },
  {
    title: "About",
    href: "#",
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
          © {new Date().getFullYear()} Tech Parts. All rights reserved
        </span>
      </div>
    </footer>
  );
}
