const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:name", async (req, res) => {
    try {
        const selectedFinalWork = req.params;
        console.log(selectedFinalWork);
        //const product = await pool.query("SELECT * FROM bootz WHERE id = $1", [ id ]);
        const selectedFinalWorkSQL = await pool.query(`SELECT * FROM projects where name = '${selectedFinalWork.name}'`);
        res.json(selectedFinalWorkSQL.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;