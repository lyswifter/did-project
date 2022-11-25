import * as secp from '@noble/secp256k1';
import { encrypt, decrypt } from 'ethereum-cryptography/aes';

export default {
    iv: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    mode: 'aes-256-ctr',
    // GenerateShareKey
    generateShareKey(myPrivateKey, theirPublicKey) {
        const myInput = myPrivateKey.startsWith('0x') ? myPrivateKey.substring(2) : myPrivateKey
        const theirInput = theirPublicKey.startsWith('0x') ? theirPublicKey.substring(2) : theirPublicKey
        let ssk = secp.getSharedSecret(myInput, theirInput, false);
        return ssk.slice(1, 33)
    },

    // Encrypto
    async encrypt(msg, key) {
        let uint8arr = this.stringToUint8Array(msg);
        let ret = await encrypt(uint8arr, key, this.iv, this.mode);
        return secp.utils.bytesToHex(ret);
    },

    // Decrypto
    async decryptFromString(hexString, key) {
        // decrypt(cypherText: Uint8Array, key: Uint8Array, iv: Uint8Array, mode?: string, pkcs7PaddingEnabled?: boolean): Promise<Uint8Array>;
        let uint8arr = secp.utils.hexToBytes(hexString);
        let ret = await decrypt(uint8arr, key, this.iv, this.mode)
        return this.Uint8ArrayToString(ret);
    },

    // Decrypto
    async decrypt(msg, key) {
        // decrypt(cypherText: Uint8Array, key: Uint8Array, iv: Uint8Array, mode?: string, pkcs7PaddingEnabled?: boolean): Promise<Uint8Array>;
        let msgbuffer = new Uint8Array(msg);
        let m = await decrypt(msgbuffer, key, this.iv, this.mode)
        return this.Uint8ArrayToString(ret);
    },

    stringToUint8Array(str){
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
          arr.push(str.charCodeAt(i));
        }
       
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    },

    Uint8ArrayToString(data) {
        var dataString = ""
        for (let i = 0; i < data.length; i++) {
            dataString += String.fromCharCode(data[i]);
        }
        return dataString
    }
}