import * as $ from "sanctuary-def";

export const RequestType = $.NullaryType("Request")(
  "https://developer.mozilla.org/en-US/docs/Web/API/Request",
)([])((x) => {
  if (typeof Request !== "undefined") return x instanceof Request;
  else {
    // INFO: workaround to avoid node-fetch import - is not required in the browser
    return x?.constructor?.name === "Request";
  }
});
