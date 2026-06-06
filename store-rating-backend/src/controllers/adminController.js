const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {

    const usersResult =
      await pool.query("SELECT COUNT(*) FROM users");

    const storesResult =
      await pool.query("SELECT COUNT(*) FROM stores");

    const ratingsResult =
      await pool.query("SELECT COUNT(*) FROM ratings");

    res.json({
      totalUsers:
        parseInt(usersResult.rows[0].count),

      totalStores:
        parseInt(storesResult.rows[0].count),

      totalRatings:
        parseInt(ratingsResult.rows[0].count)
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};
const getUsers = async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT
        id,
        name,
        email,
        address,
        role
        FROM users
        ORDER BY id
        `
      );

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

module.exports = {
  getDashboard,
  getUsers
};