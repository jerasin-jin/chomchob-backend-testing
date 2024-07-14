const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000;
const admin = require('./routers/admin/get')
const {initDb} = require('./data-source')


// setup
app.use(cors());
app.use(express.json());

initDb().then().catch()

app.use("/admin",admin);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at <http://localhost>:${port}/`);
});