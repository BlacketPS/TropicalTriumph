module.exports = (app) => {
    app.get('/api/logout', rateLimit({
        delay: 1000,
        max: 1
    }), async (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        req.session.destroy();
        res.send({
            error: false
        });
    });
}