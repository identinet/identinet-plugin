export const idPlusItem = {
  "did:web:id-plus-example.identinet.io": {
    "presentation": {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "type": [
        "VerifiablePresentation"
      ],
      "verifiableCredential": [
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/ed25519-2020/v1"
          ],
          "type": [
            "VerifiableCredential"
          ],
          "credentialSubject": {
            "id": "did:web:id-plus-example.identinet.io"
          },
          "issuer": "did:web:id-plus-example.identinet.io",
          "issuanceDate": "2023-06-30T14:51:12Z",
          "proof": {
            "type": "Ed25519Signature2020",
            "proofPurpose": "assertionMethod",
            "proofValue": "z2ds9uFScNvCGZNMuWhZgsGXEGL7WGcaBPv5WTQDwhWRn1yPmZMhxFJpTwecmUfUBAg1qKQFBkd64pFzm6mCQr1og",
            "verificationMethod": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
            "created": "2023-06-30T14:51:25.354Z"
          }
        }
      ],
      "proof": {
        "type": "Ed25519Signature2020",
        "proofPurpose": "authentication",
        "proofValue": "z4cB1eZ4qKnr3PuNf69zpzCp6MVSUQVVaKVwhgA3C4nxdLGG56qDed1ooLJTqgfrBKpKGVzKiRLH8FuH4X14ADxTV",
        "challenge": "id-plus-example.identinet.io",
        "verificationMethod": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
        "created": "2023-07-18T09:01:49.485Z",
        "domain": "id-plus-example.identinet.io"
      },
      "holder": "did:web:id-plus-example.identinet.io"
    },
    "verification_result": {
      "presentationResult": {
        "verified": true,
        "results": [
          {
            "proof": {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1"
              ],
              "type": "Ed25519Signature2020",
              "proofPurpose": "authentication",
              "proofValue": "z4cB1eZ4qKnr3PuNf69zpzCp6MVSUQVVaKVwhgA3C4nxdLGG56qDed1ooLJTqgfrBKpKGVzKiRLH8FuH4X14ADxTV",
              "challenge": "id-plus-example.identinet.io",
              "verificationMethod": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
              "created": "2023-07-18T09:01:49.485Z",
              "domain": "id-plus-example.identinet.io"
            },
            "verified": true,
            "verificationMethod": {
              "id": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
              "type": "Ed25519VerificationKey2020",
              "controller": "did:web:id-plus-example.identinet.io",
              "publicKeyJwk": {
                "kty": "OKP",
                "crv": "Ed25519",
                "x": "fsJRFotb--4E7zNB9M7Kv47eMlmSt2BFdRrltI5R0ds"
              },
              "publicKeyMultibase": "z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
              "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
                {
                  "publicKeyJwk": {
                    "@id": "https://w3id.org/security#publicKeyJwk",
                    "@type": "@json"
                  }
                }
              ]
            },
            "purposeResult": {
              "valid": true,
              "controller": {
                "@context": [
                  "https://www.w3.org/ns/did/v1",
                  "https://w3id.org/security/suites/ed25519-2020/v1",
                  {
                    "publicKeyJwk": {
                      "@id": "https://w3id.org/security#publicKeyJwk",
                      "@type": "@json"
                    }
                  }
                ],
                "id": "did:web:id-plus-example.identinet.io",
                "verificationMethod": [
                  {
                    "id": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
                    "type": "Ed25519VerificationKey2020",
                    "controller": "did:web:id-plus-example.identinet.io",
                    "publicKeyJwk": {
                      "kty": "OKP",
                      "crv": "Ed25519",
                      "x": "fsJRFotb--4E7zNB9M7Kv47eMlmSt2BFdRrltI5R0ds"
                    }
                  }
                ],
                "authentication": [
                  "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2"
                ],
                "assertionMethod": [
                  "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2"
                ]
              }
            }
          }
        ]
      },
      "verified": true,
      "credentialResults": [
        {
          "verified": true,
          "results": [
            {
              "proof": {
                "@context": [
                  "https://www.w3.org/2018/credentials/v1",
                  "https://w3id.org/security/suites/ed25519-2020/v1"
                ],
                "type": "Ed25519Signature2020",
                "proofPurpose": "assertionMethod",
                "proofValue": "z2ds9uFScNvCGZNMuWhZgsGXEGL7WGcaBPv5WTQDwhWRn1yPmZMhxFJpTwecmUfUBAg1qKQFBkd64pFzm6mCQr1og",
                "verificationMethod": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
                "created": "2023-06-30T14:51:25.354Z"
              },
              "verified": true,
              "verificationMethod": {
                "id": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
                "type": "Ed25519VerificationKey2020",
                "controller": "did:web:id-plus-example.identinet.io",
                "publicKeyJwk": {
                  "kty": "OKP",
                  "crv": "Ed25519",
                  "x": "fsJRFotb--4E7zNB9M7Kv47eMlmSt2BFdRrltI5R0ds"
                },
                "publicKeyMultibase": "z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
                "@context": [
                  "https://www.w3.org/ns/did/v1",
                  "https://w3id.org/security/suites/ed25519-2020/v1",
                  {
                    "publicKeyJwk": {
                      "@id": "https://w3id.org/security#publicKeyJwk",
                      "@type": "@json"
                    }
                  }
                ]
              },
              "purposeResult": {
                "valid": true
              }
            }
          ]
        }
      ]
    },
    "diddoc": {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
        {
          "publicKeyJwk": {
            "@id": "https://w3id.org/security#publicKeyJwk",
            "@type": "@json"
          }
        }
      ],
      "id": "did:web:id-plus-example.identinet.io",
      "verificationMethod": [
        {
          "id": "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2",
          "type": "Ed25519VerificationKey2020",
          "controller": "did:web:id-plus-example.identinet.io",
          "publicKeyJwk": {
            "kty": "OKP",
            "crv": "Ed25519",
            "x": "fsJRFotb--4E7zNB9M7Kv47eMlmSt2BFdRrltI5R0ds"
          }
        }
      ],
      "authentication": [
        "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2"
      ],
      "assertionMethod": [
        "did:web:id-plus-example.identinet.io#z6Mknz5Gcvc4PNCQadiyspQ7j4Le9L7Fh7jmRJwT5CpunSc2"
      ]
    }
  }
}
