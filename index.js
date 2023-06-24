const express = require('express');
const app = express();
const PORT = 9999;
const mongoose = require('mongoose');
const CaptchaUtils = require('./captchaUtils');
const captcha = new CaptchaUtils();

// mongodb connection string
const DB_URI = 'mongodb+srv://iarena:a280102@cluster0.ocgwopd.mongodb.net/uncaptchable'
mongoose.connect(DB_URI)
    .then((result) => {
        app.listen(
            PORT,
            () => {
                console.log(`API live on http://localhost:${PORT}`);
                // captcha.initialize();
            }
        )
    })
    .catch((err) => console.log(err));



app.use(express.json());

app.get('/captcha', (req, res) => {
    captcha.get()
        .then((requestedCaptcha) => {
            res.status(200).send(requestedCaptcha);
        })
        .catch((err) => {
            console.log(err)
            res.status(401).send({ error: 'The requested CAPTCHA does not exist.' })
        });
});

app.get('/captcha/:id', (req, res) => {
    const id = req.params.id;

    captcha.get(id)
        .then((requestedCaptcha) => {
            res.status(200).send(requestedCaptcha);
        })
        .catch((err) => {
            console.log(err)
            res.status(401).send({ error: 'The requested CAPTCHA does not exist.' })
        });
});

app.post('/captcha/:id/validate', (req, res) => {
    const id = req.params;
    const answers = req.body;

    captcha.validate(id, answers)
        .then((validation) => {
            if (validation) {
                res.send({ message: 'You solved the CAPTCHA! Here\'s a cookie for you: 🍪' })
            } else {
                res.status(403).send({ message: 'The CAPTCHA was not solved correctly, try again.' })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ message: 'There was an error, try again.' })
        })

});

