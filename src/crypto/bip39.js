import { generateMnemonic } from "bip39";

export default {
    genWalletWithBip39() {
        const mnemonic = generateMnemonic();

        console.log(mnemonic);
    }
}