import db from "./db"

export default {
    createClaimTemplate() {
        let temp1 = {
            templateId: 1,
            templateName: "Membership Card",
            templateType: "Membership Card",
            templateImage: "https://dmaster.com/dcommon/template/1.png",
            templateExcelUrl: "https://dmaster.com/dcommon/template/Membership_Card.xlsx",
        }
  
        let temp2 = {
            templateId: 2,
            templateName: "Activity Certificate",
            templateType: "Activity Certificate",
            templateImage: "https://dmaster.com/dcommon/template/2.png",
            templateExcelUrl: "https://dmaster.com/dcommon/template/Activity_Certificate.xlsx",
        }
  
        db.tmpl.add(temp1);
        db.tmpl.add(temp2);
    },

    queryVcTemplate() {
        let tmpls = [];
        db.tmpl.each(ele => {
            tmpls.push(ele);
        })

        return tmpls
    }
}