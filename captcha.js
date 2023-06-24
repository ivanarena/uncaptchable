const mongoose = require('mongoose');
const Captcha = require('./models/_captcha');

class CaptchaUtils {
    create() {
        const captcha = new Captcha({
            image: 'base64img',
            answers: ['ans1', 'ans2']
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
