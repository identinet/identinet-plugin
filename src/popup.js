import { log, S } from "./lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./lib/identinet/mod.js";
import { chainRej, encaseP, promise, reject, resolve } from "fluture";

async function init() {
  return S.pipe([
    encaseP(() => getCurrentTab()),
    S.map(log("url")),
    S.map(([tabId, url]) => url2DID(url)),
    S.map(S.pipe([
      S.map(log("did")),
      S.map(({ did, base_url }) => {
        const el = document.getElementById("ssi-info");
        el.innerText = did;
        return el;
      }),
    ])),
    promise,
  ])("nix");
  // el.innerHTML = "<ul><li>1</li><li>2</li></ul>";
}

init();
