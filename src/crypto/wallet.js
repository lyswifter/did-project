import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from 'ethereum-cryptography/hdkey'
import { Wallet } from "@ethersproject/wallet";

import { ES256KSigner, createJWT, hexToBytes } from "did-jwt";

import user from "../db/user.js";

export default {
    async signWith(mnemonic) {
        // Reversible: Converts mnemonic string to raw entropy in form of byte array.
        const ent = bip39.mnemonicToEntropy(mnemonic, wordlist)
        // Reversible: Converts raw entropy in form of byte array to mnemonic string.
        bip39.entropyToMnemonic(ent, wordlist);
        // Validates mnemonic for being 12-24 words contained in `wordlist`.
        bip39.validateMnemonic(mnemonic, wordlist);
        // Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
        const seed = await bip39.mnemonicToSeed(mnemonic, this.password);

        let hdkey = HDKey.fromMasterSeed(seed).derive(this.path);

        let wallet = new Wallet(hdkey.privateKey);

        let userinfo = await user.queryWithPublicKey(wallet.publicKey);

        let didMessage = userinfo.did;

        const signer = ES256KSigner(hexToBytes(wallet.privateKey));

        let jwt = await createJWT(
            { iss: didMessage, iat: undefined},
            { issuer: didMessage, signer },
            { alg: 'ES256K', kid: didMessage + "#key-1" }
        )

        // let sha256Verify = hdkey.verify(sha256ret, sha256SignOut)

        return {
            sign: jwt,
            did:  didMessage,
        };
    },

    stringToUint8Array(str) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    },

    path: "m/44'/60'/0'/0/0",
    password: "123456",
}