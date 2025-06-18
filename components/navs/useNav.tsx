"use client";

import { AppLink } from "@/lib/configs/config.types";
import { useParams, usePathname } from "next/navigation";

export function useNav() {
  const pathname = usePathname();
  const params = useParams();
  const chain =
    params && typeof params.chain === "string" ? params.chain : undefined;
  const swapHref = chain ? "/swap/" + chain : "/swap";

  const defaultAppLinks: AppLink[] = [
    {
      href: swapHref,
      label: "Swap",
    },
    {
      href: "/mind",
      label: "Mind",
      isBeta: true,
    },
    {
      href: "/analytics",
      label: "Analytics",
    },
  ];

  function linkColorFor(path: string) {
    return pathname?.includes(path) ? "font.highlight" : "font.primary";
  }

  return {
    defaultAppLinks,
    linkColorFor,
  };
}
