require("dotenv").config();
const pool = require("./src/config/db");

async function checkConstraint() {
  try {
    const res = await pool.query(
      `SELECT pg_get_constraintdef(c.oid) AS constraint_def
       FROM pg_constraint c
       JOIN pg_class t ON c.conrelid = t.oid
       WHERE t.relname = 'users' AND c.contype = 'c';`
    );
    console.log("Constraints:", res.rows);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    pool.end();
  }
}

checkConstraint();
