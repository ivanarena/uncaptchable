const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const captchaSchema = new Schema({
    image: {
        type: Buffer,
        required: true
    },
    answers: {
        type: Array,
        required: true
    }
}, { timestamps: true });


const Captcha = mongoose.model('Captcha', captchaSchema);

module.exports = Captcha;