const pool = require("../config/db");

// Create Store
const createStore = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      owner_id
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO stores
      (name, email, address, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, email, address, owner_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

// Get All Stores
const getStores = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        u.name AS owner_name,
        COALESCE(AVG(r.rating),0) AS average_rating
      FROM stores s
      LEFT JOIN users u
        ON s.owner_id = u.id
      LEFT JOIN ratings r
        ON s.id = r.store_id
      GROUP BY s.id, u.name
      ORDER BY s.id
    `);

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

// Search Stores
const searchStores = async (req, res) => {
  try {

    const { name, address } = req.query;

    let query = `
      SELECT *
      FROM stores
      WHERE 1=1
    `;

    const values = [];
    let count = 1;

    if (name) {
      query += ` AND name ILIKE $${count}`;
      values.push(`%${name}%`);
      count++;
    }

    if (address) {
      query += ` AND address ILIKE $${count}`;
      values.push(`%${address}%`);
      count++;
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  createStore,
  getStores,
  searchStores
};