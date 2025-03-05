"use client";

import { AppLink } from "@/lib/configs/config.types";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { clamp } from "lodash";
import { useNav } from "./useNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";
import { useThemeSettings } from "@/lib/services/themes/useThemeSettings";
import DarkModeToggle from "../common/DarkModeToggle";
import { ConnectWallet } from "@/lib/modules/web3/ConnectWallet";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

type Props = {
  mobileNav?: ReactNode;
  navLogo?: ReactNode;
  appLinks?: AppLink[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  disableBlur?: boolean;
  customLinks?: ReactNode;
  allowCreateWallet?: boolean;
};

function useBoundedScroll(threshold: number) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollYBounded, setScrollYBounded] = useState(0);
  const [scrollYBoundedProgress, setScrollYBoundedProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const previous = scrollY;
      const diff = current - previous;
      const newScrollYBounded = clamp(scrollYBounded + diff, 0, threshold);

      setScrollY(current);
      setScrollYBounded(newScrollYBounded);
      setScrollYBoundedProgress(newScrollYBounded / threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY, scrollYBounded, threshold]);

  return { scrollYBounded, scrollYBoundedProgress };
}

function NavLinks({
  appLinks,
  customLinks,
  className = "",
}: {
  appLinks: AppLink[];
  customLinks?: ReactNode;
  className?: string;
}) {
  const { linkColorFor } = useNav();

  return (
    <div className={`flex items-center font-medium space-x-6 ${className}`}>
      {appLinks.map((link) => (
        <div key={link.href} className="animate-fade-in">
          <Link
            href={link.href}
            className={`hover:text-primary-500 ${linkColorFor(link.href)}`}
            target={link.isExternal ? "_blank" : undefined}
            rel={link.isExternal ? "noopener noreferrer" : undefined}
            prefetch
          >
            {link.label}
          </Link>
        </div>
      ))}
      {/* {customLinks} */}
    </div>
  );
}

// 导航栏右侧操作按钮
export function NavActions({
  allowCreateWallet,
}: {
  allowCreateWallet?: boolean;
}) {
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
            <Link
              href="/swap"
              prefetch
              className="inline-flex items-center justify-center px-7 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
            >
              Launch app
            </Link>
          ),
          display: "block",
        },
      ];
    }

    const defaultActions = [
      {
        el: hideDarkModeToggle ? null : <DarkModeToggle />,
        display: "hidden lg:block",
      },
      {
        el: (
          <ConnectWallet
            connectLabel={allowCreateWallet ? "Connect" : "Connect wallet"}
            showCreateWalletButton={allowCreateWallet}
          />
        ),
        display: "block",
      },
    ];

    // if (isConnected) {
    //   return [
    //     {
    //       el: <RecentTransactions />,
    //       display: 'hidden lg:block',
    //     },
    //     ...defaultActions,
    //   ]
    // }

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
  navLogo,
  mobileNav,
  customLinks,
  allowCreateWallet,
  className = "",
}: Props & { className?: string }) {
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
  const scrollYBoundedProgressDelayed =
    scrollYBoundedProgress < 0.5 ? 0 : (scrollYBoundedProgress - 0.5) / 0.5;

  // 根据滚动进度计算模糊样式
  const blurEffect = 10 - scrollYBoundedProgressDelayed * 10;
  const top = scrollYBoundedProgressDelayed * -72;
  const opacity = 1 - scrollYBoundedProgressDelayed;

  return (
    <div
      className={`
        fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out
        ${showShadow ? "shadow-lg" : ""}
        ${className}
      `}
      style={{
        backdropFilter: disableBlur ? "none" : `blur(${blurEffect}px)`,
        top: disableBlur ? 0 : top,
        opacity: disableBlur ? 1 : opacity,
      }}
      onScroll={(e) => console.log("Navbar scroll:", e)}
    >
      <div
        className="absolute inset-0 -z-10 bg-background-level1 opacity-50"
        style={{ display: showShadow ? "block" : "none" }}
      ></div>

      <nav className="flex justify-between items-center p-4 md:p-6">
        <div
          className="flex items-center space-x-6 animate-staggered-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {leftSlot || (
            <>
              {navLogo}
              {appLinks && (
                <NavLinks
                  appLinks={appLinks}
                  customLinks={customLinks}
                  className="hidden lg:flex"
                />
              )}
            </>
          )}
        </div>

        <div
          className="flex items-center space-x-4 animate-staggered-fade-in md:order-2"
          onClick={(e) => e.stopPropagation()}
        >
          {rightSlot || <NavActions allowCreateWallet={allowCreateWallet} />}
        </div>
      </nav>
    </div>
  );
}
