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
      bottom={0}
      h="1200px"
      left={-10}
      position="absolute"
      top={-150}
      w="100%"
    >
      <AnimatePresence>
        <motion.div
          animate={shouldAnimate ? { opacity: 0.5, willChange: "opacity" } : {}}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0.15 }}
          ref={ref}
          style={{
            position: "absolute",
            top: -50,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Image
            alt="background"
            sizes="120vw"
            src="/images/misc/LandingHeroBg.png"
            filter="brightness(0.9) contrast(0.9)"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
