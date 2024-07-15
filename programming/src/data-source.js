const { DataSource } = require("typeorm");
const { createDatabase } = require("typeorm-extension");
const {hashPassword} = require("./utils/hashPassword");

const options = {
    type: "mariadb",
    host: "db",
    port: 3306,
    username: "root",
    password: "1234",
    database: "wallet-api",
    synchronize: true,
    entities: [
        require("./entity/userSchema"),
        require("./entity/walletSchema"),
        require("./entity/cryptoSchema")
    ]
}

const myDataSource = new DataSource(options)

const initDb = async () => {
    try {
        await createDatabase({
            options
        });
        const myDataSourceInit = await myDataSource.initialize()

        const crypto = myDataSourceInit.getRepository("cryptocurrency")
        const user = myDataSourceInit.getRepository("user")

        const initBath = await crypto.findOne({ where: { name: "Bath" } })

        if (initBath == null) {
            crypto.save({
                "name": "Bath",
                "symbol": "TH",
                "rate": 1,
                created_at: new Date(),
                updated_at: new Date()
            })
        }

        const initBitcoin = await crypto.findOne({ where: { name: "Bitcoin" } })

        if (initBitcoin == null) {
            crypto.save({
                "name": "Bitcoin",
                "symbol": "BTC",
                "rate": 0.678,
                created_at: new Date(),
                updated_at: new Date()
            })
        }

        const userData = await user.find({ where: { role: "user" } })
        if (userData.length == 0) {
            
            user.save({
                email: "test1@gmail.com",
                password: await hashPassword("test"),
                role: "user",
                created_at: new Date(),
                updated_at: new Date()
            })

            user.save({
                email: "test2@gmail.com",
                password: await hashPassword("test"),
                role: "user",
                created_at: new Date(),
                updated_at: new Date()
            })
        }

        const userAdmin = await user.findOne({ where: { role: "admin" } })
        if (userAdmin == null) {
            user.save({
                email: "admin@gmail.com",
                password: await hashPassword("admin"),
                role: "admin",
                created_at: new Date(),
                updated_at: new Date()
            })
        }

    } catch (error) {
        console.log("initDb error", error)
    }
}



module.exports = { initDb, myDataSource };