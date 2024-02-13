import { expect, test } from "vitest";
import { getLinkedPresentationURLs } from "../src-background/utils.js";

test("getLinkedPresentationURLs - When serviceEndpoint is a string, ensure it gets extracted.", () => {
  const urls = getLinkedPresentationURLs({
  "service": [
    {
      "id": "did:web:id-plus.localhost%3A8443#presentation",
      "type": "LinkedVerifiablePresentation",
      "serviceEndpoint": "https://id-plus.localhost:8443/.well-known/presentation.json"
    }
  ]
  });
  expect(urls.length).toBe(1);
});


test("getLinkedPresentationURLs - When serviceEndpoint is an array of strings, ensure they get extracted.", () => {
  const urls = getLinkedPresentationURLs({
  "service": [
    {
      "id": "did:web:id-plus.localhost%3A8443#presentation",
      "type": "LinkedVerifiablePresentation",
      "serviceEndpoint": [
        "https://id-plus.localhost:8443/.well-known/presentation.json",
        "https://id-broken.localhost:8443/.well-known/presentation.json"
      ]
    }
  ]
  });
  expect(urls.length).toBe(2);
  expect(typeof urls[0]).toBe("string");
});

test("getLinkedPresentationURLs - When serviceEndpoint is not of type LinkedVerifiablePresentation, ensure it gets ignored.", () => {
  const urls = getLinkedPresentationURLs({
  "service": [
    {
      "id": "did:web:id-plus.localhost%3A8443#presentation",
      "type": "LinkedVerifiablePresentation-Not",
      "serviceEndpoint": "https://id-plus.localhost:8443/.well-known/presentation.json"
    }
  ]
  });
  expect(urls.length).toBe(0);
});

test("getLinkedPresentationURLs - When serviceEndpoint contains a not supported URL, ensure it gets ignored.", () => {
  const urls = getLinkedPresentationURLs({
  "service": [
    {
      "id": "did:web:id-plus.localhost%3A8443#presentation",
      "type": "LinkedVerifiablePresentation",
      "serviceEndpoint": "ipfs:/xyz/presentation.json"
    }
  ]
  });
  expect(urls.length).toBe(0);
});


