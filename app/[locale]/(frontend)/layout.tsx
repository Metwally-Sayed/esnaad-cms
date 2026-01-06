import { MarketingShell } from "./_components/marketing-shell";

export default async function FrontLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  return (
    <MarketingShell locale={locale}>{children}</MarketingShell>
  );
}
