import { log, S } from "./lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./lib/identinet/mod.js";
import { chainRej, encaseP, promise, reject, resolve } from "fluture";

async function init() {
  return S.pipe([
    encaseP(() => getCurrentTab()),
    S.map(([tabId, url]) => url2DID(url)),
    S.map(S.pipe([
      S.map(({ did, base_url }) => {
        const el = document.getElementById("ssi-info");
        const did_el = document.createElement("span");
        did_el.innerText = did;
        el.appendChild(did_el);
        const did_inspect_el = document.createElement("a");
        did_inspect_el.innerText = " Inspect";
        did_inspect_el.target = "_blank";
        did_inspect_el.href =
          `https://didlint.ownyourdata.eu/validate?did=${did}`;
        el.appendChild(did_inspect_el);
        return el;
      }),
    ])),
    promise,
  ])("nix");
  // el.innerHTML = "<ul><li>1</li><li>2</li></ul>";
}

init();
