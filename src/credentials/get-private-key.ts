import { getKey } from './get-key';

export const getPrivateKey = async (
  salt: ArrayBufferLike,
  rawId: BufferSource,
  transports: string[]
): Promise<CryptoKey> => {
  const key = await getKey(salt, rawId, transports);
  const label = 'encryption key';
  const info = new TextEncoder().encode(label);
  const salt1 = new Uint8Array();

  return await crypto.subtle.deriveKey(
    { name: 'HKDF', info, salt: salt1, hash: 'SHA-256' },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
};
