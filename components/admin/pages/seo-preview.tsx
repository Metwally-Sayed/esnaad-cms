"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { PageDetailsFormValues } from "@/lib/validators/page";
import { cn } from "@/lib/utils";
import { Globe, Twitter, Facebook, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// Character limits for optimal SEO
const LIMITS = {
  seoTitle: { min: 30, optimal: 60, max: 70 },
  seoDescription: { min: 120, optimal: 160, max: 170 },
  ogTitle: { min: 30, optimal: 60, max: 95 },
  ogDescription: { min: 80, optimal: 160, max: 200 },
  twitterTitle: { min: 30, optimal: 60, max: 70 },
  twitterDescription: { min: 80, optimal: 160, max: 200 },
};

type LimitKey = keyof typeof LIMITS;

function CharacterCounter({ value, limitKey }: { value: string; limitKey: LimitKey }) {
  const count = value?.length || 0;
  const { min, optimal, max } = LIMITS[limitKey];

  const getColor = () => {
    if (count === 0) return "text-muted-foreground";
    if (count < min) return "text-amber-500";
    if (count <= optimal) return "text-emerald-500";
    if (count <= max) return "text-amber-500";
    return "text-red-500";
  };

  const getStatus = () => {
    if (count === 0) return "Empty";
    if (count < min) return "Too short";
    if (count <= optimal) return "Perfect";
    if (count <= max) return "Acceptable";
    return "Too long";
  };

  return (
    <div className={cn("text-xs font-medium flex items-center gap-1", getColor())}>
      <span>{count}/{optimal}</span>
      <span className="text-muted-foreground">({getStatus()})</span>
    </div>
  );
}

// Google SERP Preview
export function GooglePreview() {
  const form = useFormContext<PageDetailsFormValues>();
  const title = useWatch({ control: form.control, name: "title" });
  const seoTitle = useWatch({ control: form.control, name: "metadata.seoTitle" });
  const seoDescription = useWatch({ control: form.control, name: "metadata.seoDescription" });
  const slug = useWatch({ control: form.control, name: "slug" });

  const displayTitle = seoTitle || title || "Page Title";
  const displayDescription = seoDescription || "Add an SEO description to see how your page will appear in search results...";
  const displayUrl = `esnaad.sa${slug || "/"}`;

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-zinc-900">
      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <Globe className="h-3.5 w-3.5" />
        <span>Google Preview</span>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground truncate">{displayUrl}</div>
        <h3 className="text-lg text-blue-600 dark:text-blue-400 font-medium line-clamp-1 hover:underline cursor-pointer">
          {displayTitle}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{displayDescription}</p>
      </div>
      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Title</span>
        <CharacterCounter value={seoTitle || title || ""} limitKey="seoTitle" />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-muted-foreground">Description</span>
        <CharacterCounter value={seoDescription || ""} limitKey="seoDescription" />
      </div>
    </div>
  );
}

// Social Media Preview (Facebook/LinkedIn style)
export function SocialPreview() {
  const form = useFormContext<PageDetailsFormValues>();
  const title = useWatch({ control: form.control, name: "title" });
  const seoTitle = useWatch({ control: form.control, name: "metadata.seoTitle" });
  const ogTitle = useWatch({ control: form.control, name: "metadata.ogTitle" });
  const ogDescription = useWatch({ control: form.control, name: "metadata.ogDescription" });
  const seoDescription = useWatch({ control: form.control, name: "metadata.seoDescription" });
  const ogImage = useWatch({ control: form.control, name: "metadata.ogImage" });

  const displayTitle = ogTitle || seoTitle || title || "Page Title";
  const displayDescription = ogDescription || seoDescription || "Add a description for social media sharing...";

  return (
    <div className="rounded-lg border bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground border-b">
        <Facebook className="h-3.5 w-3.5" />
        <span>Facebook / LinkedIn Preview</span>
      </div>
      <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
        {ogImage ? (
          <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground text-sm">1200 x 630px recommended</div>
        )}
      </div>
      <div className="p-3 space-y-1 bg-zinc-50 dark:bg-zinc-800">
        <div className="text-xs text-muted-foreground uppercase">esnaad.sa</div>
        <h4 className="font-semibold text-sm line-clamp-1">{displayTitle}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{displayDescription}</p>
      </div>
      <div className="p-3 border-t flex justify-between items-center">
        <span className="text-xs text-muted-foreground">OG Title</span>
        <CharacterCounter value={ogTitle || seoTitle || title || ""} limitKey="ogTitle" />
      </div>
    </div>
  );
}

