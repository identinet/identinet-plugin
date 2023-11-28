import { defineConfig } from "unocss";
import { presetUno, presetTypography, presetIcons } from "unocss";
import { presetDaisy } from "unocss-preset-daisy";

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetTypography(), presetDaisy()],
});
