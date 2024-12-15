"use client";

import { FC, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

type ProtectRouteProviderProps = {
  children: React.ReactNode;
};

const ProtectRouteProvider: FC<ProtectRouteProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isLoading]);

  if (isLoading || !isAuthenticated) return <Loader />;

  return <>{children}</>;
};

export default ProtectRouteProvider;
