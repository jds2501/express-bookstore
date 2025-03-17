const Validator = require('jsonschema').Validator;
Validator.prototype.customFormats.amazon_url = (input) => {
    return input.startsWith("https://www.amazon.com/");
};

const v = new Validator();

const booksSchema = {
    "id": "/books",
    "type": "object",
    "properties": {
        "isbn": { "type": "string" },
        "amazon_url": { "type": "string", "format": "amazon_url" },
        "author": { "type": "string" },
        "language": { "type": "string" },
        "pages": { "type": "integer", "minimum": 1 },
        "publisher": { "type": "string" },
        "title": { "type": "string" },
        "year": { "type": "integer", "minimum": 0 },
    },
    "required": ["isbn", "amazon_url", "author", "language", "pages",
        "publisher", "title", "year"
    ]
};

const test = {
    "isbn": "abc",
    "amazon_url": "https://www.amazon.com/book",
    "author": "Greg",
    "language": "English",
    "pages": 20,
    "publisher": "Max",
    "title": "The Game",
    "year": 2010
};

v.addSchema(booksSchema, '/books');
console.log(v.validate(test, booksSchema));