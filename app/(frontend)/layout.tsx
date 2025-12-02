import { FooterRenderer } from "@/components/admin/globals/footers/footer-renderer";
import { HeaderRenderer } from "@/components/admin/globals/headers/header-renderer";

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderRenderer />
      <main className="w-full pt-20">{children}</main>
      <FooterRenderer />
    </>
  );
}
