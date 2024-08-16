let startTime = performance.now();
config = require('./config.json');
const fs = require('fs');
const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const mysql = require('mysql2');
const axios = require('axios');

app.use(session({
    secret: 'bia',
    name: 'ttsid',
    store: new FileStore({
        logFn: () => {}
    }),
    saveUninitialized: false,
    resave: false,
    httpOnly: true,
}));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.set('trust proxy', true);

verifiedIPs = [];

app.use((req, res, next) => {
    if (!verifiedIPs.includes(req.ip)) return next();
    if (req.path.startsWith("/api/")) return next();
    if (!req.path.split("/").pop().includes(".")) axios.get(`http://localhost:3000/`).then((r) => {
        res.send(r.data);
    }).catch(() => {
        res.redirect("/");
    })
    else axios.get(`http://localhost:3000${req.path}`, {
        responseType: 'arraybuffer'
    }).then((r) => {
        res.send(r.data);
    }).catch(() => {
        res.redirect("/");
    });
});

app.use((req, res, next) => {
    if (verifiedIPs.includes(req.ip)) return next();
    else if (req.path.startsWith("/api/verify")) return next();
    else res.sendFile(__dirname + "/views/verify.html");
});

db = {};
new Promise((resolve, reject) => {
    let connected = 0;
    config.databases.forEach(database => {
        db[database] = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            multipleStatements: true,
            database: database
        });
        db[database].connect((err) => {
            if (err) throw err;
            console.log(`[TT] Connected to database ${database}.`);
            connected++;
        });
    });
    setInterval(() => {
        if (connected === config.databases.length) resolve();
    }, 1);
}).then(() => {
    fs.readdirSync('./functions/').forEach(file => {
        require(`./functions/${file}`);
    });
    console.log(`[TT] Loaded functions.`);
    ['middlewares', 'endpoints'].forEach(folder => {
        fs.readdirSync(`./${folder}/`).forEach(file => {
            require(`./${folder}/${file}`)(app);
            if (folder == "endpoints") {
                ipRatelimits[file.replace(".js", "")] = [];
                userRatelimits[file.replace(".js", "")] = [];
            }
        });
        console.log(`[TT] Loaded ${folder}.`);
    });
    app.listen(config.port, () => console.log(`[TT] Instance started on port ${config.port}. (${(performance.now() - startTime).toString().split(".")[0]}ms)`));
});