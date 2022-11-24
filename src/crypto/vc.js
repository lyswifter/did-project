import { ES256KSigner, hexToBytes, createJWT, verifyJWT, decodeJWT, verifyJWS } from "did-jwt";
import { createVerifiablePresentationJwt, verifyPresentation } from 'did-jwt-vc'

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import dbvc from '../db/vc.js';

import axios from "axios";
import Domain from "../router/domain.js";

let queryDidDocUrl = Domain.domainUrl + "/api/did-document/read/";

export default {
    async createVcTemplate(issueDid, claims, tempId) {
        let bindingObj = {
            list: []
        };

        claims.forEach(element => {
            // generate vc object and insert to vc table
            let newVc = dbvc.createVcModel(issueDid, element, tempId)

            bindingObj.list.push({
                credentialId: newVc.vcid,
                holderEmail: newVc.holderEmail,
                templateId: tempId,
            })
        });

        return bindingObj
    },

    async createVcJwt(specifyVc, privateKey) {
        console.log("specifyVc " + JSON.stringify(specifyVc))

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
            "issuer": specifyVc.issuerDid,
            "issuanceDate": specifyVc.issueDate,
            "expirationDate": specifyVc.expireDate,
            "credentialSubject": {
                "id": specifyVc.holderDid,
                "holderName": specifyVc.holderName,
                "credentialTitle": specifyVc.credentialTitle,
            }
        }

        const vcJwt = await createJWT( 
            { iss: specifyVc.issuerDid, iat: undefined, vc: vcPayload},
            { issuer: specifyVc.issuerDid, signer },
            { alg: 'ES256K' })

        // console.log('vcJwt ' + vcJwt)

        // update vc info in database
        await dbvc.updateVc(specifyVc.id, specifyVc.holderDid, vcJwt)

        return specifyVc.credentialId
    },

    async createVpJwt(vcJwt) {
        const vpPayload = {
            vp: {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiablePresentation'],
                verifiableCredential: [vcJwt]
            }
        }

        const vpJwt = await createVerifiablePresentationJwt(vpPayload, issuer)
        console.log('vpJwt')
        console.log(vpJwt)
    },

    async verifyVcJwt(vcJwt) {

        let decode = decodeJWT(vcJwt);
        console.log(decode)

        // const { payload, header, signature, data } = decodeJWT(vcJwt)
        // console.log(payload)
        // console.log(header)
        // console.log(signature)

        let holderDid = decode.payload.vc.credentialSubject.id;
        console.log(holderDid)

        // query did docment and find out publicKey
        let publicKey = await this.queryDidDocmentWith(holderDid)
        console.log(publicKey)

        verifyJWS(vcJwt, { publicKeyHex: publicKey}).then(
            ok => {
                console.log(ok)
            },
            err => {
                console.log(err)
            }
        )

        return ret
    },

    async verifyVp(vpJwt) {
        const providerConfig = {
            rpcUrl: 'https://mainnet.infura.io/v3/3d8fb59e25ee4c36afd778a4cc3bd014',
            registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
        }
        const resolver = new Resolver(getResolver(providerConfig))

        const verifiedVP = await verifyPresentation(vpJwt, resolver)
        console.log(verifiedVP)
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
