"use client";

import { useDisclosure } from "@chakra-ui/hooks";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { useNav } from "./useNav";
import { SocialIcon } from "@/components/common/icons/SocialIcon";
import { AppLink } from "@/lib/configs/config.types";
import { exoFont } from "@/lib/assets/fonts/exo/exo";

type NavLinkProps = {
  appLinks: AppLink[];
  customLinks?: React.ReactNode;
  onClick?: () => void;
};

type SocialLinkProps = {
  socialLinks: AppLink[];
};

type MobileNavProps = NavLinkProps & SocialLinkProps;

function NavLinks({ appLinks, onClick, customLinks }: NavLinkProps) {
  const { linkColorFor } = useNav();

  return (
    <VStack align="start" w="full">
      {appLinks.map(
        (link) =>
          !link.isBuilding && (
            <Link
              as={NextLink}
              color={linkColorFor(link.href)}
              fontSize="xl"
              href={link.href}
              key={link.href}
              onClick={onClick}
              prefetch
              variant="nav"
            >
              {link.label}
            </Link>
          )
      )}
      {customLinks}
    </VStack>
  );
}

function SocialLinks({ socialLinks }: SocialLinkProps) {
  return (
    <HStack justify="left" w="full" spacing={5}>
      {socialLinks.map(({ href, iconType }) => (
        <Button as={Link} href={href} isExternal key={href} variant="tertiary">
          <SocialIcon iconType={iconType} />
        </Button>
      ))}
    </HStack>
  );
}

export function MobileNav({
  appLinks,
  socialLinks,
  customLinks,
}: MobileNavProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null!);

  return (
    <>
      <Button onClick={onOpen} ref={btnRef} variant="tertiary">
        <FiMenu size={18} />
      </Button>
      <Drawer
        finalFocusRef={btnRef}
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Box onClick={onClose} w="full">
              <Text
                className={exoFont.className}
                fontSize="4xl"
                fontWeight="medium"
                letterSpacing="-0.5px"
                variant="special"
              >
                DeMind
              </Text>
            </Box>
          </DrawerHeader>
          <DrawerBody>
            <NavLinks
              appLinks={appLinks}
              customLinks={customLinks}
              onClick={onClose}
            />
            <Divider my={4} />
          </DrawerBody>
          <Divider my={4} />
          <DrawerFooter>
            <SocialLinks socialLinks={socialLinks} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
