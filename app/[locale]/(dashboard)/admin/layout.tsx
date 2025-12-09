export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Base layout without auth - auth protection is added per route group
  return <div className="h-full flex flex-col  justify-center">{children}</div>;
}
