/**
 * SafeExternalLink - A secure external link component
 *
 * Automatically adds:
 * - rel="noopener noreferrer" for security
 * - target="_blank" for new tab
 * - External link indicator (optional)
 */

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface SafeExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  showIcon?: boolean;
  className?: string;
}

export function SafeExternalLink({
  href,
  children,
  showIcon = false,
  className,
  ...props
}: SafeExternalLinkProps) {
  // Check if the link is external
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (!isExternal) {
    // For internal links, just render a regular anchor
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {children}
      {showIcon && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
    </a>
  );
}

export default SafeExternalLink;
