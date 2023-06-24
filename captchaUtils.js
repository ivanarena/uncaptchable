const mongoose = require('mongoose');
const Captcha = require('./models/_captcha');
const CaptchaFactory = require('./captchaFactory')
const captchaFactory = new CaptchaFactory()

class CaptchaUtils {

    async initialize() {

        // await this.generateImagesFromDataset();
        const generatedPath = captchaFactory.getAllPaths('./res/generated/')
        console.log(generatedPath)
    }

    async generateImagesFromDataset() {
        // 2d array: [folder, file]
        const files = captchaFactory.getAllPaths('./res/dataset/')

        let backgroundIndex = 0;
        let overlayIndex = 1;
        while (backgroundIndex < files.length) { // pick every background folder
            for (let backgroundImage of files[backgroundIndex]) { // pick every image in background folder
                while (overlayIndex < files.length) { // loop through every other folder
                    for (let overlayImage of files[overlayIndex]) { // overlay every image in overlay folder
                        await captchaFactory.overlayImages(
                            backgroundImage,
                            overlayImage,
                            0.5,
                            './res/generated/'
                        );
                    }
                    overlayIndex++;
                }
                overlayIndex = backgroundIndex + 1;
            }
            backgroundIndex++;
            overlayIndex = backgroundIndex + 1;
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
