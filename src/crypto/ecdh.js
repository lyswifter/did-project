import * as secp from '@noble/secp256k1';
import { encrypt, decrypt } from 'ethereum-cryptography/aes';

export default {
    iv: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    mode: 'aes-256-ctr',
    // GenerateShareKey
    generateShareKey(myWallet, theirPublicKey) {
        let ssk = secp.getSharedSecret(myWallet.privateKey.substring(2), theirPublicKey, false);
        return ssk.slice(0, 32)
    },

    // Encrypto
    async encrypt(msg, key) {
        // encrypt(msg: Uint8Array, key: Uint8Array, iv: Uint8Array, mode?: string, pkcs7PaddingEnabled?: boolean): Promise<Uint8Array>;
        // this.string2ArrayBuffer(msg, function (buf) {
        //     var uInt8 = new Uint8Array(buf);
        //     console.log('uInt8 ' + uInt8);
        // })

        const blob = new Blob([msg], {type: 'text/plain; charset=utf-8'});
        let buf = await blob.arrayBuffer();
        let uint8arr = new Uint8Array(buf);

        let ret = await encrypt(uint8arr, key, this.iv, this.mode);
        return ret;
    },

    // Decrypto
    async decrypt(msg, key) {
        // decrypt(cypherText: Uint8Array, key: Uint8Array, iv: Uint8Array, mode?: string, pkcs7PaddingEnabled?: boolean): Promise<Uint8Array>;
        let msgbuffer = new Uint8Array(msg);
        let iv = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        let mode = 'aes-256-ctr';
        let m = await decrypt(msgbuffer, key, this.iv, this.mode)
        const blob = new Blob([m], {type: 'text/plain; charset=utf-8'});
        let ret = await blob.text();
        return ret
    },
}