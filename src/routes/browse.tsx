import { createFileRoute } from "@tanstack/react-router";
import { BrowseScreen } from "@/components/Screens/BrowseScreen";

export const Route = createFileRoute("/browse")({
  head: () => ({ meta: [{ title: "Browse — StreamBox" }] }),
  component: BrowseScreen,
});
