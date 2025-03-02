"use client";
import { NavBar } from "./NavBar";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { useNav } from "./useNav";
import { AnimatePresence, motion } from "framer-motion";

export function NavBarContainer() {
  // PROJECT_CONFIG
  const {
    links: { appLinks, socialLinks },
  } = PROJECT_CONFIG;
  const { defaultAppLinks } = useNav();
  const allAppLinks = [...defaultAppLinks, ...appLinks];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <NavBar appLinks={allAppLinks} />
      </motion.div>
    </AnimatePresence>
  );
}
