"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--toast-bg)",
          border: "1px solid var(--toast-border)",
          color: "var(--toast-color)",
        },
      }}
    />
  );
}
