const routes = require('express').Router();
const { ResponseHandle, ErrorSchema } = require("../../utils/responseHandler")
const { validateCreate } = require("./service")
const { create, find, isExist } = require("../../utils/baseRepository")
const { DbName } = require("../../utils/Constants")
const { authenticateAdminJWT } = require("../../middleware/auth.middleware")
const { myDataSource } = require("../../data-source")
const { hashPassword } = require("../../utils/hashPassword");

routes.get("/", authenticateAdminJWT, async (req, res) => {
    try {
        const field = { id: true, email: true, created_at: true, updated_at: true }
        const users = await find(DbName.USER, { select: field })
        ResponseHandle(res, 200, users)
    } catch (err) {
        console.log("catch", err)
        ResponseHandle(res, err.statusCode ?? 500, err)
    }

})

routes.post("/", async (req, res) => {
    try {
        const body = req.body
        const validate = validateCreate(res, body)

        if (!validate) {
            console.log("validate", validate)
            return
        }

        const { email, password, role } = body;

        await myDataSource.manager.transaction(async (transactionalEntityManager) => {
            await isExist(DbName.USER, { where: { email } }, transactionalEntityManager)
            const newPassword = await hashPassword(password)
            await create(DbName.USER, { email, password: newPassword, role }, transactionalEntityManager)
        })


        ResponseHandle(res, 200, body)
    } catch (err) {
        console.log("catch", err)
        ResponseHandle(res, err.statusCode ?? 500, err)
    }
})


module.exports = routes;