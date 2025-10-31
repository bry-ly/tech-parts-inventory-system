import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

// Example: Getting Session on a server action
export const someAuthenticatedAction = async () => {
  "use server";
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};
