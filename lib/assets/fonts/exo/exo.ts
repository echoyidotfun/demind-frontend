import localFont from "next/font/local";

export const exoFont = localFont({
  src: [
    {
      path: "./Exo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Exo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Exo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});
