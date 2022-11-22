import { ES256KSigner, createJWT, decodeJWT, hexToBytes, verifyJWT } from "did-jwt";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";

export default {
    async createDidJwt(hdWallet, docunment) {
        const signer = ES256KSigner(hexToBytes(hdWallet.privateKey));

        let did = "did:dmaster:" + hdWallet.address;

        let jwt = await createJWT(
            { iss: did, iat: undefined, docunmnet: docunment},
            { issuer: did, signer },
            { alg: 'ES256K' , kid: did + "#key-1" }
        )

        console.log(jwt)

        return jwt
    },

    async verifyDidJwt(jwt, ) {
        let decoded = decodeJWT(jwt)
        console.log(decoded)

        // let resolver = new Resolver({ ...getResolver({ infuraProjectId: '3d8fb59e25ee4c36afd778a4cc3bd014' }) });

        // use the JWT from step 1
        let verificationResponse = await verifyJWT(jwt, {
            resolver,
            audience: 'did:ethr:'+hdWallet.address
        })
        
        console.log(verificationResponse)

        return true
    }
}