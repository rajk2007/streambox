import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <a href="/" className="inline-block mt-6 px-4 py-2 rounded-md text-white" style={{ background: "#DC586D" }}>Go home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 px-4 py-2 rounded-md text-white" style={{ background: "#DC586D" }}>Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0A0A0A" },
      { title: "StreamBox — Stream Everything" },
      { name: "description", content: "Premium dark-themed streaming app for movies, series and anime." },
      { property: "og:title", content: "StreamBox — Stream Everything" },
      { name: "twitter:title", content: "StreamBox — Stream Everything" },
      { property: "og:description", content: "Premium dark-themed streaming app for movies, series and anime." },
      { name: "twitter:description", content: "Premium dark-themed streaming app for movies, series and anime." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/430cd0bf-a1f1-4d9b-8590-da7997be4c17/id-preview-ad3a0a2b--f5059fbf-4629-4041-9fc1-649eb8a1d69d.lovable.app-1779881667948.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/430cd0bf-a1f1-4d9b-8590-da7997be4c17/id-preview-ad3a0a2b--f5059fbf-4629-4041-9fc1-649eb8a1d69d.lovable.app-1779881667948.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="bg-background">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}
