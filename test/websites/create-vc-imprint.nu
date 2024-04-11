#!/usr/bin/env nu

# create-vc-imprint creates an imprint VC.
# @param {string} issuer - Issuer's DID.
# @param {string} subject - Subject's DID.
# @returns {Record} - DID Document for the did:web DID.
def create-vc-imprint [issuer: string, subject: string] {
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      # INFO: thi context is required otherwise @digitalbazaar/vc fails
      "https://w3id.org/security/suites/ed25519-2020/v1",
      {"schema": "https://schema.org/" }
    ],
    "type": ["VerifiableCredential", "schema:Organization"],
    "issuer": $issuer,
    "issuanceDate": (date now | date to-timezone UTC | format date "%Y-%m-%dT%H:%M:%SZ"),
    "credentialSubject": {
      "id": $subject,
      "schema:taxID": "132456789",
      "schema:vatID": "987654321",
      "schema:legalName": "Example Company LLC",
      "schema:leiCode": "54321",
      "schema:email": "support@example.com",
      "schema:telephone": "+123456789",
      "schema:location": {
        "type": "schema:PostalAddress"
        "schema:streetAddress": "1 Example Street",
        "schema:addressLocality": "Example City",
        "schema:postalCode": "12345",
        "schema:addressCountry": "Example Country"
      }
    }
  }
}

# Creates an imprint VC https://identity.foundation/.well-known/resources/did-configuration/#domain-linkage-credential.
# @returns {string} - JSON encoded Verifiable Credential.
def main [
    # TODO: add expiration date
    issuer: string,
    # DID that will self-issue the VC.
    subject: string,
    # DID of subject.
    ] {
  create-vc-imprint $issuer $subject | to json
}
