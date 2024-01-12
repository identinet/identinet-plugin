#!/usr/bin/env -S nu --stdin

# create-vc-empty creates an empty VC.
# @param {string} holder - Holder's DID.
# @param {string} subject - Subject's DID.
# @returns {Record} - DID Document for the did:web DID.
def create-vp [holder: string, credentials: list<any>] {
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      # INFO: thi context is required otherwise @digitalbazaar/vc fails
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "type": ["VerifiablePresentation"],
    "holder": $holder,
    "verifiableCredential": $credentials
  }
}

# Packs Verifiable Credentials into a Verifiable Presentation.
# @param {string} stdin - JSON encoded Verifiable Credential(s).
# @returns {string} - JSON encoded signed Verifiable Presentation.
def main [
    # TODO: add VP id
    holder: string,
    # Holder's DID
    ] {
  mut credentials = ($in | from json)
  $credentials = if ($credentials | describe -d).type == "record" {
    [$credentials]
  } else {
    $credentials
  }
  create-vp $holder $credentials | to json
}
