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

module.exports = {
  getOwnerDashboard
};