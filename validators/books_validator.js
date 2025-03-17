const Validator = require('jsonschema').Validator;
const ExpressError = require('../expressError');

function isValidISBN(isbn) {
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

Validator.prototype.customFormats.isbn = isValidISBN;

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
        "year": { "type": "integer", "minimum": 1 },
    },
    "required": ["isbn", "amazon_url", "author", "language", "pages",
        "publisher", "title", "year"
    ]
};

v.addSchema(booksSchema, '/books');

function validateISBN(isbn) {
    const result = isValidISBN(isbn);

    if (!result) {
        throw new ExpressError(`${isbn} is not a valid ISBN`, 400);
    }
}

function validateBookJSON(bookJSON) {
    const result = v.validate(bookJSON, booksSchema);

    if (!result.valid) {
        let failedValidationProperties = "";

        for (let index = 0; index < result.errors.length; index++) {
            const error = result.errors[index];
            const property = error.property.replace("instance.", "");
            failedValidationProperties += property;

            if (index < result.errors.length - 1) {
                failedValidationProperties += ", ";
            }
        }

        failedValidationProperties += " didn't meet schema requirements";
        throw new ExpressError(failedValidationProperties, 400);
    }
}


module.exports = { validateBookJSON, validateISBN };