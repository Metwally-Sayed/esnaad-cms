"use client";

import { Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

import { useFooterStore } from "@/store/footer-store";
import type { FooterTemplateProps } from "./types";



const contactDetails = ["800376223", "042879506", "info@esnaad.com"];

const socialLinks = [
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
  { label: "YouTube", icon: Youtube },
];

const MainFooter = ({ links, isLoading, locale }: FooterTemplateProps) => {
  const { footerData, isLoading: storeIsLoading } = useFooterStore();


  const resolvedLinks = links ?? footerData?.links ?? [];
  const resolvedLoading =
    typeof isLoading === "boolean" ? isLoading : storeIsLoading;

  const separatorColor =
    "color-mix(in oklab, var(--background) 40%, transparent)";
  const bodyTextColor =
    "color-mix(in oklab, var(--background) 80%, transparent)";
  const linkTextColor =
    "color-mix(in oklab, var(--background) 88%, transparent)";

  return (
    <footer className="bg-foreground text-background transition-colors font-sans">
      <div className="mx-auto flex  flex-col gap-10 px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_0.9fr]">
          <section
            className="flex flex-col gap-6 border-b border-background/20 pb-8 lg:border-b-0 lg:border-r lg:pr-12"
            style={{ borderColor: separatorColor }}
          >
            <div>
              <p className="font-serif text-4xl font-light tracking-[0.25em]">
                ESNAAD
              </p>
              <p
                className="mt-4 max-w-sm text-base leading-relaxed"
                style={{ color: bodyTextColor }}
              >
                Unit G07, City Walk Building #1,
                <br />
                Al Wasl, Dubai.
              </p>
            </div>

            <div className="flex gap-4">
              {socialLinks.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex size-11 items-center justify-center rounded-full border  transition-transform hover:scale-105"
                  style={{ borderColor: separatorColor }}
                  aria-label={label}
                >
                  <Icon className="size-5" strokeWidth={1.5} />
                </button>
              ))}
            </div>


          </section>

          <section
            className="flex flex-col gap-4 border-b border-background/20 pb-8 lg:border-b-0 lg:border-r lg:px-12"
            style={{ borderColor: separatorColor }}
          >
            <h3 className="text-xl font-semibold uppercase tracking-[0.3em]">
              QUICK LINKS
            </h3>
            <nav
              className="flex flex-col gap-2 text-lg"
              style={{ color: linkTextColor }}
            >
              {!resolvedLoading &&
                resolvedLinks.map((item) => (
                  <Link
                    key={item.id}
                    href={item.slug}
                    className="transition-colors "
                  >
                    {(locale === 'ar' && item.nameAr) ? item.nameAr : item.name}
                  </Link>
                ))}
            </nav>
          </section>

          <section className="flex flex-col gap-4 lg:pl-12">
            <h3 className="text-xl font-semibold uppercase tracking-[0.3em]">
              CONTACT US
            </h3>
            <div
              className="flex flex-col gap-3 text-lg"
              style={{ color: linkTextColor }}
            >
              {contactDetails.map((detail) => (
                <span key={detail}>{detail}</span>
              ))}
            </div>
          </section>
        </div>

        <div
          className="flex flex-col gap-6 border-t border-background/20 pt-6 text-sm uppercase tracking-[0.2em] md:flex-row md:items-center md:justify-between"
          style={{ borderColor: separatorColor }}
        >
          <p>Esnaad© 2025. All Rights Reserved</p>
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <Link href="#" className="hover:underline">
              Terms &amp; Conditions
            </Link>
            <span>|</span>
            <Link href="#" className="hover:underline">
              Privacy &amp; Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
