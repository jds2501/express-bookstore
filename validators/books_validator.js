const Validator = require('jsonschema').Validator;

Validator.prototype.customFormats.isbn = (isbn) => {
    // Remove hyphens and spaces
    isbn = isbn.replace(/[-\s]/g, "");

    // Check if the length is 13 and consists only of digits
    if (!/^\d{13}$/.test(isbn)) {
        return false;
    }

    let sum = 0;

    // Apply ISBN-13 validation formula
    for (let i = 0; i < 13; i++) {
        let digit = parseInt(isbn[i], 10);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }

    // Valid if sum is a multiple of 10
    return sum % 10 === 0;
}

Validator.prototype.customFormats.amazon_url = (input) => {
    return input.startsWith("https://www.amazon.com/");
};

Validator.prototype.customFormats.non_empty_string = (input) => {
    return input.length > 0;
}

const v = new Validator();

const booksSchema = {
    "id": "/books",
    "type": "object",
    "properties": {
        "isbn": { "type": "string", "format": "isbn" },
        "amazon_url": { "type": "string", "format": "amazon_url" },
        "author": { "type": "string", "format": "non_empty_string" },
        "language": { "type": "string", "format": "non_empty_string" },
        "pages": { "type": "integer", "minimum": 1 },
        "publisher": { "type": "string", "format": "non_empty_string" },
        "title": { "type": "string", "format": "non_empty_string" },
        "year": { "type": "integer", "minimum": 0 },
    },
    "required": ["isbn", "amazon_url", "author", "language", "pages",
        "publisher", "title", "year"
    ]
};

const test = {
    "isbn": "978-0-306-40615-7",
    "amazon_url": "https://www.amazon.com/book",
    "author": "Greg",
    "language": "English",
    "pages": 20,
    "publisher": "ax",
    "title": "The Game",
    "year": 2010
};

v.addSchema(booksSchema, '/books');
console.log(v.validate(test, booksSchema));