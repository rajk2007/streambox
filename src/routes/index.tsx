import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/Screens/HomeScreen";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "StreamBox — Home" }] }),
  component: HomeScreen,
});
