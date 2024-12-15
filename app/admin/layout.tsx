"use client";

import ProtectRouteProvider from "@/providers/ProtectRouteProvider";
import { FC } from "react";

type AdminLayoutProps = {
  children: React.ReactNode;
};
const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return <ProtectRouteProvider>{children}</ProtectRouteProvider>;
};

export default AdminLayout;
