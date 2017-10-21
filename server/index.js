const express = require('express');
const bodyParser = require('body-parser');
const mc = require(`${__dirname}/controllers/messages_controller`);
const session = require('express-session');

const filter = require('./middlewares/filter')
const createInitialSession = require('./middlewares/session');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public/build`));
app.use(session({
    secret: 'the m00se w@lks b@ckw@rd 1n the r@1n',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 100000000 }
}));

app.use(createInitialSession);

app.use((req, res, next) => {
    if(req.method === 'POST' || req.method === 'PUT') {
        filter(req, res, next);
    }
    next();
})


const messagesBaseUrl = "/api/messages";
app.post(messagesBaseUrl, mc.create);
app.get(messagesBaseUrl, mc.read);
app.put(`${messagesBaseUrl}`, mc.update);
app.delete(`${messagesBaseUrl}`, mc.delete);
app.get(`${messagesBaseUrl}/history`, mc.history);

const port = 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}.`); });