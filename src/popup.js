import { log, S } from "./lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./lib/identinet/mod.js";
import { chainRej, encaseP, promise, reject, resolve } from "fluture";

function init() {
  return S.pipe([
    encaseP(() => getCurrentTab()),
    S.map(([tabId, url]) => url2DID(url)),
    S.chain(S.either(reject)(resolve)),
    // Show verification information only if DID is available in store
    S.chain(({ did, base_url }) =>
      S.pipe([
        encaseP((did) => api.storage.local.get(did)),
        // S.map(log("store")),
        S.map((store) => {
          const el = document.getElementById("ssi-info");
          const did_el = document.createElement("span");
          if (store[did]?.diddoc?.id !== did) {
            did_el.innerText = "No DID information available";
            el.appendChild(did_el);
            return el;
          }
          did_el.innerText = `DID: ${did}`;
          el.appendChild(did_el);
          const did_inspect_el = document.createElement("a");
          did_inspect_el.innerText = " Inspect";
          did_inspect_el.target = "_blank";
          did_inspect_el.href =
            `https://didlint.ownyourdata.eu/validate?did=${store[did]?.diddoc
              ?.id}`;
          el.appendChild(did_inspect_el);
          return el;
        }),
      ])(did)
    ),
    chainRej((err) => {
      console.log("reject", err);
      return resolve("an error occurred");
    }),
    promise,
  ])("nix");
  // el.innerHTML = "<ul><li>1</li><li>2</li></ul>";
}

init();
