const { myDataSource } = require("../data-source")
const { ErrorSchema } = require("../utils/responseHandler")

const initData = (payload) => {
    const data = { ...payload }

    return { ...data, created_at: new Date(), updated_at: new Date() }
}



const create = async (dbName, payload) => {
    const data = initData(payload)
    const model = myDataSource.getRepository(dbName)
    await model.save(data)
}

const find = async (dbName, select) => {
    const model = myDataSource.getRepository(dbName)
    console.log("select", { select })
    const result = await model.find({ select })
    return result
}

const findOne = async (dbName, where) => {
    const model = myDataSource.getRepository(dbName)
    console.log("where", { where })
    const result = await model.findOne({ where })

    console.log("result", result)
    if (result == null) {
        throw new ErrorSchema(`${dbName} not found `, 404)
    }

    return result
}

const isExist = async (dbName, where) => {
    const model = myDataSource.getRepository(dbName)
    console.log("where", { where })
    const result = await model.findOne({ where })

    if (result != null) {
        throw new ErrorSchema(`${dbName} is exist `, 400)
    }

    return result
}


module.exports = {
    create,
    find,
    findOne,
    isExist
}