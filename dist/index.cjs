"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ColumnType: () => ColumnType,
  default: () => MDBReader
});
module.exports = __toCommonJS(src_exports);

// src/SortOrder.ts
var GENERAL_SORT_ORDER_VALUE = 1033;
var GENERAL_97_SORT_ORDER = Object.freeze({ value: GENERAL_SORT_ORDER_VALUE, version: -1 });
var GENERAL_LEGACY_SORT_ORDER = Object.freeze({ value: GENERAL_SORT_ORDER_VALUE, version: 0 });
var GENERAL_SORT_ORDER = Object.freeze({ value: GENERAL_SORT_ORDER_VALUE, version: 1 });

// src/JetFormat/Jet4Format.ts
var jet4Format = {
  codecType: 0 /* JET */,
  pageSize: 4096,
  textEncoding: "ucs-2",
  defaultSortOrder: GENERAL_LEGACY_SORT_ORDER,
  databaseDefinitionPage: {
    encryptedSize: 128,
    passwordSize: 40,
    creationDateOffset: 114,
    defaultSortOrder: {
      offset: 110,
      size: 4
    }
  },
  dataPage: {
    recordCountOffset: 12,
    record: {
      countOffset: 12,
      columnCountSize: 2,
      variableColumnCountSize: 2
    }
  },
  tableDefinitionPage: {
    rowCountOffset: 16,
    variableColumnCountOffset: 43,
    columnCountOffset: 45,
    logicalIndexCountOffset: 47,
    realIndexCountOffset: 51,
    realIndexStartOffset: 63,
    realIndexEntrySize: 12,
    columnsDefinition: {
      typeOffset: 0,
      indexOffset: 5,
      variableIndexOffset: 7,
      flagsOffset: 15,
      fixedIndexOffset: 21,
      sizeOffset: 23,
      entrySize: 25
    },
    columnNames: {
      nameLengthSize: 2
    },
    usageMapOffset: 55
  }
};

// src/JetFormat/Jet12Format.ts
var jet12Format = {
  ...jet4Format,
  codecType: 2 /* OFFICE */
};

// src/JetFormat/Jet14Format.ts
var jet14Format = {
  ...jet12Format,
  defaultSortOrder: GENERAL_SORT_ORDER
};

// src/JetFormat/Jet15Format.ts
var jet15Format = jet14Format;

// src/JetFormat/Jet16Format.ts
var jet16Format = jet15Format;

// src/JetFormat/Jet17Format.ts
var jet17Format = jet16Format;

// src/JetFormat/Jet3Format.ts
var jet3Format = {
  codecType: 0 /* JET */,
  pageSize: 2048,
  textEncoding: "unknown",
  defaultSortOrder: GENERAL_97_SORT_ORDER,
  databaseDefinitionPage: {
    encryptedSize: 126,
    passwordSize: 20,
    creationDateOffset: null,
    defaultSortOrder: {
      offset: 58,
      size: 2
    }
  },
  dataPage: {
    recordCountOffset: 8,
    record: {
      countOffset: 8,
      columnCountSize: 1,
      variableColumnCountSize: 1
    }
  },
  tableDefinitionPage: {
    rowCountOffset: 12,
    columnCountOffset: 25,
    variableColumnCountOffset: 23,
    logicalIndexCountOffset: 27,
    realIndexCountOffset: 31,
    realIndexStartOffset: 43,
    realIndexEntrySize: 8,
    columnsDefinition: {
      typeOffset: 0,
      indexOffset: 1,
      variableIndexOffset: 3,
      flagsOffset: 13,
      fixedIndexOffset: 14,
      sizeOffset: 16,
      entrySize: 18
    },
    columnNames: {
      nameLengthSize: 1
    },
    usageMapOffset: 35
  }
};

// src/JetFormat/MSISAMFormat.ts
var msisamFormat = {
  ...jet4Format,
  codecType: 1 /* MSISAM */
};

// src/JetFormat/index.ts
var OFFSET_VERSION = 20;
var OFFSET_ENGINE_NAME = 4;
var MSISAM_ENGINE = Buffer.from("MSISAM Database", "ascii");
function getJetFormat(buffer) {
  const version = buffer[OFFSET_VERSION];
  switch (version) {
    case 0:
      return jet3Format;
    case 1:
      if (buffer.slice(OFFSET_ENGINE_NAME, OFFSET_ENGINE_NAME + MSISAM_ENGINE.length).equals(MSISAM_ENGINE)) {
        return msisamFormat;
      }
      return jet4Format;
    case 2:
      return jet12Format;
    case 3:
      return jet14Format;
    case 4:
      return jet15Format;
    case 5:
      return jet16Format;
    case 6:
      return jet17Format;
    default:
      throw new Error(`Unsupported version '${version}'`);
  }
}

// src/codec-handler/handlers/identity.ts
function createIdentityHandler() {
  return {
    decryptPage: (b) => b,
    verifyPassword: () => true
  };
}

// src/environment/node.ts
var import_crypto = require("crypto");

// src/crypto/blockDecrypt.ts
function blockDecrypt(cipher, key, iv, data) {
  const algorithm = `${cipher.algorithm}-${key.length * 8}-${cipher.chaining.slice(-3)}`;
  const decipher = (0, import_crypto.createDecipheriv)(algorithm, key, iv);
  decipher.setAutoPadding(false);
  return decipher.update(data);
}

// src/util.ts
function getBitmapValue(bitmap, pos) {
  const byteNumber = Math.floor(pos / 8);
  const bitNumber = pos % 8;
  return !!(bitmap[byteNumber] & 1 << bitNumber);
}
function roundToFullByte(bits) {
  return Math.floor((bits + 7) / 8);
}
function xor(a, b) {
  const length = Math.max(a.length, b.length);
  const buffer = Buffer.allocUnsafe(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = a[i] ^ b[i];
  }
  return buffer;
}
function isEmptyBuffer(buffer) {
  return buffer.every((v) => v === 0);
}
function intToBuffer(n) {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeInt32LE(n);
  return buffer;
}
function fixBufferLength(buffer, length, padByte = 0) {
  if (buffer.length > length) {
    return buffer.slice(0, length);
  }
  if (buffer.length < length) {
    return Buffer.from(buffer).fill(padByte, buffer.length, length);
  }
  return buffer;
}
function isInRange(from, to, value) {
  return from <= value && value <= to;
}

// src/crypto/hash.ts
function hash(algorithm, buffers, length) {
  const digest = (0, import_crypto.createHash)(algorithm);
  for (const buffer of buffers) {
    digest.update(buffer);
  }
  const result = digest.digest();
  if (length !== void 0) {
    return fixBufferLength(result, length);
  }
  return result;
}

// src/crypto/deriveKey.ts
function deriveKey(password, blockBytes, algorithm, salt, iterations, keyByteLength) {
  const baseHash = hash(algorithm, [salt, password]);
  const iterHash = iterateHash(algorithm, baseHash, iterations);
  const finalHash = hash(algorithm, [iterHash, blockBytes]);
  return fixBufferLength(finalHash, keyByteLength, 54);
}
function iterateHash(algorithm, baseBuffer, iterations) {
  let iterHash = baseBuffer;
  for (let i = 0; i < iterations; ++i) {
    iterHash = hash(algorithm, [intToBuffer(i), iterHash]);
  }
  return iterHash;
}

