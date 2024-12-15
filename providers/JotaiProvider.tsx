"use client";

import { DevTools } from "jotai-devtools";
import { FC } from "react";

import "jotai-devtools/styles.css";

type JotaiProviderProps = {
  children: React.ReactNode;
};

const JotaiProvider: FC<JotaiProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <DevTools position="top-left" isInitialOpen={false} />
    </>
  );
};

export default JotaiProvider;
