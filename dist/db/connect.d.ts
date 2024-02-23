import { Db } from 'mongodb';
declare const initDb: (callback: (error: Error | null, db?: Db) => void) => void;
declare const getDb: () => Db;
export { initDb, getDb };
