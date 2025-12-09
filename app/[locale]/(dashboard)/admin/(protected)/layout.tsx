import AuthProvider from "@/app/[locale]/providers/auth-provider";
import AdminDashboard from "@/components/mvpblocks";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout wraps all protected admin routes
  return (
    <AuthProvider>
      <AdminDashboard>{children}</AdminDashboard>
    </AuthProvider>
  );
}
