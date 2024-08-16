let timeouts = {};
let chances = {
    "Fossils": {
        "Sea Shell Fossil": 30,
        "Coral Fossil": 20,
        "Crinoid Fossil": 10,
        "Shark Tooth": 7.5,
        "Ammonite Fossil": 5,
        "Dinosaur Bone Fragment": 2,
        "Trilobite Fossil": 1
    },
    "Glass": {
        "White Sea Glass": 25,
        "Green Sea Glass": 10,
        "Brown Sea Glass": 7.5,
        "Blue Sea Glass": 5,
        "Amber Sea Glass": 2.5,
        "Red Sea Glass": 1,
        "Black Sea Glass": 0.75
    },
    "Marine": {
        "Seaweed": 20,
        "Sea Urchin Skeleton": 16,
        "Hermit Crab Shell": 7,
        "Sea Anemone": 5,
        "Sea Sponge": 2,
        "Starfish": 1,
        "Seahorse": 0.5
    },
    "Minerals": {
        "Pebble": 20,
        "Sandstone": 15,
        "Agate": 8,
        "Jasper": 3,
        "Ammonite": 2,
        "Geode": 1,
        "Moonstone": 0.33
    },
    "Treasures": {
        "Broken Glass": 15,
        "Rusty Nails": 12.5,
        "Old Coins": 10,
        "Glass Bottle": 5,
        "Pearl Necklace": 0.75,
        "Gold Doubloon": 0.5,
        "Jeweled Crown": 0.25
    }
}

let shellsChance = 25;

module.exports = (app) => {
    app.post('/api/dig', rateLimit({
        delay: 1000,
        max: 1
    }), async (req, res) => {
        if (!req.session || !req.session.user) return res.send({
            error: true,
            reason: `Unauthorized.`
        });
        if (timeouts[req.session.user] && timeouts[req.session.user] > Date.now()) return res.send({
            error: true,
            reason: `Your shovel is on cooldown for ${Math.ceil((timeouts[req.session.user] - Date.now()) / 1000)} seconds.`
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
            user[0].shovel <= 0 ? timeouts[req.session.user] = Date.now() + 30000 :
                user[0].shovel === 1 ? timeouts[req.session.user] = Date.now() + 20000 :
                user[0].shovel === 2 ? timeouts[req.session.user] = Date.now() + 15000 :
                user[0].shovel === 3 ? timeouts[req.session.user] = Date.now() + 10000 :
                user[0].shovel >= 4 ? timeouts[req.session.user] = Date.now() + 5000 : timeouts[req.session.user] = Date.now() + 30000;
            
        });
    });
}