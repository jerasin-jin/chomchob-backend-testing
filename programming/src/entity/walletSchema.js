const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "wallet",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    balance: {
      type: "float",
      precision: 10,
      scale: 2,
    },
    created_at: {
      type: "timestamp",
    },
    updated_at: {
      type: "timestamp",
    },
  },
  relations: {
    user: {
      target: "user",
      type: "many-to-one",
      joinTable: true,
      cascade: true,
      nullable: false,
    },
    cryptocurrency: {
      target: "cryptocurrency",
      type: "many-to-one",
      joinTable: true,
      cascade: true,
      nullable: false,
    },
  },
});
