/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Box, Image } from "@chakra-ui/react";

export function LandingHeroImg() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      setShouldAnimate(true);
    }
  }, [isInView]);

  return (
    <Box
      position="absolute"
      top={{ base: "-50px", md: "-200px" }}
      left={{ base: "-70%", md: "-5%" }}
      right={{ base: "50%", md: 0 }}
      h={{ base: "150vh", md: "1200px" }}
      overflow="hidden"
      zIndex={1}
      w={{ base: "200%", md: "100%" }}
      _after={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: "blur(0.1px)",
        mixBlendMode: "multiply",
        zIndex: 2,
      }}
    >
      <AnimatePresence>
        <motion.div
          animate={shouldAnimate ? { opacity: 0.5, willChange: "opacity" } : {}}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0.15 }}
          ref={ref}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Image
            alt="background"
            src="/images/misc/LandingHeroBg.png"
            filter="brightness(0.8) contrast(0.8) saturate(1.1)"
            style={{
              width: "120%",
              height: "120%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
