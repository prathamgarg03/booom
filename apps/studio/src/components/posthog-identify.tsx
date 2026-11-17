import { useEffect, useRef } from "react";
import { useUser } from "@clerk/react";
import posthog from "posthog-js";
import { studioEnv } from "../lib/env";

/** Links PostHog's anonymous visitor to the Clerk user on sign-in, and resets on sign-out. */
export function PostHogIdentify() {
  const { isLoaded, isSignedIn, user } = useUser();
  const identifiedId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !studioEnv.VITE_POSTHOG_KEY) return;

    if (isSignedIn && user && identifiedId.current !== user.id) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      });
      identifiedId.current = user.id;
    } else if (!isSignedIn && identifiedId.current) {
      posthog.reset();
      identifiedId.current = null;
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
