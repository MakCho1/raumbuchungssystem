const crypto = require("crypto");
const {
  getBookingsByDate,
  createBooking: createBookingRepository,
  deleteBookingByToken,
} = require("../repositories/bookingRepository");

const OPEN = 7;
const CLOSE = 21;

function generateSlots(bookings) {
  const slots = [];

  for (let hour = OPEN; hour < CLOSE; hour += 1) {
    const found = bookings.find((b) => {
      const end = b.start_hour + b.duration_hours;
      return hour >= b.start_hour && hour < end;
    });

    slots.push({
      hour,
      label: `${String(hour).padStart(2, "0")}:00 - ${String(hour + 1).padStart(2, "0")}:00`,
      available: !found,
      booking: found
        ? {
            id: found.id,
            name: found.name,
            purpose: found.purpose,
            startHour: found.start_hour,
            durationHours: found.duration_hours,
            cancelToken: found.cancel_token,
          }
        : null,
    });
  }

  return slots;
}

async function getDayView(date) {
  const bookings = await getBookingsByDate(date);
  const slots = generateSlots(bookings);

  return { date, slots };
}

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function createBooking(data) {
  const bookingDate = data.bookingDate;
  // Datum validieren (nicht Vergangenheit, max. 7 Tage Zukunft)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(bookingDate);
  selectedDate.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  if (selectedDate < today) {
    throw new Error("Buchung darf nicht in der Vergangenheit liegen.");
  }

  if (selectedDate > maxDate) {
    throw new Error("Buchung darf maximal 7 Tage in der Zukunft liegen.");
  }
  const startHour = Number(data.startHour);
  const durationHours = Number(data.durationHours);
  const name = String(data.name || "").trim();
  const purpose = String(data.purpose || "").trim();

  if (!isValidDateString(bookingDate)) {
    throw new Error("Ungültiges Datum.");
  }

  if (!name) {
    throw new Error("Name ist erforderlich.");
  }

  if (!Number.isInteger(startHour) || startHour < OPEN || startHour >= CLOSE) {
    throw new Error("Ungültige Startzeit.");
  }

  if (
    !Number.isInteger(durationHours) ||
    durationHours < 1 ||
    durationHours > 6
  ) {
    throw new Error("Dauer muss zwischen 1 und 6 Stunden liegen.");
  }

  if (startHour + durationHours > CLOSE) {
    throw new Error("Buchung liegt außerhalb der Öffnungszeiten.");
  }

  const existingBookings = await getBookingsByDate(bookingDate);

  const overlaps = existingBookings.some((booking) => {
    const existingStart = booking.start_hour;
    const existingEnd = booking.start_hour + booking.duration_hours;
    const newEnd = startHour + durationHours;

    return startHour < existingEnd && newEnd > existingStart;
  });

  if (overlaps) {
    throw new Error("Der gewählte Zeitraum ist bereits belegt.");
  }

  const booking = {
    bookingDate,
    startHour,
    durationHours,
    name,
    purpose,
    cancelToken: crypto.randomBytes(16).toString("hex"),
    createdAt: new Date().toISOString(),
  };

  return createBookingRepository(booking);
}

async function cancelBookingByToken(token) {
  return await deleteBookingByToken(token);
}

module.exports = {
  getDayView,
  createBooking,
  cancelBookingByToken,
};
