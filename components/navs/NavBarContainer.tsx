"use client";

import { NavBar, NavActions } from "@/components/navs/NavBar";
import { useNav } from "@/components/navs/useNav";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { Box } from "@chakra-ui/react";
import { fadeIn } from "@/lib/utils/animations";
import { MindLink } from "./MindLink";
import { MobileNav } from "./MobileNav";
import { NavLogo } from "./NavLogo";

export function NavBarContainer() {
  const {
    links: { appLinks, socialLinks },
  } = PROJECT_CONFIG;
  const { defaultAppLinks } = useNav();
  const allAppLinks = [...defaultAppLinks, ...appLinks];

  const mobileNav = (
    <MobileNav
      appLinks={allAppLinks}
      customLinks={
        <>
          <MindLink />
        </>
      }
      socialLinks={socialLinks}
    />
  );

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <NavBar
          NavLogo={<NavLogo />}
          appLinks={allAppLinks}
          customLinks={
            <Box as={motion.div} variants={fadeIn}>
              <MindLink />
            </Box>
          }
          rightSlot={<NavActions mobileNav={mobileNav} />}
        />
      </motion.div>
    </AnimatePresence>
  );
}
