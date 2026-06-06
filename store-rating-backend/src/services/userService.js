const pool = require("../config/db");

const findUserByEmail = async (email) => {

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  return result.rows[0];
};

const createUser = async (
  name,
  email,
  password,
  address,
  role
) => {

  const result = await pool.query(
    `
    INSERT INTO users
    (name,email,password,address,role)
    VALUES($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      name,
      email,
      password,
      address,
      role
    ]
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser
};