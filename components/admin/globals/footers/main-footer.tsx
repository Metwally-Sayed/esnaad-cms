"use client";

import { Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFooterStore } from "@/store/footer-store";
import { useTranslations } from "next-intl";
import type { FooterTemplateProps } from "./types";

const contactDetails = ["800376223", "042879506", "info@esnaad.com"];

const socialLinks = [
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
  { label: "YouTube", icon: Youtube },
];

const MainFooter = ({ links, isLoading, locale }: FooterTemplateProps) => {
  const { footerData, isLoading: storeIsLoading } = useFooterStore();
  const t = useTranslations("Footer");

  const resolvedLinks = links ?? footerData?.links ?? [];
  const resolvedLoading =
    typeof isLoading === "boolean" ? isLoading : storeIsLoading;

  const separatorColor =
    "color-mix(in oklab, var(--foreground) 20%, transparent)";
  const bodyTextColor =
    "color-mix(in oklab, var(--foreground) 80%, transparent)";
  const linkTextColor =
    "color-mix(in oklab, var(--foreground) 88%, transparent)";

  return (
    <footer className="bg-background text-foreground transition-colors font-sans">
      <div className="mx-auto flex flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-0">
          {/* Company Info & Social */}
          <section
            className="flex flex-1 flex-col gap-5 border-b border-background/20 pb-7 lg:border-b-0 lg:border-e lg:pe-12"
            style={{ borderColor: separatorColor }}
          >
            <div>
              <p className="font-serif text-3xl font-light tracking-[0.2em] sm:text-4xl sm:tracking-[0.25em]">
                ESNAAD
              </p>
              <p
                className="mt-3 max-w-sm text-sm leading-relaxed text-start sm:mt-4 sm:text-base"
                style={{ color: bodyTextColor }}
              >
                {t("address")}
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="mobile-touch-target flex size-10 items-center justify-center rounded-full border transition-transform hover:scale-105 sm:size-11"
                  style={{ borderColor: separatorColor }}
                  aria-label={label}
                >
                  <Icon className="size-4 sm:size-5" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </section>

          {/* Mobile Accordions */}
          <section className="lg:hidden">
            <Accordion
              type="multiple"
              className="rounded-xl border border-foreground/10 px-3"
              style={{ borderColor: separatorColor }}
            >
              <AccordionItem
                value="footer-quick-links"
                style={{ borderColor: separatorColor }}
              >
                <AccordionTrigger className="text-sm uppercase tracking-[0.18em] hover:no-underline">
                  {t("quickLinks")}
                </AccordionTrigger>
                <AccordionContent>
                  <nav
                    className="flex flex-col gap-2 pb-2 text-sm"
                    style={{ color: linkTextColor }}
                  >
                    {!resolvedLoading &&
                      resolvedLinks.map((item) => (
                        <Link
                          key={item.id}
                          href={`/${locale}${item.slug}`}
                          className="rounded-md px-1 py-1.5 transition-colors hover:bg-foreground/5"
                        >
                          {locale === "ar" && item.nameAr ? item.nameAr : item.name}
                        </Link>
                      ))}
                  </nav>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="footer-contact"
                style={{ borderColor: separatorColor }}
              >
                <AccordionTrigger className="text-sm uppercase tracking-[0.18em] hover:no-underline">
                  {t("contactUs")}
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="flex flex-col gap-2 pb-2 text-sm"
                    style={{ color: linkTextColor }}
                  >
                    {contactDetails.map((detail) => (
                      <span key={detail}>{detail}</span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Quick Links */}
          <section
            className="hidden flex-1 flex-col gap-4 border-b border-background/20 pb-8 lg:flex lg:border-b-0 lg:border-e lg:px-8"
            style={{ borderColor: separatorColor }}
          >
            <h3 className="text-xl font-semibold uppercase tracking-[0.3em] text-start">
              {t("quickLinks")}
            </h3>
            <nav
              className="flex flex-col gap-2 text-lg"
              style={{ color: linkTextColor }}
            >
              {!resolvedLoading &&
                resolvedLinks.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}${item.slug}`}
                    className="transition-colors hover:opacity-70 text-start inline-block"
                  >
                    {(locale === 'ar' && item.nameAr) ? item.nameAr : item.name}
                  </Link>
                ))}
            </nav>
          </section>

          {/* Contact Info */}
          <section className="hidden flex-1 flex-col gap-4 lg:flex lg:ps-8">
            <h3 className="text-xl font-semibold uppercase tracking-[0.3em] text-start">
              {t("contactUs")}
            </h3>
            <div
              className="flex flex-col gap-3 text-lg"
              style={{ color: linkTextColor }}
            >
              {contactDetails.map((detail) => (
                <span key={detail} className="text-start" >
                  {detail}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Bottom */}
        <div
          className="flex flex-col gap-4 border-t border-background/20 pt-5 text-[0.65rem] uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.2em] md:flex-row md:items-center md:justify-between"
          style={{ borderColor: separatorColor }}
        >
          <p className="text-start">{t("copyright")}</p>
          <div className="flex items-center gap-3 text-[0.65rem] sm:gap-4 sm:text-sm">
            <Link href="#" className="hover:underline">
              {t("terms")}
            </Link>
            <span>|</span>
            <Link href="#" className="hover:underline">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
