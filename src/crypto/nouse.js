// import * as bip39 from '@scure/bip39';
// import { wordlist } from '@scure/bip39/wordlists/english';
// import { HDKey } from 'ethereum-cryptography/hdkey'
// import { Wallet } from "@ethersproject/wallet";
// import { hash } from '@stablelib/sha256'

// import * as secp from '@noble/secp256k1';
// import { encrypt, decrypt } from 'ethereum-cryptography/aes';

// export default {
//     path: "m/44'/60'/0'/0/0",
//     password: "123456",

//     iv: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
//     mode: 'aes-256-ctr',

//     async otherWallet() {
//         let mnemonic = "index budget snap motion spend pave wrap special candy unfold knee south";

//         // Reversible: Converts mnemonic string to raw entropy in form of byte array.
//         const ent = bip39.mnemonicToEntropy(mnemonic, wordlist)
//         // Reversible: Converts raw entropy in form of byte array to mnemonic string.
//         bip39.entropyToMnemonic(ent, wordlist);
//         // Validates mnemonic for being 12-24 words contained in `wordlist`.
//         bip39.validateMnemonic(mnemonic, wordlist);
//         // Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
//         const seed = await bip39.mnemonicToSeed(mnemonic, this.password);

//         let hdkey = HDKey.fromMasterSeed(seed).derive(this.path);

//         let wallet = new Wallet(hdkey.privateKey);

//         let publicKey = wallet.publicKey;
//         let privateKey = wallet.privateKey;

//         console.log("other publicKey " + publicKey)
//         console.log("other privateKey " + privateKey)

//         return wallet
//     },

//     async testHdKey() {
//         let otherWallet = this.otherWallet();

//         let mnemonic = "cabbage lunch security strategy park phrase fruit security pig cluster beef bind";

//         // Reversible: Converts mnemonic string to raw entropy in form of byte array.
//         const ent = bip39.mnemonicToEntropy(mnemonic, wordlist)
//         // Reversible: Converts raw entropy in form of byte array to mnemonic string.
//         bip39.entropyToMnemonic(ent, wordlist);
//         // Validates mnemonic for being 12-24 words contained in `wordlist`.
//         bip39.validateMnemonic(mnemonic, wordlist);
//         // Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
//         const seed = await bip39.mnemonicToSeed(mnemonic, this.password);

//         let hdkey = HDKey.fromMasterSeed(seed).derive(this.path);

//         let wallet = new Wallet(hdkey.privateKey);

//         let publicKey = wallet.publicKey;
//         let privateKey = wallet.privateKey;

//         console.log("publicKey " + publicKey)
//         console.log("privateKey " + privateKey)

//         let message = "bosheng";
//         let messageU8 = this.stringToUint8Array(message);
//         let messageRevert = this.Uint8ArrayToString(messageU8);

//         let hashRet = hash(messageU8);
//         let hashSignOut = hdkey.sign(hashRet);
//         let verify = hdkey.verify(hashRet, hashSignOut)

//         let sha256ret = await secp.utils.sha256(messageU8);
//         let sha256SignOut = hdkey.sign(sha256ret);
//         let sha256Verify = hdkey.verify(sha256ret, sha256SignOut)

//         console.log("message " + message)
//         console.log("messageU8 " + messageU8)
//         console.log("messageRevert " + messageRevert)

//         console.log("hashRet " + secp.utils.bytesToHex(hashRet))
//         console.log("hashSignOut " + secp.utils.bytesToHex(hashSignOut))
//         console.log("verify " + verify)

//         console.log("sha256ret " + secp.utils.bytesToHex(sha256ret))
//         console.log("sha256SignOut " + secp.utils.bytesToHex(sha256SignOut))
//         console.log("sha256Verify " + sha256Verify)

//         let shareKey = this.generateShareKey(wallet, (await otherWallet).publicKey);
//         let encrypt = await this.encrypt(message, shareKey);
//         let decrypt = await this.decrypt(encrypt, shareKey);

//         console.log("shareKey " + secp.utils.bytesToHex(shareKey))
//         console.log("encrypt " + encrypt)
//         console.log("decrypt " + decrypt)
//     },

//     generateShareKey(myWallet, theirPublicKey) {
//         let ssk = secp.getSharedSecret(myWallet.privateKey.substring(2), theirPublicKey.substring(2), false);
//         return ssk.slice(0, 32)
//     },

//     async encrypt(msg, key) {
//         const blob = new Blob([msg], {type: 'text/plain; charset=utf-8'});
//         let buf = await blob.arrayBuffer();
//         let uint8arr = new Uint8Array(buf);
//         let ret = await encrypt(uint8arr, key, this.iv, this.mode);
//         return ret;
//     },

//     async decrypt(msg, key) {
//         // decrypt(cypherText: Uint8Array, key: Uint8Array, iv: Uint8Array, mode?: string, pkcs7PaddingEnabled?: boolean): Promise<Uint8Array>;
//         let msgbuffer = new Uint8Array(msg);
//         let m = await decrypt(msgbuffer, key, this.iv, this.mode)
//         const blob = new Blob([m], {type: 'text/plain; charset=utf-8'});
//         let ret = await blob.text();
//         return ret
//     },

//     stringToUint8Array(str){
//         var arr = [];
//         for (var i = 0, j = str.length; i < j; ++i) {
//           arr.push(str.charCodeAt(i));
//         }
       
//         var tmpUint8Array = new Uint8Array(arr);
//         return tmpUint8Array
//     },

//     Uint8ArrayToString(data) {
//         var dataString = ""
//         for (let i = 0; i < data.length; i++) {
//             dataString += String.fromCharCode(data[i]);
//         }
//         return dataString
//     }
// }