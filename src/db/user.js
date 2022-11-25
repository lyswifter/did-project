import db from "./db"

export default {
    createUser(userinfo) {
        db.user.add(userinfo);
    },

    updateUser(did, field, info) {
        db.user.update(did, {[field]: info});
    },

    async queryWithEmail(email) {
        let info = await db.user.where('email').equals(email).toArray();
        return info
    },

    async queryUser(did) {
        let info = await db.user.where('did').equals(did).toArray();
        return info
    },

    async queryWithPublicKey(key) {
        let info = await db.user.where('publicKey').equals(key).toArray();
        return info
    }
}