"use client";

import { Component, type ReactNode } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Log for observability; replace with your logger of choice.
    console.error("ErrorBoundary caught", error);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <Card animation="none" className="border-red-500/30 text-center" role="alert">
          <h2 className="text-foreground mb-2 text-lg font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {this.state.error.message || "An unexpected error occurred."}
          </p>
          <Button variant="primary" size="md" onClick={this.reset}>
            Try again
          </Button>
        </Card>
      );
    }
    return this.props.children;
  }
}
