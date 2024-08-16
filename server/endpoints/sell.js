let prices = [
    1,
    5,
    10,
    25,
    100,
    2500,
    10000
];

module.exports = (app) => {
    app.post('/api/sell', rateLimit({
        delay: 250,
        max: 1
    }), async (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        if (!req.body.treasure) return res.send({
            error: true,
            reason: `Treasure must be specified.`
        });
        if (typeof req.body.treasure != 'string') return res.send({
            error: true,
            reason: `Treasure must be a string.`
        });
        if (!req.body.quantity) return res.send({
            error: true,
            reason: `Quantity must be specified.`
        });
        if (isNaN(req.body.quantity)) return res.send({
            error: true,
            reason: `Quantity must be a number.`
        });
        if (req.body.quantity % 1 != 0) return res.send({
            error: true,
            reason: `Quantity must be a whole number.`
        });
        if (req.body.quantity < 1) return res.send({
            error: true,
            reason: `Quantity must be greater than 0.`
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
            let treasures = JSON.parse(result[0].treasures);
            if (!Object.keys(treasures).filter(category => Object.keys(treasures[category]).includes(req.body.treasure)).length) return res.send({
                error: true,
                reason: `Treasure does not exist.`
            });
            if (treasures[Object.keys(treasures).filter(category => Object.keys(treasures[category]).includes(req.body.treasure))[0]][req.body.treasure] < req.body.quantity) return res.send({
                error: true,
                reason: `Not enough treasures.`
            });
            let price;
            Object.keys(treasures).forEach(category => {
                if (Object.keys(treasures[category]).includes(req.body.treasure)) price = prices[Object.keys(treasures[category]).indexOf(req.body.treasure)];
            });
            treasures[Object.keys(treasures).filter(category => Object.keys(treasures[category]).includes(req.body.treasure))[0]][req.body.treasure] -= req.body.quantity;
            db['event_tt'].query(`UPDATE users SET shells = shells + ${price * req.body.quantity}, treasures = '${JSON.stringify(treasures).replaceAll("'", "''")}' WHERE id = ${req.session.user}`, (err) => {
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