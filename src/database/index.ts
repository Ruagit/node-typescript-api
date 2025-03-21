import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

export const dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> = open({
  filename: ':memory:',
  driver: sqlite3.Database
});

export const seedDatabase = async (db: Database<sqlite3.Database, sqlite3.Statement>): Promise<void> => {
  await db.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      userType TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
};
