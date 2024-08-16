module.exports = (app) => {
    app.get('/api/leaderboard', async (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        db['event_tt'].query(`SELECT * FROM leaderboard ORDER BY date ASC, treasures DESC`, (err, leaderboard) => {
            if (err) return res.send({
                error: true,
                reason: `Something went wrong.`
            });
            if (leaderboard.length == 0) return res.send({
                error: false,
                leaderboard: []
            });
            leaderboard = leaderboard.map(user => {
                return {
                    id: user.user,
                    treasures: user.treasures
                }
            });
            leaderboard.sort((a, b) => {
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;
                if (a.treasures > b.treasures) return -1;
                if (a.treasures < b.treasures) return 1;
                return 0;
            });
            db['blacket_dev'].query(`SELECT * FROM users WHERE id IN (${leaderboard.map(user => user.id).join(',')})`, (err, users) => {
                if (err) return res.send({
                    error: true,
                    reason: `Something went wrong.`
                });
                if (users.length == 0) return res.send({
                    error: false,
                    leaderboard: []
                });
                leaderboard = leaderboard.map(user => {
                    let userObj = users.find(u => u.id == user.id);
                    return {
                        id: user.id,
                        username: userObj.username,
                        treasures: user.treasures
                    }
                });
                let myPosition = leaderboard.findIndex(user => user.id == req.session.user);
                res.send({
                    error: false,
                    leaderboard: leaderboard.slice(0, 100),
                    position: myPosition == -1 ? null : myPosition + 1
                });
            });
        });
    });
}