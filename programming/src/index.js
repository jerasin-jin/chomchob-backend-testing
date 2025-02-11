const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000;
const user = require('./routers/user/index')
const auth = require('./routers/auth/index')
const wallet = require('./routers/wallet/index')
const cryptocurrency = require('./routers/cryptocurrency/index')
const transfer = require('./routers/transfer/index')

const { initDb } = require('./data-source')
const { authMiddleware } = require('./middleware/auth.middleware')
const passport = require("passport");

// setup
app.use(cors());
app.use(express.json());
passport.use(authMiddleware());

initDb().then().catch()


app.use("/user", user);
app.use("/auth", auth);
app.use("/wallet", wallet);
app.use("/cryptocurrency", cryptocurrency);
app.use("/transfer", transfer);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at <http://localhost>:${port}/`);
});