// src/crypto/rc4.ts
function decryptRC4(key, data) {
  const decrypt = createRC4Decrypter(key);
  return decrypt(data);
}
function createRC4Decrypter(key) {
  const S = createKeyStream(key);
  let i = 0;
  let j = 0;
  return (data) => {
    const resultBuffer = Buffer.from(data);
    for (let k = 0; k < data.length; ++k) {
      i = (i + 1) % 256;
      j = (j + S[i]) % 256;
      [S[i], S[j]] = [S[j], S[i]];
      resultBuffer[k] ^= S[(S[i] + S[j]) % 256];
    }
    return resultBuffer;
  };
}
function createKeyStream(key) {
  const S = new Uint8Array(256);
  for (let i = 0; i < 256; ++i) {
    S[i] = i;
  }
  let j = 0;
  for (let i = 0; i < 256; ++i) {
    j = (j + S[i] + key[i % key.length]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }
  return S;
}

// src/codec-handler/util.ts
function getPageEncodingKey(encodingKey, pageNumber) {
  const pageIndexBuffer = Buffer.alloc(4);
  pageIndexBuffer.writeUInt32LE(pageNumber);
  return xor(pageIndexBuffer, encodingKey);
}

// src/codec-handler/handlers/jet.ts
var KEY_OFFSET = 62;
var KEY_SIZE = 4;
function createJetCodecHandler(databaseDefinitionPage) {
  const encodingKey = databaseDefinitionPage.slice(KEY_OFFSET, KEY_OFFSET + KEY_SIZE);
  if (isEmptyBuffer(encodingKey)) {
    return createIdentityHandler();
  }
  const decryptPage = (pageBuffer, pageIndex) => {
    const pagekey = getPageEncodingKey(encodingKey, pageIndex);
    return decryptRC4(pagekey, pageBuffer);
  };
  return {
    decryptPage,
    verifyPassword: () => true
  };
}

// src/codec-handler/handlers/office/agile/EncryptionDescriptor.ts
var import_fast_xml_parser = __toESM(require("fast-xml-parser"), 1);
var xmlParser = new import_fast_xml_parser.default.XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: true
});
var RESERVED_VALUE = 64;
function parseEncryptionDescriptor(buffer) {
  const reservedValue = buffer.readInt16LE(4);
  if (reservedValue !== RESERVED_VALUE) {
    throw new Error(`Unexpected reserved value ${reservedValue}`);
  }
  const xmlBuffer = buffer.slice(8);
  const xmlString = xmlBuffer.toString("ascii");
  const parsedXML = xmlParser.parse(xmlString);
  const keyData = parsedXML.encryption.keyData;
  const keyEncryptor = parsedXML.encryption.keyEncryptors.keyEncryptor["p:encryptedKey"];
  return {
    keyData: {
      blockSize: keyData.blockSize,
      cipher: {
        algorithm: keyData.cipherAlgorithm,
        chaining: keyData.cipherChaining
      },
      hash: {
        size: keyData.hashSize,
        algorithm: keyEncryptor.hashAlgorithm
      },
      salt: Buffer.from(keyData.saltValue, "base64")
    },
    passwordKeyEncryptor: {
      blockSize: keyEncryptor.blockSize,
      keyBits: keyEncryptor.keyBits,
      spinCount: keyEncryptor.spinCount,
      cipher: {
        algorithm: keyEncryptor.cipherAlgorithm,
        chaining: keyEncryptor.cipherChaining
      },
      hash: {
        size: keyEncryptor.hashSize,
        algorithm: keyEncryptor.hashAlgorithm
      },
      salt: Buffer.from(keyEncryptor.saltValue, "base64"),
      encrypted: {
        keyValue: Buffer.from(keyEncryptor.encryptedKeyValue, "base64"),
        verifierHashInput: Buffer.from(keyEncryptor.encryptedVerifierHashInput, "base64"),
        verifierHashValue: Buffer.from(keyEncryptor.encryptedVerifierHashValue, "base64")
      }
    }
  };
}

// src/codec-handler/handlers/office/agile/index.ts
var ENC_VERIFIER_INPUT_BLOCK = Buffer.from([254, 167, 210, 118, 59, 75, 158, 121]);
var ENC_VERIFIER_VALUE_BLOCK = Buffer.from([215, 170, 15, 109, 48, 97, 52, 78]);
var ENC_VALUE_BLOCK = Buffer.from([20, 110, 11, 231, 171, 172, 208, 214]);
function createAgileCodecHandler(encodingKey, encryptionProvider, password) {
  const { keyData, passwordKeyEncryptor } = parseEncryptionDescriptor(encryptionProvider);
  const key = decryptKeyValue(password, passwordKeyEncryptor);
  const decryptPage = (b, pageNumber) => {
    const pageEncodingKey = getPageEncodingKey(encodingKey, pageNumber);
    const iv = hash(keyData.hash.algorithm, [keyData.salt, pageEncodingKey], keyData.blockSize);
    return blockDecrypt(keyData.cipher, key, iv, b);
  };
  const verifyPassword = () => {
    const verifier = decryptVerifierHashInput(password, passwordKeyEncryptor);
    const verifierHash = decryptVerifierHashValue(password, passwordKeyEncryptor);
    let testHash = hash(passwordKeyEncryptor.hash.algorithm, [verifier]);
    const blockSize = passwordKeyEncryptor.blockSize;
    if (testHash.length % blockSize != 0) {
      const hashLength = Math.floor((testHash.length + blockSize - 1) / blockSize) * blockSize;
      testHash = fixBufferLength(testHash, hashLength);
    }
    return verifierHash.equals(testHash);
  };
  return {
    decryptPage,
    verifyPassword
  };
}
function decryptKeyValue(password, passwordKeyEncryptor) {
  const key = deriveKey(password, ENC_VALUE_BLOCK, passwordKeyEncryptor.hash.algorithm, passwordKeyEncryptor.salt, passwordKeyEncryptor.spinCount, roundToFullByte(passwordKeyEncryptor.keyBits));
  return blockDecrypt(passwordKeyEncryptor.cipher, key, passwordKeyEncryptor.salt, passwordKeyEncryptor.encrypted.keyValue);
}
function decryptVerifierHashInput(password, passwordKeyEncryptor) {
  const key = deriveKey(password, ENC_VERIFIER_INPUT_BLOCK, passwordKeyEncryptor.hash.algorithm, passwordKeyEncryptor.salt, passwordKeyEncryptor.spinCount, roundToFullByte(passwordKeyEncryptor.keyBits));
  return blockDecrypt(passwordKeyEncryptor.cipher, key, passwordKeyEncryptor.salt, passwordKeyEncryptor.encrypted.verifierHashInput);
}
function decryptVerifierHashValue(password, passwordKeyEncryptor) {
  const key = deriveKey(password, ENC_VERIFIER_VALUE_BLOCK, passwordKeyEncryptor.hash.algorithm, passwordKeyEncryptor.salt, passwordKeyEncryptor.spinCount, roundToFullByte(passwordKeyEncryptor.keyBits));
  return blockDecrypt(passwordKeyEncryptor.cipher, key, passwordKeyEncryptor.salt, passwordKeyEncryptor.encrypted.verifierHashValue);
}

// src/codec-handler/handlers/office/CryptoAlgorithm.ts
var EXTERNAL = {
  id: 0,
  encryptionVerifierHashLength: 0,
  keySizeMin: 0,
  keySizeMax: 0
};
var RC4 = {
  id: 26625,
  encryptionVerifierHashLength: 20,
  keySizeMin: 40,
  keySizeMax: 512
};
var AES_128 = {
  id: 26625,
  encryptionVerifierHashLength: 32,
  keySizeMin: 128,
  keySizeMax: 128
};
var AES_192 = {
  id: 26127,
  encryptionVerifierHashLength: 32,
  keySizeMin: 192,
  keySizeMax: 192
};
var AES_256 = {
  id: 26128,
  encryptionVerifierHashLength: 32,
  keySizeMin: 256,
  keySizeMax: 256
};
var CRYPTO_ALGORITHMS = { EXTERNAL, RC4, AES_128, AES_192, AES_256 };

