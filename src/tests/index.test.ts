import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';
import { dbPromise, seedDatabase, seedTestUser } from '../database';

import server from '../server';

describe('User API', () => {
  beforeAll(async () => {
    const db = await dbPromise;
    await seedDatabase(db);
  });

  afterAll(async () => {
    const db = await dbPromise;
    await db.exec('DELETE FROM users');
    await db.close();
  });
  describe('POST - Signup', () => {
    beforeEach(async () => {
      const db = await dbPromise;
      await db.exec('DELETE FROM users');
    });
    test('Signup - Valid User', async () => {
      const response = await request(server).post('/api/signup').send({
        fullName: 'Justin Bosman',
        email: 'justin.bosman@example.co.uk',
        password: 'Password1',
        userType: 'student',
        createdAt: new Date().toISOString(),
      });
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('fullName');
      expect(response.body.user.fullName).toBe('Justin Bosman');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe('justin.bosman@example.co.uk');
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
        email: 'justin.bosman@example.co.uk',
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
          email: 'justin.bosman@example.co.uk',
          password: 'Password1',
          userType: 'student',
          createdAt: new Date().toISOString(),
        });
      expect(response.status).toBe(404);
    });
  });
  describe('GET - User', () => {
    beforeAll(async () => {
      const db = await dbPromise;
      await seedTestUser(db);
    });
    test('User - Fetches Valid User', async () => {
      const response = await request(server).get(`/api/user/2b4a2e6d-2953-40f4-b72d-6782a1870740`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.id).toBe('2b4a2e6d-2953-40f4-b72d-6782a1870740');
      expect(response.body.user).toHaveProperty('fullName');
      expect(response.body.user.fullName).toBe('Test User');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe('test.user@example.co.uk');
      expect(response.body.user).toHaveProperty('userType');
      expect(response.body.user.userType).toBe('teacher');
      expect(response.body.user).not.toHaveProperty('password');
    });
    test('User - No Id Parameter Provided', async () => {
      const response = await request(server).get('/api/user/');
      expect(response.status).toBe(404);
    });
    test('User - User Does Not Exist', async () => {
      const response = await request(server).get('/api/user/1a1a1a1a-1111-11a1-a11a-1111a1111111');
      expect(response.status).toBe(404);
    });
  });

});
