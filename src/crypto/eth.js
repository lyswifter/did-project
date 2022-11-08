import { ethers } from "ethers";
import { HDNode, mnemonicToSeed } from "@ethersproject/hdnode";
import { Wallet, verifyMessage } from "@ethersproject/wallet";
import { SignatureLike } from "@ethersproject/bytes";

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

        let wallet = new Wallet(hdnode.derivePath(path).privateKey);
        console.log(wallet);

        let smsg = await wallet.signMessage("下面是使用bip39生成生成助记词的一段代码");

        let signture = {
            r: "r",
            s: "s",
            _vs: "vs",
            recoveryParam: 1,
            v: 2
        }

        let verifyRet = verifyMessage("下面是使用bip39生成生成助记词的一段代码", signture)

        console.log(smsg, verifyRet)
    },

    signMessage() {

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