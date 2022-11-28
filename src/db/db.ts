// db.ts
import Dexie, { Table } from 'dexie';

export interface DidUser {
  id?: number;
  email: string;
  did: string;
  company: string;
  address: string;
  privateKey: string;
  publicKey: string;
  mnemonic: string;
}

export interface DidCredential {
  id?: number;
  credentialId: string;
  templateId: string;
  credentialType: string;
  issuerName: string;
  issuerDid: string;
  holderDid?: string;
  holderEmail: string;
  holderName: string;
  credentialTitle: string;
  customName: string;
  customContent: string;
  expireFlag: number;
  issueDate: string;
  expireDate: string;
  filled: number;
  jwt?: string;
  backuped: number;
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
      user: '++id, did, publicKey, email',
      vc: '++id, credentialId, holderDid, issuerDid, filled, backuped', // Primary key and indexed props
      tmpl: '++id, &templateId',
      claim: '++id, templateId'
    });
  }
}

const db = new MySubClassedDexie();
export default db;

