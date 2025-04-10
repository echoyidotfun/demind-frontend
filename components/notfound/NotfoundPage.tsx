import { DefaultPageContainer } from "@/components/common/containers/DefaultPageContainer";
import { Button, Heading, VStack, Text } from "@chakra-ui/react";
import Link from "next/link";

export function NotFoundPage() {
  const title = "Page Not Found";
  const description = "The page you are looking for does not exist";

  const redirectUrl = "/";
  const redirectText = "Return Home";

  return (
    <DefaultPageContainer minH="80vh">
      <VStack align="start" spacing="md">
        <Heading size="md">{title}</Heading>
        <VStack align="start" spacing="xs">
          <Text>{description}</Text>
        </VStack>
        <Button as={Link} href={redirectUrl} size="sm">
          {redirectText}
        </Button>
      </VStack>
    </DefaultPageContainer>
  );
}
