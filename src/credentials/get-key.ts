export const getKey = async (
  salt: ArrayBufferLike,
  rawId: BufferSource,
  transports: string[]
): Promise<CryptoKey> => {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: new Uint8Array([9, 0, 1, 2]),
      allowCredentials: [
        {
          id: rawId,
          // @ts-ignore
          transports: transports,
          type: 'public-key'
        }
      ],
      userVerification: 'required',
      extensions: {
        // @ts-ignore
        prf: { eval: { first: salt } }
      }
    }
  });

  return await crypto.subtle.importKey(
    'raw',
    // @ts-ignore
    new Uint8Array(credential.getClientExtensionResults().prf.results.first),
    'HKDF',
    false,
    ['deriveKey']
  );
};
