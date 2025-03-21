import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import bcrypt from 'bcrypt';
import { UserType } from '../types';


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

export const seedTestUser = async (db: Database<sqlite3.Database, sqlite3.Statement>): Promise<void> => {
  const testUser = {
    id: "2b4a2e6d-2953-40f4-b72d-6782a1870740",
    fullName: 'Test User',
    email: 'test.user@example.co.uk',
    password: await bcrypt.hash('Password2', 10),
    userType: UserType.Teacher,
    createdAt: new Date().toISOString(),
  };

  await db.run(
    'INSERT INTO users (id, fullName, email, password, userType, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [testUser.id, testUser.fullName, testUser.email, testUser.password, testUser.userType, testUser.createdAt]
  );
}