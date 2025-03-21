import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import { RxInfoCircled } from "react-icons/rx";

export const InfoIcon = forwardRef<BoxProps, "div">((props, ref) => {
  return (
    <Box color="grayText" ref={ref} {...props}>
      <RxInfoCircled size={16} />
    </Box>
  );
});
