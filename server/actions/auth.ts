"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const { success, data, error } = await loginSchema.safeParseAsync({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!success) {
    return {
      errors: error?.flatten().fieldErrors,
    };
  }

  const { email, password } = data;

  // Sign in the user
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  // validate the form data

  const { success, data, error } = await registerSchema.safeParseAsync({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    name: formData.get("name") as string,
    role: formData.get("role") as string,
  });

  if (!success) {
    return {
      errors: error?.flatten().fieldErrors,
    };
  }

  const { email, password, name, role } = data;

  // create the user
  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  // Update user role if specified
  if (user && role) {
    await prisma.user.update({
      where: { id: user.user.id },
      data: { role },
    });
  }

  redirect("/admin");
}

export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
}
