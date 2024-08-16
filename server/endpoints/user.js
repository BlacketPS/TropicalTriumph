module.exports = (app) => {
    app.get('/api/user/:user?', async (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        if (!req.params.user) {
            db['event_tt'].query(`SELECT * FROM users WHERE id = ${req.session.user}`, (err, eventResult) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                if (eventResult.length == 0) return res.send({
                    error: true,
                    reason: `User does not exist`
                });
                db['blacket_dev'].query(`SELECT * FROM users WHERE id = ${eventResult[0].id}`, (err, blacketResult) => {
                    if (err) return res.send({
                        error: true,
                        reason: `Something went wrong.`
                    });
                    if (blacketResult.length == 0) return res.send({
                        error: true,
                        reason: `User does not exist`
                    });
                    let miscellaneous = JSON.parse(eventResult[0].miscellaneous);
                    miscellaneous.history = miscellaneous.history.slice(-100);
                    res.send({
                        error: false,
                        user: {
                            id: blacketResult[0].id,
                            username: blacketResult[0].username,
                            shells: eventResult[0].shells,
                            shovel: eventResult[0].shovel,
                            treasures: JSON.parse(eventResult[0].treasures),
                            miscellaneous: miscellaneous
                        }
                    });
                });
            });
        } else {
            db['blacket_dev'].query(`SELECT * FROM users WHERE username = "${req.params.user}" OR id = "${req.params.user}" AND id != 0`, (err, blacketResult) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                if (blacketResult.length == 0) return res.send({
                    error: true,
                    reason: `User does not exist`
                });
                db['event_tt'].query(`SELECT * FROM users WHERE id = ${blacketResult[0].id}`, (err, eventResult) => {
                    if (err) return res.send({
                        error: true,
                        reason: `Something went wrong.`
                    });
                    if (eventResult.length == 0) return res.send({
                        error: true,
                        reason: `User does not exist`
                    });
                    let miscellaneous = JSON.parse(eventResult[0].miscellaneous);
                    miscellaneous.history = miscellaneous.history.slice(-100);
                    res.send({
                        error: false,
                        user: {
                            id: blacketResult[0].id,
                            username: blacketResult[0].username,
                            shells: eventResult[0].shells,
                            shovel: eventResult[0].shovel,
                            treasures: JSON.parse(eventResult[0].treasures),
                            miscellaneous: miscellaneous
                        }
                    });
                });
            });
        }
    });
}