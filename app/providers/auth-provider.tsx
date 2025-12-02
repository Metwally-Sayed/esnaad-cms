import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

/**
 * AuthProvider - Protects routes by checking authentication
 * Only use this in protected route groups, not on public auth pages
 */
const AuthProvider = async ({ children }: Props): Promise<React.ReactNode> => {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData?.session) {
    redirect("/admin/login");
  }

  return <>{children}</>;
};

export default AuthProvider;
