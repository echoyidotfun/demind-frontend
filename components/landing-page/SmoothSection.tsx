import { Box } from "@chakra-ui/react";

export function SmoothSection() {
  return (
    <Box
      position="relative"
      h={{ base: "20vh", md: "30vh" }}
      bg="transparent"
      mt="-5vh"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transform: "skewY(-6deg)",
      }}
    >
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        height="100%"
        background="linear-gradient(180deg, transparent, background.baseWithOpacity 100%)"
        style={{
          transform: "translateY(1px)", // 防止出现缝隙
        }}
      />
    </Box>
  );
}
