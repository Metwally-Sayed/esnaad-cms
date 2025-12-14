"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

export function RegisterInterestForm() {
  const t = useTranslations("Forms");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactMode: "whatsapp",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section className="snap-start bg-background py-20">
      <div className="container mx-auto px-4 w-full">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-center font-serif text-3xl text-foreground">
            {t("registerInterest")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="text-sm text-foreground cursor-pointer">
                    {t("phone")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full border border-foreground bg-transparent py-6 text-sm uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background"
            >
              {t("sendMessage")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
