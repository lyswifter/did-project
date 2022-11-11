// db.ts
import Dexie, { Table } from 'dexie';

export interface DidCredential {
  id?: number;
  credential_type: string;
  credential_id: number;
  issuer_did: string;
  holder_did: string;
  holder_email: string;
  holder_name: string;
  credential_title: string;
  expire_flag: number;
  issue_date: Date;
  expire_date: Date;
  token: string;
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
  vc!: Table<DidCredential>;
  tmpl!: Table<DidTemplate>;
  claim!: Table<DIdClaim>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      vc: '++id, &credential_id, holder_did', // Primary key and indexed props
      tmpl: '++id, &templateId',
      claim: '++id, templateId'
    });
  }
}

const db = new MySubClassedDexie();
export default db;

