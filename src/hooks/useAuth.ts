import { signIn } from "next-auth/react";
import { LoginCredentials } from "@/types/auth/types";

export const useAuth = () => {
  const login = async ({ email, password }: LoginCredentials) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  };

  return { login };
};
