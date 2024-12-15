import { cn } from "@/lib/utils";
import React from "react";

const Loader = ({
  className,
  style = { minHeight: "calc(100vh - 4rem)" },
  size = "5em",
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: string;
}) => {
  return (
    <div
      className={cn("flex h-96 items-center justify-center", className)}
      style={style}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
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
};

export default Loader;
