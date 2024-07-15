const { myDataSource } = require("../data-source")
const { ErrorSchema } = require("../utils/responseHandler")

const initData = (payload) => {
    const data = { ...payload }

    return { ...data, created_at: new Date(), updated_at: new Date() }
}



const create = async (dbName, payload, transaction) => {
    let model = null
    const data = initData(payload)

    if (transaction != null) {
        model = transaction.getRepository(dbName)
    } else {
        model = myDataSource.getRepository(dbName)
    }

    console.log("data", data)

    await model.save(data)
}

const find = async (dbName, options, transaction) => {
    const { select, where, relations } = options ?? {}
    let model = null

    if (transaction != null) {
        model = await transaction.getRepository(dbName)
    } else {
        model = myDataSource.getRepository(dbName)
    }

    console.log("select", { select })
    const result = await model.find({ select, where, relations })
    return result
}

const findOne = async (dbName, options, transaction) => {
    const { select, where, relations } = options ?? {}
    let model = null

    if (transaction != null) {
        model = await transaction.getRepository(dbName)
    } else {
        model = myDataSource.getRepository(dbName)
    }

    console.log("where", { where })
    const result = await model.findOne({ select, where, relations })

    console.log("result", result)
    if (result == null) {
        throw new ErrorSchema(`${dbName} not found `, 404)
    }

    return result
}

const findOneData = async (dbName, options, transaction) => {
    const { select, where, relations } = options ?? {}
    let model = null

    if (transaction != null) {
        model = await transaction.getRepository(dbName)
    } else {
        model = myDataSource.getRepository(dbName)
    }

    console.log("where", { where })
    const result = await model.findOne({ select, where, relations })
    return result
}

const updateOneById = async (dbName, id, payload, transaction) => {
    let model = null
    const data = { ...payload, updated_at: new Date() }

    if (transaction != null) {
        model = await transaction.getRepository(dbName)
    } else {
        model = myDataSource.getRepository(dbName).update()
    }
    const result = await model.update({ id }, data)

    console.log("result", result)
    if (result == null) {
        throw new ErrorSchema(`${dbName} not found `, 404)
    }

    return result
}

const isExist = async (dbName, options, transaction) => {
    const { select, where, relations } = options ?? {}
    let model = null

    if (transaction != null) {
        model = await transaction.getRepository(dbName)
    } else {
        model = myDataSource.getRepository(dbName)
    }

    console.log("where", { where })

    const result = await model.findOne({ select, where, relations })

    console.log("isExist result", result)

    if (result != null) {
        throw new ErrorSchema(`${dbName} is exist `, 400)
    }

    return result
}




module.exports = {
    create,
    find,
    findOne,
    isExist,
    initData,
    updateOneById,
    findOneData
}