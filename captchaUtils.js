const mongoose = require('mongoose');
const Captcha = require('./models/_captcha');
const CaptchaFactory = require('./captchaFactory')
const captchaFactory = new CaptchaFactory()

class CaptchaUtils {

    async initialize() {

        // await captchaFactory.generateImagesFromDataset();
        const generatedPath = captchaFactory.getAllPaths('./res/generated/');
        const generatedImage = './res/generated/airplane_01b+banana_01b.jpg';
        for (let generatedImage of generatedPath) {
            const imageData = captchaFactory.convertToBinary(generatedImage);
            const answers = captchaFactory.extractNamesFromFileName(generatedImage);
            console.log(answers);
            this.create(imageData, answers);
        }
    }

    create(image, answers) {
        const captcha = new Captcha({
            image: image,
            answers: answers
        });

        captcha.save()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    get() {

        // Get the count of all users
        Captcha.count().exec((count) => {

            // Get a random entry
            let random = Math.floor(Math.random() * count);

            // Again query all users but only fetch one offset by our random #
            Captcha.findOne().skip(random)
                .then((result) => {
                    return result;
                }).catch((err) => {
                    console.log(err);
                    throw err;
                });
        }).then((result) => {
            return result;
        }).catch((err) => {
            console.log(err);
            throw err;
        });
    }

    get(id) {
        return Captcha.findById(id)
            .then((result) => {
                return result;
            }).catch((err) => {
                console.log(err);
                throw err;
            });
    }

    validate(id, answers) {
        // Retrieve the stored answer from the database based on the captchaId
        const storedAnswers = [];

        // Compare the stored answer with the submitted userCaptcha
        // return storedAnswers === answers;
        return true;
    }
}

module.exports = CaptchaUtils;
