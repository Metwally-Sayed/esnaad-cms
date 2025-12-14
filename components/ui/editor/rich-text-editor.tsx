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
        .map((node: any) => {
          if (node.content && Array.isArray(node.content)) {
            return node.content.map((n: any) => n.text || "").join("");
          }
          return "";
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
