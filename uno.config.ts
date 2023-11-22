// Documentation: https://unocss.dev/config/
import { defineConfig, presetIcons, presetTypography, presetUno } from "unocss";
import presetWind from "@unocss/preset-wind";
import transformerDirectives from "@unocss/transformer-directives";
import { presetDaisy } from "unocss-preset-daisy";

// const uno = presetUno();

export default defineConfig({
  theme: {
    colors: {
      primary: "#039BE5",
      // secondary: "var(--id-color-secondary)",
      // accent: "var(--id-color-accent)",
      // default: "var(--id-color-text-default)",
      // muted: "var(--id-color-text-muted)",
    },
    fontFamily: {
      // setting font family doesn't set the font on the html tag, therefore set
      // it here directly https://github.com/unocss/unocss/issues/924
      // sans: ["var(--id-font-sans)", uno.theme.fontFamily.sans].join(","),
      // serif: ["var(--id-font-serif)", uno.theme.fontFamily.serif].join(","),
      // mono: ["var(--id-font-mono)", uno.theme.fontFamily.mono].join(","),
    },
  },
  presets: [
    // presetUno(),
    presetWind(),
    presetTypography(),
    presetIcons(),
    presetDaisy({
      // https://github.com/kidonng/unocss-preset-daisy
      styled: true,
      themes: ["light", "dark"],
    }),
  ],
  transformers: [transformerDirectives()],
});
