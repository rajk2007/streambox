import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/components/Onboarding/Onboarding";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — StreamBox" }] }),
  component: Onboarding,
});
