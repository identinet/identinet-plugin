#!/usr/bin/env nu

# create-vc-empty creates an empty VC.
# @param {string} issuer - Issuer's DID.
# @param {string} subject - Subject's DID.
# @returns {Record} - DID Document for the did:web DID.
def create-vc-empty [issuer: string, subject: string] {
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
    ],
    "type": ["VerifiableCredential"],
    "issuer": $issuer,
    "issuanceDate": (date now | format date "%Y-%m-%dT%H:%M:%SZ"),
    "credentialSubject": {
      "id": $subject,
    }
  }
}

# Creates an empty VC https://identity.foundation/.well-known/resources/did-configuration/#domain-linkage-credential.
# @returns {string} - JSON encoded Verifiable Credential.
def main [
    # TODO: add expiration date
    issuer: string,
    # DID that will self-issue the VC.
    subject: string,
    # DID of subject.
    ] {
  create-vc-empty $issuer $subject | to json
}
