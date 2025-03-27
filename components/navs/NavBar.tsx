"use client";

import { AppLink } from "@/lib/configs/config.types";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { clamp } from "lodash";
import { useNav } from "./useNav";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";
import { useThemeSettings } from "@/lib/services/themes/useThemeSettings";
import DarkModeToggle from "../common/btns/DarkModeToggle";
import { ConnectWallet } from "@/lib/modules/web3/ConnectWallet";
import { Box, BoxProps, Button, HStack, Link, Text } from "@chakra-ui/react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { gochihandFont } from "@/lib/assets/fonts/gochihand/gochihand";

type Props = {
  mobileNav?: ReactNode;
  navLogo?: ReactNode;
  navType?: string;
  appLinks?: AppLink[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  disableBlur?: boolean;
  customLinks?: ReactNode;
  allowCreateWallet?: boolean;
};

function useBoundedScroll(threshold: number) {
  const { scrollY } = useScroll();
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, threshold],
    [0, 1]
  );

  useEffect(() => {
    return scrollY.on("change", (current) => {
      const previous = scrollY.getPrevious() ?? 0;
      const diff = current - previous;
      const newScrollYBounded = scrollYBounded.get() + diff;

      scrollYBounded.set(clamp(newScrollYBounded, 0, threshold));
    });
  }, [threshold, scrollY, scrollYBounded]);

  return { scrollYBounded, scrollYBoundedProgress };
}

function NavLinks({
  appLinks,
  customLinks,
  ...props
}: BoxProps & {
  appLinks: AppLink[];
  customLinks?: ReactNode;
}) {
  const { linkColorFor } = useNav();

  return (
    <HStack fontWeight="medium" spacing="lg" {...props}>
      {appLinks.map((link) => (
        <Box as={motion.div} key={link.href}>
          <Link
            as={NextLink}
            color={linkColorFor(link.href)}
            href={link.href}
            isExternal={link.isExternal}
            prefetch
            variant="nav"
          >
            {link.label}
          </Link>
        </Box>
      ))}
      {customLinks}
    </HStack>
  );
}

// 导航栏右侧操作按钮
export function NavActions() {
  const pathname = usePathname();
  const { isConnected } = useUserAccount();
  const { hideDarkModeToggle } = useThemeSettings();

  const actions = useMemo(() => {
    // landing页
    if (pathname === "/") {
      return [
        {
          el: hideDarkModeToggle ? null : <DarkModeToggle />,
          display: { base: "none", lg: "block" },
        },
        {
          el: (
            <Button
              as={NextLink}
              href="/pools"
              prefetch
              px={7}
              size="md"
              variant="primary"
            >
              Launch app
            </Button>
          ),
          display: { base: "block", lg: "block" },
        },
      ];
    }

    const defaultActions = [
      // {
      //   el: <UserSettings />,
      //   display: { base: 'none', lg: 'block' },
      // },
      {
        el: hideDarkModeToggle ? null : <DarkModeToggle />,
        display: { base: "none", lg: "block" },
      },
      {
        el: <ConnectWallet />,
        display: { base: "block", lg: "block" },
      },
    ];

    return defaultActions;
  }, [pathname, isConnected]);

  return (
    <>
      {actions.map(
        (action, index) =>
          action.el && (
            <Box as={motion.div} display={action.display} key={index}>
              {action.el}
            </Box>
          )
      )}
    </>
  );
}

export function NavBar({
  leftSlot,
  rightSlot,
  disableBlur,
  appLinks,
  customLinks,
  navType,
  ...rest
}: Props & BoxProps) {
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 72) setShowShadow(true);
      else setShowShadow(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYBoundedProgress } = useBoundedScroll(72);
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1]
  );

  const blurEffect = useTransform(
    scrollYBoundedProgressDelayed,
    [0, 1],
    [10, 0]
  );
  const backdropFilter = useMotionTemplate`blur(${blurEffect}px)`;
  const top = useTransform(scrollYBoundedProgressDelayed, [0, 1], [0, -72]);
  const opacity = useTransform(scrollYBoundedProgressDelayed, [0, 1], [1, 0]);

  return (
    <Box
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: showShadow ? "background.level1" : "none",
        opacity: 0.5,
        zIndex: -1,
      }}
      as={motion.div}
      borderColor="border.base"
      boxShadow={showShadow ? "lg" : "none"}
      onScroll={(e) => console.log("Navbar scroll:", e)}
      pos="fixed"
      style={{
        backdropFilter: disableBlur ? "none" : backdropFilter,
        top: disableBlur ? 0 : top,
        opacity: disableBlur ? 1 : opacity,
      }}
      top="0"
      transition="all 0.3s ease-in-out"
      w="full"
      zIndex={100}
      {...rest}
    >
      <HStack
        as="nav"
        justify="space-between"
        padding={{ base: "sm", md: "md" }}
      >
        <HStack
          animate="show"
          as={motion.div}
          initial="hidden"
          onClick={(e) => e.stopPropagation()}
          spacing="xl"
          className="staggered-fade-in"
        >
          <Text
            className={gochihandFont.className}
            fontSize="4xl"
            fontWeight="400"
            letterSpacing="-0.5px"
            variant="special"
          >
            {navType}
          </Text>
          {leftSlot || (
            <>
              {appLinks && (
                <NavLinks
                  appLinks={appLinks}
                  customLinks={customLinks}
                  display={{ base: "none", lg: "flex" }}
                />
              )}
            </>
          )}
        </HStack>
        <HStack
          animate="show"
          as={motion.div}
          initial="hidden"
          onClick={(e) => e.stopPropagation()}
          order={{ md: "2" }}
          className="staggered-fade-in"
        >
          {rightSlot || <NavActions />}
        </HStack>
      </HStack>
    </Box>
  );
}
