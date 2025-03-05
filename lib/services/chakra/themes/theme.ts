import { ChakraTheme } from "@chakra-ui/theme";
import { colors, primaryTextColor } from "./colors";
import { getComponents } from "./base/components";
import { config, fonts, styles } from "./base/foundations";
import { getSemanticTokens } from "./base/semantic-tokens";
import { proseTheme } from "./base/prose";
import { getBeetsTokens } from "./tokens";
import { theme as chakraTheme } from "@chakra-ui/theme";
import { mergeThemeOverride } from "@chakra-ui/theme-utils";

const tokens = getBeetsTokens(colors, primaryTextColor);
const components = getComponents(tokens, primaryTextColor);
const semanticTokens = getSemanticTokens(tokens, colors);

semanticTokens.colors.font.dark = "#111111";
semanticTokens.colors.font.light = "#FFFFFF";
semanticTokens.colors.grayText._dark = "#BBBBBB";

components.Button.variants.buttonGroupActive._dark.color = "#363636";

export const beetsTheme = {
  config: {
    ...config,
    initialColorMode: "dark",
  },
  fonts,
  styles: {
    global: {
      ...styles.global,
      body: {
        background: "linear-gradient(90deg, #111111 0%, #333333 100%)",
      },
    },
  },
  colors,
  semanticTokens,
  components,
};

export const theme = mergeThemeOverride(
  chakraTheme,
  beetsTheme,
  proseTheme
) as ChakraTheme;
