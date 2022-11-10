import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { hexlify } from 'ethers/lib/utils';
import { HDKey } from 'ethereum-cryptography/hdkey'
import { Wallet } from "@ethersproject/wallet";

export default {
    async genWalletWithBip39() {
        let path = "m/44'/60'/0'/0/0";
        let password = "123456";
        let mnemonic = "coral dignity clutch idle shell wedding meat ethics doctor salute quantum poet";

        // Generate x random words. Uses Cryptographically-Secure Random Number Generator.
        // const mn = bip39.generateMnemonic(wordlist);
        // console.log(mn);

        // Reversible: Converts mnemonic string to raw entropy in form of byte array.
        const ent = bip39.mnemonicToEntropy(mnemonic, wordlist)

        // Reversible: Converts raw entropy in form of byte array to mnemonic string.
        bip39.entropyToMnemonic(ent, wordlist);

        // Validates mnemonic for being 12-24 words contained in `wordlist`.
        bip39.validateMnemonic(mnemonic, wordlist);

        // Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
        const seed0 = await bip39.mnemonicToSeed(mnemonic, password);
        console.log(hexlify(seed0));

        let hdkey = HDKey.fromMasterSeed(seed0).derive(path);

        let wallet = new Wallet(hdkey.privateKey);
        console.log(wallet);
        console.log(wallet.privateKey.substring(2));
        //0xd4C7ad4a341477780ca66D30a50f30CCF52f497e

        return wallet;
    }
}