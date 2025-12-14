"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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

const generateSchema = (fields: FieldConfig[]) => {
  const schemaMap: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    // Skip section headers in schema
    if (field.type === "section-header") return;

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
    } else {
      if (field.type !== "file") {
        validator = (validator as z.ZodString).min(1, `${field.label} is required`);
      }
    }

    schemaMap[field.name] = validator;

    if (field.type === "tel") {
      schemaMap[`${field.name}_code`] = z.string().optional();
    }
  });

  return z.object(schemaMap);
};

const AgencyRegistrationForm = ({ content }: { content: FormContent }) => {
  const t = useTranslations("Forms");
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fields = content.fields || [];
  const title = content.title || t("agencyRegistration");
  const subtitle = content.subtitle || t("agencyWelcome");
  const introText = content.introText;
  const submitLabel = content.submitLabel || t("registerNow");
  const successMessage = content.successMessage || t("thankYouRegistration");

  const formSchema = useMemo(() => generateSchema(fields), [fields]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      if (field.type === "section-header") return acc;
      acc[field.name] = "";
      if (field.type === "tel") {
        acc[`${field.name}_code`] = "+971";
      }
      return acc;
    }, {} as Record<string, any>),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted:", values);
    setSubmitted(true);
    // Here you would typically send data to an API
  }

  if (submitted) {
    return (
      <section className="py-20 px-4 bg-background min-h-[50vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-serif font-light uppercase tracking-[0.1em] text-foreground">{title}</h2>
          <div className="p-8 bg-secondary/10 rounded-sm border border-border">
            <p className="text-lg text-foreground/80 font-serif">{successMessage}</p>
            <Button
              variant="outline"
              className="mt-6 uppercase tracking-widest border-border hover:bg-secondary/10 transition-colors rounded-none"
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
    <section className="py-12 sm:py-20 px-4 bg-background overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16 space-y-6">
          {introText && (
            <div className="mt-8 sm:mt-12 max-w-3xl mx-auto px-2">
              <p className="text-center text-sm sm:text-base md:text-lg uppercase leading-relaxed tracking-[0.05em] text-black dark:text-white font-serif font-light">
                {introText}
              </p>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 sm:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-8 sm:gap-y-10">
              {fields.map((field, index) => {
                if (field.type === "section-header") {
                  return (
                    <div key={`section-${index}`} className="md:col-span-2 pt-6 sm:pt-8 pb-3 sm:pb-4 border-b border-border mb-2 sm:mb-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl text-center font-serif font-light uppercase tracking-[0.08em] sm:tracking-[0.1em] text-black dark:text-white">
                        {field.label}
                      </h3>
                    </div>
                  );
                }

                const isHalf = field.width === "half";
                const colSpan = isHalf ? "md:col-span-1" : "md:col-span-2";

                if (field.type === "tel") {
                  return (
                    <div key={field.name} className={colSpan}>
                      <FormLabel className="uppercase text-xs tracking-[0.1em] text-black/60 dark:text-white/60 mb-2 block font-serif">
                        {field.label}
                      </FormLabel>
                      <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-1 items-end">
                        <FormField
                          control={form.control}
                          name={`${field.name}_code`}
                          render={({ field: codeField }) => (
                            <FormItem>
                              <Select
                                onValueChange={codeField.onChange}
                                defaultValue={codeField.value as string}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full border-t-0 border-x-0 border-b border-border rounded-none px-0 focus:ring-0 shadow-none bg-transparent h-10 text-foreground text-sm">
                                    <SelectValue placeholder={t("code")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background border-border">
                                  <SelectItem value="+971">
                                    <span className="flex items-center gap-2">
                                      <span className="text-lg">🇦🇪</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="+1">
                                    <span className="flex items-center gap-2">
                                      <span className="text-lg">🇺🇸</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="+44">
                                    <span className="flex items-center gap-2">
                                      <span className="text-lg">🇬🇧</span>
                                    </span>
                                  </SelectItem>
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
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder={field.placeholder || ""}
                                  {...inputField}
                                  value={inputField.value as string || ""}
                                  className="w-full border-t-0 border-x-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-foreground shadow-none bg-transparent h-10 text-base text-foreground placeholder:text-muted-foreground"
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
                  <div key={field.name} className={colSpan}>
                    <FormField
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-[0.1em] text-black/60 dark:text-white/60 mb-1 block font-serif">
                            {field.label}
                          </FormLabel>
                          <FormControl>
                            {field.type === "textarea" ? (
                              <Textarea
                                placeholder={field.placeholder || ""}
                                {...formField}
                                value={formField.value as string || ""}
                                className="w-full min-h-[100px] border-t-0 border-x-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-foreground shadow-none resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground"
                              />
                            ) : field.type === "select" ? (
                              <Select
                                onValueChange={formField.onChange}
                                defaultValue={formField.value as string}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full max-w-full border-t-0 border-x-0 border-b border-border rounded-none px-1 focus:ring-0 shadow-none bg-transparent h-10 text-base text-foreground">
                                    <SelectValue placeholder={field.placeholder || t("selectPlaceholder")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-w-[calc(100vw-2rem)]">
                                  {field.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === "file" ? (
                              <div className="relative pt-2">
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  className="hidden"
                                  id={`file-${field.name}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setFileNames(prev => ({ ...prev, [field.name]: file.name }));
                                      formField.onChange(file);
                                    }
                                  }}
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                  <label
                                    htmlFor={`file-${field.name}`}
                                    className="cursor-pointer bg-secondary/10 hover:bg-secondary/20 text-foreground px-4 sm:px-6 py-2 text-xs uppercase tracking-[0.1em] transition-colors rounded-sm border border-border font-serif text-center whitespace-nowrap"
                                  >
                                    {t("chooseFile")}
                                  </label>
                                  <span className="text-xs sm:text-sm text-muted-foreground italic font-serif truncate">
                                    {fileNames[field.name] || t("noFileChosen")}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <Input
                                type={field.type}
                                placeholder={field.placeholder || ""}
                                {...formField}
                                value={formField.value as string || ""}
                                className="w-full border-t-0 border-x-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-foreground shadow-none bg-transparent h-10 text-base text-foreground placeholder:text-muted-foreground"
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-12 flex justify-center">
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full md:w-auto min-w-[300px] uppercase tracking-[0.1em] h-14 text-lg border-border hover:bg-secondary/10 rounded-none font-serif transition-all"
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default AgencyRegistrationForm;
