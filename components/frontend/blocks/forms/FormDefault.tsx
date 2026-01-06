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
  type: "text" | "email" | "tel" | "textarea" | "file" | "select";
  placeholder?: string;
  required?: boolean;
  width?: "full" | "half";
  options?: { label: string; value: string }[];
};

type FormContent = {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  successMessage?: string;
  fields?: FieldConfig[];
};

const generateSchema = (fields: FieldConfig[], t: (key: string) => string) => {
  const schemaMap: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let validator: z.ZodTypeAny = z.string();

    if (field.type === "email") {
      validator = (validator as z.ZodString).email(t("invalidEmail"));
    }

    if (field.type === "tel") {
      // For tel, we might want to validate length, but keeping it simple
      validator = (validator as z.ZodString).min(5, t("invalidPhone"));
    }

    if (field.type === "file") {
      // File validation is tricky with z.any(), usually handled separately or with custom checks
      validator = z.any();
    }

    if (!field.required) {
      validator = validator.optional();
    } else {
      if (field.type !== "file") {
        validator = (validator as z.ZodString).min(1, `${field.label} ${t("fieldRequired")}`);
      }
    }

    schemaMap[field.name] = validator;

    // Special case for 'tel': we need a country code field
    if (field.type === "tel") {
      schemaMap[`${field.name}_code`] = z.string().optional();
    }
  });

  return z.object(schemaMap);
};

const FormDefault = ({ content }: { content: FormContent }) => {
  const t = useTranslations("Forms");
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fields = useMemo(() => content.fields || [], [content.fields]);
  const title = content.title || t("contactUs");
  const subtitle = content.subtitle;
  const submitLabel = content.submitLabel || t("submit");
  const successMessage = content.successMessage || t("thankYouSubmission");

  const formSchema = useMemo(() => generateSchema(fields, t), [fields, t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.name] = "";
      if (field.type === "tel") {
        acc[`${field.name}_code`] = "+971";
      }
      return acc;
    }, {}),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted:", values);
    setSubmitted(true);
    // Here you would typically send data to an API
  }

  if (submitted) {
    return (
      <section className="py-20 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-light uppercase tracking-widest">{title}</h2>
          <div className="p-8 bg-secondary/10 rounded-lg">
            <p className="text-lg text-foreground/80">{successMessage}</p>
            <Button
              variant="outline"
              className="mt-6 uppercase tracking-widest"
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
    <section className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          {title && (
             <h2 className="text-2xl font-light uppercase tracking-widest mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl leading-relaxed uppercase tracking-wide text-foreground font-light max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {fields.map((field) => {
                const isHalf = field.width === "half";
                const colSpan = isHalf ? "md:col-span-1" : "md:col-span-2";

                if (field.type === "tel") {
                  return (
                    <div key={field.name} className={colSpan}>
                      <FormLabel className="uppercase text-xs tracking-widest text-foreground/80 mb-2 block">
                        {field.label}
                      </FormLabel>
                      <div className="grid grid-cols-[50px_1fr] gap-1 items-end">
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
                                  <SelectTrigger className="border-t-0 border-x-0 border-b border-border rounded-none px-0 focus:ring-0 shadow-none bg-transparent dark:bg-transparent">
                                    <SelectValue placeholder={t("code")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
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
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={field.placeholder || ""}
                                  {...inputField}
                                  value={inputField.value as string || ""}
                                  className="border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/50 shadow-none bg-transparent dark:bg-transparent"
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
                          <FormLabel className="uppercase text-xs tracking-widest text-foreground/80">
                            {field.label}
                          </FormLabel>
                          <FormControl>
                            {field.type === "textarea" ? (
                              <Textarea
                                placeholder={field.placeholder || ""}
                                {...formField}
                                value={formField.value as string || ""}
                                className="min-h-[100px] border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/50 shadow-none resize-none bg-transparent dark:bg-transparent"
                              />
                            ) : field.type === "select" ? (
                              <Select
                                onValueChange={formField.onChange}
                                defaultValue={formField.value as string}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-t-0 border-x-0 border-b border-border rounded-none px-0 focus:ring-0 shadow-none bg-transparent dark:bg-transparent">
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
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  className="hidden"
                                  id={`file-${field.name}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setFileNames(prev => ({ ...prev, [field.name]: file.name }));
                                      formField.onChange(file);
                                    }
                                  }}
                                  // File input value handling is special, don't pass value prop directly
                                />
                                <div className="flex items-center border-b border-border pb-2">
                                  <label
                                    htmlFor={`file-${field.name}`}
                                    className="cursor-pointer bg-secondary/20 hover:bg-secondary/30 text-foreground px-4 py-2 text-xs uppercase tracking-widest transition-colors rounded-sm"
                                  >
                                    {t("chooseFile")}
                                  </label>
                                  <span className="ml-4 text-sm text-muted-foreground">
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
                                className="border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/50 shadow-none bg-transparent dark:bg-transparent"
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

            <div className="pt-8 flex justify-center">
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full md:w-auto min-w-[300px] uppercase tracking-widest h-14 text-lg border-border hover:bg-secondary/10 rounded-none"
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

export default FormDefault;