// src/codec-handler/handlers/office/HashAlgorithm.ts
var EXTERNAL2 = { id: 0 };
var SHA1 = { id: 32772 };
var HASH_ALGORITHMS = { EXTERNAL: EXTERNAL2, SHA1 };

// src/codec-handler/handlers/office/EncryptionHeader.ts
var FLAGS_OFFSET = 0;
var CRYPTO_OFFSET = 8;
var HASH_OFFSET = 12;
var KEY_SIZE_OFFSET = 16;
var EncryptionHeaderFlags = {
  FCRYPTO_API_FLAG: 4,
  FDOC_PROPS_FLAG: 8,
  FEXTERNAL_FLAG: 16,
  FAES_FLAG: 32
};
function parseEncryptionHeader(buffer, validCryptoAlgorithms, validHashAlgorithm) {
  const flags = buffer.readInt32LE(FLAGS_OFFSET);
  const cryptoAlgorithm = getCryptoAlgorithm(buffer.readInt32LE(CRYPTO_OFFSET), flags);
  const hashAlgorithm = getHashAlgorithm(buffer.readInt32LE(HASH_OFFSET), flags);
  const keySize = getKeySize(buffer.readInt32LE(KEY_SIZE_OFFSET), cryptoAlgorithm, getCSPName(buffer.slice(32)));
  if (!validCryptoAlgorithms.includes(cryptoAlgorithm)) {
    throw new Error("Invalid encryption algorithm");
  }
  if (!validHashAlgorithm.includes(hashAlgorithm)) {
    throw new Error("Invalid hash algorithm");
  }
  if (!isInRange(cryptoAlgorithm.keySizeMin, cryptoAlgorithm.keySizeMax, keySize)) {
    throw new Error("Invalid key size");
  }
  if (keySize % 8 !== 0) {
    throw new Error("Key size must be multiple of 8");
  }
  return {
    cryptoAlgorithm,
    hashAlgorithm,
    keySize
  };
}
function getCryptoAlgorithm(id, flags) {
  if (id === CRYPTO_ALGORITHMS.EXTERNAL.id) {
    if (isFlagSet(flags, EncryptionHeaderFlags.FEXTERNAL_FLAG)) {
      return CRYPTO_ALGORITHMS.EXTERNAL;
    }
    if (isFlagSet(flags, EncryptionHeaderFlags.FCRYPTO_API_FLAG)) {
      if (isFlagSet(flags, EncryptionHeaderFlags.FAES_FLAG)) {
        return CRYPTO_ALGORITHMS.AES_128;
      } else {
        return CRYPTO_ALGORITHMS.RC4;
      }
    }
    throw new Error("Unsupported encryption algorithm");
  }
  const algorithm = Object.values(CRYPTO_ALGORITHMS).find((alg) => alg.id === id);
  if (algorithm) {
    return algorithm;
  }
  throw new Error("Unsupported encryption algorithm");
}
function getHashAlgorithm(id, flags) {
  if (id === HASH_ALGORITHMS.EXTERNAL.id) {
    if (isFlagSet(flags, EncryptionHeaderFlags.FEXTERNAL_FLAG)) {
      return HASH_ALGORITHMS.EXTERNAL;
    }
    return HASH_ALGORITHMS.SHA1;
  }
  const algorithm = Object.values(HASH_ALGORITHMS).find((alg) => alg.id === id);
  if (algorithm) {
    return algorithm;
  }
  throw new Error("Unsupported hash algorithm");
}
function getCSPName(buffer) {
  const str = buffer.toString("utf16le");
  return str.slice(0, str.length - 1);
}
function getKeySize(keySize, algorithm, cspName) {
  if (keySize !== 0) {
    return keySize;
  }
  if (algorithm === CRYPTO_ALGORITHMS.RC4) {
    const cspLowerTrimmed = cspName.trim().toLowerCase();
    if (cspLowerTrimmed.length === 0 || cspLowerTrimmed.includes(" base ")) {
      return 40;
    } else {
      return 128;
    }
  }
  return 0;
}
function isFlagSet(flagValue, flagMask) {
  return (flagValue & flagMask) !== 0;
}

// src/codec-handler/handlers/office/EncryptionVerifier.ts
var SALT_SIZE_OFFSET = 138;
var SALT_OFFSET = 142;
var ENC_VERIFIER_SIZE = 16;
var SALT_SIZE = 16;
function parseEncryptionVerifier(encryptionProvider, cryptoAlgorithm) {
  const saltSize = encryptionProvider.readInt32LE(SALT_SIZE_OFFSET);
  if (saltSize !== SALT_SIZE) {
    throw new Error("Wrong salt size");
  }
  const salt = encryptionProvider.slice(SALT_OFFSET, SALT_OFFSET + SALT_SIZE);
  const encryptionVerifierOffset = SALT_OFFSET + SALT_SIZE;
  const verifierHashSizeOffset = encryptionVerifierOffset + ENC_VERIFIER_SIZE;
  const verifierHashOffset = verifierHashSizeOffset + 4;
  const encryptionVerifier = encryptionProvider.slice(encryptionVerifierOffset, verifierHashSizeOffset);
  const encryptionVerifierHashSize = encryptionProvider.readInt32LE(verifierHashSizeOffset);
  const encryptionVerifierHash = encryptionProvider.slice(verifierHashOffset, verifierHashOffset + cryptoAlgorithm.encryptionVerifierHashLength);
  return { salt, encryptionVerifier, encryptionVerifierHash, encryptionVerifierHashSize };
}

// src/codec-handler/handlers/office/rc4-cryptoapi.ts
var VALID_CRYPTO_ALGORITHMS = [CRYPTO_ALGORITHMS.RC4];
var VALID_HASH_ALGORITHMS = [HASH_ALGORITHMS.SHA1];
function createRC4CryptoAPICodecHandler(encodingKey, encryptionProvider, password) {
  const headerLength = encryptionProvider.readInt32LE(8);
  const headerBuffer = encryptionProvider.slice(12, 12 + headerLength);
  const encryptionHeader = parseEncryptionHeader(headerBuffer, VALID_CRYPTO_ALGORITHMS, VALID_HASH_ALGORITHMS);
  const encryptionVerifier = parseEncryptionVerifier(encryptionProvider, encryptionHeader.cryptoAlgorithm);
  const baseHash = hash("sha1", [encryptionVerifier.salt, password]);
  const decryptPage = (pageBuffer, pageIndex) => {
    const pageEncodingKey = getPageEncodingKey(encodingKey, pageIndex);
    const encryptionKey = getEncryptionKey(encryptionHeader, baseHash, pageEncodingKey);
    return decryptRC4(encryptionKey, pageBuffer);
  };
  return {
    decryptPage,
    verifyPassword: () => {
      const encryptionKey = getEncryptionKey(encryptionHeader, baseHash, intToBuffer(0));
      const rc4Decrypter = createRC4Decrypter(encryptionKey);
      const verifier = rc4Decrypter(encryptionVerifier.encryptionVerifier);
      const verifierHash = fixBufferLength(rc4Decrypter(encryptionVerifier.encryptionVerifierHash), encryptionVerifier.encryptionVerifierHashSize);
      const testHash = fixBufferLength(hash("sha1", [verifier]), encryptionVerifier.encryptionVerifierHashSize);
      return verifierHash.equals(testHash);
    }
  };
}
function getEncryptionKey(header, baseHash, data) {
  const key = hash("sha1", [baseHash, data], roundToFullByte(header.keySize));
  if (header.keySize === 40) {
    return key.slice(0, roundToFullByte(128));
  }
  return key;
}

