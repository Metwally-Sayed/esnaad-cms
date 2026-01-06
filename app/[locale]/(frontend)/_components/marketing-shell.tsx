import { FooterRenderer } from "@/components/admin/globals/footers/footer-renderer";
import { HeaderRenderer } from "@/components/admin/globals/headers/header-renderer";

type MarketingShellProps = {
  locale: string;
  children: React.ReactNode;
};

export function MarketingShell({ locale, children }: MarketingShellProps) {
  return (
    <>
      <HeaderRenderer locale={locale} />
      <main className="w-full">{children}</main>
      <FooterRenderer locale={locale} />
    </>
  );
}
