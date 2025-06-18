"use client";

import { BaseLayout } from "@/app/layout/base-layout";
import { Box } from "@chakra-ui/react";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout showFooter={false}>
      <Box position="relative" height="calc(100vh - 72px)" marginTop="72px">
        {children}
      </Box>
    </BaseLayout>
  );
}
