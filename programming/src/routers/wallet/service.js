const { ResponseHandle } = require("../../utils/responseHandler")
const { isExist } = require("../../utils/baseRepository")
const { DbName } = require("../../utils/Constants")

const validateCreate = async (res, body) => {
    let valid = true
    const { balance, cryptocurrency } = body;

    if (balance == null || cryptocurrency == null) {
        console.log("ResponseHandle")
        ResponseHandle(res, 400)
        valid = false
    }

    return valid
}

const validateUpdate = async (res, body) => {
    let valid = true
    const { balance, cryptocurrency } = body;

    if (balance == null && cryptocurrency == null) {
        console.log("ResponseHandle")
        ResponseHandle(res, 400)
        valid = false
    }

    return valid
}

module.exports = {
    validateCreate,
    validateUpdate
}