// src/codec-handler/handlers/office/index.ts
var MAX_PASSWORD_LENGTH = 255;
var CRYPT_STRUCTURE_OFFSET = 665;
var KEY_OFFSET2 = 62;
var KEY_SIZE2 = 4;
function createOfficeCodecHandler(databaseDefinitionPage, password) {
  const encodingKey = databaseDefinitionPage.slice(KEY_OFFSET2, KEY_OFFSET2 + KEY_SIZE2);
  if (isEmptyBuffer(encodingKey)) {
    return createIdentityHandler();
  }
  const passwordBuffer = Buffer.from(password.substring(0, MAX_PASSWORD_LENGTH), "utf16le");
  const infoLength = databaseDefinitionPage.readUInt16LE(CRYPT_STRUCTURE_OFFSET);
  const encryptionProviderBuffer = databaseDefinitionPage.slice(CRYPT_STRUCTURE_OFFSET + 2, CRYPT_STRUCTURE_OFFSET + 2 + infoLength);
  const version = `${encryptionProviderBuffer.readUInt16LE(0)}.${encryptionProviderBuffer.readUInt16LE(2)}`;
  switch (version) {
    case "4.4":
      return createAgileCodecHandler(encodingKey, encryptionProviderBuffer, passwordBuffer);
    case "4.3":
    case "3.3":
      throw new Error("Extensible encryption provider is not supported");
    case "4.2":
    case "3.2":
    case "2.2":
      {
        const flags = encryptionProviderBuffer.readInt32LE(4);
        if (isFlagSet(flags, EncryptionHeaderFlags.FCRYPTO_API_FLAG)) {
          if (isFlagSet(flags, EncryptionHeaderFlags.FAES_FLAG)) {
            throw new Error("Not implemented yet");
          } else {
            try {
              return createRC4CryptoAPICodecHandler(encodingKey, encryptionProviderBuffer, passwordBuffer);
            } catch (e) {
            }
            throw new Error("Not implemented yet");
          }
        } else {
          throw new Error("Unknown encryption");
        }
      }
      break;
    case "1.1":
      throw new Error("Not implemented yet");
    default:
      throw new Error(`Unsupported encryption provider: ${version}`);
  }
}

// src/codec-handler/create.ts
function createCodecHandler(databaseDefinitionPage, password) {
  const format2 = getJetFormat(databaseDefinitionPage);
  switch (format2.codecType) {
    case 0 /* JET */:
      return createJetCodecHandler(databaseDefinitionPage);
    case 2 /* OFFICE */:
      return createOfficeCodecHandler(databaseDefinitionPage, password);
    default:
      return createIdentityHandler();
  }
}

// src/data/datetime.ts
function readDateTime(buffer) {
  const td = buffer.readDoubleLE();
  const daysDiff = 25569;
  return new Date(Math.round((td - daysDiff) * 86400 * 1e3));
}

// src/PageType.ts
var PageType = /* @__PURE__ */ ((PageType2) => {
  PageType2[PageType2["DatabaseDefinitionPage"] = 0] = "DatabaseDefinitionPage";
  PageType2[PageType2["DataPage"] = 1] = "DataPage";
  PageType2[PageType2["TableDefinition"] = 2] = "TableDefinition";
  PageType2[PageType2["IntermediateIndexPage"] = 3] = "IntermediateIndexPage";
  PageType2[PageType2["LeafIndexPages"] = 4] = "LeafIndexPages";
  PageType2[PageType2["PageUsageBitmaps"] = 5] = "PageUsageBitmaps";
  return PageType2;
})(PageType || {});
var PageType_default = PageType;
function assertPageType(buffer, pageType) {
  if (buffer[0] !== pageType) {
    throw new Error(`Wrong page type. Expected ${pageType} but received ${buffer[0]}.`);
  }
}

// src/unicodeCompression.ts
function uncompressText(buffer, format2) {
  if (format2.textEncoding === "unknown") {
    return decodeWindows1252(buffer);
  }
  if (buffer.length <= 2 || (buffer.readUInt8(0) & 255) !== 255 || (buffer.readUInt8(1) & 255) !== 254) {
    return buffer.toString("ucs-2");
  }
  let compressedMode = true;
  let curPos = 2;
  const uncompressedBuffer = Buffer.alloc((buffer.length - curPos) * 2);
  let uncompressedBufferPos = 0;
  while (curPos < buffer.length) {
    const curByte = buffer.readUInt8(curPos++);
    if (curByte === 0) {
      compressedMode = !compressedMode;
    } else if (compressedMode) {
      uncompressedBuffer[uncompressedBufferPos++] = curByte;
      uncompressedBuffer[uncompressedBufferPos++] = 0;
    } else if (buffer.length - curPos >= 2) {
      uncompressedBuffer[uncompressedBufferPos++] = curByte;
      uncompressedBuffer[uncompressedBufferPos++] = buffer.readUInt8(curPos++);
    }
  }
  return uncompressedBuffer.slice(0, uncompressedBufferPos).toString("ucs-2");
}
var ASCII_CHARS = Array.from(new Array(128).keys()).map((i) => String.fromCharCode(i)).join("");
var WINDOWS_1252_CHARS = "\u20AC\uFFFD\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\uFFFD\u017D\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\uFFFD\u017E\u0178\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF";
function decodeWindows1252(buffer) {
  const chars = `${ASCII_CHARS}${WINDOWS_1252_CHARS}`;
  const charsBuffer = Buffer.from(chars, "ucs2");
  const result = Buffer.alloc(buffer.length * 2);
  for (let i = 0; i < buffer.length; ++i) {
    const index = buffer[i] * 2;
    result[i * 2] = charsBuffer[index];
    result[i * 2 + 1] = charsBuffer[index + 1];
  }
  return result.toString("ucs2");
}

