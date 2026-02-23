"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormSecurity } from "@/hooks/use-form-security";
import { submitFormEmail } from "@/server/actions/form-email";
import { uploadFile } from "@/server/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "file" | "select" | "section-header";
  placeholder?: string;
  required?: boolean;
  width?: "full" | "half";
  options?: { label: string; value: string }[];
};

type FormContent = {
  title?: string;
  subtitle?: string;
  introText?: string;
  submitLabel?: string;
  successMessage?: string;
  fields?: FieldConfig[];
};

type MobileGroup = {
  title?: string;
  fields: FieldConfig[];
};

const generateSchema = (fields: FieldConfig[]) => {
  const schemaMap: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (field.type === "section-header") {
      return;
    }

    let validator: z.ZodTypeAny = z.string();

    if (field.type === "email") {
      validator = (validator as z.ZodString).email("Invalid email address");
    }

    if (field.type === "tel") {
      validator = (validator as z.ZodString).min(5, "Invalid phone number");
    }

    if (field.type === "file") {
      validator = z.any();
    }

    if (!field.required) {
      validator = validator.optional();
    } else if (field.type !== "file") {
      validator = (validator as z.ZodString).min(1, `${field.label} is required`);
    }

    schemaMap[field.name] = validator;

    if (field.type === "tel") {
      schemaMap[`${field.name}_code`] = z.string().optional();
    }
  });

  return z.object(schemaMap);
};

const buildMobileGroups = (fields: FieldConfig[]): MobileGroup[] => {
  const groups: MobileGroup[] = [];
  let activeGroup: MobileGroup = { fields: [] };

  fields.forEach((field) => {
    if (field.type === "section-header") {
      if (activeGroup.fields.length) {
        groups.push(activeGroup);
      }
      activeGroup = { title: field.label, fields: [] };
      return;
    }

    activeGroup.fields.push(field);
  });

  if (activeGroup.fields.length) {
    groups.push(activeGroup);
  }

  if (groups.length === 0) {
    return [];
  }

  return groups;
};

