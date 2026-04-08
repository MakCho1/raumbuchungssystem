const {
  getDayView,
  createBooking: createBookingService,
  cancelBookingByToken,
} = require("../services/bookingService");

async function getBookings(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "date fehlt" });
    }

    const result = await getDayView(date);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfehler" });
  }
}

async function createBooking(req, res) {
  try {
    const { bookingDate, startHour, durationHours, name, purpose } = req.body;

    const result = await createBookingService({
      bookingDate,
      startHour,
      durationHours,
      name,
      purpose,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: err.message || "Buchung konnte nicht erstellt werden.",
    });
  }
}

async function cancelBooking(req, res) {
  try {
    const { token } = req.params;

    const success = await cancelBookingByToken(token);

    if (!success) {
      return res.status(404).json({ error: "Buchung nicht gefunden." });
    }

    return res.json({ message: "Buchung storniert." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Fehler beim Stornieren." });
  }
}

module.exports = {
  getBookings,
  createBooking,
  cancelBooking,
};