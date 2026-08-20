import { useEffect, useMemo, useState } from "react";
import "./MiniCalendar.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDateForInput = (date) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date) => {
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const sameDate = (dateA, dateB) => {
  if (!dateA || !dateB) return false;

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const isDateBefore = (dateA, dateB) => {
  return startOfDay(dateA).getTime() < startOfDay(dateB).getTime();
};

const isDateAfter = (dateA, dateB) => {
  return startOfDay(dateA).getTime() > startOfDay(dateB).getTime();
};

const getDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = startOfDay(startDate);
  const end = startOfDay(endDate);

  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

function MiniCalendar({
  value = {},
  onChange,
  minDate,
  className = "",
}) {
  const today = startOfDay(new Date());

  const minimumDate = minDate
    ? startOfDay(new Date(minDate))
    : today;

  const initialStartDate = value?.startDate
    ? startOfDay(new Date(value.startDate))
    : null;

  const initialEndDate = value?.endDate
    ? startOfDay(new Date(value.endDate))
    : null;

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [currentMonth, setCurrentMonth] = useState(
    initialStartDate || today
  );

  const [selectingEnd, setSelectingEnd] = useState(
    Boolean(initialStartDate && !initialEndDate)
  );

  const [hoverDate, setHoverDate] = useState(null);

  useEffect(() => {
    const newStartDate = value?.startDate
      ? startOfDay(new Date(value.startDate))
      : null;

    const newEndDate = value?.endDate
      ? startOfDay(new Date(value.endDate))
      : null;

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    if (newStartDate) {
      setCurrentMonth(newStartDate);
    }

    setSelectingEnd(Boolean(newStartDate && !newEndDate));
  }, [value?.startDate, value?.endDate]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Previous month's trailing days
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);

      days.push({
        date,
        currentMonth: false,
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;

    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        currentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );

    const minimumMonth = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      1
    );

    if (previousMonth < minimumMonth) {
      return;
    }

    setCurrentMonth(previousMonth);
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  const handleDateClick = (date) => {
    // Don't allow dates before the minimum allowed date.
    if (isDateBefore(date, minimumDate)) {
      return;
    }

    // First selection
    if (!startDate || !selectingEnd) {
      setStartDate(date);
      setEndDate(null);
      setSelectingEnd(true);
      setHoverDate(null);

      onChange?.({
        startDate: date,
        endDate: null,
        nights: 0,
        days: 0,
      });

      return;
    }

    // If user clicks a date before the selected start,
    // treat that as a new start date.
    if (isDateBefore(date, startDate)) {
      setStartDate(date);
      setEndDate(null);
      setSelectingEnd(true);
      setHoverDate(null);

      onChange?.({
        startDate: date,
        endDate: null,
        nights: 0,
        days: 0,
      });

      return;
    }

    // Second selection
    setEndDate(date);
    setSelectingEnd(false);
    setHoverDate(null);

    const nights = getDaysBetween(startDate, date);
    const days = nights + 1;

    onChange?.({
      startDate,
      endDate: date,
      nights,
      days,
    });
  };

  const isInSelectedRange = (date) => {
    if (!startDate) return false;

    if (endDate) {
      return (
        isDateAfter(date, startDate) &&
        isDateBefore(date, endDate)
      );
    }

    if (selectingEnd && hoverDate) {
      const rangeEnd = isDateAfter(hoverDate, startDate)
        ? hoverDate
        : startDate;

      const rangeStart = isDateAfter(hoverDate, startDate)
        ? startDate
        : hoverDate;

      return (
        isDateAfter(date, rangeStart) &&
        isDateBefore(date, rangeEnd)
      );
    }

    return false;
  };

  const isHoverEnd = (date) => {
    return (
      selectingEnd &&
      hoverDate &&
      sameDate(date, hoverDate)
    );
  };

  const nights = getDaysBetween(startDate, endDate);
  const days = nights > 0 ? nights + 1 : 0;

  return (
    <div className={`mini-calendar ${className}`}>
      <div className="mini-calendar-header">
        <div>
          <span className="mini-calendar-label">
            {selectingEnd
              ? "Select return date"
              : "Select travel dates"}
          </span>

          <div className="mini-calendar-selected">
            <span>
              {startDate
                ? formatDisplayDate(startDate)
                : "Departure"}
            </span>

            <span className="mini-calendar-arrow">
              →
            </span>

            <span>
              {endDate
                ? formatDisplayDate(endDate)
                : "Return"}
            </span>
          </div>
        </div>
      </div>

      <div className="mini-calendar-navigation">
        <button
          type="button"
          className="mini-calendar-nav-button"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>

        <h3>
          {MONTHS[currentMonth.getMonth()]}{" "}
          {currentMonth.getFullYear()}
        </h3>

        <button
          type="button"
          className="mini-calendar-nav-button"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mini-calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mini-calendar-grid">
        {calendarDays.map(
          ({ date, currentMonth: isCurrentMonth }) => {
            const disabled = isDateBefore(
              date,
              minimumDate
            );

            const selectedStart = sameDate(
              date,
              startDate
            );

            const selectedEnd = sameDate(
              date,
              endDate
            );

            const todayDate = sameDate(date, today);

            const inRange = isInSelectedRange(date);

            const hoverEnd = isHoverEnd(date);

            return (
              <button
                key={formatDateForInput(date)}
                type="button"
                disabled={disabled}
                className={[
                  "mini-calendar-day",
                  !isCurrentMonth &&
                    "mini-calendar-day--outside",
                  disabled &&
                    "mini-calendar-day--disabled",
                  todayDate &&
                    "mini-calendar-day--today",
                  selectedStart &&
                    "mini-calendar-day--start",
                  selectedEnd &&
                    "mini-calendar-day--end",
                  inRange &&
                    "mini-calendar-day--range",
                  hoverEnd &&
                    "mini-calendar-day--hover-end",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  handleDateClick(date)
                }
                onMouseEnter={() =>
                  !disabled && setHoverDate(date)
                }
                onMouseLeave={() =>
                  setHoverDate(null)
                }
              >
                <span>{date.getDate()}</span>
              </button>
            );
          }
        )}
      </div>

      {startDate && endDate && (
        <div className="mini-calendar-summary">
          <div>
            <span className="mini-calendar-summary-label">
              Trip duration
            </span>

            <strong>
              {nights} {nights === 1 ? "night" : "nights"}{" "}
              / {days} {days === 1 ? "day" : "days"}
            </strong>
          </div>
        </div>
      )}

      {startDate && !endDate && (
        <div className="mini-calendar-helper">
          Select your return date to complete the trip.
        </div>
      )}
    </div>
  );
}

export default MiniCalendar;