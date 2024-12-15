"use client";

import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { useMutation, useQuery } from "react-query";
import { authAtom } from "@/jotai/authAtom";

type DecodedToken = {
  id: string;
  role: string;
};

const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const router = useRouter();

  const checkAuthStatus = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setAuth({ isAuthenticated: true, user: decodedToken });
      } catch (error) {
        console.error("Invalid token:", error);
        setAuth({ isAuthenticated: false });
        router.push("/login");
      }
    } else {
      setAuth({ isAuthenticated: false });
    }
  };

  const { isLoading: isTokenLoading } = useQuery("checkAuth", checkAuthStatus, {
    retry: false,
  });

  const loginMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token } = response.data;

      if (token) {
        window.localStorage.setItem("token", token);
        const decodedToken = jwtDecode<DecodedToken>(token);
        setAuth({ isAuthenticated: true, user: decodedToken });
        router.push("/dashboard/create");
      } else {
        throw new Error("Login failed: No token returned");
      }
    },
    {
      onError: (error) => {
        console.error("Login failed:", error);
      },
    },
  );

  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({ isAuthenticated: false });
    router.push("/login");
  };

  return {
    ...auth,
    login: loginMutation.mutate,
    isLoading: isTokenLoading,
    isLoginLoading: loginMutation.isLoading,
    isError: loginMutation.isError,
    logout,
  };
};

export default useAuth;
