const express = require('express');
const app = express();
const PORT = 9999;

app.use(express.json());

app.listen(
    PORT,
    () => console.log(`API live on http://localhost:${PORT}`)
)

app.get('/captcha/:id', (req, res) => {
    const { id } = req.params;

    // TODO modify to id not present
    if (id > 1000) {
        res.status(401).send({ error: 'The requested CAPTCHA does not exist.' })
    } else {
        res.status(200).send({
            image: 'base64img',
            options: [],
            id: id
        })
    }
});

app.post('/captcha/:id', (req, res) => {
    const { id } = req.params;
    const { answers } = req.body;

    // TODO modify to id not present
    if (id > 1000) {
        res.status(401).send({ message: 'The CAPTCHA submitted does not exist in our database.' })
    } else {
        if (answers) { // TODO change to actual check for correctness 
            res.send({ message: 'You solved the CAPTCHA! Here\'s a cookie for you: 🍪' })
        } else {
            res.status(403).send({ message: 'The CAPTCHA was not solved correctly, try again.' })
        }
    }
});