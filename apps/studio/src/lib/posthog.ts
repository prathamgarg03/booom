import posthog from "posthog-js";
import { studioEnv } from "./env";

export function initPostHog() {
  if (!studioEnv.VITE_POSTHOG_KEY) return;
  posthog.init(studioEnv.VITE_POSTHOG_KEY, {
    // Proxied through /ingest (vercel.json in prod, vite.config.ts in dev) so ad-blockers don't drop events.
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-08-30",
    person_profiles: "identified_only",
  });
  posthog.register({ app: "studio" });
}
