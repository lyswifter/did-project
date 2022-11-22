import * as bip39 from '@scure/bip39';

import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from 'ethereum-cryptography/hdkey'
import { Wallet } from "@ethersproject/wallet";

export default {
    async genWalletWithMnemonic(mnemonic) {
        let path = "m/44'/60'/0'/0/0";
        let password = "123456";
        // Reversible: Converts mnemonic string to raw entropy in form of byte array.
        const ent = bip39.mnemonicToEntropy(mnemonic, wordlist)
        // Reversible: Converts raw entropy in form of byte array to mnemonic string.
        bip39.entropyToMnemonic(ent, wordlist);
        // Validates mnemonic for being 12-24 words contained in `wordlist`.
        bip39.validateMnemonic(mnemonic, wordlist);
        // Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
        const seed = await bip39.mnemonicToSeed(mnemonic, password);

        let hdkey = HDKey.fromMasterSeed(seed).derive(path);

        return new Wallet(hdkey.privateKey)
    },

    async genBip39Mnemonic() {
        // let mnemonic = "coral dignity clutch idle shell wedding meat ethics doctor salute quantum poet";
        // let mnemonic = "cabbage lunch security strategy park phrase fruit security pig cluster beef bind";

        // Generate x random words. Uses Cryptographically-Secure Random Number Generator.
        const mnemonic = bip39.generateMnemonic(wordlist);
        console.log(mnemonic);

        return mnemonic;
    }
}