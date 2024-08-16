module.exports = (app) => {
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError) res.send({
            error: true,
            reason: `Invalid object.`
        });
        else next();
    });
}