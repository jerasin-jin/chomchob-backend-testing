const routes = require('express').Router();
const { validateTransfer } = require("./service")
const { DbName } = require("../../utils/Constants")
const { authenticateUserJWT } = require("../../middleware/auth.middleware")
const { create, findOne, findOneData, updateOneById } = require("../../utils/baseRepository")
const { ResponseHandle, ErrorSchema } = require("../../utils/responseHandler")
const { myDataSource } = require("../../data-source")


routes.post("/", authenticateUserJWT, async (req, res) => {
    try {
        const body = req.body
        const headers = req.headers
        const validate = validateTransfer(res, body)

        console.log("headers", headers)

        if (!validate) {
            console.log("validate", validate)
            return
        }

        const { receiverId, senderCryptoId, receiverCryptoId, amount } = body;

        await myDataSource.manager.transaction(async (transactionalEntityManager) => {
            const sender = await findOne(DbName.WALLET, {
                where: {
                    cryptocurrency: {
                        id: senderCryptoId
                    }, user: { id: headers.user.id }
                }, relations: { cryptocurrency: true, user: true }
            }, transactionalEntityManager)

            const receiver = await findOneData(DbName.WALLET, {
                where: {
                    cryptocurrency: {
                        id: receiverCryptoId
                    }, user: { id: receiverId }
                }, relations: { cryptocurrency: true, user: true }
            }, transactionalEntityManager)

            if (sender.balance < amount) {
                throw new ErrorSchema("Insufficient balance", 400)
            }

            const senderBalance = sender.balance - amount
            let receiverBalance = null
            if (senderCryptoId == receiverCryptoId) {
                receiverBalance = amount
            } else {
                const crypto = await findOne(DbName.CRYPTO, { where: { id: receiverCryptoId } }, transactionalEntityManager)
                receiverBalance = amount * crypto.rate
            }

            // console.log("newBalance", newBalance)

            if (receiver == null) {
                await create(DbName.WALLET, { balance: receiverBalance, user: receiverId, cryptocurrency: receiverCryptoId }, transactionalEntityManager)
            } else {
                await updateOneById(DbName.WALLET, receiver.id, { balance: receiverBalance + receiver.balance }, transactionalEntityManager)
            }

            await updateOneById(DbName.WALLET, sender.id, { balance: senderBalance }, transactionalEntityManager)
        })

        ResponseHandle(res, 200, { message: "transfer success" })
    } catch (err) {
        console.log("catch", err)
        ResponseHandle(res, err.statusCode ?? 500, err)
    }
})

module.exports = routes;