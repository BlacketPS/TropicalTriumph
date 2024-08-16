ipRatelimits = {};
userRatelimits = {};

rateLimit = (options) => {
    return (req, res, next) => {
        let endpoint = req.originalUrl.split('/api/')[1].split('/')[0];
        if (!ipRatelimits[endpoint][req.ip]) ipRatelimits[endpoint][req.ip] = 0;

        if (req.session.user)
            if (!userRatelimits[endpoint][req.session.user]) userRatelimits[endpoint][req.session.user] = 0;

        if (ipRatelimits[endpoint][req.ip] > options.max - 1) {
            try {
                res.send({
                    error: true,
                    reason: `You are being ratelimited.`
                });
            } catch {}
            return;
        }

        if (req.session.user)
            if (userRatelimits[endpoint][req.session.user] > options.max - 1) {
                try {
                    res.send({
                        error: true,
                        reason: `You are being ratelimited.`
                    });
                } catch {}
                return;
            }

        ipRatelimits[endpoint][req.ip]++;
        if (req.session.user) userRatelimits[endpoint][req.session.user]++;

        setTimeout(() => {
            ipRatelimits[endpoint][req.ip]--;
            if (req.session)
                if (req.session.user) userRatelimits[endpoint][req.session.user]--;
        }, options.delay);

        next();
    }
}