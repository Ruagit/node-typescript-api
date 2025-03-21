import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { dbPromise } from "../database";
import { User, PartialUserResponse } from "../types";

export const insertUser = async (userPayload: User): Promise<PartialUserResponse> => {
  const db = await dbPromise;

  const { fullName, email, password, userType, createdAt } = userPayload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await db.run(
    'INSERT INTO users (id, fullName, email, password, userType, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [id, fullName, email, hashedPassword, userType, createdAt]
  );

  const user = await db.get<User>('SELECT id, fullName, email, userType, createdAt FROM users WHERE id = ?', [id]);

  if (!user) {
    throw new Error('User not found after insertion');
  }

  return user;
};

export const fetchUserById = async (id: string): Promise<PartialUserResponse | undefined> => {
  const db = await dbPromise;

  const user = await db.get<User>('SELECT id, fullName, email, userType, createdAt FROM users WHERE id = ?', [id]);

  return user;
}

