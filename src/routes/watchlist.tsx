import { createFileRoute } from "@tanstack/react-router";
import { WatchlistScreen } from "@/components/Screens/WatchlistScreen";

export const Route = createFileRoute("/watchlist")({
  head: () => ({ meta: [{ title: "Watchlist — StreamBox" }] }),
  component: WatchlistScreen,
});
