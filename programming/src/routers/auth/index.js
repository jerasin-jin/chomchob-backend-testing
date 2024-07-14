const routes = require('express').Router();
const { findOne } = require("../../utils/baseRepository")
const { DbName } = require("../../utils/Constants")
const bcrypt = require('bcrypt');
const { ResponseHandle, ErrorSchema } = require("../../utils/responseHandler")
const secret = "SecretKey";
const { validateLogin } = require("./service")
const jwt = require("jsonwebtoken")

routes.post("/login", async (req, res) => {
    try {
        const body = req.body
        const validate = validateLogin(res, body)

        if (!validate) {
            console.log("validate", validate)
            return
        }

        const { email, password } = body;
        const user = await findOne(DbName.USER, { email });
        const matchPassword = await bcrypt.compare(password, user?.password);

        if (!matchPassword) {
            ErrorSchema("Authentication Failed", 400)
            return;
        }

        const token = jwt.sign(
            {
                email: user?.email,
                id: user?.id,
                role: user?.role,
            },
            secret,
            { expiresIn: "1h" }
        );

        console.log("token",token)

        ResponseHandle(res,200,{token})
    } catch (err) {
        console.log("catch", err)
        ResponseHandle(res, err.statusCode ?? 500, err)
    }
});


module.exports = routes;