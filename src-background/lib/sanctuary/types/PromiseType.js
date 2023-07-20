import * as $ from "sanctuary-def";
import * as S from "sanctuary";

export const PromiseType = $.NullaryType("Promise")(
  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
)([])((x) => S.type(x).name === "Promise");
