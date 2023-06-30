import * as base64url from "base64url-universal";
import * as base58btc from "base58-universal";

// Source: https://github.com/digitalbazaar/ed25519-verification-key-2020
// Licenes: https://github.com/digitalbazaar/ed25519-verification-key-2020/blob/main/LICENSE
// multibase base58-btc header
const MULTIBASE_BASE58BTC_HEADER = "z";
// multicodec ed25519-pub header as varint
const MULTICODEC_ED25519_PUB_HEADER = new Uint8Array([0xed, 0x01]);
// encode a multibase base58-btc multicodec key
function _encodeMbKey(header, key) {
  const mbKey = new Uint8Array(header.length + key.length);

  mbKey.set(header);
  mbKey.set(key, header.length);

  return MULTIBASE_BASE58BTC_HEADER + base58btc.encode(mbKey);
}

/**
 * Creates a key pair instance (public key only) from a JsonWebKey2020
 * object.
 *
 * @see https://w3c-ccg.github.io/lds-jws2020/#json-web-key-2020
 *
 * @param {object} options - Options hashmap.
 * @param {string} options.id - Key id.
 * @param {string} options.type - Key suite type.
 * @param {string} options.controller - Key controller.
 * @param {object} options.publicKeyJwk - JWK object.
 *
 * @returns {Promise<Ed25519VerificationKey2020>} Resolves with key pair.
 */
export function convertJWKtoMultibase(
  { id, controller, publicKeyJwk } = {},
) {
  // if (type !== "JsonWebKey2020") {
  //   throw new TypeError(`Invalid key type: "${type}".`);
  // }
  if (!publicKeyJwk) {
    throw new TypeError('"publicKeyJwk" property is required.');
  }
  const { kty, crv } = publicKeyJwk;
  if (kty !== "OKP") {
    throw new TypeError('"kty" is required to be "OKP".');
  }
  if (crv !== "Ed25519") {
    throw new TypeError('"crv" is required to be "Ed25519".');
  }
  const { x: publicKeyBase64Url } = publicKeyJwk;
  const publicKeyMultibase = _encodeMbKey(
    MULTICODEC_ED25519_PUB_HEADER,
    base64url.decode(publicKeyBase64Url),
  );

  return {
    id,
    controller,
    publicKeyMultibase,
  };
}
