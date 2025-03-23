import { XIcon } from "./XIcon";
import { DiscordIcon } from "./DiscordIcon";
import { GithubIcon } from "./GithubIcon";
import { TelegramIcon } from "./TelegramIcon";

export type IconType = "x" | "discord" | "github" | "bilibili" | "telegram";

export function SocialIcon({
  iconType,
  size = 24,
}: {
  iconType: IconType | undefined;
  size?: number;
}) {
  switch (iconType) {
    case "x":
      return <XIcon size={size} />;
    case "discord":
      return <DiscordIcon size={size} />;
    case "github":
      return <GithubIcon size={size} />;
    case "telegram":
      return <TelegramIcon size={size} />;
    default:
      return null;
  }
}
