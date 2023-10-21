import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

import { trpc } from "../_trpc/client";

export const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const {} = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        // User is synced with DB.
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
  });

  return <div>Page</div>;
};
