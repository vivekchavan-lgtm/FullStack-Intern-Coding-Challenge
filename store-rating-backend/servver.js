require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/config/db");

pool.query("SELECT NOW()")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});