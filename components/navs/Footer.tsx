"use client";

import {
  Stack,
  Divider,
  Text,
  Box,
  VStack,
  HStack,
  Link,
  IconButton,
  AccordionPanel,
  AccordionItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
} from "@chakra-ui/react";
import { staggeredFadeIn } from "@/lib/utils/animations";
import { easeOut, motion } from "framer-motion";
import { DefaultPageContainer } from "@/components/common/containers/DefaultPageContainer";
import { AppLink } from "@/lib/configs/config.types";
import { ReactNode } from "react";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { SocialIcon } from "@/components/common/icons/SocialIcon";
import { gochihandFont } from "@/lib/assets/fonts/gochihand/gochihand";

type CardContentProps = {
  logoType: ReactNode;
  title: string;
  subTitle: string;
};

function CardContent({ logoType, title, subTitle }: CardContentProps) {
  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      justify="space-between"
      py={{ base: "sm", lg: "md" }}
      spacing={{ base: "xl", lg: "md" }}
      w="full"
      maxW={{ base: "100%", md: "35%" }}
    >
      <VStack align="start" color="font.primary" spacing="lg" width="100%">
        <VStack align="start" spacing="sm">
          <Text
            className={gochihandFont.className}
            fontSize="5xl"
            fontWeight="500"
            letterSpacing="-0.5px"
            variant="secondary"
            marginBottom="-4"
          >
            {logoType}
          </Text>
          <Text
            className={gochihandFont.className}
            fontSize="2xl"
            fontWeight="400"
            letterSpacing="-0.5px"
            variant="secondary"
          >
            {title}
          </Text>
          <Text sx={{ textWrap: "balance" }} variant="secondary">
            {subTitle}
          </Text>
        </VStack>
      </VStack>
    </Stack>
  );
}

function FAQ() {
  const faqItems = [
    {
      question: "What is DeMind?",
      answer:
        "DeMind is an personal-built AI-driven aggregator that serves as a gateway to DeFi. My roadmap includes integrating AI agents to enable intent-driven trading through natural language interfaces and optimized DeFi strategies, making crypto interactions more intuitive and efficient.",
    },
    {
      question: "Why I build DeMind?",
      answer:
        "This project emerged from a passion to learn full-stack Web3 development and contribute to the decentralized ecosystem. It represents both a personal journey into blockchain development and a commitment to exploring the future of DeFi while preserving the cypherpunk ethos of privacy, self-sovereignty, and censorship resistance. Also I'm currently searching for a job about full-stack Web3 development, so I need to build a project to show my skills.",
    },
    {
      question: "How can I contribute?",
      answer:
        "All frontend code and smart contracts are open-source. All contributions, issues, or discussions are welcome.",
    },
    {
      question: "Disclaimer",
      answer:
        "DeMind is released under MIT and GPL-3.0 licenses. This project is currently for educational and experimental purposes. While we strive for security and reliability, use at your own risk. The code is provided 'as is' without warranty of any kind. Always do your own research before interacting with any smart contracts.",
    },
  ];

  return (
    <VStack align="start" width={{ base: "100%", md: "60%" }} spacing="md">
      <Text fontSize="lg" fontWeight="bold" variant="secondary" align="left">
        FAQ
      </Text>
      <Box position="relative" w="100%" minH="200px">
        <Accordion
          allowToggle
          w="100%"
          onChange={(index) => {
            // 当展开时，确保滚动到可见区域
            if (index !== -1) {
              setTimeout(() => {
                const el = document.getElementById(`faq-item-${index}`);
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 100);
            }
          }}
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={index} border="none">
              <h2>
                <AccordionButton px="2" py="3" _hover={{ bg: "transparent" }}>
                  <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                    {item.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} px="2">
                <Box
                  as={motion.div}
                  animate={{ opacity: 1, height: "auto" }}
                  initial={{ opacity: 0, height: 0 }}
                  transition={{ duration: 1, ease: "easeOut" } as any}
                  maxH="300px" // 限制最大高度
                >
                  <Box
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      lineHeight: "md",
                      maxWidth: "90%",
                    }}
                    fontSize="sm"
                    textAlign="left"
                  >
                    {item.answer}
                  </Box>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </VStack>
  );
}

function SocialLinks({ socialLinks }: { socialLinks: AppLink[] }) {
  return (
    <HStack spacing="xs" w={{ base: "full", lg: "auto" }}>
      {socialLinks.map(({ href, iconType }) => (
        <IconButton
          aria-label="Social icon"
          as={Link}
          bg="transparent"
          h="24px"
          href={href}
          key={href}
          rounded="full"
          variant="unstyled"
          w="24px"
        >
          <SocialIcon iconType={iconType} />
        </IconButton>
      ))}
    </HStack>
  );
}

type FooterProps = {
  logoType: ReactNode;
  title: string;
  subTitle: string;
};

export function Footer({ logoType, title, subTitle }: FooterProps) {
  const {
    links: { socialLinks },
  } = PROJECT_CONFIG;

  return (
    <Box as="footer" background="background.level0WithOpacity" shadow="innerLg">
      <DefaultPageContainer py="md">
        <VStack align="start" pt="md" spacing="md" py="0">
          <HStack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: "md", md: "md" }}
            w="full"
            justify="space-between"
            py={{ base: "sm", lg: "md" }}
            align="flex-start"
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            <CardContent
              logoType={logoType}
              subTitle={subTitle}
              title={title}
            />
            <FAQ />
          </HStack>
          <Divider />
          <Stack
            align="start"
            alignItems={{ base: "none", lg: "center" }}
            animate="show"
            as={motion.div}
            direction={{ base: "column", lg: "row" }}
            gap="md"
            initial="hidden"
            justify="space-between"
            variants={staggeredFadeIn}
            w="full"
          >
            <SocialLinks socialLinks={socialLinks} />
          </Stack>
        </VStack>
      </DefaultPageContainer>
    </Box>
  );
}
