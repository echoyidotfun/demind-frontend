import { Button } from "@chakra-ui/react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { SocialIcon } from "../common/icons/SocialIcon";
import NextLink from "next/link";

export function LaunchAppButton() {
  return (
    <Button
      as={NextLink}
      href="/swap"
      size="lg"
      rightIcon={<FiArrowRight />}
      _hover={{
        transform: "translateY(-1px) scale(1.05)",
        backgroundSize: "120% 100%",
        "& svg": {
          animation: "slideRight 1s infinite",
        },
      }}
      variant="primary"
      sx={{
        "@keyframes slideRight": {
          "0%": {
            transform: "translateX(0)",
            opacity: 1,
          },
          "50%": {
            transform: "translateX(10px)",
            opacity: 0,
          },
          "51%": {
            transform: "translateX(-10px)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
      }}
    >
      Launch App
    </Button>
  );
}

export function ContributeButton() {
  return (
    <Button
      as={NextLink}
      href="https://github.com/echoyidotfun/demind-contracts"
      size="lg"
      rightIcon={<FiArrowUpRight className="slide-icon" />}
      _hover={{
        transform: "translateY(-1px) scale(1.05)",
        backgroundSize: "120% 100%",
        "& .slide-icon": {
          animation: "slideUpRight 1s infinite",
        },
      }}
      sx={{
        "@keyframes slideUpRight": {
          "0%": {
            transform: "translateY(0) translateX(0)",
            opacity: 1,
          },
          "50%": {
            transform: "translateY(-10px) translateX(10px)",
            opacity: 0,
          },
          "51%": {
            transform: "translateY(10px) translateX(-10px)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0) translateX(0)",
            opacity: 1,
          },
        },
      }}
      variant="primary"
    >
      <>
        Contribute&nbsp;
        <SocialIcon iconType="github" />
      </>
    </Button>
  );
}
