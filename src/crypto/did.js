import { ES256KSigner, createJWT, decodeJWT, hexToBytes, verifyJWT } from "did-jwt";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";

export default {
    async createDidJwt(hdWallet) {
        const signer = ES256KSigner(hexToBytes(hdWallet.privateKey));

        let jwt = await createJWT(
            { aud: 'did:ethr:'+hdWallet.address, iat: undefined, name: 'uPort Developer' },
            { issuer: 'did:ethr:'+hdWallet.address, signer },
            { alg: 'ES256K' }
        )

        let decoded = decodeJWT(jwt)
        console.log(decoded)

        let resolver = new Resolver({ ...getResolver({ infuraProjectId: '3d8fb59e25ee4c36afd778a4cc3bd014' }) });

        // use the JWT from step 1
        let verificationResponse = await verifyJWT(jwt, {
            resolver,
            audience: 'did:ethr:'+hdWallet.address
        })
        
        console.log(verificationResponse)
    }
}