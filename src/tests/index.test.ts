import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';
import { dbPromise, seedDatabase } from '../database';

import server from '../server';

beforeAll(async () => {
  const db = await dbPromise;
  await seedDatabase(db);
  await db.exec('DELETE FROM users');
});

describe('User API', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.exec('DELETE FROM users');
  });
  test('Signup - Valid User', async () => {
    const response = await request(server).post('/api/signup').send({
      fullName: 'Justin Bosman',
      email: 'justin.bosman@example.com',
      password: 'Password1',
      userType: 'student',
      createdAt: new Date().toISOString(),
    });
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('fullName');
    expect(response.body.user.fullName).toBe('Justin Bosman');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user.email).toBe('justin.bosman@example.com');
    expect(response.body.user).toHaveProperty('userType');
    expect(response.body.user.userType).toBe('student');
    expect(response.body.user).not.toHaveProperty('password');
  });
  test('Signup - (Missing Fields FullName and Email) Invalid User', async () => {
    const response = await request(server).post('/api/signup').send({
      password: 'Password1',
      userType: 'teacher',
      createdAt: new Date().toISOString(),
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  test('Signup - Invalid UserType', async () => {
    const response = await request(server).post('/api/signup').send({
      fullName: 'Justin Bosman',
      email: 'justin.bosman@example.com',
      password: 'Password1',
      userType: 'invalid',
      createdAt: new Date().toISOString(),
    });
    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message:
            "Invalid enum value. Expected 'student' | 'teacher' | 'parent' | 'private tutor', received 'invalid'",
        }),
      ]),
    );
  });
  test('Signup - No Body Payload', async () => {
    const response = await request(server).post('/api/signup').send();
    expect(response.status).toBe(400);
  });
  test('Signup - Invalid route path', async () => {
    const response = await request(server)
      .post('/api/signup/doesnotexist')
      .send({
        fullName: 'Justin Bosman',
        email: 'justin.bosman@example.com',
        password: 'Password1',
        userType: 'student',
        createdAt: new Date().toISOString(),
      });
    expect(response.status).toBe(404);
  });
});
