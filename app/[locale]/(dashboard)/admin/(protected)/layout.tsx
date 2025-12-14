import AuthProvider from "@/app/[locale]/providers/auth-provider";
import AdminDashboard from "@/components/mvpblocks";

export default async function ProtectedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // This layout wraps all protected admin routes
  return (
    <AuthProvider>
      <AdminDashboard locale={locale}>{children}</AdminDashboard>
    </AuthProvider>
  );
}
