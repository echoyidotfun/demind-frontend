import { fadeIn } from "@/lib/utils/animations";
import { Box, Link, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { exoFont } from "@/lib/assets/fonts/exo/exo";
export function NavLogo() {
  return (
    <Box
      as={motion.div}
      variants={fadeIn}
      display={{ base: "block", lg: "block" }}
    >
      <Link
        as={NextLink}
        href="/"
        prefetch
        _hover={{ transform: "scale(1.05) rotate(-0.5deg)" }}
      >
        <Text
          className={exoFont.className}
          fontSize="4xl"
          fontWeight="medium"
          letterSpacing="-0.5px"
          variant="special"
        >
          DeMind
        </Text>
      </Link>
    </Box>
  );
}
