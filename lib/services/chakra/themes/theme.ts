import { ChakraTheme } from "@chakra-ui/theme";
import { colors, primaryTextColor } from "./colors";
import { getComponents } from "./base/components";
import { themeConfig, fonts, styles } from "./base/foundations";
import { getSemanticTokens } from "./base/semantic-tokens";
import { proseTheme } from "./base/prose";
import { getDemindTokens } from "./tokens";
import { theme as chakraTheme } from "@chakra-ui/theme";
import { mergeThemeOverride } from "@chakra-ui/theme-utils";

const tokens = getDemindTokens(colors, primaryTextColor);
const components = getComponents(tokens, primaryTextColor);
const semanticTokens = getSemanticTokens(tokens, colors);

components.Button.variants.buttonGroupActive._dark.color = "#363636";

export const demindTheme = {
  config: {
    ...themeConfig,
    initialColorMode: "dark",
  },
  fonts,
  styles: styles.global,
  colors,
  semanticTokens,
  components,
};

export const theme = mergeThemeOverride(
  chakraTheme,
  demindTheme,
  proseTheme
) as ChakraTheme;
