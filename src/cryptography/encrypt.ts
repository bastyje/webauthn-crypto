import { getPublicKey } from '../credentials/get-public-key';

export interface EncryptParams {
  salt: ArrayBufferLike;
  data: string;
  nonce: Uint8Array;
  rawId: BufferSource;
  transports: string[];
}

export const encrypt = async (params: EncryptParams): Promise<string> => {
  const publicKey = await getPublicKey(
    params.salt,
    params.rawId,
    params.transports
  );
  return btoa(
    String.fromCharCode(
      ...new Uint8Array(
        await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: params.nonce },
          publicKey,
          new TextEncoder().encode(params.data)
        )
      )
    )
  );
};
