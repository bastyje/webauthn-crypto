export interface RegisterParams {
  salt: ArrayBufferLike;
  user: PublicKeyCredentialUserEntity;
  rp?: PublicKeyCredentialRpEntity;
}

/**
 * Register a new credential
 * @param params
 */
export const register = async (
  params: RegisterParams
): Promise<{ rawId: BufferSource; transports: string[] }> => {
  const credentialCreationOptions: CredentialCreationOptions = {
    publicKey: {
      challenge: new Uint8Array(32).map(() => Math.floor(Math.random() * 256)),
      rp: params.rp ?? { name: 'localhost' },
      user: params.user,
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      authenticatorSelection: {
        userVerification: 'required'
      },
      extensions: {
        // @ts-ignore
        prf: { eval: { first: params.salt } }
      }
    }
  };

  const credential = await navigator.credentials.create(
    credentialCreationOptions
  );

  return {
    // @ts-ignore
    rawId: credential.rawId,
    // @ts-ignore
    transports: credential?.response.getTransports()
  };
};
