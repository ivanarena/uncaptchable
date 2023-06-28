const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const PORT = 9999;
const mongoose = require('mongoose');
const CaptchaService = require('./captchaService');
const captcha = new CaptchaService();
const cors = require('cors')


// mongodb connection string
const DB_URI = 'mongodb+srv://user:user@cluster0.ocgwopd.mongodb.net/uncaptchable'
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



app.use(cors())
app.use(express.json());
// Serve the Swagger documentation

// Define Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UnCAPTCHAble',
            version: '1.0.0',
            description: 'An innovative CAPTCHA powerful against AIs.'
        },
    },
    apis: ['./index.js'], // Replace with the actual path to your API file
};

// Generate the Swagger documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /captcha:
 *   get:
 *     summary: Get a CAPTCHA
 *     description: Retrieve a random CAPTCHA
 *     responses:
 *       200:
 *         description: A CAPTCHA object
 */
app.get('/captcha', (req, res) => {
    captcha.getOne()
        .then((requestedCaptcha) => {
            res.status(200).send(requestedCaptcha);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ error: 'Bad request.' });
        });
});

/**
 * @swagger
 * /captcha/list:
 *   get:
 *     summary: Get a list of aCAPTCHA IDs
 *     description: Retrieve a list of all available CAPTCHA IDs
 *     responses:
 *       200:
 *         description: List of CAPTCHA IDs retrieved
 */
app.get('/captcha/list', (req, res) => {
    captcha.getIdList()
        .then((idList) => {
            res.status(200).send(idList);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ error: 'Bad request.' });
        });
});

/**
 * @swagger
 * /captcha/{id}:
 *   get:
 *     summary: Get a specific CAPTCHA
 *     description: Retrieve a specific CAPTCHA by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the CAPTCHA to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CAPTCHA retrieved
 *       404:
 *         description: The requested CAPTCHA does not exist
 */
app.get('/captcha/:id', (req, res) => {
    const id = req.params.id;

    captcha.get(id)
        .then((requestedCaptcha) => {
            res.status(200).send(requestedCaptcha);
        })
        .catch((err) => {
            console.log(err);
            res.status(404).send({ error: 'The requested CAPTCHA does not exist.' });
        });
});

/**
 * @swagger
 * /captcha/{id}/validate:
 *   post:
 *     summary: Validate a CAPTCHA
 *     description: Validate the answers for a specific CAPTCHA
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the CAPTCHA to validate
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               answers: ['A', 'B', 'C']
 *     responses:
 *       200:
 *         description: Validation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: The CAPTCHA was not solved correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: An error occurred during validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
app.post('/captcha/:id/validate', (req, res) => {
    const id = req.params.id;
    const answers = req.body.answers;

    captcha.validate(id, answers)
        .then((validation) => {
            if (validation) {
                res.send({ message: 'You solved the CAPTCHA! Here\'s a cookie for you: 🍪' })
            } else {
                res.status(401).send({ message: 'The CAPTCHA was not solved correctly, try again.' })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ message: 'There was an error, try again.' })
        })

});

