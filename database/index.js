const { Sequelize, DataTypes } = require("sequelize");

// Store User
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

User.hasMany(UserPayment, { foreignKey: "user_id" });

const UserPayment = sequelize.define("UserPayment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  payment_type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  serial_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

UserPayment.belongsTo(User, { foreignKey: "user_id" });

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  detail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sale_open_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sale_close_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Promotion = sequelize.define("Promotion", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  detail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sale_open_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sale_close_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const RelationPromotion = sequelize.define("RelationPromotion", {
  discount_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Product.belongsToMany(Promotion, {
  through: RelationPromotion,
  foreignKey: "product_id",
});
Promotion.belongsToMany(Product, {
  through: RelationPromotion,
  foreignKey: "promotion_id",
});

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  promotion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  billing_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discount_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Product.hasMany(Transaction, { foreignKey: "product_id" });
Transaction.belongsTo(Product, { foreignKey: "product_id" });
Promotion.hasMany(Transaction, { foreignKey: "promotion_id" });
Transaction.belongsTo(Promotion, { foreignKey: "promotion_id" });

const Billing = sequelize.define("Billing", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  record_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Billing.hasMany(Transaction, { foreignKey: "billing_id" });
Transaction.belongsTo(Billing, { foreignKey: "billing_id" });
