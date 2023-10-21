"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { Loader2 } from "lucide-react";

import { trpc } from "../_trpc/client";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        // User is synced with DB.
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },

    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },

    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You&apos;ll be redirected authomatically.</p>
      </div>
    </div>
  );
}