// src/Database.ts
var PASSWORD_OFFSET = 66;
var Database = class {
  constructor(buffer, password) {
    this.buffer = buffer;
    this.password = password;
    assertPageType(this.buffer, PageType_default.DatabaseDefinitionPage);
    this.format = getJetFormat(this.buffer);
    this.databaseDefinitionPage = Buffer.alloc(this.format.pageSize);
    this.buffer.copy(this.databaseDefinitionPage, 0, 0, this.format.pageSize);
    decryptHeader(this.databaseDefinitionPage, this.format);
    this.codecHandler = createCodecHandler(this.databaseDefinitionPage, password);
    if (!this.codecHandler.verifyPassword()) {
      throw new Error("Wrong password");
    }
  }
  getPassword() {
    let passwordBuffer = this.databaseDefinitionPage.slice(PASSWORD_OFFSET, PASSWORD_OFFSET + this.format.databaseDefinitionPage.passwordSize);
    const mask = this.getPasswordMask();
    if (mask !== null) {
      passwordBuffer = xor(passwordBuffer, mask);
    }
    if (isEmptyBuffer(passwordBuffer)) {
      return null;
    }
    let password = uncompressText(passwordBuffer, this.format);
    const nullCharIndex = password.indexOf("\0");
    if (nullCharIndex >= 0) {
      password = password.slice(0, nullCharIndex);
    }
    return password;
  }
  getPasswordMask() {
    if (this.format.databaseDefinitionPage.creationDateOffset === null) {
      return null;
    }
    const mask = Buffer.alloc(this.format.databaseDefinitionPage.passwordSize);
    const dateValue = this.databaseDefinitionPage.readDoubleLE(this.format.databaseDefinitionPage.creationDateOffset);
    mask.writeInt32LE(Math.floor(dateValue));
    for (let i = 0; i < mask.length; ++i) {
      mask[i] = mask[i % 4];
    }
    return mask;
  }
  getCreationDate() {
    if (this.format.databaseDefinitionPage.creationDateOffset === null) {
      return null;
    }
    const creationDateBuffer = this.databaseDefinitionPage.slice(this.format.databaseDefinitionPage.creationDateOffset, this.format.databaseDefinitionPage.creationDateOffset + 8);
    return readDateTime(creationDateBuffer);
  }
  getDefaultSortOrder() {
    const value = this.databaseDefinitionPage.readUInt16LE(this.format.databaseDefinitionPage.defaultSortOrder.offset + 3);
    if (value === 0) {
      return this.format.defaultSortOrder;
    }
    let version = this.format.defaultSortOrder.version;
    if (this.format.databaseDefinitionPage.defaultSortOrder.size == 4) {
      version = this.databaseDefinitionPage.readUInt8(this.format.databaseDefinitionPage.defaultSortOrder.offset + 3);
    }
    return Object.freeze({ value, version });
  }
  getPage(page) {
    if (page === 0) {
      return this.databaseDefinitionPage;
    }
    const offset = page * this.format.pageSize;
    if (this.buffer.length < offset) {
      throw new Error(`Page ${page} does not exist`);
    }
    const pageBuffer = this.buffer.slice(offset, offset + this.format.pageSize);
    return this.codecHandler.decryptPage(pageBuffer, page);
  }
  findPageRow(pageRow) {
    const page = pageRow >> 8;
    const row = pageRow & 255;
    const pageBuffer = this.getPage(page);
    return this.findRow(pageBuffer, row);
  }
  findRow(pageBuffer, row) {
    const rco = this.format.dataPage.recordCountOffset;
    if (row > 1e3) {
      throw new Error("Cannot read rows > 1000");
    }
    const start = pageBuffer.readUInt16LE(rco + 2 + row * 2);
    const nextStart = row === 0 ? this.format.pageSize : pageBuffer.readUInt16LE(rco + row * 2);
    return pageBuffer.slice(start, nextStart);
  }
};
var ENCRYPTION_START = 24;
var ENCRYPTION_KEY = Buffer.from([199, 218, 57, 107]);
function decryptHeader(buffer, format2) {
  const decryptedBuffer = decryptRC4(ENCRYPTION_KEY, buffer.slice(ENCRYPTION_START, ENCRYPTION_START + format2.databaseDefinitionPage.encryptedSize));
  decryptedBuffer.copy(buffer, ENCRYPTION_START);
}

// src/SysObject.ts
var SysObjectType = /* @__PURE__ */ ((SysObjectType2) => {
  SysObjectType2[SysObjectType2["Form"] = 0] = "Form";
  SysObjectType2[SysObjectType2["Table"] = 1] = "Table";
  SysObjectType2[SysObjectType2["Macro"] = 2] = "Macro";
  SysObjectType2[SysObjectType2["SystemTable"] = 3] = "SystemTable";
  SysObjectType2[SysObjectType2["Report"] = 4] = "Report";
  SysObjectType2[SysObjectType2["Query"] = 5] = "Query";
  SysObjectType2[SysObjectType2["LinkedTable"] = 6] = "LinkedTable";
  SysObjectType2[SysObjectType2["Module"] = 7] = "Module";
  SysObjectType2[SysObjectType2["Relationship"] = 8] = "Relationship";
  SysObjectType2[SysObjectType2["DatabaseProperty"] = 11] = "DatabaseProperty";
  return SysObjectType2;
})(SysObjectType || {});
function isSysObjectType(typeValue) {
  return Object.values(SysObjectType).includes(typeValue);
}
var SYSTEM_OBJECT_FLAG = 2147483648;
var ALT_SYSTEM_OBJECT_FLAG = 2;
var SYSTEM_OBJECT_FLAGS = SYSTEM_OBJECT_FLAG | ALT_SYSTEM_OBJECT_FLAG;
function isSystemObject(o) {
  return (o.flags & SYSTEM_OBJECT_FLAGS) !== 0;
}

// src/types.ts
var ColumnType = /* @__PURE__ */ ((ColumnType2) => {
  ColumnType2["Boolean"] = "boolean";
  ColumnType2["Byte"] = "byte";
  ColumnType2["Integer"] = "integer";
  ColumnType2["Long"] = "long";
  ColumnType2["Currency"] = "currency";
  ColumnType2["Float"] = "float";
  ColumnType2["Double"] = "double";
  ColumnType2["DateTime"] = "datetime";
  ColumnType2["Binary"] = "binary";
  ColumnType2["Text"] = "text";
  ColumnType2["OLE"] = "ole";
  ColumnType2["Memo"] = "memo";
  ColumnType2["RepID"] = "repid";
  ColumnType2["Numeric"] = "numeric";
  ColumnType2["Complex"] = "complex";
  ColumnType2["BigInt"] = "bigint";
  ColumnType2["DateTimeExtended"] = "datetimextended";
  return ColumnType2;
})(ColumnType || {});

// src/column.ts
var columnTypeMap = {
  1: "boolean" /* Boolean */,
  2: "byte" /* Byte */,
  3: "integer" /* Integer */,
  4: "long" /* Long */,
  5: "currency" /* Currency */,
  6: "float" /* Float */,
  7: "double" /* Double */,
  8: "datetime" /* DateTime */,
  9: "binary" /* Binary */,
  10: "text" /* Text */,
  11: "long" /* Long */,
  12: "memo" /* Memo */,
  15: "repid" /* RepID */,
  16: "numeric" /* Numeric */,
  18: "complex" /* Complex */,
  19: "bigint" /* BigInt */,
  20: "datetimextended" /* DateTimeExtended */
};
function getColumnType(typeValue) {
  const type = columnTypeMap[typeValue];
  if (type === void 0) {
    throw new Error("Unsupported column type");
  }
  return type;
}
function parseColumnFlags(flags) {
  return {
    fixedLength: !!(flags & 1),
    nullable: !!(flags & 2),
    autoLong: !!(flags & 4),
    autoUUID: !!(flags & 64)
  };
}

// src/data/bigint.ts
function readBigInt(buffer) {
  return buffer.readBigInt64LE();
}

// src/data/binary.ts
function readBinary(buffer) {
  const result = Buffer.alloc(buffer.length);
  buffer.copy(result);
  return result;
}

// src/data/byte.ts
function readByte(buffer) {
  return buffer.readUInt8();
}

// src/data/complexOrLong.ts
function readComplexOrLong(buffer) {
  return buffer.readInt32LE();
}

