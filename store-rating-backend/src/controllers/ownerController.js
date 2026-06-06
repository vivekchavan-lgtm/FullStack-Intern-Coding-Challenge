const pool = require("../config/db");

const getOwnerDashboard = async (req, res) => {

  try {

    const ownerId = req.user.id;

    const result = await pool.query(`
      SELECT
        s.id,
        s.name,
        COUNT(r.id) AS total_ratings,
        COALESCE(AVG(r.rating),0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r
      ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id
    `,[ownerId]);
        console.log(req.user);
    res.json(result.rows);

  } catch(err){

    res.status(500).json({
      message: err.message
    });

  }

};

const getRaters = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        r.rating,
        s.name as store_name
      FROM users u
      JOIN ratings r ON u.id = r.user_id
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
      ORDER BY r.id DESC
    `, [ownerId]);
    res.json(result.rows);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getOwnerDashboard,
  getRaters
};