import { ES256KSigner, createJWT, decodeJWT, hexToBytes, verifyJWT } from "did-jwt";
import util from "../crypto/util.js";

export default {
    async createDidJwt(hdWallet, document) {
        const signer = ES256KSigner(hexToBytes(hdWallet.privateKey));

        let did = util.getDIdAddr(hdWallet.address);

        let jwt = await createJWT(
            { iss: did, iat: undefined, document: document},
            { issuer: did, signer },
            { alg: 'ES256K' , kid: did + "#key-1" }
        )

        console.log(jwt)

        return jwt
    },

    async verifyDidJwt(jwt) {
        let decoded = decodeJWT(jwt)

        // use the JWT from step 1
        let verificationResponse = await verifyJWT(jwt, {
            resolver,
            audience: 'did:ethr:'+hdWallet.address // no use
        })
        
        console.log(verificationResponse)

        return true
    }
}