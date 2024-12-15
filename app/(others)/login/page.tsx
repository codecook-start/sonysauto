"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

const Login = () => {
  const { isAuthenticated, isLoading, isLoginLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard/create");
    }
  }, [isAuthenticated, router, isLoading]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  if (isLoading && !isAuthenticated)
    return (
      <div
        className="flex h-96 items-center justify-center"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="5em"
          height="5em"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinnersPulse30"
              fill="freeze"
              attributeName="r"
              begin="0;svgSpinnersPulse32.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="0;11"
            ></animate>
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="0;svgSpinnersPulse32.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="1;0"
            ></animate>
          </circle>
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinnersPulse31"
              fill="freeze"
              attributeName="r"
              begin="svgSpinnersPulse30.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="0;11"
            ></animate>
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="svgSpinnersPulse30.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="1;0"
            ></animate>
          </circle>
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinnersPulse32"
              fill="freeze"
              attributeName="r"
              begin="svgSpinnersPulse30.begin+0.8s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="0;11"
            ></animate>
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="svgSpinnersPulse30.begin+0.8s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="1;0"
            ></animate>
          </circle>
        </svg>
      </div>
    );
  return (
    <div className="my-20 flex min-h-[60vh] items-center justify-center">
      <div className="container-sm">
        <h2 className="my-4 text-2xl font-bold">Sign in</h2>
        <form
          onSubmit={handleLogin}
          className="form-group space-y-4 rounded-3xl bg-neutral-800 p-8 py-16 font-semibold text-white"
        >
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-auto w-full rounded-full border px-8 py-4 text-black"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-auto w-full rounded-full border px-8 py-4 text-black"
          />
          <Button
            className="block h-auto w-full rounded-full bg-blue-600 px-8 py-4 text-center hover:bg-blue-700"
            disabled={isLoading}
          >
            {!isLoginLoading ? "Sign in" : "Loading..."}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
