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
            credentialTitle: claim.credential_title,
            expireFlag: needClaim.expireFlag,
            issueDate: needClaim.issueDate,
            expireDate: needClaim.expireDate,
            filled: 0,
        }

        db.vc.add(vcObj);

        // user.addUserCredentialCount(vcObj.issuerDid).then(val => {
        //     console.log(val)
        // })

        return vcid
    },

    queryVcs() {
        return db.vc.toArray();
    },

    queryVcsWithLimit(limit) {
        if (limit == null) {
            limit = 20
        }

        return db.vc.where("filled").equals(0).offset(0).limit(limit).toArray();
    },

    async queryVc(vcid) {
        let vcs = await db.vc.where('credentialId').equals(vcid).toArray();
        return vcs[0]
    }
}