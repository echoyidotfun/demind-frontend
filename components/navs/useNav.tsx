"use client";

import { AppLink } from "@/lib/configs/config.types";
import { useParams, usePathname } from "next/navigation";

export function useNav() {
  const pathname = usePathname();
  const { chain } = useParams();
  const swapHref = chain ? "/swap/" + chain : "/swap";

  const defaultAppLinks: AppLink[] = [
    {
      href: swapHref,
      label: "Swap",
    },
  ];

  function linkColorFor(path: string) {
    return pathname.includes(path) ? "font.highlight" : "font.primary";
  }

  return {
    defaultAppLinks,
    linkColorFor,
  };
}