// src/array.ts
function doCarry(values) {
  const result = [...values];
  const length = result.length;
  for (let i = 0; i < length - 1; ++i) {
    result[i + 1] += Math.floor(result[i] / 10);
    result[i] = result[i] % 10;
  }
  result[length - 1] = result[length - 1] % 10;
  return result;
}
function multiplyArray(a, b) {
  if (a.length !== b.length) {
    throw new Error("Array a and b must have the same length");
  }
  const result = new Array(a.length).fill(0);
  for (let i = 0; i < a.length; ++i) {
    if (a[i] === 0)
      continue;
    for (let j = 0; j < b.length; j++) {
      result[i + j] += a[i] * b[j];
    }
  }
  return doCarry(result.slice(0, a.length));
}
function addArray(a, b) {
  if (a.length !== b.length) {
    throw new Error("Array a and b must have the same length");
  }
  const length = a.length;
  const result = [];
  for (let i = 0; i < length; ++i) {
    result[i] = a[i] + b[i];
  }
  return doCarry(result);
}
function toArray(v, length) {
  return doCarry([v, ...new Array(length - 1).fill(0)]);
}

// src/data/util.ts
function buildValue(array, scale, negative) {
  const length = array.length;
  let value = "";
  if (negative) {
    value += "-";
  }
  let top = length;
  while (top > 0 && top - 1 > scale && !array[top - 1]) {
    top--;
  }
  if (top === 0) {
    value += "0";
  } else {
    for (let i = top; i > 0; i--) {
      if (i === scale) {
        value += ".";
      }
      value += array[i - 1].toString();
    }
  }
  return value;
}

// src/data/currency.ts
var MAX_PRECISION = 20;
function readCurrency(buffer) {
  const bytesCount = 8;
  const scale = 4;
  let product = toArray(0, MAX_PRECISION);
  let multiplier = toArray(1, MAX_PRECISION);
  const bytes = buffer.slice(0, bytesCount);
  let negative = false;
  if (bytes[bytesCount - 1] & 128) {
    negative = true;
    for (let i = 0; i < bytesCount; ++i) {
      bytes[i] = ~bytes[i];
    }
    for (let i = 0; i < bytesCount; ++i) {
      ++bytes[i];
      if (bytes[i] != 0) {
        break;
      }
    }
  }
  for (const byte of bytes) {
    product = addArray(product, multiplyArray(multiplier, toArray(byte, MAX_PRECISION)));
    multiplier = multiplyArray(multiplier, toArray(256, MAX_PRECISION));
  }
  return buildValue(product, scale, negative);
}

