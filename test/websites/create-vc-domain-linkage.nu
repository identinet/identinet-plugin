#!/usr/bin/env nu

# create-vc-domain-linkage creates a DID Configuration VC.
# @param {string} issuer - Issuer's DID.
# @param {string} subject - Subject's DID.
# @param {string} origin - Origin that's referenced.
# @returns {Record} - DID Document for the did:web DID.
def create-vc-domain-linkage [issuer: string, subject: string, origin: string] {
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://identity.foundation/.well-known/did-configuration/v1"
      # INFO: this context is required otherwise @digitalbazaar/vc fails
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "type": ["VerifiableCredential", "DomainLinkageCredential"],
    "issuer": $issuer,
    "issuanceDate": (date now | date to-timezone UTC | format date "%Y-%m-%dT%H:%M:%SZ"),
    "credentialSubject": {
      "id": $subject,
      "origin": $origin
    }
  }
}

# Creates a Domain Linkage VC https://identity.foundation/.well-known/resources/did-configuration/#domain-linkage-credential.
# @returns {string} - JSON encoded Verifiable Credential.
def main [
    # TODO: add expiration date
    did: string,
    # DID that will self-issue the VC.
    origin: string
    # Origin that will be claimed in the credential.
    ] {
  create-vc-domain-linkage $did $did $origin | to json
}
