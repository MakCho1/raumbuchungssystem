import { useEffect, useState } from "react";
import { fetchDayView, createBooking, cancelBooking } from "../services/api";

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function DayViewPage() {
  const [date, setDate] = useState(getTodayDateString());
  const [dayView, setDayView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedHour, setExpandedHour] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    durationHours: 1,
  });
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelToken, setCancelToken] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  async function loadDayView(selectedDate) {
    try {
      setLoading(true);
      setError("");
      const data = await fetchDayView(selectedDate);
      setDayView(data);
    } catch (err) {
      setError(err.message || "Unbekannter Fehler.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDayView(date);
  }, [date]);

  function openBookingForm(hour) {
    setExpandedHour(hour);
    setSubmitError("");
    setCancelMessage("");
    setFormData({
      name: "",
      purpose: "",
      durationHours: 1,
    });
  }

  function closeBookingForm() {
    setExpandedHour(null);
    setSubmitError("");
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "durationHours" ? Number(value) : value,
    }));
  }

  async function handleCancelBooking(token) {
    try {
      setCancelMessage("");

      await cancelBooking(token);

      setCancelMessage("Buchung wurde erfolgreich storniert.");
      setCancelToken("");
      setExpandedHour(null);
      await loadDayView(date);
    } catch (err) {
      setCancelMessage(err.message || "Stornierung fehlgeschlagen.");
    }
  }

  async function handleSubmit(event, startHour) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setSubmitError("");
      setCancelMessage("");

      const result = await createBooking({
        bookingDate: date,
        startHour,
        durationHours: formData.durationHours,
        name: formData.name,
        purpose: formData.purpose,
      });

      setCancelToken(result.cancelToken);

      closeBookingForm();
      await loadDayView(date);
    } catch (err) {
      setSubmitError(err.message || "Buchung konnte nicht erstellt werden.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold">Raumbuchungssystem</h1>
            <p className="text-muted mb-3">Tagesansicht für einen Raum</p>

            {cancelToken && (
              <div className="alert alert-success" role="alert">
                <div className="fw-bold mb-2">Storno-Token</div>
                <div className="small text-break mb-3">{cancelToken}</div>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "Diese Buchung wirklich stornieren?",
                    );
                    if (!confirmed) return;
                    await handleCancelBooking(cancelToken);
                  }}
                >
                  Buchung stornieren
                </button>
              </div>
            )}

            {cancelMessage && (
              <div className="alert alert-info" role="alert">
                {cancelMessage}
              </div>
            )}

            <div className="d-inline-flex align-items-center gap-2">
              <label htmlFor="booking-date" className="form-label mb-0">
                Datum:
              </label>
              <input
                id="booking-date"
                type="date"
                className="form-control"
                style={{ width: "auto" }}
                value={date}
                min={getTodayDateString()}
                max={(() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 7);
                  return d.toISOString().split("T")[0];
                })()}
                onChange={(e) => {
                  setExpandedHour(null);
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>

          {loading && (
            <div className="alert alert-secondary" role="status">
              Lade Daten...
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && dayView && (
            <section>
              {dayView.slots.map((slot) => (
                <div key={slot.hour} className="card mb-3 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">{slot.label}</h5>

                    <p
                      className={`fw-bold ${
                        slot.available ? "text-success" : "text-danger"
                      }`}
                    >
                      Status: {slot.available ? "Frei" : "Belegt"}
                    </p>

                    {!slot.available && slot.booking && (
                      <>
                        <p className="mb-1">Name: {slot.booking.name}</p>
                        <p className="mb-1">
                          Zweck: {slot.booking.purpose || "-"}
                        </p>
                        <p className="mb-2">
                          Dauer: {slot.booking.durationHours} Stunde(n)
                        </p>

                        {slot.booking.cancelToken && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={async () => {
                              const confirmed = window.confirm(
                                "Diese Buchung wirklich stornieren?",
                              );
                              if (!confirmed) return;

                              await handleCancelBooking(
                                slot.booking.cancelToken,
                              );
                            }}
                          >
                            Direkt stornieren
                          </button>
                        )}
                      </>
                    )}

                    {slot.available && expandedHour !== slot.hour && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => openBookingForm(slot.hour)}
                      >
                        Buchen
                      </button>
                    )}

                    {slot.available && expandedHour === slot.hour && (
                      <form
                        onSubmit={(event) => handleSubmit(event, slot.hour)}
                        className="text-start mt-3 border rounded p-3 bg-light"
                      >
                        <div className="mb-3">
                          <label
                            htmlFor={`name-${slot.hour}`}
                            className="form-label"
                          >
                            Name
                          </label>
                          <input
                            id={`name-${slot.hour}`}
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            className="form-control"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor={`purpose-${slot.hour}`}
                            className="form-label"
                          >
                            Zweck
                          </label>
                          <input
                            id={`purpose-${slot.hour}`}
                            name="purpose"
                            type="text"
                            value={formData.purpose}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor={`duration-${slot.hour}`}
                            className="form-label"
                          >
                            Dauer
                          </label>
                          <select
                            id={`duration-${slot.hour}`}
                            name="durationHours"
                            value={formData.durationHours}
                            onChange={handleFormChange}
                            className="form-select"
                          >
                            <option value={1}>1 Stunde</option>
                            <option value={2}>2 Stunden</option>
                            <option value={3}>3 Stunden</option>
                            <option value={4}>4 Stunden</option>
                            <option value={5}>5 Stunden</option>
                            <option value={6}>6 Stunden</option>
                          </select>
                        </div>

                        {submitError && (
                          <div className="alert alert-danger py-2" role="alert">
                            {submitError}
                          </div>
                        )}

                        <div className="d-flex gap-2">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-success"
                          >
                            {submitting
                              ? "Wird gespeichert..."
                              : "Buchung speichern"}
                          </button>

                          <button
                            type="button"
                            onClick={closeBookingForm}
                            disabled={submitting}
                            className="btn btn-outline-secondary"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default DayViewPage;