const AgencyRegistrationForm = ({ content }: { content: FormContent }) => {
  const t = useTranslations("Forms");
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [fileObjects, setFileObjects] = useState<Record<string, File>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { formToken, formStartTime, honeypotValue, setHoneypotValue, resetSecurity } =
    useFormSecurity();

  const fields = useMemo(() => content.fields || [], [content.fields]);
  const mobileGroups = useMemo(() => buildMobileGroups(fields), [fields]);

  const title = content.title || t("agencyRegistration");
  const subtitle = content.subtitle || t("agencyWelcome");
  const introText = content.introText;
  const submitLabel = content.submitLabel || t("registerNow");
  const successMessage = content.successMessage || t("thankYouRegistration");

  const formSchema = useMemo(() => generateSchema(fields), [fields]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce<Record<string, string>>((acc, field) => {
      if (field.type === "section-header") {
        return acc;
      }
      acc[field.name] = "";
      if (field.type === "tel") {
        acc[`${field.name}_code`] = "+971";
      }
      return acc;
    }, {}),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const emailFields: Record<string, string | number | boolean> = {};

      for (const [key, value] of Object.entries(values)) {
        if (value instanceof File || fileObjects[key]) {
          const file = fileObjects[key];
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            const uploadResult = await uploadFile(formData, "form-uploads");
            if (uploadResult.success && uploadResult.data) {
              emailFields[key] = `${fileNames[key]} - Download: ${uploadResult.data.url}`;
            } else {
              emailFields[key] = `${fileNames[key]} (upload failed)`;
            }
          } else {
            emailFields[key] = fileNames[key] || "File attached";
          }
        } else if (value !== undefined && value !== null) {
          emailFields[key] = value as string | number | boolean;
        }
      }

      const result = await submitFormEmail({
        formType: "agency-registration",
        formTitle: title,
        fields: emailFields,
        honeypot: honeypotValue,
        formToken,
        formStartTime,
      });

      if (result.success) {
        setSubmitted(true);
        form.reset();
        setFileNames({});
        setFileObjects({});
        resetSecurity();
      } else {
        setError(result.message);
      }
    });
  }

  const renderField = (field: FieldConfig, compact = false) => {
    const labelClass = compact
      ? "mb-1 block text-[0.62rem] uppercase tracking-[0.2em] text-foreground/70"
      : "mb-1 block font-serif text-xs uppercase tracking-[0.1em] text-black/60 dark:text-white/60";

    if (field.type === "tel") {
      return (
        <div key={field.name}>
          <FormLabel className={labelClass}>{field.label}</FormLabel>
          <div className="grid grid-cols-[76px_1fr] gap-2 items-end">
            <FormField
              control={form.control}
              name={`${field.name}_code`}
              render={({ field: codeField }) => (
                <FormItem>
                  <Select onValueChange={codeField.onChange} defaultValue={codeField.value as string}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm shadow-none focus:ring-0">
                        <SelectValue placeholder={t("code")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="+971">🇦🇪</SelectItem>
                      <SelectItem value="+1">🇺🇸</SelectItem>
                      <SelectItem value="+44">🇬🇧</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={field.name}
              render={({ field: inputField }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={field.placeholder || ""}
                      {...inputField}
                      value={(inputField.value as string) || ""}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );
    }

    return (
      <div key={field.name}>
        <FormField
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className={labelClass}>{field.label}</FormLabel>
              <FormControl>
                {field.type === "textarea" ? (
                  <Textarea
                    placeholder={field.placeholder || ""}
                    {...formField}
                    value={(formField.value as string) || ""}
                    className="min-h-[120px] rounded-xl border-border bg-background resize-none"
                  />
                ) : field.type === "select" ? (
                  <Select onValueChange={formField.onChange} defaultValue={formField.value as string}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border border-border bg-background px-3 text-sm shadow-none focus:ring-0">
                        <SelectValue placeholder={field.placeholder || t("selectPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "file" ? (
                  <div className="space-y-3 pt-1">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id={`file-${field.name}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileNames((prev) => ({ ...prev, [field.name]: file.name }));
                          setFileObjects((prev) => ({ ...prev, [field.name]: file }));
                          formField.onChange(file.name);
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <label
                        htmlFor={`file-${field.name}`}
                        className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border px-4 py-2 text-[0.62rem] uppercase tracking-[0.18em] transition-colors hover:bg-secondary/10"
                      >
                        {t("chooseFile")}
                      </label>
                      <span className="truncate text-xs text-muted-foreground">
                        {fileNames[field.name] || t("noFileChosen")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    {...formField}
                    value={(formField.value as string) || ""}
                    className="h-11 rounded-xl border-border bg-background"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  if (submitted) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-background px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="text-3xl font-serif font-light uppercase tracking-[0.1em] text-foreground">
            {title}
          </h2>
          <div className="rounded-2xl border border-border bg-secondary/10 p-8">
            <p className="font-serif text-lg text-foreground/80">{successMessage}</p>
            <Button
              variant="outline"
              className="mt-6 rounded-none border-border uppercase tracking-[0.12em] transition-colors hover:bg-secondary/10"
              onClick={() => setSubmitted(false)}
            >
              {t("sendAnother")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-x-hidden bg-background px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-12 space-y-6 text-center sm:mb-16">
          {subtitle ? <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
          {introText ? (
            <div className="mx-auto mt-8 max-w-3xl px-2 sm:mt-12">
              <p className="text-center font-serif text-sm font-light uppercase leading-relaxed tracking-[0.05em] text-black dark:text-white sm:text-base md:text-lg">
                {introText}
              </p>
            </div>
          ) : null}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 sm:space-y-12">
            <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
              <label htmlFor="website_url_agency">Website</label>
              <input
                type="text"
                id="website_url_agency"
                name="website_url"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-3 md:hidden">
              <Accordion type="single" collapsible defaultValue="step-0" className="space-y-3">
                {mobileGroups.map((group, index) => (
                  <AccordionItem
                    key={`mobile-group-${index}`}
                    value={`step-${index}`}
                    className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 px-4"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex items-center gap-3 text-start">
                        <span className="rounded-full border border-border/70 px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-sm uppercase tracking-[0.1em] text-foreground">
                          {group.title || t("agencyRegistration")}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        {group.fields.map((field) => renderField(field, true))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="hidden grid-cols-1 gap-x-6 gap-y-8 sm:gap-x-12 sm:gap-y-10 md:grid md:grid-cols-2">
              {fields.map((field, index) => {
                if (field.type === "section-header") {
                  return (
                    <div
                      key={`section-${index}`}
                      className="mb-2 border-b border-border pb-3 pt-8 md:col-span-2 sm:mb-4 sm:pb-4"
                    >
                      <h3 className="text-center font-serif text-lg font-light uppercase tracking-[0.08em] text-black dark:text-white sm:text-xl md:text-2xl sm:tracking-[0.1em]">
                        {field.label}
                      </h3>
                    </div>
                  );
                }

                const isHalf = field.width === "half";
                const colSpan = isHalf ? "md:col-span-1" : "md:col-span-2";

                return (
                  <div key={field.name} className={colSpan}>
                    {renderField(field)}
                  </div>
                );
              })}
            </div>

            {error ? <div className="text-center font-serif text-sm text-destructive">{error}</div> : null}

            <div className="flex justify-center pt-6 sm:pt-8 md:pt-10 sm:pb-0 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
              <Button
                type="submit"
                variant="outline"
                size="lg"
                disabled={isPending}
                className="mobile-touch-target h-12 w-full min-w-0 rounded-full border-border text-[0.68rem] uppercase tracking-[0.16em] transition-all hover:bg-secondary/10 disabled:opacity-50 sm:h-14 sm:min-w-[300px] sm:text-lg sm:tracking-[0.1em] md:w-auto md:rounded-none"
              >
                {isPending ? t("submitting") : submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default AgencyRegistrationForm;
