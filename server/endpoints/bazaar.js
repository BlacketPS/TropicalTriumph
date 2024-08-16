let lockedIDs = [];

module.exports = (app) => {
    app.get('/api/bazaar', (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        if (!req.query.item) db['event_tt'].query(`SELECT * FROM bazaar ORDER BY date DESC LIMIT 25`, (err, eventResult) => {
            if (err) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (eventResult.length == 0) return res.send({
                error: false,
                bazaar: []
            });
            db['blacket_dev'].query(`SELECT id, username FROM users WHERE id IN (${eventResult.map(entry => entry.seller).join(",")})`, (err, blacketResult) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                Object.keys(eventResult).forEach(entry => {
                    if (blacketResult.filter(user => user.id == eventResult[entry].seller)[0]) eventResult[entry].seller = blacketResult.filter(user => user.id == eventResult[entry].seller)[0].username;
                }), res.send({
                    error: false,
                    bazaar: eventResult
                });
            });
        });
        else {
            if (typeof req.query.item !== 'string') return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (req.query.item.length > 64) return res.send({
                error: true,
                reason: `Item name is too long.`
            });
            db['event_tt'].query(`SELECT * FROM bazaar WHERE item = '${req.query.item.replaceAll("'", "''")}' OR id LIKE '%${req.query.item.replaceAll("'", "''")}%' OR seller LIKE '%${req.query.item.replaceAll("'", "''")}%' ORDER BY price ASC LIMIT 1000`, (err, eventResult) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                if (eventResult.length == 0) return res.send({
                    error: false,
                    bazaar: []
                });
                db['blacket_dev'].query(`SELECT id, username FROM users WHERE id IN (${eventResult.map(entry => entry.seller).join(",")})`, (err, blacketResult) => {
                    if (err) return res.send({
                        error: true,
                        reason: `Something went wrong.`
                    });
                    Object.keys(eventResult).forEach(entry => {
                        if (blacketResult.filter(user => user.id == eventResult[entry].seller)[0]) eventResult[entry].seller = blacketResult.filter(user => user.id == eventResult[entry].seller)[0].username;
                    }), res.send({
                        error: false,
                        bazaar: eventResult
                    });
                });
            });
        }
    });

    app.post('/api/bazaar/list', rateLimit({
        delay: 250,
        max: 1
    }), async (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        if (!req.body.item) return res.send({
            error: true,
            reason: `You must specify an item.`
        });
        if (typeof req.body.item != 'string') return res.send({
            error: true,
            reason: `Something went wrong.`
        });
        if (!req.body.price) return res.send({
            error: true,
            reason: `You must specify a price.`
        });
        if (isNaN(req.body.price)) return res.send({
            error: true,
            reason: `Price must be a number.`
        });
        if (req.body.price < 1) return res.send({
            error: true,
            reason: `Price must be greater than 0.`
        });
        if (req.body.price % 1 != 0) return res.send({
            error: true,
            reason: `Price must be a whole number.`
        });
        if (req.body.price > 1000000000) return res.send({
            error: true,
            reason: `Price is too high.`
        });
        db['event_tt'].query(`SELECT * FROM users WHERE id = ${req.session.user}`, (err, user) => {
            if (err) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (user.length == 0) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            db['event_tt'].query(`SELECT * FROM bazaar WHERE seller = ${req.session.user}`, (err, result) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                if (result.length > 10) return res.send({
                    error: true,
                    reason: `You cannot have more than 10 listings.`
                });
                let id = Math.floor(1000000 + Math.random() * 9000000);
                setTimeout(async () => {
                    let treasures = JSON.parse(user[0].treasures);
                    if (!Object.keys(treasures).filter(category => Object.keys(treasures[category]).includes(req.body.item)).length) return res.send({
                        error: true,
                        reason: `Treasure does not exist.`
                    });
                    if (treasures[Object.keys(treasures).filter(category => Object.keys(treasures[category]).includes(req.body.item))[0]][req.body.item] < 1) return res.send({
                        error: true,
                        reason: `Not enough treasures.`
                    });
                    treasures[Object.keys(treasures).filter(category => Object.keys(treasures[category]).includes(req.body.item))[0]][req.body.item]--;
                    lockedIDs.push(id);
                    db['event_tt'].query(`INSERT INTO bazaar (id, item, price, seller, date) VALUES (${id}, '${req.body.item.replaceAll("'", "''")}', ${req.body.price}, ${req.session.user}, ${((Date.now() / 1000).toString().split("."))[0]}); UPDATE users SET treasures = '${JSON.stringify(treasures).replaceAll("'", "''")}' WHERE id = ${req.session.user}`, (err) => {
                        setTimeout(() => {
                            lockedIDs.splice(lockedIDs.indexOf(id), 1);
                        }, 1000);
                        if (err) return res.send({
                            error: true,
                            reason: `Something went wrong.`
                        });
                        res.send({
                            error: false
                        });
                    });
                }, Math.floor(Math.random() * (50 - 25 + 1) + 25));
            });
        });
    });

    app.post('/api/bazaar/buy', rateLimit({
        delay: 250,
        max: 1
    }), (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        if (!req.body.id) return res.send({
            error: true,
            reason: `You must specify an item ID.`
        });
        if (isNaN(req.body.id)) return res.send({
            error: true,
            reason: `Item ID must be a number.`
        });
        if (req.body.id % 1 != 0) return res.send({
            error: true,
            reason: `Item ID must be a whole number.`
        });
        db['event_tt'].query(`SELECT * FROM bazaar WHERE id = ${req.body.id}`, async (err, result) => {
            if (err) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (result.length == 0) return res.send({
                error: true,
                reason: `Item not found.`
            });
            db['event_tt'].query(`SELECT * FROM users WHERE id = ${req.session.user}`, async (err, me) => {
                if (req.session.user == result[0].seller) return res.send({
                    error: true,
                    reason: `You cannot buy your own item.`
                });
                if (me[0].shells < result[0].price) return res.send({
                    error: true,
                    reason: `Not enough shells.`
                });
                db['event_tt'].query(`SELECT * FROM users WHERE id = ${result[0].seller}`, async (err, seller) => {
                    if (err) return res.send({
                        error: true,
                        reason: `Something went wrong.`
                    });
                    if (seller.length == 0) return res.send({
                        error: true,
                        reason: `Something went wrong.`
                    });
                    if (lockedIDs.includes(req.body.id)) return res.send({
                        error: true,
                        reason: `The row for this item is locked.`
                    });
                    lockedIDs.push(req.body.id);
                    setTimeout(async () => {
                        let myTreasures = JSON.parse(me[0].treasures);
                        myTreasures[Object.keys(myTreasures).filter(category => Object.keys(myTreasures[category]).includes(result[0].item))[0]][result[0].item]++;
                        let sellerTreasures = JSON.parse(seller[0].treasures);
                        sellerTreasures[Object.keys(sellerTreasures).filter(category => Object.keys(sellerTreasures[category]).includes(result[0].item))[0]][result[0].item]--;
                        db['event_tt'].query(`UPDATE users SET shells = shells - ${result[0].price} WHERE id = ${req.session.user}; UPDATE users SET shells = shells + ${result[0].price} WHERE id = ${result[0].seller}; UPDATE users SET treasures = '${JSON.stringify(myTreasures).replaceAll("'", "''")}' WHERE id = ${req.session.user}; UPDATE users SET treasures = '${JSON.stringify(sellerTreasures).replaceAll("'", "''")}' WHERE id = ${result[0].seller}; DELETE FROM bazaar WHERE id = ${req.body.id}`, (err) => {
                            setTimeout(() => {
                                lockedIDs.splice(lockedIDs.indexOf(req.body.id), 1);
                            }, 1000);
                            if (err) return res.send({
                                error: true,
                                reason: `Something went wrong.`
                            });
                            res.send({
                                error: false
                            });
                        });
                    }, Math.floor(Math.random() * (50 - 25 + 1) + 25));
                });
            });
        });
    });

    app.post('/api/bazaar/remove', rateLimit({
        delay: 250,
        max: 1
    }), (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        if (!req.body.id) return res.send({
            error: true,
            reason: `You must specify an item ID.`
        });
        if (isNaN(req.body.id)) return res.send({
            error: true,
            reason: `Item ID must be a number.`
        });
        if (req.body.id % 1 != 0) return res.send({
            error: true,
            reason: `Item ID must be a whole number.`
        });
        db['event_tt'].query(`SELECT * FROM bazaar WHERE id = ${req.body.id}`, async (err, result) => {
            if (err) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (result.length == 0) return res.send({
                error: true,
                reason: `Item not found.`
            });
            if (result[0].seller != req.session.user) return res.send({
                error: true,
                reason: `You cannot remove an item that you do not own.`
            });
            if (lockedIDs.includes(req.body.id)) return res.send({
                error: true,
                reason: `The row for this item is locked.`
            });
            db['event_tt'].query(`SELECT * FROM users WHERE id = ${req.session.user}`, async (err, user) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                if (user.length == 0) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                lockedIDs.push(req.body.id);
                setTimeout(async () => {
                    let treasures = JSON.parse(user[0].treasures);
                    treasures[Object.keys(treasures).filter(category => Object.keys(treasures[category]).includes(result[0].item))[0]][result[0].item]++;
                    db['event_tt'].query(`UPDATE users SET treasures = '${JSON.stringify(treasures).replaceAll("'", "''")}' WHERE id = ${req.session.user}; DELETE FROM bazaar WHERE id = ${req.body.id}`, (err) => {
                        setTimeout(() => {
                            lockedIDs.splice(lockedIDs.indexOf(req.body.id), 1);
                        }, 1000);
                        if (err) return res.send({
                            error: true,
                            reason: `Something went wrong.`
                        });
                        res.send({
                            error: false
                        });
                    });
                }, Math.floor(Math.random() * (50 - 25 + 1) + 25));
            });
        });
    });
}