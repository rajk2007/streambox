import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/Screens/DetailPage";

export const Route = createFileRoute("/detail/$id")({
  component: () => {
    const { id } = Route.useParams();
    return <DetailPage id={id} />;
  },
});
