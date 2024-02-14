export const storage = {
  "did:web:no-id.localhost%3A8443": {},
  "did:web:id-web.localhost%3A8443": {
    "diddoc": {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
        {
          "publicKeyJwk": {
            "@id": "https://w3id.org/security#publicKeyJwk",
            "@type": "@json",
          },
        },
      ],
      "id": "did:web:id-web.localhost%3A8443",
      "verificationMethod": [{
        "id":
          "did:web:id-web.localhost%3A8443#SnRH-_DnOrKR597KXHgt6javP6bPeJZi9U1DoOXAyg4",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:web:id-web.localhost%3A8443",
        "publicKeyJwk": {
          "kty": "OKP",
          "kid": "SnRH-_DnOrKR597KXHgt6javP6bPeJZi9U1DoOXAyg4",
          "crv": "Ed25519",
          "alg": "EdDSA",
          "x": "KGHwynsaPOvF8e1bKysDRh9ege-QNoK2u9a5oA8l8go",
        },
      }],
      "authentication": [
        "did:web:id-web.localhost%3A8443#SnRH-_DnOrKR597KXHgt6javP6bPeJZi9U1DoOXAyg4",
      ],
      "assertionMethod": [
        "did:web:id-web.localhost%3A8443#SnRH-_DnOrKR597KXHgt6javP6bPeJZi9U1DoOXAyg4",
      ],
    },
  },
  "did:web:id-broken.localhost%3A8443": {
    "presentations": [{
      "presentation": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": [{
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/ed25519-2020/v1",
          ],
          "type": ["VerifiableCredential"],
          "credentialSubject": {
            "id": "did:web:id-broken.localhost%3A8443",
            "broken": "tampered attribute",
          },
          "issuer": "did:web:id-broken.localhost%3A8443",
          "issuanceDate": "2024-02-12T12:39:20Z",
          "proof": {
            "type": "Ed25519Signature2020",
            "proofPurpose": "assertionMethod",
            "proofValue":
              "z4RchVhDpAAaJ34XGGBiejkQ9zzrL6VCBvMjgMLWagxjj4iRc7RqmoudCXYsdn5MjrXJ6184RnYueRVCFM9vBZwHN",
            "verificationMethod":
              "did:web:id-broken.localhost%3A8443#dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
            "created": "2024-02-12T12:39:20.730192986Z",
          },
        }],
        "proof": {
          "type": "Ed25519Signature2020",
          "proofPurpose": "assertionMethod",
          "proofValue":
            "z58AjraH3nvCb6VxU9rLkZS1a3VyQAPc77ixKNV1PmqpYNBGznGGgZQdpJAB8WARLDFu88KkpjxKwAVKJVSpWJa6o",
          "verificationMethod":
            "did:web:id-broken.localhost%3A8443#dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
          "created": "2024-02-12T12:39:20.895220443Z",
        },
        "holder": "did:web:id-broken.localhost%3A8443",
      },
      "verification_result": {
        "presentationResult": {
          "verified": false,
          "results": [{
            "proof": {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
              ],
              "type": "Ed25519Signature2020",
              "proofPurpose": "assertionMethod",
              "proofValue":
                "z58AjraH3nvCb6VxU9rLkZS1a3VyQAPc77ixKNV1PmqpYNBGznGGgZQdpJAB8WARLDFu88KkpjxKwAVKJVSpWJa6o",
              "verificationMethod":
                "did:web:id-broken.localhost%3A8443#dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
              "created": "2024-02-12T12:39:20.895220443Z",
            },
            "verified": false,
            "error": {},
          }],
          "error": {},
        },
        "verified": false,
        "credentialResults": [{
          "verified": false,
          "results": [{
            "proof": {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
              ],
              "type": "Ed25519Signature2020",
              "proofPurpose": "assertionMethod",
              "proofValue":
                "z4RchVhDpAAaJ34XGGBiejkQ9zzrL6VCBvMjgMLWagxjj4iRc7RqmoudCXYsdn5MjrXJ6184RnYueRVCFM9vBZwHN",
              "verificationMethod":
                "did:web:id-broken.localhost%3A8443#dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
              "created": "2024-02-12T12:39:20.730192986Z",
            },
            "verified": false,
            "error": {},
          }],
          "error": {},
        }],
        "error": {},
      },
    }],
    "diddoc": {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://identity.foundation/linked-vp/contexts/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
        {
          "publicKeyJwk": {
            "@id": "https://w3id.org/security#publicKeyJwk",
            "@type": "@json",
          },
        },
      ],
      "id": "did:web:id-broken.localhost%3A8443",
      "verificationMethod": [{
        "id":
          "did:web:id-broken.localhost%3A8443#dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:web:id-broken.localhost%3A8443",
        "publicKeyJwk": {
          "kty": "OKP",
          "kid": "dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
          "crv": "Ed25519",
          "alg": "EdDSA",
          "x": "M2RTG7I2_EMs1M4Tk1HZL_xE2fegtLkPywxs4OuO_38",
        },
      }],
      "authentication": [
        "did:web:id-broken.localhost%3A8443#dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
      ],
      "assertionMethod": [
        "did:web:id-broken.localhost%3A8443#dqqkiu1wiQWE7T3MmssDV_-xiHCGu1xzzcafoXoCNUs",
      ],
      "service": [{
        "id": "did:web:id-plus.localhost%3A8443#presentation",
        "type": "LinkedVerifiablePresentation",
        "serviceEndpoint":
          "https://id-broken.localhost:8443/.well-known/presentation.json",
      }],
    },
  },
  "did:web:id-plus.localhost%3A8443": {
    "presentations": [{
      "presentation": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": [{
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/ed25519-2020/v1",
          ],
          "type": ["VerifiableCredential"],
          "credentialSubject": { "id": "did:web:id-plus.localhost%3A8443" },
          "issuer": "did:web:id-plus.localhost%3A8443",
          "issuanceDate": "2024-02-12T12:32:43Z",
          "proof": {
            "type": "Ed25519Signature2020",
            "proofPurpose": "assertionMethod",
            "proofValue":
              "z546i6F5zkrBtZViDsCRCThdCdzE9FajDYAyc4gXxSzf3gftxLyR39ovXVpFA3P3zeXaq452vN25wawN4LPy8uS9e",
            "verificationMethod":
              "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
            "created": "2024-02-12T12:32:43.762815207Z",
          },
        }],
        "proof": {
          "type": "Ed25519Signature2020",
          "proofPurpose": "assertionMethod",
          "proofValue":
            "z57mt83Y11ZQMVHGzCNg77HMEeH2fPN6D6uBraqY8qKRC4ufwfXgRGdZMqWx6GBAy9RV7tLnp4UsoHXVSqefmQcpa",
          "verificationMethod":
            "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
          "created": "2024-02-12T12:32:43.929955657Z",
        },
        "holder": "did:web:id-plus.localhost%3A8443",
      },
      "verification_result": {
        "presentationResult": {
          "verified": true,
          "results": [{
            "proof": {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
              ],
              "type": "Ed25519Signature2020",
              "proofPurpose": "assertionMethod",
              "proofValue":
                "z57mt83Y11ZQMVHGzCNg77HMEeH2fPN6D6uBraqY8qKRC4ufwfXgRGdZMqWx6GBAy9RV7tLnp4UsoHXVSqefmQcpa",
              "verificationMethod":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "created": "2024-02-12T12:32:43.929955657Z",
            },
            "verified": true,
            "verificationMethod": {
              "id":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "type": "Ed25519VerificationKey2020",
              "controller": "did:web:id-plus.localhost%3A8443",
              "publicKeyJwk": {
                "kty": "OKP",
                "kid": "MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                "crv": "Ed25519",
                "alg": "EdDSA",
                "x": "6yUJruvdUvjwZpVdtxmAxoNI2UUc-LfL37cAZ09ffzs",
              },
              "publicKeyMultibase":
                "z6MkvHAcPJP22ge8zznDUtbhYJW4PDti14tUng99xUmcALFC",
              "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://identity.foundation/linked-vp/contexts/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
                {
                  "publicKeyJwk": {
                    "@id": "https://w3id.org/security#publicKeyJwk",
                    "@type": "@json",
                  },
                },
              ],
            },
            "purposeResult": {
              "valid": true,
              "controller": {
                "@context": [
                  "https://www.w3.org/ns/did/v1",
                  "https://identity.foundation/linked-vp/contexts/v1",
                  "https://w3id.org/security/suites/ed25519-2020/v1",
                  {
                    "publicKeyJwk": {
                      "@id": "https://w3id.org/security#publicKeyJwk",
                      "@type": "@json",
                    },
                  },
                ],
                "id": "did:web:id-plus.localhost%3A8443",
                "verificationMethod": [{
                  "id":
                    "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                  "type": "Ed25519VerificationKey2020",
                  "controller": "did:web:id-plus.localhost%3A8443",
                  "publicKeyJwk": {
                    "kty": "OKP",
                    "kid": "MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                    "crv": "Ed25519",
                    "alg": "EdDSA",
                    "x": "6yUJruvdUvjwZpVdtxmAxoNI2UUc-LfL37cAZ09ffzs",
                  },
                }],
                "authentication": [
                  "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                ],
                "assertionMethod": [
                  "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                ],
                "service": [{
                  "id": "did:web:id-plus.localhost%3A8443#plain",
                  "type": "LinkedVerifiablePresentation",
                  "serviceEndpoint":
                    "https://id-plus.localhost:8443/.well-known/presentation.json",
                }, {
                  "id": "did:web:id-plus.localhost%3A8443#business",
                  "type": "LinkedVerifiablePresentation",
                  "serviceEndpoint":
                    "https://id-plus.localhost:8443/.well-known/presentation.json",
                }],
              },
            },
          }],
        },
        "verified": true,
        "credentialResults": [{
          "verified": true,
          "results": [{
            "proof": {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
              ],
              "type": "Ed25519Signature2020",
              "proofPurpose": "assertionMethod",
              "proofValue":
                "z546i6F5zkrBtZViDsCRCThdCdzE9FajDYAyc4gXxSzf3gftxLyR39ovXVpFA3P3zeXaq452vN25wawN4LPy8uS9e",
              "verificationMethod":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "created": "2024-02-12T12:32:43.762815207Z",
            },
            "verified": true,
            "verificationMethod": {
              "id":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "type": "Ed25519VerificationKey2020",
              "controller": "did:web:id-plus.localhost%3A8443",
              "publicKeyJwk": {
                "kty": "OKP",
                "kid": "MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                "crv": "Ed25519",
                "alg": "EdDSA",
                "x": "6yUJruvdUvjwZpVdtxmAxoNI2UUc-LfL37cAZ09ffzs",
              },
              "publicKeyMultibase":
                "z6MkvHAcPJP22ge8zznDUtbhYJW4PDti14tUng99xUmcALFC",
              "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://identity.foundation/linked-vp/contexts/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
                {
                  "publicKeyJwk": {
                    "@id": "https://w3id.org/security#publicKeyJwk",
                    "@type": "@json",
                  },
                },
              ],
            },
            "purposeResult": { "valid": true },
          }],
        }],
      },
    }, {
      "presentation": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": [{
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/ed25519-2020/v1",
          ],
          "type": ["VerifiableCredential"],
          "credentialSubject": { "id": "did:web:id-plus.localhost%3A8443" },
          "issuer": "did:web:id-plus.localhost%3A8443",
          "issuanceDate": "2024-02-12T12:32:43Z",
          "proof": {
            "type": "Ed25519Signature2020",
            "proofPurpose": "assertionMethod",
            "proofValue":
              "z546i6F5zkrBtZViDsCRCThdCdzE9FajDYAyc4gXxSzf3gftxLyR39ovXVpFA3P3zeXaq452vN25wawN4LPy8uS9e",
            "verificationMethod":
              "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
            "created": "2024-02-12T12:32:43.762815207Z",
          },
        }],
        "proof": {
          "type": "Ed25519Signature2020",
          "proofPurpose": "assertionMethod",
          "proofValue":
            "z57mt83Y11ZQMVHGzCNg77HMEeH2fPN6D6uBraqY8qKRC4ufwfXgRGdZMqWx6GBAy9RV7tLnp4UsoHXVSqefmQcpa",
          "verificationMethod":
            "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
          "created": "2024-02-12T12:32:43.929955657Z",
        },
        "holder": "did:web:id-plus.localhost%3A8443",
      },
      "verification_result": {
        "presentationResult": {
          "verified": true,
          "results": [{
            "proof": {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
              ],
              "type": "Ed25519Signature2020",
              "proofPurpose": "assertionMethod",
              "proofValue":
                "z57mt83Y11ZQMVHGzCNg77HMEeH2fPN6D6uBraqY8qKRC4ufwfXgRGdZMqWx6GBAy9RV7tLnp4UsoHXVSqefmQcpa",
              "verificationMethod":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "created": "2024-02-12T12:32:43.929955657Z",
            },
            "verified": true,
            "verificationMethod": {
              "id":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "type": "Ed25519VerificationKey2020",
              "controller": "did:web:id-plus.localhost%3A8443",
              "publicKeyJwk": {
                "kty": "OKP",
                "kid": "MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                "crv": "Ed25519",
                "alg": "EdDSA",
                "x": "6yUJruvdUvjwZpVdtxmAxoNI2UUc-LfL37cAZ09ffzs",
              },
              "publicKeyMultibase":
                "z6MkvHAcPJP22ge8zznDUtbhYJW4PDti14tUng99xUmcALFC",
              "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://identity.foundation/linked-vp/contexts/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
                {
                  "publicKeyJwk": {
                    "@id": "https://w3id.org/security#publicKeyJwk",
                    "@type": "@json",
                  },
                },
              ],
            },
            "purposeResult": {
              "valid": true,
              "controller": {
                "@context": [
                  "https://www.w3.org/ns/did/v1",
                  "https://identity.foundation/linked-vp/contexts/v1",
                  "https://w3id.org/security/suites/ed25519-2020/v1",
                  {
                    "publicKeyJwk": {
                      "@id": "https://w3id.org/security#publicKeyJwk",
                      "@type": "@json",
                    },
                  },
                ],
                "id": "did:web:id-plus.localhost%3A8443",
                "verificationMethod": [{
                  "id":
                    "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                  "type": "Ed25519VerificationKey2020",
                  "controller": "did:web:id-plus.localhost%3A8443",
                  "publicKeyJwk": {
                    "kty": "OKP",
                    "kid": "MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                    "crv": "Ed25519",
                    "alg": "EdDSA",
                    "x": "6yUJruvdUvjwZpVdtxmAxoNI2UUc-LfL37cAZ09ffzs",
                  },
                }],
                "authentication": [
                  "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                ],
                "assertionMethod": [
                  "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                ],
                "service": [{
                  "id": "did:web:id-plus.localhost%3A8443#plain",
                  "type": "LinkedVerifiablePresentation",
                  "serviceEndpoint":
                    "https://id-plus.localhost:8443/.well-known/presentation.json",
                }, {
                  "id": "did:web:id-plus.localhost%3A8443#business",
                  "type": "LinkedVerifiablePresentation",
                  "serviceEndpoint":
                    "https://id-plus.localhost:8443/.well-known/presentation.json",
                }],
              },
            },
          }],
        },
        "verified": true,
        "credentialResults": [{
          "verified": true,
          "results": [{
            "proof": {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
              ],
              "type": "Ed25519Signature2020",
              "proofPurpose": "assertionMethod",
              "proofValue":
                "z546i6F5zkrBtZViDsCRCThdCdzE9FajDYAyc4gXxSzf3gftxLyR39ovXVpFA3P3zeXaq452vN25wawN4LPy8uS9e",
              "verificationMethod":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "created": "2024-02-12T12:32:43.762815207Z",
            },
            "verified": true,
            "verificationMethod": {
              "id":
                "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
              "type": "Ed25519VerificationKey2020",
              "controller": "did:web:id-plus.localhost%3A8443",
              "publicKeyJwk": {
                "kty": "OKP",
                "kid": "MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
                "crv": "Ed25519",
                "alg": "EdDSA",
                "x": "6yUJruvdUvjwZpVdtxmAxoNI2UUc-LfL37cAZ09ffzs",
              },
              "publicKeyMultibase":
                "z6MkvHAcPJP22ge8zznDUtbhYJW4PDti14tUng99xUmcALFC",
              "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://identity.foundation/linked-vp/contexts/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
                {
                  "publicKeyJwk": {
                    "@id": "https://w3id.org/security#publicKeyJwk",
                    "@type": "@json",
                  },
                },
              ],
            },
            "purposeResult": { "valid": true },
          }],
        }],
      },
    }],
    "diddoc": {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://identity.foundation/linked-vp/contexts/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
        {
          "publicKeyJwk": {
            "@id": "https://w3id.org/security#publicKeyJwk",
            "@type": "@json",
          },
        },
      ],
      "id": "did:web:id-plus.localhost%3A8443",
      "verificationMethod": [{
        "id":
          "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:web:id-plus.localhost%3A8443",
        "publicKeyJwk": {
          "kty": "OKP",
          "kid": "MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
          "crv": "Ed25519",
          "alg": "EdDSA",
          "x": "6yUJruvdUvjwZpVdtxmAxoNI2UUc-LfL37cAZ09ffzs",
        },
      }],
      "authentication": [
        "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
      ],
      "assertionMethod": [
        "did:web:id-plus.localhost%3A8443#MYIRc4JSHdBYPq-OJGVYVvdm9PB-C8Eua_JJX43BZ7g",
      ],
      "service": [{
        "id": "did:web:id-plus.localhost%3A8443#plain",
        "type": "LinkedVerifiablePresentation",
        "serviceEndpoint":
          "https://id-plus.localhost:8443/.well-known/presentation.json",
      }, {
        "id": "did:web:id-plus.localhost%3A8443#business",
        "type": "LinkedVerifiablePresentation",
        "serviceEndpoint":
          "https://id-plus.localhost:8443/.well-known/presentation.json",
      }],
    },
  },
};
