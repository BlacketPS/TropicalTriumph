module.exports = (app) => {
    app.post('/api/verify', rateLimit({
        delay: 1000,
        max: 1
    }), async (req, res) => {
        if (verifiedIPs.includes(req.ip)) return res.send({
            error: true,
            reason: `Already verified.`
        });
        if (!req.body.code) return res.send({
            error: true,
            reason: `Access code must be specified.`
        });
        if (typeof req.body.code != 'string') return res.send({
            error: true,
            reason: `Access code must be a string.`
        });
        if (req.body.code.length !== 47) return res.send({
            error: true,
            reason: `Invalid access code.`
        });
        if (req.body.code !== "i would love if ankha shit and piss in my mouth") return res.send({
            error: true,
            reason: `Invalid access code.`
        });
        verifiedIPs.push(req.ip);
        res.send({
            error: false
        });
    });
}