import db from "./db"

export default {
    createUser(userinfo) {
        db.user.add(userinfo);
    },

    updateUser(did, field, info) {
        db.user.update(did, {[field]: info});
    },

    async addUserCredentialCount(did) {
        let info = await this.queryUser(did);
        info.credentialcount += 1;
        await db.user.put(info)
    },

    async queryUser(did) {
        let info = await db.user.where('did').equals(did).toArray();
        return info[0]
    }
}