require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize Sequelize with explicit dialect
const sequelize = new Sequelize(
  process.env.DB_NAME,  // Database name
  process.env.DB_USER,  // Database user
  process.env.DB_PASS,  // Database password
  {
    host: process.env.DB_HOST,  // Database host
    dialect: 'mysql',  // Specify MySQL as the database dialect
    logging: false,  // Disable logging for cleaner output
  }
);

// Function to connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1); // Exit process on failure
  }
};

// Export the database connection
module.exports = { sequelize, connectDB };
