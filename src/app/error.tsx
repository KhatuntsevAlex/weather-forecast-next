"use client";

import { useEffect } from "react";
import { Button, Card } from "@/shared/ui";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card animation="none" className="border-red-500/30 text-center" role="alert">
        <h2 className="text-foreground mb-2 text-2xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button variant="primary" size="md" onClick={reset}>
          Try again
        </Button>
      </Card>
    </div>
  );
}
