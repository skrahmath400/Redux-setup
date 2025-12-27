import CryptoJS from "crypto-js";

const PRE_SHARED_KEY_B64 = "R42FYg7zESO28+PZ7mIZte8H5ZiN6Fw5uQHWgcPqHko=";
const NUM_CHARS = 1;

function asciiToBytes(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
  return out;
}

function concatBytes(...parts) {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function bytesToBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function aesEncryptToBase64(plaintext) {
  const key = CryptoJS.enc.Base64.parse(PRE_SHARED_KEY_B64);
  const pt = CryptoJS.enc.Utf8.parse(plaintext);
  const encrypted = CryptoJS.AES.encrypt(pt, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export function encryptPassword(plaintext) {
  const base64 = aesEncryptToBase64(plaintext);

  const padCount = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const maxCut = base64.length - padCount - NUM_CHARS;

  if (maxCut < 0) {
    throw new Error("Password too short for encryption");
  }

  let cutIndex = Math.min(16, maxCut);

  const removed = base64.slice(cutIndex, cutIndex + NUM_CHARS);
  const modified = base64.slice(0, cutIndex) + base64.slice(cutIndex + NUM_CHARS);

  const cutIndexByte = new Uint8Array([cutIndex & 0xff]);
  const payloadBytes = concatBytes(cutIndexByte, asciiToBytes(modified), asciiToBytes(removed));

  return bytesToBase64(payloadBytes);
}