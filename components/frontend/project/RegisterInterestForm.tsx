"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormSecurity } from "@/hooks/use-form-security";
import { cn } from "@/lib/utils";
import { submitFormEmail } from "@/server/actions/form-email";
import { useTranslations } from "next-intl";
import React, { useState, useTransition } from "react";

export function RegisterInterestForm() {
  const t = useTranslations("Forms");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactMode: "whatsapp",
  });
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formToken, formStartTime, honeypotValue, setHoneypotValue, resetSecurity } =
    useFormSecurity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitFormEmail({
        formType: "register-interest",
        formTitle: t("registerInterest"),
        fields: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferredContact: formData.contactMode,
        },
        honeypot: honeypotValue,
        formToken,
        formStartTime,
      });

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", contactMode: "whatsapp" });
        resetSecurity();
      } else {
        setError(result.message);
      }
    });
  };

  if (submitted) {
    return (
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto w-full px-4">
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-6 font-serif text-3xl tracking-[0.06em] text-foreground">
              {t("registerInterest")}
            </h2>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 md:p-8">
              <p className="text-base leading-7 text-foreground/80 md:text-lg">
                {t("thankYouSubmission")}
              </p>
              <Button
                variant="outline"
                className="mt-6 uppercase tracking-[0.16em]"
                onClick={() => setSubmitted(false)}
              >
                {t("sendAnother")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container mx-auto w-full px-4">
        <div className="mx-auto max-w-md">
          <div className="mb-5 rounded-2xl border border-border/70 bg-card/70 px-5 py-6 text-center">
            <h2 className="font-serif text-3xl tracking-[0.06em] text-foreground">
              {t("registerInterest")}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border/70 bg-card/75 p-5 md:space-y-6 md:p-6"
          >
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website_url_interest">Website</label>
              <input
                type="text"
                id="website_url_interest"
                name="website_url"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[0.62rem] uppercase tracking-[0.2em] text-foreground/80"
                >
                  {t("name")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-xl border-foreground/20 bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[0.62rem] uppercase tracking-[0.2em] text-foreground/80"
                >
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl border-foreground/20 bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-[0.62rem] uppercase tracking-[0.2em] text-foreground/80"
                >
                  {t("phone")}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 rounded-xl border-foreground/20 bg-background"
                  required
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/60 p-4">
              <Label className="mb-3 block text-[0.62rem] uppercase tracking-[0.2em] text-foreground/80">
                {t("preferredContact")}
              </Label>
              <RadioGroup
                value={formData.contactMode}
                onValueChange={(value) => setFormData({ ...formData, contactMode: value })}
                className="grid grid-cols-2 gap-2"
              >
                <label
                  htmlFor="whatsapp"
                  className={cn(
                    "mobile-touch-target flex cursor-pointer items-center justify-center rounded-full border px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors",
                    formData.contactMode === "whatsapp"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground/80"
                  )}
                >
                  <RadioGroupItem value="whatsapp" id="whatsapp" className="sr-only" />
                  {t("whatsapp")}
                </label>
                <label
                  htmlFor="phone-option"
                  className={cn(
                    "mobile-touch-target flex cursor-pointer items-center justify-center rounded-full border px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors",
                    formData.contactMode === "phone"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground/80"
                  )}
                >
                  <RadioGroupItem value="phone" id="phone-option" className="sr-only" />
                  {t("phone")}
                </label>
              </RadioGroup>
            </div>

            {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

            <Button
              type="submit"
              disabled={isPending}
              className="mobile-safe-bottom mobile-touch-target w-full rounded-full border border-foreground bg-transparent py-6 text-[0.68rem] uppercase tracking-[0.16em] text-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {isPending ? t("submitting") : t("sendMessage")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
