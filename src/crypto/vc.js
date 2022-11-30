import { ES256KSigner, createJWT, decodeJWT, verifyJWS } from "did-jwt";
import { base64ToBytes, hexToBytes } from "did-jwt";
import dbvc from '../db/vc.js';
import axios from "axios";
import Domain from "../router/domain.js";

import * as secp from '@noble/secp256k1';

import * as u8a from 'uint8arrays'
import { hash } from '@stablelib/sha256'

import elliptic from 'elliptic'

const secp256k1 = new elliptic.ec('secp256k1')

let queryDidDocUrl = Domain.domainUrl + "/api/did-document/read/";

export default {
    async createVcTemplateWithDid(issueName, issueDid, claims, tempId, privateKey) {
        let vcs = []
        for (let i = 0; i < claims.length; i++) {
            const element = claims[i];

            let claim = JSON.parse(element.claimsStr);
            let newVc = await dbvc.createVcModel(issueName, issueDid, element, tempId, privateKey);

            let noProofVcs = await dbvc.queryNoFilledVc(newVc.vcid);
            for (let j = 0; j < noProofVcs.length; j++) {
                const innerEle = noProofVcs[j];

                innerEle.holderDid = claim.holder;
                await this.createVcJwt(innerEle, privateKey)
            }
            vcs.push(newVc);
        }
        return vcs
    },

    async createVcTemplateWithEmail(issueName, issueDid, claims, tempId, privateKey) {
        let vcs = []
        for (let i = 0; i < claims.length; i++) {
            const element = claims[i];
            let newVc = await dbvc.createVcModel(issueName, issueDid, element, tempId, privateKey);
            vcs.push(newVc);
        }

        return vcs
    },

    async createVcJwt(specifyVc, privateKey) {
        const signer = ES256KSigner(hexToBytes(privateKey));

        let temp = JSON.parse(specifyVc.template)
        temp.id = specifyVc.holderDid;

        let issuerDid = specifyVc.issuerDid;

        // Assembly verify credential payload information
        let vcPayload = {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1"
            ],
            "id": specifyVc.credentialId,
            "type": [
                specifyVc.credentialType,
            ],
            "issueName": specifyVc.issuerName,
            "issuer": issuerDid,
            "issuanceDate": specifyVc.issueDate,
            "expirationDate": specifyVc.expireDate,
            "credentialSubject": temp,
        }

        console.log("vcPayload " + JSON.stringify(vcPayload))

        const vcJwt = await createJWT(
            { iss: issuerDid, iat: undefined, vc: vcPayload },
            { issuer: issuerDid, signer },
            { alg: 'ES256K' })

        await dbvc.updateVc(specifyVc.id, specifyVc.holderDid, vcJwt)

        return {
            vcid: specifyVc.credentialId,
            jwt: vcJwt,
        }
    },

    async verifyVcJwt(vcJwt) {
        const { payload, header, signature, data } = decodeJWT(vcJwt)

        console.log("payload " + payload)
        console.log("header " + header)
        console.log("signature " + signature)
        console.log("data " + data)

        // query did docment and find out publicKey
        let publicKey = await this.queryDidDocmentWith(payload.vc.issuer)

        console.log("publicKey " + publicKey)

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

    async verifyVcJwtCustom(vcJwt) {
        let jws = this.decodeJwtStr(vcJwt);

        if (!jws) {
            return {
                verify: false,
            }
        }

        const decodedJwt = Object.assign(jws, { payload: JSON.parse(this.decodeBase64url(jws.payload)) })

        let data = decodedJwt.data;
        let payload = decodedJwt.payload;
        // let header = decodedJwt.header;
        let signature = decodedJwt.signature;

        let publicKey = await this.queryDidDocmentWith(payload.vc.issuer)

        let dataByte = u8a.fromString(data)

        let msgHash = hash(dataByte);

        let rawSig = base64ToBytes(signature)

        const r = u8a.toString(rawSig.slice(0, 32), 'base16')
        const s = u8a.toString(rawSig.slice(32, 64), 'base16')
        const sigObj = { r, s }

        let rawPk = hexToBytes(publicKey)

        let isVerify = secp256k1.keyFromPublic(rawPk).verify(msgHash, sigObj);
        console.log(isVerify)

        if (isVerify) {
            return {
                verify: true,
                payload: payload,
            }
        } else {
            return {
                verify: false,
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
            return this.convertPubKey(res.data.data.verificationMethod[0].publicKeyHex)
        }
    },

    convertPubKey(pubKey) {
        let ret = pubKey

        // no 04, add 04
        if (pubKey.indexOf("0x") != -1 && pubKey.indexOf("0x04") == -1) {
            ret = "0x04" + pubKey.substring(2);
            return ret
        }

        // has 04, del 04
        if (pubKey.indexOf("0x") != -1 && pubKey.indexOf("0x04") != -1) {
            return "0x" + pubKey.substring(4);
        }

        return ret
    },

    decodeJwtStr(vcJwt) {
        const parts = vcJwt.match(/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)$/)
        if (parts) {
            return {
                header: JSON.parse(this.decodeBase64url(parts[1])),
                payload: parts[2],
                signature: parts[3],
                data: `${parts[1]}.${parts[2]}`,
            }
        } else {
            return undefined
        }
    },

    decodeBase64url(s) {
        return u8a.toString(base64ToBytes(s))
    }
}
