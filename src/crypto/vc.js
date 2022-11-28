import { ES256KSigner, hexToBytes, createJWT, verifyJWT, decodeJWT, verifyJWS } from "did-jwt";
import dbvc from '../db/vc.js';
import axios from "axios";
import Domain from "../router/domain.js";

let queryDidDocUrl = Domain.domainUrl + "/api/did-document/read/";

export default {
    async createVcTemplate(issueName, issueDid, claims, tempId, privateKey) {
        let vcs = []
        for (let i = 0; i < claims.length; i++) {
            const element = claims[i];

            let claim = JSON.parse(element.claimsStr);
            let newVc = await dbvc.createVcModel(issueName, issueDid, element, tempId, privateKey);

            if (claim.holder.indexOf("did:dmaster") != -1) {
                let noProofVcs = await dbvc.queryNoFilledVc(newVc.vcid);

                for (let j = 0; j < noProofVcs.length; j++) {
                    const innerEle = noProofVcs[j];

                    innerEle.holderDid = claim.holder;
                    await this.createVcJwt(innerEle, privateKey)
                }
            }
            
            vcs.push(newVc);
        }

        return vcs
    },

    async createVcJwt(specifyVc, privateKey) {
        const signer = ES256KSigner(hexToBytes(privateKey));

        // Assembly verify credential payload information
        const vcPayload = {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1"
            ],
            "id": specifyVc.credentialId,
            "type": [
                specifyVc.credentialType,
            ],
            "issueName": specifyVc.issueName,
            "issuer": specifyVc.issuerDid,
            "issuanceDate": specifyVc.issueDate,
            "expirationDate": specifyVc.expireDate,
            "credentialSubject": {
                "id": specifyVc.holderDid,
                "holderName": specifyVc.holderName,
                "credentialTitle": specifyVc.credentialTitle,
                "email": specifyVc.holderEmail,
                "customName": specifyVc.customName,
                "customContent": specifyVc.customContent,
            }
        }

        const vcJwt = await createJWT(
            { iss: specifyVc.issuerDid, iat: undefined, vc: vcPayload },
            { issuer: specifyVc.issuerDid, signer },
            { alg: 'ES256K' })

        await dbvc.updateVc(specifyVc.id, specifyVc.holderDid, vcJwt)

        return {
            vcid: specifyVc.credentialId,
            jwt: vcJwt,
        }
    },

    async verifyVcJwt(vcJwt) {
        const { payload, header, signature, data } = decodeJWT(vcJwt)

        // query did docment and find out publicKey
        let publicKey = await this.queryDidDocmentWith(payload.vc.issuer)

        let ret = verifyJWS(vcJwt, { publicKeyHex: publicKey })

        if (ret.publicKeyHex != undefined && ret.publicKeyHex === publicKey) {
            return {
                verify: true,
                payload: payload
            }
        } else {
            return {
                verify: false,
                reason: ""
            }
        }
    },

    async decodeJwt(vcJwt) {
        const { payload, header, signature, data } = decodeJWT(vcJwt)
        return payload
    },

    async queryDidDocmentWith(did) {
        const res = await axios.get(queryDidDocUrl + did, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });

        if (res.data.code == 0) {
            return res.data.data.verificationMethod[0].publicKeyBase58
        }
    }
}
