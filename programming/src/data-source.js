const { DataSource } = require("typeorm");
const { createDatabase } = require("typeorm-extension");

const options = {
    type: "mariadb",
    host: "db",
    port: 3306,
    username: "root",
    password: "1234",
    database: "wallet-api",
    synchronize: true,
    entities: [
        require("./entity/userSchema")
    ]
}

const myDataSource = new DataSource(options)

const initDb = async () => {
    try {
        await createDatabase({
            options
        });
        await myDataSource.initialize()
    } catch (error) {
        console.log("initDb error", error)
    }
}



module.exports = { initDb, myDataSource };