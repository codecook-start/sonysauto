"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { FC } from "react";

type ProgressBarProviderProps = {
  children: React.ReactNode;
};

const ProgressBarProvider: FC<ProgressBarProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="0.25rem"
        color="#2563eb"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarProvider;
