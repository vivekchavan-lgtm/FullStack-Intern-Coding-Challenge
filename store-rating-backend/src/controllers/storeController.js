const pool = require("../config/db");

const createStore = async (req, res) => {

  try {

    const {
      name,
      email,
      address,
      owner_id
    } = req.body;

    const result =
      await pool.query(
        `
        INSERT INTO stores
        (name,email,address,owner_id)
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
        [
          name,
          email,
          address,
          owner_id
        ]
      );

    res.status(201).json(
      result.rows[0]
    );

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

module.exports = {
  createStore
};
const getStores = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      u.name as owner_name
      FROM stores s
      LEFT JOIN users u
      ON s.owner_id = u.id
      ORDER BY s.id
    `);

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};
module.exports = {
  createStore,
  getStores
};