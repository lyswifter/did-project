import { createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc';
import { ES256KSigner, hexToBytes } from "did-jwt";
import { createVerifiablePresentationJwt } from 'did-jwt-vc'

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

export default {
    async createVcJwt(hdWallet) {
        const signer = ES256KSigner(hexToBytes(hdWallet.privateKey));

        let issuer = {
            did: hdWallet.address,
            signer: signer,
            alg: "ES256K",
        };

        const vcPayload = {
            sub: 'did:ethr:'+hdWallet.address,
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
        console.log('vcJwt')
        console.log(vcJwt)

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

        const providerConfig = {
            rpcUrl: 'https://mainnet.infura.io/v3/3d8fb59e25ee4c36afd778a4cc3bd014',
            registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
        }
        const resolver = new Resolver(getResolver(providerConfig))

        const verifiedVC = await verifyCredential(vcJwt, resolver)
        console.log('verifiedVC')
        console.log(verifiedVC)
    }
}
