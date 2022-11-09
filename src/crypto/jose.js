import * as jose from 'jose';

export default {
    async genKeyPair() {
        const { publicKey, privateKey } = await jose.generateKeyPair('ES256K')
        console.log(publicKey)
        console.log(privateKey)
    }
}