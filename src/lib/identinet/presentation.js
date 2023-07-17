import { $, log, S } from "../sanctuary/mod.js";
import { encaseP } from "fluture";
import { defaultDocumentLoader, verify } from "@digitalbazaar/vc";
import { convertJWKtoMultibase } from "./conversion.js";
import jsigs from "jsonld-signatures";
import {
  Ed25519Signature2020,
  suiteContext as suiteContext2020,
} from "@digitalbazaar/ed25519-signature-2020";
import {
  Ed25519Signature2018,
  suiteContext as suiteContext2018,
} from "@digitalbazaar/ed25519-signature-2018";

/**
 * verifyPresentation verifies a presentation.
 *
 * @param {Pair<URL,Pair<string,object>>} pair - Pair that consists of the URL
 * and the DID and DID document.
 * @param {object} presentation - Presentation object that shall be verified.
 * @returns {Future<Pair<object,object>>} - Returns the presentation and the
 * verifcation result as a Pair otherwise an error. The verification result
 * still needs to be checked since a failure to verify the presentation will
 * not lead to a rejected Future.
 */
export const verifyPresentation = (did_pair) => (presentation) => {
  // TODO: add support for ECDSA
  // TODO: add support for JWS - no implementation available yet, see https://github.com/w3c/vc-jws-2020
  const suite = [
    new Ed25519Signature2018(),
    new Ed25519Signature2020(),
  ];
  // customer loader that supports DID and verification method
  const url = S.fst(did_pair);
  const diddoc = S.snd(S.snd(did_pair));
  const did = diddoc?.id;
  const verificationMethods = S.pipe([
    S.get(S.is($.Array($.NonEmpty($.String))))("assertionMethod"),
    S.map(S.map((id) =>
      S.pipe([
        S.get(S.is($.Array($.StrMap($.Unknown))))("verificationMethod"),
        S.fromMaybe([]),
        S.filter((vm) => vm.id === id),
        S.head,
      ])(diddoc)
    )),
    S.map(S.filter(S.isJust)),
    S.map(S.map(S.fromMaybe({}))),
    S.fromMaybe([]),
    S.reduce((acc) => (vm) => {
      let publicKeyMultibase = vm?.publicKeyMultibase;
      if (
        vm.type == "Ed25519VerificationKey2020" &&
        publicKeyMultibase === undefined &&
        vm?.publicKeyJwk !== undefined
      ) {
        // convert JWK key to multibase format that's required by Ed25519VerificationKey2020
        publicKeyMultibase = convertJWKtoMultibase(vm)?.publicKeyMultibase;
      }
      const vm_ld = {
        ...vm,
        publicKeyMultibase,
        // @context is required in the verificationMethod to make it a valid linked data document
        "@context": diddoc["@context"],
      };
      acc[vm_ld.id] = vm_ld;
      return acc;
    })({}),
  ])(diddoc);
  const documentLoader = jsigs.extendContextLoader((url) => {
    // log("documentLoader")(url);
    // resovle DIDDoc and verification Method via document loader
    if (url === suiteContext2020.CONTEXT_URL) {
      return suiteContext2020.documentLoader(url);
    }
    if (url === suiteContext2018.CONTEXT_URL) {
      return suiteContext2018.documentLoader(url);
    }
    if (url === did) {
      return {
        contextUrl: null,
        documentUrl: url,
        document: diddoc,
      };
    }
    if (verificationMethods[url]) {
      return {
        contextUrl: null,
        documentUrl: url,
        document: verificationMethods[url],
      };
    }
    return defaultDocumentLoader(url);
  });
  return S.pipe([
    encaseP(verify),
    S.map(S.Pair(presentation)),
  ])({
    suite,
    presentation,
    // TODO: change expected proof purpose to Authentication .. for the
    // presentation
    presentationPurpose: new jsigs.purposes.AssertionProofPurpose({
      // controller: did,
      domain: url.hostname, // FIXME: domain is only validated for authentication proof purposes
    }),
    documentLoader,
  });
};
