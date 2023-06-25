const mongoose = require('mongoose');
const Captcha = require('./models/_captcha');
const CaptchaFactory = require('./captchaFactory')
const captchaFactory = new CaptchaFactory()
const fs = require('fs');

class CaptchaService {

    categories = ['airplane', 'banana', 'baseball', 'beer', 'camel', 'car', 'carrot',
        'cat', 'chair', 'cow', 'donut', 'elephant', 'horse', 'leopard', 'orange',
        'owl', 'panda', 'piano', 'shark', 'train', 'zebra'];

    async initialize() {
        await captchaFactory.generateImagesFromDataset();
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

    getOne() {
        return Captcha.count().then((count) => {
            let random = Math.floor(Math.random() * count)

            return Captcha.findOne().skip(random)
                .then((result) => {
                    let options = this.categories.filter(category => category !== result.answers[0] && category !== result.answers[1]);
                    options = options.sort((a, b) => 0.5 - Math.random());
                    for (let i = 0; i < 6; i++)
                        result.answers.push(options[i]);
                    result.answers = result.answers.sort((a, b) => 0.5 - Math.random());
                    return result;
                })
                .catch((err) => { console.log(err); })
        })
            .catch((err) => { console.log(err); });
    }


    get(id) {
        return Captcha.findById(id)
            .then((result) => {
                let options = this.categories.filter(category => category !== result.answers[0] && category !== result.answers[1]);
                options = options.sort((a, b) => 0.5 - Math.random());
                for (let i = 0; i < 6; i++)
                    result.answers.push(options[i]);
                result.answers = result.answers.sort((a, b) => 0.5 - Math.random());
                return result;
            }).catch((err) => {
                console.log(err);
                throw err;
            });
    }

    getIdList() {
        const idList = []
        return Captcha.find()
            .select('_id')
            .then((list) => {
                for (let obj of list) {
                    idList.push(obj['_id'])
                }

                // write to JSON file
                const json = JSON.stringify(idList);
                fs.writeFileSync('./res/idList.json', json);

                return idList;
            }).catch((err) => {
                console.log(err);
                throw err;
            })
    }

    validate(id, userAnswers) {
        return Captcha.findById(id).select('answers')
            .then((result) => {
                const correctAnswers = result.answers;
                if (userAnswers.length === 2) {
                    const caseOne = userAnswers[0] === correctAnswers[0] && userAnswers[1] === correctAnswers[1];
                    const caseTwo = userAnswers[0] === correctAnswers[1] && userAnswers[1] === correctAnswers[0];
                    return caseOne || caseTwo;
                }
                return false;
            }).catch((err) => {
                console.log(err);
                throw err;
            });
    }
}

module.exports = CaptchaService;
