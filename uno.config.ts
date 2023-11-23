import { defineConfig } from "unocss";
import { presetUno, presetTypography } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetTypography()],
});
