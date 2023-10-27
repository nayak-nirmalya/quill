import React from "react";

import { trpc } from "@/app/_trpc/client";

export function Messages({ fileId }: { fileId: string }) {
  const {} = trpc;

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"></div>
  );
}
