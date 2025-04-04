const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Flight = require("./Flight");
const User = require("./User");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  flightId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'flight_id',
    references: {
      model: Flight,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: "id",
    },
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  selected_seats: { type: DataTypes.STRING, allowNull: false }, 
  bookingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'booking_date'
  },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
},{ timestamps: true });

module.exports = Booking;
