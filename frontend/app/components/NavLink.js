"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  className,
  activeClassName,
  onClick,
}) {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const cls = [className, isActive ? activeClassName : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}
