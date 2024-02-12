# Commands

| Command                                                       | Description                                                                                                                                    | Example                                                                                                                                         |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `./create-did-web.nu DID`                                     | Create a did:web DID document                                                                                                                  | `./create-did-web.nu did:web:id-plus.localhost%3A8443`                                                                                        |
| `./create-vc-domain-linkage.nu ISSUER_AND_SUBJECT_DID ORIGIN` | Create an unsigned [Domain Linkage Credential](https://identity.foundation/.well-known/resources/did-configuration/#domain-linkage-credential) | `./create-vc-domain-linkage.nu did:web:id-plus.localhost%3A8443 https://id-plus.localhost:8443`                                                  |
| `./create-vc-empty ISSUER_DID SUBJECT_DID`                    | Create an unsigned empty credential                                                                                                            | `./create-vc-empty did:web:id-plus.localhost%3A8443 did:web:id-plus.localhost%3A8443`                                                       |
| `./create-vp HOLDER_DID`                                      | Create an unsigned presentation                                                                                                                | `./create-vc-empty did:web:id-plus.localhost%3A8443 did:web:id-plus.localhost%3A8443 \| ../create-vp.nu did:web:id-plus.localhost%3A8443` |
| `./sign.nu KEY_FILE [PROOF_PURPOSE] [VERIFICATION_METHOD]`    | Signs a Verifiable Credential or Presentation                                                                                                  | `./generate-vc-empty.nu did:web:id-plus.localhost%3A8443 did:web:id-plus.localhost%3A8443  \| ./sign.nu key.jwk`                            |

## Full example

Create and sign VC, pack it in a VP and sign it:

```
$env.DID = did:web:id-plus.localhost%3A8443
../create-vc-empty.nu $env.DID $env.DID | ../sign.nu private.jwk | ../create-vp.nu $env.DID | ../sign.nu private.jwk  --challenge=id-plus.localhost --domain=id-plus.localhost
```
