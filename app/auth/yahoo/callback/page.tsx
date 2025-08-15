"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

const YahooCallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const handleCallback = useAction(api.yahoo.handleCallback);
  const storeTokens = useMutation(api.users.storeYahooTokens);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && user) {
      const clerkId = user.id;
      handleCallback({ code, clerkId }).then((tokens) => {
        if (tokens) {
          storeTokens({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }).then(() => {
            router.push("/dashboard");
          });
        }
      });
    }
  }, [searchParams, router, user, handleCallback, storeTokens]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Processing your Yahoo authentication...</p>
    </div>
  );
};

export default YahooCallbackPage;
