// db.ts
import Dexie, { Table } from 'dexie';

export interface DidUser {
  id?: number;
  firstName: string;
  lastName: string;
  did: string;
  company: string;
  credentialCount: number;
  needAddInformation: boolean;
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface DidCredential {
  id?: number;
  credentialId: string;
  templateId: string;
  credentialType: string;
  issuerDid: string;
  holderDid?: string;
  holderEmail: string;
  holderName: string;
  credentialTitle: string;
  expireFlag: number;
  issueDate: string;
  expireDate: string;
  jwt?: string;
}

export interface DidTemplate {
  id?: number;
  templateId: number;
  templateName: string;
  templateType: string;
  templateImage: string;
  templateExcelUrl: string;
}

export interface DIdClaim {
  id?: number;
  templateId: number,
  claimCode: string;
  claimContent?: string;
  claimDesc?: string;
  claimName: string;
  claimRequired: number;
  claimSort: number;
  claimType: string;
}

export class MySubClassedDexie extends Dexie {
  user!: Table<DidUser>;
  vc!: Table<DidCredential>;
  tmpl!: Table<DidTemplate>;
  claim!: Table<DIdClaim>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      user: '++id, did, address',
      vc: '++id, &credentialId, holderDid', // Primary key and indexed props
      tmpl: '++id, &templateId',
      claim: '++id, templateId'
    });
  }
}

const db = new MySubClassedDexie();
export default db;

