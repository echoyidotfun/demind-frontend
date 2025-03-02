import React, { PropsWithChildren } from "react";

type Props = {
  noVerticalPadding?: boolean;
  bg?: string;
  className?: string;
};

export function DefaultPageContainer({
  children,
  noVerticalPadding,
  bg,
  className = "",
}: PropsWithChildren & Props) {
  return (
    <div
      className={`${bg || ""}`}
      style={{ paddingTop: noVerticalPadding ? "0px" : "72px" }}
    >
      <div
        className={`container, mx-auto max-w-7xl overflow-x-hidden md:overflow-visible px4 md:px-6
                ${noVerticalPadding ? "py-0" : "py-8 md:py-12"} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
