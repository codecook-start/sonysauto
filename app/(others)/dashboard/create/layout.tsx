"use client";

import ProtectRouteProvider from "@/providers/ProtectRouteProvider";
import { FC } from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return <ProtectRouteProvider>{children}</ProtectRouteProvider>;
};

export default DashboardLayout;
