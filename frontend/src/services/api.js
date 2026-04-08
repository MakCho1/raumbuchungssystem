const API_BASE_URL = "http://localhost:3001/api";

export async function fetchDayView(date) {
  const response = await fetch(`${API_BASE_URL}/bookings?date=${date}`);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Tagesansicht.");
  }

  return response.json();
}

export async function createBooking(payload) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Buchung konnte nicht erstellt werden.");
  }

  return data;
}

export async function cancelBooking(token) {
  const response = await fetch(`${API_BASE_URL}/bookings/${token}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Buchung konnte nicht storniert werden.");
  }
  return data;
}
