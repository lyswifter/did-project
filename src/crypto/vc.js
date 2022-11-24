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

        let verify = await this.verifyVcJwt(vcJwt)
        console.log("verify " + verify)
        if (verify == false) {
            return specifyVc.credentialId
        }

        // console.log('vcJwt ' + vcJwt)

        // update vc info in database
        await dbvc.updateVc(specifyVc.id, specifyVc.holderDid, vcJwt)

        return specifyVc.credentialId
    },

    async verifyVcJwt(vcJwt) {

        let decode = decodeJWT(vcJwt);
        console.log(decode)

        // const { payload, header, signature, data } = decodeJWT(vcJwt)
        // console.log(payload)
        // console.log(header)
        // console.log(signature)   

        let issuerDid = decode.payload.vc.issuer;
        console.log(issuerDid)

        // query did docment and find out publicKey
        let publicKey = await this.queryDidDocmentWith(issuerDid)
        console.log(publicKey)

        let ret = verifyJWS(vcJwt, { publicKeyHex: publicKey })

        console.log(JSON.stringify(ret))

        if (ret.publicKeyHex != undefined && ret.publicKeyHex === publicKey) {
            return true
        } else {
            return false
        }
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
