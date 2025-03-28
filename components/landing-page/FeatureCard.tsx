import { Heading } from "@chakra-ui/react";

import { Box, VStack, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FeatureCard({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <Box
      as={motion.div}
      variants={itemVariants}
      p="8"
      borderRadius="xl"
      bg="background.baseWithOpacity"
      borderWidth="1px"
      borderColor="border.base"
      _hover={{
        transform: "translateY(-5px)",
        transition: "transform 0.3s",
        borderColor: "button.background.secondary",
      }}
    >
      <VStack align="start" spacing="4">
        <Box
          p="4"
          borderRadius="lg"
          bg="background.level1"
          w="full"
          h="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="visible"
          position="relative"
        >
          <Image
            src={imageSrc}
            alt={title}
            maxH="240px"
            objectFit="contain"
            filter="brightness(0.7) contrast(1.1) drop-shadow(0 8px 8px rgba(0, 0, 0, 0.3))"
            position="absolute"
            top="-15px"
            _hover={{
              transform: "scale(1.02) translateY(-1px)",
              transition: "all 0.3s ease-out",
              filter:
                "brightness(0.8) contrast(1.1) drop-shadow(0 16px 16px rgba(0, 0, 0, 0.3))",
            }}
          />
        </Box>
        <Heading size="md" color="font.primary">
          {title}
        </Heading>
        <Text color="font.secondary">{description}</Text>
      </VStack>
    </Box>
  );
}
