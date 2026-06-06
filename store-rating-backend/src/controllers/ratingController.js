const pool = require("../config/db");

const addRating = async (req, res) => {

  try {

    const user_id = req.user.id;

    const {
      store_id,
      rating
    } = req.body;

    const existingRating =
      await pool.query(
        `
        SELECT *
        FROM ratings
        WHERE user_id=$1
        AND store_id=$2
        `,
        [user_id, store_id]
      );

    if (existingRating.rows.length > 0) {

      return res.status(400).json({
        message: "You already rated this store"
      });

    }

    const result =
      await pool.query(
        `
        INSERT INTO ratings
        (user_id,store_id,rating)
        VALUES ($1,$2,$3)
        RETURNING *
        `,
        [user_id, store_id, rating]
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
const updateRating = async (req, res) => {

  const user_id = req.user.id;
  const store_id = req.params.storeId;
  const { rating } = req.body;

  const result = await pool.query(
    `
    UPDATE ratings
    SET rating=$1
    WHERE user_id=$2
    AND store_id=$3
    RETURNING *
    `,
    [rating, user_id, store_id]
  );

  res.json(result.rows[0]);
};

module.exports = {
  addRating,
  updateRating
};