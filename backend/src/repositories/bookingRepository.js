const db = require("../db/database");

function getBookingsByDate(date) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM bookings WHERE booking_date = ? ORDER BY start_hour",
      [date],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
}

function createBooking(booking) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO bookings (
          booking_date,
          start_hour,
          duration_hours,
          name,
          purpose,
          cancel_token,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        booking.bookingDate,
        booking.startHour,
        booking.durationHours,
        booking.name,
        booking.purpose,
        booking.cancelToken,
        booking.createdAt,
      ],
      function (err) {
        if (err) {
          return reject(err);
        }

        resolve({
          id: this.lastID,
          ...booking,
        });
      }
    );
  });
}

function deleteBookingByToken(token) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM bookings WHERE cancel_token = ?",
      [token],
      function (err) {
        if (err) {
          return reject(err);
        }

        resolve(this.changes > 0);
      }
    );
  });
}

module.exports = {
  getBookingsByDate,
  createBooking,
  deleteBookingByToken,
};