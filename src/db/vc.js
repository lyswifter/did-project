import db from "./db"
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
        }

        db.vc.add(vcObj);

        return vcid
    },

    queryVcs() {
        // let vcs = [];
        // db.vc.each(ele => {
        //     vcs.push(ele);
        // })
        // return vcs

        return db.vc.toArray();
    },

    queryVc(vcid) {
        return db.vc.where('credentialId').equals(vcid).toArray();
    }
}