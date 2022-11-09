import { ethers } from "ethers";
import { HDNode, mnemonicToSeed } from "@ethersproject/hdnode";
import { Wallet } from "@ethersproject/wallet";

import { ES256Signer, ES256KSigner, createJWT, decodeJWT, hexToBytes, verifyJWT } from "did-jwt";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";

export default {

    providerEndpoint: "https://mainnet.infura.io/v3/3d8fb59e25ee4c36afd778a4cc3bd014",

    toHexString(byteArray) {
        var s = '0x';
        byteArray.forEach(function(byte) {
          s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
        });
        return s;
    },

    async queryBlockchain(urlStr) {
        // const provider = new ethers.providers.Web3Provider(providerEndpoint);
        const provider = new ethers.providers.JsonRpcProvider(urlStr);

        let height = await provider.getBlockNumber();

        console.log(height);   
    },

    async genWalletFromMnemonic() {
        let path = "m/44'/60'/0'/0/0";
        let password = "123456";
        let mnemonic = "coral dignity clutch idle shell wedding meat ethics doctor salute quantum poet";

        let seed = mnemonicToSeed(mnemonic, password);
        console.log(seed);

        let hdnode = HDNode._fromSeed(seed, {
            phrase: mnemonic,
            path: path,
            locale: 'en'
        });
        console.log(hdnode)

        // let wallet = new Wallet(hdnode.derivePath(path).privateKey);
        // console.log(wallet);
        // console.log(wallet.privateKey.substring(2));

        this.signMessage(hdnode.privateKey.substring(2))
    },

    async signMessage(privKey) {
        //278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f
        const signer = ES256KSigner(hexToBytes(privKey))

        let jwt = await createJWT(
            { aud: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', iat: undefined, name: 'uPort Developer' },
            { issuer: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', signer },
            { alg: 'ES256K' }
        )
        console.log(jwt)

        let decoded = decodeJWT(jwt)
        console.log(decoded)

        let resolver = new Resolver({...getResolver({infuraProjectId: '3d8fb59e25ee4c36afd778a4cc3bd014'})});

        // use the JWT from step 1
        let verificationResponse = await verifyJWT(jwt, {
            resolver,
            audience: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74'
        })
        console.log(verificationResponse)
    },

    genDid() {

    },
    assemblyDidDocument() {

    },
    genVc() {

    },
    genVcPresentation() {

    }
};