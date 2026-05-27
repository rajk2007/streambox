import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/components/Screens/SettingsScreen";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — StreamBox" }] }),
  component: SettingsScreen,
});
