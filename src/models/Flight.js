import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Add .js extension for ESM

const Flight = sequelize.define("Flight", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  flight_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  airline: { type: DataTypes.STRING, allowNull: false },
  source: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  departure_time: { type: DataTypes.DATE, allowNull: false },
  arrival_time: { type: DataTypes.DATE, allowNull: false },
  total_seats: { type: DataTypes.INTEGER, allowNull: false },
  available_seats: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
  },
  date: {
    type: Sequelize.DATE,  // Or Sequelize.DATEONLY if you only need the date
    allowNull: false,      // Set to true if the field is optional
  },
}, {
  tableName: "flights",
  timestamps: false
});

export default Flight;
