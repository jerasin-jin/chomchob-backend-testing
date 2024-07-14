const { ResponseHandle } = require("../../utils/responseHandler")
const validator = require('validator');

const validateLogin = (res, body) => {
    let valid = true
    const { email, password } = body;

    if (email == null || password == null) {
        console.log("ResponseHandle")
        ResponseHandle(res, 400)
        valid = false
    }

    const isEmail = validator.isEmail(email)
    if (!isEmail) {

        ResponseHandle(res, 400, "EMAIL_IS_NOT_FORMAT")
        valid = isEmail
    }

    return valid
}

module.exports = {
    validateLogin
}