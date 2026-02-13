"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormSecurity } from "@/hooks/use-form-security";
import { submitFormEmail } from "@/server/actions/form-email";
import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";

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

  // Security hook
  const { formToken, formStartTime, honeypotValue, setHoneypotValue, resetSecurity } = useFormSecurity();

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
        // Security fields
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
      <section className="snap-start bg-background py-20">
        <div className="container mx-auto px-4 w-full">
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-8 font-serif text-3xl text-foreground">
              {t("registerInterest")}
            </h2>
            <div className="p-8 bg-secondary/10 rounded-lg">
              <p className="text-lg text-foreground/80">{t("thankYouSubmission")}</p>
              <Button
                variant="outline"
                className="mt-6 uppercase tracking-widest"
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
    <section className="snap-start bg-background py-20">
      <div className="container mx-auto px-4 w-full">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-center font-serif text-3xl text-foreground">
            {t("registerInterest")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from humans, bots will fill it */}
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

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm uppercase tracking-wider text-foreground">
                {t("name")}
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-foreground/20 bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm uppercase tracking-wider text-foreground">
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-foreground/20 bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm uppercase tracking-wider text-foreground">
                {t("phone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-foreground/20 bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm uppercase tracking-wider text-foreground">
                {t("preferredContact")}
              </Label>
              <RadioGroup
                value={formData.contactMode}
                onValueChange={(value) => setFormData({ ...formData, contactMode: value })}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="text-sm text-foreground cursor-pointer">
                    {t("whatsapp")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="phone" id="phone-option" />
                  <Label htmlFor="phone-option" className="text-sm text-foreground cursor-pointer">
                    {t("phone")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full border border-foreground bg-transparent py-6 text-sm uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {isPending ? t("submitting") : t("sendMessage")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
