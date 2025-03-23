"use client";

import { NavBar, NavActions } from "@/components/navs/NavBar";
import { useNav } from "@/components/navs/useNav";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";

export function NavBarContainer() {
  const {
    links: { appLinks },
  } = PROJECT_CONFIG;
  const { defaultAppLinks } = useNav();
  const allAppLinks = [...defaultAppLinks, ...appLinks];

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <NavBar
          appLinks={allAppLinks}
          // navLogo={<NavLogo />}
          rightSlot={<NavActions />}
        />
      </motion.div>
    </AnimatePresence>
  );
}
