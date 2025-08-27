import "../styles/calendar.css"

const Calendar = () => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.toLocaleString("default", { month: "long" })
  const currentDate = today.getDate()

  // Get number of days in the current month
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate()

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay()

  // Generate dates array with empty spaces for alignment
  const dates = Array.from({ length: firstDayOfMonth }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
  )

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span className="calendar-title">Calendar</span>
        <span className="calendar-date">
          {currentMonth} {currentYear}
        </span>
      </div>
      <div className="calendar-body">
        <div className="calendar-days">
          {daysOfWeek.map((day, index) => (
            <span key={index} className="day">
              {day}
            </span>
          ))}
        </div>
        <div className="calendar-dates">
          {dates.map((date, index) =>
            date ? (
              <span key={index} className={`date ${date === currentDate ? "highlight" : ""}`}>
                {date}
              </span>
            ) : (
              <span key={index} className="empty-date"></span> // Empty space for alignment
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export { Calendar }
export default Calendar
