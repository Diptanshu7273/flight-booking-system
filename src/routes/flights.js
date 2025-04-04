router.get("/search", async (req, res) => {
    try {
      const { source, destination, date } = req.query;
  
      // Ensure `Flight` is defined and connected to DB
      const flights = await Flight.find({
        source,
        destination,
        date
      });
  
      res.json({ success: true, flights });
    } catch (error) {
      res.status(500).json({ message: "Error searching flights", error: error.message });
    }
  });
  