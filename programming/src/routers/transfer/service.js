const { ResponseHandle } = require("../../utils/responseHandler")

const validateTransfer = (res, body) => {
    let valid = true
    const { senderCryptoId, receiverId, receiverCryptoId, amount } = body;

    if (receiverId == null || senderCryptoId == null || receiverCryptoId == null || amount == null) {
        console.log("ResponseHandle")
        ResponseHandle(res, 400)
        valid = false
    }

    return valid
}



module.exports = {
    validateTransfer,
}