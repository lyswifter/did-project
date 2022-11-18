import { createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc';
import { ES256KSigner, hexToBytes } from "did-jwt";
import { createVerifiablePresentationJwt, verifyPresentation } from 'did-jwt-vc'

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import vc from '../db/vc.js';

export default {
    async createVcTemplate(wallet, claims, tempId) {
        console.log('claimStr ' + claims)
        console.log('tempId ' + tempId)

        let didPrefix = "did:";
        let didMethod = "dmaster";
        let didAddr = wallet.address;
        let issuerDid = didPrefix + didMethod + ":" + didAddr;

        let vcids = []
        claims.forEach(element => {
            // generate vc object and insert to vc table
            let vcid = vc.createVcModel(issuerDid, element, tempId)
            vcids.push(vcid)
        });

        console.log('vcids ' + vcids);

        return vcids
    },

    async createVcJwt(vcid) {
        // query special vc template info
        // generate vc jwt
        // query my privatekey
        // query vc-issuer-id
        // query issuer public keys
        // update vc info

        const signer = ES256KSigner(hexToBytes(wallet.privateKey));

        let issuer = {
            did: issuerDid,
            signer: signer,
            alg: "ES256K",
        };

        // Assembly verify credential payload information
        const vcPayload = {
            sub: 'did:ethr:' + wallet.address,
            nbf: 1562950282,
            vc: {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential'],
                credentialSubject: {
                    degree: {
                        type: 'BachelorDegree',
                        name: 'Baccalauréat en musiques numériques'
                    }
                }
            }
        }

        const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer)
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
