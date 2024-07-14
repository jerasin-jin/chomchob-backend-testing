const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "user",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        email: {
            type: "varchar",
            // nullable: true
        },
        password: {
            type: "varchar",
        },
        role: {
            type: "varchar",
        },
        created_at: {
            type: "timestamp",
        },
        updated_at: {
            type: "timestamp",
        }
    },
})