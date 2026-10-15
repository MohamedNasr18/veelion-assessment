"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tasks",    label: "Tasks" },
  { href: "/activity", label: "Activity" },
  { href: "/reports",  label: "Reports" },
];

export function Navbar() {
  const currentPath = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-mark">V</span>
          VeeLion
        </Link>

        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link${currentPath === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
