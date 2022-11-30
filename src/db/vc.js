import db from "./db"
import { v4 as uuidv4 } from 'uuid';

export default {
    async createVcModel(iname, idid, needClaim, tempId) {
        let vcid = uuidv4();

        let claim = JSON.parse(needClaim.claimsStr);

        let type = ""
        if (tempId == 1) {
            type = "Membership Card"
        } else if (tempId == 2) {
            type = "Activity Certificate"
        }

        let customName = claim.claimName
        let customContent = ""
        let keys = Object.keys(claim);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key=="credential_title" || key=="holder_name" || key=="holder" || key==customName) {
                continue 
            }
            customContent = claim[key]
        }

        let vcObj = {
            credentialId: vcid,
            templateId: tempId,
            credentialType: type,
            issuerName: iname,
            issuerDid: idid,
            holderEmail: "",
            holderName: claim.holder_name,
            holderDid: "",
            credentialTitle: claim.credential_title,
            customName: customName,
            customContent: customContent,
            expireFlag: needClaim.expireFlag,
            issueDate: needClaim.issueDate,
            expireDate: needClaim.expireDate,
            filled: 0,
            jwt: "",
            backuped: 0,
        }

        if (claim.holder.indexOf("did:dmaster") == -1) {
            vcObj.holderEmail = claim.holder
        } else {
            vcObj.holderDid = claim.holder
        }

        db.vc.add(vcObj);

        return {
            vcid: vcid,
            holder: claim.holder,
        }
    },

    async queryVcs(issuerDid) {
        let ret = await db.vc.where("issuerDid").equalsIgnoreCase(issuerDid).toArray();
        return ret
    },

    async addVc(vcObj) {
        let vcs = await this.queryVcWithVcid(vcObj.credentialId)
        if (vcs.length == 0) {
            await db.vc.add(vcObj);
        }
    },

    async queryVcWithId(id) {
        return await db.vc.get(id);
    },

    async queryVcsWithIds(ids) {
        return await db.vc.bulkGet(ids);
    },

    async queryVcWithVcid(vcid) {
        let vcs = await db.vc.where( { 'credentialId': vcid }).toArray();
        return vcs
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
    },

    async updateVcBackup(id, backup) {
        await db.vc.update(id, { backuped: backup })
    }
}