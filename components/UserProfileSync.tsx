"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export const UserProfileSync = () => {
  const { isAuthenticated } = useConvexAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    if (isAuthenticated) {
      getOrCreateUser();
    }
  }, [isAuthenticated, getOrCreateUser]);

  return null; // This component renders nothing.
};
