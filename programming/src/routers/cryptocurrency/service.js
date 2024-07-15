const { ResponseHandle } = require("../../utils/responseHandler")

const validateCreate = (res, body) => {
    let valid = true
    const { name, symbol, rate } = body;

    if (name == null || symbol == null || rate == null) {
        console.log("ResponseHandle")
        ResponseHandle(res, 400)
        valid = false
    }

    return valid
}

const validateUpdate = (res, body) => {
    let valid = true
    const { name, symbol, rate } = body;

    if (name == null && symbol == null && rate == null) {
        console.log("ResponseHandle")
        ResponseHandle(res, 400)
        valid = false
    }

    return valid
}

const calTotalCryptocurrency = (data) => {
    const result = []

    // console.log("data",data)
    data.forEach((i) => {
        console.log("item", i)

        const index = result.findIndex((x) => x.cryptocurrencyId == i.cryptocurrency.id)

        if (index == -1) {
            result.push({
                cryptocurrencyId: i.cryptocurrency.id,
                totalBalance: i.balance
            })
        } else {
            result[index]["totalBalance"] += i.balance
        }
    })
    return result
}


module.exports = {
    validateCreate,
    validateUpdate,
    calTotalCryptocurrency
}