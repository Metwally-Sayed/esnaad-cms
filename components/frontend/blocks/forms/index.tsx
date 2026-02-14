/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { BlockContent } from "@/lib/block-variants";

type FormContent = BlockContent & {
  fields?: unknown[];
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  successMessage?: string;
  [key: string]: unknown;
};

type FormFactoryProps = {
  variant: string;
  content: FormContent;
};

function FormLoadingSkeleton() {
  return (
    <section className="bg-background px-4 py-20">
      <div className="mx-auto max-w-3xl animate-pulse space-y-8">
        <div className="mx-auto h-8 w-1/2 rounded bg-muted/40" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-12 rounded bg-muted/30 md:col-span-2" />
          <div className="h-12 rounded bg-muted/30" />
          <div className="h-12 rounded bg-muted/30" />
          <div className="h-32 rounded bg-muted/30 md:col-span-2" />
        </div>
        <div className="mx-auto h-12 w-56 rounded bg-muted/40" />
      </div>
    </section>
  );
}

const FormDefaultClient = dynamic(() => import("./FormDefault"), {
  ssr: false,
  loading: () => <FormLoadingSkeleton />,
});

const AgencyRegistrationFormClient = dynamic(() => import("./AgencyRegistrationForm"), {
  ssr: false,
  loading: () => <FormLoadingSkeleton />,
});

export const FormFactory = ({ variant, content }: FormFactoryProps) => {
  switch (variant) {
    case "agency-registration":
      return <AgencyRegistrationFormClient content={content as any} />;
    case "default":
    default:
      return <FormDefaultClient content={content as any} />;
  }
};
