const routes = require('express').Router();



routes.get("/test", (req, res) => {
    res.send('Hello World! Test');
})


module.exports = routes;