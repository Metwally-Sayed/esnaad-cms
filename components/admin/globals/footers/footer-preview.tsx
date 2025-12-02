"use client";

import MainFooter from "./main-footer";
import ResizableFooter from "./resizable-footer";
import type { FooterListItem } from "./types";

interface FooterPreviewProps {
  footer: FooterListItem;
}

const FooterPreview = ({ footer }: FooterPreviewProps) => {
  const templateProps = {
    links: footer.links,
    isLoading: false,
  };

  const preview =
    footer.name === "Resizable Footer" ? (
      <ResizableFooter {...templateProps} />
    ) : (
      <MainFooter {...templateProps} />
    );

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Footer Preview</h4>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="max-h-[460px] overflow-auto">{preview}</div>
      </div>
    </div>
  );
};

export default FooterPreview;
