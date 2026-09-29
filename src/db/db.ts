import Dexie, { type Table } from 'dexie';
import { UserProfile, UserConsent, AssessmentRecord } from './types';

export class CogniCareDatabase extends Dexie {
  profiles!: Table<UserProfile, string>;
  consents!: Table<UserConsent, string>;
  assessments!: Table<AssessmentRecord, string>;

  constructor() {
    super('CogniCareDB');
    this.version(1).stores({
      profiles: 'id, createdAt',
      consents: 'id, profileId',
      assessments: 'id, profileId, createdAt',
    });
  }

  async clearAllData(): Promise<void> {
    await this.transaction('rw', this.profiles, this.consents, this.assessments, async () => {
      await this.profiles.clear();
      await this.consents.clear();
      await this.assessments.clear();
    });

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
    } catch (err) {
      console.warn('Gagal membersihkan web storage:', err);
    }
  }
}

export const db = new CogniCareDatabase();
