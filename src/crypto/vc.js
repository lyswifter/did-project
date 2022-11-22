import { createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc';
import { ES256KSigner, hexToBytes, createJWT, verifyJWT } from "did-jwt";
import { createVerifiablePresentationJwt, verifyPresentation } from 'did-jwt-vc'

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import dbvc from '../db/vc.js';

export default {
    async createVcTemplate(issueDid, claims, tempId) {
        let vcids = []
        claims.forEach(element => {
            // generate vc object and insert to vc table
            let vcid = dbvc.createVcModel(issueDid, element, tempId)
            vcids.push(vcid)
        });
        
        return vcids
    },

    async createVcJwt(vcid) {
        // query special vc template info
        // generate vc jwt
        // query my privatekey
        // query vc-issuer-id
        // query issuer public keys
        // update vc info

        let specifyVc = await dbvc.queryVc(vcid)

        const signer = ES256KSigner(hexToBytes(wallet.privateKey));

        let issuer = {
            did: specifyVc.issuerDid,
            signer: signer,
        };

        // Assembly verify credential payload information
        const vcJwtPayload = {
        }

        const vcJwt = await createJWT(vcJwtPayload, issuer, { alg: 'ES256K' })
        console.log('vcJwt ' + vcJwt)

        // update vc info

        return vcid
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
