export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  // Base layout without auth - auth protection is added per route group
  return (
    <div className="h-full flex flex-col justify-center" data-rtl={isRTL}>
      {children}
    </div>
  );
}
