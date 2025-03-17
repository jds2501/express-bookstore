process.env.NODE_ENV = "test";
const request = require('supertest');
const db = require('../db');

const testBook = {
    "isbn": "9780192633361",
    "amazon_url": "https://www.amazon.com/book",
    "author": "Test",
    "language": "Spanish",
    "pages": 90,
    "publisher": "Max",
    "title": "the game",
    "year": 2010
};

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
    });

    test('POST request to create book and get it after', async () => {
        const postResponse = await request(server)
            .post('/books')
            .send(testBook)
            .expect(201);

        expect(postResponse.body.book).toStrictEqual(testBook);

        await request(server)
            .get("/books")
            .expect(200, { "books": [testBook] });

        await request(server)
            .get(`/books/${testBook["isbn"]}`)
            .expect(200, { "book": testBook });
    });

    test('POST request with missing request body parameters', async () => {
        await request(server)
            .post('/books')
            .expect(400);

        const missingPropertyOnBook = { ...testBook };
        delete missingPropertyOnBook.year;

        await request(server)
            .post('/books')
            .send(missingPropertyOnBook)
            .expect(400);
    });

    test('POST request with incorrect request body parameters', async () => {
        await request(server)
            .post('/books')
            .send({
                ...testBook,
                "isbn": "dne",
            })
            .expect(400);

        await request(server)
            .post('/books')
            .send({
                ...testBook,
                "amazon_url": "https://www.google.com/book",
            })
            .expect(400);

        await request(server)
            .post('/books')
            .send({
                ...testBook,
                pages: 0
            })
            .expect(400);

        await request(server)
            .post('/books')
            .send({
                ...testBook,
                year: 0
            })
            .expect(400);
    });

    test("POST, PUT, GET request on a book", async () => {
        await request(server)
            .post('/books')
            .send(testBook)
            .expect(201);

        const updatedBook = { ...testBook, "pages": 290 };

        const putResponse = await request(server)
            .put(`/books/${testBook["isbn"]}`)
            .send(updatedBook)
            .expect(200);

        expect(putResponse.body.book).toStrictEqual(updatedBook);

        await request(server)
            .get(`/books/${testBook["isbn"]}`)
            .expect(200, { "book": updatedBook });
    });

    test('PUT request with incorrect request body parameters', async () => {
        await request(server)
            .post('/books')
            .send(testBook)
            .expect(201);

        await request(server)
            .put(`/books/${testBook["isbn"]}`)
            .send({
                ...testBook,
                "isbn": "dne",
            })
            .expect(400);

        await request(server)
            .put(`/books/${testBook["isbn"]}`)
            .send({
                ...testBook,
                "amazon_url": "https://www.google.com/book",
            })
            .expect(400);

        await request(server)
            .put(`/books/${testBook["isbn"]}`)
            .send({
                ...testBook,
                pages: 0
            })
            .expect(400);

        await request(server)
            .put(`/books/${testBook["isbn"]}`)
            .send({
                ...testBook,
                year: 0
            })
            .expect(400);
    });

    test("POST, DELETE, GET request on book", async () => {
        await request(server)
            .post('/books')
            .send(testBook)
            .expect(201);

        const deleteResponse = await request(server)
            .delete(`/books/${testBook["isbn"]}`)
            .expect(200);

        expect(deleteResponse.body.message).toBe("Book deleted");

        await request(server)
            .get("/books")
            .expect(200, { books: [] });
    })
});