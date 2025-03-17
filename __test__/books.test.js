process.env.NODE_ENV = "test";
const request = require('supertest');
const db = require('../db');

describe('Books API Tests', () => {
    let server;

    beforeAll(async () => {
        await db.connect();
        const app = require('../app');
        server = app.listen();
    });

    beforeEach(async () => {
        await db.query("BEGIN");
    });

    afterEach(async () => {
        await db.query("ROLLBACK");
    });

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await db.end();
    });

    test('GET request on /books with no books', async () => {
        await request(server)
            .get("/books")
            .expect(200, { books: [] });
    });

    test('GET request on a book that does not exist', async () => {
        await request(server)
            .get("/books/9780333791035")
            .expect(404);
    });

    test('GET request on a book with an invalid isbn', async () => {
        await request(server)
            .get("/books/dne")
            .expect(400);
    })
});