// src/data/datetimextended.ts
var DAYS_START = 0;
var DAYS_LENGTH = 19;
var SECONDS_START = DAYS_START + DAYS_LENGTH + 1;
var SECONDS_LENGTH = 12;
var NANOS_START = SECONDS_START + SECONDS_LENGTH;
var NANOS_LENGTH = 7;
function readDateTimeExtended(buffer) {
  const days = parseBigInt(buffer.slice(DAYS_START, DAYS_START + DAYS_LENGTH));
  const seconds = parseBigInt(buffer.slice(SECONDS_START, SECONDS_START + SECONDS_LENGTH));
  const nanos = parseBigInt(buffer.slice(NANOS_START, NANOS_START + NANOS_LENGTH)) * 100n;
  return format(days, seconds, nanos);
}
function parseBigInt(buffer) {
  return BigInt(buffer.toString("ascii"));
}
function format(days, seconds, nanos) {
  const date = new Date(0);
  date.setUTCFullYear(1);
  date.setUTCDate(date.getUTCDate() + Number(days));
  date.setUTCSeconds(date.getUTCSeconds() + Number(seconds));
  let result = "";
  result += date.getFullYear().toString().padStart(4, "0");
  result += `.${(date.getUTCMonth() + 1).toString().padStart(2, "0")}`;
  result += `.${date.getUTCDate().toString().padStart(2, "0")}`;
  result += ` ${date.getUTCHours().toString().padStart(2, "0")}`;
  result += `:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  result += `:${date.getUTCSeconds().toString().padStart(2, "0")}`;
  result += `.${nanos.toString().padStart(9, "0")}`;
  return result;
}

// src/data/double.ts
function readDouble(buffer) {
  return buffer.readDoubleLE();
}

// src/data/float.ts
function readFloat(buffer) {
  return buffer.readFloatLE();
}

// src/data/integer.ts
function readInteger(buffer) {
  return buffer.readInt16LE();
}

// src/data/memo.ts
function readMemo(buffer, _col, db) {
  const memoLength = buffer.readUIntLE(0, 3);
  const bitmask = buffer.readUInt8(3);
  if (bitmask & 128) {
    return uncompressText(buffer.slice(12, 12 + memoLength), db.format);
  } else if (bitmask & 64) {
    const pageRow = buffer.readUInt32LE(4);
    const rowBuffer = db.findPageRow(pageRow);
    return uncompressText(rowBuffer.slice(0, memoLength), db.format);
  } else if (bitmask === 0) {
    let pageRow = buffer.readInt32LE(4);
    let memoDataBuffer = Buffer.alloc(0);
    do {
      const rowBuffer = db.findPageRow(pageRow);
      if (memoDataBuffer.length + rowBuffer.length - 4 > memoLength) {
        break;
      }
      if (rowBuffer.length === 0) {
        break;
      }
      memoDataBuffer = Buffer.concat([memoDataBuffer, rowBuffer.slice(4, buffer.length)]);
      pageRow = rowBuffer.readInt32LE(0);
    } while (pageRow !== 0);
    return uncompressText(memoDataBuffer.slice(0, memoLength), db.format);
  } else {
    throw new Error(`Unknown memo type ${bitmask}`);
  }
}

// src/data/numeric.ts
var MAX_PRECISION2 = 40;
function readNumeric(buffer, column) {
  let product = toArray(0, MAX_PRECISION2);
  let multiplier = toArray(1, MAX_PRECISION2);
  const bytes = buffer.slice(1, 17);
  for (let i = 0; i < bytes.length; ++i) {
    const byte = bytes[12 - 4 * Math.floor(i / 4) + i % 4];
    product = addArray(product, multiplyArray(multiplier, toArray(byte, MAX_PRECISION2)));
    multiplier = multiplyArray(multiplier, toArray(256, MAX_PRECISION2));
  }
  const negative = !!(buffer[0] & 128);
  return buildValue(product, column.scale, negative);
}

// src/data/ole.ts
function readOLE(buffer, _col, db) {
  const memoLength = buffer.readUIntLE(0, 3);
  const bitmask = buffer.readUInt8(3);
  if (bitmask & 128) {
    return buffer.slice(12, 12 + memoLength);
  } else if (bitmask & 64) {
    const pageRow = buffer.readUInt32LE(4);
    const rowBuffer = db.findPageRow(pageRow);
    return rowBuffer.slice(0, memoLength);
  } else if (bitmask === 0) {
    let pageRow = buffer.readInt32LE(4);
    let memoDataBuffer = Buffer.alloc(0);
    do {
      const rowBuffer = db.findPageRow(pageRow);
      if (memoDataBuffer.length + rowBuffer.length - 4 > memoLength) {
        break;
      }
      if (rowBuffer.length === 0) {
        break;
      }
      memoDataBuffer = Buffer.concat([memoDataBuffer, rowBuffer.slice(4, buffer.length)]);
      pageRow = rowBuffer.readUInt32LE(0);
    } while (pageRow !== 0);
    return memoDataBuffer.slice(0, memoLength);
  } else {
    throw new Error(`Unknown memo type ${bitmask}`);
  }
}

// src/data/repid.ts
function readRepID(buffer) {
  return buffer.slice(0, 4).swap32().toString("hex") + "-" + buffer.slice(4, 6).swap16().toString("hex") + "-" + buffer.slice(6, 8).swap16().toString("hex") + "-" + buffer.slice(8, 10).toString("hex") + "-" + buffer.slice(10, 16).toString("hex");
}

// src/data/text.ts
function readText(buffer, _col, db) {
  return uncompressText(buffer, db.format);
}

// src/data/index.ts
var readFnByColType = {
  ["bigint" /* BigInt */]: readBigInt,
  ["binary" /* Binary */]: readBinary,
  ["byte" /* Byte */]: readByte,
  ["complex" /* Complex */]: readComplexOrLong,
  ["currency" /* Currency */]: readCurrency,
  ["datetime" /* DateTime */]: readDateTime,
  ["datetimextended" /* DateTimeExtended */]: readDateTimeExtended,
  ["double" /* Double */]: readDouble,
  ["float" /* Float */]: readFloat,
  ["integer" /* Integer */]: readInteger,
  ["long" /* Long */]: readComplexOrLong,
  ["text" /* Text */]: readText,
  ["memo" /* Memo */]: readMemo,
  ["numeric" /* Numeric */]: readNumeric,
  ["ole" /* OLE */]: readOLE,
  ["repid" /* RepID */]: readRepID
};
function readFieldValue(buffer, column, db) {
  if (column.type === "boolean" /* Boolean */) {
    throw new Error("readFieldValue does not handle type boolean");
  }
  const read = readFnByColType[column.type];
  if (!read) {
    return `Column type ${column.type} is currently not supported`;
  }
  return read(buffer, column, db);
}

// src/usage-map.ts
function findMapPages(buffer, db) {
  switch (buffer[0]) {
    case 0:
      return findMapPages0(buffer);
    case 1:
      return findMapPages1(buffer, db);
    default:
      throw new Error("Unknown usage map type");
  }
}
function findMapPages0(buffer) {
  const pageStart = buffer.readUInt32LE(1);
  const bitmap = buffer.slice(5);
  return getPagesFromBitmap(bitmap, pageStart);
}
function findMapPages1(buffer, db) {
  const bitmapLength = (db.format.pageSize - 4) * 8;
  const mapCount = Math.floor((buffer.length - 1) / 4);
  const pages = [];
  for (let mapIndex = 0; mapIndex < mapCount; ++mapIndex) {
    const page = buffer.readUInt32LE(1 + mapIndex * 4);
    if (page === 0) {
      continue;
    }
    const pageBuffer = db.getPage(page);
    assertPageType(pageBuffer, PageType_default.PageUsageBitmaps);
    const bitmap = pageBuffer.slice(4);
    pages.push(...getPagesFromBitmap(bitmap, mapIndex * bitmapLength));
  }
  return pages;
}
function getPagesFromBitmap(bitmap, pageStart) {
  const pages = [];
  for (let i = 0; i < bitmap.length * 8; i++) {
    if (getBitmapValue(bitmap, i)) {
      pages.push(pageStart + i);
    }
  }
  return pages;
}

// src/Table.ts
var Table = class {
  constructor(name, db, firstDefinitionPage) {
    this.name = name;
    this.db = db;
    this.firstDefinitionPage = firstDefinitionPage;
    let nextDefinitionPage = this.firstDefinitionPage;
    let buffer;
    while (nextDefinitionPage > 0) {
      const curBuffer = this.db.getPage(nextDefinitionPage);
      assertPageType(curBuffer, PageType_default.TableDefinition);
      if (!buffer) {
        buffer = curBuffer;
      } else {
        buffer = Buffer.concat([buffer, curBuffer.slice(8)]);
      }
      nextDefinitionPage = curBuffer.readUInt32LE(4);
    }
    if (!buffer) {
      throw new Error("Could not find table definition page");
    }
    this.definitionBuffer = buffer;
    this.rowCount = this.definitionBuffer.readUInt32LE(this.db.format.tableDefinitionPage.rowCountOffset);
    this.columnCount = this.definitionBuffer.readUInt16LE(this.db.format.tableDefinitionPage.columnCountOffset);
    this.variableColumnCount = this.definitionBuffer.readUInt16LE(this.db.format.tableDefinitionPage.variableColumnCountOffset);
    this.fixedColumnCount = this.columnCount - this.variableColumnCount;
    this.logicalIndexCount = this.definitionBuffer.readInt32LE(this.db.format.tableDefinitionPage.logicalIndexCountOffset);
    this.realIndexCount = this.definitionBuffer.readInt32LE(this.db.format.tableDefinitionPage.realIndexCountOffset);
    const usageMapBuffer = this.db.findPageRow(this.definitionBuffer.readUInt32LE(this.db.format.tableDefinitionPage.usageMapOffset));
    this.dataPages = findMapPages(usageMapBuffer, this.db);
  }
  getColumn(name) {
    const column = this.getColumns().find((c) => c.name === name);
    if (column === void 0) {
      throw new Error(`Could not find column with name ${name}`);
    }
    return column;
  }
  getColumns() {
    const columnDefinitions = this.getColumnDefinitions();
    columnDefinitions.sort((a, b) => a.index - b.index);
    return columnDefinitions.map(({ index, variableIndex, fixedIndex, ...rest }) => rest);
  }
  getColumnDefinitions() {
    const columns = [];
    let curDefinitionPos = this.db.format.tableDefinitionPage.realIndexStartOffset + this.realIndexCount * this.db.format.tableDefinitionPage.realIndexEntrySize;
    let namesCursorPos = curDefinitionPos + this.columnCount * this.db.format.tableDefinitionPage.columnsDefinition.entrySize;
    for (let i = 0; i < this.columnCount; ++i) {
      const columnBuffer = this.definitionBuffer.slice(curDefinitionPos, curDefinitionPos + this.db.format.tableDefinitionPage.columnsDefinition.entrySize);
      const type = getColumnType(this.definitionBuffer.readUInt8(curDefinitionPos + this.db.format.tableDefinitionPage.columnsDefinition.typeOffset));
      const nameLength = this.definitionBuffer.readUIntLE(namesCursorPos, this.db.format.tableDefinitionPage.columnNames.nameLengthSize);
      namesCursorPos += this.db.format.tableDefinitionPage.columnNames.nameLengthSize;
      const name = uncompressText(this.definitionBuffer.slice(namesCursorPos, namesCursorPos + nameLength), this.db.format);
      namesCursorPos += nameLength;
      const column = {
        name,
        type,
        index: columnBuffer.readUInt8(this.db.format.tableDefinitionPage.columnsDefinition.indexOffset),
        variableIndex: columnBuffer.readUInt8(this.db.format.tableDefinitionPage.columnsDefinition.variableIndexOffset),
        size: type === "boolean" /* Boolean */ ? 0 : columnBuffer.readUInt16LE(this.db.format.tableDefinitionPage.columnsDefinition.sizeOffset),
        fixedIndex: columnBuffer.readUInt16LE(this.db.format.tableDefinitionPage.columnsDefinition.fixedIndexOffset),
        ...parseColumnFlags(columnBuffer.readUInt8(this.db.format.tableDefinitionPage.columnsDefinition.flagsOffset))
      };
      if (type === "numeric" /* Numeric */) {
        column.precision = columnBuffer.readUInt8(11);
        column.scale = columnBuffer.readUInt8(12);
      }
      columns.push(column);
      curDefinitionPos += this.db.format.tableDefinitionPage.columnsDefinition.entrySize;
    }
    return columns;
  }
  getColumnNames() {
    return this.getColumns().map((column) => column.name);
  }
  getData(options = {}) {
    const columnDefinitions = this.getColumnDefinitions();
    const data = [];
    const columns = columnDefinitions.filter((c) => options.columns === void 0 || options.columns.includes(c.name));
    let rowsToSkip = (options == null ? void 0 : options.rowOffset) ?? 0;
    let rowsToRead = (options == null ? void 0 : options.rowLimit) ?? Infinity;
    for (const dataPage of this.dataPages) {
      if (rowsToRead <= 0) {
        break;
      }
      const pageBuffer = this.getDataPage(dataPage);
      const recordOffsets = this.getRecordOffsets(pageBuffer);
      if (recordOffsets.length <= rowsToSkip) {
        rowsToSkip -= recordOffsets.length;
        continue;
      }
      const recordOffsetsToLoad = recordOffsets.slice(rowsToSkip, rowsToSkip + rowsToRead);
      const recordsOnPage = this.getDataFromPage(pageBuffer, recordOffsetsToLoad, columns);
      data.push(...recordsOnPage);
      rowsToRead -= recordsOnPage.length;
      rowsToSkip = 0;
    }
    return data;
  }
  getDataPage(page) {
    const pageBuffer = this.db.getPage(page);
    assertPageType(pageBuffer, PageType_default.DataPage);
    if (pageBuffer.readUInt32LE(4) !== this.firstDefinitionPage) {
      throw new Error(`Data page ${page} does not belong to table ${this.name}`);
    }
    return pageBuffer;
  }
  getRecordOffsets(pageBuffer) {
    const recordCount = pageBuffer.readUInt16LE(this.db.format.dataPage.recordCountOffset);
    const recordOffsets = [];
    for (let record = 0; record < recordCount; ++record) {
      const offsetMask = 8191;
      let recordStart = pageBuffer.readUInt16LE(this.db.format.dataPage.record.countOffset + 2 + record * 2);
      if (recordStart & 16384) {
        continue;
      }
      recordStart &= offsetMask;
      const nextStart = record === 0 ? this.db.format.pageSize : pageBuffer.readUInt16LE(this.db.format.dataPage.record.countOffset + record * 2) & offsetMask;
      const recordLength = nextStart - recordStart;
      const recordEnd = recordStart + recordLength - 1;
      recordOffsets.push([recordStart, recordEnd]);
    }
    return recordOffsets;
  }
  getDataFromPage(pageBuffer, recordOffsets, columns) {
    const lastColumnIndex = Math.max(...columns.map((c) => c.index), 0);
    const data = [];
    for (const [recordStart, recordEnd] of recordOffsets) {
      const rowColumnCount = pageBuffer.readUIntLE(recordStart, this.db.format.dataPage.record.columnCountSize);
      const bitmaskSize = roundToFullByte(rowColumnCount);
      let rowVariableColumnCount = 0;
      const variableColumnOffsets = [];
      if (this.variableColumnCount > 0) {
        switch (this.db.format.dataPage.record.variableColumnCountSize) {
          case 1: {
            rowVariableColumnCount = pageBuffer.readUInt8(recordEnd - bitmaskSize);
            const recordLength = recordEnd - recordStart + 1;
            let jumpCount = Math.floor((recordLength - 1) / 256);
            const columnPointer = recordEnd - bitmaskSize - jumpCount - 1;
            if ((columnPointer - recordStart - rowVariableColumnCount) / 256 < jumpCount) {
              --jumpCount;
            }
            let jumpsUsed = 0;
            for (let i = 0; i < rowVariableColumnCount + 1; ++i) {
              while (jumpsUsed < jumpCount && i === pageBuffer.readUInt8(recordEnd - bitmaskSize - jumpsUsed - 1)) {
                ++jumpsUsed;
              }
              variableColumnOffsets.push(pageBuffer.readUInt8(columnPointer - i) + jumpsUsed * 256);
            }
            break;
          }
          case 2: {
            rowVariableColumnCount = pageBuffer.readUInt16LE(recordEnd - bitmaskSize - 1);
            for (let i = 0; i < rowVariableColumnCount + 1; ++i) {
              variableColumnOffsets.push(pageBuffer.readUInt16LE(recordEnd - bitmaskSize - 3 - i * 2));
            }
            break;
          }
        }
      }
      const rowFixedColumnCount = rowColumnCount - rowVariableColumnCount;
      const nullMask = pageBuffer.slice(recordEnd - bitmaskSize + 1, recordEnd - bitmaskSize + 1 + roundToFullByte(lastColumnIndex + 1));
      let fixedColumnsFound = 0;
      const recordValues = {};
      for (const column of [...columns].sort((a, b) => a.index - b.index)) {
        let value = void 0;
        let start;
        let size;
        if (!getBitmapValue(nullMask, column.index)) {
          value = null;
        }
        if (column.fixedLength && fixedColumnsFound < rowFixedColumnCount) {
          const colStart = column.fixedIndex + this.db.format.dataPage.record.columnCountSize;
          start = recordStart + colStart;
          size = column.size;
          ++fixedColumnsFound;
        } else if (!column.fixedLength && column.variableIndex < rowVariableColumnCount) {
          const colStart = variableColumnOffsets[column.variableIndex];
          start = recordStart + colStart;
          size = variableColumnOffsets[column.variableIndex + 1] - colStart;
        } else {
          start = 0;
          value = null;
          size = 0;
        }
        if (column.type === "boolean" /* Boolean */) {
          value = value === void 0;
        } else if (value !== null) {
          value = readFieldValue(pageBuffer.slice(start, start + size), column, this.db);
        }
        recordValues[column.name] = value;
      }
      data.push(recordValues);
    }
    return data;
  }
};

// src/MDBReader.ts
var MSYS_OBJECTS_TABLE = "MSysObjects";
var MSYS_OBJECTS_PAGE = 2;
var MDBReader = class {
  constructor(buffer, { password } = {}) {
    this.buffer = buffer;
    assertPageType(this.buffer, PageType_default.DatabaseDefinitionPage);
    this.db = new Database(this.buffer, password ?? "");
    const mSysObjectsTable = new Table(MSYS_OBJECTS_TABLE, this.db, MSYS_OBJECTS_PAGE).getData({
      columns: ["Id", "Name", "Type", "Flags"]
    });
    this.sysObjects = mSysObjectsTable.map((mSysObject) => {
      const objectType = mSysObject.Type & 127;
      return {
        objectName: mSysObject.Name,
        objectType: isSysObjectType(objectType) ? objectType : null,
        tablePage: mSysObject.Id & 16777215,
        flags: mSysObject.Flags
      };
    });
  }
  getCreationDate() {
    return this.db.getCreationDate();
  }
  getPassword() {
    return this.db.getPassword();
  }
  getDefaultSortOrder() {
    return this.db.getDefaultSortOrder();
  }
  getTableNames({
    normalTables,
    systemTables,
    linkedTables
  } = { normalTables: true, systemTables: false, linkedTables: false }) {
    const filteredSysObjects = [];
    for (const sysObject of this.sysObjects) {
      if (sysObject.objectType === 1 /* Table */) {
        if (!isSystemObject(sysObject)) {
          if (normalTables) {
            filteredSysObjects.push(sysObject);
          }
        } else if (systemTables) {
          filteredSysObjects.push(sysObject);
        }
      } else if (sysObject.objectType === 6 /* LinkedTable */ && linkedTables) {
        filteredSysObjects.push(sysObject);
      }
    }
    return filteredSysObjects.map((o) => o.objectName);
  }
  getTable(name) {
    const sysObject = this.sysObjects.filter((o) => o.objectType === 1 /* Table */).find((o) => o.objectName === name);
    if (!sysObject) {
      throw new Error(`Could not find table with name ${name}`);
    }
    return new Table(name, this.db, sysObject.tablePage);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColumnType
});
