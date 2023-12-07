#!/usr/bin/env nu

# generate-key create a ED25519 key.
# @returns {Record} - Key in JWK format.
def generate-key [] {
  # didkit key generate ed25519 | from json
  # openssl genpkey -algorithm ed25519 -out private.pem
  step crypto jwk create --kty OKP --crv Ed25519 --no-password --insecure pub.jwk private.jwk
}

# create-did-web creates a did:web DID.
# @param {Record} key - Key in JWK format that will be added to the DID. If present, the private key will not be added to the DID Documnent.
# @returns {Record} - DID Document for the did:web DID.
def create-did-web [did: string, key: record] {
  let kid = ($key | default "key-1" kid | get kid)
  {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://www.w3.org/ns/security/jwk/v1",
    ],
    "id": $did,
    "verificationMethod": [
      {
        "id": $"($did)#($kid)",
        "type": "JsonWebKey",
        "controller": $did,
        "publicKeyJwk": ($key | default "" use | default "" d | reject d | reject use)
      }
    ],
    "authentication": [
      $"($did)#($kid)"
    ],
    "assertionMethod": [
      $"($did)#($kid)"
    ]
  }
}


def main [did: string] {
  if not ($did | str starts-with "did:web:") {
    print -e "ERROR: only DID's starting with 'did:web:' are accepted."
  }
  let keyfile = "pub.jwk" # WARNING: name is hard-coded in generate-key
  mut key = {}
  if not ($keyfile | path exists) {
    generate-key
  }
  if ($keyfile | path exists) {
    $key = (open -r $keyfile | from json)
  } else {
    print -e $"ERROR: No such file or directory '($keyfile)'"
    exit 1
  }
  create-did-web $did $key | to json
}
