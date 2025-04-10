import tinycolor from "tinycolor2";
import { getTokens } from "./base/tokens";

export function getDemindTokens(colors: any, primaryTextColor: any) {
  const baseTokens = getTokens(colors, primaryTextColor);

  return {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      light: {
        ...baseTokens.colors.light,
        background: {
          ...baseTokens.colors.light.background,
          level0: "#DDF7B5",
          level1: "#E6F9C4",
          level2: "#F5FDE8",
          level3: "#F9FEF1",
          level4: "#FFFFFF",
          base: "#E6F9C4",
          baseWithOpacity: "hsla(83, 81%, 87%, 0.75)",
          special: colors.gradient.dawnLight,
          level0WithOpacity: "rgba(213, 245, 163, 0.96)",
        },

        border: {
          ...baseTokens.colors.light.border,
          base: "#F9FEF1",
          divider: "#D4F7A1",
          subduedZen: "hsla(88, 63%, 59%, 0.2)",
        },
        button: {
          ...baseTokens.colors.light.button,
          background: {
            primary: "linear-gradient(90deg, #BCEC79 0%, #81C91C 100%)",
            secondary: "#BCEC79",
          },
        },
        text: {
          ...baseTokens.colors.light.text,
          primary: "#194D05",
          secondary: "#827474",
          link: "#408A13",
          linkHover: colors.gray["900"],
          special: "linear-gradient(90deg, #194D05 0%, #30940A 100%)",
        },
        input: {
          ...baseTokens.colors.light.input,
          fontDefault: "#194D05",
          fontPlaceholder: tinycolor(colors.gray["900"]).setAlpha(0.5),
          borderDefault: "#FDFFFA",
          borderHover: colors.gray["700"],
          borderFocus: colors.gray["500"],
        },
      },
      dark: {
        ...baseTokens.colors.dark,
        background: {
          ...baseTokens.colors.dark.background,
          level0: "#0A0A14", // 最深背景色（页面背景）
          level1: "#1E1E38", // 卡片背景
          level2: "#252536", // 输入框背景
          level3: "#575767", // 悬停状态背景
          level4: "#323245", // 边框色/分隔线
          level0WithOpacity: "rgba(10, 10, 20, 0.85)",
          base: "#171728", // 基础背景色
          baseWithOpacity: "rgba(23, 23, 48, 0.85)", // 调整为更深的蓝紫色调，增加透明度
          special: "#8163C7",
        },
        border: {
          ...baseTokens.colors.dark.border,
          base: "#323245", // 与level4保持一致
          divider: "#2A2A3D",
          subduedZen: "rgba(100, 100, 250, 0.1)", // 更淡的紫色
        },
        button: {
          ...baseTokens.colors.dark.button,
          background: {
            primary: "linear-gradient(135deg,  #F8D458 0%, #6464FA 100%)",
            secondary: "#8163C7", // 使用主紫色
            tertiary: "#BDA3F9", // 浅一些的紫色
          },
        },
        text: {
          ...baseTokens.colors.dark.text,
          primary: "#FFFFFF",
          secondary: "#A0A0B0",
          link: "#8163C7", // 与secondary按钮色保持一致
          linkHover: "#BDA3F9", // 与渐变起始色保持一致
          special: "linear-gradient(135deg,  #F8D458 0%, #6464FA 100%)", // 与按钮渐变一致
          highlight: "#8163C7", // 与link颜色保持一致
        },
        input: {
          ...baseTokens.colors.dark.input,
          fontDefault: "#BDA3F9",
        },
      },
    },
  };
}
