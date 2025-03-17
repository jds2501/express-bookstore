/** Server for bookstore. */


const app = require("./app");
const db = require("./db");

db.connect();

app.listen(3000, () => {
  console.log(`Server starting on port 3000`);
});
