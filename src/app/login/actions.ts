"use server";

import { redirect } from "next/navigation";
import { verifyCredentials, setSessionCookie } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const { connection } = await import("next/server");
  await connection();

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const valid = await verifyCredentials(username, password);
  if (!valid) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  await setSessionCookie(username);
  redirect("/registro");
}
