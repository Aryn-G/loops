import type { Config } from "tailwindcss";

// This variable contains configurations for tailwind
const config: Config = {
  // What files to scan for tailwind
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // custom extensions to tailwind
  theme: {
    extend: {
      screens: {
        xs: "390px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ncssm: {
          "light-blue": "#99CAEA",
          blue: "#346094",
          gray: "#8A8A8D",
          orange: "#D57E00",
          green: "#4B8B2A",
          purple: "#853175",
          yellow: "#F4C300",
        },
      },
      boxShadow: {
        "brutal-xs": "-0.5px 0.5px 0 0.5px rgb(0,0,0)",
        "brutal-sm": "-1px 1px 0 1px rgb(0,0,0)",
        "brutal-md": "-2px 2px 0 2px rgb(0,0,0)",
        // "brutal-md-off": "-4px 4px 0 2px rgb(0,0,0)",
        "brutal-xl": "-3px 3px 0 3px rgb(0,0,0)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        grot: ["var(--font-grot)"],
      },
    },
  },
  // extensions to the base tailwind
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;
