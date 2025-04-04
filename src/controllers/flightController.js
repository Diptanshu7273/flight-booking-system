const Flight = require("../models/Flight");

const getFlights = async (req, res) => {
    try {
      const flights = await Flight.findAll(); // For MongoDB: Flight.find()
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flights", error: error.message });
    }
};

const addFlight = async (req, res) => {
    try {
      const flight = await Flight.create(req.body);
      res.status(201).json(flight);
    } catch (error) {
      res.status(500).json({ message: "Error adding flight", error: error.message });
    }
};

const updateFlight = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      // Check if flight exists
      const flight = await Flight.findByPk(id);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
  
      // Update the flight details
      await flight.update(updateData);
  
      res.json({ message: "Flight updated successfully", flight });
    } catch (error) {
      console.error("Error updating flight:", error);
      res.status(500).json({ message: "Error updating flight", error: error.message });
    }
};

const deleteFlight = async (req, res) => {
    try {
      await Flight.destroy({ where: { id: req.params.id } });
      res.json({ message: "Flight deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting flight", error: error.message });
    }
};

const searchFlights = async (req, res) => {
    try {
      console.log("Received Query Params:", req.query); // Debugging Line
  
      const { source, destination, date } = req.query;
  
      if (!source || !destination || !date) {
        return res.status(400).json({ message: "Missing search parameters" });
      }
  
      const flights = await Flight.findAll({
        where: {
          source: source,
          destination: destination,
          departure_time: {
            [Op.gte]: new Date(date), // Ensure departure is on or after the given date
          },
        },
      });
  
      if (flights.length === 0) {
        return res.status(404).json({ message: "No flights found" });
      }
  
      res.json(flights);
    } catch (error) {
      console.error("Error searching flights:", error);
      res.status(500).json({ message: "Error searching flights", error: error.message });
    }
  };
       

module.exports = { getFlights, addFlight, updateFlight, deleteFlight, searchFlights };
