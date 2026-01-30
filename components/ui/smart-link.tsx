/**
 * SmartLink - Automatically handles internal and external links
 *
 * - Internal links use Next.js Link for client-side navigation
 * - External links open in new tab with rel="noopener noreferrer"
 */

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: ReactNode;
  className?: string;
}

export function SmartLink({
  href,
  children,
  className,
  ...props
}: SmartLinkProps) {
  // Check if the link is external
  const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

export default SmartLink;
