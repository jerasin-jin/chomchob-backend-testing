const { ResponseHandle } = require("../../utils/responseHandler")
const validator = require('validator');

const validateCreate = (res, body) => {
    let valid = true
    const { email, password, role } = body;

    if (email == null || password == null || role == null) {
        console.log("ResponseHandle")
        ResponseHandle(res, 400)
        valid = false
    }

    if (role != "user" && role != "admin") {
        console.log("ResponseHandle role", role)
        ResponseHandle(res, 400, "ROLE_IS_NOT_FOUND")
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
    validateCreate
}