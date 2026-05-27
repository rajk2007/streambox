import { createFileRoute } from "@tanstack/react-router";
import { SearchScreen } from "@/components/Screens/SearchScreen";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — StreamBox" }] }),
  component: SearchScreen,
});
