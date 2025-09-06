import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-elegant">
      <Navigation />
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className || ""}`}>
        {children}
      </main>
    </div>
  );
}