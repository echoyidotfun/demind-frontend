// app/layouts/base-layout.tsx

import React from "react";
import { Footer } from "@/components/navs/Footer";
import { NavBarContainer } from "@/components/navs/NavBarContainer";
export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBarContainer />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
