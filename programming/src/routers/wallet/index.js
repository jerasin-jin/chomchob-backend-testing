const routes = require('express').Router();
const { ResponseHandle, ErrorSchema } = require("../../utils/responseHandler")
const { validateCreate, validateUpdate } = require("./service")
const { create, findOne, isExist, updateOneById } = require("../../utils/baseRepository")
const { DbName } = require("../../utils/Constants")
const { authenticateAdminJWT, authenticateUserJWT } = require("../../middleware/auth.middleware")
const { myDataSource } = require("../../data-source")

routes.post("/", authenticateUserJWT, async (req, res) => {
    try {
        const body = req.body
        const headers = req.headers
        const validate = validateCreate(res, body)

        console.log("headers", headers)

        if (!validate) {
            console.log("validate", validate)
            return
        }

        const { cryptocurrency, balance } = body;

        await myDataSource.manager.transaction(async (transactionalEntityManager) => {
            await isExist(DbName.WALLET, {
                where: {
                    cryptocurrency: {
                        id: cryptocurrency
                    }, user: { id: headers.user.id }
                }, relations: { cryptocurrency: true, user: true }
            }, transactionalEntityManager)

            const crypto = await findOne(DbName.CRYPTO, { where: { id: cryptocurrency } },transactionalEntityManager)

            const newBalance = crypto.rate * balance

            await create(DbName.WALLET, { ...body, balance: newBalance, user: headers.user.id }, transactionalEntityManager)
        })

        ResponseHandle(res, 200, { message: "created success" })
    } catch (err) {
        console.log("catch", err)
        ResponseHandle(res, err.statusCode ?? 500, err)
    }
})

routes.put("/:id", authenticateAdminJWT, async (req, res) => {
    try {
        const body = req.body
        const validate = validateUpdate(res, body)
        const { id } = req.params ?? {};

        if (id == null) {
            throw new ErrorSchema("id is required")
        }

        // console.log("headers", headers)

        if (!validate) {
            console.log("validate", validate)
            return
        }

        const { balance, cryptocurrency } = body;

        await myDataSource.manager.transaction(async (transactionalEntityManager) => {
            const wallet = await findOne(DbName.WALLET, {
                where: {
                    cryptocurrency: {
                        id: cryptocurrency
                    }, user: { id }
                }, relations: { cryptocurrency: true, user: true }
            }, transactionalEntityManager)

            console.log("wallet", wallet)

            const newBalance = wallet.cryptocurrency.rate * balance

            console.log("newBalance", newBalance)

            await updateOneById(DbName.WALLET, wallet.id , { balance: newBalance }, transactionalEntityManager)
        })



        ResponseHandle(res, 200, { message: "updated success" })
    } catch (err) {
        console.log("catch", err)
        ResponseHandle(res, err.statusCode ?? 500, err)
    }
})


module.exports = routes;