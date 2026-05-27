import { createFileRoute } from "@tanstack/react-router";
import { PlayerScreen } from "@/components/Player/PlayerScreen";

export const Route = createFileRoute("/player/$id")({
  component: () => {
    const { id } = Route.useParams();
    return <PlayerScreen id={id} />;
  },
});
