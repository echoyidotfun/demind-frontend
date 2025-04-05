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
import { motion } from "framer-motion";
import { DefaultPageContainer } from "@/components/common/containers/DefaultPageContainer";
import { AppLink } from "@/lib/configs/config.types";
import { ReactNode } from "react";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { SocialIcon } from "@/components/common/icons/SocialIcon";
import NextLink from "next/link";
import { exoFont } from "@/lib/assets/fonts/exo/exo";

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
      maxW={{ base: "100%", md: "36%" }}
    >
      <VStack align="start" color="font.primary" spacing="lg" width="100%">
        <VStack align="start" spacing="sm">
          <Text
            className={exoFont.className}
            fontSize="5xl"
            fontWeight="medium"
            letterSpacing="-0.5px"
            variant="special"
            marginBottom="-4"
          >
            {logoType}
          </Text>
          <Text
            className={exoFont.className}
            fontSize="2xl"
            fontWeight="400"
            letterSpacing="-0.5px"
            variant="secondary"
            marginBottom="4"
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
        "DeMind is an AI-powered DeFi aggregator that enhances trading intents into intelligent actions. By combining aggregated liquidity with momentum-driven strategies, we create an intuitive trading experience where your trading intentions are seamlessly transformed into optimized DeFi strategies.",
    },
    {
      question: "Why build DeMind?",
      answer:
        "DeMind emerged from a vision to revolutionize DeFi trading through the fusion of AI and momentum-based strategies. While showcasing full-stack Web3 development capabilities, it represents our commitment to making DeFi more accessible while preserving the core values of privacy, self-sovereignty, and censorship resistance.",
    },
    {
      question: "How can I contribute?",
      answer: (
        <Text>
          Simply create a PR to our&nbsp;
          {
            <Link
              as={NextLink}
              href="https://github.com/echoyidotfun/demind-contracts"
              target="_blank"
            >
              GitHub
            </Link>
          }
          . DeMind is an open-source project welcoming contributions from the
          community. Whether you're interested in AI integration, DeFi
          strategies, or frontend development, your ideas and contributions can
          help shape the future of intent-driven trading.
        </Text>
      ),
    },
    {
      question: "Disclaimer",
      answer:
        "DeMind is released under MIT licenses. This project is currently for educational and experimental purposes. While we strive for security and reliability, use at your own risk. The code is provided 'as is' without warranty of any kind. Always DYOR before interacting with any smart contracts.",
    },
  ];

  return (
    <VStack align="start" width={{ base: "100%", md: "60%" }} spacing="md">
      <Text
        fontSize="xl"
        fontWeight="semibold"
        variant="secondary"
        align="left"
      >
        FAQ
      </Text>
      <Box position="relative" w="100%" minH="200px">
        <Accordion
          allowToggle
          w="100%"
          onChange={(index) => {
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
                <AccordionButton
                  px="2"
                  py="3"
                  _hover={{ color: "font.linkHover" }}
                >
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
            <HStack spacing={2}>
              <Text variant="secondary" fontSize="sm">
                © 2025.
              </Text>
              <Text
                className={exoFont.className}
                variant="special"
                fontSize="md"
                fontWeight="400"
              >
                DeMind
              </Text>
            </HStack>
          </Stack>
        </VStack>
      </DefaultPageContainer>
    </Box>
  );
}
