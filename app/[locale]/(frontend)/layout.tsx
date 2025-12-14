import { FooterRenderer } from "@/components/admin/globals/footers/footer-renderer";
import { HeaderRenderer } from "@/components/admin/globals/headers/header-renderer";

export default async function FrontLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  return (
    <>
      <HeaderRenderer locale={locale} />
      <main className="w-full">{children}</main>
      <FooterRenderer locale={locale} />
    </>
  );
}
