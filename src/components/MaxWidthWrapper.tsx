import React, { ReactNode } from "react";

export function MaxWidthWrapper({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
      {children}
    </div>
  );
}
