import { createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc';
import { ES256KSigner, hexToBytes, createJWT, verifyJWT } from "did-jwt";
import { createVerifiablePresentationJwt, verifyPresentation } from 'did-jwt-vc'

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import dbvc from '../db/vc.js';

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

    async verifyVc(vcJwt) {
        const providerConfig = {
            rpcUrl: 'https://mainnet.infura.io/v3/3d8fb59e25ee4c36afd778a4cc3bd014',
            registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
        }
        const resolver = new Resolver(getResolver(providerConfig))
        const verifiedVC = await verifyCredential(vcJwt, resolver)
        console.log('verifiedVC')
        console.log(verifiedVC)
    },

    async verifyVp(vpJwt) {
        const providerConfig = {
            rpcUrl: 'https://mainnet.infura.io/v3/3d8fb59e25ee4c36afd778a4cc3bd014',
            registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
        }
        const resolver = new Resolver(getResolver(providerConfig))

        const verifiedVP = await verifyPresentation(vpJwt, resolver)
        console.log(verifiedVP)
    }
}
