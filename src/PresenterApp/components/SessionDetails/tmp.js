const pool = require('../../../../server/modules/pool');

app.get('/patients/:id', async (req, res) => {
    const patientRes = await pool.query(`
        SELECT * FROM patient
        WHERE id = $1
    `);

    const medsRes = await pool.query(`
        SELECT * FROM meds
        JOIN patient
        WHERE patient.id = $1
    `);

    const injuries = await pool.query(`
        SELECT * FROM injuries
        JOIN patient
        WHERE patient.id = $1
    `);

    const data = {
        ...patient.rows[0],
        meds: medsRes.rows,
        injuries: injuries.rows,
    };
    res.send(data);
});
