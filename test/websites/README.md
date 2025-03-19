# Commands

| Command                                                       | Description                                                                                                                                    | Example                                                                                                                             |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `./create-did-web.nu DID`                                     | Create a did:web DID document                                                                                                                  | `./create-did-web.nu did:web:id-plus.localhost%3A8443`                                                                              |
| `./create-vc-domain-linkage.nu ISSUER_AND_SUBJECT_DID ORIGIN` | Create an unsigned [Domain Linkage Credential](https://identity.foundation/.well-known/resources/did-configuration/#domain-linkage-credential) | `./create-vc-domain-linkage.nu did:web:id-plus.localhost%3A8443 https://id-plus.localhost:8443`                                     |
| `./create-vc-empty ISSUER_DID SUBJECT_DID`                    | Create an unsigned empty credential                                                                                                            | `./create-vc-empty did:web:id-plus.localhost%3A8443 did:web:id-plus.localhost%3A8443`                                               |
| `./create-vp HOLDER_DID`                                      | Create an unsigned presentation                                                                                                                | `./create-vc did:web:id-plus.localhost%3A8443 did:web:id-plus.localhost%3A8443 \| ../create-vp.nu did:web:id-plus.localhost%3A8443` |
| `./sign.nu KEY_FILE [PROOF_PURPOSE] [VERIFICATION_METHOD]`    | Signs a Verifiable Credential or Presentation                                                                                                  | `./generate-vc-empty.nu did:web:id-plus.localhost%3A8443 did:web:id-plus.localhost%3A8443  \| ./sign.nu key.jwk`                    |

## Full example

Create and sign VC, pack it in a VP and sign it:

```
$env.DID = did:web:id-plus.localhost%3A8443
$env.PROOF_SUITE = Ed25519Signature2020
../create-vc-empty.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | ../create-vp.nu $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | save -f .well-known/presentation.json
../create-vc-imprint.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | ../create-vp.nu $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | save -f .well-known/presentation.json

# tampered credential - doesn't work, didkit will not sign it
../create-vc-imprint.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json | upsert credentialSubject.TAMPERED "with credential" | to json | ../create-vp.nu $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | save -f .well-known/presentation.json
../create-vc-brand.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | ../create-vp.nu $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | save -f .well-known/presentation.json

../create-vc-domain-linkage.nu $env.DID $"https://($env.DOMAINNAME | url decode)" | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json | { "@context": "https://identity.foundation/.well-known/did-configuration/v1", "linked_dids": [ $in ] } | to json | save -f .well-known/did-configuration.json

[(../create-vc-imprint.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json) (../create-vc-brand.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json)] | to json | ../create-vp.nu $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | save -f .well-known/presentation.json

# invalid credential - domain name doesn't match
../create-vc-domain-linkage.nu $env.DID $"https://domain-doesnt-match-($env.DOMAINNAME | url decode)" | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json | { "@context": "https://identity.foundation/.well-known/did-configuration/v1", "linked_dids": [ $in ] } | to json | save -f .well-known/did-configuration.json

# tampered presentation
../create-vc-empty.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json | to json | ../create-vp.nu $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json | upsert verifiableCredential.0.credentialSubject.TAMPERED "with credential" | to json | save -f .well-known/presentation.json
[(../create-vc-imprint.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json) (../create-vc-brand.nu $env.DID $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json)] | to json | ../create-vp.nu $env.DID | ../sign.nu private.jwk --proofSuite $env.PROOF_SUITE | from json | upsert verifiableCredential.0.credentialSubject.TAMPERED "with credential" | to json | save -f .well-known/presentation.json
```
