#!/usr/bin/env -S nu --stdin

# sign signs a verifiable credential.
# @param {Record} credential - JSON encoded Verifiable Credential.
# @param {string} keyFile - File that contains the signing key.
# @param {string} proofPurpose - Proof purpose, one of "assertionMethod.and" "authentication". @see https://w3c.github.io/did-core/#verification-relationships.
# @param {string} verificationMethod - @see https://w3c.github.io/did-core/#verification-methods.
# @param {string} proofSuite - Proof suite, @see https://github.com/jceb/ssi/blob/976e2607080c20cd5789b977e477e98b6417f8af/ssi-ldp/src/suites/mod.rs
# @returns {Record} - Signed Verifiable Credential.
def sign [
    credential: record,
    keyFile: string,
    proofPurpose: string,
    verificationMethod: string,
    proofSuite: string,
    challenge: string = "",
    domain: string = "",
    ] {
  let type = if (is-presentation $credential) {
    "presentation"
  } else {
    "credential"
  }
  if $domain != "" {
    $env.DOMAIN = $domain
  }
  if $challenge != "" {
    $env.CHALLENGE = $challenge
  }
  $env.VERIFICATION_METHOD = $verificationMethod
  $env.KEY_PATH = $keyFile
  $env.TYPE = $proofSuite
  $env.PROOF_PURPOSE = $proofPurpose
  $credential | to json | didkit $type issue | from json
  # $credential | to json | didkit $type issue -t $proofSuite -k $keyFile -p $proofPurpose -v $verificationMethod | from json
}

# get-verification-method retrieves a verification method for a DID.
# @param {string} did - DID that will be looked up.
# @param {string} verificationMethod - @see https://w3c.github.io/did-core/#verification-methods.
# @returns {List} - List of verification methods normalized into record form {id: "xx", ...}.
def get-verification-method [did: string, verificationMethod: string = "assertionMethod"] {
    didkit did resolve $did | from json | default [] $verificationMethod | get $verificationMethod | each {|vm|
      if ($vm | describe -d).type == "string" {
        {id: $vm}
      } else {
        $vm
      }
    }
}

def is-presentation [credential: record] {
  if ($credential | default [] type | get type | any {|t| $t == "VerifiablePresentation"}) {
    true
  } else {
    false
  }
}

# Signs a credential or presentation.
# @param {string} stdin - JSON encoded Verifiable Credential.
# @returns {string} - JSON encoded signed Verifiable Credential.
def main [
    keyFile: string,
    # Path to file that contains the signing key.
    --proofPurpose: string = "assertionMethod",
    # Proof purpose, one of "assertionMethod.and" "authentication". @see https://w3c.github.io/did-core/#verification-relationships.
    --verificationMethod: string = ""
    # Automatic lookup of verification method if not specified, @see https://w3c.github.io/did-core/#verification-methods.
    --proofSuite: string = "JsonWebSignature2020",
    # Proof suite, e.g. Ed25519Signature2020, JsonWebSignature2020, or EcdsaSecp256k1RecoverySignature2020, @see https://github.com/jceb/ssi/blob/976e2607080c20cd5789b977e477e98b6417f8af/ssi-ldp/src/suites/mod.rs
    --challenge: string = "",
    # Challenge added to proof
    --domain: string = "",
    # Domain added to proof
    --verbose
    # Verbose output about what's going on
    ] {
  let credential = ($in | from json)
  let signer = if (is-presentation $credential) {
    $credential.holder
  } else {
    $credential.issuer
  }
  let vm = if ($verificationMethod | is-empty) {
    let vms = get-verification-method $signer $proofPurpose
    if ($vms | length) == 0 {
      print -e $"Verification method not found for DID ($credential.issuer): ($proofPurpose)"
      exit 1
    }
    $vms.0.id
  } else {
    $verificationMethod
  }
  if $verbose {
    print -e $"Signer: ($signer)"
    print -e $"Verification Method: ($vm)"
  }
  sign $credential $keyFile $proofPurpose $vm $proofSuite $challenge $domain | to json
}
