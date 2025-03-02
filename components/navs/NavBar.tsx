"use client";

import { AppLink } from "@/lib/configs/config.types";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { clamp } from "lodash";
import { useNav } from "./useNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";

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
  const { scrollY } = useScroll();
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, threshold],
    [0, 1]
  );

  useEffect(() => {
    return scrollY.on("change", (current) => {
      const previous = scrollY.getPrevious() ?? current;
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

// export function NavActions(
//   {
//     allowCreateWallet
//   } : {
//     allowCreateWallet?: boolean
//   }
// ) {
//   const pathname = usePathname();
//   const {isConnected } = useUserAccount();
//   // const {hideDarkModeToggle} = useThemeSettings();

//   const actions = useMemo(() => {
//     if(pathname === '/') {
//       return [
//         // {
//         //   el: hideDarkModeToggle ? null : <DarkModeToggle />,
//         //   display: {base: 'none', lg: 'block'}
//         // },
//         {
//           el: (
//             <Link
//               href="/swap"
//               prefetch
//               className="inline-flex items-center justify-center px-7 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
//             >
//               Launch app
//             </Link>
//           ),
//           display: "block"
//         }
//       ]
//     }

//     const defaultActions = [
//       {
//         el: <UserSettings />,
//         display: 'hidden lg:block',
//       },
//       {
//         el: hideDarkModeToggle ? null : <DarkModeToggle />,
//         display: 'hidden lg:block',
//       },
//       {
//         el: (
//           <ConnectWallet
//             connectLabel={allowCreateWallet ? 'Connect' : 'Connect wallet'}
//             showCreateWalletButton={allowCreateWallet}
//           />
//         ),
//         display: 'block',
//       },
//     ]

//     // if (isConnected) {
//     //   return [
//     //     {
//     //       el: <RecentTransactions />,
//     //       display: 'hidden lg:block',
//     //     },
//     //     ...defaultActions,
//     //   ]
//     // }

//     return defaultActions
//   }, [pathname])
// }

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
    <div
      className={`
        fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out
        ${showShadow ? "shadow-lg" : ""}
        ${className}
      `}
      style={{
        backdropFilter: disableBlur ? "none" : `blur(${blurEffect}px)`,
        top: disableBlur ? 0 : `${top.get()}px`,
        opacity: disableBlur ? 1 : opacity.get(),
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
          {/* {rightSlot || <NavActions allowCreateWallet={allowCreateWallet} mobileNav={mobileNav} />} */}
        </div>
      </nav>
    </div>
  );
}
