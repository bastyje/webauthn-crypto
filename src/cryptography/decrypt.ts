import { getPrivateKey } from '../credentials/get-private-key';

export interface DecryptParams {
  salt: ArrayBufferLike;
  data: string;
  nonce: Uint8Array;
  rawId: BufferSource;
  transports: string[];
}

export const decrypt = async (params: DecryptParams): Promise<string> => {
  const privateKey = await getPrivateKey(
    params.salt,
    params.rawId,
    params.transports
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: params.nonce },
    privateKey,
    Uint8Array.from(atob(params.data), c => c.charCodeAt(0))
  );
  return new TextDecoder().decode(decrypted);
};
