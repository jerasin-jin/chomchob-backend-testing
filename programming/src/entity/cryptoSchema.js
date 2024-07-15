const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "cryptocurrency",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            // nullable: true
        },
        symbol: {
            type: "varchar",
        },
        rate: {
            type: "float",
        },
        created_at: {
            type: "timestamp",
        },
        updated_at: {
            type: "timestamp",
        }
    },
})