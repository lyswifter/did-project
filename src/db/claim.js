import db from "./db"

export default {
    createClaims() {
        let claimOfTmpl1 = [
            {
                templateId: 1,
                claimName: "Holder DID or Email",
                claimCode: "holder",
                claimDesc: "A unique identifier of recipient. Enter credential holder did or email address.",
                claimContent: null,
                claimRequired: 1,
                claimType: "text",
                claimSort: 1
            },
            {
                templateId: 1,
                claimName: "Holder name",
                claimCode: "holder_name",
                claimDesc: "The name of the credential holder.",
                claimContent: null,
                claimRequired: 1,
                claimType: "text",
                claimSort: 2
            },
            {
                templateId: 1,
                claimName: "Credential title",
                claimCode: "credential_title",
                claimDesc: "The Credential.",
                claimContent: null,
                claimRequired: 1,
                claimType: "text",
                claimSort: 3
            },
            {
                templateId: 1,
                claimName: "Membership level",
                claimCode: "level",
                claimDesc: null,
                claimContent: null,
                claimRequired: 1,
                claimType: "text",
                claimSort: 4
            }
        ];

        let claimOfTmpl2 = [
            {
                "templateId": 2,
                "claimName": "Holder DID or Email",
                "claimCode": "holder",
                "claimDesc": "A unique identifier of recipient. Enter credential holder did or email address.",
                "claimContent": null,
                "claimRequired": 1,
                "claimType": "text",
                "claimSort": 1
            },
            {
                "templateId": 2,
                "claimName": "Holder name",
                "claimCode": "holder_name",
                "claimDesc": "The name of the credential holder.",
                "claimContent": null,
                "claimRequired": 1,
                "claimType": "text",
                "claimSort": 2
            },
            {
                "templateId": 2,
                "claimName": "Credential title",
                "claimCode": "credential_title",
                "claimDesc": "The Credential.",
                "claimContent": null,
                "claimRequired": 1,
                "claimType": "text",
                "claimSort": 3
            },
            {
                "templateId": 2,
                "claimName": "Sessions",
                "claimCode": "sessions",
                "claimDesc": null,
                "claimContent": null,
                "claimRequired": 1,
                "claimType": "text",
                "claimSort": 4
            }
        ]

        claimOfTmpl1.forEach(element => {
            db.claim.add(element);
        });

        claimOfTmpl2.forEach(element => {
            db.claim.add(element);
        });
    },

    async queryCliamsWith(templateId) {
        return await db.claim.where("templateId").equals(templateId).toArray()
    }
}