let prices = [
    25000,
    100000,
    250000,
    500000
]

module.exports = (app) => {
    app.post('/api/upgrade', rateLimit({
        delay: 1000,
        max: 1
    }), async (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        db['event_tt'].query(`SELECT * FROM users WHERE id = ${req.session.user}`, (err, result) => {
            if (err) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (result.length == 0) return res.send({
                error: true,
                reason: `User does not exist`
            });
            if (result[0].shovel == 4) return res.send({
                error: true,
                reason: `Maximum shovel reached.`
            });
            if (result[0].shells < prices[result[0].shovel]) return res.send({
                error: true,
                reason: `Not enough shells.`
            });
            db['event_tt'].query(`UPDATE users SET shells = shells - ${prices[result[0].shovel]}, shovel = shovel + 1 WHERE id = ${req.session.user}`, (err) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                res.send({
                    error: false
                });
            });
        });
    });
}