// Twitter Preview
export function TwitterPreview() {
  const form = useFormContext<PageDetailsFormValues>();
  const title = useWatch({ control: form.control, name: "title" });
  const seoTitle = useWatch({ control: form.control, name: "metadata.seoTitle" });
  const twitterTitle = useWatch({ control: form.control, name: "metadata.twitterTitle" });
  const twitterDescription = useWatch({ control: form.control, name: "metadata.twitterDescription" });
  const ogDescription = useWatch({ control: form.control, name: "metadata.ogDescription" });
  const seoDescription = useWatch({ control: form.control, name: "metadata.seoDescription" });
  const twitterImage = useWatch({ control: form.control, name: "metadata.twitterImage" });
  const ogImage = useWatch({ control: form.control, name: "metadata.ogImage" });

  const displayTitle = twitterTitle || seoTitle || title || "Page Title";
  const displayDescription = twitterDescription || ogDescription || seoDescription || "Add a description...";
  const displayImage = twitterImage || ogImage;

  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground border-b">
        <Twitter className="h-3.5 w-3.5" />
        <span>Twitter / X Preview</span>
      </div>
      <div className="aspect-[2/1] bg-muted flex items-center justify-center">
        {displayImage ? (
          <img src={displayImage} alt="Twitter Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground text-sm">1200 x 600px recommended</div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <h4 className="font-semibold text-sm line-clamp-1">{displayTitle}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{displayDescription}</p>
        <div className="text-xs text-muted-foreground">esnaad.sa</div>
      </div>
    </div>
  );
}

// SEO Score Indicator
export function SeoScoreIndicator() {
  const form = useFormContext<PageDetailsFormValues>();
  const title = useWatch({ control: form.control, name: "title" });
  const seoTitle = useWatch({ control: form.control, name: "metadata.seoTitle" });
  const seoDescription = useWatch({ control: form.control, name: "metadata.seoDescription" });
  const focusKeyword = useWatch({ control: form.control, name: "metadata.focusKeyword" });
  const ogImage = useWatch({ control: form.control, name: "metadata.ogImage" });
  const ogTitle = useWatch({ control: form.control, name: "metadata.ogTitle" });

  const titleLen = (seoTitle || title || "").length;
  const descLen = (seoDescription || "").length;

  const checks = [
    {
      label: "SEO Title",
      passed: titleLen >= 30 && titleLen <= 70,
      tip: "30-70 characters"
    },
    {
      label: "Meta Description",
      passed: descLen >= 120 && descLen <= 170,
      tip: "120-170 characters"
    },
    {
      label: "Focus Keyword",
      passed: Boolean(focusKeyword?.trim()),
      tip: "Add a primary keyword"
    },
    {
      label: "OG Image",
      passed: Boolean(ogImage?.trim()),
      tip: "Add a social share image"
    },
    {
      label: "Social Title",
      passed: Boolean((ogTitle || seoTitle || title)?.trim()),
      tip: "Title for social sharing"
    },
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">SEO Score</h4>
        <div className={cn("text-2xl font-bold", getScoreColor())}>
          {score}% <span className="text-sm font-normal">({getScoreLabel()})</span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="space-y-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {check.passed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            )}
            <span className={check.passed ? "text-muted-foreground" : ""}>{check.label}</span>
            {!check.passed && (
              <span className="text-xs text-muted-foreground">— {check.tip}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
