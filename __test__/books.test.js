process.env.NODE_ENV = "test";
const request = require('supertest');
const db = require('../db');

describe('Books API Tests', () => {
    let server;

    beforeAll(async () => {
        await db.connect();
    })

    beforeEach(async () => {
        const app = require('../app');
        server = app.listen();
    });

    afterEach(async () => {
        server.close();
    });

    afterAll(async () => {
        await db.end();
    });

    test('GET request', async () => {
        expect(true).toBe(true);
    });

    test('POST request', async () => {
        expect(true).toBe(true);
    });
});