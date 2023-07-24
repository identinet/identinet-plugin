import * as $ from "sanctuary-def";

export const URLType = $.NullaryType("URL")(
  "https://developer.mozilla.org/en-US/docs/Web/API/URL",
)([])((x) => x instanceof URL);
