"use client";

import { useStyles } from "@/hooks/use-styles";
import Head from "next/head";
import { FC } from "react";

type CustomStyleProviderProps = {
  children: React.ReactNode;
};

const CustomStyleProvider: FC<CustomStyleProviderProps> = ({ children }) => {
  const { userStyles } = useStyles();
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: userStyles || "" }} />
      </Head>
      {children}
    </>
  );
};

export default CustomStyleProvider;
