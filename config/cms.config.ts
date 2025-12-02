/**
 * Central configuration for CMS defaults and branding
 * Change these values instead of hard-coding throughout the app
 */

export const CMS_CONFIG = {
  // Site defaults
  siteName: "Esnaad CMS",
  siteDescription: "A modern content management system",

  // Theme defaults
  defaultTheme: "amber" as const,

  // Contact information
  contact: {
    phones: ["800376223", "042879506"],
    email: "info@esnaad.com",
    address: "Your address here",
  },

  // Default navigation links
  defaultNavLinks: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ],

  // Social media
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
} as const;

export type CMSConfig = typeof CMS_CONFIG;
