const bcrypt = require('bcrypt');
const md5 = require('md5');

module.exports = (app) => {
    app.post('/api/login', rateLimit({
        delay: 1000,
        max: 1
    }), (req, res) => {
        if (req.session.user) return res.send({
            error: true,
            reason: `You are already logged in.`
        });
        db['blacket_dev'].query(`SELECT * FROM blacklists WHERE ip = "${md5(req.ip)}"`, (err, result) => {
            if (err) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (result.length > 0) return res.send({
                error: true,
                reason: `You are blacklisted from playing the Tropical Triumph event.`
            });
            if (!(req.body.username && req.body.password)) return res.send({
                error: true,
                reason: `You must enter a username and password.`
            });
            if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') return res.send({
                error: true,
                reason: `Invalid username or password.`
            });
            if (req.body.username.length > 16) return res.send({
                error: true,
                reason: `Your username must be less than or 16 characters long.`
            });
            if (req.body.username.match(/[^a-zA-Z0-9_-]/g)) return res.send({
                error: true,
                reason: `Your username can not contain invalid characters.`
            });
            if (req.body.username == 0) return res.send({
                error: true,
                reason: `That username is not allowed.`
            });
            db['blacket_dev'].query(`SELECT * FROM forms WHERE username = "${req.body.username}"; SELECT * FROM users WHERE username = "${req.body.username}" OR id = "${req.body.username}" AND id != 0`, async (err, blacketResult) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                if (blacketResult[0].length > 0) return res.send({
                    error: true,
                    reason: `Your account is not verified.`
                });
                if (!blacketResult[1].length > 0) return res.send({
                    error: true,
                    reason: `We couldn't find an account under that username.`
                });
                if (!bcrypt.compareSync(req.body.password, blacketResult[1][0].password)) return res.send({
                    error: true,
                    reason: `Username and password don't match.`
                });
                if (config.blacklisted.includes(blacketResult[1][0].id)) return res.send({
                    error: true,
                    reason: `You are blacklisted from playing the Tropical Triumph event.`
                });
                db['event_tt'].query(`SELECT * FROM users WHERE id = ${blacketResult[1][0].id}`, (err, result) => {
                    if (err) return res.send({
                        error: true,
                        reason: `Something went wrong.`
                    });
                    if (result.length !== 0) return req.session.user = blacketResult[1][0].id, res.send({
                        error: false
                    });
                    db['event_tt'].query(`INSERT INTO users (id, shells, shovel, treasures, miscellaneous) VALUES (${blacketResult[1][0].id}, ${config.users.defaults.shells}, ${config.users.defaults.shovel}, '${JSON.stringify(config.users.defaults.treasures).replaceAll("'", "''")}', '${JSON.stringify(config.users.defaults.miscellaneous).replaceAll("'", "''")}'); INSERT INTO leaderboard (user, treasures, date) VALUES (${blacketResult[1][0].id}, 0, ${Date.now()})`, (err) => {
                        if (err) return res.send({
                            error: true,
                            reason: `Something went wrong.`
                        });
                        req.session.user = blacketResult[1][0].id;
                        res.send({
                            error: false
                        });
                    });
                });
            });
        });
    });
}