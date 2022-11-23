import db from "./db"
import user from "./user.js"
import { v4 as uuidv4 } from 'uuid';

export default {
    createVcModel(idid, needClaim, tempId) {
        let vcid = uuidv4();
        let claim = JSON.parse(needClaim.claimsStr);

        let type = ""
        if (tempId == 1) {
            type = "Membership Card"
        } else if (tempId == 2) {
            type = "Activity Certificate"
        }

        let vcObj = {
            credentialId: vcid,
            templateId: tempId,
            credentialType: type,
            issuerDid: idid,
            holderEmail: claim.holder,
            holderName: claim.holder_name,
            holderDid: "",
            credentialTitle: claim.credential_title,
            expireFlag: needClaim.expireFlag,
            issueDate: needClaim.issueDate,
            expireDate: needClaim.expireDate,
            filled: 0,
            jwt: "",
            backuped: 0,
        }

        db.vc.add(vcObj);

        return {
            vcid: vcid,
            holderEmail: claim.holder,
        }
    },

    queryVcs() {
        return db.vc.toArray();
    },

    queryVcsWith(limit) {
        if (limit == null) {
            limit = 20
        }
        return db.vc.where("filled").equals(0).offset(0).limit(limit).toArray();
    },

    queryFilledVcsWith(limit) {
        if (limit == null) {
            limit = 20
        }
        return db.vc.where({ filled: 1, backuped: 0 }).offset(0).limit(limit).toArray();
    },

    async queryNoFilledVc(vcid) {
        let vcs = await db.vc.where( { 'credentialId': vcid, 'filled': 0 }).toArray();
        return vcs
    },

    async queryNoBackupedVc(vcid) {
        let vcs = await db.vc.where( { 'credentialId': vcid, 'backuped': 0 }).toArray();
        return vcs
    },

    async updateVc(id, hdid, newJwt) {
        await db.vc.update(id, { filled: 1, holderDid: hdid, jwt: newJwt })
        // console.log("update ret " + ret)
    },

    async updateVcBackup(id, backup) {
        await db.vc.update(id, { backuped: backup })
        // console.log("update ret " + ret)
    }
}