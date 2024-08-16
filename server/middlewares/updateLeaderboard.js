module.exports = (app) => {
    app.use((req, res, next) => {
        if (!req.session || !req.session.user) return next();
        db['event_tt'].query(`SELECT * FROM users WHERE id = ${req.session.user}`, (err, user) => {
            if (err || !user[0]) return next();
            let newUnique = Object.values(JSON.parse(user[0].treasures)).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length;
            db['event_tt'].query(`SELECT * FROM leaderboard WHERE user = ${req.session.user}`, (err, leaderboard) => {
                if (err || !leaderboard[0]) return next();
                let oldUnique = leaderboard[0].treasures;
                if (newUnique !== oldUnique) db['event_tt'].query(`UPDATE leaderboard SET treasures = ${newUnique}, date = ${Date.now()} WHERE user = ${req.session.user}`, (err, leaderboard) => {
                    if (err || !leaderboard[0]) return next();
                    next();
                });
                else next();
            });
        });
    });
}