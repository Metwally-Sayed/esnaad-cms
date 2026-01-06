"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { JSONContent } from "novel";

interface RichTextEditorProps {
  initialValue?: JSONContent | string;
  onChange?: (value: JSONContent) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  initialValue,
  onChange,
  placeholder = "Start typing...",
  className,
}: RichTextEditorProps) {
  // Convert initial JSONContent to plain text for display
  const getInitialText = () => {
    if (!initialValue) return "";
    if (typeof initialValue === "string") return initialValue;
    // Extract text from JSONContent (simplified - gets first paragraph)
    if (initialValue.content && Array.isArray(initialValue.content)) {
      return initialValue.content
        .map((node) => {
          const nodeContent =
            node &&
            typeof node === "object" &&
            "content" in node &&
            Array.isArray((node as { content?: unknown }).content)
              ? ((node as { content?: unknown }).content as unknown[])
              : [];

          return nodeContent
            .map((child) =>
              child && typeof child === "object" && "text" in child
                ? ((child as { text?: string }).text ?? "")
                : ""
            )
            .join("");
        })
        .join("\n");
    }
    return "";
  };

  const [text, setText] = useState(getInitialText());

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    // Convert plain text to JSONContent structure
    const jsonContent: JSONContent = {
      type: "doc",
      content: value.split("\n").map((line) => ({
        type: "paragraph",
        content: line ? [{ type: "text", text: line }] : [],
      })),
    };

    onChange?.(jsonContent);
  };

  return (
    <Textarea
      value={text}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        "min-h-[200px] w-full font-sans",
        className
      )}
    />
  );
}
