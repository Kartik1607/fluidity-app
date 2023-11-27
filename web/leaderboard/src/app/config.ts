import localFont from "next/font/local";

export const aeonik = localFont({
  src: [
    {
      path: "../../public/assets/fonts/aeonik/Aeonik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const spline = localFont({
  src: [
    {
      path: "../../public/assets/fonts/spline/SplineSansMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/spline/SplineSansMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const inter = localFont({
  src: [
    {
      path: "../../public/assets/fonts/inter/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/inter/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/inter/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const tableHeadings = [
  { name: "RANK" },
  { name: "USER" },
  { name: "#TX" },
  { name: "VOLUME (USD)" },
  { name: "YIELD EARNED (USD)" },
];
