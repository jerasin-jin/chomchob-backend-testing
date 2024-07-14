const ResponseSchema = {
    statusCode: null,
    data: null
}

class ErrorSchema {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

const ResponseHandle = (res,statusCode, data) => {
    const newResponse = { ...ResponseSchema }
    const defaultStatusCode = 200
    console.log("statusCode", statusCode)
    console.log("data", data)

    newResponse.statusCode = statusCode
    newResponse.data = data

    if (newResponse.statusCode == null) {
        newResponse.statusCode = defaultStatusCode
    } else if (newResponse.statusCode == 400 && newResponse.data == null) {
        newResponse.data = {}
        newResponse.data.message = "VALIDATION_ERROR"
    }

    console.log("newResponse.data", newResponse.data)

    if (newResponse.data == null) {
        throw new ErrorSchema("ResponseHandle Required data", 400)
    }

    console.log("newResponse", newResponse)

    res.status(newResponse.statusCode).json(newResponse);
}


module.exports = {
    ErrorSchema,
    ResponseHandle
}